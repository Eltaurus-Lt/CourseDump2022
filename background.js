chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ['coursedump2022.js']
	});
});

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function download(options) {
	return new Promise(async (resolve, reject) => {
		try {
			const id = await chrome.downloads.download(options);
			chrome.downloads.onChanged.addListener(function onDownloadComplete(delta) {
				if (delta.id == id) {
					if (delta.state && delta.state.current === 'complete') {
						chrome.downloads.onChanged.removeListener(onDownloadComplete);
						resolve(id);
					} else if (delta.error) {
						chrome.downloads.onChanged.removeListener(onDownloadComplete);
						reject(new Error(delta.error.current));
					} else if (delta.state && delta.state.current === 'interrupted') {
						chrome.downloads.onChanged.removeListener(onDownloadComplete);
						reject(new Error(delta.state.current));
					}
				}
			});
		} catch (e) {
			reject(e);
		}
	});
}

let maxConnections = 10;
let queue;

chrome.runtime.onMessage.addListener(async (arg, sender, sendResponse) => {
	if (arg.type === "coursedump_download") {
		queue = arg.collection;
		const total = queue.length;
		if (arg.max) maxConnections = arg.max;
		let done = 0;
		const results = await Promise.allSettled(Array(maxConnections).fill(0).map(async () => {
			while (queue.length) {
				let url, filename;
				try {
					[url, filename] = queue.shift();
					await sleep(200);
					await download({ url, filename });
				} catch (e) {
					console.error(e, url, filename);
					chrome.tabs.sendMessage(sender.tab.id, {
						type: "coursedump_error",
						error: e.message,
						url, filename
					});
				}
				done++;
				chrome.tabs.sendMessage(sender.tab.id, {
					type: "coursedump_progress_upd",
					progress: "" + Math.floor(10000 * done / total) / 100 + "%",
					done, total
				});
			}
		}));
		for (const result of results) {
			if (result.status === "rejected") {
				console.error(result.reason);
			}
		}
		chrome.tabs.sendMessage(sender.tab.id, {
			type: "coursedump_progress_upd",
			progress: "done"
		});
	}
});
