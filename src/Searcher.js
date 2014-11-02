module.exports = new Searcher();
function Searcher(){
  var self = this;

  var fuzzySearchStrategy = require('./SearchStrategies/fuzzy');
  var literalSearchStrategy = require('./SearchStrategies/literal');

  var fuzzy = false;
  var limit = 10;

  self.setFuzzy = function(_fuzzy){
    fuzzy = !!_fuzzy;
  };

  self.setLimit = function(_limit){
    limit = parseInt(_limit,10) || limit;
  };

  self.search = function(data,crit){
    var matches = [];
    if( !crit ) return matches;
    crit = crit.replace(/^ */,'').replace(/ *$/,'');
    var strategy = fuzzy ? fuzzySearchStrategy : literalSearchStrategy;
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
  };
};