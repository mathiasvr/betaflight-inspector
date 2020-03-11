
// Parse Betaflight CLI dump or diff output
exports.parseDump = function (txt) {
  const lines = txt.split('\n')

  const config = {
    resources: [],
    features: {},

    variables: {
      master: {},
      profiles: [{}, {}, {}],
      rateProfiles: [{}, {}, {}, {}, {}, {}]
    },
    activeProfile: -1,
    activeRateProfile: -1,

    globals: {}
  }

  for (const line of lines) {
    if (line === '' || line.startsWith('#')) continue

    const words = line.split(' ')

    switch (words[0]) {
      case 'resource':
        config.resources.push(line) // todo set (dict)
        break

      case 'feature':
        var name = words[1][0]
        var enabled = true
        if (name === '-') {
          enabled = false
          name = name.substring(1)
        }
        config.resources[name] = enabled
        break
      case 'profile':
        config.activeProfile = parseInt(words[1], 10)
        break
      case 'rateprofile':
        config.activeRateProfile = parseInt(words[1], 10)
        break
      case 'set':
        if (words.length !== 4 || words[2] !== '=') {
          console.warn('Warning: Skipping malformed set')
          break
        }

        var sectionVars =
            config.activeRateProfile >= 0
              ? config.variables.rateProfiles[config.activeRateProfile]
              : config.activeProfile >= 0
                ? config.variables.profiles[config.activeProfile]
                : config.variables.master

        sectionVars[words[1]] = words[3]
        break

      // todo: globals
      case 'board_name':
      case 'manufacturer_id':
      case 'mcu_id':
      case 'signature':
        config.globals[words[0]] = line.substring(words[0].length + 1)
        break
      default:
        if (!config.unknown) config.unknown = {}
        config.unknown[words[0]] = line
    }
  }

  return config
}
