const default_settings = {
  "download_media": true,
  "extra_fields": true,
  "level_tags": true,
  "anki_import_prompt": true,

  "learnable_ids": false,
  "skip_media_download": false,
  "course_metadata": true,

  "videofiles_limit": 'Infinity',

  "max_level_skip": 5,
  "max_extra_fields": 10, //attributes/ visible info/ hidden info - each
  "parallel_download_limit": 9
};

const messages = {
  "not memrise course": "Has to be used on a memrise.com course page",
  "not memrise": "Has to be used from memrise.com",
  "not a course": "Has to be used from a specific course page",
  "already downloading": "A download is already in progress",

  //confirms
  "import queue": "Importing course list will overwrite all currently queued courses.\n Proceed?",
  "restore settings": "Restore default settings?"
}

class menuButtons {
  constructor () {
    this.Download = document.getElementById("download-course");
    this.Stop = document.getElementById("stop-download");
    this.BatchAdd = document.getElementById("batch-add");
    this.BatchDownload = document.getElementById("batch-download");
    this.BatchView = document.getElementById("batch-view");
    this.BatchImport = document.getElementById("batch-import");
    this.BatchClear = document.getElementById("batch-clear");
  }
}

class menuToggles {
  constructor() {
    this.DownloadMedia = document.getElementById("setting-downloadMedia");
    this.ExtraFields = document.getElementById("setting-extraFields");
    this.LevelTags = document.getElementById("setting-levelTags");
    this.AnkiPrompt = document.getElementById("setting-ankiPrompt");
    this.LearnableIds = document.getElementById("setting-learnableIds");
    this.SkipMedia = document.getElementById("setting-skipMedia");
    this.CourseMeta = document.getElementById("setting-courseMeta");
  
    this.Video = document.getElementById("setting-videoFiles");

    this.all = document.querySelectorAll('input[type="checkbox"].toggle');
  }

  async toSettings() {
    let current_settings = {
      "download_media": this.DownloadMedia.checked,
      "extra_fields": this.ExtraFields.checked,
      "level_tags": this.LevelTags.checked,
      "anki_import_prompt": this.AnkiPrompt.checked,
    
      "learnable_ids": this.LearnableIds.checked,
      "skip_media_download": this.SkipMedia.checked,
      "course_metadata": this.CourseMeta.checked,

      "videofiles_limit": this.Video.checked ? 'Infinity' : 0
    };

    for (const [setting, default_value] of Object.entries(default_settings)) {
      if (!(setting in current_settings && current_settings[setting] !== 'undefined')) {
        current_settings[setting] = default_value;
      }
    }

    saveToStorage({ 'settings': current_settings });
  }
  
  async fromSettings() {
    const settings = await loadSettings();

    this.DownloadMedia.checked = settings["download_media"];
    this.ExtraFields.checked = settings["extra_fields"];
    this.LevelTags.checked = settings["level_tags"];
    this.AnkiPrompt.checked = settings["anki_import_prompt"];
  
    this.LearnableIds.checked = settings["learnable_ids"];
    this.SkipMedia.checked = settings["skip_media_download"];
    this.CourseMeta.checked = settings["course_metadata"];

    this.Video.checked = (settings["videofiles_limit"] > 0);
  }
}

function extractNumericValue(string, key) {
	const regex = new RegExp(`${key}(\\d+)`);
	const match = string.match(regex);
  
	return match ? match[1] : "";
}
  
