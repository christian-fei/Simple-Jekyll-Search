(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = new JSONLoader();
function JSONLoader(){
  var self = this;

  self.load = function(location,callback){
    var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("GET", location, true);
    xhr.onreadystatechange = function(){
      if (xhr.status==200 && xhr.readyState==4){
        try{
          callback(null,JSON.parse(xhr.responseText) );
        }catch(err){
          callback(err,null);
          console.log( 'failed to load json',location,err );
        }
      }
    }
    xhr.send();
  };
};
},{}],2:[function(require,module,exports){
module.exports = new FuzzySearchStrategy();

function FuzzySearchStrategy(){
  var self = this;

  this.matches = function(string,crit){
    var regexp = new RegExp( string.split('').join('.*?'), 'gi');
    return !!string.match(regexp);
  };
};
},{}],3:[function(require,module,exports){
module.exports = new LiteralSearchStrategy();

function LiteralSearchStrategy(){
  var self = this;
  this.matches = function(string,crit){
    return string.toLowerCase().indexOf(crit.toLowerCase()) >= 0;
  };
};
},{}],4:[function(require,module,exports){
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
},{"./SearchStrategies/fuzzy":2,"./SearchStrategies/literal":3}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
;(function(window,document,undefined){
  'use strict'
  
  var templater = require('./Templater');
  var store = require('./Store');
  var searcher = require('./Searcher');
  var JSONLoader = require('./JSONLoader');

  window.SimpleJekyllSearch = function SimpleJekyllSearch(){
    var self = this;

    var requiredOptions = [
      'searchInput',
      'resultsContainer',
      'dataSource',
    ];
    var opt = {
      searchInput: null,
      resultsContainer: null,
      dataSource: null,
      searchResultTemplate: '<li><a href="{url}" title="{desc}">{title}</a></li>',
      noResultsText: 'No results found',
      limit: 10,
      fuzzy: false,
    };

    function throwError(message){ throw new Error('SimpleJekyllSearch --- '+ message); }

    function validateOptions(_opt){
      for (var i = 0, req = requiredOptions[i]; i < requiredOptions.length; i++)
        if( !_opt[req] ) throwError('You must specify a ' + req);
    }

    function assignOptions(_opt){
      for(var option in opt) opt[option] = _opt[option] || opt[option];
    }

    self.init = function(_opt){
      validateOptions(_opt);
      assignOptions(_opt);
    };
  };
})(window,document);
},{"./JSONLoader":1,"./Searcher":4,"./Store":5,"./Templater":6}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL0pTT05Mb2FkZXIuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL1NlYXJjaFN0cmF0ZWdpZXMvZnV6enkuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL1NlYXJjaFN0cmF0ZWdpZXMvbGl0ZXJhbC5qcyIsIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC9zcmMvU2VhcmNoZXIuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL1N0b3JlLmpzIiwiL1VzZXJzL3NhaXBoL0RvY3VtZW50cy9wbGF5Z3JvdW5kL1NpbXBsZS1KZWt5bGwtU2VhcmNoL3NyYy9UZW1wbGF0ZXIuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL2Zha2VfZjhmYzY0YzcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IG5ldyBKU09OTG9hZGVyKCk7XG5mdW5jdGlvbiBKU09OTG9hZGVyKCl7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBzZWxmLmxvYWQgPSBmdW5jdGlvbihsb2NhdGlvbixjYWxsYmFjayl7XG4gICAgdmFyIHhociA9ICh3aW5kb3cuWE1MSHR0cFJlcXVlc3QpID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBuZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxIVFRQXCIpO1xuICAgIHhoci5vcGVuKFwiR0VUXCIsIGxvY2F0aW9uLCB0cnVlKTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcbiAgICAgIGlmICh4aHIuc3RhdHVzPT0yMDAgJiYgeGhyLnJlYWR5U3RhdGU9PTQpe1xuICAgICAgICB0cnl7XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCxKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpICk7XG4gICAgICAgIH1jYXRjaChlcnIpe1xuICAgICAgICAgIGNhbGxiYWNrKGVycixudWxsKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyggJ2ZhaWxlZCB0byBsb2FkIGpzb24nLGxvY2F0aW9uLGVyciApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHhoci5zZW5kKCk7XG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gbmV3IEZ1enp5U2VhcmNoU3RyYXRlZ3koKTtcblxuZnVuY3Rpb24gRnV6enlTZWFyY2hTdHJhdGVneSgpe1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdGhpcy5tYXRjaGVzID0gZnVuY3Rpb24oc3RyaW5nLGNyaXQpe1xuICAgIHZhciByZWdleHAgPSBuZXcgUmVnRXhwKCBzdHJpbmcuc3BsaXQoJycpLmpvaW4oJy4qPycpLCAnZ2knKTtcbiAgICByZXR1cm4gISFzdHJpbmcubWF0Y2gocmVnZXhwKTtcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBuZXcgTGl0ZXJhbFNlYXJjaFN0cmF0ZWd5KCk7XG5cbmZ1bmN0aW9uIExpdGVyYWxTZWFyY2hTdHJhdGVneSgpe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMubWF0Y2hlcyA9IGZ1bmN0aW9uKHN0cmluZyxjcml0KXtcbiAgICByZXR1cm4gc3RyaW5nLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihjcml0LnRvTG93ZXJDYXNlKCkpID49IDA7XG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gbmV3IFNlYXJjaGVyKCk7XG5mdW5jdGlvbiBTZWFyY2hlcigpe1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIGZ1enp5U2VhcmNoU3RyYXRlZ3kgPSByZXF1aXJlKCcuL1NlYXJjaFN0cmF0ZWdpZXMvZnV6enknKTtcbiAgdmFyIGxpdGVyYWxTZWFyY2hTdHJhdGVneSA9IHJlcXVpcmUoJy4vU2VhcmNoU3RyYXRlZ2llcy9saXRlcmFsJyk7XG5cbiAgdmFyIGZ1enp5ID0gZmFsc2U7XG5cbiAgc2VsZi5zZXRGdXp6eSA9IGZ1bmN0aW9uKF9mdXp6eSl7XG4gICAgZnV6enkgPSAhIV9mdXp6eTtcbiAgfTtcblxuICBzZWxmLnNlYXJjaCA9IGZ1bmN0aW9uKGRhdGEsY3JpdCl7XG4gICAgdmFyIG1hdGNoZXMgPSBbXTtcbiAgICB2YXIgc3RyYXRlZ3kgPSBmdXp6eSA/IGZ1enp5U2VhcmNoU3RyYXRlZ3kgOiBsaXRlcmFsU2VhcmNoU3RyYXRlZ3k7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvYmogPSBkYXRhW2ldO1xuICAgICAgZm9yKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmKCBvYmouaGFzT3duUHJvcGVydHkoa2V5KSAmJiB0eXBlb2Ygb2JqW2tleV0gPT0gJ3N0cmluZycgKXtcbiAgICAgICAgICBpZiggc3RyYXRlZ3kubWF0Y2hlcyhvYmpba2V5XSwgY3JpdCkgKXtcbiAgICAgICAgICAgIG1hdGNoZXMucHVzaChvYmopO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXRjaGVzO1xuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IG5ldyBTdG9yZSgpO1xuXG5mdW5jdGlvbiBTdG9yZSgpe1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIHN0b3JlID0gW107XG5cbiAgZnVuY3Rpb24gaXNPYmplY3Qob2JqKXtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgT2JqZWN0XSc7XG4gIH1cbiAgZnVuY3Rpb24gaXNBcnJheShvYmope1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBBcnJheV0nO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkT2JqZWN0KGRhdGEpe1xuICAgIHN0b3JlLnB1c2goZGF0YSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRBcnJheShkYXRhKXtcbiAgICB2YXIgYWRkZWQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspe1xuICAgICAgaWYoIGlzT2JqZWN0KGRhdGFbaV0pICl7XG4gICAgICAgIGFkZGVkLnB1c2goYWRkT2JqZWN0KGRhdGFbaV0pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFkZGVkO1xuICB9XG5cbiAgc2VsZi5nZXQgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiBzdG9yZTtcbiAgfTtcblxuICBzZWxmLnB1dCA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgIGlmKCBpc09iamVjdChkYXRhKSApe1xuICAgICAgcmV0dXJuIGFkZE9iamVjdChkYXRhKTtcbiAgICB9XG4gICAgaWYoIGlzQXJyYXkoZGF0YSkgKXtcbiAgICAgIHJldHVybiBhZGRBcnJheShkYXRhKTtcbiAgICB9XG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gbmV3IFRlbXBsYXRlcigpO1xuXG5mdW5jdGlvbiBUZW1wbGF0ZXIoKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciB0ZW1wbGF0ZVBhdHRlcm4gPSAvXFx7KC4qPylcXH0vZztcblxuICBzZWxmLnNldFRlbXBsYXRlUGF0dGVybiA9IGZ1bmN0aW9uKG5ld1RlbXBsYXRlUGF0dGVybil7XG4gICAgdGVtcGxhdGVQYXR0ZXJuID0gbmV3VGVtcGxhdGVQYXR0ZXJuO1xuICB9O1xuXG4gIHNlbGYucmVuZGVyID0gZnVuY3Rpb24odCwgZGF0YSl7XG4gICAgcmV0dXJuIHQucmVwbGFjZSh0ZW1wbGF0ZVBhdHRlcm4sIGZ1bmN0aW9uKG1hdGNoLCBwcm9wKSB7XG4gICAgICByZXR1cm4gZGF0YVtwcm9wXSB8fCBtYXRjaDtcbiAgICB9KTtcbiAgfTtcbn07IiwiOyhmdW5jdGlvbih3aW5kb3csZG9jdW1lbnQsdW5kZWZpbmVkKXtcbiAgJ3VzZSBzdHJpY3QnXG4gIFxuICB2YXIgdGVtcGxhdGVyID0gcmVxdWlyZSgnLi9UZW1wbGF0ZXInKTtcbiAgdmFyIHN0b3JlID0gcmVxdWlyZSgnLi9TdG9yZScpO1xuICB2YXIgc2VhcmNoZXIgPSByZXF1aXJlKCcuL1NlYXJjaGVyJyk7XG4gIHZhciBKU09OTG9hZGVyID0gcmVxdWlyZSgnLi9KU09OTG9hZGVyJyk7XG5cbiAgd2luZG93LlNpbXBsZUpla3lsbFNlYXJjaCA9IGZ1bmN0aW9uIFNpbXBsZUpla3lsbFNlYXJjaCgpe1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciByZXF1aXJlZE9wdGlvbnMgPSBbXG4gICAgICAnc2VhcmNoSW5wdXQnLFxuICAgICAgJ3Jlc3VsdHNDb250YWluZXInLFxuICAgICAgJ2RhdGFTb3VyY2UnLFxuICAgIF07XG4gICAgdmFyIG9wdCA9IHtcbiAgICAgIHNlYXJjaElucHV0OiBudWxsLFxuICAgICAgcmVzdWx0c0NvbnRhaW5lcjogbnVsbCxcbiAgICAgIGRhdGFTb3VyY2U6IG51bGwsXG4gICAgICBzZWFyY2hSZXN1bHRUZW1wbGF0ZTogJzxsaT48YSBocmVmPVwie3VybH1cIiB0aXRsZT1cIntkZXNjfVwiPnt0aXRsZX08L2E+PC9saT4nLFxuICAgICAgbm9SZXN1bHRzVGV4dDogJ05vIHJlc3VsdHMgZm91bmQnLFxuICAgICAgbGltaXQ6IDEwLFxuICAgICAgZnV6enk6IGZhbHNlLFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiB0aHJvd0Vycm9yKG1lc3NhZ2UpeyB0aHJvdyBuZXcgRXJyb3IoJ1NpbXBsZUpla3lsbFNlYXJjaCAtLS0gJysgbWVzc2FnZSk7IH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlT3B0aW9ucyhfb3B0KXtcbiAgICAgIGZvciAodmFyIGkgPSAwLCByZXEgPSByZXF1aXJlZE9wdGlvbnNbaV07IGkgPCByZXF1aXJlZE9wdGlvbnMubGVuZ3RoOyBpKyspXG4gICAgICAgIGlmKCAhX29wdFtyZXFdICkgdGhyb3dFcnJvcignWW91IG11c3Qgc3BlY2lmeSBhICcgKyByZXEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFzc2lnbk9wdGlvbnMoX29wdCl7XG4gICAgICBmb3IodmFyIG9wdGlvbiBpbiBvcHQpIG9wdFtvcHRpb25dID0gX29wdFtvcHRpb25dIHx8IG9wdFtvcHRpb25dO1xuICAgIH1cblxuICAgIHNlbGYuaW5pdCA9IGZ1bmN0aW9uKF9vcHQpe1xuICAgICAgdmFsaWRhdGVPcHRpb25zKF9vcHQpO1xuICAgICAgYXNzaWduT3B0aW9ucyhfb3B0KTtcbiAgICB9O1xuICB9O1xufSkod2luZG93LGRvY3VtZW50KTsiXX0=
