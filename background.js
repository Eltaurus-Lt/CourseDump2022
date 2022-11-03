chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['coursedump2022.js']
  });
});

function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

chrome.runtime.onMessage.addListener(
   function (arg, sender, sendResponse) {
      var type = arg.type;
      var mediaurls = arg.collection;

	if (type === "coursedump_download") {
	      (async function () {
	         for (i in mediaurls) {
	            await sleep(200);
	            var mediaUrl = mediaurls[i][0];
	            var saveas = mediaurls[i][1];

	            chrome.downloads.download({
	               url: mediaUrl,
	               filename: saveas
	            });

		    chrome.tabs.sendMessage(sender.tab.id, {
		        type: "coursedump_progress_upd",
		        progress: "" + Math.round((10000 + 10000. * i) / mediaurls.length)/100 + "%"
		    });


        	 }

		chrome.tabs.sendMessage(sender.tab.id, {
		    type: "coursedump_progress_upd",
		    progress: "done"
		});

	      })()
	}
   });