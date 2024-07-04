settings['parallel_download_limit'] = 6;

console.log('course dump settings: ', settings);

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function ciddToURL(cidd) {
  return `https://${cidd['domain']}/community/course/${cidd['cid']}`;
}

async function fetchMeta(cidd) {
  //default metadata values
  const meta = {
    'url': ciddToURL(cidd),
    'cid': cidd['cid'],
    'proper name': '',
    'thumbnail': '',  
    'url name': cidd['cid'],
    'number of levels': '??',
    'number of items': '??',
    'description': '',
    'author': '',
    'ava': 'https://static.memrise.com/accounts/img/placeholders/empty-avatar-2.png', // -> rnd 1..4
  };

  let course_page;
  try {
    course_page = await fetch(ciddToURL(cidd));
  } catch(err) {
    console.error(`failed to fetch course ${cidd['cid']} html`, err);
  }
  if (!course_page) return meta;

  meta['url name'] = course_page.url.split("/")[6]; // course name from the end of url after redirections

  try {
    const parser =  new DOMParser();
    const doc = parser.parseFromString(await course_page.text(), "text/html");

    meta['proper name'] = doc.querySelector('.course-name').innerText;
    meta['thumbnail'] = doc.querySelector('.course-photo img').src;
    meta['number of levels'] = (query => (query ? query.childElementCount : 1))(doc.querySelector('div.levels'));
    meta['description'] = (desc => (desc ? desc.innerText : ""))(doc.querySelector('.course-description.text'));
    meta['author'] = doc.querySelector('.creator-name span').innerText;
    meta['ava'] = doc.querySelector('.creator-image img').src;
    try {
      //only works for courses that have been started, otherwise the info is not present on the page
      meta['number of items'] = parseInt(doc.querySelector('.progress-box-title').innerText.split('/').at(-1).trim(), 10);
    } catch(err) {
      console.log(`course ${cidd['cid']} has not been started, info for 'number of items' unavailable`);
    }
  } catch(err) {
    console.error(`failed to parse course ${cidd['cid']} html`, err);    
  }

	console.log(JSON.stringify(meta));

  return meta;
}

