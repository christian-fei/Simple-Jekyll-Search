Simple-Jekyll-Search
====================

[![Build Status](https://travis-ci.org/christian-fei/Simple-Jekyll-Search.svg?branch=master)](https://travis-ci.org/christian-fei/Simple-Jekyll-Search)

A JavaScript library to add search functionality to any Jekyll blog.

---

idea from this [blog post](https://alexpearce.me/2012/04/simple-jekyll-searching/#disqus_thread)

---


### Promotion: check out [Pomodoro.cc](https://pomodoro.cc/)


# [Demo](http://christian-fei.github.io/Simple-Jekyll-Search/)



# Getting started

- Place the following code in a file called `search.json` in the **root** of your Jekyll blog. This file will be used as a small data source to perform the searches on the client side:

```
---
---
[
  {% for post in site.posts %}
    {
      "title"    : "{{ post.title | escape }}",
      "category" : "{{ post.category }}",
      "tags"     : "{{ post.tags | join: ', ' }}",
      "url"      : "{{ site.baseurl }}{{ post.url }}",
      "date"     : "{{ post.date }}"
    } {% unless forloop.last %},{% endunless %}
  {% endfor %}
]
```

- configure the library ( [options](#options) )

### Enabling full-text search
Note that the index generated in `search.json` does not include the posts' content since you may not want to load the whole content of your blog in each single page. However, if some of you want to enable full-text search, you can still add the posts' content to the index, either to the normal search, or on an additional search page with a dedicated second index file. To do this, simply add

```
"content"  : "{{ post.content | strip_html | strip_newlines }}"
```

to `search.json` after the `"date"` line to which you must add a comma (`,`).




# Install with bower

```
bower install simple-jekyll-search
```




# Setup

You need to place the following code within the layout where you want he search to appear.

For example in  **_layouts/default.html**:

```
<!-- Html Elements for Search -->
<div id="search-container">
<input type="text" id="search-input" placeholder="search...">
<ul id="results-container"></ul>
</div>

<!-- Script pointing to jekyll-search.js -->
<script src="{{ site.baseurl }}/bower_components/simple-jekyll-search/dest/jekyll-search.js" type="text/javascript"></script>
```


# Options

Customize SimpleJekyllSearch by passing in your configuration options:

```
SimpleJekyllSearch({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('results-container'),
  json: '/search.json',
})
```

The above initialization needs to occur after the inclusion of `jekyll-search.js`.


### searchInput (Element) [required]

The input element on which the plugin should listen for keyboard event and trigger the searching and rendering for articles.


### resultsContainer (Element) [required]

The container element in which the search results should be rendered in. Typically an `<ul>`.


### json (String|JSON) [required]

You can either pass in an URL to the `search.json` file, or the results in form of JSON directly, to save one round trip to get the data.


### searchResultTemplate

The template of a single rendered search result.

The templating syntax is very simple: You just enclose the properties you want to replace with curly braces.

E.g.

The template

```
<li><a href="{url}">{title}</a></li>
```

will render to the following

```
<li><a href="/jekyll/update/2014/11/01/welcome-to-jekyll.html">Welcome to Jekyll!</a></li>
```

If the `search.json` contains this data

```
[

    {
      "title"    : "Welcome to Jekyll!",
      "category" : "",
      "tags"     : "",
      "url"      : "/jekyll/update/2014/11/01/welcome-to-jekyll.html",
      "date"     : "2014-11-01 21:07:22 +0100"
    }

]
```


### noResultsText

The HTML that will be shown if the query didn't match anything.


### limit

You can limit the number of posts rendered on the page.


### fuzzy

Enable fuzzy search to allow less restrictive matching.

### exclude

Pass in a list of terms you want to exclude (terms will be matched against a regex, so urls, words are allowed).


## Enable full content search of posts and pages

- Replace 'search.json' with the following code:

```
---
layout: null
---
[
  {% for post in site.posts %}
    {
      "title"    : "{{ post.title | escape }}",
      "category" : "{{ post.category }}",
      "tags"     : "{{ post.tags | join: ', ' }}",
      "url"      : "{{ site.baseurl }}{{ post.url }}",
      "date"     : "{{ post.date }}",
      "content"  : "{{ post.content | strip_html | strip_newlines }}"
    } {% unless forloop.last %},{% endunless %}
  {% endfor %}
  ,
  {% for page in site.pages %}
   {
     {% if page.title != nil %}
        "title"    : "{{ page.title | escape }}",
        "category" : "{{ page.category }}",
        "tags"     : "{{ page.tags | join: ', ' }}",
        "url"      : "{{ site.baseurl }}{{ page.url }}",
        "date"     : "{{ page.date }}",
        "content"  : "{{ page.content | strip_html | strip_newlines }}"
     {% endif %}
   } {% unless forloop.last %},{% endunless %}
  {% endfor %}
]
```

### If search isn't working due to invalid JSON

- There is a filter plugin in the _plugins folder which should remove most characters that cause invalid JSON. To use it, add the simple_search_filter.rb file to your _plugins folder, and use `remove_chars` as a filter.

For example: in search.json, replace
```
"content"  : "{{ page.content | strip_html | strip_newlines }}"
```
with
```
"content"  : "{{ page.content | strip_html | strip_newlines | remove_chars | escape }}"
```


##Browser support

Browser support should be about IE6+ with this `addEventListener` [shim](https://gist.github.com/eirikbacker/2864711#file-addeventlistener-polyfill-js)





# Dev setup

- `npm install` the dependencies.

- `gulp watch` during development

- `npm test` or `npm run watch-test` to run the unit tests




#License
##MIT licensed
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
