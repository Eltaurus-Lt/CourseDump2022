const apiTimeout = 25000;
let stopFlag = true;

let ongoingTab = null;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadFile(options) {
	return new Promise(async (resolve, reject) => {
		let iid, deltas = {};
		const onDownloadComplete = delta => {
			if (iid === undefined) {
				deltas[delta.iid] = delta;
			} else if (delta.iid == iid) {
				checkDelta(delta);
			}
		}
		chrome.downloads.onChanged.addListener(onDownloadComplete);
		function checkDelta(delta) {
			if (delta.state && delta.state.current === "complete") {
				chrome.downloads.onChanged.removeListener(onDownloadComplete);
				resolve(delta.iid);
			} else if (delta.error) {
				chrome.downloads.onChanged.removeListener(onDownloadComplete);
				reject(new Error(delta.error.current));
			} else if (delta.state && delta.state.current === "interrupted") {
				chrome.downloads.onChanged.removeListener(onDownloadComplete);
				reject(new Error(delta.state.current));
			}
		}
		const timeId = setTimeout(async () => {
			if (iid !== undefined) return;
			if (options.url) {
				const query = { url: options.url };
				const items = await chrome.downloads.search(query);
				if (items.length) {
					let item = items[0];
					let iid = item.id;
					if (iid in deltas) {
						console.log(`saved with timeout ${options.filename} | item id = ${iid}`);
						checkDelta(deltas[iid]);
					} else if ((item.state && item.state === "complete") || (item.bytesReceived && item.totalBytes && item.bytesReceived === item.totalBytes)) {
						console.log(`saved from log with timeout ${options.filename} | item id = ${iid}`);
						chrome.downloads.onChanged.removeListener(onDownloadComplete);
						resolve(iid);						
					} else {
						console.log(`download timed out on ${options.filename} | item id = ${iid}`);
					}
					return;
				}
			}
			chrome.downloads.onChanged.removeListener(onDownloadComplete);
			reject(new Error("API timeout"));
		}, apiTimeout);
		try {
			iid = await chrome.downloads.download(options);
		} catch (e) {
			chrome.downloads.onChanged.removeListener(onDownloadComplete);
			return reject(e);
		} finally {
			clearTimeout(timeId);
		}
		if (iid in deltas) checkDelta(deltas[iid]);
	});
}


chrome.runtime.onMessage.addListener(async (arg, sender, sendResponse) => {
	//download messages from menu
	if (arg.type === "coursedump_checkOngoing") {
		sendResponse({ "ongoing-status": !!ongoingTab });
		return;
	} else if (arg.type === "coursedump_startDownload") {
		if (ongoingTab) {
			sendResponse({ 'status': "error", 'error': "a download is already in progress" });
			return;
		}
		ongoingTab = arg.tab_id;
		//pass arguments
		chrome.scripting.executeScript({
			target: {tabId: ongoingTab},
			args: [{'cidds': arg.cidds, 'settings': arg.settings}],
			func: vars => Object.assign(self, vars),
		  }, () => {
			//import module
			chrome.scripting.executeScript({
			  target: {tabId: ongoingTab}, 
			  files: ['progressbars.js']},
			  () => {
				//execute scanning script
				chrome.scripting.executeScript({
				  target: {tabId: ongoingTab}, 
				  files: ['dumpcourse.js']}, (scanningFeedback) => {
					//return signal from scanning script
					if (scanningFeedback === "scanning stopped") {
						console.log('BG: all scanning stopped');
						sendResponse({ 'status': "stopped" });
					}
				  }
				);
			  }
			);
		  });
		
		sendResponse({ 'status': "initiated" });
		return;
	} else if (arg.type === "coursedump_stopDownload") {
		if (!ongoingTab) {
			sendResponse({ 'status': "error", 'error': "no downloads in progress" });
			return;
		}
		chrome.tabs.sendMessage(ongoingTab, {
			type: "coursedump_stopScan"
		});
		ongoingTab = null;
		sendResponse({ 'status': "download stopped" });
		return;
	}

	//messages from the scanning script
	const tabId = sender.tab.id;
	if (tabId !== ongoingTab) {
		console.error(`download request from unrecognized tab ${tabId} regected (ongoing download was initiated by tab ${ongoingTab})`);
		return;
	};
	let maxConnections = 5;
	let urls = [];
	if (arg.type === "coursedump_downloadFiles") {
	 	if (arg.file_queue) urls = arg.file_queue;
	 	const todo = urls.length;
	 	if (arg.maxThreads) maxConnections = arg.maxThreads;
	 	console.log(`max threads set to : ${maxConnections}`);
	 	let done = 0;
	 	let pids = Array(maxConnections).fill().map((_, i) => i + 1);
	 	const results = await Promise.allSettled(pids.map(async pid => {
	 		while (ongoingTab && urls.length) {
	 			const [url, filename] = ["some url", "some filename.ext"]; //emu
				const emu = urls.shift();//emu
	 			await sleep(200);
	 			let did;
	 			try {
	 				//did = await downloadFile({url, filename, conflictAction: "overwrite" });
					did = await sleep(Math.floor(Math.random() * 600 + 300)); //emulate download
	 			} catch (e) {
	 				console.error(filename, e);
	 				chrome.tabs.sendMessage(tabId, {
	 					type: "coursedump_error",
	 					error: e.message,
	 					url, filename
	 				});
	 			}
	 			if (did !== undefined) {
	 				await chrome.downloads.erase({ did });
	 			}
	 			done++;
	 			chrome.tabs.sendMessage(tabId, {
	 				type: "coursedump_progressMedia_upd",
	 				done, todo
	 			});
	 		}
	 	}));
		
	 	for (let i = 0; i < results.length; i++) {
	 		const r = results[i];
	 		if (r.status === "rejected") {
	 			console.error(`pid ${i + 1}: ${r.reason}`);
	 		}
	 	}
	
		if (ongoingTab) {
			chrome.tabs.sendMessage(tabId, {
				type: "coursedump_mediaFinished",
				status: "done"
			});
			ongoingTab = null;
		} else {
			chrome.tabs.sendMessage(tabId, {
				type: "coursedump_mediaFinished",
				status: "stopped"
			});
		}
	}
});
