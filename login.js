'use strict'

const { body } = require('reserve')
const jose = require('jose')
const { cookieNames, cookies, setCookie, toLogin } = require('./common')

module.exports = async function login (request, response) {
  try {
    const payload = new URLSearchParams(await body(request))
    const user = payload.get('u')
    const password = payload.get('p')
    const remember = payload.get('r')
    const redirect = cookies(request)[cookieNames.redirect]
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
    response.writeHead(302, {
      location: `/${redirect}`,
      'set-cookie': setCookie(cookieNames.jwt, jwt, maxAge)
    })
    response.end()
  } catch (e) {
    console.log(e)
    toLogin(request, response)
  }
}