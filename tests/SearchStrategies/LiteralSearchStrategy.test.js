'use strict'
/* globals test */

const { strictEqual } = require('assert')
const LiteralSearchStrategy = require('../../src/SearchStrategies/LiteralSearchStrategy')

test('LiteralSearchStrategy', () => {
  test('matches a word that is contained in the search criteria (single words)', () => {
    strictEqual(LiteralSearchStrategy.matches('hello world test search text', 'world'), true)
  })

  test('does not match if a word is not contained in the search criteria', () => {
    strictEqual(LiteralSearchStrategy.matches('hello world test search text', 'hello my world'), false)
  })

  test('matches a word that is contained in the search criteria (multiple words)', () => {
    strictEqual(LiteralSearchStrategy.matches('hello world test search text', 'hello text world'), true)
  })
})
