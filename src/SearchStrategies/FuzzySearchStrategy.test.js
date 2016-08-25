'use strict'
var expect = require('chai').expect;

describe('FuzzySearchStrategy', function () {
  var FuzzySearchStrategy

  beforeEach(function () {
    FuzzySearchStrategy = require('./FuzzySearchStrategy')
  })

  it('matches only on strings', function () {
    expect( FuzzySearchStrategy.matches({},'') ).to.eql(false)
    expect( FuzzySearchStrategy.matches(false,'') ).to.eql(false)
    expect( FuzzySearchStrategy.matches(true,'') ).to.eql(false)
    expect( FuzzySearchStrategy.matches(1,'') ).to.eql(false)
  })

  it('matches fuzzy', function () {
    expect( FuzzySearchStrategy.matches('fuzzy','fzy') ).to.eql(true)
    expect( FuzzySearchStrategy.matches('react','rct') ).to.eql(true)

    expect( FuzzySearchStrategy.matches('what the heck','wth?') ).to.eql(true)
  })
})
