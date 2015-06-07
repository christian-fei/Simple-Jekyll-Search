var opt = {}
opt.fuzzy = false
opt.limit = 10
opt.searchStrategy = opt.fuzzy ? require('./SearchStrategies/fuzzy') : require('./SearchStrategies/literal')


module.exports = {
  search: search,
  setOptions: setOptions
}

function search(data,crit){
  if( !crit ) return []
  return findMatches(data,crit,opt.searchStrategy,opt)
}

function setOptions(_opt){
  opt = _opt || {}

  opt.fuzzy = _opt.fuzzy || false
  opt.limit = _opt.limit || 10
  opt.searchStrategy = _opt.fuzzy ? require('./SearchStrategies/fuzzy') : require('./SearchStrategies/literal')
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
