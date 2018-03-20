'use strict'
/* globals test beforeEach */

const {equal} = require('assert')

test('Templater', () => {
  let templater

  test('renders the template with the provided data', () => {
    equal(templater.compile({foo: 'bar'}), 'bar')

    templater.setOptions({
      template: '<a href="{url}">url</a>'
    })

    equal(templater.compile({url: 'http://google.com'}), '<a href="http://google.com">url</a>')
  })

  test('replaces not found properties with the original pattern', () => {
    const template = '{foo}'
    templater.setOptions({
      template
    })
    equal(templater.compile({x: 'bar'}), template)
  })

  test('allows custom patterns to be set', () => {
    templater.setOptions({
      template: '{{foo}}',
      pattern: /\{\{(.*?)\}\}/g
    })
    equal(templater.compile({foo: 'bar'}), 'bar')
  })

  test('middleware', () => {
    test('middleware gets parameter to return new replacement', () => {
      templater.setOptions({
        template: '{foo} - {bar}',
        middleware (prop, value) {
          if (prop === 'bar') {
            return value.replace(/^\//, '')
          }
        }
      })

      const compiled = templater.compile({foo: 'foo', bar: '/leading/slash'})

      equal(compiled, 'foo - leading/slash')
    })
  })

  beforeEach(() => {
    templater = require('../src/Templater.js')
    templater.setOptions({
      template: '{foo}',
      pattern: /\{(.*?)\}/g
    })
  })
})
