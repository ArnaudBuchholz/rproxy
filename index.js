require('dotenv').config()
const { log, check, serve } = require('reserve')
check({
  port: 80,
  mappings: [{
    method: 'GET',
    match: '/login$',
    file: 'login.html'
  }, {
    file: '403.html'
  }]
}).then(configuration => {
  log(serve(configuration))
})
