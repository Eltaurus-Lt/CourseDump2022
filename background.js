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
      var mediaurls = arg.collection;
      var subfolder = arg.folder;
      (async function () {
         for (i in mediaurls) {
            await sleep(200);
            var mediaUrl = mediaurls[i][0];
            var saveas = mediaurls[i][1];

            chrome.downloads.download({
               url: mediaUrl,
               filename: saveas
            });
         }
      })()
   });