;(function(window,document,undefined){
  'use strict'

  var options = {
    searchInput: null,
    resultsContainer: null,
    json: [],
    searchResultTemplate: '<li><a href="{url}" title="{desc}">{title}</a></li>',
    noResultsText: 'No results found',
    limit: 10,
    fuzzy: false,
    exclude: []
  }

  var requiredOptions = ['searchInput','resultsContainer','json']

  var templater = require('./Templater')
  var store = require('./Repository')
  var jsonLoader = require('./JSONLoader')
  var optionsValidator = require('./OptionsValidator')({
    required: requiredOptions
  })


  window.SimpleJekyllSearch = function SimpleJekyllSearch(_options){
    var errors = optionsValidator.validate(_options)
    if( errors.length > 0 ){
      throwError('You must specify the following required options: ' + requiredOptions)
    }

    options = mergeOptions(options, _options)

    store.setOptions(options)

    initWith(options.json)
  }

  window.SimpleJekyllSearch.init = window.SimpleJekyllSearch




  function mergeOptions(defaultOptions, options){
    var mergedOptions = {}
    for(var option in defaultOptions){
      if( options[option] !== undefined ){
        mergedOptions[option] = options[option]
      }
    }
    return mergedOptions
  }

  function initWith(json){
    isJSON(json) ?
      initWithJSON(json) :
      initWithURL(json)
  }

  function initWithJSON(json){
    store.put(json)
    registerInput()
  }

  function initWithURL(url){
    jsonLoader.load(url, function(err,json){
      if( err ){ throwError('failed to get JSON (' + url + ')') }
      store.put(json)
      registerInput()
    })
  }

  function throwError(message){ throw new Error('SimpleJekyllSearch --- '+ message) }

  function isJSON(json){
    try{
      return json instanceof Object && JSON.parse(JSON.stringify(json))
    }catch(e){
      return false
    }
  }

  function emptyResultsContainer(){
    options.resultsContainer.innerHTML = ''
  }

  function appendToResultsContainer(text){
    options.resultsContainer.innerHTML += text
  }

  function registerInput(){
    options.searchInput.addEventListener('keyup', function(e){
      if( e.target.value.length == 0 ){
        emptyResultsContainer()
        return
      }
      render( store.search(e.target.value) )
    })
  }

  function render(results){
    emptyResultsContainer()
    if( results.length == 0 ){
      return appendToResultsContainer(options.noResultsText)
    }
    for (var i = 0; i < results.length; i++) {
      appendToResultsContainer( templater.render(options.searchResultTemplate, results[i]) )
    }
  }
})(window,document);