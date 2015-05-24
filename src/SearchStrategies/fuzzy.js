module.exports = new FuzzySearchStrategy()

function FuzzySearchStrategy(){
  function fuzzyRegexFromString(string){
    return new RegExp( string.split('').join('.*?'), 'gi')
  }

  this.matches = function(string,crit){
    if( typeof string !== 'string' ) return false
    string = string.trim()
    return !!fuzzyRegexFromString(crit).test(string)
  }
}
