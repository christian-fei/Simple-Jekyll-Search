describe("Templater", function() {
  var Templater = require('../../src/Templater.js');
  var templater = new Templater();
  it("should render the template with the provided data", function() {
    expect(
      templater.render('{foo}',{foo:'bar'})
    ).toEqual(
      'bar'
    );

    expect(
      templater.render('<a href="{url}">url</a>',{url:'http://google.com'})
    ).toEqual(
      '<a href="http://google.com">url</a>'
    );
  });

  it("should throw if template doesn't match provided data", function() {
    var invalidData = {foo:'bar'};
    var _throws = function(){
      templater.render('{unknown_key}',invalidData);
    };
    expect(_throws).toThrow();
  });
});