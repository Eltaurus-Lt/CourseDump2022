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

function progressBar(barId, padding = true) {
  const existingBar = document.getElementById(barId);
  if (existingBar) return existingBar;

  const progress_bar_container = progressBarContainer();
  if (!progress_bar_container) return;

  const progress_bar = document.createElement("div");
  progress_bar.id = barId;
  progress_bar_container.appendChild(progress_bar);

  const padId = 'MemDump_progress-padding-' + barId.split('-').at(-1);
  const existingPad = document.getElementById(padId);
  if (!padding || existingPad) return progress_bar;

  const padding_bar = document.createElement("div");
	padding_bar.id = padId;
	try {
		document.querySelector("#page-head").prepend(padding_bar);
	} catch (err) {}

  return progress_bar;
}

function batchProgressBar() {
  if (typeof batch_size === 'undefined' || batch_size < 2) return;
  return progressBar('MemDump_progress-batch');
}

function scanProgressBar(threadN) {
  return progressBar('MemDump_progress-thread-' + threadN);
}

function mediaProgressBar() {
  return progressBar('MemDump_progress-media', false);
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
  const remaining_count = document.querySelectorAll('[id^="MemDump_progress-padding-"]').length;

  if (padding_bar && remaining_count > 1) {
    padding_bar.style.animationPlayState = "paused";
    setTimeout(()=>{
      void padding_bar.offsetHeight;
      padding_bar.classList.add('off');
      padding_bar.style.animationPlayState = "running";
    }, 500);
  }
}

//progress updates (glue)
function updScanProgress(threadN, cidd, levels_done, levels_todo, label = undefined) {
  //text progress (console)
  const done_str = levels_todo !== "" ? `${levels_done}/${levels_todo}` : "";
  if (levels_done === 0) {
    console.log(`thread: ${threadN} | Start scanning ${cidd['cid']}`);
  } else {
    console.log(`thread: ${threadN} | cid: ${cidd['cid']} | progress: ${done_str}`);
  }

  const progress_bar = scanProgressBar(threadN);
  if (!progress_bar) return;

  //GUI progress
  if (label !== undefined) {
    progress_bar.setAttribute("progress-label", label);
  }
  progress_bar.setAttribute("progress-ratio", done_str);
  
  if (levels_todo || label) {
    if (!isNaN(parseInt(levels_todo))) {
      progress_bar.style.backgroundPosition = (100 * (1. - levels_done/levels_todo)).toFixed(2)+"%";
    } else {
      progress_bar.style.backgroundPosition = "42%";
    }
  } else {
    progress_bar.classList.add('resetting');
    progress_bar.style.backgroundPosition = "100%";
    setTimeout(() => {
      progress_bar.classList.remove('resetting');
    }, 320);      
  }
}

function updBatchProgress(batch_done = 0, batch_size = 1, cidd = "") {
  const done_str = `${batch_done}/${batch_size}`;
  if (cidd) {
    console.log(`cid: ${cidd['cid']} | scan complete (${done_str})`);
  }  
  const batch_progress_bar = batchProgressBar();
  if (!batch_progress_bar) return;
  batch_progress_bar.setAttribute("progress-label", "Batch progress");
  batch_progress_bar.setAttribute("progress-ratio", done_str);
  batch_progress_bar.style.backgroundPosition = (100 * (1. - batch_done/batch_size)).toFixed(2)+"%";
}

function updMediaProgress(media_done = 0, media_total = 1) {
  const media_progress_bar = mediaProgressBar();

  if (!media_progress_bar) return;
  if (media_done === "done") {
    console.log('media download complete');
    media_progress_bar.setAttribute("progress-label", "");
    media_progress_bar.setAttribute("progress-ratio", "done!");
    media_progress_bar.classList.add('done');
    return;
  }
  const done_str = `${media_done}/${media_total}`;
  console.log("media download progress: ", done_str);
  media_progress_bar.setAttribute("progress-label", "Downloading files...");
  media_progress_bar.setAttribute("progress-ratio", done_str);
  media_progress_bar.style.backgroundPosition = (100 * (1. - media_done/media_total)).toFixed(2)+"%";
}