module.exports = new Store();

function Store(){
  var self = this;

  var store = [];

  function isObject(obj){
    return Object.prototype.toString.call(obj) == '[object Object]';
  }
  function isArray(obj){
    return Object.prototype.toString.call(obj) == '[object Array]';
  }

  function addObject(data){
    store.push(data);
  }

  function addArray(data){
    for (var i = 0; i < data.length; i++){
      if( isObject(data[i]) ){
        addObject(data);
      }
    }

  }

  self.get = function(){
    return store;
  };

  self.put = function(data){
    if( isObject(data) ){
      addObject(data);
    }
    if( isArray(data) ){
      addArray(data);
    }
  };
};