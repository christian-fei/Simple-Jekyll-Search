'use strict'
module.exports = new FuzzySearchStrategy()

function FuzzySearchStrategy(){
  this.matches = function(string, crit){
    if( typeof string !== 'string' || typeof crit !== 'string' ){
      return false
    }
    var fuzzy = crit.split("")
                .reduce(function(a,b){ return a+'[^'+b+']*'+b; })
    fuzzy = new RegExp( fuzzy, 'gi')
    return !!fuzzy.test(string)
  }
}
