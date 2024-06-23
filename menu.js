function extractNumberValue(string, key) {
	const regex = new RegExp(`${key}(\\d+)`);
	const match = string.match(regex);
  
	return match ? match[1] : "";
}
  
function getDomainAndId(url) {
	const id = extractNumberValue(url, "course_id=") ||
			 extractNumberValue(url, "category_id=") ||
			 extractNumberValue(url, "course/");
	let domain = "";
	if (url.includes("app.memrise.com")) {
	  domain = "app.memrise.com";
	} else if (url.includes("community-courses.memrise.com")) {
	  domain = "community-courses.memrise.com";
	}
	
	return {domain, id}
}  

async function getCurrentTab() {
  try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      return tab;
  } catch (error) {
      console.error(error);
  }
}

function saveToStorage(data) {
  chrome.storage.local.set(data);
}

async function loadFromStorage(obj) {
  return new Promise((resolve) => {
      chrome.storage.local.get([obj], (result) => {
          resolve(result[obj]);
      });
  });
}

document.addEventListener('DOMContentLoaded', async function () {
 
  // links
  document.getElementById("link-help").addEventListener('click', function () {
    window.open('https://github.com/Eltaurus-Lt/CourseDump2022?tab=readme-ov-file#memrise-course-dump', '_blank').focus();
  });
  document.getElementById("link-forum").addEventListener('click', function () {
    window.open('https://forums.ankiweb.net/t/an-alternative-to-memrise2anki-support-thread/30084', '_blank').focus();
  });
  document.getElementById("link-ankiweb").addEventListener('click', function () {
    window.open('https://ankiweb.net/shared/info/510199145', '_blank').focus();
  });
  document.getElementById("link-coffee").addEventListener('click', function () {
    window.open('https://buymeacoffee.com/eltaurus', '_blank').focus();
  });

  const current_tab = await getCurrentTab();
  const {domain, id} = getDomainAndId(current_tab.url);


  const downloadButton = document.getElementById("download-course");
  const BatchAddButton = document.getElementById("batch-add");
  const BatchDownloadButton = document.getElementById("batch-download");
  const BatchViewButton = document.getElementById("batch-view");
  const BatchClearButton = document.getElementById("batch-clear");

  async function updateCounters() {
    const queue = await loadFromStorage('queue');
    const count = `${queue.length}`;
    BatchDownloadButton.setAttribute("counter", count);
    BatchViewButton.setAttribute("counter", count);
  }
  
  updateCounters();

  //download buttons
  if (!domain) {
    downloadButton.title = "Has to be used from memrise.com";
    downloadButton.setAttribute("disabled", true);
    BatchAddButton.title = "Needs a course page from memrise.com";
    BatchAddButton.setAttribute("disabled", true);
    BatchDownloadButton.title = "Has to be used from memrise.com";
    BatchDownloadButton.setAttribute("disabled", true);
  } else if (!id) {
    downloadButton.title = "Needs a specific course to be opened";
    downloadButton.setAttribute("disabled", true);
    BatchAddButton.title = "Needs a course page from memrise.com";
    BatchAddButton.setAttribute("disabled", true);
  } else {
    downloadButton.addEventListener('click', () => {
      chrome.scripting.executeScript({
        target: {tabId: current_tab.id},
        args: [{cUrl: current_tab.url}],
        func: vars => Object.assign(self, vars),
      }, () => {
        chrome.scripting.executeScript({
          target: {tabId: current_tab.id}, 
          files: ['alert.js']});
      });
    });
    BatchAddButton.addEventListener('click', async () => {
      const queue = await loadFromStorage('queue');
      saveToStorage({'queue': [...queue, current_tab.url]});
      updateCounters();
    })
  }

  BatchViewButton.addEventListener('click', async () => {
    const queue = await loadFromStorage('queue');
    alert(queue);
  })

  BatchClearButton.addEventListener('click', async () => {
    saveToStorage({'queue': []});
    updateCounters();
  })


  //batch buttons

  // document.getElementById('export').addEventListener('click', async () => {
//     try {
//       const textToWrite = '42!';
//       const fileHandle = await window.showSaveFilePicker();
//       const writable = await fileHandle.createWritable();
//       await writable.write(textToWrite);
//       await writable.close();
//       console.log('Text written successfully!');
//     } catch (error) {
//       alert('Error writing text:', error);
//     }
//   });
});
