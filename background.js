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
					chrome.downloads.onChanged.removeListener(onDownloadComplete);
					if (delta.state && delta.state.current === 'complete') {
						resolve();
					} else if (delta.error) {
						reject(new Error(delta.error.current));
					} else {
						reject(new Error(delta.state ? delta.state.current : "unknown"));
					}
				}
			});
		} catch (e) {
			reject(e);
		}
	});
}

chrome.runtime.onMessage.addListener((arg, sender, sendResponse) => {
	if (arg.type === "coursedump_download") {
		const queue = arg.collection;
		(async function () {
			const total = queue.length;
			const max = 5;
			let done = 0;
			await new Promise((resolve, _) => {
				async function start() {
					if (!queue.length) return;
					const [url, filename] = queue.shift();
					try {
						await download(url, filename);
					} catch (e) {
						console.error(e);
						chrome.tabs.sendMessage(sender.tab.id, {
							type: "coursedump_error",
							error: e.message
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
				for (let i = 0; i < max; i++) {
					start();
				}
			});
			chrome.tabs.sendMessage(sender.tab.id, {
				type: "coursedump_progress_upd",
				progress: "done"
			});
		})();
	}
});
