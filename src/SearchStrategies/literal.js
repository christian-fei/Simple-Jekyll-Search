module.exports = new LiteralSearchStrategy();

function LiteralSearchStrategy(){
  var self = this;

  function doMatch(string,crit){
    return string.toLowerCase().indexOf(crit.toLowerCase()) >= 0;
  }

  self.matches = function(string,crit){
    if( typeof string !== 'string' ) return false;
    string = string.trim();
    return doMatch(string,crit);
  };
};