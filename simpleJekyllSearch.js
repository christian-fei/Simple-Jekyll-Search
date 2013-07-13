(function($) {
    $.fn.simpleJekyllSearch = function(options) {
        var settings = $.extend({
            jsonFile        : '/search.json',
            jsonFormat      : 'title,category,desc,url,date',
            template        : '<a href="{url}" title="{title}">{title}</a>',
            searchResults   : '.results',
            searchResultsTitle   : '<h4>Search results</h4>',
            limit           : '10',
            noResults       : '<p>Oh shucks<br/><small>Nothing found :(</small></p>'
        }, options);

        var properties = settings.jsonFormat.split(',');
        //console.log(properties);
        
        var jsonData = [],
            origThis = this,
            searchResults = $(settings.searchResults);

        if(settings.jsonFile.length && searchResults.length){
            $.ajax({
                type: "GET",
                url: settings.jsonFile,
                dataType: "html",
                success: function(data, textStatus, jqXHR) {
                    if(formatMatchesWithJSON(data)){
                        registerEvent();
                    }else{
                        console.log('the properties do not match the keys of the JSON file');
                    }
                },
                error: function(x,y,z) {
                    console.log('error');
                    // x.responseText should have what's wrong
                }
            });
        }


        function formatMatchesWithJSON(d){
            jsonData = $.parseJSON(d);
            var tmpprop='',
                match = true,
                c=0;
            for(var i in jsonData[0]){
                if(i !== properties[c]){
                    match=false;
                    break;
                }
                c++;
            }                
            return match;
        }


           
        console.log($(this));
        console.log(this);

        function registerEvent(){
            origThis.keyup(function(e){
                if($(this).val().length){
                    writeMatches( performSearch($(this).val()) );
                }else{
                    clearSearchResults();
                }
            });
        }

        function performSearch(str){
            var matches = [];

            $.each(jsonData,function(i,entry){
                for(var i=0;i<properties.length;i++)
                    if(entry[properties[i]] !== undefined && entry[properties[i]].toLowerCase().indexOf(str.toLowerCase()) > 1){
                        matches.push(entry);
                        i=properties.length;
                    }
            });
            return matches;

        }

        function writeMatches(m){
            clearSearchResults();
            searchResults.append( $(settings.searchResultsTitle) );

            if(m.length){
                $.each(m,function(i,entry){
                    if(i<settings.limit){
                        var output=settings.template;
                        for(var i=0;i<properties.length;i++){
                            var regex = new RegExp("\{" + properties[i] + "\}", 'g');
                            output = output.replace(regex, entry[properties[i]]);
                            //console.log('o ' + output);
                        }
                        //console.log('push ' + output);
                        searchResults.append($(output));
                    }
                });
            }else{
                searchResults.append( settings.noResults );
            }


        }

        function clearSearchResults(){
            searchResults.children().remove();
        }
    }
}(jQuery));