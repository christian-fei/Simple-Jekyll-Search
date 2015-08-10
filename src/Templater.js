module.exports = {
  compile: compile,
  setOptions: setOptions
}

var options = {}
options.templatePattern = /\{(.*?)\}/g

function setOptions(_options){
  options = _options || {}
  options.templatePattern = _options.templatePattern || /\{(.*?)\}/g
}

function compile(template, data){
  return template.replace(options.templatePattern, function(match, prop) {
    return data[prop] || match
  })
}
