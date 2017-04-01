/* globals test beforeEach */
'use strict'
const {equal} = require('assert')

test('Templater', function () {
  var templater

  test('renders the template with the provided data', function () {
    equal(templater.compile({foo: 'bar'}), 'bar')

    templater.setOptions({
      template: '<a href="{url}">url</a>'
    })

    equal(templater.compile({url: 'http://google.com'}), '<a href="http://google.com">url</a>')
  })

  test('replaces not found properties with the original pattern', function () {
    var template = '{foo}'
    templater.setOptions({
      template: template
    })
    equal(templater.compile({x: 'bar'}), template)
  })

  test('allows custom patterns to be set', function () {
    templater.setOptions({
      template: '{{foo}}',
      pattern: /\{\{(.*?)\}\}/g
    })
    equal(templater.compile({foo: 'bar'}), 'bar')
  })

  test('middleware', function () {
    test('middleware gets parameter to return new replacement', function () {
      templater.setOptions({
        template: '{foo} - {bar}',
        middleware: function (prop, value, template) {
          if (prop === 'bar') {
            return value.replace(/^\//, '')
          }
        }
      })

      var compiled = templater.compile({foo: 'foo', bar: '/leading/slash'})

      equal(compiled, 'foo - leading/slash')
    })
  })

  beforeEach(function () {
    templater = require('./Templater.js')
    templater.setOptions({
      template: '{foo}',
      pattern: /\{(.*?)\}/g
    })
  })
})
