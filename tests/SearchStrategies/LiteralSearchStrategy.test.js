'use strict'
/* globals test */

const {equal} = require('assert')
const LiteralSearchStrategy = require('../../src/SearchStrategies/LiteralSearchStrategy')

test('LiteralSearchStrategy', () => {
  test('matches words that are contained in the search criteria', () => {
    equal(LiteralSearchStrategy.matches('hello world', 'world'), true)
  })

  test('matches words that are contained in the search criteria (single word)', () => {
    equal(LiteralSearchStrategy.matches('hello world', 'hello my world'), true)
  })
})
