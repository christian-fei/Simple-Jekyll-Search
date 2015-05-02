;(function(window,document,undefined){
  'use strict'

  var Searcher = require('./Searcher')
  var Templater = require('./Templater')
  var Store = require('./Store')
  var JSONLoader = require('./JSONLoader')

  var searcher = new Searcher()
  var templater = new Templater()
  var store = new Store()
  var jsonLoader = new JSONLoader()


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
  }

  window.SimpleJekyllSearch = function SimpleJekyllSearch(_opt){
    validateOptions(_opt)
    assignOptions(_opt)
    isJSON(opt.json) ?
      initWithJSON(opt.json) :
      initWithURL(opt.json)
  }

  function initWithJSON(json){
    store.put(opt.json)
    registerInput()
  }

  function initWithURL(url){
    jsonLoader.load(url, function gotJSON(err,json){
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
