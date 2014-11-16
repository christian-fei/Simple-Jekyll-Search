;(function(window,document,undefined){
  'use strict';
  
  var Searcher = require('./Searcher');
  var Templater = require('./Templater');
  var Store = require('./Store');
  var JSONLoader = require('./JSONLoader');

  var searcher = new Searcher();
  var templater = new Templater();
  var store = new Store();
  var jsonLoader = new JSONLoader();


  window.SimpleJekyllSearch = new SimpleJekyllSearch();
  function SimpleJekyllSearch(){
    var self = this;

    var requiredOptions = [
      'searchInput',
      'resultsContainer',
      'dataSource',
    ];
    var opt = {
      searchInput: null,
      resultsContainer: null,
      dataSource: [],
      searchResultTemplate: '<li><a href="{url}" title="{desc}">{title}</a></li>',
      noResultsText: 'No results found',
      limit: 10,
      fuzzy: false,
    };

    function initWithJSON(json){
      store.put(opt.dataSource);
      registerInput();      
    }

    function initWithURL(url){
      jsonLoader.load(url, function gotJSON(err,json){
        if( !err ) {
          store.put(json);
          registerInput();
        }else{
          throwError('failed to get JSON (' + url + ')');
        }
      });
    }

    self.init = function(_opt){
      validateOptions(_opt);
      assignOptions(_opt);
      if( isJSON(opt.dataSource) ){
        initWithJSON(opt.dataSource);
      }else{
        initWithURL(opt.dataSource);
      }
    };


    function throwError(message){ throw new Error('SimpleJekyllSearch --- '+ message); }

    function validateOptions(_opt){
      for(var i = 0; i < requiredOptions.length; i++){
        var req = requiredOptions[i];
        if( !_opt[req] )
          throwError('You must specify a ' + req);
      }
    }

    function assignOptions(_opt){
      for(var option in opt)
        opt[option] = _opt[option] || opt[option];
    }

    function isJSON(json){
      try{
        return json instanceof Object && JSON.parse(JSON.stringify(json));
      }catch(e){
        return false;
      }
    }

    function emptyResultsContainer(){
      opt.resultsContainer.innerHTML = '';    
    }

    function appendToResultsContainer(text){
      opt.resultsContainer.innerHTML += text;
    }

    function registerInput(){
      opt.searchInput.addEventListener('keyup', function(e){
        if( e.target.value.length == 0 ){
          emptyResultsContainer();
          return;
        }
        render( searcher.search(store, e.target.value) );
      });
    }

    function render(results){
      emptyResultsContainer();
      if( results.length == 0 ){
        return appendToResultsContainer(opt.noResultsText);
      }
      for (var i = 0; i < results.length; i++) {
        appendToResultsContainer( templater.render(opt.searchResultTemplate, results[i]) );
      };
    }

  };
})(window,document);
