'use strict'
/* globals test */

const { strictEqual, ok } = require('assert')

test('utils', () => {
  const utils = require('../src/utils')

  test('#merge', () => {
    test('merges objects', () => {
      const defaultOptions = { foo: '', bar: '' }
      const options = { bar: 'overwritten' }
      const mergedOptions = utils.merge(defaultOptions, options)

      strictEqual(mergedOptions.foo, defaultOptions.foo)
      strictEqual(mergedOptions.bar, options.bar)
    })
  })

  test('#isJSON', () => {
    test('returns true if is JSON object', () => {
      ok(utils.isJSON({ foo: 'bar' }))
    })
  })
})
