module.exports = new Searcher();
function Searcher(){
  var self = this;

  var fuzzy = false;
  var limit = 10;

  var fuzzySearchStrategy = require('./SearchStrategies/fuzzy');
  var literalSearchStrategy = require('./SearchStrategies/literal');

  function trim(string){
    return string.replace(/^ */,'').replace(/ *$/,'');
  }

  function getSearchStrategy(){
    return fuzzy ? fuzzySearchStrategy : literalSearchStrategy;
  }

  function findMatchesWithStrategy(data,crit,strategy){
    var matches = [];
    for(var i = 0; i < data.length && i < limit; i++) {
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
  }

  self.setFuzzy = function(_fuzzy){ fuzzy = !!_fuzzy; };

  self.setLimit = function(_limit){ limit = parseInt(_limit,10) || limit; };

  self.search = function(data,crit){
    if( !crit ) return [];
    return findMatchesWithStrategy(data,trim(crit),getSearchStrategy());
  };
};