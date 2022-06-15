#!/usr/bin/env node

'use strict'

global.cfg = require('./.rproxy.json')
const { check, serve } = require('reserve')
const { writeFileSync } = require('fs')
const { $restricted, $site, $indirect } = require('./common')

function log (...args) {
  const now = new Date().toISOString()
  const fileName = `logs/${now.substring(0, 10)}.csv`
  writeFileSync(fileName, [now, ...args]
    .map(arg => arg.toString())
    .map(arg => arg.match(/"|;/) ? `"${arg.replace(/"|\//g, m => `\\${m}`)}"` : arg)
    .join(';') + '\n',
  {
    flag: 'a+'
  })
}

check({
  port: 80,
  mappings: [{
    custom: require('./is-restricted.js')
  }, {
    custom: require('./is-authenticated.js')
  }, {
    method: 'GET',
    match: '^/login',
    file: 'login.html'
  }, {
    method: 'POST',
    match: '^/login',
    custom: require('./login.js')
  }, {
    method: 'GET',
    match: '^/(index.*)?$',
    file: 'index.html'
  }, {
    'if-match': (request, url, match) => {
      if (!request[$site] || !request[$indirect]) {
        return false
      }
      match[2] = match[1]
      match[1] = request[$site].forward
      return match
    },
    match: /^\/(.*)/,
    url: '$1/$2'
  }, {
    'if-match': (request, url, match) => {
      if (!request[$site]) {
        return false
      }
      match[1] = request[$site].forward
      return match
    },
    match: /^\/([^\/]+)\/?(.*)?/,
    url: '$1/$2'
  }, {
    'http-status': 403,
    file: '403.html'
  }]
}).then(configuration => {
  serve(configuration)
    .on('ready', () => log('READY', 0))
    .on('incoming', event => !event.internal ? log('INCMG', event.id, JSON.stringify({ ...event, id: undefined })) : 0)
    .on('redirecting', ({ id, internal, type, redirect }) => {
      if (!internal) {
        if (typeof redirect === 'function') {
          redirect = redirect.name || 'anonymous'
        } else {
          redirect = redirect.toString()
        }
        log('RDRCT', id, JSON.stringify({ type, redirect }))
      }
    })
    .on('redirected', ({ id, internal, timeSpent, statusCode }) => !internal ? log('SERVE', id, JSON.stringify({ timeSpent, statusCode })) : 0)
    .on('error', ({ id, internal, reason }) => {
      if (!internal) {
        log('ERROR', id, reason && reason.toString() || '')
      }
    })
})
