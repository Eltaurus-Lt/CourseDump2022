const ALWAYS_DWLD_MEDIA = false;
const ANKI_HELP_PROMPT = true;
const BATCH = false;
const LEVEL_TAGS = true;
const EXTRA_INFO = false;
const COLLAPSE_COLUMNS = true;

const MAX_ERR_ABORT = 5;
const MIN_FILENAME_LENGTH = 8;
const LEARNABLE_IDS = false;
const FAKE_DWLD = false;
const PLAIN_DWLD = false;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


async function CourseDownload(URLString) {
	let course = URLString.split("/");
	let id, name;

	if (course[3] === "course") { 
		id = course[4]; 
		name = course[5];

		let scanprogress = document.createElement("div");
		scanprogress.className = "scanprogress cid" + id;
			scanprogress.style.width = 0;
		progressbar.append(scanprogress);
		
	} else { 
		if (!BATCH) {
			alert("Please use the extention on an open Memrise course tab"); 
		} else {
			console.log('"' + URLString + '" in queue.txt is not a Memrise course url');
		}
		return -1; 
	};

	function PaddedFilename(url) {
		let temp_filename = url.split("/").slice(-1);
		if (temp_filename[0].length < MIN_FILENAME_LENGTH) {
			temp_filename = name + "_" + url.split("/").slice(-2).join("_");
		};
		return temp_filename;
	}


//------------------------------------------Fetching course metadata
	let description = '';
	let author = '';
	let ava = 'https://static.memrise.com/accounts/img/placeholders/empty-avatar-2.png'; // -> rnd 1..4
	let propName = '';
	let courseImg = '';
	let levelsN = 0;
	try {
	let meta = fetch('https://app.memrise.com/course/' + id )
	    .then(response => response.text())
	    .then(html => {
	        var parser = new DOMParser();
	        var doc = parser.parseFromString(html, "text/html");
		levelsN     = doc.querySelector('div.levels').childElementCount;
		author      = doc.querySelector('.creator-name span').innerText;
		ava         = doc.querySelector('.creator-image img').src;
		propName    = doc.querySelector('.course-name').innerText;
		courseImg   = doc.querySelector('.course-photo img').src;
		description = doc.querySelector('.course-description.text').innerText;
	    })
	    .catch(function(err) {  
	        console.log('Failed to fetch html: ', err);  
	});
	await meta;
	
	} catch (err) {}
	console.log(description);
	console.log(author);
	console.log(ava);
	console.log(propName);
	console.log(courseImg);
	console.log(levelsN);
	
	//choosing names and queueing meta
	let saveas, subfolder;
	if (PLAIN_DWLD) {
		saveas = name + ` by ` + author + ` [` + id +`]`; //general name for csv and media folder 
		subfolder = ``;
	} else {
		saveas = name + ` [` + id +`]`; //general name for csv and media folder
		subfolder = name + ` by ` + author + ` [` + id +`]/`;
		let info;
		info = 'data:md/plain;charset=utf-8,' + encodeURIComponent( 
			`# **` + propName + `**\n` + 
			`### by _` + author + `_\n` +
			`\n` + 
			description
		);

		download_queue.push([info, subfolder + 'info.md']);
		download_queue.push([ava, subfolder + author + '.' + ava.split(".").slice(-1)]);
		download_queue.push([courseImg, subfolder + name + '.' + courseImg.split(".").slice(-1)]);
	}


//------------------------------------------Fetching level data	
	let err_count = 0;
	let media_asked = false;
	let download_media = false;
	let has_audio = false;
	let has_video = false;
	let has_extras = false;
	let has_definitions = false;
	let has_learnable = false;
	let media_download_urls = new Set();
	let table = [];

	if (ALWAYS_DWLD_MEDIA) {
		media_asked = true;
		download_media = true;
	}


	let next = true;
	for (let i = 1; next || i <= levelsN; i++) {
		//marking scanprogress
		console.log("[" + name + "] scanning level " + i + "...");
		document.querySelector('.scanprogress.cid' + id).style.width = Math.min(100, Math.round(10000. * i / (levelsN + MAX_ERR_ABORT/2))/100) + "%";
		
		let empty_set_err = false;
		try {
			await sleep(200);
			// get CSRF header
			token = document.cookie.split(" ").find(cookie => cookie.includes("csrftoken")).split(/[=;]/g)[1];
			response = await (await fetch("https://app.memrise.com/v1.18/learning_sessions/preview/", {
				"headers": { "Accept": "*/*", "Content-Type": "Application/json", "X-CSRFToken": token },
				"body": "{\"session_source_id\":" + id + ",\"session_source_type\":\"course_id_and_level_index\",\"session_source_sub_index\":" + i + "}",
				"method": "POST"
			})).json();
			// Continue after empty set
			if (response.code == "PREVIEW_DOESNT_LOAD") {
				empty_set_err = true;
			}
			// Check for media
			if (!media_asked && !BATCH && response.learnables.find(learnable => { return ( (learnable.screens["1"].audio && learnable.screens["1"].audio.value.length > 0) || (learnable.screens["1"].video && learnable.screens["1"].video.value.length > 0) || (learnable.screens["1"].definition.kind === "audio" && learnable.screens["1"].definition.value.length > 0) ) })) {
				media_asked = true;
				download_media = confirm("Embedded media was detected. Would you like to download it?");
			}
			if (BATCH) {download_media = ALWAYS_DWLD_MEDIA};

			let level_tag = `"` + name + `"`;
			if (LEVEL_TAGS) {
				try {
					level_tag = `"` + response.session_source_info.name.replaceAll('"', '""') + `::` + ((i < 10) ? (`0` + i) : i) + `_` + response.session_source_info.level_name.replaceAll('"', '""') + `"`;
				} catch (error) {console.log(`${error.name}: ${error.message}`);}
				level_tag = level_tag.replaceAll(' ','_');
			}


			// Creating the table and queueing media files
			response.learnables.map(learnable => {

				let row = [];

				//learning elements
				let learnable_el = `""`;
				if (learnable.learning_element) {
					has_learnable = true;
					learnable_el = `"${learnable.learning_element.replaceAll('"', '""')}"`;
				}
				row.push(learnable_el);

				//definitions
				let definition = `""`;
				if (learnable.definition_element) {
					has_definitions = true;
					definition = `"${learnable.definition_element.replaceAll('"', '""')}"`;
				} else if (download_media && learnable.screens["1"].definition.kind === "audio" && learnable.screens["1"].definition.value.length > 0) {
					has_definitions = true;
					let temp_audio_defs = [];
					learnable.screens["1"].definition.value.map(audio_def => {temp_audio_defs.push(audio_def.normal)});
					temp_audio_defs.forEach(media_download_urls.add, media_download_urls);
					definition = `"` + temp_audio_defs.map(url => `[sound:${PaddedFilename(url)}]`).join("") + `"`;
				}
				row.push(definition);

				//audio
				let temp_audio_urls = [];
				if (download_media && learnable.screens["1"].audio && learnable.screens["1"].audio.value.length > 0) {
					has_audio = true;
					learnable.screens["1"].audio.value.map(audio_item => {temp_audio_urls.push(audio_item.normal)});
					temp_audio_urls.forEach(media_download_urls.add, media_download_urls);
				}
				row.push(`"` + temp_audio_urls.map(url => `[sound:${PaddedFilename(url)}]`).join("") + `"`);

				//video
				let temp_video_urls = [];
				if (download_media && learnable.screens["1"].video && learnable.screens["1"].video.value.length > 0) {
					has_video = true;
					learnable.screens["1"].video.value.map(video_item => {temp_video_urls.push(video_item)});
					temp_video_urls.forEach(media_download_urls.add, media_download_urls);
				}
				row.push(`"` + temp_video_urls.map(url => `[sound:${PaddedFilename(url)}]`).join("") + `"`);
				
				row.push(level_tag);

				let temp_extra = "";
				if (EXTRA_INFO && learnable.screens["1"].visible_info && learnable.screens["1"].visible_info.length > 0) {
					has_extras = true;
					temp_extra = `"` + learnable.screens["1"].visible_info[0].value + `"`;
				}
				row.push(temp_extra);

				if (LEARNABLE_IDS) {
					try {
						row.push(learnable.id);
					} catch (error) {
						console.log(`no learnable id! ${error.name}: ${error.message}`);
						row.push(-1);
					}
				}

				table.push(row);
			});

			err_count = 0;
		} catch (error) {
			console.log(error);
			console.log(err_count + 1);
			if (empty_set_err) continue;
			err_count++;
			if (err_count >= MAX_ERR_ABORT) {
				next = false;
			}
		}
	}


	//table to text conversion (global flags has_audio/has_video are needed since different number of cells in csv rows causes problems for Anki import)
	let result = table.map(row => {
		if (COLLAPSE_COLUMNS) {
			let line = [];
			if (has_learnable) {line.push(row[0])};
			if (has_definitions) {line.push(row[1])};
			if (has_audio) {line.push(row[2])};
			if (has_video) {line.push(row[3])};
			if (LEVEL_TAGS) {line.push(row[4])};
			if (has_extras) {line.push(row[5])};
			if (LEARNABLE_IDS) {line.push(row[6])}
			return line.join(`,`);
		} else {return row.join(`,`);}
	}).join("\n") + "\n";

	//downloading the table
	let csvdata = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(result);
	if (PLAIN_DWLD) {
		var downloadElement = document.createElement('a');
		downloadElement.target = '_blank';
		downloadElement.href = csvdata;
		downloadElement.download = saveas + '.csv';
		downloadElement.click();
	} else {
		download_queue.push([csvdata, subfolder + saveas + '.csv']);
	}

	//appending files to media download queue
	if (download_media) {console.log("[" + name + "] media files found: " + media_download_urls.size)};	
	if (!FAKE_DWLD) {
		let media_batch = Array.from(media_download_urls).map(url => [url, `${subfolder}${saveas}_media(${media_download_urls.size})/` + PaddedFilename(url)]);
		download_queue.push(...media_batch);
	} 
};


