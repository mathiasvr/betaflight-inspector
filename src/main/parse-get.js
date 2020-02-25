// TODO: handle/manage errors
// TODO: this is a quick translation of Python code,
//       relies on many assumptions and needs rewrite

// export async
module.exports.parseGet =
function parseGet (txt) {
  let lines = txt.split('\n')

  lines = lines.filter(l => l !== '')

  const variablesInfo = {}

  let i = 0
  while (i < lines.length) {
    let matches = /(.+) = (.+)/.exec(lines[i])

    if (matches) {
      const [, name, value] = matches

      variablesInfo[name] = {}

      // if (value !== '-') {
      variablesInfo[name].default = value
      // }

      i += 1

      let section = 'master'
      if (lines[i].startsWith('profile')) {
        section = 'profile'
        i += 1
      } else if (lines[i].startsWith('rateprofile')) {
        section = 'rateprofile'
        i += 1
      }

      matches = /Allowed (.+): (.+)/.exec(lines[i])
      if (matches) {
        if (matches[1] === 'values') {
          variablesInfo[name].allowed = matches[2].split(',').map(x => x.trim())
        } else { // 'range'
          variablesInfo[name].range = matches[2].split(' - ').map(x => parseInt(x, 10))

          if (variablesInfo[name].range.length !== 2) {
            throw new Error('Get parse exception: invalid range length')
          }
        }
      } else {
        matches = /Array length: (.+)/.exec(lines[i])
        if (matches) {
          variablesInfo[name].datatype = `Array[${matches[1]}]`
        } else {
          // reparse entry
          i -= 1
        }

        variablesInfo[name].section = section
      }
    } else {
      throw new Error('Get parse exception on line ' + i + ': ' + lines[i])
    }

    i += 1
  }

  return variablesInfo
}
