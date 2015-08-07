describe("Searcher", function() {
  var searcher

  beforeEach(function() {
    searcher = require('../../src/Searcher.js')
  })



  var barElement = {title:'bar', content: 'bar'}
  var almostBarElement = {title:'almostbar', content: 'almostbar'}
  var loremElement = {title:'lorem', content: 'lorem ipsum'}

  var data = [barElement,almostBarElement,loremElement]

  function FakeRepository(_data){
    var data = _data
    this.get = function(){ return data }
  }

  var store = new FakeRepository(data)

  it("should find a simple string", function() {
    expect(
      searcher.search(store,'bar')
    ).toEqual(
      [barElement,almostBarElement]
    )
  })

  it("should limit the search results to one even if found more", function() {
    searcher.setOptions({limit:1})
    expect(
      searcher.search(store,'bar')
    ).toEqual(
      [barElement]
    )
  })

  it("should find a long string", function() {
    expect(
      searcher.search(store,'lorem ipsum')
    ).toEqual(
      [loremElement]
    )
  })

  it("should find a fuzzy string", function() {
    searcher.setOptions({fuzzy:true})
    expect(
      searcher.search(store,'lrm ism')
    ).toEqual(
      [loremElement]
    )
  })

  it("should not search when an empty criteria is provided", function() {
    expect(
      searcher.search(store,'')
    ).toEqual(
      []
    )
  })

  it('should exclude items', function () {
    searcher.setOptions({
      exclude: ['almostbar']
    })
    expect(
      searcher.search(store,'almostbar')
    ).toEqual(
      []
    )
  })
})
