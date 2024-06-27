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
  if (typeof batch_size === 'undefined' || batch_size < 2) return;
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

// function assignMediaProgressBar() {
//   const progress_bar_container = progressBarContainer();
//   return progress_bar_container.querySelector(":last-child") || createnew;//🤔
// }
