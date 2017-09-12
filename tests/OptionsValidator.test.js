/* globals test */

'use strict'

const OptionsValidator = require('../src/OptionsValidator.js')
const {equal} = require('assert')

test('OptionsValidator', function () {
  test('can be instanciated with options', function () {
    const requiredOptions = ['foo', 'bar']
    const optionsValidator = new OptionsValidator({
      required: requiredOptions
    })

    equal(optionsValidator.getRequiredOptions(), requiredOptions)
  })

  test('#validate', function () {
    test('returns empty errors array for valid options', function () {
      const requiredOptions = ['foo', 'bar']
      const optionsValidator = new OptionsValidator({
        required: requiredOptions
      })

      const errors = optionsValidator.validate({
        foo: '',
        bar: ''
      })

      equal(errors.length, 0)
    })
    test('returns array with errors for invalid options', function () {
      const requiredOptions = ['foo', 'bar']
      const optionsValidator = new OptionsValidator({
        required: requiredOptions
      })

      const errors = optionsValidator.validate({
        foo: ''
      })

      equal(errors.length, 1)
    })
  })
})
