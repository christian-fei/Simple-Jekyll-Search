'use strict'

module.exports = {
  put: put,
  clear: clear,
  search: search,
  setOptions: setOptions
}

var FuzzySearchStrategy = require('./SearchStrategies/FuzzySearchStrategy')
var LiteralSearchStrategy = require('./SearchStrategies/LiteralSearchStrategy')

function NoSort () {
  return 0
}

var data = []
var opt = {}

opt.fuzzy = false
opt.limit = 10
opt.searchStrategy = opt.fuzzy ? FuzzySearchStrategy : LiteralSearchStrategy
opt.sort = NoSort

function put (data) {
  if (isObject(data)) {
    return addObject(data)
  }
  if (isArray(data)) {
    return addArray(data)
  }
  return undefined
}
function clear () {
  data.length = 0
  return data
}

function isObject (obj) {
  return Boolean(obj) && Object.prototype.toString.call(obj) === '[object Object]'
}

function isArray (obj) {
  return Boolean(obj) && Object.prototype.toString.call(obj) === '[object Array]'
}

function addObject (_data) {
  data.push(_data)
  return data
}

function addArray (_data) {
  var added = []
  clear()
  for (var i = 0, len = _data.length; i < len; i++) {
    if (isObject(_data[i])) {
      added.push(addObject(_data[i]))
    }
  }
  return added
}

function search (crit) {
  if (!crit) {
    return []
  }
  return findMatches(data, crit, opt.searchStrategy, opt).sort(opt.sort)
}

function setOptions (_opt) {
  opt = _opt || {}

  opt.fuzzy = _opt.fuzzy || false
  opt.limit = _opt.limit || 10
  opt.searchStrategy = _opt.fuzzy ? FuzzySearchStrategy : LiteralSearchStrategy
  opt.sort = _opt.sort || NoSort
}

function findMatches (data, crit, strategy, opt) {
  var matches = []
  for (var i = 0; i < data.length && matches.length < opt.limit; i++) {
    var match = findMatchesInObject(data[i], crit, strategy, opt)
    if (match) {
      matches.push(match)
    }
  }
  return matches
}

function findMatchesInObject (obj, crit, strategy, opt) {
  for (var key in obj) {
    if (!isExcluded(obj[key], opt.exclude) && strategy.matches(obj[key], crit)) {
      return obj
    }
  }
}

function isExcluded (term, excludedTerms) {
  var excluded = false
  excludedTerms = excludedTerms || []
  for (var i = 0, len = excludedTerms.length; i < len; i++) {
    var excludedTerm = excludedTerms[i]
    if (!excluded && new RegExp(term).test(excludedTerm)) {
      excluded = true
    }
  }
  return excluded
}
