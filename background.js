chrome.browserAction.onClicked.addListener(function(tab) {
   chrome.tabs.executeScript(null, {file: "coursedump2022.js"});
});