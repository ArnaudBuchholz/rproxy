'use strict'

const prefix = 'x-rproxy-'

module.exports = {
  names: {
    jwt: `${prefix}jwt`,
    redirect: `${prefix}redirect`,
    site: `${prefix}site`
  },

  read (request) {
    const cookiesStr = request.headers.cookie
    if (cookiesStr) {
      return cookiesStr
        .split(';')
        .map(cookie => cookie.trim())
        .reduce((cookies, cookie) => {
          const [, name, value] = cookie.match(/(\w+)=(.*)/)
          cookies[name] = decodeURI(value)
          return cookies
        }, {})
    }
    return {}
  },

  set (name, value, maxAge = 0) {
    if (maxAge) {
      maxAge = `; Max-Age= ${maxAge}`
    } else {
      maxAge = ''
    }
    return `${name}=${encodeURI(value)}${maxAge}; HttpOnly; SameSite=Strict`
  }
}
