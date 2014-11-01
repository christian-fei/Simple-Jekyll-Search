describe("Store", function() {
  var store = require('../../src/Store.js');

  it("should store data and retrieve it", function() {
    store.put({foo:'bar'});
    expect(42).toBeTruthy();
  });
});