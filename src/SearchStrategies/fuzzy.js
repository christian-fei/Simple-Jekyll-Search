module.exports = new FuzzySearchStrategy();

function FuzzySearchStrategy(){
  var self = this;

  function createFuzzyRegExpFromString(string){
    return new RegExp( string.split('').join('.*?'), 'gi');
  }

  self.matches = function(string,crit){
    if( typeof string !== 'string' ) return false;
    string = string.trim();
    return !!string.match(createFuzzyRegExpFromString(crit));
  };
};