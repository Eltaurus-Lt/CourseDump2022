url = window.location.toString();
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
			// Escape double quotes and commas
			result += response.learnables.map(learnable => `"${learnable.learning_element.replace('"', '""')}","${learnable.definition_element.replace('"', '""')}"`).join("\n") + "\n";
			err_count = 0;
		} catch (error) {
			console.log(err_count);
			if (empty_set_err) continue;
			err_count++;
			if (err_count >= MAX_ERR_ABORT) {
				next = false;
			}
		}
	}

	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(result);
	hiddenElement.target = '_blank';

	hiddenElement.download = course[5] + '.csv';
	hiddenElement.click();

})();