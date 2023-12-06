chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ['coursedump2022.js']
	});
});

function download(url, filename) {
	return new Promise(async (resolve, reject) => {
		try {
			const downloadId = await chrome.downloads.download({
				url: url,
				filename: filename
			});
			chrome.downloads.onChanged.addListener(function onDownloadComplete(delta) {
				if (delta.id == downloadId) {
					if (delta.state && delta.state.current === 'complete') {
						chrome.downloads.onChanged.removeListener(onDownloadComplete);
						resolve();
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

chrome.runtime.onMessage.addListener((arg, sender, sendResponse) => {
	if (arg.type === "coursedump_download") {
		queue = arg.collection;
		(async function () {
			const total = queue.length;
			if (arg.max) maxConnections = arg.max;
			let done = 0;
			await new Promise((resolve, _) => {
				for (let i = 0; i < maxConnections; i++) {
					start();
				}
				async function start() {
					if (!queue.length) return;
					const [url, filename] = queue.shift();
					try {
						await download(url, filename);
					} catch (e) {
						console.error(e, url, filename);
						chrome.tabs.sendMessage(sender.tab.id, {
							type: "coursedump_error",
							error: e.message,
							url: url,
							filename: filename
						});
					}
					done++;
					chrome.tabs.sendMessage(sender.tab.id, {
						type: "coursedump_progress_upd",
						progress: "" + Math.floor(10000 * done / total) / 100 + "%",
						done: done,
						total: total
					});
					if (done == total) {
						resolve();
					} else if (queue.length) {
						start();
					}
				}
			});
			chrome.tabs.sendMessage(sender.tab.id, {
				type: "coursedump_progress_upd",
				progress: "done"
			});
		})();
	}
});
