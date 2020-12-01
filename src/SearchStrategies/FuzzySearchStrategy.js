'use strict'

const fuzzysearch = require('fuzzysearch')

module.exports = new FuzzySearchStrategy()

function FuzzySearchStrategy () {
  this.matches = function (string, crit) {
    return fuzzysearch(crit.toLowerCase(), string.toLowerCase())
  }
}
