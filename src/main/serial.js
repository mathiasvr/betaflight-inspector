const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const { parseGet } = require('./parse-get')
const { parseDump } = require('./parse-dump')

module.exports.connectToSerialPort =
function connectToSerialPort (portPath, evt, docs) { // TODO: don't pass evt and docs
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

  const exitAndClose = () => {
    if (port.isOpen) {
      console.log('serial port, timed out...')
      // might not be valid, but send exit just in case
      portWriteAndCheck('exit\n')
      port.close()
    }
  }

  // TODO: notify renderer of timeout
  setTimeout(() => stage === 0 && exitAndClose(), 1000)
  setTimeout(() => exitAndClose(), 5000)

  // todo: do we need this / does it throw other errors (not already handled)
  // Open errors will be emitted as an error event
  // port.on("error", function (err) {
  //   console.error("Error: ", err.message);
  //   process.exit(1)
  // });

  // NOTE: This removes empty entries (lines)
  const parser = port.pipe(new Readline({ delimiter: '\r\n' }))

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
          processData(info, evt, docs)
        } else {
          info.get_vars += line + '\n'
        }
        break
    }
  })
}

async function processData (info, evt, docs) {
  // TODO: possible exceptions all over the place
  const diff = parseDump(info.diff)
  const defaults = parseDump(info.default_dump)
  const get = parseGet(info.get_vars)

  // TODO: currently only working with variables
  const masterVars = mergeVariableProperties(diff.master.variables, defaults.master.variables, get, docs)

  const profilesVars = []
  for (let i = 0; i < diff.profiles_vars.length; i++) {
    profilesVars[i] = mergeVariableProperties(diff.profiles_vars[i], defaults.profiles_vars[i], get, docs)
  }

  const rateProfilesVars = []
  for (let i = 0; i < diff.rateprofiles_vars.length; i++) {
    rateProfilesVars[i] = mergeVariableProperties(diff.rateprofiles_vars[i], defaults.rateprofiles_vars[i], get, docs)
  }

  const cliVars = { masterVars, profilesVars, rateProfilesVars }

  evt.reply('received-bf-configuration', cliVars)
}

function mergeVariableProperties (values, defaults, ranges, docs) {
  // TODO: assert key sync between parses
  const vars = {}
  for (const key of Object.keys(defaults)) {
    if (defaults[key] !== ranges[key].default) {
      console.warn(`Inconsistent default key: ${key} (${defaults[key]} vs ${ranges[key].default})`)
    }

    // TODO: default present in two places
    vars[key] = { value: values[key] || defaults[key], default: defaults[key], ...ranges[key] }
  }

  /// TODO: don't do this here -------------------

  // add documentation properties to variables
  for (const key of Object.keys(vars)) {
    if (docs[key]) {
      ['desc', 'aka', 'unit'].forEach((prop) => {
        if (prop in docs[key]) vars[key][prop] = docs[key][prop]
      })
    }
  }

  // convert to array
  const vars2 = []
  for (const [key, props] of Object.entries(vars)) {
    vars2.push({ name: key, ...props })
  }

  return vars2
}
