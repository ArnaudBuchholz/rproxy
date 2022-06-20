'use strict'

const { $name } = require('./symbols')

global.cfg = require('./.rproxy.json')

Object.keys(cfg.sites).forEach(name => {
  cfg.sites[name][$name] = name
})
