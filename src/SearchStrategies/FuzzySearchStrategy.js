'use strict'
module.exports = new FuzzySearchStrategy()

function FuzzySearchStrategy(){
  this.matches = function(string, crit){
    if( typeof string !== 'string' || typeof crit !== 'string' ){
      return false
    }
    var fuzzy = fuzzyFrom(crit)
    return !!fuzzy.test(string)
  }

  function fuzzyFrom(string){
    var fuzzy = string
              .trim()
              .split('')
              .join('.*?')
              .replace('??','?')
    return new RegExp( fuzzy, 'gi')
  }
}
