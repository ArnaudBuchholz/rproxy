'use strict'

const { writeFileSync } = require('fs')

module.exports = function log (...args) {
  const now = Date.now()
  const today = new Date(now)
  today.setUTCHours(0)
  today.setUTCMinutes(0)
  today.setUTCSeconds(0)
  today.setUTCMilliseconds(0)
  const fileName = `logs/${new Date(now).toISOString().substring(0, 10)}.csv`
  writeFileSync(fileName, [now - today, ...args]
    .map(arg => arg.toString())
    .map(arg => arg.match(/"|;/) ? `"${arg.replace(/"|\//g, m => `\\${m}`)}"` : arg)
    .join(';') + '\n',
  {
    flag: 'a+'
  })
}
