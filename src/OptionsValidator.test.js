/* globals test */
'use strict'
const OptionsValidator = require('./OptionsValidator.js')
const {equal} = require('assert')
test('OptionsValidator', function () {
  test('can be instanciated with options', function () {
    var requiredOptions = ['foo', 'bar']
    var optionsValidator = new OptionsValidator({
      required: requiredOptions
    })

    equal(optionsValidator.getRequiredOptions(), requiredOptions)
  })

  test('#validate', function () {
    test('returns empty errors array for valid options', function () {
      var requiredOptions = ['foo', 'bar']
      var optionsValidator = new OptionsValidator({
        required: requiredOptions
      })

      var errors = optionsValidator.validate({
        foo: '',
        bar: ''
      })

      equal(errors.length, 0)
    })
    test('returns array with errors for invalid options', function () {
      var requiredOptions = ['foo', 'bar']
      var optionsValidator = new OptionsValidator({
        required: requiredOptions
      })

      var errors = optionsValidator.validate({
        foo: ''
      })

      equal(errors.length, 1)
    })
  })
})
