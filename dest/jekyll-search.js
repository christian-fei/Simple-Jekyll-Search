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
    if ( xhr.readyState===4 && xhr.status===200 ){
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
  function makeFuzzy(string){
    string = string.split('').join('.*?')
    string = string.replace('??','?')
    return new RegExp( string, 'gi')
  }

  this.matches = function(string, crit){
    if( typeof string !== 'string' || typeof crit !== 'string' ){
      return false
    }
    string = string.trim()
    return !!makeFuzzy(crit).test(string)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xceG1yXFxEZXNrdG9wXFxTaW1wbGUtSmVreWxsLVNlYXJjaFxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovVXNlcnMveG1yL0Rlc2t0b3AvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL0pTT05Mb2FkZXIuanMiLCJDOi9Vc2Vycy94bXIvRGVza3RvcC9TaW1wbGUtSmVreWxsLVNlYXJjaC9zcmMvT3B0aW9uc1ZhbGlkYXRvci5qcyIsIkM6L1VzZXJzL3htci9EZXNrdG9wL1NpbXBsZS1KZWt5bGwtU2VhcmNoL3NyYy9SZXBvc2l0b3J5LmpzIiwiQzovVXNlcnMveG1yL0Rlc2t0b3AvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL1NlYXJjaFN0cmF0ZWdpZXMvRnV6enlTZWFyY2hTdHJhdGVneS5qcyIsIkM6L1VzZXJzL3htci9EZXNrdG9wL1NpbXBsZS1KZWt5bGwtU2VhcmNoL3NyYy9TZWFyY2hTdHJhdGVnaWVzL0xpdGVyYWxTZWFyY2hTdHJhdGVneS5qcyIsIkM6L1VzZXJzL3htci9EZXNrdG9wL1NpbXBsZS1KZWt5bGwtU2VhcmNoL3NyYy9UZW1wbGF0ZXIuanMiLCJDOi9Vc2Vycy94bXIvRGVza3RvcC9TaW1wbGUtSmVreWxsLVNlYXJjaC9zcmMvZmFrZV8xZmE1MmI3Ni5qcyIsIkM6L1VzZXJzL3htci9EZXNrdG9wL1NpbXBsZS1KZWt5bGwtU2VhcmNoL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgbG9hZDogbG9hZFxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkKGxvY2F0aW9uLGNhbGxiYWNrKXtcclxuICB2YXIgeGhyXHJcbiAgaWYoIHdpbmRvdy5YTUxIdHRwUmVxdWVzdCApe1xyXG4gICAgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcclxuICB9ZWxzZXtcclxuICAgIHhociA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpXHJcbiAgfVxyXG5cclxuICB4aHIub3BlbignR0VUJywgbG9jYXRpb24sIHRydWUpXHJcblxyXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xyXG4gICAgaWYgKCB4aHIucmVhZHlTdGF0ZT09PTQgJiYgeGhyLnN0YXR1cz09PTIwMCApe1xyXG4gICAgICB0cnl7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSApXHJcbiAgICAgIH1jYXRjaChlcnIpe1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgeGhyLnNlbmQoKVxyXG59XHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIE9wdGlvbnNWYWxpZGF0b3IocGFyYW1zKXtcclxuICBpZiggIXZhbGlkYXRlUGFyYW1zKHBhcmFtcykgKXtcclxuICAgIHRocm93IG5ldyBFcnJvcignLS0gT3B0aW9uc1ZhbGlkYXRvcjogcmVxdWlyZWQgb3B0aW9ucyBtaXNzaW5nJylcclxuICB9XHJcbiAgaWYoICEodGhpcyBpbnN0YW5jZW9mIE9wdGlvbnNWYWxpZGF0b3IpICl7XHJcbiAgICByZXR1cm4gbmV3IE9wdGlvbnNWYWxpZGF0b3IocGFyYW1zKVxyXG4gIH1cclxuXHJcbiAgdmFyIHJlcXVpcmVkT3B0aW9ucyA9IHBhcmFtcy5yZXF1aXJlZFxyXG5cclxuICB0aGlzLmdldFJlcXVpcmVkT3B0aW9ucyA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gcmVxdWlyZWRPcHRpb25zXHJcbiAgfVxyXG5cclxuICB0aGlzLnZhbGlkYXRlID0gZnVuY3Rpb24ocGFyYW1ldGVycyl7XHJcbiAgICB2YXIgZXJyb3JzID0gW11cclxuICAgIHJlcXVpcmVkT3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHJlcXVpcmVkT3B0aW9uTmFtZSl7XHJcbiAgICAgIGlmKCBwYXJhbWV0ZXJzW3JlcXVpcmVkT3B0aW9uTmFtZV0gPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICAgIGVycm9ycy5wdXNoKHJlcXVpcmVkT3B0aW9uTmFtZSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBlcnJvcnNcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHZhbGlkYXRlUGFyYW1zKHBhcmFtcyl7XHJcbiAgICBpZiggIXBhcmFtcyApIHtcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGFyYW1zLnJlcXVpcmVkICE9PSB1bmRlZmluZWQgJiYgcGFyYW1zLnJlcXVpcmVkIGluc3RhbmNlb2YgQXJyYXlcclxuICB9XHJcbn0iLCIndXNlIHN0cmljdCdcclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgcHV0OnB1dCxcclxuICBjbGVhcjogY2xlYXIsXHJcbiAgZ2V0OiBnZXQsXHJcbiAgc2VhcmNoOiBzZWFyY2gsXHJcbiAgc2V0T3B0aW9uczogc2V0T3B0aW9uc1xyXG59XHJcblxyXG52YXIgRnV6enlTZWFyY2hTdHJhdGVneSA9IHJlcXVpcmUoJy4vU2VhcmNoU3RyYXRlZ2llcy9GdXp6eVNlYXJjaFN0cmF0ZWd5JylcclxudmFyIExpdGVyYWxTZWFyY2hTdHJhdGVneSA9IHJlcXVpcmUoJy4vU2VhcmNoU3RyYXRlZ2llcy9MaXRlcmFsU2VhcmNoU3RyYXRlZ3knKVxyXG5cclxudmFyIGRhdGEgPSBbXVxyXG52YXIgb3B0ID0ge31cclxub3B0LmZ1enp5ID0gZmFsc2Vcclxub3B0LmxpbWl0ID0gMTBcclxub3B0LnNlYXJjaFN0cmF0ZWd5ID0gb3B0LmZ1enp5ID8gRnV6enlTZWFyY2hTdHJhdGVneSA6IExpdGVyYWxTZWFyY2hTdHJhdGVneVxyXG5cclxuXHJcbmZ1bmN0aW9uIHB1dChkYXRhKXtcclxuICBpZiggaXNPYmplY3QoZGF0YSkgKXtcclxuICAgIHJldHVybiBhZGRPYmplY3QoZGF0YSlcclxuICB9XHJcbiAgaWYoIGlzQXJyYXkoZGF0YSkgKXtcclxuICAgIHJldHVybiBhZGRBcnJheShkYXRhKVxyXG4gIH1cclxuICByZXR1cm4gdW5kZWZpbmVkXHJcbn1cclxuZnVuY3Rpb24gY2xlYXIoKXtcclxuICBkYXRhLmxlbmd0aCA9IDBcclxuICByZXR1cm4gZGF0YVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXQoKXtcclxuICByZXR1cm4gZGF0YVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKXsgcmV0dXJuICEhb2JqICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJyB9XHJcbmZ1bmN0aW9uIGlzQXJyYXkob2JqKXsgcmV0dXJuICEhb2JqICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nIH1cclxuXHJcbmZ1bmN0aW9uIGFkZE9iamVjdChfZGF0YSl7XHJcbiAgZGF0YS5wdXNoKF9kYXRhKVxyXG4gIHJldHVybiBkYXRhXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEFycmF5KF9kYXRhKXtcclxuICB2YXIgYWRkZWQgPSBbXVxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgX2RhdGEubGVuZ3RoOyBpKyspe1xyXG4gICAgaWYoIGlzT2JqZWN0KF9kYXRhW2ldKSApe1xyXG4gICAgICBhZGRlZC5wdXNoKGFkZE9iamVjdChfZGF0YVtpXSkpXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBhZGRlZFxyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHNlYXJjaChjcml0KXtcclxuICBpZiggIWNyaXQgKXtcclxuICAgIHJldHVybiBbXVxyXG4gIH1cclxuICByZXR1cm4gZmluZE1hdGNoZXMoZGF0YSxjcml0LG9wdC5zZWFyY2hTdHJhdGVneSxvcHQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldE9wdGlvbnMoX29wdCl7XHJcbiAgb3B0ID0gX29wdCB8fCB7fVxyXG5cclxuICBvcHQuZnV6enkgPSBfb3B0LmZ1enp5IHx8IGZhbHNlXHJcbiAgb3B0LmxpbWl0ID0gX29wdC5saW1pdCB8fCAxMFxyXG4gIG9wdC5zZWFyY2hTdHJhdGVneSA9IF9vcHQuZnV6enkgPyBGdXp6eVNlYXJjaFN0cmF0ZWd5IDogTGl0ZXJhbFNlYXJjaFN0cmF0ZWd5XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmRNYXRjaGVzKGRhdGEsY3JpdCxzdHJhdGVneSxvcHQpe1xyXG4gIHZhciBtYXRjaGVzID0gW11cclxuICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGggJiYgbWF0Y2hlcy5sZW5ndGggPCBvcHQubGltaXQ7IGkrKykge1xyXG4gICAgdmFyIG1hdGNoID0gZmluZE1hdGNoZXNJbk9iamVjdChkYXRhW2ldLGNyaXQsc3RyYXRlZ3ksb3B0KVxyXG4gICAgaWYoIG1hdGNoICl7XHJcbiAgICAgIG1hdGNoZXMucHVzaChtYXRjaClcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG1hdGNoZXNcclxufVxyXG5cclxuZnVuY3Rpb24gZmluZE1hdGNoZXNJbk9iamVjdChvYmosY3JpdCxzdHJhdGVneSxvcHQpe1xyXG4gIGZvcih2YXIga2V5IGluIG9iaikge1xyXG4gICAgaWYoICFpc0V4Y2x1ZGVkKG9ialtrZXldLCBvcHQuZXhjbHVkZSkgJiYgc3RyYXRlZ3kubWF0Y2hlcyhvYmpba2V5XSwgY3JpdCkgKXtcclxuICAgICAgcmV0dXJuIG9ialxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaXNFeGNsdWRlZCh0ZXJtLCBleGNsdWRlZFRlcm1zKXtcclxuICB2YXIgZXhjbHVkZWQgPSBmYWxzZVxyXG4gIGV4Y2x1ZGVkVGVybXMgPSBleGNsdWRlZFRlcm1zIHx8IFtdXHJcbiAgZm9yICh2YXIgaSA9IDA7IGk8ZXhjbHVkZWRUZXJtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGV4Y2x1ZGVkVGVybSA9IGV4Y2x1ZGVkVGVybXNbaV1cclxuICAgIGlmKCAhZXhjbHVkZWQgJiYgbmV3IFJlZ0V4cCh0ZXJtKS50ZXN0KGV4Y2x1ZGVkVGVybSkgKXtcclxuICAgICAgZXhjbHVkZWQgPSB0cnVlXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBleGNsdWRlZFxyXG59XHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBGdXp6eVNlYXJjaFN0cmF0ZWd5KClcclxuXHJcbmZ1bmN0aW9uIEZ1enp5U2VhcmNoU3RyYXRlZ3koKXtcclxuICBmdW5jdGlvbiBtYWtlRnV6enkoc3RyaW5nKXtcclxuICAgIHN0cmluZyA9IHN0cmluZy5zcGxpdCgnJykuam9pbignLio/JylcclxuICAgIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKCc/PycsJz8nKVxyXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoIHN0cmluZywgJ2dpJylcclxuICB9XHJcblxyXG4gIHRoaXMubWF0Y2hlcyA9IGZ1bmN0aW9uKHN0cmluZywgY3JpdCl7XHJcbiAgICBpZiggdHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycgfHwgdHlwZW9mIGNyaXQgIT09ICdzdHJpbmcnICl7XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gICAgc3RyaW5nID0gc3RyaW5nLnRyaW0oKVxyXG4gICAgcmV0dXJuICEhbWFrZUZ1enp5KGNyaXQpLnRlc3Qoc3RyaW5nKVxyXG4gIH1cclxufVxyXG4iLCIndXNlIHN0cmljdCdcclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgTGl0ZXJhbFNlYXJjaFN0cmF0ZWd5KClcclxuXHJcbmZ1bmN0aW9uIExpdGVyYWxTZWFyY2hTdHJhdGVneSgpe1xyXG4gIGZ1bmN0aW9uIG1hdGNoZXNTdHJpbmcoc3RyaW5nLGNyaXQpe1xyXG4gICAgcmV0dXJuIHN0cmluZy50b0xvd2VyQ2FzZSgpLmluZGV4T2YoY3JpdC50b0xvd2VyQ2FzZSgpKSA+PSAwXHJcbiAgfVxyXG5cclxuICB0aGlzLm1hdGNoZXMgPSBmdW5jdGlvbihzdHJpbmcsY3JpdCl7XHJcbiAgICBpZiggdHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycgKXtcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgICBzdHJpbmcgPSBzdHJpbmcudHJpbSgpXHJcbiAgICByZXR1cm4gbWF0Y2hlc1N0cmluZyhzdHJpbmcsIGNyaXQpXHJcbiAgfVxyXG59XHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBjb21waWxlOiBjb21waWxlLFxyXG4gIHNldE9wdGlvbnM6IHNldE9wdGlvbnNcclxufVxyXG5cclxudmFyIG9wdGlvbnMgPSB7fVxyXG5vcHRpb25zLnBhdHRlcm4gPSAvXFx7KC4qPylcXH0vZ1xyXG5vcHRpb25zLnRlbXBsYXRlID0gJydcclxub3B0aW9ucy5taWRkbGV3YXJlID0gZnVuY3Rpb24oKXt9XHJcblxyXG5mdW5jdGlvbiBzZXRPcHRpb25zKF9vcHRpb25zKXtcclxuICBvcHRpb25zLnBhdHRlcm4gPSBfb3B0aW9ucy5wYXR0ZXJuIHx8IG9wdGlvbnMucGF0dGVyblxyXG4gIG9wdGlvbnMudGVtcGxhdGUgPSBfb3B0aW9ucy50ZW1wbGF0ZSB8fCBvcHRpb25zLnRlbXBsYXRlXHJcbiAgaWYoIHR5cGVvZiBfb3B0aW9ucy5taWRkbGV3YXJlID09PSAnZnVuY3Rpb24nICl7XHJcbiAgICBvcHRpb25zLm1pZGRsZXdhcmUgPSBfb3B0aW9ucy5taWRkbGV3YXJlXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjb21waWxlKGRhdGEpe1xyXG4gIHJldHVybiBvcHRpb25zLnRlbXBsYXRlLnJlcGxhY2Uob3B0aW9ucy5wYXR0ZXJuLCBmdW5jdGlvbihtYXRjaCwgcHJvcCkge1xyXG4gICAgdmFyIHZhbHVlID0gb3B0aW9ucy5taWRkbGV3YXJlKHByb3AsIGRhdGFbcHJvcF0sIG9wdGlvbnMudGVtcGxhdGUpXHJcbiAgICBpZiggdmFsdWUgIT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm4gdmFsdWVcclxuICAgIH1cclxuICAgIHJldHVybiBkYXRhW3Byb3BdIHx8IG1hdGNoXHJcbiAgfSlcclxufVxyXG4iLCI7KGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCl7XHJcbiAgJ3VzZSBzdHJpY3QnXHJcblxyXG4gIHZhciBvcHRpb25zID0ge1xyXG4gICAgc2VhcmNoSW5wdXQ6IG51bGwsXHJcbiAgICByZXN1bHRzQ29udGFpbmVyOiBudWxsLFxyXG4gICAganNvbjogW10sXHJcbiAgICBzZWFyY2hSZXN1bHRUZW1wbGF0ZTogJzxsaT48YSBocmVmPVwie3VybH1cIiB0aXRsZT1cIntkZXNjfVwiPnt0aXRsZX08L2E+PC9saT4nLFxyXG4gICAgdGVtcGxhdGVNaWRkbGV3YXJlOiBmdW5jdGlvbigpe30sXHJcbiAgICBub1Jlc3VsdHNUZXh0OiAnTm8gcmVzdWx0cyBmb3VuZCcsXHJcbiAgICBsaW1pdDogMTAsXHJcbiAgICBmdXp6eTogZmFsc2UsXHJcbiAgICBleGNsdWRlOiBbXVxyXG4gIH1cclxuXHJcbiAgdmFyIHJlcXVpcmVkT3B0aW9ucyA9IFsnc2VhcmNoSW5wdXQnLCdyZXN1bHRzQ29udGFpbmVyJywnanNvbiddXHJcblxyXG4gIHZhciB0ZW1wbGF0ZXIgPSByZXF1aXJlKCcuL1RlbXBsYXRlcicpXHJcbiAgdmFyIHJlcG9zaXRvcnkgPSByZXF1aXJlKCcuL1JlcG9zaXRvcnknKVxyXG4gIHZhciBqc29uTG9hZGVyID0gcmVxdWlyZSgnLi9KU09OTG9hZGVyJylcclxuICB2YXIgb3B0aW9uc1ZhbGlkYXRvciA9IHJlcXVpcmUoJy4vT3B0aW9uc1ZhbGlkYXRvcicpKHtcclxuICAgIHJlcXVpcmVkOiByZXF1aXJlZE9wdGlvbnNcclxuICB9KVxyXG4gIHZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKVxyXG5cclxuICAvKlxyXG4gICAgUHVibGljIEFQSVxyXG4gICovXHJcbiAgd2luZG93LlNpbXBsZUpla3lsbFNlYXJjaCA9IGZ1bmN0aW9uIFNpbXBsZUpla3lsbFNlYXJjaChfb3B0aW9ucyl7XHJcbiAgICB2YXIgZXJyb3JzID0gb3B0aW9uc1ZhbGlkYXRvci52YWxpZGF0ZShfb3B0aW9ucylcclxuICAgIGlmKCBlcnJvcnMubGVuZ3RoID4gMCApe1xyXG4gICAgICB0aHJvd0Vycm9yKCdZb3UgbXVzdCBzcGVjaWZ5IHRoZSBmb2xsb3dpbmcgcmVxdWlyZWQgb3B0aW9uczogJyArIHJlcXVpcmVkT3B0aW9ucylcclxuICAgIH1cclxuXHJcbiAgICBvcHRpb25zID0gdXRpbHMubWVyZ2Uob3B0aW9ucywgX29wdGlvbnMpXHJcblxyXG4gICAgdGVtcGxhdGVyLnNldE9wdGlvbnMoe1xyXG4gICAgICB0ZW1wbGF0ZTogb3B0aW9ucy5zZWFyY2hSZXN1bHRUZW1wbGF0ZSxcclxuICAgICAgbWlkZGxld2FyZTogb3B0aW9ucy50ZW1wbGF0ZU1pZGRsZXdhcmUsXHJcbiAgICB9KVxyXG5cclxuICAgIHJlcG9zaXRvcnkuc2V0T3B0aW9ucyh7XHJcbiAgICAgIGZ1enp5OiBvcHRpb25zLmZ1enp5LFxyXG4gICAgICBsaW1pdDogb3B0aW9ucy5saW1pdCxcclxuICAgIH0pXHJcblxyXG4gICAgaWYoIHV0aWxzLmlzSlNPTihvcHRpb25zLmpzb24pICl7XHJcbiAgICAgIGluaXRXaXRoSlNPTihvcHRpb25zLmpzb24pXHJcbiAgICB9ZWxzZXtcclxuICAgICAgaW5pdFdpdGhVUkwob3B0aW9ucy5qc29uKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XHJcbiAgd2luZG93LlNpbXBsZUpla3lsbFNlYXJjaC5pbml0ID0gd2luZG93LlNpbXBsZUpla3lsbFNlYXJjaFxyXG5cclxuXHJcbiAgZnVuY3Rpb24gaW5pdFdpdGhKU09OKGpzb24pe1xyXG4gICAgcmVwb3NpdG9yeS5wdXQoanNvbilcclxuICAgIHJlZ2lzdGVySW5wdXQoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaW5pdFdpdGhVUkwodXJsKXtcclxuICAgIGpzb25Mb2FkZXIubG9hZCh1cmwsIGZ1bmN0aW9uKGVycixqc29uKXtcclxuICAgICAgaWYoIGVyciApe1xyXG4gICAgICAgIHRocm93RXJyb3IoJ2ZhaWxlZCB0byBnZXQgSlNPTiAoJyArIHVybCArICcpJylcclxuICAgICAgfVxyXG4gICAgICBpbml0V2l0aEpTT04oanNvbilcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBlbXB0eVJlc3VsdHNDb250YWluZXIoKXtcclxuICAgIG9wdGlvbnMucmVzdWx0c0NvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXBwZW5kVG9SZXN1bHRzQ29udGFpbmVyKHRleHQpe1xyXG4gICAgb3B0aW9ucy5yZXN1bHRzQ29udGFpbmVyLmlubmVySFRNTCArPSB0ZXh0XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZWdpc3RlcklucHV0KCl7XHJcbiAgICBvcHRpb25zLnNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgIGVtcHR5UmVzdWx0c0NvbnRhaW5lcigpXHJcbiAgICAgIGlmKCBlLnRhcmdldC52YWx1ZS5sZW5ndGggPiAwICl7XHJcbiAgICAgICAgcmVuZGVyKCByZXBvc2l0b3J5LnNlYXJjaChlLnRhcmdldC52YWx1ZSkgKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVuZGVyKHJlc3VsdHMpe1xyXG4gICAgaWYoIHJlc3VsdHMubGVuZ3RoID09PSAwICl7XHJcbiAgICAgIHJldHVybiBhcHBlbmRUb1Jlc3VsdHNDb250YWluZXIob3B0aW9ucy5ub1Jlc3VsdHNUZXh0KVxyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGFwcGVuZFRvUmVzdWx0c0NvbnRhaW5lciggdGVtcGxhdGVyLmNvbXBpbGUocmVzdWx0c1tpXSkgKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdGhyb3dFcnJvcihtZXNzYWdlKXsgdGhyb3cgbmV3IEVycm9yKCdTaW1wbGVKZWt5bGxTZWFyY2ggLS0tICcrIG1lc3NhZ2UpIH1cclxufSkod2luZG93LCBkb2N1bWVudCk7IiwiJ3VzZSBzdHJpY3QnXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIG1lcmdlOiBtZXJnZSxcclxuICBpc0pTT046IGlzSlNPTixcclxufVxyXG5cclxuZnVuY3Rpb24gbWVyZ2UoZGVmYXVsdFBhcmFtcywgbWVyZ2VQYXJhbXMpe1xyXG4gIHZhciBtZXJnZWRPcHRpb25zID0ge31cclxuICBmb3IodmFyIG9wdGlvbiBpbiBkZWZhdWx0UGFyYW1zKXtcclxuICAgIG1lcmdlZE9wdGlvbnNbb3B0aW9uXSA9IGRlZmF1bHRQYXJhbXNbb3B0aW9uXVxyXG4gICAgaWYoIG1lcmdlUGFyYW1zW29wdGlvbl0gIT09IHVuZGVmaW5lZCApe1xyXG4gICAgICBtZXJnZWRPcHRpb25zW29wdGlvbl0gPSBtZXJnZVBhcmFtc1tvcHRpb25dXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBtZXJnZWRPcHRpb25zXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzSlNPTihqc29uKXtcclxuICB0cnl7XHJcbiAgICBpZigganNvbiBpbnN0YW5jZW9mIE9iamVjdCAmJiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGpzb24pKSApe1xyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfWNhdGNoKGUpe1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG59XHJcbiJdfQ==
