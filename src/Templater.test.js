'use strict'
describe('Templater', function() {
  var templater

  beforeEach(function() {
    templater = require('./Templater.js')
    templater.setOptions({
      template: '{foo}',
      pattern: /\{(.*?)\}/g
    })
  })

  it('renders the template with the provided data', function() {
    expect(
      templater.compile({foo:'bar'})
    ).toEqual(
      'bar'
    )

    templater.setOptions({
      template: '<a href="{url}">url</a>'
    })

    expect(
      templater.compile({url:'http://google.com'})
    ).toEqual(
      '<a href="http://google.com">url</a>'
    )
  })

  it('replaces not found properties with the original pattern', function() {
    var template = '{foo}'
    templater.setOptions({
      template: template
    })
    expect(
      templater.compile({x:'bar'})
    ).toEqual(
      template
    )
  })

  it('allows custom patterns to be set', function() {
    templater.setOptions({
      template: '{{foo}}',
      pattern: /\{\{(.*?)\}\}/g
    })
    expect(
      templater.compile({foo:'bar'})
    ).toEqual(
      'bar'
    )
  })

  describe('middleware', function () {
    it('middleware gets parameter to return new replacement', function () {
      var middlewareOverwrite = 'middleware!'
      templater.setOptions({
        template: '{foo} - {bar}',
        middleware: function(prop, value, template){
          if( prop === 'bar' ){
            return value.replace(/^\//, '')
          }
        }
      })

      var compiled = templater.compile({foo:'foo', bar: '/leading/slash'})

      expect( compiled ).toEqual('foo - leading/slash')
    })
  })

})
