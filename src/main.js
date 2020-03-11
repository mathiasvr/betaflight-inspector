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
  const win = config.mainWindow = new BrowserWindow({
    width: DEBUG ? 1200 : 800,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('static/index.html')

  // Open the Developer Tools in debug mode
  if (DEBUG) win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  // Re-create window if necessary when the dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Block all navigation and open URL in external browser instead
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    event.preventDefault()
    require('open')(navigationUrl)
  })
})

// Setup handlers for serial and IPC communication
setupHandlers(config)
