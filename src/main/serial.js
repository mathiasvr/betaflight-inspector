const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const { parseGet } = require('./parse-get')
const { parseDump } = require('./parse-dump')

const assert = require('assert')

exports.connectToSerialPort = function (portPath) {
  return new Promise((resolve, reject) => {
    const port = new SerialPort(
      portPath, { baudRate: 115200 }
      , err => {
        if (err) return console.error('could not open:', err.message)

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
        reject(new Error('Timeout'))
      }
    }

    setTimeout(() => stage === 0 && exitAndClose(), 1000)
    setTimeout(() => exitAndClose(), 5000)

    // TODO: do we need this / does it throw other errors (not already handled)
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
          var m = line.match(/# Betaflight.+?(\d\.\d\.\d)/)
          if (m) info.versionNumber = m[1]
          info.versionString = line.replace(/^# /, '')

          if (m && info.versionNumber.substring(0, 3) === '4.1') {
            stage++
            portWriteAndCheck('diff all\n')
          } else {
            console.warn('Unsupported Betaflight version:', info.versionString)
            stage = -1
            // TODO: decide how to handle close
          }
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
            portWriteAndCheck('abc123\n')
          } else {
            info.default_dump += line + '\n'
          }
          break
        case 7:
          if (line === '# abc123') {
            stage++
            portWriteAndCheck('exit\n')
            port.close()
            processData(info).then(resolve).catch(reject)
          } else {
            info.get_vars += line + '\n'
          }
          break
      }
    })
  })
}

async function processData (info) {
  const diff = parseDump(info.diff)
  const defaults = parseDump(info.default_dump)
  const get = parseGet(info.get_vars)

  // TODO: handle this? - in production?
  assert.deepStrictEqual(
    [...Object.keys(defaults.variables.master),
      ...Object.keys(defaults.variables.profiles[0]),
      ...Object.keys(defaults.variables.rateProfiles[0])].sort(),
    Object.keys(get).sort())

  // TODO: currently only working with variables
  const masterVars = mergeVariableProperties(diff.variables.master, defaults.variables.master, get)

  const profilesVars = []
  for (let i = 0; i < diff.variables.profiles.length; i++) {
    profilesVars[i] = mergeVariableProperties(diff.variables.profiles[i], defaults.variables.profiles[i], get)
  }

  const rateProfilesVars = []
  for (let i = 0; i < diff.variables.rateProfiles.length; i++) {
    rateProfilesVars[i] = mergeVariableProperties(diff.variables.rateProfiles[i], defaults.variables.rateProfiles[i], get)
  }

  const cliVars = {
    masterVars,
    profilesVars,
    rateProfilesVars,
    activeProfile: diff.activeProfile,
    activeRateProfile: diff.activeRateProfile,
    // TODO: for dev purposes - restructure
    version: { str: info.versionString, num: info.versionNumber },
    diff: diff
  }

  return cliVars
}

function mergeVariableProperties (values, defaults, ranges) {
  const vars = {}
  for (const key of Object.keys(defaults)) {
    if (defaults[key] !== ranges[key].default.toString()) {
      console.warn(`Inconsistent default key: ${key} (${defaults[key]} vs ${ranges[key].default})`)
    }

    // TODO: Can more keys be used?
    vars[key] = {
      value: values[key] || defaults[key],
      default: defaults[key],
      range: ranges[key].range,
      allowed: ranges[key].allowed,
      datatype: ranges[key].datatype
    }
  }

  return vars
}
