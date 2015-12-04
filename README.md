Simple-Jekyll-Search
====================

[![Build Status](https://travis-ci.org/christian-fei/Simple-Jekyll-Search.svg?branch=master)](https://travis-ci.org/christian-fei/Simple-Jekyll-Search)

A JavaScript library to add search functionality to any Jekyll blog.

Find it on [npmjs.com](https://www.npmjs.com/package/simple-jekyll-search)

---

idea from this [blog post](https://alexpearce.me/2012/04/simple-jekyll-searching/#disqus_thread)

---



### Promotion: check out [Pomodoro.cc](https://pomodoro.cc/)


# [Demo](http://christian-fei.github.io/Simple-Jekyll-Search/)




# Install

```
bower install --save simple-jekyll-search
# or
npm install --save simple-jekyll-search
```




# Getting started

Place the following code in a file called `search.json` in the **root** of your Jekyll blog.

This file will be used as a small data source to perform the searches on the client side:

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

You need to place the following code within the layout where you want the search to appear. (See the configuration section below to customize it)

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


# Configuration

Customize SimpleJekyllSearch by passing in your configuration options:

```
SimpleJekyllSearch({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('results-container'),
  json: '/search.json',
})
```

#### searchInput (Element) [required]

The input element on which the plugin should listen for keyboard event and trigger the searching and rendering for articles.


#### resultsContainer (Element) [required]

The container element in which the search results should be rendered in. Typically an `<ul>`.


#### json (String|JSON) [required]

You can either pass in an URL to the `search.json` file, or the results in form of JSON directly, to save one round trip to get the data.


#### searchResultTemplate (String) [optional]

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


#### templateMiddleware (Function) [optional]

A function that will be called whenever a match in the template is found.

It gets passed the current property name, property value, and the template.

If the function returns a non-undefined value, it gets replaced in the template.

This can be potentially useful for manipulating URLs etc.

Example:

```
SimpleJekyllSearch({
  ...
  middleware: function(prop, value, template){
    if( prop === 'bar' ){
      return value.replace(/^\//, '')
    }
  }
  ...
})
```

See the [tests](src/Templater.test.js) for an in-depth code example



#### noResultsText (String) [optional]

The HTML that will be shown if the query didn't match anything.


#### limit (Number) [optional]

You can limit the number of posts rendered on the page.


#### fuzzy (Boolean) [optional]

Enable fuzzy search to allow less restrictive matching.

#### exclude (Array) [optional]

Pass in a list of terms you want to exclude (terms will be matched against a regex, so urls, words are allowed).







## Enabling full-text search

Replace 'search.json' with the following code:

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



## If search isn't working due to invalid JSON

- There is a filter plugin in the _plugins folder which should remove most characters that cause invalid JSON. To use it, add the simple_search_filter.rb file to your _plugins folder, and use `remove_chars` as a filter.

For example: in search.json, replace
```
"content"  : "{{ page.content | strip_html | strip_newlines }}"
```
with
```
"content"  : "{{ page.content | strip_html | strip_newlines | remove_chars | escape }}"
```

If this doesn't work when using Github pages you can try ```jsonify``` to make sure the content is json compatible:
```
"content"   : {{ page.content | jsonify }}
```
**Note: you don't need to use quotes ' " ' in this since ```jsonify``` automatically inserts them.**





##Browser support

Browser support should be about IE6+ with this `addEventListener` [shim](https://gist.github.com/eirikbacker/2864711#file-addeventlistener-polyfill-js)







# Dev setup

- `npm install` the dependencies.

- `gulp watch` during development

- `npm test` or `npm run test-watch` to run the unit tests
