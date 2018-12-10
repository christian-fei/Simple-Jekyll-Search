'use strict'
/* globals test beforeEach afterEach */
/* eslint-disable node/no-deprecated-api */

const { deepEqual } = require('assert')

const barElement = { title: 'bar', content: 'bar' }
const almostBarElement = { title: 'almostbar', content: 'almostbar' }
const loremElement = { title: 'lorem', content: 'lorem ipsum' }

const data = [barElement, almostBarElement, loremElement]

test('Repository', () => {
  let repository

  test('finds a simple string', () => {
    deepEqual(repository.search('bar'), [barElement, almostBarElement])
  })

  test('limits the search results to one even if found more', () => {
    repository.setOptions({ limit: 1 })
    deepEqual(repository.search('bar'), [barElement])
  })

  test('finds a long string', () => {
    deepEqual(repository.search('lorem ipsum'), [loremElement])
  })

  test('finds a fuzzy string', () => {
    repository.setOptions({ fuzzy: true })
    deepEqual(repository.search('lrm ism'), [loremElement])
  })

  test('returns empty search results when an empty criteria is provided', () => {
    deepEqual(repository.search(''), [])
  })

  test('excludes items from search', () => {
    repository.setOptions({
      exclude: ['almostbar']
    })
    deepEqual(repository.search('almostbar'), [])
  })

  test('excludes items from search', () => {
    repository.setOptions({
      sort: (a, b) => {
        return a.title.localeCompare(b.title)
      }
    })
    deepEqual(repository.search('r'), [almostBarElement, barElement, loremElement])
  })

  beforeEach(() => {
    repository = require('../src/Repository.js')
    repository.put(data)
  })

  afterEach(() => {
    repository.clear()
  })
})
