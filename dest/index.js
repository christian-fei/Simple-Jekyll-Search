(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = new FuzzySearchStrategy();

function FuzzySearchStrategy(){
  var self = this;

  this.matches = function(string,crit){
    var regexp = new RegExp( string.split('').join('.*?'), 'gi');
    return !!string.match(regexp);
  };
};
},{}],2:[function(require,module,exports){
module.exports = new LiteralSearchStrategy();

function LiteralSearchStrategy(){
  var self = this;
  this.matches = function(string,crit){
    return string.toLowerCase().indexOf(crit.toLowerCase()) >= 0;
  };
};
},{}],3:[function(require,module,exports){
module.exports = new Searcher();
function Searcher(){
  var self = this;

  var fuzzySearchStrategy = require('./SearchStrategies/fuzzy');
  var literalSearchStrategy = require('./SearchStrategies/literal');

  var fuzzy = false;

  self.setFuzzy = function(_fuzzy){
    fuzzy = !!_fuzzy;
  };

  self.search = function(data,crit){
    var matches = [];
    var strategy = fuzzy ? fuzzySearchStrategy : literalSearchStrategy;
    for(var i = 0; i < data.length; i++) {
      var obj = data[i];
      for(var key in obj) {
        if( obj.hasOwnProperty(key) && typeof obj[key] == 'string' ){
          if( strategy.matches(obj[key], crit) ){
            matches.push(obj);
            break;
          }
        }
      }
    }
    return matches;
  };
};
},{"./SearchStrategies/fuzzy":1,"./SearchStrategies/literal":2}],4:[function(require,module,exports){
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
    return data;
  }

  function addArray(data){
    var added = [];
    for (var i = 0; i < data.length; i++){
      if( isObject(data[i]) ){
        added.push(addObject(data[i]));
      }
    }
    return added;
  }

  self.get = function(){
    return store;
  };

  self.put = function(data){
    if( isObject(data) ){
      return addObject(data);
    }
    if( isArray(data) ){
      return addArray(data);
    }
  };
};
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
require('./Templater');
require('./Store');
require('./Searcher')
},{"./Searcher":3,"./Store":4,"./Templater":5}]},{},[6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL1NlYXJjaFN0cmF0ZWdpZXMvZnV6enkuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL1NlYXJjaFN0cmF0ZWdpZXMvbGl0ZXJhbC5qcyIsIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC9zcmMvU2VhcmNoZXIuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL1N0b3JlLmpzIiwiL1VzZXJzL3NhaXBoL0RvY3VtZW50cy9wbGF5Z3JvdW5kL1NpbXBsZS1KZWt5bGwtU2VhcmNoL3NyYy9UZW1wbGF0ZXIuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL2Zha2VfMjJiYzAxZjcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBuZXcgRnV6enlTZWFyY2hTdHJhdGVneSgpO1xuXG5mdW5jdGlvbiBGdXp6eVNlYXJjaFN0cmF0ZWd5KCl7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB0aGlzLm1hdGNoZXMgPSBmdW5jdGlvbihzdHJpbmcsY3JpdCl7XG4gICAgdmFyIHJlZ2V4cCA9IG5ldyBSZWdFeHAoIHN0cmluZy5zcGxpdCgnJykuam9pbignLio/JyksICdnaScpO1xuICAgIHJldHVybiAhIXN0cmluZy5tYXRjaChyZWdleHApO1xuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IG5ldyBMaXRlcmFsU2VhcmNoU3RyYXRlZ3koKTtcblxuZnVuY3Rpb24gTGl0ZXJhbFNlYXJjaFN0cmF0ZWd5KCl7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5tYXRjaGVzID0gZnVuY3Rpb24oc3RyaW5nLGNyaXQpe1xuICAgIHJldHVybiBzdHJpbmcudG9Mb3dlckNhc2UoKS5pbmRleE9mKGNyaXQudG9Mb3dlckNhc2UoKSkgPj0gMDtcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBuZXcgU2VhcmNoZXIoKTtcbmZ1bmN0aW9uIFNlYXJjaGVyKCl7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgZnV6enlTZWFyY2hTdHJhdGVneSA9IHJlcXVpcmUoJy4vU2VhcmNoU3RyYXRlZ2llcy9mdXp6eScpO1xuICB2YXIgbGl0ZXJhbFNlYXJjaFN0cmF0ZWd5ID0gcmVxdWlyZSgnLi9TZWFyY2hTdHJhdGVnaWVzL2xpdGVyYWwnKTtcblxuICB2YXIgZnV6enkgPSBmYWxzZTtcblxuICBzZWxmLnNldEZ1enp5ID0gZnVuY3Rpb24oX2Z1enp5KXtcbiAgICBmdXp6eSA9ICEhX2Z1enp5O1xuICB9O1xuXG4gIHNlbGYuc2VhcmNoID0gZnVuY3Rpb24oZGF0YSxjcml0KXtcbiAgICB2YXIgbWF0Y2hlcyA9IFtdO1xuICAgIHZhciBzdHJhdGVneSA9IGZ1enp5ID8gZnV6enlTZWFyY2hTdHJhdGVneSA6IGxpdGVyYWxTZWFyY2hTdHJhdGVneTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9iaiA9IGRhdGFbaV07XG4gICAgICBmb3IodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYoIG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHR5cGVvZiBvYmpba2V5XSA9PSAnc3RyaW5nJyApe1xuICAgICAgICAgIGlmKCBzdHJhdGVneS5tYXRjaGVzKG9ialtrZXldLCBjcml0KSApe1xuICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKG9iaik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hdGNoZXM7XG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gbmV3IFN0b3JlKCk7XG5cbmZ1bmN0aW9uIFN0b3JlKCl7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgc3RvcmUgPSBbXTtcblxuICBmdW5jdGlvbiBpc09iamVjdChvYmope1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBPYmplY3RdJztcbiAgfVxuICBmdW5jdGlvbiBpc0FycmF5KG9iail7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRPYmplY3QoZGF0YSl7XG4gICAgc3RvcmUucHVzaChkYXRhKTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZEFycmF5KGRhdGEpe1xuICAgIHZhciBhZGRlZCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKyl7XG4gICAgICBpZiggaXNPYmplY3QoZGF0YVtpXSkgKXtcbiAgICAgICAgYWRkZWQucHVzaChhZGRPYmplY3QoZGF0YVtpXSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYWRkZWQ7XG4gIH1cblxuICBzZWxmLmdldCA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHN0b3JlO1xuICB9O1xuXG4gIHNlbGYucHV0ID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgaWYoIGlzT2JqZWN0KGRhdGEpICl7XG4gICAgICByZXR1cm4gYWRkT2JqZWN0KGRhdGEpO1xuICAgIH1cbiAgICBpZiggaXNBcnJheShkYXRhKSApe1xuICAgICAgcmV0dXJuIGFkZEFycmF5KGRhdGEpO1xuICAgIH1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBuZXcgVGVtcGxhdGVyKCk7XG5cbmZ1bmN0aW9uIFRlbXBsYXRlcigpe1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIHRlbXBsYXRlUGF0dGVybiA9IC9cXHsoLio/KVxcfS9nO1xuXG4gIHNlbGYuc2V0VGVtcGxhdGVQYXR0ZXJuID0gZnVuY3Rpb24obmV3VGVtcGxhdGVQYXR0ZXJuKXtcbiAgICB0ZW1wbGF0ZVBhdHRlcm4gPSBuZXdUZW1wbGF0ZVBhdHRlcm47XG4gIH07XG5cbiAgc2VsZi5yZW5kZXIgPSBmdW5jdGlvbih0LCBkYXRhKXtcbiAgICByZXR1cm4gdC5yZXBsYWNlKHRlbXBsYXRlUGF0dGVybiwgZnVuY3Rpb24obWF0Y2gsIHByb3ApIHtcbiAgICAgIHJldHVybiBkYXRhW3Byb3BdIHx8IG1hdGNoO1xuICAgIH0pO1xuICB9O1xufTsiLCJyZXF1aXJlKCcuL1RlbXBsYXRlcicpO1xucmVxdWlyZSgnLi9TdG9yZScpO1xucmVxdWlyZSgnLi9TZWFyY2hlcicpIl19
