describe("Store", function() {
  store = require('../../src/Store.js');

  beforeEach(function() {
    store.clear();
  });

  it("should store single object", function() {
    expect(
      store.put({foo:'bar'})
    ).toEqual(
      {foo:'bar'}
    );
  });

  it("should store an array of objects", function() {
    expect(
      store.put([{foo:'bar'},{foo1:'bar1'}])
    ).toEqual(
      [{foo:'bar'},{foo1:'bar1'}]
    );        
  });

  it("should not add other things than objects", function() {
    expect(store.put('string')).toBeUndefined();
    expect(store.put(1)).toBeUndefined();
  });

  it("should retrieve the current store", function() {
    store.put([{foo:'bar'},{foo1:'bar1'}])
    expect(
      store.get()
    ).toEqual(
      [{foo:'bar'},{foo1:'bar1'}]
    );
  });
});