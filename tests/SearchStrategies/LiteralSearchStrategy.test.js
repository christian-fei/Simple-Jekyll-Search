const test = require('ava')

const LiteralSearchStrategy = require('../../src/SearchStrategies/LiteralSearchStrategy')

test('matches a word that is contained in the search criteria (single words)', t => {
  t.deepEqual(LiteralSearchStrategy.matches('hello world test search text', 'world'), true)
})

test('does not match if a word is not contained in the search criteria', t => {
  t.deepEqual(LiteralSearchStrategy.matches('hello world test search text', 'hello my world'), false)
})

test('matches a word that is contained in the search criteria (multiple words)', t => {
  t.deepEqual(LiteralSearchStrategy.matches('hello world test search text', 'hello text world'), true)
})
