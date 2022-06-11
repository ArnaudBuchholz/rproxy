#!/usr/bin/env node

'use strict'

global.cfg = require('./.rproxy.json')
const { log, check, serve } = require('reserve')
check({
  port: 80,
  mappings: [{
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
    match: '^/index',
    file: 'index.html'
  }, {
    file: '403.html'
  }]
}).then(configuration => {
  log(serve(configuration), true)
})
