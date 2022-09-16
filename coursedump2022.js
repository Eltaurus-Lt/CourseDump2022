let media_asked = false;
let download_media = false;
let anki_media = false;
let media_urls = [];
let url = window.location.toString();
let id;
const MAX_ERR_ABORT = 5;
course = url.split("/");
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
if (course[3] === "course") { id = course[4]; } else { alert("Please go to a Memrise course page first"); throw ''; };

next = true;

//based on the script by baroxyton
//https://gist.github.com/baroxyton/01a53533ff49a62b5a94dd8b26f38d31
result = "";
(async function () {
	let err_count = 0;
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
			if(!media_asked && response.learnables.find(learnable=>{return (learnable.screens["1"].audio||learnable.screens["1"].video)})){
				media_asked = true;
				
				const enable_downloads = confirm("Embedded media was detected. Would you like to download it?");
				if(enable_downloads){
					download_media = true;
					if(confirm("Would you like to intergrate the media with Anki?")){
						anki_media = true;
					}
				}
			}
			// Escape double quotes and commas
			result += response.learnables.map(learnable =>{
				let mediaUrl;
				if(download_media){
					if(learnable.screens["1"].audio){
						mediaUrl = learnable.screens["1"].audio.value[0].normal;
					}
					if(learnable.screens["1"].video){
						mediaUrl = learnable.screens["1"].video.value[0];
					}
				}
				if(mediaUrl){
					media_urls.push(mediaUrl);
				}
				if(anki_media && mediaUrl){
					let filename = `${id}_media/${mediaUrl.split("/").slice(-1)}`; 
					return `"${learnable.learning_element.replace('"', '""')} [sound:${filename}]","${learnable.definition_element.replace('"', '""')}"`
				}
				return `"${learnable.learning_element.replace('"', '""')}","${learnable.definition_element.replace('"', '""')}"`
			}).join("\n") + "\n";
			
			err_count = 0;
		} catch (error) {
			console.log(error)
			console.log(err_count);
			if (empty_set_err) continue;
			err_count++;
			if (err_count >= MAX_ERR_ABORT) {
				next = false;
			}
		}
	}
	console.log(media_urls)

	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(result);
	hiddenElement.target = '_blank';

	hiddenElement.download = course[5] + '.csv';
	hiddenElement.click();

})();
