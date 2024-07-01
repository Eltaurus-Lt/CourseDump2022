//global variables
if (typeof threads !== 'undefined' && threads != []) {
  alert('Script is already executing or has been executed. Retry after reloading...');
  window.location.reload();
}
if (typeof cidds === 'undefined') {var cidds = []}
if (typeof media_queue === 'undefined') {var media_queue = []}
if (typeof batch_size === 'undefined') {var batch_size = 1}
if (typeof batch_done === 'undefined') {var batch_done = 0}

settings['parallel_download_limit'] = 6;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function ciddToURL(cidd) {
  return `https://${cidd['domain']}/community/course/${cidd['cid']}`;
}

async function fetchMeta(cidd) {
  const meta = {
    'url': ciddToURL(cidd),
    'cid': cidd['cid'],
    'proper name': '',
    'thumbnail': '',  
    'url name': cidd['cid'],
    'number of levels': '??',
    'number of items': '??',
    'description': '',
    'author': '',
    'ava': 'https://static.memrise.com/accounts/img/placeholders/empty-avatar-2.png', // -> rnd 1..4
  };

  let course_page;
  try {
    course_page = await fetch(ciddToURL(cidd));
  } catch(err) {
    console.error(`failed to fetch course ${cidd['cid']} html`, err);
  }
  if (!course_page) return meta;

  meta['url name'] = course_page.url.split("/")[6]; // course name from the ending of the url after redirections

  try {
    const parser =  new DOMParser();
    const doc = parser.parseFromString(await course_page.text(), "text/html");

    meta['proper name'] = doc.querySelector('.course-name').innerText;
    meta['thumbnail'] = doc.querySelector('.course-photo img').src;
    meta['number of levels'] = (query => (query ? query.childElementCount : 1))(doc.querySelector('div.levels'));
    meta['description'] = (desc => (desc ? desc.innerText : ""))(doc.querySelector('.course-description.text'));
    meta['author'] = doc.querySelector('.creator-name span').innerText;
    meta['ava'] = doc.querySelector('.creator-image img').src;
    try {
      //only works for courses that have been started, otherwise the info is not present on the page
      meta['number of items'] = parseInt(doc.querySelector('.progress-box-title').innerText.split('/').at(-1).trim(), 10);
    } catch(err) {
      console.log(`course ${cidd['cid']} has not been started, info for 'number of items' unavailable`);
    }
  } catch(err) {
    console.error(`failed to parse course ${cidd['cid']} html`, err);    
  }

	console.log(JSON.stringify(meta));

  return meta;
}

//THE MAIN FUNCTION FOR SCANNING ALL LEVELS OF A COURSE
async function scanCourse(cidd, threadN) {
  //init
  let stopped = false;
  chrome.runtime.onMessage.addListener((arg, sender, sendResponse) => {
    if (arg.type === "coursedump_stopScan") {
      console.log(`cid: ${cidd['cid']} - scanning stopped by user`);
      stopped = true;
    }
  });
  let levels_done = 0;  
  updScanProgress(threadN, cidd, levels_done, "", "");
  const meta = await fetchMeta(cidd);
  await sleep(500);
  updScanProgress(threadN, cidd, levels_done, meta['number of levels'], meta['proper name'] || meta['url name']);

  //scan emulation
  while (levels_done < meta['number of levels'] + 5 && !stopped) {
    await sleep(Math.floor(Math.random() * 500 + 200));
    levels_done++;
    const done_clamped = Math.min(levels_done, meta['number of levels']);
    updScanProgress(threadN, cidd, isNaN(done_clamped) ? levels_done : done_clamped, meta['number of levels']);
  }

  if (stopped) {
    return "stopped";
  } else {
    return "completed";
  }
}

async function scanThread(threadN) {
  let cidd;

  function ciddParse(cidd) {
    try {
      return JSON.parse(cidd);
    } catch (err) {
      return '';
    }
  }

  while (cidd = ciddParse(cidds.pop())) {
    if (cidd['domain'] === tabDomain) {
      // const closeingEvent = ;
      if (await scanCourse(cidd, threadN) === "stopped") {
        console.log(`thread ${threadN} (cid: ${cidd['cid']}) - scanning stopped by user`);
        return "stopped";       
      };
    } else {
      console.log(`${cidd} does not match tab domain ${tabDomain}`);
    }
    batch_done++;
    updBatchProgress(batch_done, batch_size, cidd);
  }

  removeScanBar(threadN);
}


//main execution
(async () => {
  tabDomain = window.location.toString().split("/")[2];
  if (tabDomain !== 'app.memrise.com' && tabDomain !== 'community-courses.memrise.com') {
      alert("The extension should be used on the memrise.com site"); 
      return -1;
  }

  //global scan variables
  batch_size = cidds.length;
  batch_done = 0;
  threads = [];
  media_queue = [];
  const progress_container = progressBarContainer();
  //removing traces of a previous run
  while (progress_container.firstChild) {progress_container.removeChild(progress_container.firstChild);}
  progress_container.classList.remove('stopped'); progress_container.classList.remove('error');
  document.querySelectorAll('div[id^="MemDump_progress-padding"]').forEach(element => {element.remove();});

  for (let threadCounter = 0; threadCounter < settings['parallel_download_limit'] && cidds.length > 0; threadCounter++) {
    // console.log(`new thread started: ${threadCounter} ${settings['parallel_download_limit']} ${cidds.length}`);
    threads.push(scanThread(threadCounter));
  }
  updBatchProgress(batch_done, batch_size);
  const thread_res = await Promise.all(threads);

  if (thread_res.includes("stopped")) {
    console.log("all scanning threads stopped");
    progress_container.classList.add('stopped');
    return "scanning stopped";
  }
  file_queue = [...Array(58).keys()]; //emulation
  console.log('scanning complete');

  await sleep(500);

  //downloading files
  chrome.runtime.onMessage.addListener((arg, sender, sendResponse) => {
    if (arg.type === "coursedump_error") {
      console.log(`an error occured during file download ${arg.url} - ${arg.filename}`);
      console.log(arg.error);
      progress_container.classList.add('error');
    } else if (arg.type === "coursedump_progressMedia_upd") {
      updMediaProgress(arg.done, arg.todo);
    } else if (arg.type === "coursedump_mediaFinished") {
      if (arg.status === "done") {
        updMediaProgress("done");
      } else if (arg.status === "stopped") {
        console.log("stopped during file download");
        progress_container.classList.add('stopped');
      }
      threads = []; //revert state for resetting
    }
  });

  chrome.runtime.sendMessage({
    type: "coursedump_downloadFiles",
    file_queue,
		maxThreads: settings["parallel_download_limit"]
  });

})();

