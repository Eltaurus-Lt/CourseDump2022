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

async function getCurrentTabUrl() {
  try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      return tab.url;
  } catch (error) {
      console.error(error);
  }
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

  const tab_url = await getCurrentTabUrl();
  const {domain, id} = getDomainAndId(tab_url);

  const downloadButton = document.getElementById("download-course");
  const BatchAddButton = document.getElementById("batch-add");
  const BatchDownloadButton = document.getElementById("batch-download");
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
    downloadButton.addEventListener('click', function () {
      alert(tab_url);
    });
  }

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