//THE MAIN FUNCTION FOR SCANNING ALL LEVELS OF A COURSE
async function scanCourse(cidd, threadN) {
  //stop message listener
  let stopped = false;
  function stopScan(arg, sender, sendResponse) {
    if (arg.type === "coursedump_stopScan") {
      //console.log(`cid: ${cidd['cid']} - scanning stopped by user`);
      chrome.runtime.onMessage.removeListener(stopScan);
      stopped = true;
    }
  }
  chrome.runtime.onMessage.addListener(stopScan);

  //init meta and progress bar
  updScanProgress(threadN, cidd, 0, "", "");
  const meta = await fetchMeta(cidd);
  await sleep(500);
  updScanProgress(threadN, cidd, 0, meta['number of levels'], meta['proper name'] || meta['url name']);

  //process filenames and resolve name conflicts
  let reserved_filenames = new Set();
	let url2filenames = {};
	function UniqueDecodedFilename(url) {
		if (url in url2filenames) {return url2filenames[url];}

    //select name for a new file
		let	temp_filename = decodeURIComponent(url.split("/").slice(-1)[0]);
		// let pad = decodeURIComponent(url.split("/").slice(-2)[0]);
		// if (pad === 'medium') {pad = decodeURIComponent(url.split("/").slice(-3)[0])};
		// temp_filename = meta['url name'] + "_" + pad + "_" + temp_filename;
		temp_filename = meta['url name'] + "_" + cidd['cid'] + cidd['domain'][0] + "_" + temp_filename;
		temp_filename = temp_filename.replace('[','(').replace(']',')'); //square brackets are not allowed inside Anki because of [sound: ...] etc.
		let name_parts = temp_filename.split('.');
		const ext = name_parts.pop().toLowerCase(); //Anki's "Check Media" is case-sensitive, since Chrome converts all extensions to lower case the csv entries have to match that
		const proper = name_parts.join(".");
		temp_filename = proper + "." + ext;
		if (reserved_filenames.has(temp_filename)) { //add ordinal number to make the filename unique
			for (let i = 1; reserved_filenames.has(temp_filename); i++) {
				temp_filename = proper + " (" + i + ")." + ext;
			}
		}
		url2filenames[url] = temp_filename;
		reserved_filenames.add(temp_filename);

		return temp_filename;
	}
  
  //init table data
  let err_count = 0;
	let has_audio = false;
	let has_video = false;
	let attributes = [];
	let visible_info = [];
	let hidden_info = [];
	let has_definitions = false;
	let has_learnable = false;
	let course_media_urls = new Set();
	let table = [];

  // SCANNING LEVELS
  let levels_done = 0;  
  let next = true; //fallback flag in case the number of levels is unavailable from meta or incorrect
  while ((next || levels_done < meta['number of levels']) && !stopped) {
    levels_done++;
    //emulation
    await sleep(Math.floor(Math.random() * 500 + 200));
    next = (levels_done < meta['number of levels'] + settings["max_level_skip"]);
    const done_clamped_emu = Math.min(levels_done, meta['number of levels']);
    updScanProgress(threadN, cidd, isNaN(done_clamped_emu) ? levels_done : done_clamped_emu, meta['number of levels']);
    file_queue.push(42);
    continue;

    let is_mediaLevel = false;
		try {
			await sleep(200);
			
      //fetch data from memrise
			const token = document.cookie.split(" ").find(cookie => cookie.includes("csrftoken")).split(/[=;]/g)[1]; // get CSRF header
			const response = await (await fetch("https://" + cidd['domain'] + "/v1.19/learning_sessions/preview/", {
				"headers": { "Accept": "*/*", "Content-Type": "Application/json", "X-CSRFToken": token },
				"body": "{\"session_source_id\":" + cidd['cid'] + ",\"session_source_type\":\"course_id_and_level_index\",\"session_source_sub_index\":" + levels_done + "}",
				"method": "POST"
			})).json();
			// Continue after empty set
			if (response.code == "PREVIEW_DOESNT_LOAD") {
				is_mediaLevel = true;
			}

      //define general tags for all entries from the level
			let tags = `"` + meta['url name'] + `"`;
			if (settings["level_tags"]) {
				try {
          //add the name of the level to the tags in Anki hierarchical tag format
					tags = `"` + response.session_source_info.name.replaceAll('"', '""') + 
                      `::` + levels_done.toString.padStart(meta['number of levels'].length, "0") + 
                      `_` + response.session_source_info.level_name.replaceAll('"', '""') + `"`;
				} catch (err) {console.log(`${err.name}: ${err.message}`);}
				tags = tags.replaceAll(' ','_');
			}


			// Adding all entries from the level to the table and their media urls to queue
			response.learnables.map(learnable => {

				let row = [];

				//learning elements
				let learnable_el = `""`;
				if (learnable.learning_element) {
					has_learnable = true;
					learnable_el = `"${learnable.learning_element.replaceAll('"', '""')}"`;
				} else if (settings["download_media"] && learnable.screens["1"].item.kind === "audio" && learnable.screens["1"].item.value.length > 0) {
					has_learnable = true;
					let temp_audio_learns = [];
					learnable.screens["1"].item.value.map(audio_learn => {temp_audio_learns.push(audio_learn.normal)});
					temp_audio_learns.forEach(course_media_urls.add, course_media_urls);
					learnable_el = `"` + temp_audio_learns.map(url => `[sound:${UniqueDecodedFilename(url)}]`).join("") + `"`;
				} else if (settings["download_media"] && learnable.screens["1"].item.kind === "image" && learnable.screens["1"].item.value.length > 0) { 
					has_learnable = true;
					let temp_image_learns = [];
					learnable.screens["1"].item.value.map(image_learn => {temp_image_learns.push(image_learn)});
					temp_image_learns.forEach(course_media_urls.add, course_media_urls);
					learnable_el = `"` + temp_image_learns.map(url => `<img src='${UniqueDecodedFilename(url)}'>`).join(``) + `"`;
				}
				row.push(learnable_el);

				//definitions
				let definition = `""`;
				if (learnable.definition_element) {
					has_definitions = true;
					definition = `"${learnable.definition_element.replaceAll('"', '""')}"`;
				} else if (settings["download_media"] && learnable.screens["1"].definition.kind === "audio" && learnable.screens["1"].definition.value.length > 0) {
					has_definitions = true;
					let temp_audio_defs = [];
					learnable.screens["1"].definition.value.map(audio_def => {temp_audio_defs.push(audio_def.normal)});
					temp_audio_defs.forEach(course_media_urls.add, course_media_urls);
					definition = `"` + temp_audio_defs.map(url => `[sound:${UniqueDecodedFilename(url)}]`).join("") + `"`;
				} else if (settings["download_media"] && learnable.screens["1"].definition.kind === "image" && learnable.screens["1"].definition.value.length > 0) {
					has_definitions = true;
					let temp_image_defs = [];
					learnable.screens["1"].definition.value.map(image_def => {temp_image_defs.push(image_def)});
					temp_image_defs.forEach(course_media_urls.add, course_media_urls);
					definition = `"` + temp_image_defs.map(url => `<img src='${UniqueDecodedFilename(url)}'>`).join(``) + `"`;
				}
				row.push(definition);


				//audio
				let temp_audio_urls = [];
				if (settings["download_media"] && learnable.screens["1"].audio && learnable.screens["1"].audio.value.length > 0) {
					has_audio = true;
					learnable.screens["1"].audio.value.map(audio_item => {temp_audio_urls.push(audio_item.normal)});
					temp_audio_urls.forEach(course_media_urls.add, course_media_urls);
				}
				row.push(`"` + temp_audio_urls.map(url => `[sound:${UniqueDecodedFilename(url)}]`).join("") + `"`);

				//video
				let temp_video_urls = [];
				if (settings["download_media"] && settings["videofiles_limit"] > 0 && learnable.screens["1"].video && learnable.screens["1"].video.value.length > 0) {
					has_video = true;
					learnable.screens["1"].video.value.map(video_item => {temp_video_urls.push(video_item)});
					temp_video_urls.forEach(course_media_urls.add, course_media_urls);
				}
				row.push(`"` + temp_video_urls.map(url => `[sound:${UniqueDecodedFilename(url)}]`).join("") + `"`);
							
				//extra fields
				//	attr[0]: 686844 - SS; 1995282 - PoS;
				let temp_extra1 = new Array(settings["max_extra_fields"]).fill(``);
				if (settings["extra_fields"] && learnable.screens["1"].attributes && learnable.screens["1"].attributes.length > 0) {
					learnable.screens["1"].attributes.forEach(attribute => {
						if (attribute && attribute.value && attribute.label) {
							let ind = attributes.indexOf(attribute.label);
							if (ind == -1 && attributes.length < settings["max_extra_fields"]) {
								attributes.push(attribute.label);
							}
							ind = attributes.indexOf(attribute.label);
							if (ind != -1) {
								temp_extra1[ind] = `"${attribute.value.replaceAll('"', '""')}"`;
							}
						}
					})
				}
				temp_extra1.forEach(el => row.push(el));

				//	visible_info[0]: 548340 - kana; 6197256 - syn; 2021373+2021381 - lit trans/pinyin;
				//	visible_info[1]: 2021373+2021381 - pinyin;
				let temp_extra2 = new Array(settings["max_extra_fields"]).fill(``);
				if (settings["extra_fields"] && learnable.screens["1"].visible_info && learnable.screens["1"].visible_info.length > 0) {
					learnable.screens["1"].visible_info.forEach(v_info => {
						if (v_info && v_info.value && v_info.label) {
							let ind = visible_info.indexOf(v_info.label);
							if (ind == -1 && visible_info.length < settings["max_extra_fields"]) {
								visible_info.push(v_info.label);
							}
							ind = visible_info.indexOf(v_info.label);
							if (ind != -1) {
								if (settings["download_media"] && v_info.kind === "audio" && v_info.value.length > 0) {
									let temp_audio_list = [];
									v_info.value.map(audio => {temp_audio_list.push(audio.normal)});
									temp_audio_list.forEach(course_media_urls.add, course_media_urls);
									temp_extra2[ind] = `` + temp_audio_list.map(url => `[sound:${UniqueDecodedFilename(url)}]`).join("") + ``;
								} else if (settings["download_media"] && v_info.kind === "image" && v_info.value.length > 0) {
									let temp_image_list = [];
									v_info.value.map(image => {temp_image_list.push(image)});
									temp_image_list.forEach(course_media_urls.add, course_media_urls);
									temp_extra2[ind] = `` + temp_image_list.map(url => `<img src='${UniqueDecodedFilename(url)}'>`).join(``) + ``;
								} else if (v_info.kind !== "audio" && v_info.kind !== "image") {
									temp_extra2[ind] = `"${v_info.value.replaceAll('"', '""')}"`;
								}
							}
						}
					})
				}
				temp_extra2.forEach(el => row.push(el));

				//	hidden_info[0]: 1995282 - inflections;
				let temp_extra3 = new Array(settings["max_extra_fields"]).fill(``);
				if (settings["extra_fields"] && learnable.screens["1"].hidden_info && learnable.screens["1"].hidden_info.length > 0) {
					learnable.screens["1"].hidden_info.forEach(h_info => {
						if (h_info && h_info.value && h_info.label) {
							let ind = hidden_info.indexOf(h_info.label);
							if (ind == -1 && hidden_info.length < settings["max_extra_fields"]) {
								hidden_info.push(h_info.label);
							}
							ind = hidden_info.indexOf(h_info.label);
							if (ind != -1) {
								if (settings["download_media"] && h_info.kind === "audio" && h_info.value.length > 0) {
									let temp_audio_list = [];
									h_info.value.map(audio => {temp_audio_list.push(audio.normal)});
									temp_audio_list.forEach(course_media_urls.add, course_media_urls);
									temp_extra3[ind] = `` + temp_audio_list.map(url => `[sound:${UniqueDecodedFilename(url)}]`).join("") + ``;
								} else if (settings["download_media"] && h_info.kind === "image" && h_info.value.length > 0) {
									let temp_image_list = [];
									h_info.value.map(image => {temp_image_list.push(image)});
									temp_image_list.forEach(course_media_urls.add, course_media_urls);
									temp_extra3[ind] = `` + temp_image_list.map(url => `<img src='${UniqueDecodedFilename(url)}'>`).join("") + ``;
								} else if (h_info.kind !== "audio" && h_info.kind !== "image") {
									temp_extra3[ind] = `"${h_info.value.replaceAll('"', '""')}"`;
								}
							}
						}
					})
				}
				temp_extra3.forEach(el => row.push(el));

				//tags
				row.push(tags);

        //learnable IDs
				if (settings["learnable_ids"]) {
					try {
						row.push(learnable.id);
					} catch (err) {
						console.log(`no learnable id! ${err.name}: ${err.message}`, learnable);
						row.push(-1);
					}
				}
				table.push(row);

			});

			err_count = 0; //reset number of consequent unretreaved levels if the current level scan succesfully reached the end
		} catch (err) {
			console.log(err);
			if (is_mediaLevel) { 
        console.log(`${cidd['cid']}: Level ${levels_done} identified as a media level`); 
      } else {
        //likely due to scanning being performed beyond number levels identified from metadata, which is left as a fallback in case parsed value appears incorrect
        console.log(`${cidd['cid']}: Level ${levels_done} does not exist or has no learnable words. Level skip count: ` + (err_count + 1));
        err_count++;
        next = false;
        if (err_count < settings["max_level_skip"]) {
          next = true; // precaution in case value in settings has wrong type
        }
      }
		}


    //update progress bar and console log
    const done_clamped = Math.min(levels_done, meta['number of levels']);
    updScanProgress(threadN, cidd, isNaN(done_clamped) ? levels_done : done_clamped, meta['number of levels']);
  }

  //scanning of the course complete - processing the retrieved data:


  //names for directory and spreadsheet
	let saveas, subfolder; //rename
	if (settings["course_metadata"]) {
		saveas = meta['url name'] + " [" + cidd['cid'] + "]";
		subfolder = meta['url name'] + " by " + meta['author'] + " [" + cidd['cid'] + "]/";

		file_queue.push([meta['ava'], subfolder + meta['author'] + '.' + meta['ava'].split(".").slice(-1)]);
		file_queue.push([meta['thumbnail'], subfolder + meta['url name'] + '.' + meta['thumbnail'].split(".").slice(-1)]);
	} else {
    saveas = meta['url name'] + " by " + meta['author'] + " [" + cidd['cid'] + "]"; 
		subfolder = "";
	}

  //process table into formated spreadsheet
  //add all files to global queue



  if (stopped) {
    return "stopped";
  } else {
    return "completed";
  }
}

