const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const record = require(path.join(__dirname, '..', 'src', 'record.js'));

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true,
      preload: path.join(__dirname, "preload.js"),
      show: false
    },
  });

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'src', 'index.html'));

  mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//------------------------- handling ipcMain signals
// individual files handle their corresponding ipc signals, unless any message must be sent back
// someday give BrowserWindow object to other JS files??? so they can do this themselves

ipcMain.on('getWindows', () => {
  let windowPromise = record.getWindows();

  windowPromise.then(
    function(windows) {
      mainWindow.webContents.send('sentWindows', windows);
    }
  )
});

ipcMain.on('makeMenu', (_event, itemList) => {
  mainWindow.webContents.send('getMedia');
  record.makeMenu(JSON.parse(itemList));
});
