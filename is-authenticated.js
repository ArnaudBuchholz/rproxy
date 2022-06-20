const jose = require('jose')
const { read, names } = require('./cookies')
const { $site } = require('./symbols')
const { $requestId } = require('reserve/symbols')
const log = require('./log')
const toLogin = require('./to-login')

module.exports = async function isAuthenticated (request, response) {
  if (!request[$site].restricted) {
    return
  }
  try {
    const token = read(request)[names.jwt]
    const { payload } = await jose.jwtVerify(token, Buffer.from(cfg.jwt.secret))
    request.jwt = payload
    log('AUTHN', request[$requestId], payload.user)
  } catch (e) {
    toLogin(request, response)
  }
}
