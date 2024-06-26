const apiTimeout = 25000;
let stopFlag = true;

const started = new Set();
const stopped = new Set();

chrome.action.onClicked.addListener((tab) => {
	const tabpageId = JSON.stringify([tab.id, tab.url]);
	if (!started.has(tabpageId)) {
		started.add(tabpageId);
		//console.log("pressed on ", tab.id);
		chrome.action.setIcon({
			path: '../icons/stop.png',
			tabId: tab.id
		});
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			files: ['coursedump2022.js']
		});
	} else if (!stopped.has(tabpageId)) {
		stopped.add(tabpageId);
		chrome.tabs.sendMessage(tab.id, {
			type: "coursedump_stop"
		});
		chrome.action.setIcon({
			path: '../icons/reload.png',
			tabId: tab.id
		});		
	} else {
		chrome.tabs.reload(tab.id);
		started.delete(tabpageId);
		stopped.delete(tabpageId);
	}
});

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function download(options) {
	return new Promise(async (resolve, reject) => {
		let id, deltas = {};
		const onDownloadComplete = delta => {
			if (id === undefined) {
				deltas[delta.id] = delta;
			} else if (delta.id == id) {
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
			if (id !== undefined) return;
			if (options.url) {
				const query = { url: options.url };
				const items = await chrome.downloads.search(query);
				if (items.length) {
					let item = items[0];
					let id = item.id;
					if (id in deltas) {
						console.log(`saved with timeout ${options.filename} | id = ${id}`);
						checkDelta(deltas[id]);
					} else if ((item.state && item.state === "complete") || (item.bytesReceived && item.totalBytes && item.bytesReceived === item.totalBytes)) {
						console.log(`saved from log with timeout ${options.filename} | id = ${id}`);
						chrome.downloads.onChanged.removeListener(onDownloadComplete);
						resolve(id);						
					} else {
						console.log(`download timed out on ${options.filename} | id = ${id}`);
					}
					return;
				}
			}
			chrome.downloads.onChanged.removeListener(onDownloadComplete);
			reject(new Error("API timeout"));
		}, apiTimeout);
		try {
			id = await chrome.downloads.download(options);
		} catch (e) {
			chrome.downloads.onChanged.removeListener(onDownloadComplete);
			return reject(e);
		} finally {
			clearTimeout(timeId);
		}
		if (id in deltas) checkDelta(deltas[id]);
	});
}


chrome.runtime.onMessage.addListener(async (arg, sender, sendResponse) => {
	const tabpageId = JSON.stringify([sender.tab.id, sender.tab.url]);
	let urls = [];
	let maxConnections = 5;
	if (arg.type === "coursedump_stopedByContentScript") {
		stopped.add(tabpageId);
	} else if (arg.type === "coursedump_clear") {
		urls = [];
		total = done;
	} else if (arg.type === "coursedump_add") {
		urls.push(...arg.collection);
		total += arg.collection.length;
	} else if (arg.type === "coursedump_download") {
		if (arg.collection) urls = arg.collection;
		const total = urls.length;
		if (arg.maxThreads) maxConnections = arg.maxThreads;
		console.log(`max threads set to : ${maxConnections}`);
		let done = 0;
		let pids = Array(maxConnections).fill().map((_, i) => i + 1);
		const results = await Promise.allSettled(pids.map(async pid => {
			while (!stopped.has(tabpageId) && urls.length) {
				const [url, filename] = urls.shift();
				await sleep(200);
				let id;
				try {
					id = await download({url, filename, conflictAction: "overwrite" });
				} catch (e) {
					console.error(filename, e);
					chrome.tabs.sendMessage(sender.tab.id, {
						type: "coursedump_error",
						error: e.message,
						url, filename
					});
				}
				if (id !== undefined) {
					await chrome.downloads.erase({ id });
				}
				done++;
				chrome.tabs.sendMessage(sender.tab.id, {
					type: "coursedump_progress_upd",
					progress: "" + Math.floor(10000 * done / total) / 100 + "%",
					done, total
				});
			}
		}));
		for (let i = 0; i < results.length; i++) {
			const r = results[i];
			if (r.status === "rejected") {
				console.error(`pid ${i + 1}: ${r.reason}`);
			}
		}
		chrome.tabs.sendMessage(sender.tab.id, {
			type: "coursedump_progress_upd",
			progress: stopped.has(tabpageId) ? "stopped" : "done",
			done, total
		});
		if (!stopped.has(tabpageId)) {
			chrome.action.setIcon({
				path: '../icons/done.png',
				tabId: sender.tab.id
			});
		}
		stopped.add(tabpageId);
	}
});
