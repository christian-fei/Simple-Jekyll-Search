module.exports = new LiteralSearchStrategy();

function LiteralSearchStrategy(){
  var self = this;
  this.matches = function(string,crit){
    return string.toLowerCase().indexOf(crit.toLowerCase()) >= 0;
  };
};