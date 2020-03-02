exports.parseGet = function (txt) {
  let lines = txt.split('\n')

  lines = lines.filter(l => l !== '')

  const variablesInfo = {}

  for (let i = 0; i < lines.length; i++) {
    const matches = /^([^ ]+) = (.+)$/.exec(lines[i])
    if (!matches) {
      console.warn(`Warning: Skipping line ${i}: ${lines[i]}`)
      continue
    }

    const [, name, value] = matches

    variablesInfo[name] = { default: value }

    // if (value !== '-') {
    // variablesInfo[name].default = value
    // }

    i++

    let section = 'master'
    const word = lines[i].split(' ')[0]
    if (['profile', 'rateprofile'].includes(word)) {
      section = word
      i++
    }

    const parts = lines[i].split(':')
    switch (parts[0]) {
      case 'Allowed values':
        variablesInfo[name].allowed = parts[1].split(',').map(x => x.trim())
        break
      case 'Allowed range':
        variablesInfo[name].range = parts[1].split(' - ').map(x => parseInt(x, 10))
        variablesInfo[name].default = parseInt(variablesInfo[name].default, 10)
        break
      case 'Array length':
        variablesInfo[name].datatype = `Array[${parts[1].trim()}]`
        break
        // TODO: for bf 4.2 I think
        // case 'String length':
        //   break
      default:
        i--
    }

    variablesInfo[name].section = section
  }

  return variablesInfo
}
