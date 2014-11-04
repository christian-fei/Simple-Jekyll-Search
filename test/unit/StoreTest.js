describe("Store", function() {
  var Store = require('../../src/Store.js');
  var store;

  var foo = {foo:'bar'};
  var foo1 = {foo1:'bar1'};

  beforeEach(function() {
    store = new Store;
    store.clear();
  });

  it("should instanciate a store with data provided via constructor", function() {
    store = new Store([foo]);
    expect(
      store.get()
    ).toEqual(
      [foo]
    )
  });

  it("should clear the store", function() {
    store.put({foo:'bar'});
    expect(
      store.clear()
    ).toEqual(
      []
    );    
  });

  it("should store single object", function() {
    store.put([foo]);
    expect(
      store.get()
    ).toEqual(
      [foo]
    );
  });

  it("should store an array of objects", function() {
    store.put([foo,foo1]);
    expect(
      store.get()
    ).toEqual(
      [{foo:'bar'},{foo1:'bar1'}]
    );        
  });

  it("should not add other things than objects", function() {
    expect(store.put('string')).toBeUndefined();
    expect(store.put(1)).toBeUndefined();
  });

  it("should retrieve the current store", function() {
    store.put([foo,foo1]);
    expect(
      store.get()
    ).toEqual(
      [foo,foo1]
    );
  });
});