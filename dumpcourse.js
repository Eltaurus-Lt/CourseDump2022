//global variables
if (typeof threads !== 'undefined' && threads != []) {alert('Script is already executing');}
if (typeof cidds === 'undefined') {var cidds = []}
if (typeof media_queue === 'undefined') {var media_queue = []}
if (typeof batch_size === 'undefined') {var batch_size = 1}
if (typeof batch_done === 'undefined') {var batch_done = 0}

settings['parallel_download_limit'] = 3;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

//progress bars
function progressBarContainer() {
  const containerId = 'MemDump_progressContainer';

  const existingContainer = document.getElementById(containerId);
  if (existingContainer) return existingContainer;

  const progress_bar_container = document.createElement("div");
  progress_bar_container.id = containerId;

  try {
    document.querySelector(".rebrand-header-root").prepend(progress_bar_container);
  } catch (err) {
    document.body.prepend(progress_bar_container);
  }

  return progress_bar_container;
}

function progressBar(barId) {
  const existingBar = document.getElementById(barId);
  if (existingBar) return existingBar;

  const progress_bar_container = progressBarContainer();
  if (!progress_bar_container) return;

  const progress_bar = document.createElement("div");
  progress_bar.id = barId;
  progress_bar.style.width = "0";
  progress_bar_container.appendChild(progress_bar);

  const padId = 'MemDump_progress-padding-' + barId.split('-').at(-1);
  const existingPad = document.getElementById(padId);
  if (existingPad) return progress_bar;

  const padding_bar = document.createElement("div");
	padding_bar.id = padId;
	try {
		document.querySelector("#page-head").prepend(padding_bar);
	} catch (err) {}

  return progress_bar;
}

function batchProgressBar() {
  if (batch_size < 2) return;
  return progressBar('MemDump_progress-batch');
}

function scanProgressBar(threadN) {
  return progressBar('MemDump_progress-thread-' + threadN);
}

function removeScanBar(threadN) {
  const progress_bar = document.getElementById('MemDump_progress-thread-' + threadN);

  if (progress_bar) {
    progress_bar.style.animationPlayState = "paused";
    setTimeout(()=>{
      void progress_bar.offsetHeight;
      progress_bar.classList.add('off');
      progress_bar.style.animationPlayState = "running";
    }, 500);
  }

  const padding_bar = document.getElementById('MemDump_progress-padding-' + threadN);

  if (padding_bar) {
    padding_bar.style.animationPlayState = "paused";
    setTimeout(()=>{
      void padding_bar.offsetHeight;
      padding_bar.classList.add('off');
      padding_bar.style.animationPlayState = "running";
    }, 500);
  }
}

// function assignMediaProgressBar() {
//   const progress_bar_container = progressBarContainer();
//   return progress_bar_container.querySelector(":last-child") || createnew;//🤔
// }




//THE MAIN FUNCTION FOR SCANNING ALL LEVELS OF A COURSE
async function scanCourse(cidd, threadN) {
  const progress_bar = scanProgressBar(threadN);
  function updScanProgress(progress) {
    if (progress > 0) {
      console.log(`thread: ${threadN} | cid: ${cidd['cid']} | ${progress}%`);
      if (progress_bar) {
        progress_bar.style.width = Math.min(100, Math.round(100. * progress)/100) + "%";
      }
    } else {
      console.log(`thread: ${threadN} | Begin scanning ${cidd['cid']}`);
      if (progress_bar) {
        progress_bar.classList.add('abrupt');
        progress_bar.style.width = "0%";
        setTimeout(()=>{
          progress_bar.classList.remove('abrupt');
        }, 50);
      }
    }
  }

  //init
  let progress = 0;
  progress_bar.setAttribute("course-name", "");
  updScanProgress(progress);

  //scan emulation
  const name = Math.random().toString().slice(2, 7);
  await sleep(1000);
  if (progress_bar) {
    progress_bar.setAttribute("course-name", name);
  }
  while (progress < 100) {
    await sleep(Math.floor(Math.random() * 1000 + 500));
    progress += Math.floor(Math.random() * 20 + 10);
    updScanProgress(progress);
  }
  await sleep(700);

}

function updBatchProgress(cidd) {
  batch_done++;
  console.log(`cid: ${cidd['cid']} | scan complete (${batch_done}/${batch_size})`);
  const batch_progress_bar = batchProgressBar();
  if (!batch_progress_bar) return;
  batch_progress_bar.style.width = Math.min(100, Math.round(10000. * batch_done/batch_size)/100) + "%";
}

async function fetchMeta(ccid) {
  const meta = {};

  return meta;
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
      await scanCourse(cidd, threadN);
    } else {
      console.log(`${cidd} does not match tab domain ${tabDomain}`);
    }
    updBatchProgress(cidd);
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
  progressBarContainer();
  for (let threadCounter = 0; threadCounter < settings['parallel_download_limit'] && cidds.length > 0; threadCounter++) {
    console.log(`new thread started: ${threadCounter} ${settings['parallel_download_limit']} ${cidds.length}`);
    threads.push(scanThread(threadCounter));
  }
  batchProgressBar();
  await Promise.all(threads);
  console.log('all done');
  //mediaProgressBar = assignMediaProgressBar();
  //downloadMedia();
})();