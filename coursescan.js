ANKI_HEADERS = true;

console.log('course dump settings: ', settings);
console.log('course dump batch: ', JSON.stringify(cidds));

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function ciddToURL(cidd) {
  return `https://${cidd['domain']}/community/course/${cidd['cid']}`;
}

function fetchURL(domain) {
	return `https://${domain}/v2.0/learning_sessions/preview/`;
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
      meta['number of items'] = parseInt(doc.querySelector('.progress-box-title').innerText.split('/').at(-1).trim(), 10).toString();
    } catch(err) {
      console.log(`course ${cidd['cid']} has not been started, info for 'number of items' unavailable`);
    }
  } catch(err) {
    console.error(`failed to parse course ${cidd['cid']} html`, err);    
  }

	console.log(meta);

  return meta;
}

function meta2txt(meta) {
	let text = 'data:md/plain;charset=utf-8,' + encodeURIComponent( 
		`# **${meta['proper name'] || meta['url name']}**\n` + 
		`### by _${meta['author']}_\n` + 
		`### (${meta['number of items']} learnable items)\n` + 
		`\n` + 
		meta['description']
		);
	if (!ANKI_HEADERS) {
		text = text + encodeURIComponent( 
		`\n\n` + 
		`## Course Fields\n` +
		`| ${meta['course fields']} |`
		);
	}
  return text;
}

