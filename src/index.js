(function (window) {
  'use strict'

  let options = {
    searchInput: null,
    resultsContainer: null,
    json: [],
    success: Function.prototype,
    searchResultTemplate: '<li><a href="{url}" title="{desc}">{title}</a></li>',
    templateMiddleware: Function.prototype,
    sortMiddleware: function () {
      return 0
    },
    noResultsText: 'No results found',
    limit: 10,
    fuzzy: false,
    debounceTime: null,
    exclude: [],
    onSearch: Function.prototype
  }

  let debounceTimerHandle
  const debounce = function (func, delayMillis) {
    if (delayMillis) {
      clearTimeout(debounceTimerHandle)
      debounceTimerHandle = setTimeout(func, delayMillis)
    } else {
      func.call()
    }
  }

  const requiredOptions = ['searchInput', 'resultsContainer', 'json']

  const templater = require('./Templater')
  const repository = require('./Repository')
  const jsonLoader = require('./JSONLoader')
  const optionsValidator = require('./OptionsValidator')({
    required: requiredOptions
  })
  const utils = require('./utils')

  window.SimpleJekyllSearch = function (_options) {
    const errors = optionsValidator.validate(_options)
    if (errors.length > 0) {
      throwError('You must specify the following required options: ' + requiredOptions)
    }

    options = utils.merge(options, _options)

    templater.setOptions({
      template: options.searchResultTemplate,
      middleware: options.templateMiddleware
    })

    repository.setOptions({
      fuzzy: options.fuzzy,
      limit: options.limit,
      sort: options.sortMiddleware,
      exclude: options.exclude
    })

    if (utils.isJSON(options.json)) {
      initWithJSON(options.json)
    } else {
      initWithURL(options.json)
    }

    const rv = {
      search: search
    }

    typeof options.success === 'function' && options.success.call(rv)
    return rv
  }

  function initWithJSON (json) {
    repository.put(json)
    registerInput()
  }

  function initWithURL (url) {
    jsonLoader.load(url, function (err, json) {
      if (err) {
        throwError('failed to get JSON (' + url + ')')
      }
      initWithJSON(json)
    })
  }

  function emptyResultsContainer () {
    options.resultsContainer.innerHTML = ''
  }

  function appendToResultsContainer (text) {
    options.resultsContainer.innerHTML += text
  }

  function registerInput () {
    options.searchInput.addEventListener('input', function (e) {
      if (isWhitelistedKey(e.which)) {
        emptyResultsContainer()
        debounce(function () { search(e.target.value) }, options.debounceTime)
      }
    })
  }

  function search (query) {
    if (isValidQuery(query)) {
      emptyResultsContainer()
      render(repository.search(query), query)

      typeof options.onSearch === 'function' && options.onSearch.call()
    }
  }

  function render (results, query) {
    const len = results.length
    if (len === 0) {
      return appendToResultsContainer(options.noResultsText)
    }
    for (let i = 0; i < len; i++) {
      results[i].query = query
      appendToResultsContainer(templater.compile(results[i]))
    }
  }

  function isValidQuery (query) {
    return query && query.length > 0
  }

  function isWhitelistedKey (key) {
    return [13, 16, 20, 37, 38, 39, 40, 91].indexOf(key) === -1
  }

  function throwError (message) {
    throw new Error('SimpleJekyllSearch --- ' + message)
  }
})(window)
