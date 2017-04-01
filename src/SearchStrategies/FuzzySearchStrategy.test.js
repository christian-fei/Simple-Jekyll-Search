/* globals test */
'use strict'
const {equal} = require('assert')
const FuzzySearchStrategy = require('./FuzzySearchStrategy')

test('FuzzySearchStrategy', function () {
  test('does not match words that don\'t contain the search criteria', function () {
    equal(FuzzySearchStrategy.matches('fuzzy', 'fzyyy'), false)
    equal(FuzzySearchStrategy.matches('react', 'angular'), false)

    equal(FuzzySearchStrategy.matches('what the heck', 'wth?'), false)
  })

  test('matches words containing the search criteria', function () {
    equal(FuzzySearchStrategy.matches('fuzzy', 'fzy'), true)
    equal(FuzzySearchStrategy.matches('react', 'rct'), true)

    equal(FuzzySearchStrategy.matches('what the heck', 'wth'), true)
  })
})
