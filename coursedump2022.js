const ALWAYS_DWLD_MEDIA = false;
const ANKI_HELP_PROMPT = true;
const LEVEL_TAGS = true;
const COLLAPSE_COLUMNS = true;

const MAX_ERR_ABORT = 5;
const MIN_FILENAME_LENGTH = 8;
const LEARNABLE_IDS = false;
const FAKE_DWLD = false;



course = window.location.toString().split("/");
if (course[3] === "course") { 
	id = course[4]; 
	name = course[5];
	saveas = name + `-[` + id +`]`;
} else { alert("Please use the extention on an open Memrise course tab"); throw ''; };


function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function PaddedFilename(url) {
	let temp_filename = url.split("/").slice(-1);
	if (temp_filename[0].length < MIN_FILENAME_LENGTH) {
		temp_filename = name + "_" + url.split("/").slice(-2).join("_");
	};
	return temp_filename;
}

(async function () {
	let err_count = 0;
	let media_asked = false;
	let download_media = false;
	let has_audio = false;
	let has_video = false;
	let has_definitions = false;
	let has_learnable = false;
	let media_download_urls = new Set();
	let table = [];

	if (ALWAYS_DWLD_MEDIA) {
		media_asked = true;
		download_media = true;
	}

	let next = true;
	for (let i = 1; next; i++) {
		console.log(i);
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
			if (!media_asked && response.learnables.find(learnable => { return ( (learnable.screens["1"].audio && learnable.screens["1"].audio.value.length > 0) || (learnable.screens["1"].video && learnable.screens["1"].video.value.length > 0) || (learnable.screens["1"].definition.kind === "audio" && learnable.screens["1"].definition.value.length > 0) ) })) {
				media_asked = true;
				download_media = confirm("Embedded media was detected. Would you like to download it?");
			}

			let level_tag = `"` + name + `"`;
			if (LEVEL_TAGS) {
				try {
					level_tag = `"` + response.session_source_info.name + `::` + ((i < 10) ? (`0` + i) : i) + `_` + response.session_source_info.level_name + `"`;
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
			if (LEARNABLE_IDS) {line.push(row[5])}
			return line.join(`,`);
		} else {return row.join(`,`);}
	}).join("\n") + "\n";


	//downloading the table
	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(result);
	hiddenElement.target = '_blank';
	hiddenElement.download = saveas + '.csv';
	hiddenElement.click();


	//downloading audio and video files
	console.log("media files found: " + media_download_urls.size);
	if (download_media && !FAKE_DWLD) {

		var param = {
			collection: Array.from(media_download_urls).map(url => [url, PaddedFilename(url)]),
			folder: `${saveas}_media`
		};
		chrome.runtime.sendMessage(param);
	}

	//help
	if (ANKI_HELP_PROMPT && confirm('Would you like some help with Anki integration?')) {
		window.open('https://github.com/Eltaurus-Lt/CourseDump2022#importing-into-anki', '_blank').focus();
	};

})();
