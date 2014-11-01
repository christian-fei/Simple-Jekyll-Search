(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = new Store();

function Store(){
  var self = this;

  var store = [];

  function isObject(obj){
    return Object.prototype.toString.call(obj) == '[object Object]';
  }
  function isArray(obj){
    return Object.prototype.toString.call(obj) == '[object Array]';
  }

  function addObject(data){
    store.push(data);
  }

  function addArray(data){
    for (var i = 0; i < data.length; i++){
      if( isObject(data[i]) ){
        addObject(data);
      }
    }

  }

  self.get = function(){
    return store;
  };

  self.put = function(data){
    if( isObject(data) ){
      addObject(data);
    }
    if( isArray(data) ){
      addArray(data);
    }
  };
};
},{}],2:[function(require,module,exports){
module.exports = new Templater();

function Templater(){
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
},{}],3:[function(require,module,exports){
require('./Templater');
require('./Store');
},{"./Store":1,"./Templater":2}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL1N0b3JlLmpzIiwiL1VzZXJzL3NhaXBoL0RvY3VtZW50cy9wbGF5Z3JvdW5kL1NpbXBsZS1KZWt5bGwtU2VhcmNoL3NyYy9UZW1wbGF0ZXIuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL2Zha2VfYjU3OTJmNDkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IG5ldyBTdG9yZSgpO1xuXG5mdW5jdGlvbiBTdG9yZSgpe1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIHN0b3JlID0gW107XG5cbiAgZnVuY3Rpb24gaXNPYmplY3Qob2JqKXtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgT2JqZWN0XSc7XG4gIH1cbiAgZnVuY3Rpb24gaXNBcnJheShvYmope1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBBcnJheV0nO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkT2JqZWN0KGRhdGEpe1xuICAgIHN0b3JlLnB1c2goZGF0YSk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRBcnJheShkYXRhKXtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspe1xuICAgICAgaWYoIGlzT2JqZWN0KGRhdGFbaV0pICl7XG4gICAgICAgIGFkZE9iamVjdChkYXRhKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIHNlbGYuZ2V0ID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gc3RvcmU7XG4gIH07XG5cbiAgc2VsZi5wdXQgPSBmdW5jdGlvbihkYXRhKXtcbiAgICBpZiggaXNPYmplY3QoZGF0YSkgKXtcbiAgICAgIGFkZE9iamVjdChkYXRhKTtcbiAgICB9XG4gICAgaWYoIGlzQXJyYXkoZGF0YSkgKXtcbiAgICAgIGFkZEFycmF5KGRhdGEpO1xuICAgIH1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBuZXcgVGVtcGxhdGVyKCk7XG5cbmZ1bmN0aW9uIFRlbXBsYXRlcigpe1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIHRlbXBsYXRlUGF0dGVybiA9IC9cXHsoLio/KVxcfS9nO1xuXG4gIHNlbGYuc2V0VGVtcGxhdGVQYXR0ZXJuID0gZnVuY3Rpb24obmV3VGVtcGxhdGVQYXR0ZXJuKXtcbiAgICB0ZW1wbGF0ZVBhdHRlcm4gPSBuZXdUZW1wbGF0ZVBhdHRlcm47XG4gIH07XG5cbiAgc2VsZi5yZW5kZXIgPSBmdW5jdGlvbih0LCBkYXRhKXtcbiAgICByZXR1cm4gdC5yZXBsYWNlKHRlbXBsYXRlUGF0dGVybiwgZnVuY3Rpb24obWF0Y2gsIHByb3ApIHtcbiAgICAgIHJldHVybiBkYXRhW3Byb3BdIHx8IG1hdGNoO1xuICAgIH0pO1xuICB9O1xufTsiLCJyZXF1aXJlKCcuL1RlbXBsYXRlcicpO1xucmVxdWlyZSgnLi9TdG9yZScpOyJdfQ==
