;(function(window,document,undefined){
  var templater = require('./Templater');
  var store = require('./Store');
  var searcher = require('./Searcher');
  var JSONLoader = require('./JSONLoader');

  window.SimpleJekyllSearch = function SimpleJekyllSearch(){
    var self = this;

    var requiredOptions = [
      'searchInput',
      'resultsContainer',
      'dataSource',
    ];
    var opt = {
      searchInput: null,
      resultsContainer: null,
      dataSource: null,
      searchResultTemplate: '<li><a href="{url}" title="{desc}">{title}</a></li>',
      noResultsText: 'No results found',
      limit: 10,
      fuzzy: false,
    };

    function throwError(message){ throw new Error('SimpleJekyllSearch --- '+ message); }

    function validateOptions(_opt){
      for (var i = 0, req = requiredOptions[i]; i < requiredOptions.length; i++)
        if( !_opt[req] ) throwError('You must specify a ' + req);
    }

    function assignOptions(_opt){
      for(var option in opt) opt[option] = _opt[option] || opt[option];
    }

    self.init = function(_opt){
      validateOptions(_opt);
      assignOptions(_opt);
    };
  };
})(window,document);