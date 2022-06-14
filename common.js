const cookieNames = {
  jwt: 'jwt',
  redirect: 'redirect'
}

const cookies = (request, name) => {
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
}

const setCookie = (name, value, maxAge = 0) => {
  if (maxAge) {
    maxAge = `; Max-Age= ${maxAge}`
  } else {
    maxAge = ''
  }
  return `${name}=${encodeURI(value)}${maxAge}; HttpOnly; SameSite=Strict`
}

module.exports = {
  $restricted: Symbol('restricted'),
  $site: Symbol('site'),
  cookieNames,
  cookies,
  setCookie,
  toLogin: (request, response) => {
    const redirect = cookies(request)[cookieNames.redirect] || encodeURIComponent(request.url.substring(1))
    response.writeHead(302, {
      location: '/login',
      'set-cookie': setCookie(cookieNames.redirect, redirect)
    })
    response.end()
  }
}
