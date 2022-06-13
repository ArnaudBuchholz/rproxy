const jose = require('jose')
const {
  $restricted,
  cookieNames,
  cookies,
  toLogin
} = require('./common')

module.exports = async function isAuthenticated (request, response) {
  if (!request[$restricted]) {
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
