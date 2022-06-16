const dns = require('dns')
const { $site, $forward } = require('./common')
const log = require('./log')

const $dnsLookup = Symbol('dns-lookup')
const $dnsRefresh = Symbol('dns-refresh')
const DNS_TIMEOUT = 30 * 60 * 1000
const HOST_REGEXP = /https?:\/\/([^/:]*)/

module.exports = async function dnsLookup (request) {
  const site = request[$site]
  const now = Date.now()
  if (!site[$dnsLookup]) {
    const dnsRefresh = site[$dnsRefresh] || 0
    if (dnsRefresh > now) {
      return
    }
    site[$dnsRefresh] = now + DNS_TIMEOUT
    const hostname = site.forward.match(HOST_REGEXP)[1]
    site[$dnsLookup] = new Promise((resolve) => {
      log('DNS>>', 0, hostname)
      dns.lookup(hostname, function (err, address, family) {
        if (err) {
          log('DNS!!', 0, err)
          site[$forward] = site.forward
          resolve()
        }
        log('DNS<<', 0, address)
        site[$forward] = site.forward.replace(HOST_REGEXP, match => match.replace(hostname, address))
        resolve()
      })
    })
  }
  await site[$dnsLookup]
}