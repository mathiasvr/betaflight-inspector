
const { ipcMain: ipc } = require('electron')

const SerialPort = require('serialport')
const usb = require('usb')

const { connectToSerialPort } = require('./serial')
const { annotateWithVariableDocumentation } = require('./variable-documentation')

exports.setupHandlers = function (config) {
  ipc.on('connect-serial-scrape-info', async (event, arg) => {
    console.log('ipc arg', arg)

    connectToSerialPort(arg)
      .then(cliVars => {
        // TODO: just pass documentation dict to app instead?
        cliVars.masterVars = annotateWithVariableDocumentation(cliVars.masterVars)
        for (let i = 0; i < 3; i++) {
          cliVars.profilesVars[i] = annotateWithVariableDocumentation(cliVars.profilesVars[i])
        }
        for (let i = 0; i < 6; i++) {
          cliVars.rateProfilesVars[i] = annotateWithVariableDocumentation(cliVars.rateProfilesVars[i])
        }

        // console.log(cliVarsDoc)
        event.reply('received-bf-configuration', cliVars)
      })
      // TODO: better error handling
      .catch(err => {
        // console.error('Error:', err.message))
        event.reply('connection-error', err)
        throw err
      })
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
