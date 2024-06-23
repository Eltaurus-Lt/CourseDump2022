document.addEventListener('DOMContentLoaded', function () {

  // links

  document.getElementById("link-help").addEventListener('click', function () {
    window.open('https://github.com/Eltaurus-Lt/CourseDump2022?tab=readme-ov-file#memrise-course-dump', '_blank').focus();
  });
  document.getElementById("link-forum").addEventListener('click', function () {
    window.open('https://forums.ankiweb.net/t/an-alternative-to-memrise2anki-support-thread/30084', '_blank').focus();
  });
  document.getElementById("link-ankiweb").addEventListener('click', function () {
    window.open('https://ankiweb.net/shared/info/510199145', '_blank').focus();
  });
  document.getElementById("link-coffee").addEventListener('click', function () {
    window.open('https://buymeacoffee.com/eltaurus', '_blank').focus();
  });


  // document.getElementById('export').addEventListener('click', async () => {
//     try {
//       const textToWrite = '42!';
//       const fileHandle = await window.showSaveFilePicker();
//       const writable = await fileHandle.createWritable();
//       await writable.write(textToWrite);
//       await writable.close();
//       console.log('Text written successfully!');
//     } catch (error) {
//       alert('Error writing text:', error);
//     }
//   });
});
