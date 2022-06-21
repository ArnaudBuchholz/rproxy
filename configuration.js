'use strict'

const { $name, $forward, $hostname } = require('./symbols')
const HOST_REGEXP = /https?:\/\/([^/:]*)/

global.cfg = require('./.rproxy.json')

Object.keys(cfg.sites).forEach(name => {
  const site = cfg.sites[name]
  site[$name] = name
  if (site.forward.startsWith('http')) {
    site[$hostname] = site.forward.match(HOST_REGEXP)[1] 
  } else {
    site[$forward] = site.forward
  }
})
