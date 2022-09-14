url = window.location.toString();
course = url.split("/");
if (course[3] === "course") {id = course[4];} else {alert("not a course page");throw '';};

next = true;

//based on the script by baroxyton
//https://gist.github.com/baroxyton/01a53533ff49a62b5a94dd8b26f38d31
result = "";
(async function(){
for (let i = 1; next; i++) {
    try {
	    // get CSRF header
	    token = document.cookie.split(" ").find(cookie => cookie.includes("csrftoken")).split(/[=;]/g)[1];
	    response = await(await fetch("https://app.memrise.com/v1.18/learning_sessions/preview/", {
	        "headers": { "Accept": "*/*", "Content-Type": "Application/json", "X-CSRFToken": token },
	        "body": "{\"session_source_id\":"+id+",\"session_source_type\":\"course_id_and_level_index\",\"session_source_sub_index\":" + i + "}",
 	        "method": "POST"
	    })).json();
	    // Escape double quotes and commas
	    result += response.learnables.map(learnable => `"${learnable.learning_element.replace('"', '""')}","${learnable.definition_element.replace('"', '""')}"`).join("\n")+"\n"
	} catch (error) {
		next = false;
	}
}
//document.body.innerText = result;

document.write(result);  
  
var hiddenElement = document.createElement('a');  
hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(result);  
hiddenElement.target = '_blank';  
      
hiddenElement.download = course[5]+'.csv';  
hiddenElement.click();  

})()