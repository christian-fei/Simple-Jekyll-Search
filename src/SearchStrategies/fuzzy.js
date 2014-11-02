module.exports = new FuzzySearchStrategy();

function FuzzySearchStrategy(){
  var self = this;

  self.matches = function(string,crit){
    var regexp = new RegExp( crit.split('').join('.*?'), 'gi');
    return !!string.match(regexp);
  };
};