'use strict'
/* globals test */

const { strictEqual } = require('assert')
const OptionsValidator = require('../src/OptionsValidator.js')

test('OptionsValidator', () => {
  test('can be instanciated with options', () => {
    const requiredOptions = ['foo', 'bar']
    const optionsValidator = new OptionsValidator({
      required: requiredOptions
    })

    strictEqual(optionsValidator.getRequiredOptions(), requiredOptions)
  })

  test('#validate', () => {
    test('returns empty errors array for valid options', () => {
      const requiredOptions = ['foo', 'bar']
      const optionsValidator = new OptionsValidator({
        required: requiredOptions
      })

      const errors = optionsValidator.validate({
        foo: '',
        bar: ''
      })

      strictEqual(errors.length, 0)
    })
    test('returns array with errors for invalid options', () => {
      const requiredOptions = ['foo', 'bar']
      const optionsValidator = new OptionsValidator({
        required: requiredOptions
      })

      const errors = optionsValidator.validate({
        foo: ''
      })

      strictEqual(errors.length, 1)
    })
  })
})
