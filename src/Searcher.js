module.exports = function Searcher(opt){
  opt = opt || {}

  opt.fuzzy = opt.fuzzy || false
  opt.limit = opt.limit || 10
  opt.searchStrategy = opt.fuzzy ? require('./SearchStrategies/fuzzy') : require('./SearchStrategies/literal')

  this.search = function(data,crit){
    if( !crit ) return []
    return findMatches(data,crit,opt.searchStrategy,opt)
  }

  function findMatches(store,crit,strategy,opt){
    var matches = []
    var data = store.get()
    for(var i = 0; i < data.length && matches.length < opt.limit; i++) {
      var match = findMatchesInObject(data[i],crit,strategy,opt)
      if( match )
        matches.push(match)
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

}
