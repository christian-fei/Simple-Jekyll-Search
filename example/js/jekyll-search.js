(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'
module.exports = {
  load: load
}

function load(location,callback){
  var xhr
  if( window.XMLHttpRequest ){
    xhr = new XMLHttpRequest()
  }else{
    xhr = new ActiveXObject('Microsoft.XMLHTTP')
  }

  xhr.open('GET', location, true)

  xhr.onreadystatechange = function(){
    if ( xhr.status===200 && xhr.readyState===4 ){
      try{
        callback(null, JSON.parse(xhr.responseText) )
      }catch(err){
        callback(err, null)
      }
    }
  }

  xhr.send()
}

},{}],2:[function(require,module,exports){
'use strict'
module.exports = function OptionsValidator(params){
  if( !validateParams(params) ){
    throw new Error('-- OptionsValidator: required options missing')
  }
  if( !(this instanceof OptionsValidator) ){
    return new OptionsValidator(params)
  }

  var requiredOptions = params.required

  this.getRequiredOptions = function(){
    return requiredOptions
  }

  this.validate = function(parameters){
    var errors = []
    requiredOptions.forEach(function(requiredOptionName){
      if( parameters[requiredOptionName] === undefined ){
        errors.push(requiredOptionName)
      }
    })
    return errors
  }

  function validateParams(params){
    if( !params ) {
      return false
    }
    return params.required !== undefined && params.required instanceof Array
  }
}
},{}],3:[function(require,module,exports){
'use strict'
module.exports = {
  put:put,
  clear: clear,
  get: get,
  search: search,
  setOptions: setOptions
}

var FuzzySearchStrategy = require('./SearchStrategies/FuzzySearchStrategy')
var LiteralSearchStrategy = require('./SearchStrategies/LiteralSearchStrategy')

var data = []
var opt = {}
opt.fuzzy = false
opt.limit = 10
opt.searchStrategy = opt.fuzzy ? FuzzySearchStrategy : LiteralSearchStrategy


function put(data){
  if( isObject(data) ){
    return addObject(data)
  }
  if( isArray(data) ){
    return addArray(data)
  }
  return undefined
}
function clear(){
  data.length = 0
  return data
}

function get(){
  return data
}


function isObject(obj){ return !!obj && Object.prototype.toString.call(obj) === '[object Object]' }
function isArray(obj){ return !!obj && Object.prototype.toString.call(obj) === '[object Array]' }

function addObject(_data){
  data.push(_data)
  return data
}

function addArray(_data){
  var added = []
  for (var i = 0; i < _data.length; i++){
    if( isObject(_data[i]) ){
      added.push(addObject(_data[i]))
    }
  }
  return added
}



function search(crit){
  if( !crit ){
    return []
  }
  return findMatches(data,crit,opt.searchStrategy,opt)
}

function setOptions(_opt){
  opt = _opt || {}

  opt.fuzzy = _opt.fuzzy || false
  opt.limit = _opt.limit || 10
  opt.searchStrategy = _opt.fuzzy ? FuzzySearchStrategy : LiteralSearchStrategy
}

function findMatches(data,crit,strategy,opt){
  var matches = []
  for(var i = 0; i < data.length && matches.length < opt.limit; i++) {
    var match = findMatchesInObject(data[i],crit,strategy,opt)
    if( match ){
      matches.push(match)
    }
  }
  return matches
}

function findMatchesInObject(obj,crit,strategy,opt){
  for(var key in obj) {
    if( !isExcluded(obj[key], opt.exclude) && strategy.matches(obj[key], crit) ){
      return obj
    }
  }
}

function isExcluded(term, excludedTerms){
  var excluded = false
  excludedTerms = excludedTerms || []
  for (var i = 0; i<excludedTerms.length; i++) {
    var excludedTerm = excludedTerms[i]
    if( !excluded && new RegExp(term).test(excludedTerm) ){
      excluded = true
    }
  }
  return excluded
}

},{"./SearchStrategies/FuzzySearchStrategy":4,"./SearchStrategies/LiteralSearchStrategy":5}],4:[function(require,module,exports){
'use strict'
module.exports = new FuzzySearchStrategy()

function FuzzySearchStrategy(){
  function fuzzyRegexFromString(string){
    return new RegExp( string.split('').join('.*?'), 'gi')
  }

  this.matches = function(string,crit){
    if( typeof string !== 'string' ){
      return false
    }
    string = string.trim()
    return !!fuzzyRegexFromString(crit).test(string)
  }
}

},{}],5:[function(require,module,exports){
'use strict'
module.exports = new LiteralSearchStrategy()

function LiteralSearchStrategy(){
  function matchesString(string,crit){
    return string.toLowerCase().indexOf(crit.toLowerCase()) >= 0
  }

  this.matches = function(string,crit){
    if( typeof string !== 'string' ){
      return false
    }
    string = string.trim()
    return matchesString(string, crit)
  }
}

},{}],6:[function(require,module,exports){
'use strict'
module.exports = {
  compile: compile,
  setOptions: setOptions
}

var options = {}
options.pattern = /\{(.*?)\}/g
options.template = ''
options.middleware = function(){}

function setOptions(_options){
  options.pattern = _options.pattern || options.pattern
  options.template = _options.template || options.template
  if( typeof _options.middleware === 'function' ){
    options.middleware = _options.middleware
  }
}

function compile(data){
  return options.template.replace(options.pattern, function(match, prop) {
    var value = options.middleware(prop, data[prop], options.template)
    if( value !== undefined ){
      return value
    }
    return data[prop] || match
  })
}

},{}],7:[function(require,module,exports){
;(function(window, document, undefined){
  'use strict'

  var options = {
    searchInput: null,
    resultsContainer: null,
    json: [],
    searchResultTemplate: '<li><a href="{url}" title="{desc}">{title}</a></li>',
    templateMiddleware: function(){},
    noResultsText: 'No results found',
    limit: 10,
    fuzzy: false,
    exclude: []
  }

  var requiredOptions = ['searchInput','resultsContainer','json']

  var templater = require('./Templater')
  var repository = require('./Repository')
  var jsonLoader = require('./JSONLoader')
  var optionsValidator = require('./OptionsValidator')({
    required: requiredOptions
  })
  var utils = require('./utils')

  /*
    Public API
  */
  window.SimpleJekyllSearch = function SimpleJekyllSearch(_options){
    var errors = optionsValidator.validate(_options)
    if( errors.length > 0 ){
      throwError('You must specify the following required options: ' + requiredOptions)
    }

    options = utils.merge(options, _options)

    templater.setOptions({
      template: options.searchResultTemplate,
      middleware: options.templateMiddleware,
    })

    repository.setOptions({
      fuzzy: options.fuzzy,
      limit: options.limit,
    })

    if( utils.isJSON(options.json) ){
      initWithJSON(options.json)
    }else{
      initWithURL(options.json)
    }
  }

  // for backwards compatibility
  window.SimpleJekyllSearch.init = window.SimpleJekyllSearch


  function initWithJSON(json){
    repository.put(json)
    registerInput()
  }

  function initWithURL(url){
    jsonLoader.load(url, function(err,json){
      if( err ){
        throwError('failed to get JSON (' + url + ')')
      }
      initWithJSON(json)
    })
  }

  function emptyResultsContainer(){
    options.resultsContainer.innerHTML = ''
  }

  function appendToResultsContainer(text){
    options.resultsContainer.innerHTML += text
  }

  function registerInput(){
    options.searchInput.addEventListener('keyup', function(e){
      emptyResultsContainer()
      if( e.target.value.length > 0 ){
        render( repository.search(e.target.value) )
      }
    })
  }

  function render(results){
    if( results.length === 0 ){
      return appendToResultsContainer(options.noResultsText)
    }
    for (var i = 0; i < results.length; i++) {
      appendToResultsContainer( templater.compile(results[i]) )
    }
  }

  function throwError(message){ throw new Error('SimpleJekyllSearch --- '+ message) }
})(window, document);
},{"./JSONLoader":1,"./OptionsValidator":2,"./Repository":3,"./Templater":6,"./utils":8}],8:[function(require,module,exports){
'use strict'
module.exports = {
  merge: merge,
  isJSON: isJSON,
}

function merge(defaultParams, mergeParams){
  var mergedOptions = {}
  for(var option in defaultParams){
    mergedOptions[option] = defaultParams[option]
    if( mergeParams[option] !== undefined ){
      mergedOptions[option] = mergeParams[option]
    }
  }
  return mergedOptions
}

function isJSON(json){
  try{
    if( json instanceof Object && JSON.parse(JSON.stringify(json)) ){
      return true
    }
    return false
  }catch(e){
    return false
  }
}

},{}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL0pTT05Mb2FkZXIuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL09wdGlvbnNWYWxpZGF0b3IuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL1JlcG9zaXRvcnkuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL1NlYXJjaFN0cmF0ZWdpZXMvRnV6enlTZWFyY2hTdHJhdGVneS5qcyIsIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC9zcmMvU2VhcmNoU3RyYXRlZ2llcy9MaXRlcmFsU2VhcmNoU3RyYXRlZ3kuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL1RlbXBsYXRlci5qcyIsIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC9zcmMvZmFrZV83NzUxZWJmMC5qcyIsIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC9zcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcbm1vZHVsZS5leHBvcnRzID0ge1xuICBsb2FkOiBsb2FkXG59XG5cbmZ1bmN0aW9uIGxvYWQobG9jYXRpb24sY2FsbGJhY2spe1xuICB2YXIgeGhyXG4gIGlmKCB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgKXtcbiAgICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICB9ZWxzZXtcbiAgICB4aHIgPSBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKVxuICB9XG5cbiAgeGhyLm9wZW4oJ0dFVCcsIGxvY2F0aW9uLCB0cnVlKVxuXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuICAgIGlmICggeGhyLnN0YXR1cz09PTIwMCAmJiB4aHIucmVhZHlTdGF0ZT09PTQgKXtcbiAgICAgIHRyeXtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSApXG4gICAgICB9Y2F0Y2goZXJyKXtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHhoci5zZW5kKClcbn1cbiIsIid1c2Ugc3RyaWN0J1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBPcHRpb25zVmFsaWRhdG9yKHBhcmFtcyl7XG4gIGlmKCAhdmFsaWRhdGVQYXJhbXMocGFyYW1zKSApe1xuICAgIHRocm93IG5ldyBFcnJvcignLS0gT3B0aW9uc1ZhbGlkYXRvcjogcmVxdWlyZWQgb3B0aW9ucyBtaXNzaW5nJylcbiAgfVxuICBpZiggISh0aGlzIGluc3RhbmNlb2YgT3B0aW9uc1ZhbGlkYXRvcikgKXtcbiAgICByZXR1cm4gbmV3IE9wdGlvbnNWYWxpZGF0b3IocGFyYW1zKVxuICB9XG5cbiAgdmFyIHJlcXVpcmVkT3B0aW9ucyA9IHBhcmFtcy5yZXF1aXJlZFxuXG4gIHRoaXMuZ2V0UmVxdWlyZWRPcHRpb25zID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gcmVxdWlyZWRPcHRpb25zXG4gIH1cblxuICB0aGlzLnZhbGlkYXRlID0gZnVuY3Rpb24ocGFyYW1ldGVycyl7XG4gICAgdmFyIGVycm9ycyA9IFtdXG4gICAgcmVxdWlyZWRPcHRpb25zLmZvckVhY2goZnVuY3Rpb24ocmVxdWlyZWRPcHRpb25OYW1lKXtcbiAgICAgIGlmKCBwYXJhbWV0ZXJzW3JlcXVpcmVkT3B0aW9uTmFtZV0gPT09IHVuZGVmaW5lZCApe1xuICAgICAgICBlcnJvcnMucHVzaChyZXF1aXJlZE9wdGlvbk5hbWUpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gZXJyb3JzXG4gIH1cblxuICBmdW5jdGlvbiB2YWxpZGF0ZVBhcmFtcyhwYXJhbXMpe1xuICAgIGlmKCAhcGFyYW1zICkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHJldHVybiBwYXJhbXMucmVxdWlyZWQgIT09IHVuZGVmaW5lZCAmJiBwYXJhbXMucmVxdWlyZWQgaW5zdGFuY2VvZiBBcnJheVxuICB9XG59IiwiJ3VzZSBzdHJpY3QnXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcHV0OnB1dCxcbiAgY2xlYXI6IGNsZWFyLFxuICBnZXQ6IGdldCxcbiAgc2VhcmNoOiBzZWFyY2gsXG4gIHNldE9wdGlvbnM6IHNldE9wdGlvbnNcbn1cblxudmFyIEZ1enp5U2VhcmNoU3RyYXRlZ3kgPSByZXF1aXJlKCcuL1NlYXJjaFN0cmF0ZWdpZXMvRnV6enlTZWFyY2hTdHJhdGVneScpXG52YXIgTGl0ZXJhbFNlYXJjaFN0cmF0ZWd5ID0gcmVxdWlyZSgnLi9TZWFyY2hTdHJhdGVnaWVzL0xpdGVyYWxTZWFyY2hTdHJhdGVneScpXG5cbnZhciBkYXRhID0gW11cbnZhciBvcHQgPSB7fVxub3B0LmZ1enp5ID0gZmFsc2Vcbm9wdC5saW1pdCA9IDEwXG5vcHQuc2VhcmNoU3RyYXRlZ3kgPSBvcHQuZnV6enkgPyBGdXp6eVNlYXJjaFN0cmF0ZWd5IDogTGl0ZXJhbFNlYXJjaFN0cmF0ZWd5XG5cblxuZnVuY3Rpb24gcHV0KGRhdGEpe1xuICBpZiggaXNPYmplY3QoZGF0YSkgKXtcbiAgICByZXR1cm4gYWRkT2JqZWN0KGRhdGEpXG4gIH1cbiAgaWYoIGlzQXJyYXkoZGF0YSkgKXtcbiAgICByZXR1cm4gYWRkQXJyYXkoZGF0YSlcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkXG59XG5mdW5jdGlvbiBjbGVhcigpe1xuICBkYXRhLmxlbmd0aCA9IDBcbiAgcmV0dXJuIGRhdGFcbn1cblxuZnVuY3Rpb24gZ2V0KCl7XG4gIHJldHVybiBkYXRhXG59XG5cblxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKXsgcmV0dXJuICEhb2JqICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJyB9XG5mdW5jdGlvbiBpc0FycmF5KG9iail7IHJldHVybiAhIW9iaiAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJyB9XG5cbmZ1bmN0aW9uIGFkZE9iamVjdChfZGF0YSl7XG4gIGRhdGEucHVzaChfZGF0YSlcbiAgcmV0dXJuIGRhdGFcbn1cblxuZnVuY3Rpb24gYWRkQXJyYXkoX2RhdGEpe1xuICB2YXIgYWRkZWQgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IF9kYXRhLmxlbmd0aDsgaSsrKXtcbiAgICBpZiggaXNPYmplY3QoX2RhdGFbaV0pICl7XG4gICAgICBhZGRlZC5wdXNoKGFkZE9iamVjdChfZGF0YVtpXSkpXG4gICAgfVxuICB9XG4gIHJldHVybiBhZGRlZFxufVxuXG5cblxuZnVuY3Rpb24gc2VhcmNoKGNyaXQpe1xuICBpZiggIWNyaXQgKXtcbiAgICByZXR1cm4gW11cbiAgfVxuICByZXR1cm4gZmluZE1hdGNoZXMoZGF0YSxjcml0LG9wdC5zZWFyY2hTdHJhdGVneSxvcHQpXG59XG5cbmZ1bmN0aW9uIHNldE9wdGlvbnMoX29wdCl7XG4gIG9wdCA9IF9vcHQgfHwge31cblxuICBvcHQuZnV6enkgPSBfb3B0LmZ1enp5IHx8IGZhbHNlXG4gIG9wdC5saW1pdCA9IF9vcHQubGltaXQgfHwgMTBcbiAgb3B0LnNlYXJjaFN0cmF0ZWd5ID0gX29wdC5mdXp6eSA/IEZ1enp5U2VhcmNoU3RyYXRlZ3kgOiBMaXRlcmFsU2VhcmNoU3RyYXRlZ3lcbn1cblxuZnVuY3Rpb24gZmluZE1hdGNoZXMoZGF0YSxjcml0LHN0cmF0ZWd5LG9wdCl7XG4gIHZhciBtYXRjaGVzID0gW11cbiAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoICYmIG1hdGNoZXMubGVuZ3RoIDwgb3B0LmxpbWl0OyBpKyspIHtcbiAgICB2YXIgbWF0Y2ggPSBmaW5kTWF0Y2hlc0luT2JqZWN0KGRhdGFbaV0sY3JpdCxzdHJhdGVneSxvcHQpXG4gICAgaWYoIG1hdGNoICl7XG4gICAgICBtYXRjaGVzLnB1c2gobWF0Y2gpXG4gICAgfVxuICB9XG4gIHJldHVybiBtYXRjaGVzXG59XG5cbmZ1bmN0aW9uIGZpbmRNYXRjaGVzSW5PYmplY3Qob2JqLGNyaXQsc3RyYXRlZ3ksb3B0KXtcbiAgZm9yKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYoICFpc0V4Y2x1ZGVkKG9ialtrZXldLCBvcHQuZXhjbHVkZSkgJiYgc3RyYXRlZ3kubWF0Y2hlcyhvYmpba2V5XSwgY3JpdCkgKXtcbiAgICAgIHJldHVybiBvYmpcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNFeGNsdWRlZCh0ZXJtLCBleGNsdWRlZFRlcm1zKXtcbiAgdmFyIGV4Y2x1ZGVkID0gZmFsc2VcbiAgZXhjbHVkZWRUZXJtcyA9IGV4Y2x1ZGVkVGVybXMgfHwgW11cbiAgZm9yICh2YXIgaSA9IDA7IGk8ZXhjbHVkZWRUZXJtcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBleGNsdWRlZFRlcm0gPSBleGNsdWRlZFRlcm1zW2ldXG4gICAgaWYoICFleGNsdWRlZCAmJiBuZXcgUmVnRXhwKHRlcm0pLnRlc3QoZXhjbHVkZWRUZXJtKSApe1xuICAgICAgZXhjbHVkZWQgPSB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBleGNsdWRlZFxufVxuIiwiJ3VzZSBzdHJpY3QnXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBGdXp6eVNlYXJjaFN0cmF0ZWd5KClcblxuZnVuY3Rpb24gRnV6enlTZWFyY2hTdHJhdGVneSgpe1xuICBmdW5jdGlvbiBmdXp6eVJlZ2V4RnJvbVN0cmluZyhzdHJpbmcpe1xuICAgIHJldHVybiBuZXcgUmVnRXhwKCBzdHJpbmcuc3BsaXQoJycpLmpvaW4oJy4qPycpLCAnZ2knKVxuICB9XG5cbiAgdGhpcy5tYXRjaGVzID0gZnVuY3Rpb24oc3RyaW5nLGNyaXQpe1xuICAgIGlmKCB0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJyApe1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHN0cmluZyA9IHN0cmluZy50cmltKClcbiAgICByZXR1cm4gISFmdXp6eVJlZ2V4RnJvbVN0cmluZyhjcml0KS50ZXN0KHN0cmluZylcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBMaXRlcmFsU2VhcmNoU3RyYXRlZ3koKVxuXG5mdW5jdGlvbiBMaXRlcmFsU2VhcmNoU3RyYXRlZ3koKXtcbiAgZnVuY3Rpb24gbWF0Y2hlc1N0cmluZyhzdHJpbmcsY3JpdCl7XG4gICAgcmV0dXJuIHN0cmluZy50b0xvd2VyQ2FzZSgpLmluZGV4T2YoY3JpdC50b0xvd2VyQ2FzZSgpKSA+PSAwXG4gIH1cblxuICB0aGlzLm1hdGNoZXMgPSBmdW5jdGlvbihzdHJpbmcsY3JpdCl7XG4gICAgaWYoIHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnICl7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgc3RyaW5nID0gc3RyaW5nLnRyaW0oKVxuICAgIHJldHVybiBtYXRjaGVzU3RyaW5nKHN0cmluZywgY3JpdClcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29tcGlsZTogY29tcGlsZSxcbiAgc2V0T3B0aW9uczogc2V0T3B0aW9uc1xufVxuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnBhdHRlcm4gPSAvXFx7KC4qPylcXH0vZ1xub3B0aW9ucy50ZW1wbGF0ZSA9ICcnXG5vcHRpb25zLm1pZGRsZXdhcmUgPSBmdW5jdGlvbigpe31cblxuZnVuY3Rpb24gc2V0T3B0aW9ucyhfb3B0aW9ucyl7XG4gIG9wdGlvbnMucGF0dGVybiA9IF9vcHRpb25zLnBhdHRlcm4gfHwgb3B0aW9ucy5wYXR0ZXJuXG4gIG9wdGlvbnMudGVtcGxhdGUgPSBfb3B0aW9ucy50ZW1wbGF0ZSB8fCBvcHRpb25zLnRlbXBsYXRlXG4gIGlmKCB0eXBlb2YgX29wdGlvbnMubWlkZGxld2FyZSA9PT0gJ2Z1bmN0aW9uJyApe1xuICAgIG9wdGlvbnMubWlkZGxld2FyZSA9IF9vcHRpb25zLm1pZGRsZXdhcmVcbiAgfVxufVxuXG5mdW5jdGlvbiBjb21waWxlKGRhdGEpe1xuICByZXR1cm4gb3B0aW9ucy50ZW1wbGF0ZS5yZXBsYWNlKG9wdGlvbnMucGF0dGVybiwgZnVuY3Rpb24obWF0Y2gsIHByb3ApIHtcbiAgICB2YXIgdmFsdWUgPSBvcHRpb25zLm1pZGRsZXdhcmUocHJvcCwgZGF0YVtwcm9wXSwgb3B0aW9ucy50ZW1wbGF0ZSlcbiAgICBpZiggdmFsdWUgIT09IHVuZGVmaW5lZCApe1xuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuICAgIHJldHVybiBkYXRhW3Byb3BdIHx8IG1hdGNoXG4gIH0pXG59XG4iLCI7KGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCl7XG4gICd1c2Ugc3RyaWN0J1xuXG4gIHZhciBvcHRpb25zID0ge1xuICAgIHNlYXJjaElucHV0OiBudWxsLFxuICAgIHJlc3VsdHNDb250YWluZXI6IG51bGwsXG4gICAganNvbjogW10sXG4gICAgc2VhcmNoUmVzdWx0VGVtcGxhdGU6ICc8bGk+PGEgaHJlZj1cInt1cmx9XCIgdGl0bGU9XCJ7ZGVzY31cIj57dGl0bGV9PC9hPjwvbGk+JyxcbiAgICB0ZW1wbGF0ZU1pZGRsZXdhcmU6IGZ1bmN0aW9uKCl7fSxcbiAgICBub1Jlc3VsdHNUZXh0OiAnTm8gcmVzdWx0cyBmb3VuZCcsXG4gICAgbGltaXQ6IDEwLFxuICAgIGZ1enp5OiBmYWxzZSxcbiAgICBleGNsdWRlOiBbXVxuICB9XG5cbiAgdmFyIHJlcXVpcmVkT3B0aW9ucyA9IFsnc2VhcmNoSW5wdXQnLCdyZXN1bHRzQ29udGFpbmVyJywnanNvbiddXG5cbiAgdmFyIHRlbXBsYXRlciA9IHJlcXVpcmUoJy4vVGVtcGxhdGVyJylcbiAgdmFyIHJlcG9zaXRvcnkgPSByZXF1aXJlKCcuL1JlcG9zaXRvcnknKVxuICB2YXIganNvbkxvYWRlciA9IHJlcXVpcmUoJy4vSlNPTkxvYWRlcicpXG4gIHZhciBvcHRpb25zVmFsaWRhdG9yID0gcmVxdWlyZSgnLi9PcHRpb25zVmFsaWRhdG9yJykoe1xuICAgIHJlcXVpcmVkOiByZXF1aXJlZE9wdGlvbnNcbiAgfSlcbiAgdmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpXG5cbiAgLypcbiAgICBQdWJsaWMgQVBJXG4gICovXG4gIHdpbmRvdy5TaW1wbGVKZWt5bGxTZWFyY2ggPSBmdW5jdGlvbiBTaW1wbGVKZWt5bGxTZWFyY2goX29wdGlvbnMpe1xuICAgIHZhciBlcnJvcnMgPSBvcHRpb25zVmFsaWRhdG9yLnZhbGlkYXRlKF9vcHRpb25zKVxuICAgIGlmKCBlcnJvcnMubGVuZ3RoID4gMCApe1xuICAgICAgdGhyb3dFcnJvcignWW91IG11c3Qgc3BlY2lmeSB0aGUgZm9sbG93aW5nIHJlcXVpcmVkIG9wdGlvbnM6ICcgKyByZXF1aXJlZE9wdGlvbnMpXG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IHV0aWxzLm1lcmdlKG9wdGlvbnMsIF9vcHRpb25zKVxuXG4gICAgdGVtcGxhdGVyLnNldE9wdGlvbnMoe1xuICAgICAgdGVtcGxhdGU6IG9wdGlvbnMuc2VhcmNoUmVzdWx0VGVtcGxhdGUsXG4gICAgICBtaWRkbGV3YXJlOiBvcHRpb25zLnRlbXBsYXRlTWlkZGxld2FyZSxcbiAgICB9KVxuXG4gICAgcmVwb3NpdG9yeS5zZXRPcHRpb25zKHtcbiAgICAgIGZ1enp5OiBvcHRpb25zLmZ1enp5LFxuICAgICAgbGltaXQ6IG9wdGlvbnMubGltaXQsXG4gICAgfSlcblxuICAgIGlmKCB1dGlscy5pc0pTT04ob3B0aW9ucy5qc29uKSApe1xuICAgICAgaW5pdFdpdGhKU09OKG9wdGlvbnMuanNvbilcbiAgICB9ZWxzZXtcbiAgICAgIGluaXRXaXRoVVJMKG9wdGlvbnMuanNvbilcbiAgICB9XG4gIH1cblxuICAvLyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgd2luZG93LlNpbXBsZUpla3lsbFNlYXJjaC5pbml0ID0gd2luZG93LlNpbXBsZUpla3lsbFNlYXJjaFxuXG5cbiAgZnVuY3Rpb24gaW5pdFdpdGhKU09OKGpzb24pe1xuICAgIHJlcG9zaXRvcnkucHV0KGpzb24pXG4gICAgcmVnaXN0ZXJJbnB1dCgpXG4gIH1cblxuICBmdW5jdGlvbiBpbml0V2l0aFVSTCh1cmwpe1xuICAgIGpzb25Mb2FkZXIubG9hZCh1cmwsIGZ1bmN0aW9uKGVycixqc29uKXtcbiAgICAgIGlmKCBlcnIgKXtcbiAgICAgICAgdGhyb3dFcnJvcignZmFpbGVkIHRvIGdldCBKU09OICgnICsgdXJsICsgJyknKVxuICAgICAgfVxuICAgICAgaW5pdFdpdGhKU09OKGpzb24pXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGVtcHR5UmVzdWx0c0NvbnRhaW5lcigpe1xuICAgIG9wdGlvbnMucmVzdWx0c0NvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xuICB9XG5cbiAgZnVuY3Rpb24gYXBwZW5kVG9SZXN1bHRzQ29udGFpbmVyKHRleHQpe1xuICAgIG9wdGlvbnMucmVzdWx0c0NvbnRhaW5lci5pbm5lckhUTUwgKz0gdGV4dFxuICB9XG5cbiAgZnVuY3Rpb24gcmVnaXN0ZXJJbnB1dCgpe1xuICAgIG9wdGlvbnMuc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbihlKXtcbiAgICAgIGVtcHR5UmVzdWx0c0NvbnRhaW5lcigpXG4gICAgICBpZiggZS50YXJnZXQudmFsdWUubGVuZ3RoID4gMCApe1xuICAgICAgICByZW5kZXIoIHJlcG9zaXRvcnkuc2VhcmNoKGUudGFyZ2V0LnZhbHVlKSApXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcihyZXN1bHRzKXtcbiAgICBpZiggcmVzdWx0cy5sZW5ndGggPT09IDAgKXtcbiAgICAgIHJldHVybiBhcHBlbmRUb1Jlc3VsdHNDb250YWluZXIob3B0aW9ucy5ub1Jlc3VsdHNUZXh0KVxuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFwcGVuZFRvUmVzdWx0c0NvbnRhaW5lciggdGVtcGxhdGVyLmNvbXBpbGUocmVzdWx0c1tpXSkgKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRocm93RXJyb3IobWVzc2FnZSl7IHRocm93IG5ldyBFcnJvcignU2ltcGxlSmVreWxsU2VhcmNoIC0tLSAnKyBtZXNzYWdlKSB9XG59KSh3aW5kb3csIGRvY3VtZW50KTsiLCIndXNlIHN0cmljdCdcbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXJnZTogbWVyZ2UsXG4gIGlzSlNPTjogaXNKU09OLFxufVxuXG5mdW5jdGlvbiBtZXJnZShkZWZhdWx0UGFyYW1zLCBtZXJnZVBhcmFtcyl7XG4gIHZhciBtZXJnZWRPcHRpb25zID0ge31cbiAgZm9yKHZhciBvcHRpb24gaW4gZGVmYXVsdFBhcmFtcyl7XG4gICAgbWVyZ2VkT3B0aW9uc1tvcHRpb25dID0gZGVmYXVsdFBhcmFtc1tvcHRpb25dXG4gICAgaWYoIG1lcmdlUGFyYW1zW29wdGlvbl0gIT09IHVuZGVmaW5lZCApe1xuICAgICAgbWVyZ2VkT3B0aW9uc1tvcHRpb25dID0gbWVyZ2VQYXJhbXNbb3B0aW9uXVxuICAgIH1cbiAgfVxuICByZXR1cm4gbWVyZ2VkT3B0aW9uc1xufVxuXG5mdW5jdGlvbiBpc0pTT04oanNvbil7XG4gIHRyeXtcbiAgICBpZigganNvbiBpbnN0YW5jZW9mIE9iamVjdCAmJiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGpzb24pKSApe1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1jYXRjaChlKXtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuIl19
