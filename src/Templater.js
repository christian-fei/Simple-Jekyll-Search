module.exports = function Templater(){
  var templatePattern = /\{(.*?)\}/g

  this.setTemplatePattern = function(newTemplatePattern){
    templatePattern = newTemplatePattern
  }

  this.render = function(t, data){
    return t.replace(templatePattern, function(match, prop) {
      return data[prop] || match
    })
  }
}
