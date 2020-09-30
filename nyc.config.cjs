const config = require('@nodutilus/nyc-config')

module.exports = Object.assign({}, config, {
  'include': [
    'lib',
    'test'
  ],
  'temp-dir': './build/nyc_output',
  'report-dir': './build/coverage'
})
