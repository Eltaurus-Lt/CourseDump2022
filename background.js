chrome.browserAction.onClicked.addListener(function (tab) {
   chrome.tabs.executeScript(null, { file: "coursedump2022.js" });
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
            await sleep(100);
            var mediaUrl = mediaurls[i][0];
            var saveas = subfolder + `/` + mediaurls[i][1];

            chrome.downloads.download({
               url: mediaUrl,
               filename: saveas
            });
         }
      })()
   });
