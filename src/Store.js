module.exports = function Store(_store){
  var store = []

  if( isArray(_store) ){
    addArray(_store)
  }

  function isObject(obj){ return !!obj && Object.prototype.toString.call(obj) == '[object Object]' }
  function isArray(obj){ return !!obj && Object.prototype.toString.call(obj) == '[object Array]' }

  function addObject(data){
    store.push(data)
    return data
  }

  function addArray(data){
    var added = []
    for (var i = 0; i < data.length; i++)
      if( isObject(data[i]) )
        added.push(addObject(data[i]))
    return added
  }

  this.clear = function(){
    store.length = 0
    return store
  }

  this.get = function(){
    return store
  }

  this.put = function(data){
    if( isObject(data) ) return addObject(data)
    if( isArray(data) ) return addArray(data)
    return undefined
  }
}
