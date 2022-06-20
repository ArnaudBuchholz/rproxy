'use strict'

const { names, read, set } = require('./cookies')

module.exports = (request, response) => {
  const redirect = read(request)[names.redirect] || encodeURIComponent(request.url.substring(1))
  response.writeHead(302, {
    location: '/login',
    'set-cookie': set(names.redirect, redirect)
  })
  response.end()
}
