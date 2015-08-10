module.exports = {
  compile: compile,
  setOptions: setOptions
}

var opt = {}
opt.templatePattern = /\{(.*?)\}/g

function setOptions(_opt){
  opt = _opt || {}
  opt.templatePattern = _opt.templatePattern || /\{(.*?)\}/g
}

function compile(t, data){
  return t.replace(opt.templatePattern, function(match, prop) {
    return data[prop] || match
  })
}
