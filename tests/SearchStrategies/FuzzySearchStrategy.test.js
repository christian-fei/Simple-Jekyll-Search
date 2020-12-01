const test = require('ava')
const FuzzySearchStrategy = require('../../src/SearchStrategies/FuzzySearchStrategy')

test('does not match words that don\'t contain the search criteria', t => {
  t.deepEqual(FuzzySearchStrategy.matches('fuzzy', 'fzyyy'), false)
  t.deepEqual(FuzzySearchStrategy.matches('react', 'angular'), false)

  t.deepEqual(FuzzySearchStrategy.matches('what the heck', 'wth?'), false)
})

test('matches words containing the search criteria', t => {
  t.deepEqual(FuzzySearchStrategy.matches('fuzzy', 'fzy'), true)
  t.deepEqual(FuzzySearchStrategy.matches('react', 'rct'), true)

  t.deepEqual(FuzzySearchStrategy.matches('what the heck', 'wth'), true)
})

test('is case insensitive', t => {
  t.deepEqual(FuzzySearchStrategy.matches('Different Cases', 'dc'), true)
  t.deepEqual(FuzzySearchStrategy.matches('UPPERCASE', 'upprcs'), true)
  t.deepEqual(FuzzySearchStrategy.matches('lowercase', 'lc'), true)
  t.deepEqual(FuzzySearchStrategy.matches('DiFfErENt cASeS', 'dc'), true)
})
