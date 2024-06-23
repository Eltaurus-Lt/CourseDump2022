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