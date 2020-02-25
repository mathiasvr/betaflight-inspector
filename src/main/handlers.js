
const { ipcMain: ipc } = require('electron')

const SerialPort = require('serialport')
const usb = require('usb')

const { connectToSerialPort } = require('./serial')

module.exports.setupHandlers =
function (mainWindow) {
  ipc.on('connect-serial-scrape-info', (event, arg) => {
    console.log('ipc arg', arg)

    connectToSerialPort(arg, event)
  })

  ipc.on('list-serial-ports', (event) => {
    listSerialPorts()
  })

  const listSerialPorts = async () => {
    const res = await SerialPort.list()
    if (mainWindow) mainWindow.webContents.send('serial-ports-updated', res)
  }

  usb.on('attach', () => {
    console.info('usb attach')
    setTimeout(() => listSerialPorts(), 500)
  })

  usb.on('detach', () => {
    console.info('usb detach')
    listSerialPorts()
  })
}
