
const { ipcMain: ipc } = require('electron')

const SerialPort = require('serialport')
const usb = require('usb')

const { connectToSerialPort } = require('./serial')
const { annotateWithVariableDocumentation } = require('./variable-documentation')

exports.setupHandlers = function (config) {
  ipc.on('connect-serial-scrape-info', async (event, arg) => {
    console.log('ipc arg', arg)

    connectToSerialPort(arg)
      .then(vars => {
        const cliVars = annotateWithVariableDocumentation(vars)
        event.reply('received-bf-configuration', cliVars)
      })
      // TODO: better error handling
      .catch(err => console.error('Error:', err.message))
  })

  ipc.on('list-serial-ports', (event) => {
    listSerialPorts()
  })

  const listSerialPorts = async () => {
    const res = await SerialPort.list()
    if (config.mainWindow) config.mainWindow.webContents.send('serial-ports-updated', res)
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
