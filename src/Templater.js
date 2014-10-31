module.exports = function Templater(){
  var self = this;

  self.render = function(t, data){
    return t.replace(/\{(.*?)\}/g, function(match, prop) {
      return data[ prop ];
    });
  };
};