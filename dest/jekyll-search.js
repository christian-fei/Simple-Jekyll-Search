(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function Templater(){
  var self = this;

  var templatePattern = /\{(.*?)\}/g;

  self.setTemplatePattern = function(newTemplatePattern){
    templatePattern = newTemplatePattern;
  };

  self.render = function(t, data){
    return t.replace(templatePattern, function(match, prop) {
      return data[prop] || match;
    });
  };
};
},{}],2:[function(require,module,exports){
require('./Templater');
},{"./Templater":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL1RlbXBsYXRlci5qcyIsIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC9zcmMvZmFrZV83MjhmMjM2Yy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFRlbXBsYXRlcigpe1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIHRlbXBsYXRlUGF0dGVybiA9IC9cXHsoLio/KVxcfS9nO1xuXG4gIHNlbGYuc2V0VGVtcGxhdGVQYXR0ZXJuID0gZnVuY3Rpb24obmV3VGVtcGxhdGVQYXR0ZXJuKXtcbiAgICB0ZW1wbGF0ZVBhdHRlcm4gPSBuZXdUZW1wbGF0ZVBhdHRlcm47XG4gIH07XG5cbiAgc2VsZi5yZW5kZXIgPSBmdW5jdGlvbih0LCBkYXRhKXtcbiAgICByZXR1cm4gdC5yZXBsYWNlKHRlbXBsYXRlUGF0dGVybiwgZnVuY3Rpb24obWF0Y2gsIHByb3ApIHtcbiAgICAgIHJldHVybiBkYXRhW3Byb3BdIHx8IG1hdGNoO1xuICAgIH0pO1xuICB9O1xufTsiLCJyZXF1aXJlKCcuL1RlbXBsYXRlcicpOyJdfQ==
