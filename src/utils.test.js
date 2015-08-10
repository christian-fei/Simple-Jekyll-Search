describe('utils', function() {

  var utils = require('./utils')

  it('#merge', function () {
    var defaultOptions = {foo: '',bar: ''}
    var options = {bar: 'overwritten'}
    var mergedOptions = utils.merge(defaultOptions, options)

    expect( mergedOptions.foo ).toEqual( defaultOptions.foo )
    expect( mergedOptions.bar ).toEqual( options.bar )
  })

})
