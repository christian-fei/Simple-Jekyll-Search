module.exports = function Templater(){
  var self = this;

  var placeholderPattern = /\{(.*?)\}/g;

  self.render = function(t, data){
    var rendered = t.replace(placeholderPattern, function(match, prop) {
      if( data[prop] === undefined ){
        throw new Error('fuck');
      }
      return data[prop];
    });
    return rendered;
  };
};