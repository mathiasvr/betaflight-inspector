// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')

const { setupHandlers } = require('./main/handlers')

const DEBUG = process.env.DEBUG

const config = { mainWindow: null }

if (DEBUG) {
  require('electron-reload')(__dirname, {
    electron: path.join(process.cwd(), 'node_modules', '.bin', 'electron'),
    awaitWriteFinish: true
  })
}

function createWindow () {
  // Create the browser window.
  const win = config.mainWindow = new BrowserWindow({
    width: DEBUG ? 1100 : 800,
    height: 600,
    webPreferences: { 
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  win.loadFile('public/index.html')

  // Open the Developer Tools in debug mode
  if (DEBUG) win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Setup handlers for serial and IPC communication
setupHandlers(config)