async function scanThread(threadN, batch_size) {
  let cidd;

  function ciddParse(cidd) {
    try {
      return JSON.parse(cidd);
    } catch (err) {
      return '';
    }
  }

  while (cidd = ciddParse(cidds.pop())) {
    if (cidd['domain'] === tabDomain) {
      // const closeingEvent = ;
      if (await scanCourse(cidd, threadN) === "stopped") {
        console.log(`thread ${threadN} (cid: ${cidd['cid']}) - scanning stopped by user`);
        return "stopped";       
      };
    } else {
      console.log(`${cidd} does not match tab domain ${tabDomain}`);
    }
    batch_done++;
    updBatchProgress(batch_done, batch_size, cidd);
  }

  removeScanBar(threadN);
}


//batch scheduling
async function batchDownload() {
  tabDomain = window.location.toString().split("/")[2];
  if (tabDomain !== 'app.memrise.com' && tabDomain !== 'community-courses.memrise.com') {
      alert("The extension should be used on the memrise.com site"); 
      return -1;
  }

  //global scan variables
  threads = [];
  batch_done = 0; //global
  file_queue = []; //global
  const batch_size = cidds.length;
  const progress_container = progressBarContainer();
  //removing traces of a previous run
  while (progress_container.firstChild) {progress_container.removeChild(progress_container.firstChild);}
  progress_container.classList.remove('stopped'); progress_container.classList.remove('error');
  document.querySelectorAll('div[id^="MemDump_progress-padding"]').forEach(element => {element.remove();});

  for (let threadCounter = 0; threadCounter < settings['parallel_download_limit'] && cidds.length > 0; threadCounter++) {
    // console.log(`new thread started: ${threadCounter} ${settings['parallel_download_limit']} ${cidds.length}`);
    threads.push(scanThread(threadCounter, batch_size));
  }
  updBatchProgress(batch_done, batch_size);
  const thread_res = await Promise.all(threads);

  if (thread_res.includes("stopped")) {
    console.log("all scanning threads stopped");
    progress_container.classList.add('stopped');
    threads = undefined; //reset state to enable restarting
    return "scanning stopped";
  }
  
  console.log('scanning complete');

  await sleep(500);
  updMediaProgress(0, file_queue.length);

  //downloading files
  function mediaDownloadMessages(arg, sender, sendResponse) {
    if (arg.type === "coursedump_error") {
      console.warn(`an error occured during file download ${arg.url} - ${arg.filename}`);
      console.error(arg.error);
      progress_container.classList.add('error');
    } else if (arg.type === "coursedump_progressMedia_upd") {
      updMediaProgress(arg.done, arg.todo);
    } else if (arg.type === "coursedump_mediaFinished") {
      if (arg.status === "done") {
        updMediaProgress("done");
        setTimeout(()=> {
          if (settings['anki_import_prompt'] && confirm('Would you like some help with importing the downloaded data into Anki?')) {
          window.open('https://github.com/Eltaurus-Lt/CourseDump2022#importing-into-anki', '_blank').focus();
        }}, 200);
      } else if (arg.status === "stopped") {
        console.log("stopped during file download");
        progress_container.classList.add('stopped');
      }
      chrome.runtime.onMessage.removeListener(mediaDownloadMessages);
      threads = undefined; //reset state to enable restarting
    }
  }
  chrome.runtime.onMessage.addListener(mediaDownloadMessages);

  chrome.runtime.sendMessage({
    type: "coursedump_downloadFiles",
    file_queue,
		maxThreads: settings["parallel_download_limit"]
  });

}



//global variables
if (typeof cidds === 'undefined') {var cidds = []} //should be defined as an argument passed from menu.js through background.js
if (typeof batch_done === 'undefined') {var batch_done = 0} //global progress counter
if (typeof file_queue === 'undefined') {var file_queue = []} //global media files list
if (typeof threads !== 'undefined') {
  alert('Script is already executing on this page. Reload to retry');
} else {
  batchDownload();
}