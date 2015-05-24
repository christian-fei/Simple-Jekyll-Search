module.exports = function Searcher(opt){
  var self = this

  opt = opt || {}

  var matches = []

  var fuzzy = false
  var limit = 10

  var fuzzySearchStrategy = require('./SearchStrategies/fuzzy')
  var literalSearchStrategy = require('./SearchStrategies/literal')

  self.setFuzzy = function(_fuzzy){ fuzzy = !!_fuzzy }

  self.setLimit = function(_limit){ limit = parseInt(_limit,10) || limit }

  self.search = function(data,crit){
    if( !crit ) return []
    matches.length = 0
    return findMatches(data,crit,getSearchStrategy(),opt)
  }

  function findMatches(store,crit,strategy,opt){
    var data = store.get()
    for(var i = 0; i < data.length && matches.length < limit; i++) {
      findMatchesInObject(data[i],crit,strategy,opt)
    }
    return matches
  }

  function findMatchesInObject(obj,crit,strategy,opt){
    for(var key in obj) {
      if( !isExcluded(obj[key], opt.exclude) && strategy.matches(obj[key], crit) ){
        matches.push(obj)
        break
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

  function getSearchStrategy(){
    return fuzzy ? fuzzySearchStrategy : literalSearchStrategy
  }
}
