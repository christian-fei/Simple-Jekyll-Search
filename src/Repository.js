'use strict'

module.exports = {
  put: put,
  clear: clear,
  search: search,
  setOptions: setOptions
}

const FuzzySearchStrategy = require('./SearchStrategies/FuzzySearchStrategy')
const LiteralSearchStrategy = require('./SearchStrategies/LiteralSearchStrategy')

function NoSort () {
  return 0
}

const data = []
let opt = {}

opt.fuzzy = false
opt.limit = 10
opt.searchStrategy = opt.fuzzy ? FuzzySearchStrategy : LiteralSearchStrategy
opt.sort = NoSort
opt.exclude = []

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
  const added = []
  clear()
  for (let i = 0, len = _data.length; i < len; i++) {
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
  opt.exclude = _opt.exclude || []
}

function findMatches (data, crit, strategy, opt) {
  const matches = []
  for (let i = 0; i < data.length && matches.length < opt.limit; i++) {
    const match = findMatchesInObject(data[i], crit, strategy, opt)
    if (match) {
      matches.push(match)
    }
  }
  return matches
}

function findMatchesInObject (obj, crit, strategy, opt) {
  for (const key in obj) {
    if (!isExcluded(obj[key], opt.exclude) && strategy.matches(obj[key], crit)) {
      return obj
    }
  }
}

function isExcluded (term, excludedTerms) {
  for (let i = 0, len = excludedTerms.length; i < len; i++) {
    const excludedTerm = excludedTerms[i]
    if (new RegExp(excludedTerm).test(term)) {
      return true
    }
  }
  return false
}