function wrapAlts(alts, hidden=false) {
	return `\n<div class="alt"${ hidden ? ' hidden' : '' }>${ [...alts].join(" | ") }</div>`;
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
	const attributes = [];
	const visible_info = [];
	const hidden_info = [];
	let has_definitions = false;
	let has_learnable = false;
	const course_media_urls = new Set();
	const table = [];

  // SCANNING LEVELS
  let levels_done = 0;
  let proceed = true; //fallback flag in case the number of levels is unavailable from meta or incorrect
  while ((proceed || levels_done < meta['number of levels']) && !stopped) {
    levels_done += 1;
    //emulation
    // await sleep(Math.floor(Math.random() * 500 + 200));
    // proceed = (levels_done < meta['number of levels'] + settings["max_level_skip"]);
    // const done_clamped_emu = Math.min(levels_done, meta['number of levels']);
    // updScanProgress(threadN, cidd, isNaN(done_clamped_emu) ? levels_done : done_clamped_emu, meta['number of levels']);
    // file_queue.push(42);
    // continue;

    let level_is_empty = false;
		try {
			//await sleep(50);
			
      		//fetch data from memrise
			const token = document.cookie.split(" ").find(cookie => cookie.includes("csrftoken")).split(/[=;]/g)[1]; // get CSRF header
			const response = await fetch(fetchURL(cidd['domain']), {
				"headers": { 
					"Accept": "*/*", 
					"Content-Type": "Application/json", 
					"X-CSRFToken": token 
				},
				"body": JSON.stringify({
					session_source_id: cidd['cid'],
					session_source_type: "course_id_and_level_index",
					session_source_sub_index: levels_done
				}),
				"method": "POST"
			});
			if (!response.ok) {
				if (response.status === 401) {
					if (threadN === 0) {
						alert("Memrise login required"); // should be impossible to trigger because of the test at the start of batchDownload()
					}
					return "unauthorised";
				}
			}
			const response_json = await response.json();

			// Continue after empty set
			if (response_json.code == "PREVIEW_DOESNT_LOAD") {
				level_is_empty = true;
			}

      		//define general tags for all entries from the level
			let tags = `"` + meta['url name'] + `"`;
			if (settings["level_tags"]) {
				try {
         			//add the name of the level to the tags in Anki hierarchical tag format
					tags = `"` + response_json.session_source_info.name.replaceAll('"', '""') + 
                      `::` + levels_done.toString().padStart(meta['number of levels'].toString().length, "0") + 
                      `_` + response_json.session_source_info.level_name.replaceAll('"', '""') + `"`;
				} catch (err) {console.log(`${err.name}: ${err.message}`);}
				tags = tags.replaceAll(' ','_');
			}


			// Adding all entries from the level to the table and their media urls to queue
			response_json.learnables.map(learnable => {

				let row = [];

				//learning elements
				let learnable_el = `""`;
				if (learnable.learning_element) {
					has_learnable = true;
					learnable_el = learnable.learning_element;
					if (settings["alternative_answers"]) {
						const alts = learnable?.screens?.["1"]?.item?.alternatives;
						const allAnss = Object.values(learnable.screens).find(screen=>screen.template==="typing")?.correct;
						const hiddenAlts = allAnss?.filter(ans => ans.toLowerCase().trim() !== learnable_el.toLowerCase().trim() && !alts.includes(ans));
						if (Array.isArray(alts) && alts.length > 0) {
							learnable_el += wrapAlts(alts);
						}
						if (Array.isArray(hiddenAlts) && hiddenAlts.length > 0) {
							learnable_el += wrapAlts(hiddenAlts, true);
						}
					}
					learnable_el = `"${learnable_el.replaceAll('"', '""')}"`;
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
					definition = learnable.definition_element;
					if (settings["alternative_answers"]) {
						const alts = learnable?.screens?.["1"]?.definition?.alternatives;
						if (Array.isArray(alts) && alts.length > 0) {
							definition += wrapAlts(alts);
						}
					}
					definition = `"${definition.replaceAll('"', '""')}"`;
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
									temp_extra2[ind] = v_info.value;
									if (settings["alternative_answers"]) {
										const alts = v_info.alternatives;
										if (Array.isArray(alts) && alts.length > 0) {
											temp_extra2[ind] += wrapAlts(alts);
										}
									}
									temp_extra2[ind] = `"${temp_extra2[ind].replaceAll('"', '""')}"`;
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
									temp_extra3[ind] = h_info.value;
									if (settings["alternative_answers"]) {
										const alts = h_info.alternatives;
										if (Array.isArray(alts) && alts.length > 0) {
											temp_extra3[ind] += wrapAlts(alts);
										}
									}
									temp_extra3[ind] = `"${temp_extra3[ind].replaceAll('"', '""')}"`;
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
			if (level_is_empty) { 
				console.log(`${cidd['cid']}: Level ${levels_done} has no learnable items`); 
			} else {
			  //likely due to scanning being performed beyond number levels identified from metadata, which is left as a fallback in case parsed value appears incorrect
			  console.log(`${cidd['cid']}: Level ${levels_done} does not exist or has no learnable words. Level skip count: ` + (err_count + 1));
			  err_count++;
			  proceed = false;
			  if (err_count < settings["max_level_skip"]) {
				proceed = true; // precaution in case value in settings has wrong type
			  }
			}
		}


    //update progress bar and console log
    const done_clamped = Math.min(levels_done, meta['number of levels']);
    updScanProgress(threadN, cidd, isNaN(done_clamped) ? levels_done : done_clamped, meta['number of levels']);
  }

  if (stopped) {
    return "stopped";
  }

  console.log('scanning complete - formatting data');

  //final number of learnables
  if (meta['number of items'].includes("?")) {
	meta['number of items'] = "~" + table.length;
  }
  if (table.length < meta['number of items']) {
  	console.warn(`${cidd['cid']}: Only ${table.length} out of ${meta['number of items']} learnables have been downloaded! (you might want to check your internet connection and retry)`);
	meta['number of items'] = `${table.length} of ${meta['number of items']}`;
  }

  //select non-empty fields
  const course_fields = [];
  if (has_learnable) {course_fields.push("Learnable")};
  if (has_definitions) {course_fields.push("Definition")};
  if (has_audio) {course_fields.push("Audio")};
  if (has_video) {course_fields.push("Video")};
  course_fields.push(...attributes);
  course_fields.push(...visible_info);
  course_fields.push(...hidden_info);
  if (settings["level_tags"]) {course_fields.push("Level tags")};
  if (settings["learnable_ids"]) {course_fields.push("Learnable ID")};
  meta['course fields'] = course_fields.join(" | ");

  // convert table to plain text (csv)
  let csv_data = table.map(row => {
		const line = [];
		if (has_learnable) {line.push(row[0])};
		if (has_definitions) {line.push(row[1])};
		if (has_audio) {line.push(row[2])};
		if (has_video) {line.push(row[3])};
		line.push(...row.slice(4, 4 + attributes.length));
		line.push(...row.slice(4 + settings["max_extra_fields"], 4 + settings["max_extra_fields"] + visible_info.length));
		line.push(...row.slice(4 + 2 * settings["max_extra_fields"], 4 + 2 * settings["max_extra_fields"] + hidden_info.length));
		if (settings["level_tags"]) {line.push(row[4 + 3 * settings["max_extra_fields"]])};
		if (settings["learnable_ids"]) {line.push(row[4 + 3 * settings["max_extra_fields"] + 1])};
		return line.join(`,`);
	}).join("\n") + "\n";
	//add Anki headers
	if (ANKI_HEADERS) {
		csv_data = "#separator:comma\n" +
				 "#html:true\n" +
				 (settings["level_tags"] ? (`#tags column:${settings["learnable_ids"] ? course_fields.length-1 : course_fields.length}\n`) : ``) +
				 "#columns:" + course_fields.join(",") + "\n" +
				 csv_data;
	}
  const csv_encoded = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csv_data);
  //console.log(csv_encoded.length, csv_encoded);

  //names for directory and the spreadsheet
  let course_filename, course_folder;
  if (settings["course_metadata"]) {
	course_filename = `${meta['url name']} [${cidd['cid']}]`;
	course_folder = `${meta['url name']} by ${meta['author']} [${cidd['cid']}]/`;
  } else {
	course_filename = `${meta['url name']} by ${meta['author']} [${cidd['cid']}]`; 
	course_folder = "";
  }

  if (settings["download_media"]) {
    console.log(`Media files found in ${meta['url name']}[${cidd['cid']}]: ${course_media_urls.size}`);
  };
  
  //add all files to the global queue
  file_queue.unshift([csv_encoded, `${course_folder}${course_filename}_(${meta['number of items'].toString()}).csv`]);
  if (settings["course_metadata"]) {
    file_queue.unshift([meta2txt(meta), `${course_folder}info.md`]);
    file_queue.unshift([meta['ava'], `${course_folder}${meta['author']}.${meta['ava'].split(".").slice(-1)}`]);
	file_queue.unshift([meta['thumbnail'], `${course_folder}${meta['url name']}.${meta['thumbnail'].split(".").slice(-1)}`]);
  }
  if (!settings["skip_media_download"]) {
	course_media_urls.forEach(url => {
		file_queue.push([url, `${course_folder}${course_filename}_media(${course_media_urls.size})/${UniqueDecodedFilename(url)}`]);
  	});
  }

	return "completed";
}

async function scanThread(threadN, batch_size) {
  let cidd;

  while (cidd = cidds.pop()) {
    if (cidd['domain'] === tabDomain) {
      const closingEvent = await scanCourse(cidd, threadN);
      if (closingEvent === "stopped") {
        console.log(`thread ${threadN} (cid: ${cidd['cid']}) - scanning stopped by user`);
        return "stopped";
      };
	  if (closingEvent === "unauthorised") {
        console.log(`thread ${threadN} (cid: ${cidd['cid']}) - user is not logged in, scanning terminated`);
        return "unauthorised";
      };
    } else {
      console.warn(`${cidd} does not match downloading tab domain ${tabDomain}`);
    }
    batch_done++;
    updBatchProgress(batch_done, batch_size, cidd);
  }

  removeScanBar(threadN);
}


//batch scheduling
async function batchDownload() {
	//validity tests
	tabDomain = window.location.toString().split("/")[2];
	if (tabDomain !== 'community-courses.memrise.com') {
		alert("The extension should be used on community-courses.memrise.com"); 
		return -1;
	}
	const test_fetch = await fetch(fetchURL(tabDomain));
	if (!test_fetch.ok) {
	  if (test_fetch.status === 401) {
		  console.log("not logged in - terminating download");
		  alert("Memrise login required");
		  return "scanning unauthorised";
	  }
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

  if (thread_res.includes("unauthorised")) {
    console.log("all scanning threads stopped");
    progress_container.classList.add('error');
    threads = undefined; //reset state to enable restarting
    return "scanning unauthorised";
  }
  if (thread_res.includes("stopped")) {
    console.log("all scanning threads stopped");
    progress_container.classList.add('stopped');
    threads = undefined; //reset state to enable restarting
    return "scanning stopped";
  }
  
  console.log('All scanning and formating complete');

  await sleep(500);
  updMediaProgress(0, file_queue.length);
  //console.log('initiating download');
  //console.log(file_queue.slice(0, 10));

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
          window.open('https://github.com/Eltaurus-Lt/CourseDump2022#-importing-into-anki', '_blank').focus();
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
if (typeof file_queue === 'undefined') {var file_queue = []} //global list of files
if (typeof threads !== 'undefined') {
  alert('Script is already executing on this page. Reload to retry'); //should be impossible to trigger if the menu state is correct
} else {
  batchDownload();
}