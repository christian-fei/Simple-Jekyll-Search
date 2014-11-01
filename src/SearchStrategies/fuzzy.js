module.exports = new FuzzySearchStrategy();

function FuzzySearchStrategy(){
  var self = this;

  this.matches = function(string,crit){
    var regexp = new RegExp( string.split('').join('.*?'), 'gi');
    return !!string.match(regexp);
  };
};