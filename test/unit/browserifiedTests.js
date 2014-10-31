(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function Templater(){
  var self = this;

  var placeholderPattern = /\{(.*?)\}/g;

  self.render = function(t, data){
    var rendered = t.replace(placeholderPattern, function(match, prop) {
      if( data[prop] === undefined ){
        throw new Error('fuck');
      }
      return data[prop];
    });
    return rendered;
  };
};
},{}],2:[function(require,module,exports){
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
},{"../../src/Templater.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL1RlbXBsYXRlci5qcyIsIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC90ZXN0L3VuaXQvZmFrZV9mOWM5MTU3NS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFRlbXBsYXRlcigpe1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIHBsYWNlaG9sZGVyUGF0dGVybiA9IC9cXHsoLio/KVxcfS9nO1xuXG4gIHNlbGYucmVuZGVyID0gZnVuY3Rpb24odCwgZGF0YSl7XG4gICAgdmFyIHJlbmRlcmVkID0gdC5yZXBsYWNlKHBsYWNlaG9sZGVyUGF0dGVybiwgZnVuY3Rpb24obWF0Y2gsIHByb3ApIHtcbiAgICAgIGlmKCBkYXRhW3Byb3BdID09PSB1bmRlZmluZWQgKXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmdWNrJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YVtwcm9wXTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVuZGVyZWQ7XG4gIH07XG59OyIsImRlc2NyaWJlKFwiVGVtcGxhdGVyXCIsIGZ1bmN0aW9uKCkge1xuICB2YXIgVGVtcGxhdGVyID0gcmVxdWlyZSgnLi4vLi4vc3JjL1RlbXBsYXRlci5qcycpO1xuICB2YXIgdGVtcGxhdGVyID0gbmV3IFRlbXBsYXRlcigpO1xuICBpdChcInNob3VsZCByZW5kZXIgdGhlIHRlbXBsYXRlIHdpdGggdGhlIHByb3ZpZGVkIGRhdGFcIiwgZnVuY3Rpb24oKSB7XG4gICAgZXhwZWN0KFxuICAgICAgdGVtcGxhdGVyLnJlbmRlcigne2Zvb30nLHtmb286J2Jhcid9KVxuICAgICkudG9FcXVhbChcbiAgICAgICdiYXInXG4gICAgKTtcblxuICAgIGV4cGVjdChcbiAgICAgIHRlbXBsYXRlci5yZW5kZXIoJzxhIGhyZWY9XCJ7dXJsfVwiPnVybDwvYT4nLHt1cmw6J2h0dHA6Ly9nb29nbGUuY29tJ30pXG4gICAgKS50b0VxdWFsKFxuICAgICAgJzxhIGhyZWY9XCJodHRwOi8vZ29vZ2xlLmNvbVwiPnVybDwvYT4nXG4gICAgKTtcbiAgfSk7XG5cbiAgaXQoXCJzaG91bGQgdGhyb3cgaWYgdGVtcGxhdGUgZG9lc24ndCBtYXRjaCBwcm92aWRlZCBkYXRhXCIsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbnZhbGlkRGF0YSA9IHtmb286J2Jhcid9O1xuICAgIHZhciBfdGhyb3dzID0gZnVuY3Rpb24oKXtcbiAgICAgIHRlbXBsYXRlci5yZW5kZXIoJ3t1bmtub3duX2tleX0nLGludmFsaWREYXRhKTtcbiAgICB9O1xuICAgIGV4cGVjdChfdGhyb3dzKS50b1Rocm93KCk7XG4gIH0pO1xufSk7Il19
