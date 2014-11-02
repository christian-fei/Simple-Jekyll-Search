describe("Searcher", function() {
  var searcher;
  var stringTrimSpy;
  beforeEach(function() {
    searcher = require('../../src/Searcher.js');
    stringTrimSpy = spyOn(String.prototype,'trim');
  });

  var element = {title:'bar', content: 'lorem ipsum dolor sit amet.'};

  var data = [element];
  
  it("find a simple string", function() {
    expect(
      searcher.search(data,'bar')
    ).toEqual(
      [element]
    );
  });

  it("should find a long string", function() {
    expect(
      searcher.search(data,'lorem ipsum')
    ).toEqual(
      [element]
    );
  });

  it("should find a fuzzy string", function() {
    searcher.setFuzzy(true);
    expect(
      searcher.search(data,'lrm sum')
    ).toEqual(
      [element]
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