const dns = require('dns')
const { $site, $hostname, $forward } = require('./symbols')
const { $requestId } = require('reserve/symbols')
const log = require('./log')

const $dnsCache = Symbol('dns-cache')
const REFRESH = 30 * 60 * 1000

module.exports = async function dnsLookup (request) {
  const site = request[$site]
  const hostname = site[$hostname]
  if (!hostname) {
    return
  }

  let cache = this[$dnsCache]
  if (!cache) {
    cache = {}
    this[$dnsCache] = cache
  }

  let cachedHost = cache[hostname]
  if (!cachedHost) {
    cachedHost = {
      name: hostname
    }
    cache[hostname] = cachedHost
  }

  const now = Date.now()
  if (!cachedHost.address || cachedHost.refresh < now) {
    cachedHost.refresh = now + REFRESH
    cachedHost.promise = new Promise((resolve) => {
      dns.lookup(hostname, function (err, address, family) {
        if (err) {
          log('DNSLK', request[$requestId], hostname, err)
          cachedHost.address = hostname
          resolve()
        }
        log('DNSLK', request[$requestId], hostname, address)
        cachedHost.address = address
        resolve()
      })
    })
  }
  await cachedHost.promise
  site[$forward] = site.forward.replace(hostname, cachedHost.address)
}
