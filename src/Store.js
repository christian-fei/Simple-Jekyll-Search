module.exports = function Store(){
  var self = this;

  var store = [];

  self.populate = function(data){
    store.push.apply(store,data);
  };
};