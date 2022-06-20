'use strict'

const { body } = require('reserve')
const jose = require('jose')
const { read, names, set } = require('./cookies')
const toLogin = require('./to-login')
const { $requestId } = require('reserve/symbols')
const log = require('./log')

module.exports = async function login (request, response) {
  let user = '(none)'
  try {
    const payload = new URLSearchParams(await body(request))
    user = payload.get('u')
    const password = payload.get('p')
    const remember = payload.get('r')
    const redirect = read(request)[names.redirect] || '/'
    if (password !== cfg.users[user].password) {
      throw new Error('wrong password')
    }
    const jwt = await new jose.SignJWT({
      user
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(Date.now() + cfg.jwt.expiration * 1000)
      .sign(Buffer.from(cfg.jwt.secret))
    let maxAge
    if (remember === 'on') {
      maxAge = cfg.jwt.expiration
    }
    log('LOGIN', request[$requestId], user, redirect)
    response.writeHead(302, {
      location: `/${redirect}`,
      'set-cookie': set(names.jwt, jwt, maxAge)
    })
    response.end()
  } catch (e) {
    log('LOGKO', request[$requestId], user, e.toString())
    toLogin(request, response)
  }
}