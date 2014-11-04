describe("Searcher", function() {
  var Searcher = require('../../src/Searcher.js');
  var searcher;

  beforeEach(function() {
    searcher = new Searcher;
  });



  var barElement = {title:'bar', content: 'bar'};
  var almostBarElement = {title:'almostbar', content: 'almostbar'};
  var loremElement = {title:'lorem', content: 'lorem ipsum'};

  var data = [barElement,almostBarElement,loremElement];

  function FakeStore(_data){
    var data = _data;
    this.get = function(){ return data; };
  }

  var store = new FakeStore(data);
  
  it("should find a simple string", function() {
    expect(
      searcher.search(store,'bar')
    ).toEqual(
      [barElement,almostBarElement]
    );
  });

  it("should limit the search results to one even if found more", function() {
    searcher.setLimit(1);
    expect(
      searcher.search(store,'bar')
    ).toEqual(
      [barElement]
    );
  });

  it("should find a long string", function() {
    expect(
      searcher.search(store,'lorem ipsum')
    ).toEqual(
      [loremElement]
    );
  });

  it("should find a fuzzy string", function() {
    searcher.setFuzzy(true);
    expect(
      searcher.search(store,'lrm ism')
    ).toEqual(
      [loremElement]
    );
  });

  it("should not search when an empty criteria is provided", function() {
    expect(
      searcher.search(store,'')
    ).toEqual(
      []
    );
  });
});