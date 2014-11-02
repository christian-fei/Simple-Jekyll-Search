describe("Searcher", function() {
  var searcher;
  var stringTrimSpy;
  beforeEach(function() {
    searcher = require('../../src/Searcher.js');
  });

  var barElement = {title:'bar', content: 'bar'};
  var loremElement = {title:'lorem', content: 'lorem ipsum'};

  var data = [barElement,loremElement];
  
  it("find a simple string", function() {
    expect(
      searcher.search(data,'bar')
    ).toEqual(
      [barElement]
    );
  });

  it("should find a long string", function() {
    expect(
      searcher.search(data,'lorem ipsum')
    ).toEqual(
      [loremElement]
    );
  });

  it("should find a fuzzy string", function() {
    searcher.setFuzzy(true);
    expect(
      searcher.search(data,'lrm ism')
    ).toEqual(
      [loremElement]
    );
  });

  it("should not search when an empty criteria is provided", function() {
    expect(
      searcher.search(data,'')
    ).toEqual(
      []
    );
  });
});