module.exports = {
  put:put,
  clear: clear,
  get: get
}

var store = []

function put(data){
  if( isObject(data) ) return addObject(data)
  if( isArray(data) ) return addArray(data)
  return undefined
}
function clear(){
  store.length = 0
  return store
}

function get(){
  return store
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
