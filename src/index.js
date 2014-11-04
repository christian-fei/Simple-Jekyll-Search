;(function(window,document,undefined){
  'use strict';
  
  var templater = require('./Templater');
  var store = require('./Store');
  var searcher = require('./Searcher');
  var JSONLoader = require('./JSONLoader');

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


    self.init = function(_opt){
      validateOptions(_opt);
      assignOptions(_opt);
      if( isJSON(opt.dataSource) ){
        store.put(opt.dataSource);
        registerInput();
      }else{
        JSONLoader.load(opt.dataSource, function gotJSON(err,json){
          if( !err ) {
            store.put(json);
            registerInput();
          }
          else
            throwError('failed to get JSON (' + opt.dataSource + ')');
        });
      }
    };


    function throwError(message){ throw new Error('SimpleJekyllSearch --- '+ message); }

    function validateOptions(_opt){
      for (var i = 0; i < requiredOptions.length; i++){
        var req = requiredOptions[i];
        if( !_opt[req] ) throwError('You must specify a ' + req);
      }
    }

    function assignOptions(_opt){
      for(var option in opt) opt[option] = _opt[option] || opt[option];
    }

    function isJSON(json){
      try{
        return json instanceof Object && JSON.parse(JSON.stringify(json));
      }catch(e){
        return false;
      }
    }

    function registerInput(){
      opt.searchInput.addEventListener('keyup', function(e){
        render( searcher.search(store, e.target.value) );
      });
    }

    function render(results){
      opt.resultsContainer.innerHTML = '';
      for (var i = 0; i < results.length; i++) {
        var rendered = templater.render(opt.searchResultTemplate, results[i]);
        opt.resultsContainer.innerHTML += rendered;
      };
    }

  };
})(window,document);
