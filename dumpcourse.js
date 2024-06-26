 
async function downloadCourse() {

    console.log(default_settings);

    let settings = await loadFromStorage('settings') || default_settings;

    for (const [setting, default_value] of Object.entries(default_settings)) {
      if (!(setting in settings && settings[setting] !== 'undefined')) {
        settings[setting] = default_value;
      }
    }


    
}


console.log(settings);
console.log(cidds);

// alert(cidds);

