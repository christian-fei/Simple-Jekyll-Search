describe("Templater", function() {
  var Templater = require('Templater');
  it("should render the template with the provided data", function() {
    var rendered = Templater.render('{foo}',{foo:'bar'});
    expect( rendered ).toEqual( 'bar' );
  });
});