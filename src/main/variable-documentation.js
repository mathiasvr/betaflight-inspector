const fs = require('fs')
const path = require('path')
// read variable documentation file
// TODO: async? or just import
const docs = JSON.parse(fs.readFileSync(path.join(__dirname, '../doc-vars.json')))

exports.annotateWithVariableDocumentation = function (vars) {
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
  const cliVars = []
  for (const [key, props] of Object.entries(vars)) {
    cliVars.push({ name: key, ...props })
  }

  return cliVars
}
