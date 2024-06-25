if (typeof default_settings === 'undefined') {
    var default_settings = {
        "download_media": true,
        "extra_fields": true,
        "level_tags": true,
        "anki_import_prompt": true,
      
        "learnable_ids": false,
        "skip_media_download": false,
        "course_metadata": true,
      
        "max_level_skip": 5,
        "max_extra_fields": 5,
        "parallel_download_limit": 15
    };
}

async function loadFromStorage(obj) {
    return new Promise((resolve) => {
        chrome.storage.local.get([obj], (result) => {
            resolve(result[obj]);
        });
    });
  }
  
async function downloadCourse() {

    console.log(default_settings);

    let settings = await loadFromStorage('settings') || default_settings;

    for (const [setting, default_value] of Object.entries(default_settings)) {
      if (!(setting in settings && settings[setting] !== 'undefined')) {
        settings[setting] = default_value;
      }
    }


    console.log(settings);
}


downloadCourse();

// alert(cidds);

