'use strict'
/* globals test */

const {equal, ok} = require('assert')

test('utils', () => {
  const utils = require('../src/utils')

  test('#merge', () => {
    test('merges objects', () => {
      const defaultOptions = {foo: '', bar: ''}
      const options = {bar: 'overwritten'}
      const mergedOptions = utils.merge(defaultOptions, options)

      equal(mergedOptions.foo, defaultOptions.foo)
      equal(mergedOptions.bar, options.bar)
    })
  })

  test('#isJSON', () => {
    test('returns true if is JSON object', () => {
      ok(utils.isJSON({foo: 'bar'}))
    })
  })
})
