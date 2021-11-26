const test = require('ava')

const barElement = { title: 'bar', content: 'bar' }
const almostBarElement = { title: 'almostbar', content: 'almostbar' }
const loremElement = { title: 'lorem', content: 'lorem ipsum' }

const data = [barElement, almostBarElement, loremElement]

let repository

test.beforeEach(() => {
  repository = require('../src/Repository.js')
  repository.put(data)
})

test.afterEach(() => {
  repository.clear()
})

test('finds a simple string', t => {
  t.deepEqual(repository.search('bar'), [barElement, almostBarElement])
})

test('limits the search results to one even if found more', t => {
  repository.setOptions({ limit: 1 })
  t.deepEqual(repository.search('bar'), [barElement])
})

test('finds a long string', t => {
  t.deepEqual(repository.search('lorem ipsum'), [loremElement])
})

test('finds a fuzzy string', t => {
  repository.setOptions({ fuzzy: true })
  t.deepEqual(repository.search('lrm ism'), [loremElement])
})

test('returns empty search results when an empty criteria is provided', t => {
  t.deepEqual(repository.search(''), [])
})

test('excludes items from search #1', t => {
  repository.setOptions({
    exclude: ['almostbar']
  })
  t.deepEqual(repository.search('almostbar'), [])
})

test('excludes items from search #2', t => {
  repository.setOptions({
    sort: (a, b) => {
      return a.title.localeCompare(b.title)
    }
  })
  t.deepEqual(repository.search('r'), [almostBarElement, barElement, loremElement])
})

test('sort order for more candidates than limit', t => {
  const expectedResult1 = { title: 'JavaScript', content: 'JavaScript Awesome' }
  const expectedResult2 = { title: 'JavaScript', content: 'JavaScript Cool' }
  const expectedResult3 = { title: 'JavaScript', content: 'JavaScript Easy' }
  const items = [
    { title: 'JavaScript', content: 'JavaScript Fun' },
    { title: 'JavaScript', content: 'JavaScript Rocks' },
    expectedResult3,
    { title: 'JavaScript', content: 'JavaScript Powerful' },
    { title: 'JavaScript', content: 'JavaScript Works' },
    { title: 'JavaScript', content: 'JavaScript For frontend and backend' },
    expectedResult2,
    { title: 'JavaScript', content: 'JavaScript For Jekyll' },
    expectedResult1
  ]

  for (let i = 0; i < 5; i++) {
    // irrespective of the insertion order, the result order should not change
    repository.clear()
    items.sort((a, b) => Math.random() - 0.5)// shuffle items
    repository.put(items)
    repository.setOptions({ limit: 3, sort: (a, b) => a.content.localeCompare(b.content) })
    t.deepEqual(repository.search('JavaScript'), [expectedResult1, expectedResult2, expectedResult3])
  }
})
