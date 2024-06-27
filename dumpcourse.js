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
        progress_bar.classList.add('resetting');
        progress_bar.style.width = "0%";
        setTimeout(() => {
          progress_bar.classList.remove('resetting');
        }, 500);
      }
    }
  }

  //init
  let progress = 0;
  progress_bar.setAttribute("progress-text", "");
  updScanProgress(progress);

  //scan emulation
  const name = Math.random().toString().slice(2, 7);
  await sleep(1000);
  if (progress_bar) {
    progress_bar.setAttribute("progress-text", name);
  }
  while (progress < 100) {
    await sleep(Math.floor(Math.random() * 1000 + 500));
    progress += Math.floor(Math.random() * 20 + 10);
    updScanProgress(progress);
  }
  await sleep(700);

}

function updBatchProgress(cidd) {
  const done_str = `${batch_done}/${batch_size}`;
  if (cidd) {
    console.log(`cid: ${cidd['cid']} | scan complete (${done_str})`);
  }  
  const batch_progress_bar = batchProgressBar();
  if (!batch_progress_bar) return;
  batch_progress_bar.setAttribute("progress-text", done_str);
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
    batch_done++;
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
  updBatchProgress("");
  await Promise.all(threads);
  console.log('all done');
  //mediaProgressBar = assignMediaProgressBar();
  //downloadMedia();
})();