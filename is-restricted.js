const { $restricted } = require('./common')
const allowed = ['/login', '/403', '/favicon.ico']

module.exports = async function isRestricted (request, response) {
  if (allowed.some(prefix => request.url.startsWith(prefix))) {
    return
  }
  const siteName = Object.keys(cfg.sites).filter(candidate => request.url.starts(`/${siteName}`))[0]
  if (siteName) {
    request[$restricted] = cfg.sites[siteName].restricted
  }
  request[$restricted] = true
}
