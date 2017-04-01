/* globals test beforeEach afterEach */
'use strict'

const {deepEqual} = require('assert')

var barElement = {title: 'bar', content: 'bar'}
var almostBarElement = {title: 'almostbar', content: 'almostbar'}
var loremElement = {title: 'lorem', content: 'lorem ipsum'}

var data = [barElement, almostBarElement, loremElement]

test('Repository', function () {
  var repository

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
    repository = require('./Repository.js')
    repository.put(data)
  })

  afterEach(function () {
    repository.clear()
  })
})
