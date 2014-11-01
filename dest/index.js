(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = new Templater();

function Templater(){
  var self = this;

  var templatePattern = /\{(.*?)\}/g;

  self.setTemplatePattern = function(newTemplatePattern){
    templatePattern = newTemplatePattern;
  };

  self.render = function(t, data){
    return t.replace(templatePattern, function(match, prop) {
      return data[prop] || match;
    });
  };
};
},{}],2:[function(require,module,exports){
require('./Templater');
},{"./Templater":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2FpcGgvRG9jdW1lbnRzL3BsYXlncm91bmQvU2ltcGxlLUpla3lsbC1TZWFyY2gvc3JjL1RlbXBsYXRlci5qcyIsIi9Vc2Vycy9zYWlwaC9Eb2N1bWVudHMvcGxheWdyb3VuZC9TaW1wbGUtSmVreWxsLVNlYXJjaC9zcmMvZmFrZV82ODUyNTI3YS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gbmV3IFRlbXBsYXRlcigpO1xuXG5mdW5jdGlvbiBUZW1wbGF0ZXIoKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciB0ZW1wbGF0ZVBhdHRlcm4gPSAvXFx7KC4qPylcXH0vZztcblxuICBzZWxmLnNldFRlbXBsYXRlUGF0dGVybiA9IGZ1bmN0aW9uKG5ld1RlbXBsYXRlUGF0dGVybil7XG4gICAgdGVtcGxhdGVQYXR0ZXJuID0gbmV3VGVtcGxhdGVQYXR0ZXJuO1xuICB9O1xuXG4gIHNlbGYucmVuZGVyID0gZnVuY3Rpb24odCwgZGF0YSl7XG4gICAgcmV0dXJuIHQucmVwbGFjZSh0ZW1wbGF0ZVBhdHRlcm4sIGZ1bmN0aW9uKG1hdGNoLCBwcm9wKSB7XG4gICAgICByZXR1cm4gZGF0YVtwcm9wXSB8fCBtYXRjaDtcbiAgICB9KTtcbiAgfTtcbn07IiwicmVxdWlyZSgnLi9UZW1wbGF0ZXInKTsiXX0=
