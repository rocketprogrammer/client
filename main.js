// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
// Specify flash path, supposing it is placed in the same directory with main.js.
//let pluginName = './pepflashplayer.dll'
let pluginName
switch (process.platform) {
  case 'win32':
    pluginName = 'pepflashplayer.dll'
    break
  case 'darwin':
    pluginName = 'PepperFlashPlayer.plugin'
    break
  case 'linux':
    pluginName = 'libpepflashplayer.so'
    break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));

//app.commandLine.appendSwitch('ignore-certificate-errors', 'true');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    title: "Cozy Penguin",
    icon: __dirname + '/favicon.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      plugins: true
    }
  })

  mainWindow.setMenu(null)

  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')
  mainWindow.loadURL('https://client.cozypenguin.net')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Discord Rich Presence
const client = require('discord-rich-presence')('DISCORDCLIENTID');
 
client.updatePresence({
  state: 'cozypenguin.net',
  details: 'Waddling Around!',
  startTimestamp: Date.now(),
  largeImageKey: 'main-logo',
  instance: true,
});
