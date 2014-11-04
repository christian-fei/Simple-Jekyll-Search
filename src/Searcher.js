module.exports = function Searcher(){
  var self = this;

  var matches = [];

  var fuzzy = false;
  var limit = 10;

  var fuzzySearchStrategy = require('./SearchStrategies/fuzzy');
  var literalSearchStrategy = require('./SearchStrategies/literal');

  self.setFuzzy = function(_fuzzy){ fuzzy = !!_fuzzy; };

  self.setLimit = function(_limit){ limit = parseInt(_limit,10) || limit; };

  self.search = function(data,crit){
    if( !crit ) return [];
    matches.length = 0;
    return findMatches(data,crit,getSearchStrategy());
  };

  function findMatches(store,crit,strategy){
    var data = store.get();
    for(var i = 0; i < data.length && matches.length < limit; i++) {
      findMatchesInObject(data[i],crit,strategy);
    }
    return matches;
  }

  function findMatchesInObject(obj,crit,strategy){
    for(var key in obj) {
      if( strategy.matches(obj[key], crit) ){
        matches.push(obj);
        break;
      }
    }
  }

  function getSearchStrategy(){
    return fuzzy ? fuzzySearchStrategy : literalSearchStrategy;
  }
};