module.exports = new LiteralSearchStrategy();

function LiteralSearchStrategy(){
  var self = this;

  self.matches = function(string,crit){
    return string.toLowerCase().indexOf(crit.toLowerCase()) >= 0;
  };
};