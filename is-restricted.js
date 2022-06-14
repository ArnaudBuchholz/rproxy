const { $restricted, $site } = require('./common')
const allowed = [
  '/index',
  '/login',
  '/403',
  '/favicon.ico'
]

module.exports = async function isRestricted (request, response) {
  if (allowed.some(prefix => request.url.startsWith(prefix))) {
    return
  }
  const siteName = Object.keys(cfg.sites)
    .filter(candidate => request.url.startsWith(`/${candidate}/`) || request.url === `/${candidate}`)[0]
  if (siteName) {
    request[$site] = cfg.sites[siteName]
    request[$restricted] = cfg.sites[siteName].restricted
  }
  request[$restricted] = true
}
