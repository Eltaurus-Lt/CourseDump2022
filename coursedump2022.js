
const MAX_ERR_ABORT = 5;


course = window.location.toString().split("/");
if (course[3] === "course") { 
	id = course[4]; 
	name = course[5];
} else { alert("Please use the extention on an open Memrise course tab"); throw ''; };


function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

(async function () {
	let err_count = 0;
	let media_asked = false;
	let download_media = false;
	let has_audio = false;
	let has_video = false;
	let media_download_urls = [];
	let table = [];

	let next = true;
	for (let i = 1; next; i++) {
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
			if (!media_asked && response.learnables.find(learnable => { return ( (learnable.screens["1"].audio && learnable.screens["1"].audio.value.length > 0) || (learnable.screens["1"].video && learnable.screens["1"].video.value.length > 0) ) })) {
				media_asked = true;
				download_media = confirm("Embedded media was detected. Would you like to download it?");
			}


			// Creating the table and queueing media files
			response.learnables.map(learnable => {

				let row = [`"${learnable.learning_element.replace('"', '""')}"`,`"${learnable.definition_element.replace('"', '""')}"`];

				//audio
				let temp_audio_urls = [];
				if (download_media && learnable.screens["1"].audio && learnable.screens["1"].audio.value.length > 0) {
					has_audio = true;
					learnable.screens["1"].audio.value.map(audio_item => {temp_audio_urls.push(audio_item.normal)});
					media_download_urls.push(...temp_audio_urls);
				}
				row.push(`"` + temp_audio_urls.map(url => `[sound:${url.split("/").slice(-1)}]`).join("") + `"`);

				//video
				let temp_video_urls = [];
				if (download_media && learnable.screens["1"].video && learnable.screens["1"].video.value.length > 0) {
					has_video = true;
					learnable.screens["1"].video.value.map(video_item => {temp_video_urls.push(video_item)});
					media_download_urls.push(...temp_video_urls);
				}
				row.push(`"` + temp_video_urls.map(url => `[sound:${url.split("/").slice(-1)}]`).join("") + `"`);
					
				table.push(row);
			});

			err_count = 0;
		} catch (error) {
			console.log(error);
			console.log(err_count);
			if (empty_set_err) continue;
			err_count++;
			if (err_count >= MAX_ERR_ABORT) {
				next = false;
			}
		}
	}


	//table to text conversion (global flags has_audio/has_video are needed since different number of cells in csv rows causes problems for Anki import)
	let result = table.map(row => {
		let line = row[0] + `,` + row[1];
		if (has_audio) {line += `,` + row[2]}
		if (has_video) {line += `,` + row[3]}
		return line;
	}).join("\n") + "\n";


	//downloading the table
	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(result);
	hiddenElement.target = '_blank';
	hiddenElement.download = name + '.csv';
	hiddenElement.click();

	//downloading audio and video files
	console.log(media_download_urls.length);
	if (download_media) {

		var param = {
			collection: media_download_urls,
			folder: `${name}_media`
		};
		chrome.runtime.sendMessage(param);
	}

	//help
	if (confirm('Would you like some help with Anki integration?')) {
		window.open('https://github.com/Eltaurus-Lt/CourseDump2022#importing-in-anki', '_blank').focus();
	};

})();
