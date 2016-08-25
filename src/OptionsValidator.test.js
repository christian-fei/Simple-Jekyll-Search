'use strict'
var expect = require('chai').expect;

describe('OptionsValidator', function() {
  var OptionsValidator

  beforeEach(function () {
    OptionsValidator = require('./OptionsValidator.js')
  })

  it('can be instanciated with options', function () {
    var requiredOptions = ['foo','bar']
    var optionsValidator = new OptionsValidator({
      required: requiredOptions
    })

    expect( optionsValidator.getRequiredOptions() ).to.equal( requiredOptions )
  })

  describe('#validate', function () {
    it('returns empty errors array for valid options', function () {
      var requiredOptions = ['foo','bar']
      var optionsValidator = new OptionsValidator({
        required: requiredOptions
      })

      var errors = optionsValidator.validate({
        foo: '',
        bar: '',
      })

      expect( errors.length ).to.eql( 0 )
    })
    it('returns array with errors for invalid options', function () {
      var requiredOptions = ['foo','bar']
      var optionsValidator = new OptionsValidator({
        required: requiredOptions
      })

      var errors = optionsValidator.validate({
        foo: '',
      })

      expect( errors.length ).to.eql( 1 )
    })
  })

})
