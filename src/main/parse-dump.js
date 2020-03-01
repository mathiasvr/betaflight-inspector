
// parse betaflight dump or diff
// TODO: throws
// export
module.exports.parseDump =
  function parseDump (txt) {
    const lines = txt.split('\n')

    const master = {
      resources: [],
      features: {},
      variables: {},
      globals: {}
    }

    // todo: assumes dump is ordered (does nat confirm that variable belong to section)
    const profiles_vars = [{}, {}, {}]
    const rateprofiles_vars = [{}, {}, {}, {}, {}, {}]

    // move to master?
    let active_prof = -1
    let active_rateprof = -1

    for (const line of lines) {
      // console.log('wtf')
      if (line === '') continue // todo?
      if (line.startsWith('#')) continue

      const words = line.split(' ')

      switch (words[0]) {
        case 'resource':
          master.resources.push(line) // todo set (dict)
          break

        case 'feature':
          var name = words[1][0]
          var enabled = true
          if (name === '-') {
            enabled = false
            name = name.substring(1)
          }
          master.resources[name] = enabled
          break
        case 'profile':
          active_prof = parseInt(words[1], 10)
          break
        case 'rateprofile':
          active_rateprof = parseInt(words[1], 10)
          break
        case 'set':
          // assert (words.length === 4)
          // assert (words[2] == '=')

          var section_vars =
            active_rateprof >= 0
              ? rateprofiles_vars[active_rateprof]
              : active_prof >= 0
                ? profiles_vars[active_prof]
                : master.variables

          section_vars[words[1]] = words[3]

          break

        // todo: globals
        case 'board_name':
        case 'manufacturer_id':
        case 'mcu_id':
        case 'signature':
          master.globals[words[0]] = line
          break
      }
    }

    master.active_profile = active_prof
    master.active_rateprofile = active_rateprof
    return { master, profiles_vars, rateprofiles_vars, active_prof, active_rateprof }
  }
