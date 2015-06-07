;(function(window,document,undefined){
  'use strict'

  var searcher = require('./Searcher')
  var templater = require('./Templater')
  var store = require('./Store')
  var jsonLoader = require('./JSONLoader')

  var requiredOptions = [
    'searchInput',
    'resultsContainer',
    'json',
  ]

  var opt = {
    searchInput: null,
    resultsContainer: null,
    json: [],
    searchResultTemplate: '<li><a href="{url}" title="{desc}">{title}</a></li>',
    noResultsText: 'No results found',
    limit: 10,
    fuzzy: false,
    exclude: []
  }

  window.SimpleJekyllSearch = function SimpleJekyllSearch(_opt){
    opt = validateOptions(_opt)
    searcher.setOptions(_opt)

    isJSON(opt.json) ?
      initWithJSON(opt.json) :
      initWithURL(opt.json)
  }

  window.SimpleJekyllSearch.init = window.SimpleJekyllSearch

  function initWithJSON(json){
    store.put(opt.json)
    registerInput()
  }

  function initWithURL(url){
    jsonLoader.load(url, function(err,json){
      if( !err ) {
        store.put(json)
        registerInput()
      }else{
        throwError('failed to get JSON (' + url + ')')
      }
    })
  }


  function throwError(message){ throw new Error('SimpleJekyllSearch --- '+ message) }

  function validateOptions(_opt){
    for(var i = 0; i < requiredOptions.length; i++){
      var req = requiredOptions[i]
      if( !_opt[req] )
        throwError('You must specify a ' + req)
    }
    var ret = _opt
    for(var option in opt)
      ret[option] = _opt[option] || opt[option]
    return ret
  }

  function assignOptions(_opt){
    for(var option in opt)
      opt[option] = _opt[option] || opt[option]
  }

  function isJSON(json){
    try{
      return json instanceof Object && JSON.parse(JSON.stringify(json))
    }catch(e){
      return false
    }
  }

  function emptyResultsContainer(){
    opt.resultsContainer.innerHTML = ''
  }

  function appendToResultsContainer(text){
    opt.resultsContainer.innerHTML += text
  }

  function registerInput(){
    opt.searchInput.addEventListener('keyup', function(e){
      if( e.target.value.length == 0 ){
        emptyResultsContainer()
        return
      }
      render( searcher.search(store, e.target.value) )
    })
  }

  function render(results){
    emptyResultsContainer()
    if( results.length == 0 ){
      return appendToResultsContainer(opt.noResultsText)
    }
    for (var i = 0; i < results.length; i++) {
      appendToResultsContainer( templater.render(opt.searchResultTemplate, results[i]) )
    }
  }
})(window,document);
