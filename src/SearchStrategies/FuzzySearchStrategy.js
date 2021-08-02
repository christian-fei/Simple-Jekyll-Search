'use strict'

const fuzzysearch = require('fuzzysearch')

module.exports = new FuzzySearchStrategy()

function FuzzySearchStrategy () {
  this.matches = function (string, crit) {
    if (string === null) {
      return false
    }
    return fuzzysearch(crit.toLowerCase(), string.toLowerCase())
  }
}
