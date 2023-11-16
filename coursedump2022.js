//fallback settings
let ALWAYS_DWLD_MEDIA = false,
	ANKI_HELP_PROMPT = true,
	BATCH = false,
	LEVEL_TAGS = true,
	EXTRA_INFO = false,
	COLLAPSE_COLUMNS = true,

	MAX_ERR_ABORT = 5,
	MIN_FILENAME_LENGTH = 8,
	LEARNABLE_IDS = false,
	FAKE_DWLD = false,
	PLAIN_DWLD = false;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


async function CourseDownload(URLString) {
	let course = URLString.split("/");
	let id, name;

	if (course[4] === "course") { 
		id = course[5]; 
		name = course[6];

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
			let pad = url.split("/").slice(-2)[0];
			if (pad === 'medium') {pad = url.split("/").slice(-3)[0].replaceAll('%','_')};
			temp_filename = name + "_" + pad + "_" + url.split("/").slice(-1).join("_");
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
	let meta = fetch('https://app.memrise.com/community/course/' + id )
	    .then(response => response.text())
	    .then(html => {
	        var parser = new DOMParser();
	        var doc = parser.parseFromString(html, "text/html");
		levelsN     = (query => (query ? query.childElementCount : 1))(doc.querySelector('div.levels'));
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
	console.log("course: ", propName);
	console.log("about: ", description);
	console.log("by: ", author);
	console.log("ava ", ava);
	console.log("icon ", courseImg);
	console.log("number of levels: ", levelsN);
	
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
	let has_extras1 = false;
	let has_extras2 = false;
	let has_extras3 = false;
	let has_extras4 = false;
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
			response = await (await fetch("https://app.memrise.com/v1.19/learning_sessions/preview/", {
				"headers": { "Accept": "*/*", "Content-Type": "Application/json", "X-CSRFToken": token },
				"body": "{\"session_source_id\":" + id + ",\"session_source_type\":\"course_id_and_level_index\",\"session_source_sub_index\":" + i + "}",
				"method": "POST"
			})).json();
			// Continue after empty set
			if (response.code == "PREVIEW_DOESNT_LOAD") {
				empty_set_err = true;
			}
			// Check for media
			if (!media_asked && !BATCH && 
				response.learnables.find(learnable => { return ( 
					(learnable.screens["1"].audio && learnable.screens["1"].audio.value.length > 0) || 
					(learnable.screens["1"].video && learnable.screens["1"].video.value.length > 0) || 
					(learnable.screens["1"].definition.kind === "audio" && learnable.screens["1"].definition.value.length > 0) ||
					(learnable.screens["1"].definition.kind === "image" && learnable.screens["1"].definition.value.length > 0) ||
					(learnable.screens["1"].item.kind === "image" && learnable.screens["1"].item.value.length > 0) 
				)}	)) {
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
				} else if (download_media && learnable.screens["1"].item.kind === "image" && learnable.screens["1"].item.value.length > 0) { 
					has_learnable = true;
					let temp_image_learns = [];
					learnable.screens["1"].item.value.map(image_learn => {temp_image_learns.push(image_learn)});
					temp_image_learns.forEach(media_download_urls.add, media_download_urls);
					learnable_el = `"` + temp_image_learns.map(url => `<img src='${PaddedFilename(url)}'>`).join(``) + `"`;
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
				} else if (download_media && learnable.screens["1"].definition.kind === "image" && learnable.screens["1"].definition.value.length > 0) {
					has_definitions = true;
					let temp_image_defs = [];
					learnable.screens["1"].definition.value.map(image_def => {temp_image_defs.push(image_def)});
					temp_image_defs.forEach(media_download_urls.add, media_download_urls);
					definition = `"` + temp_image_defs.map(url => `<img src='${PaddedFilename(url)}'>`).join(``) + `"`;
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
				
				//tags
				row.push(level_tag);
				
				//extra data
				//	attr[0]: 686844 - SS; 1995282 - PoS;
				let temp_extra1 = ``;
				if (EXTRA_INFO && learnable.screens["1"].attributes && learnable.screens["1"].attributes.length > 0 && learnable.screens["1"].attributes[0] && learnable.screens["1"].attributes[0].value) {
					has_extras1 = true;
					temp_extra1 = learnable.screens["1"].attributes[0].value;
				}
				row.push(`"` + temp_extra1 + `"`);

				//	visible_info[0]: 548340 - kana; 6197256 - syn; 2021373+2021381 - lit trans/pinyin;
				let temp_extra2 = ``;
				if (EXTRA_INFO && learnable.screens["1"].visible_info && learnable.screens["1"].visible_info.length > 0 && learnable.screens["1"].visible_info[0] && learnable.screens["1"].visible_info[0].value) {
					has_extras2 = true;
					temp_extra2 = learnable.screens["1"].visible_info[0].value;
				}

				//	visible_info[1]: 2021373+2021381 - pinyin;
				let temp_extra3 = ``;
				if (EXTRA_INFO && learnable.screens["1"].visible_info && learnable.screens["1"].visible_info.length > 1 && learnable.screens["1"].visible_info[1] && learnable.screens["1"].visible_info[1].value) {
					has_extras3 = true;
					temp_extra3 = learnable.screens["1"].visible_info[1].value;

					row.push(`"` + temp_extra3 + `"`); row.push(`"` + temp_extra2 + `"`);
				} else {
					row.push(`"` + temp_extra2 + `"`); row.push(`"` + temp_extra3 + `"`);
				}

				//	hidden_info[0]: 1995282 - inflections;
				let temp_extra4 = ``;
				if (EXTRA_INFO && learnable.screens["1"].hidden_info && learnable.screens["1"].hidden_info.length > 0 && learnable.screens["1"].hidden_info[0] && learnable.screens["1"].hidden_info[0].value) {
					has_extras4 = true;
					temp_extra4 = learnable.screens["1"].hidden_info[0].value;
				}
				row.push(`"` + temp_extra4 + `"`);


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
			//console.log(error);
			console.log('Level does not exist or has no learnable words. Level skip count: ' + (err_count + 1));
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
			if (has_extras1) {line.push(row[5])};
			if (has_extras2) {line.push(row[6])};
			if (has_extras3) {line.push(row[7])};
			if (has_extras4) {line.push(row[8])};
			if (LEARNABLE_IDS) {line.push(row[9])}
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
	if (ANKI_HELP_PROMPT && !BATCH && confirm('Would you like some help with importing the downloaded data into Anki?')) {
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

	//overwrite settings with settings from json file
	if (true) {
		await fetch(chrome.runtime.getURL('settings.json'))
		.then(response => response.json()).then(settings => {
			try {
				ALWAYS_DWLD_MEDIA = settings.user_settings.always_download_media;
				ANKI_HELP_PROMPT = settings.user_settings.display_anki_help_prompt;
				BATCH = settings.user_settings.batch_download;
				LEVEL_TAGS = settings.user_settings.level_tags;
				EXTRA_INFO = settings.user_settings.extra_info;
				COLLAPSE_COLUMNS = settings.user_settings.collapse_columns;

				LEARNABLE_IDS = settings.extra_settings.learnable_ids;
				PLAIN_DWLD = settings.extra_settings.exclude_course_metadata;
				FAKE_DWLD = settings.extra_settings.skip_media_download;

				MAX_ERR_ABORT = settings.basic_settings.max_level_skip;
				MIN_FILENAME_LENGTH = settings.basic_settings.min_filename_length;

				//console.log(MIN_FILENAME_LENGTH);
			} catch (err) {console.log('overwriting settings error')};
		}
		).catch(error => {
			console.error('Error reading settings.json:', error);
		});
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
