const { $site, $referer } = require('./symbols')
const { $requestId } = require('reserve/symbols')
const { names, read } = require('./cookies')
const log = require('./log')

const allowed = [
  '/index',
  '/login',
  '/403',
  '/favicon.ico'
]

const defaultSite = {
  restricted: false,
  forward: '/'
}

const checkSite = (request, url = request.url) => {
  const siteName = Object.keys(cfg.sites)
    .filter(candidate => url.startsWith(`/${candidate}/`) || url === `/${candidate}`)[0]
  if (siteName) {
    request[$site] = cfg.sites[siteName]
    return true
  }
  return false
}

function resolve (request) {
  if (allowed.some(prefix => request.url.startsWith(prefix))) {
    request[$site] = defaultSite
    return
  }
  if (checkSite(request)) {
    return
  }
  const cookies = read(request)
  const siteName = cookies[names.site]
  if (siteName) {
    request[$site] = cfg.sites[siteName] || defaultSite
    return
  }
  if (request.headers.referer) {
    try {
      const referer = request.headers.referer.match(/https?:\/\/[^/]*(\/.*)/)[1]
      if (checkSite(request, referer)) {
        request[$referer] = true
      }
    } catch (e) {
      // ignore
    }
  }
}

module.exports = async function identifySite (request) {
  resolve(request)
  const site = request[$site]
  log('IDSIT', request[$requestId], site[$name] || '(default)', site.restricted)
}