function mediaDownload(all_downloads) {
	
	let dwldprogress = document.createElement("div");
	dwldprogress.id = "downprogress";
		dwldprogress.style.width = 0;
	document.querySelector('.scanprogress').append(dwldprogress);

	chrome.runtime.sendMessage({
		type: "coursedump_download",
		collection: all_downloads
	});

	//help
	if (ANKI_HELP_PROMPT && !BATCH && confirm('Would you like some help with Anki integration?')) {
		window.open('https://github.com/Eltaurus-Lt/CourseDump2022#importing-into-anki', '_blank').focus();
	};
}



//------MAIN
let progressbar;
progressbar = document.getElementById('dumpprogress');
if (!progressbar) {
	progressbar = document.createElement("div");	
	progressbar.id = "dumpprogress";
	progresspadding = document.createElement("div");	
	progresspadding.id = "progresspadding";
	try {
		document.querySelector(".rebrand-header-root").prepend(progressbar);
		document.querySelector("#page-head").prepend(progresspadding);
	} catch (err) {
		document.body.prepend(progressbar);
	}
//	document.getElementById('header').prepend(progressbar);
}
let download_queue = [];

chrome.runtime.onMessage.addListener(
   function (arg, sender, sendResponse) {
      var type = arg.type;
      var prog = arg.progress;
	if (type === "coursedump_progress_upd") {
		if (prog === "done") {
			progressbar.className = "done";
		} else { 
			console.log(prog + " media queued");
			document.getElementById("downprogress").style.width = prog;
		}
	}
});


(async function(){
	let currentUrl = window.location.toString();
	if (currentUrl.split("/")[2] !== 'app.memrise.com') {
		alert("The extension should be used on the memrise.com site"); 
		return -1;
	}
	
	if (BATCH) {
		await fetch(chrome.runtime.getURL('queue.txt')).then(
				(response) => {
					return response.text().then(
					async (text) => {
						await Promise.all(text.split("\n").map(
						async (queueline) => {
							console.log("downloading " + queueline);
							await CourseDownload(queueline);
						}));
						progressbar.className = "halfdone";
						mediaDownload(download_queue);
					});				
				}
	);
	} else {
		if (await CourseDownload(currentUrl) != -1) {
			mediaDownload(download_queue);
		}
	}
})()