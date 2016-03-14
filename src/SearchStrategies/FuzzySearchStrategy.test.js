'use strict'
describe('FuzzySearchStrategy', function () {
  var FuzzySearchStrategy

  beforeEach(function () {
    FuzzySearchStrategy = require('./FuzzySearchStrategy')
  })

  it('matches only on strings', function () {
    expect( FuzzySearchStrategy.matches({},'') ).toEqual(false)
    expect( FuzzySearchStrategy.matches(false,'') ).toEqual(false)
    expect( FuzzySearchStrategy.matches(true,'') ).toEqual(false)
    expect( FuzzySearchStrategy.matches(1,'') ).toEqual(false)
  })

  it('matches fuzzy', function () {
    expect( FuzzySearchStrategy.matches('fuzzy','fzy') ).toEqual(true)
    expect( FuzzySearchStrategy.matches('react','rct') ).toEqual(true)
    expect( FuzzySearchStrategy.matches('what the heck','wth?') ).toEqual(true)
  })
  
  it('does not match all strings just because some letters match', function () {
    expect( FuzzySearchStrategy.matches('active', 'aaaaaa') ).toEqual(false)
    expect( FuzzySearchStrategy.matches('firebase', 'fe') ).toEqual(false),
    expect( FuzzySearchStrategy.matches('this should not be matched', 'tsnd') ).toEqual(false)
  })
})
