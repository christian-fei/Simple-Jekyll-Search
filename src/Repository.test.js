'use strict'

var barElement = {title:'bar', content: 'bar'}
var almostBarElement = {title:'almostbar', content: 'almostbar'}
var loremElement = {title:'lorem', content: 'lorem ipsum'}

var data = [barElement,almostBarElement,loremElement]

describe('Repository', function() {
  var repository

  beforeEach(function() {
    repository = require('./Repository.js')
    repository.put(data)
  })

  afterEach(function () {
    repository.clear()
  })

  it('finds a simple string', function() {
    expect(
      repository.search('bar')
    ).toEqual(
      [barElement,almostBarElement]
    )
  })

  it('limits the search results to one even if found more', function() {
    repository.setOptions({limit:1})
    expect(
      repository.search('bar')
    ).toEqual(
      [barElement]
    )
  })

  it('finds a long string', function() {
    expect(
      repository.search('lorem ipsum')
    ).toEqual(
      [loremElement]
    )
  })

  it('finds a fuzzy string', function() {
    repository.setOptions({fuzzy:true})
    expect(
      repository.search('lrm ism')
    ).toEqual(
      [loremElement]
    )
  })

  it('returns empty search results when an empty criteria is provided', function() {
    expect(
      repository.search('')
    ).toEqual(
      []
    )
  })

  it('excludes items from search', function () {
    repository.setOptions({
      exclude: ['almostbar']
    })
    expect(
      repository.search('almostbar')
    ).toEqual(
      []
    )
  })
})
