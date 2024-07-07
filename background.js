const apiTimeout = 25000;
let ongoingTab = null;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadFile(options) {
	return new Promise(async (resolve, reject) => {
		let iid, deltas = {};
		const onDownloadComplete = delta => {
			if (iid === undefined) {
				deltas[delta.id] = delta;
			} else if (delta.id == iid) {
				checkDelta(delta);
			}
		}
		chrome.downloads.onChanged.addListener(onDownloadComplete);
		function checkDelta(delta) {
			if (delta.state && delta.state.current === "complete") {
				chrome.downloads.onChanged.removeListener(onDownloadComplete);
				resolve(delta.id);
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
		} catch (err) {
			chrome.downloads.onChanged.removeListener(onDownloadComplete);
			return reject(err);
		} finally {
			clearTimeout(timeId);
		}
		if (iid in deltas) checkDelta(deltas[iid]);
	});
}

async function menuAlert(msg, decline_msg = "") {
	await sleep(400);
	chrome.runtime.sendMessage({ 
		type: "coursedump_alert", 
		msg
	}).catch(err=>{
		if (decline_msg) {
			console.log(decline_msg);
		}
	});
}

function updAllMenus() {
	chrome.runtime.sendMessage({ 
		type: "coursedump_updateOngoings" 
	}).catch(err=>{});		
}

function ciddsParse(cidd_strings) {
    try {
		return cidd_strings.map(cidd_string => JSON.parse(cidd_string));
    } catch (err) {
		console.error("Error parsing cidd strings: ", err);
		return [];
    }
}

chrome.runtime.onMessage.addListener(async (arg, sender, sendResponse) => {
	//messages from menu
	if (arg.type === "coursedump_checkOngoing") {
		sendResponse({ "ongoing-status": !!ongoingTab });
		return;
	} else if (arg.type === "coursedump_startDownload") {
		if (ongoingTab) {
			sendResponse({ status: "error", msg: "A download is already in progress in another tab" });
			return;
		}
		ongoingTab = arg.tab_id;
		updAllMenus();
		//pass arguments
		chrome.scripting.executeScript({
			target: {tabId: ongoingTab},
			args: [{'cidds': ciddsParse(arg.cidd_strings), 'settings': arg.settings}],
			func: vars => Object.assign(self, vars),
		}, () => {
			//import module
			chrome.scripting.executeScript({
				target: {tabId: ongoingTab}, 
				files: ['progressbars.js']
			}, () => {
					// run scanning script
					chrome.scripting.executeScript({
						target: {tabId: ongoingTab}, 
						files: ['coursescan.js']},
						(scanningFeedback) => {
							if (chrome.runtime.lastError) {
								console.log('Downloading tab was closed'); //during scan phase
								ongoingTab = null;
								menuAlert("Scanning tab was closed. Download terminated",
									"no open menus left, download termination alert was not sent");
								updAllMenus();
							}
							//console.log('scanning script callback', scanningFeedback);
							//return signal from the scanning script
							if (scanningFeedback?.[0]?.result === "scanning unauthorised") {
								console.log('User not logged in. Download terminated');
								ongoingTab = null;
								updAllMenus();
							} else if (scanningFeedback?.[0]?.result === "scanning stopped") {
								console.log('Download stopped by user during scanning phase');
								updAllMenus();
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
			sendResponse({ status: "error", msg: "No downloads in progress" });
			updAllMenus();
			return;
		}
		chrome.tabs.sendMessage(ongoingTab, {
			type: "coursedump_stopScan"
		}).then(re => {
			console.log("stop scanning signal went through");
		}).catch(err => {
			console.log("Downloading tab no longer exists - no scanning to stop");
		});

		ongoingTab = null;
		console.log("bg stopped");
		//updAllMenus();
		sendResponse({ status: "stop signals sent" });
		return;
	}

	//messages from the scanning script
	const tabId = sender.tab.id;
	if (tabId !== ongoingTab) {
		console.warn(`download request from ${tabId} rejected - ongoing download was initiated by ${ongoingTab}`);
		menuAlert("File download request from a conflicting tab received and rejected");
		return;
	};
	let maxConnections = 5;
	let urls = [];
	if (arg.type === "coursedump_downloadFiles") {
		let terminated = false;
	 	if (arg.file_queue) urls = arg.file_queue;
	 	const todo = urls.length;
	 	if (arg.maxThreads) maxConnections = arg.maxThreads;
	 	console.log(`max threads set to : ${maxConnections}`);
	 	let done = 0;
	 	let pids = Array(maxConnections).fill().map((_, i) => i + 1);
	 	const results = await Promise.allSettled(pids.map(async pid => {
	 		while (ongoingTab && urls.length) {
	 			// const [url, filename] = ["some url", "some filename.ext"]; //emu
				// const emu = urls.shift();//emu
				const [url, filename] = urls.shift();
	 			await sleep(200);
	 			let did;
	 			try {
	 				did = await downloadFile({url, filename, conflictAction: "overwrite" });
					//did = await sleep(Math.floor(Math.random() * 600 + 300)); //emulate download
	 			} catch (err) {
	 				console.error(filename, err);
					chrome.tabs.sendMessage(tabId, {
						type: "coursedump_error",
						error: err.message,
						url, filename
					}).catch(err => {});
	 			}
	 			if (did !== undefined) {
	 				await chrome.downloads.erase({ id: did });
	 			}
	 			done++;
				chrome.tabs.sendMessage(tabId, {
					type: "coursedump_progressMedia_upd",
					done, todo
				}).catch(err => {
					console.warn(err);
					if (err.message.includes('Could not establish connection. Receiving end does not exist.')) {
						console.log('Downloading tab appears to be closed. terminating file download.');
						terminated = true;
						ongoingTab = null;
					}
				})
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
			}).catch(err => {});
			ongoingTab = null;
		} else {
			if (!terminated) {
				console.log('Download stopped by user during file downloading phase');
			} else {
				console.log('Downloading tab was closed during file downloading phase');
				menuAlert("Downloading tab was closed. Download terminated",
					"no open menus left, download termination alert was not sent");
			}
			chrome.tabs.sendMessage(tabId, {
				type: "coursedump_mediaFinished",
				status: "stopped"
			}).catch(err => {});
		}
		updAllMenus();
	}
});
