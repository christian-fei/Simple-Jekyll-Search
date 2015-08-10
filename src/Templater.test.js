describe('Templater', function() {
  var templater

  beforeEach(function() {
    templater = require('./Templater.js')
  })

  it('renders the template with the provided data', function() {
    expect(
      templater.compile('{foo}',{foo:'bar'})
    ).toEqual(
      'bar'
    )

    expect(
      templater.compile('<a href="{url}">url</a>',{url:'http://google.com'})
    ).toEqual(
      '<a href="http://google.com">url</a>'
    )
  })

  it('replaces not found properties with the original pattern', function() {
    var template = '{foo}'
    expect(
      templater.compile(template,{x:'bar'})
    ).toEqual(
      template
    )
  })

  it('allows custom patterns to be set', function() {
    templater.setOptions({
      templatePattern:/\{\{(.*?)\}\}/g
    })
    expect(
      templater.compile('{{foo}}',{foo:'bar'})
    ).toEqual(
      'bar'
    )
  })
})
