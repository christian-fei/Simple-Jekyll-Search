Simple-Jekyll-Search
====================

No additional gems required. 

Works out of the box. 

Fast, lightweight, super easy to set up and fully customizable with CSS!






##Setup

There's an example included in this repo, check it out to fiddle around with the plugin really quickly.
Just `jekyll serve` the page and there you go.


### Steps

1) Include the basic `search.json` in the root of your Jekyll site

2) Include the script in your page

```html
<script src="js/jekyll-search.js"></script>
```

3) Add an input field for searching and an element to render the search results in.

E.g.:

```html
<input type="text" id="search" placeholder="search this site">
<ul id="search-results"></ul>
```

4) [#customize-the-plugin](Customize the plugin)




##Customize the plugin

If you want, you can customize several options of this plugin:

- `searchInput`				(Element) the input field to listen on
- `searchResults`			(Element) the container to which JekyllSearch will write the matched search results 
- `jsonFile`				(String) location of the JSON file, our little "database"
- `template`				(String) <a href="#template">template</a> (Mustache-like)
- `searchResultsHeader`		(String) Heading of the search results
- `limit`					(Integer) Limit the search results to a sane amount (10-15)
- `fuzzy`					(Boolean) Turn on/off <a href="#fuzzy-search">fuzzy search</a>
- `noResults`				(String) Text to display if nothing matched the search criteria

---

You can pass the customized properties into an object when you invoke the init function, like this:

Let's say I want to apply JekyllSearch to a non-default input field (`.search`), e.g. `#search-this-page`.

I also changed the location of the JSON file, which is now `site-search.json` and I have a different <a href="#template">template</a>.

Plus I want to turn on <a href="#fuzzy-search">fuzzy search</a>:


```javascript
JekyllSearch.init({
    searchInput: document.getElementById("search"),
    searchResults: document.getElementById("search-results"),
    jsonFile: "search.json",
    template: "<li><a href='{url}' title='{desc}'>{title}</a></li>",
    noResults: "no results found",
    fuzzy: true
});
```

The only thing left to do is to put the  <a href="https://github.com/christian-fei/Simple-Jekyll-Search/blob/master/search.json">search.json</a> file in the root directory of your Jekyll site to generate the JSON needed by JekyllSearch.




##Template

Templates in JekyllSearch are very dependent on your `search.json` file. You can only use properties that are listed in your mini-database.

In the default `search.json` file, these fields are defined and contains relevant information about an article:

"title", "category", "url" and "data".

So you can only use these fields in the template.

---

The syntax is fairly straightforward, put curly braces around a property and it will be replaced by JekyllSearch in that exact position.

E.g.

`<a href='{url}' title='{desc}'>{title}</a>` results in the following output for the first article:

`<a href='/jekyll-search-example/' title='This is an example description'>JekyllSearch example</a>`





##Fuzzy search

Ahh, good old fuzzy search..

I try to explain it with an example:

Finds the string `lorem ipsum dolor sit amet` even if you mistype several characters, like `lorm isum dlor st amt`







##Browser support

Browser support should be about IE6+ with this `addEventListener` [shim](https://gist.github.com/eirikbacker/2864711#file-addeventlistener-polyfill-js)







##jQuery

```javascript
$(".search").jekyllSearch( options );
```





##Special thanks

These awesome people helped with suggestions, improvements and bug reports to make this plugin better :

- [dashaman](http://dashaman.com/)
- [Todd Motto](http://toddmotto.com/)
- [Dillon de Voor](http://www.crocodillon.com/)
- [Abdel Raoof Olakara](http://abdelraoof.com/)






#License
##MIT licensed
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
