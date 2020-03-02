// read variable documentation file
const docs = require('../doc-vars.json')

exports.annotateWithVariableDocumentation = function (vars) {
  // add documentation properties to variables
  for (const key of Object.keys(vars)) {
    if (docs[key]) {
      ['desc', 'aka', 'unit'].forEach((prop) => {
        if (prop in docs[key]) vars[key][prop] = docs[key][prop]
      })
    }
  }

  // TODO: move?
  // convert to array
  const cliVars = []
  for (const [key, props] of Object.entries(vars)) {
    cliVars.push({ name: key, ...props })
  }

  return cliVars
}
