#!/usr/bin/env node

'use strict'

require('./configuration')
const { check, serve } = require('reserve')
const { $site } = require('./symbols')
const log = require('./log')

check({
  port: 80,
  mappings: [{
    custom: require('./identify-site.js')
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
    custom: require('./dns-lookup.js')
  }, {
    'if-match': (request, url, match) => {
      if (!request[$site] || !request[$indirect]) {
        return false
      }
      match[2] = match[1]
      match[1] = request[$siteName]
      return match
    },
    match: /^\/(.*)/,
    status: 307,
    headers: {
      location: '/$1/$2'
    }
  }, {
    'if-match': (request, url, match) => {
      if (!request[$site]) {
        return false
      }
      match[1] = request[$site][$forward]
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
    .on('ready', () => log('READY'))
    .on('incoming', event => !event.internal ? log('INCMG', event.id, JSON.stringify({ ...event, id: undefined })) : 0)
    .on('redirected', ({ id, internal, timeSpent, statusCode }) => !internal ? log('SERVE', id, JSON.stringify({ timeSpent, statusCode })) : 0)
    .on('error', ({ id, internal, reason }) => {
      if (!internal) {
        log('ERROR', id, reason && reason.toString() || '')
      }
    })
})
