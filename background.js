chrome.browserAction.onClicked.addListener(function (tab) {
   chrome.tabs.executeScript(null, { file: "coursedump2022.js" });
});
chrome.runtime.onMessage.addListener(
   function (arg, sender, sendResponse) {
      var mediaurls = arg.collection;
      var subfolder = arg.folder;

      for (i in mediaurls) {
         var mediaUrl = mediaurls[i];
         var saveas = subfolder + `/${mediaUrl.split("/").slice(-1)}`;

         chrome.downloads.download({
            url: mediaUrl,
            filename: saveas
         });
      }
   });