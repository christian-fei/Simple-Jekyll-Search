'use strict'
var expect = require('chai').expect;

describe('FuzzySearchStrategy', function () {
  var FuzzySearchStrategy

  beforeEach(function () {
    FuzzySearchStrategy = require('./FuzzySearchStrategy')
  })

  it('does not match words that don\'t contain the search criteria', function () {
    expect( FuzzySearchStrategy.matches('fuzzy','fzyyy') ).to.eql(false)
    expect( FuzzySearchStrategy.matches('react','angular') ).to.eql(false)

    expect( FuzzySearchStrategy.matches('what the heck','wth?') ).to.eql(false)
  })

  it('matches words containing the search criteria', function () {
    expect( FuzzySearchStrategy.matches('fuzzy','fzy') ).to.eql(true)
    expect( FuzzySearchStrategy.matches('react','rct') ).to.eql(true)

    expect( FuzzySearchStrategy.matches('what the heck','wth') ).to.eql(true)
  })
})
