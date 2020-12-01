const { serial: test, beforeEach } = require('ava')

let templater

beforeEach(() => {
  templater = require('../src/Templater.js')
  templater.setOptions({
    template: '{foo}',
    pattern: /\{(.*?)\}/g
  })
})

test('renders the template with the provided data', t => {
  t.deepEqual(templater.compile({ foo: 'bar' }), 'bar')

  templater.setOptions({
    template: '<a href="{url}">url</a>'
  })

  t.deepEqual(templater.compile({ url: 'http://google.com' }), '<a href="http://google.com">url</a>')
})

test('renders the template with the provided data and query', t => {
  t.deepEqual(templater.compile({ foo: 'bar' }), 'bar')

  templater.setOptions({
    template: '<a href="{url}?query={query}">url</a>'
  })

  t.deepEqual(templater.compile({ url: 'http://google.com', query: 'bar' }), '<a href="http://google.com?query=bar">url</a>')
})

test('replaces not found properties with the original pattern', t => {
  const template = '{foo}'
  templater.setOptions({
    template
  })
  t.deepEqual(templater.compile({ x: 'bar' }), template)
})

test('allows custom patterns to be set', t => {
  templater.setOptions({
    template: '{{foo}}',
    pattern: /\{\{(.*?)\}\}/g
  })
  t.deepEqual(templater.compile({ foo: 'bar' }), 'bar')
})

test('middleware gets parameter to return new replacement', t => {
  templater.setOptions({
    template: '{foo} - {bar}',
    middleware (prop, value) {
      if (prop === 'bar') {
        return value.replace(/^\//, '')
      }
    }
  })

  const compiled = templater.compile({ foo: 'foo', bar: '/leading/slash' })

  t.deepEqual(compiled, 'foo - leading/slash')
})
