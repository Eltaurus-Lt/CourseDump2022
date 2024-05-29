chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ['coursedump2022.js']
	});
});

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const apiTimeout = 5000;

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
					id = items[0].id;
					if (id in deltas) checkDelta(deltas[id]);
					return;
				}
			}
			reject(new Error("API timeout"));
		}, apiTimeout);
		try {
			id = await chrome.downloads.download(options);
		} catch (e) {
			return reject(e);
		} finally {
			clearTimeout(timeId);
		}
		if (id in deltas) checkDelta(deltas[id]);
	});
}

let stopFlag = false;

function stopAll() {
	stopFlag = true;
}

let maxConnections = 15;
let queue = [];

chrome.runtime.onMessage.addListener(async (arg, sender, sendResponse) => {
	if (arg.type == "coursedump_stop") {
		stopAll();
	} else if (arg.type == "coursedump_clear") {
		queue = [];
	} else if (arg.type === "coursedump_add") {
		queue.push(...arg.collection);
	} else if (arg.type === "coursedump_download") {
		stopFlag = false;
		if (arg.collection) queue = arg.collection;
		const total = queue.length;
		if (arg.max) maxConnections = arg.max;
		let done = 0;
		let pids = Array(maxConnections).fill().map((_, i) => i + 1);
		const results = await Promise.allSettled(pids.map(async pid => {
			while (!stopFlag && queue.length) {
				const [url, filename] = queue.shift();
				await sleep(200);
				let id;
				try {
					id = await download({ url, filename });
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
			progress: stopFlag ? "stopped" : "done",
			done, total
		});
	}
});
