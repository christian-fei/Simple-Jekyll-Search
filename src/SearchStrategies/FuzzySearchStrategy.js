'use strict'
module.exports = new FuzzySearchStrategy()

function FuzzySearchStrategy(){
  function makeFuzzy(string){
    string = string.split('').join('.*?')
    string = string.replace('??','?')
    return new RegExp( string, 'gi')
  }

  this.matches = function(string, crit){
    if( typeof string !== 'string' || typeof crit !== 'string' ){
      return false
    }
    string = string.trim()
    return !!makeFuzzy(crit).test(string)
  }
}
