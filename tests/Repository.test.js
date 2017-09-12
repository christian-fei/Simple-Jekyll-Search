/* globals test beforeEach afterEach */

'use strict'

const {deepEqual} = require('assert')

const barElement = {title: 'bar', content: 'bar'}
const almostBarElement = {title: 'almostbar', content: 'almostbar'}
const loremElement = {title: 'lorem', content: 'lorem ipsum'}

const data = [barElement, almostBarElement, loremElement]

test('Repository', function () {
  let repository

  test('finds a simple string', function () {
    deepEqual(repository.search('bar'), [barElement, almostBarElement])
  })

  test('limits the search results to one even if found more', function () {
    repository.setOptions({limit: 1})
    deepEqual(repository.search('bar'), [barElement])
  })

  test('finds a long string', function () {
    deepEqual(repository.search('lorem ipsum'), [loremElement])
  })

  test('finds a fuzzy string', function () {
    repository.setOptions({fuzzy: true})
    deepEqual(repository.search('lrm ism'), [loremElement])
  })

  test('returns empty search results when an empty criteria is provided', function () {
    deepEqual(repository.search(''), [])
  })

  test('excludes items from search', function () {
    repository.setOptions({
      exclude: ['almostbar']
    })
    deepEqual(repository.search('almostbar'), [])
  })

  beforeEach(function () {
    repository = require('../src/Repository.js')
    repository.put(data)
  })

  afterEach(function () {
    repository.clear()
  })
})
