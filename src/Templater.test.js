var sinon = require('sinon')

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
    it('calls middleware', function () {
      var spy = sinon.spy()

      templater.setOptions({
        middleware: spy
      })

      templater.compile({foo:'bar'})

      expect( spy.called ).toBe( true )
    })

    it('overwrites replacement by return value of middleware', function () {
      var middlewareOverwrite = 'middleware!'
      templater.setOptions({
        middleware: function(){
          return middlewareOverwrite
        }
      })

      var compiled = templater.compile({foo:'bar'})

      expect( compiled ).toEqual(middlewareOverwrite)
    })
  })

})
