'use strict'
/* globals test */

const {equal} = require('assert')
const LiteralSearchStrategy = require('../../src/SearchStrategies/LiteralSearchStrategy')

test('LiteralSearchStrategy', () => {
  test('matches a word that are contained in the search criteria (single word)', () => {
    equal(LiteralSearchStrategy.matches('hello world test search text', 'world'), true)
  })

  test('don\'t matche a search that contain a word that is not in the text', () => {
    equal(LiteralSearchStrategy.matches('hello world test search text', 'hello my world'), false)
  })

  test('matches a word that are contained in the search criteria (multiple word)', () => {
    equal(LiteralSearchStrategy.matches('hello world test search text', 'hello text world'), true)
  })
})
