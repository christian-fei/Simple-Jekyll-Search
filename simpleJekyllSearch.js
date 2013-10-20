(function($) {
    $.fn.simpleJekyllSearch = function(options) {
        var settings = $.extend({
            jsonFile            : '/search.json',
            template            : '<a href="{url}" title="{desc}">{title}</a>',
            searchResults       : '.results',
            searchResultsTitle  : '<h4>Search results</h4>',
            limit               : '10',
            noResults           : '<p>Oh shucks<br/><small>Nothing found :(</small></p>'
        }, options);

        var jsonData = [],
            origThis = this,
            searchResults = $(settings.searchResults);

        var matches = [];

        if(settings.jsonFile.length && searchResults.length){
            $.ajax({
                type: "GET",
                url: settings.jsonFile,
                dataType: 'json',
                success: function(data, textStatus, jqXHR) {
                    jsonData = data;
                    registerEvent();
                },
                error: function(x,y,z) {
                    console.log("***ERROR in simpleJekyllSearch.js***");
                    console.log(x);
                    console.log(y);
                    console.log(z);
                    // x.responseText should have what's wrong
                }
            });
        }

        function registerEvent(){
            origThis.keyup(function(e){
                if(e.which === 13){
                    if(matches)
                        window.location = matches[0].url;
                        
                    //follow the first link
                    // if(searchResults.children().length)
                }
                if($(this).val().length){
                    writeMatches( performSearch($(this).val()) );
                }else{
                    clearSearchResults();
                }
            });
        }

        function performSearch(str){
            matches = [];

            for (var i = 0; i < jsonData.length; i++) {
                var obj = jsonData[i];
                for (key in obj) {
                    if (obj.hasOwnProperty(key) && obj[key].toLowerCase().indexOf(str.toLowerCase()) >= 0){
                        matches.push(obj);
                        // i=jsonData.length;
                        break;
                    }
                }
            }
            return matches;
        }

        function writeMatches(m){
            clearSearchResults();

            searchResults.append( $(settings.searchResultsTitle) );

            if(m && m.length){
                for (var i = 0; i < m.length; i++) {
                    var obj = m[i];
                    output = settings.template;
                    for (key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            var regexp = new RegExp('\{' + key + '\}', 'g');
                            output = output.replace(regexp, obj[key]);
                        }
                    }
                    if(i < settings.limit)
                        searchResults.append($(output));
                    else
                        break;
                }
            }else{
                searchResults.append( settings.noResults );
            }
        }
        function clearSearchResults(){
            searchResults.children().remove();
        }
    }
}(jQuery));