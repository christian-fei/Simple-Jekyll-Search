module.exports = function Templater(opt){
  opt = opt || {}
  var templatePattern = opt.templatePattern || /\{(.*?)\}/g

  this.render = function(t, data){
    return t.replace(templatePattern, function(match, prop) {
      return data[prop] || match
    })
  }
}
