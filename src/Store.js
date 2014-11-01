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
    return data;
  }

  function addArray(data){
    var added = [];
    for (var i = 0; i < data.length; i++){
      if( isObject(data[i]) ){
        added.push(addObject(data[i]));
      }
    }
    return added;
  }

  self.get = function(){
    return store;
  };

  self.put = function(data){
    if( isObject(data) ){
      return addObject(data);
    }
    if( isArray(data) ){
      return addArray(data);
    }
  };
};