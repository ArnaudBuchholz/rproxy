const { $restricted, $site, $siteName, $indirect } = require('./common')
const allowed = [
  '/index',
  '/login',
  '/403',
  '/favicon.ico'
]

const checkSite = (request, url = request.url) => {
  const siteName = Object.keys(cfg.sites)
    .filter(candidate => url.startsWith(`/${candidate}/`) || url === `/${candidate}`)[0]
  if (siteName) {
    request[$siteName] = siteName
    request[$site] = cfg.sites[siteName]
    request[$restricted] = cfg.sites[siteName].restricted
    return true
  }
  return false
}

module.exports = async function isRestricted (request, response) {
  if (allowed.some(prefix => request.url.startsWith(prefix))) {
    return
  }
  if (checkSite(request)) {
    return
  }
  if (request.headers.referer) {
    try {
      const referer = request.headers.referer.match(/https?:\/\/[^/]*(\/.*)/)[1]
      if (checkSite(request, referer)) {
        request[$indirect] = true
      }
    } catch (e) {
      // ignore
    }
  }
}
