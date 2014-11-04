module.exports = function JSONLoader(){
  var self = this;

  function receivedResponse(xhr){
    return xhr.status==200 && xhr.readyState==4;
  }

  function handleResponse(xhr,callback){
    xhr.onreadystatechange = function(){
      if ( receivedResponse(xhr) ){
        try{
          callback(null,JSON.parse(xhr.responseText) );
        }catch(err){
          callback(err,null);
        }    
      }
    }
  }

  self.load = function(location,callback){
    var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("GET", location, true);
    handleResponse(xhr,callback);
    xhr.send();
  };
};