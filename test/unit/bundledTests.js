(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function Templater(){
  var self = this;

  self.render = function(t, data){
    return t.replace(/\{(.*?)\}/g, function(match, prop) {
      return data[ prop ];
    });
  };
};
},{}],2:[function(require,module,exports){
describe("Templater", function() {
  var Templater = require('../../src/Templater.js');
  var templater = new Templater();
  it("should render the template with the provided data", function() {
    var rendered = templater.render('{foo}',{foo:'bar'});
    expect( rendered ).toEqual( 'bar' );
  });
});
},{"../../src/Templater.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL1RlbXBsYXRlci5qcyIsIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC90ZXN0L3VuaXQvZmFrZV82NGE5YjhjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBUZW1wbGF0ZXIoKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYucmVuZGVyID0gZnVuY3Rpb24odCwgZGF0YSl7XG4gICAgcmV0dXJuIHQucmVwbGFjZSgvXFx7KC4qPylcXH0vZywgZnVuY3Rpb24obWF0Y2gsIHByb3ApIHtcbiAgICAgIHJldHVybiBkYXRhWyBwcm9wIF07XG4gICAgfSk7XG4gIH07XG59OyIsImRlc2NyaWJlKFwiVGVtcGxhdGVyXCIsIGZ1bmN0aW9uKCkge1xuICB2YXIgVGVtcGxhdGVyID0gcmVxdWlyZSgnLi4vLi4vc3JjL1RlbXBsYXRlci5qcycpO1xuICB2YXIgdGVtcGxhdGVyID0gbmV3IFRlbXBsYXRlcigpO1xuICBpdChcInNob3VsZCByZW5kZXIgdGhlIHRlbXBsYXRlIHdpdGggdGhlIHByb3ZpZGVkIGRhdGFcIiwgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlbmRlcmVkID0gdGVtcGxhdGVyLnJlbmRlcigne2Zvb30nLHtmb286J2Jhcid9KTtcbiAgICBleHBlY3QoIHJlbmRlcmVkICkudG9FcXVhbCggJ2JhcicgKTtcbiAgfSk7XG59KTsiXX0=
