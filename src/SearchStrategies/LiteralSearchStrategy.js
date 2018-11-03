'use strict'

module.exports = new LiteralSearchStrategy()

function LiteralSearchStrategy () {
  this.matches = function (str, crit) {
    if (!str) return false

    str = str.trim().toLowerCase()
    crit = crit.toLowerCase()

    return crit.split(' ').filter(function (word) {
      return str.indexOf(word) >= 0
    }).length > 0
  }
}
