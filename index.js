#!/usr/bin/env node

'use strict'

global.cfg = require('./.rproxy.json')
const jose = require('jose')
const { log, check, serve } = require('reserve')
check({
  port: 80,
  mappings: [{
    custom: require('./is-authenticated.js')
  }, {
    method: 'GET',
    match: '/login',
    file: 'login.html'
  }, {
    file: '403.html'
  }]
}).then(configuration => {
  log(serve(configuration))
})
