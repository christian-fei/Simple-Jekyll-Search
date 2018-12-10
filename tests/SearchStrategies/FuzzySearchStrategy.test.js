'use strict'
/* globals test */

const { strictEqual } = require('assert')
const FuzzySearchStrategy = require('../../src/SearchStrategies/FuzzySearchStrategy')

test('FuzzySearchStrategy', () => {
  test('does not match words that don\'t contain the search criteria', () => {
    strictEqual(FuzzySearchStrategy.matches('fuzzy', 'fzyyy'), false)
    strictEqual(FuzzySearchStrategy.matches('react', 'angular'), false)

    strictEqual(FuzzySearchStrategy.matches('what the heck', 'wth?'), false)
  })

  test('matches words containing the search criteria', () => {
    strictEqual(FuzzySearchStrategy.matches('fuzzy', 'fzy'), true)
    strictEqual(FuzzySearchStrategy.matches('react', 'rct'), true)

    strictEqual(FuzzySearchStrategy.matches('what the heck', 'wth'), true)
  })

  test('is case insensitive', () => {
    strictEqual(FuzzySearchStrategy.matches('Different Cases', 'dc'), true)
    strictEqual(FuzzySearchStrategy.matches('UPPERCASE', 'upprcs'), true)
    strictEqual(FuzzySearchStrategy.matches('lowercase', 'lc'), true)
    strictEqual(FuzzySearchStrategy.matches('DiFfErENt cASeS', 'dc'), true)
  })
})
