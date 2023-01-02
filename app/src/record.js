const { desktopCapturer, Menu, dialog, ipcMain } = require('electron');
const { writeFile } = require('fs');

//---------------- IPC

ipcMain.on('startRecording', () => {
    startRecording();
});
  
ipcMain.on('stopRecording', () => {
    stopRecording();
});

ipcMain.on('sentMedia', function(media) {
    setMediaSources(media);
})

//---------------- EXPORTS

exports.getWindows = async function () {
    const windows = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });

    return windows;
}

exports.makeMenu = function (itemList) {
    const windowMenu = Menu.buildFromTemplate(
        itemList.map(item => {
            return {
                label: item.name,
                click: () => selectSource(item)
            }
        })
    )
  
    windowMenu.popup()
    return windowMenu;
}

//------------------ RECORDING

// Global state
let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

startRecording = function () {
    mediaRecorder.start();
    console.log('started recording?');
}

stopRecording = function () {
    mediaRecorder.stop();
    console.log('stopped recording?');
}

async function selectSource(source) {
    const constraints = {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: source.id
          }
        }
      };
    
    // Create a Stream
    const stream = await navigator.mediaDevices
      .getUserMedia(constraints);
  
    mainWindow.webContents.send('renderVid', stream);
  
    // Create the Media Recorder
    const options = { mimeType: 'video/webm; codecs=vp9' };
    mediaRecorder = new MediaRecorder(stream, options);
  
    // Register Event Handlers
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
  
    // Updates the UI
}

// Captures all recorded chunks
function handleDataAvailable(e) {
    recordedChunks.push(e.data);
}
  
// Saves the video file on stop
async function handleStop(e) {
    const blob = new Blob(recordedChunks, {
        type: 'video/webm; codecs=vp9'
    });

    const buffer = Buffer.from(await blob.arrayBuffer());

    const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save video',
        defaultPath: `vid-${Date.now()}.webm`
    });

    if (filePath) {
        writeFile(filePath, buffer, () => console.log('video saved successfully!'));
    }
}
