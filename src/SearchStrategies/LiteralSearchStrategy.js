'use strict'

module.exports = new LiteralSearchStrategy()

function LiteralSearchStrategy () {
  this.matches = function (str, crit) {
    if (typeof str !== 'string') {
      return false
    }
    str = str.trim()
    return str.toLowerCase().indexOf(crit.toLowerCase()) >= 0
  }
}
