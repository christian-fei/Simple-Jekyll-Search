'use strict'
const {equal, ok} = require('assert')
test('utils', function () {
  var utils = require('./utils')

  test('#merge', function () {
    test('merges objects', function () {
      var defaultOptions = {foo: '', bar: ''}
      var options = {bar: 'overwritten'}
      var mergedOptions = utils.merge(defaultOptions, options)

      equal(mergedOptions.foo, defaultOptions.foo)
      equal(mergedOptions.bar, options.bar)
    })
  })

  test('#isJSON', function () {
    test('returns true if is JSON object', function () {
      ok(utils.isJSON({foo: 'bar'}))
    })
  })
})
