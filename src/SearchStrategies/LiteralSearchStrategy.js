'use strict'

module.exports = new LiteralSearchStrategy()

function LiteralSearchStrategy () {
  this.matches = function (str, crit) {
    if (!str) return false

    str = str.trim().toLowerCase()
    crit = crit.trim().toLowerCase()

    return crit.split(' ').filter(function (word) {
      return str.indexOf(word) >= 0
    }).length === crit.split(' ').length
  }
}
