'use strict'

module.exports = new LiteralSearchStrategy()

function LiteralSearchStrategy () {
  this.matches = function (str, crit) {
    if (!str) return false
    str = str.trim().toLowerCase()
    crit = crit.endsWith(' ') ? [crit.toLowerCase()] : crit.trim().toLowerCase().split(' ')

    return crit.filter(word => str.indexOf(word) >= 0).length === crit.length
  }
}
