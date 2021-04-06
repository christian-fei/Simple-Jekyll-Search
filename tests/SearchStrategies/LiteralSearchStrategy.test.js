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

test('matches exact words when exacts words with space in the search criteria', t => {
  t.deepEqual(LiteralSearchStrategy.matches('hello world test search text', 'hello world '), true)
})

test('does not matches multiple words if not exact words with space in the search criteria', t => {
  t.deepEqual(LiteralSearchStrategy.matches('hello world test search text', 'hello text world '), false)
})

test('matches a word that is partially contained in the search criteria', t => {
  t.deepEqual(LiteralSearchStrategy.matches('this tasty tester text', 'test'), true)
})

test('does not matches a word that is partially contained in the search criteria when followed by a space', t => {
  t.deepEqual(LiteralSearchStrategy.matches('this tasty tester text', 'test '), false)
})
