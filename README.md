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
layout: none
---
[
  {% for post in site.posts %}
    {
      "title"    : "{{ post.title | escape }}",
      "category" : "{{ post.category }}",
      "tags"     : "{{ post.tags | array_to_sentence_string }}",
      "url"      : "{{ site.baseurl }}{{ post.url }}",
      "date"     : "{{ post.date }}"
    } {% unless forloop.last %},{% endunless %}
  {% endfor %}
]
```

- initialize the library ( [options](#options) )



# Install with bower

```
bower install simple-jekyll-search
```





# Options

You can customize several aspects of the plugin.

The library exposes one method called `init`, to which you can pass your preferences in form of a Hashmap, like this:

```
SimpleJekyllSearch.init({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('results-container'),
  dataSource: '/search.json',
})
```

### searchInput (Element) [required]

The input element on which the plugin should listen for keyboard event and trigger the searching and rendering for articles.


### resultsContainer (Element) [required]

The container element in which the search results should be rendered in. Typically and `<ul>`.


### dataSource (String|JSON) [required]

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






##Browser support

Browser support should be about IE6+ with this `addEventListener` [shim](https://gist.github.com/eirikbacker/2864711#file-addeventlistener-polyfill-js)





# Dev setup

- `npm install` the dependencies.

- `gulp watch` during development

- `npm test` or `npm run watch-test` to run the unit tests






##Special thanks

These awesome people helped with suggestions, improvements and bug reports to make this plugin better :

- [David Darnes](https://github.com/daviddarnes)
- [dashaman](http://dashaman.com/)
- [Todd Motto](http://toddmotto.com/)
- [Dillon de Voor](http://www.crocodillon.com/)
- [Abdel Raoof Olakara](http://abdelraoof.com/)






#License
##MIT licensed
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
