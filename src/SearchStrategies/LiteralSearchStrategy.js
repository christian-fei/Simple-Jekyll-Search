module.exports = new LiteralSearchStrategy()

function LiteralSearchStrategy(){
  function stringMatches(string,crit){
    return string.toLowerCase().indexOf(crit.toLowerCase()) >= 0
  }

  this.matches = function(string,crit){
    if( typeof string !== 'string' ) return false
    string = string.trim()
    return string.toLowerCase().indexOf(crit.toLowerCase()) >= 0
  }
}
