const default_settings = {
  "download_media": true,
  "extra_fields": true,
  "level_tags": true,
  "anki_import_prompt": true,

  "learnable_ids": false,
  "skip_media_download": false,
  "course_metadata": true,

  "max_level_skip": 5,
  "max_extra_fields": 5,
  "parallel_download_limit": 15
};

function extractNumberValue(string, key) {
	const regex = new RegExp(`${key}(\\d+)`);
	const match = string.match(regex);
  
	return match ? match[1] : "";
}
  
function getDomainAndId(url) {
	const cid = extractNumberValue(url, "course_id=") ||
			 extractNumberValue(url, "category_id=") ||
			 extractNumberValue(url, "course/");
	let domain = "";
	if (url.includes("app.memrise.com")) {
	  domain = "app.memrise.com";
	} else if (url.includes("community-courses.memrise.com")) {
	  domain = "community-courses.memrise.com";
	}
	
	return {domain, cid}
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



document.addEventListener('DOMContentLoaded', async () => {
 
  // links
  document.getElementById("link-help").addEventListener('click', () => {
    window.open('https://github.com/Eltaurus-Lt/CourseDump2022?tab=readme-ov-file#memrise-course-dump', '_blank').focus();
  });
  document.getElementById("link-forum").addEventListener('click', () => {
    window.open('https://forums.ankiweb.net/t/an-alternative-to-memrise2anki-support-thread/30084', '_blank').focus();
  });
  document.getElementById("link-ankiweb").addEventListener('click', () => {
    window.open('https://ankiweb.net/shared/info/510199145', '_blank').focus();
  });
  document.getElementById("link-coffee").addEventListener('click', () => {
    window.open('https://buymeacoffee.com/eltaurus', '_blank').focus();
  });

  const current_tab = await getCurrentTab();
  const {domain, cid} = getDomainAndId(current_tab.url);
  const cidd = JSON.stringify({domain, cid});


  const downloadButton = document.getElementById("download-course");
  const BatchAddButton = document.getElementById("batch-add");
  const BatchDownloadButton = document.getElementById("batch-download");
  const BatchViewButton = document.getElementById("batch-view");
  const BatchImportButton = document.getElementById("batch-import");
  const BatchClearButton = document.getElementById("batch-clear");

  async function updateCounters() {
    const queue = await loadFromStorage('queue');
    const count = `${queue.length}`;
    BatchDownloadButton.setAttribute("counter", count);
    BatchViewButton.setAttribute("counter", count);
    BatchClearButton.setAttribute("counter", count);
  }
  
  updateCounters();

  //download buttons
  if (!domain) {
    downloadButton.title = "Has to be used on memrise.com";
    downloadButton.setAttribute("disabled", true);
    BatchAddButton.title = "Needs a course page from memrise.com";
    BatchAddButton.setAttribute("disabled", true);
    BatchDownloadButton.title = "Has to be used from memrise.com";
    BatchDownloadButton.setAttribute("disabled", true);
  } else if (!cid) {
    downloadButton.title = "Needs a specific course to be opened";
    downloadButton.setAttribute("disabled", true);
    BatchAddButton.title = "Needs a course page from memrise.com";
    BatchAddButton.setAttribute("disabled", true);
  } else {
    downloadButton.addEventListener('click', () => {
      chrome.scripting.executeScript({
        target: {tabId: current_tab.id},
        args: [{cidds: [cidd]}],
        func: vars => Object.assign(self, vars),
      }, () => {
        chrome.scripting.executeScript({
          target: {tabId: current_tab.id}, 
          files: ['dumpcourse.js']});
      });
    });
    BatchAddButton.addEventListener('click', async () => {
      const queue = await loadFromStorage('queue');
      const queuetxt = await loadFromStorage('queue-text');
      if (queue.includes(cidd)) {return} //list is supposedly faster than a set, because the number of itmes is small
      if (queue) {
        saveToStorage({'queue': [...queue, cidd]});
      } else {
        saveToStorage({'queue': [cidd]});
      }
      if (queuetxt) {
        saveToStorage({'queue-text': [...queuetxt, current_tab.url]});
      } else {
        saveToStorage({'queue-text': [current_tab.url]});
      }
      updateCounters();
    })
  }

  //batch buttons
  BatchViewButton.addEventListener('click', async (event) => {
    let queue;
    if (event.ctrlKey) {
      queue = await loadFromStorage('queue');
    } else {
      queue = await loadFromStorage('queue-text');
    }
    // let queueTab = window.open("data:text/html, <html contenteditable>","queueTab");
    let queueTab = window.open("data:text/html","queueTab");
    queueTab.document.write(`<html>
      <head><title>Download queue</title></head>
      <body>
      ${queue.join('<br>')}
      </body>
     </html>`);
    queueTab.document.close();
  })

  BatchImportButton.addEventListener('click', async () => {
    const queue = await loadFromStorage('queue');
    if ((queue.length == 0) || confirm("Importing course list will overwrite all currently queued courses.\n Proceed?")) {
      try {
        const pickerOpts = {
          types: [
              {
                  description: "Text files",
                  accept: { "text/plain": [".txt"] },
              },
          ],
          multiple: false
        };      
        const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
        const file = await fileHandle.getFile();
        const content = await file.text();
        lines = content.split('\n');
        const cidds = [];
        const courseList = lines.filter(line => {
          const {domain, cid} = getDomainAndId(line);
          const cidd = JSON.stringify({domain, cid});
          const check = (domain && cid && !cidds.includes(cidd));
          if (check) {
            cidds.push(cidd);
          }
          return check
        });
        saveToStorage({'queue-text': courseList});
        saveToStorage({'queue': cidds});
        updateCounters();
      } catch (error) {
        console.log('Error reading file:', error);
      }
    }
  })

  BatchClearButton.addEventListener('click', async () => {
    if (BatchClearButton.getAttribute("counter") !== '0' && confirm("Clear the list of queued courses?")) {
      saveToStorage({'queue': []});
      saveToStorage({'queue-text': []});
      updateCounters();
    }
  })


  //settings
  const toggleDownloadMedia = document.getElementById("setting-downloadMedia");
  const toggleExtraFields = document.getElementById("setting-extraFields");
  const toggleLevelTags = document.getElementById("setting-levelTags");
  const toggleAnkiPrompt = document.getElementById("setting-ankiPrompt");
  const toggleLearnableIds = document.getElementById("setting-learnableIds");
  const toggleSkipMedia = document.getElementById("setting-skipMedia");
  const toggleCourseMeta = document.getElementById("setting-courseMeta");

  async function settingsFromToggles() {
    let current_settings = {
      "download_media": toggleDownloadMedia.checked,
      "extra_fields": toggleExtraFields.checked,
      "level_tags": toggleLevelTags.checked,
      "anki_import_prompt": toggleAnkiPrompt.checked,
    
      "learnable_ids": toggleLearnableIds.checked,
      "skip_media_download": toggleSkipMedia.checked,
      "course_metadata": toggleCourseMeta.checked
    };

    for (const [setting, default_value] of Object.entries(default_settings)) {
      if (!(setting in current_settings && current_settings[setting] !== 'undefined')) {
        current_settings[setting] = default_value;
      }
    }

    saveToStorage({ 'settings': current_settings});
  }
  
  async function togglesFromSettings() {
    let settings = await loadFromStorage('settings') || default_settings;

    for (const [setting, default_value] of Object.entries(default_settings)) {
      if (!(setting in settings && settings[setting] !== 'undefined')) {
        settings[setting] = default_value;
      }
    }

    toggleDownloadMedia.checked = settings["download_media"];
    toggleExtraFields.checked = settings["extra_fields"];
    toggleLevelTags.checked = settings["level_tags"];
    toggleAnkiPrompt.checked = settings["anki_import_prompt"];
  
    toggleLearnableIds.checked = settings["learnable_ids"];
    toggleSkipMedia.checked = settings["skip_media_download"];
    toggleCourseMeta.checked = settings["course_metadata"];
  }


  togglesFromSettings();


  document.querySelectorAll('input[type="checkbox"].toggle').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      settingsFromToggles();
    });
  });

  document.getElementById("settings-restore").addEventListener('click', async () => {
    if (confirm("Restore default settings?")) {
      saveToStorage({ 'settings': default_settings});
      togglesFromSettings();
    }
  })
});
