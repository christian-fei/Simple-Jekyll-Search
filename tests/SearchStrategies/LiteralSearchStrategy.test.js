'use strict'
/* globals test */

const {equal} = require('assert')
const LiteralSearchStrategy = require('../../src/SearchStrategies/LiteralSearchStrategy')

test('LiteralSearchStrategy', () => {
  test('matches a word that is contained in the search criteria (single words)', () => {
    equal(LiteralSearchStrategy.matches('hello world test search text', 'world'), true)
  })

  test('does not match if a word is not contained in the search criteria', () => {
    equal(LiteralSearchStrategy.matches('hello world test search text', 'hello my world'), false)
  })

  test('matches a word that is contained in the search criteria (multiple words)', () => {
    equal(LiteralSearchStrategy.matches('hello world test search text', 'hello text world'), true)
  })
})
