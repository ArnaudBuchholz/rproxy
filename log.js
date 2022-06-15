'use strict'

const { writeFileSync } = require('fs')

module.exports = function log (...args) {
  const now = new Date().toISOString()
  const fileName = `logs/${now.substring(0, 10)}.csv`
  writeFileSync(fileName, [now, ...args]
    .map(arg => arg.toString())
    .map(arg => arg.match(/"|;/) ? `"${arg.replace(/"|\//g, m => `\\${m}`)}"` : arg)
    .join(';') + '\n',
  {
    flag: 'a+'
  })
}