function getDomainAndId(url) {
	const cid = extractNumericValue(url, "course_id=") ||
			 extractNumericValue(url, "category_id=") ||
			 extractNumericValue(url, "course/");
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

async function loadSettings() {
  let settings = await loadFromStorage('settings') || default_settings;

  //initiate if accessed for the first time or a new setting is added
  let upd = false;
  for (const [setting, default_value] of Object.entries(default_settings)) {
    if (!(setting in settings && settings[setting] !== 'undefined')) {
      settings[setting] = default_value;
      upd = true;
    }
  }
  if (upd) {saveToStorage({ settings });}
  
  return settings;
}

async function loadQueue(text = false) {
  let queue = await loadFromStorage(`queue${text ? '-text' : ''}`);

  //initiate queues if accessed for the first time
  if (!queue) {
    queue = [];
    saveToStorage({ 'queue': [] });
    saveToStorage({ 'queue-text': [] });
  }

  return queue;
}

document.addEventListener('DOMContentLoaded', () => {setTimeout(async () => {
 
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

  //initiate download through message to the BG script
  async function downloadCourses(cidds) {
    const settings = await loadSettings();

    chrome.runtime.sendMessage({
        type: "coursedump_startDownload",
        tab_id: current_tab.id,
        settings,
        cidd_strings: cidds
      }, (response) => {
        console.log(response);
        if (response.status === "error") {
          alert(response.msg);
        }
        // updOngoingStatus();
      }
    );

   // window.close();
  }

  const buttons = new menuButtons();

  async function updCounters() {
    const queue = await loadQueue();
    const count = `${queue.length}`;
    buttons.BatchDownload.setAttribute("counter", count);
    buttons.BatchView.setAttribute("counter", count);
    buttons.BatchClear.setAttribute("counter", count);
  }

  async function addToQueue() {
    const queue = await loadQueue();
    const queuetxt = await loadQueue(true);
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
    updCounters();
  }

  function updOngoingStatus() {  
    chrome.runtime.sendMessage({
      type: "coursedump_checkOngoing"
    }, (response) => {
      document.body.setAttribute("data-ongoing-download", response['ongoing-status']);
      if (response['ongoing-status'] && buttons.BatchDownload.title === "") {
        buttons.BatchDownload.title = messages["already downloading"];
      }
      if (!response['ongoing-status'] && buttons.BatchDownload.title === messages["already downloading"]) {
        buttons.BatchDownload.title = "";
      }
      buttons.Stop.removeAttribute('disabled');
    });
  }

  updCounters();
  updOngoingStatus();

  //messages from background
  chrome.runtime.onMessage.addListener(async (arg, sender, sendResponse) => {
    if (arg.type === "coursedump_alert") {
        alert(arg.msg);
        updOngoingStatus();
    } else if (arg.type === "coursedump_updateOngoings") {
      updOngoingStatus();
    }
  });

  //stop button
  buttons.Stop.addEventListener('click', () => {
    buttons.Stop.setAttribute('disabled', true);
    chrome.runtime.sendMessage({
        type: "coursedump_stopDownload",
      }, (response) => {
        console.log(response);
        if (response.status === "error") {
          alert(response.msg);
        }
        //updOngoingStatus();
      }
    );
  });

  //download and add buttons
  if (!domain) {
    buttons.Download.title = messages["not memrise course"];
    buttons.BatchAdd.title = messages["not memrise course"];
    buttons.BatchDownload.title = messages["not memrise"];
  } else {
    if (!cid) {
      buttons.Download.title = messages["not a course"];
      buttons.BatchAdd.title = messages["not a course"];
    } else {
      buttons.Download.removeAttribute('disabled');
      buttons.Download.addEventListener('click', () => {
        if (document.body.getAttribute("data-ongoing-download") !== "true") {
          downloadCourses([cidd]);
        }
      });

      buttons.BatchAdd.removeAttribute('disabled');
      buttons.BatchAdd.addEventListener('click', addToQueue);
    }

    buttons.BatchDownload.removeAttribute('disabled');
    buttons.BatchDownload.addEventListener('click', async () => {
      const cidds = await loadQueue();
      if (cidds && cidds.length > 0 && document.body.getAttribute("data-ongoing-download") !== "true") {
        downloadCourses(cidds);
      }
    });
  }

  //other batch buttons
  buttons.BatchView.addEventListener('click', async (event) => {
    const queue = await loadQueue(!event.ctrlKey);

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

  buttons.BatchImport.addEventListener('click', async () => {
    const queue = await loadQueue();
    if ((queue.length == 0) || confirm(messages["import queue"])) {
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
        const lines = content.split('\n');
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
        updCounters();
      } catch (error) {
        console.log('Error reading file:', error);
      }
    }
  })

  buttons.BatchClear.addEventListener('click', async () => {
    if (buttons.BatchClear.getAttribute("counter") !== '0' && confirm("Clear the list of queued courses?")) {
      saveToStorage({'queue': []});
      saveToStorage({'queue-text': []});
      updCounters();
    }
  })


  //settings
  const toggles = new menuToggles();

  toggles.fromSettings();
  //turn toggle animations on
  setTimeout(()=>document.querySelector('body').classList.add('animated'), 100);// awaiting above doesn't help (due to additional delay in css processing?)

  toggles.all.forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      toggles.toSettings();
    });
  });

  document.getElementById("settings-restore").addEventListener('click', async () => {
    if (confirm("Restore default settings?")) {
      saveToStorage({ 'settings': default_settings});
      toggles.fromSettings();
    }
  })

}, 100)});
