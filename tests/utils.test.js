/* globals test */

'use strict'

const {equal, ok} = require('assert')

test('utils', function () {
  const utils = require('../src/utils')

  test('#merge', function () {
    test('merges objects', function () {
      const defaultOptions = {foo: '', bar: ''}
      const options = {bar: 'overwritten'}
      const mergedOptions = utils.merge(defaultOptions, options)

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
