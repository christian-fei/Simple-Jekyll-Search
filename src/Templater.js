module.exports = {
  compile: compile,
  setOptions: setOptions
}

var options = {}
options.pattern = /\{(.*?)\}/g

function setOptions(_options){
  options.pattern = _options.pattern || options.pattern
  options.template = _options.template || options.template
}

function setOptions(_options){
  options = _options || {}
  options.pattern = _options.pattern || /\{(.*?)\}/g
}

function compile(data){
  return options.template.replace(options.pattern, function(match, prop) {
    return data[prop] || match
  })
}
