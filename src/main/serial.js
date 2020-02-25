const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const { parseGet } = require('./parse-get')
const { parseDump } = require('./parse-dump')

module.exports.connectToSerialPort =
function connectToSerialPort (portPath, evt) { // TODO: don't pass evt
  const port = new SerialPort(
    portPath, { baudRate: 115200 }
    , err => {
      if (err) return console.error('could not open:', err.message)

      // whenReady()
      portWriteAndCheck('#')
    })

  const portWriteAndCheck = (data) => {
    port.write(data, (err) => {
      if (err) return console.log('Error on write: ', err.message)
      console.log('Message written:', data)
    })
  }

  // TODO: fix timeout, check stage?
  setTimeout(() => {
    if (port.isOpen) {
      // might not be valid, but send exit just in case
      console.log('serial port, timed out...')
      portWriteAndCheck('exit\n')
      port.close()
    }
  }, 5000)

  // todo: do we need this / does it throw other errors (not already handled)
  // Open errors will be emitted as an error event
  // port.on("error", function (err) {
  //   console.error("Error: ", err.message);
  //   process.exit(1)
  // });

  // NOTE: This removes empty entries (lines)
  const parser = port.pipe(new Readline({ delimiter: '\r\n', includeDelimiter: false }))

  let stage = 0

  const info = {
    version: null,
    diff: '',
    default_dump: '',
    get_vars: ''
  }

  parser.on('data', line => {
    // console.log(`Read line (s${stage}): ${JSON.stringify(line)}`);

    switch (stage) {
      case 0:
        if (line.startsWith('Entering CLI Mode')) {
          stage++
          portWriteAndCheck('version\n')
        }
        break
      case 1:
        if (line === '# version') {
          stage++
        }
        break
      case 2:
        info.version = line
        // TODO: check version before proceeding
        stage++
        portWriteAndCheck('diff all\n')
        break
      case 3:
        if (line === '# diff all') {
          portWriteAndCheck('defaults nosave\n')
          stage++
        }
        break
      case 4:
        if (line === '# defaults nosave') {
          stage++
          portWriteAndCheck('dump all\n')
        } else {
          info.diff += line + '\n'
        }
        break
      case 5:
        if (line === '# dump all') {
          stage++
          portWriteAndCheck('get\n')
        }
        break
      case 6:
        if (line === '# get') {
          stage++
          // HACK: send unique string (unknown command) in order to locate end of response
          portWriteAndCheck('abcde12345\n')
        } else {
          info.default_dump += line + '\n'
        }
        break
      case 7:
        if (line === '# abcde12345') {
          stage++
          portWriteAndCheck('exit\n')
          port.close()
          processData(info, evt)
        } else {
          info.get_vars += line + '\n'
        }
        break
    }
  })
}

async function processData (info, evt) {
  // TODO: possible exceptions all over the place
  const diff = parseDump(info.diff)
  // console.log('Diff:', diff)

  const dump = parseDump(info.default_dump)
  // console.log('Dump:', dump)

  const get = parseGet(info.get_vars)
  // console.log('Get:', get)

  evt.reply('received-bf-configuration', { diff, dump, get })
}
