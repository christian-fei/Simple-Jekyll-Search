'use strict'
var expect = require('chai').expect;

describe('utils', function() {
  var utils = require('./utils')

  describe('#merge', function () {
    it('merges objects', function () {
      var defaultOptions = {foo: '',bar: ''}
      var options = {bar: 'overwritten'}
      var mergedOptions = utils.merge(defaultOptions, options)

      expect( mergedOptions.foo ).to.eql( defaultOptions.foo )
      expect( mergedOptions.bar ).to.eql( options.bar )
    })
  })

  describe('#isJSON', function () {
    it('returns true if is JSON object', function () {
      expect( utils.isJSON({foo:'bar'}) ).to.be.true
    })
  })
})
