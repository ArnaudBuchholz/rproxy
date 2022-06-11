const jose = require('jose')
const {
  cookieNames,
  cookies,
  unauthorized,
  toLogin
} = require('./common')

module.exports = async function isAuthenticated (request, response) {
  if (unauthorized.some(url => request.url.startsWith(url))) {
    return
  }
  try {
    const token = cookies(request)[cookieNames.jwt]
    const { payload } = await jose.jwtVerify(token, Buffer.from(cfg.jwt.secret))
    request.jwt = payload
  } catch (e) {
    toLogin(request, response)
  }
}
