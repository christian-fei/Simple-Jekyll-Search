# [Simple-Jekyll-Search](https://www.npmjs.com/package/simple-jekyll-search)

[![Build Status](https://img.shields.io/travis/christian-fei/Simple-Jekyll-Search/master.svg?)](https://travis-ci.org/christian-fei/Simple-Jekyll-Search)
[![dependencies Status](https://img.shields.io/david/christian-fei/Simple-Jekyll-Search.svg)](https://david-dm.org/christian-fei/Simple-Jekyll-Search)
[![devDependencies Status](https://img.shields.io/david/dev/christian-fei/Simple-Jekyll-Search.svg)](https://david-dm.org/christian-fei/Simple-Jekyll-Search?type=dev)

A JavaScript library to add search functionality to any Jekyll blog.

## Use case

You have a blog, built with Jekyll, and want a **lightweight search functionality** on your blog, purely client-side?

*No server configurations or databases to maintain*.

Just **5 minutes** to have a **fully working searchable blog**.

---

## Wiki

**Check out the [wiki](https://github.com/christian-fei/Simple-Jekyll-Search/wiki) for all available options and help for troubleshooting**

## Installation

### npm

```sh
npm install simple-jekyll-search
```

## Getting started

### Create `search.json`

Place the following code in a file called `search.json` in the **root** of your Jekyll blog. (You can also get a copy [from here](/example/search.json))

This file will be used as a small data source to perform the searches on the client side:

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
      "date"     : "{{ post.date }}"
    } {% unless forloop.last %},{% endunless %}
  {% endfor %}
]
```


## Preparing the plugin

### Add DOM elements

SimpleJekyllSearch needs two `DOM` elements to work:

- a search input field
- a result container to display the results

#### Give me the code

Here is the code you can use with the default configuration:

You need to place the following code within the layout where you want the search to appear. (See the configuration section below to customize it)

For example in  **_layouts/default.html**:

```html
<!-- HTML elements for search -->
<input type="text" id="search-input" placeholder="Search blog posts..">
<ul id="results-container"></ul>

<!-- or without installing anything -->
<script src="https://unpkg.com/simple-jekyll-search@latest/dest/simple-jekyll-search.min.js"></script>
```


## Usage

Customize SimpleJekyllSearch by passing in your configuration options:

```js
var sjs = SimpleJekyllSearch({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('results-container'),
  json: '/search.json'
})
```

### returns { search }

A new instance of SimpleJekyllSearch returns an object, with the only property `search`.

`search` is a function used to simulate a user input and display the matching results. 

E.g.:

```
var sjs = SimpleJekyllSearch({ ...options })
sjs.search('Hello')
```

💡 it can be used to filter posts by tags or categories!

## Options

Check out the [wiki](https://github.com/christian-fei/Simple-Jekyll-Search/wiki#options) for the options!



## Development

- `npm install`
- `npm test`

#### Acceptance tests

```
cd example; jekyll serve

# in another tab

npm run cypress -- run
```

## Contributors

Thanks to all [contributors](https://github.com/christian-fei/Simple-Jekyll-Search/graphs/contributors) over the years! You are the best :)

> [@daviddarnes](https://github.com/daviddarnes)
[@XhmikosR](https://github.com/XhmikosR)
[@PeterDaveHello](https://github.com/PeterDaveHello)
[@mikeybeck](https://github.com/mikeybeck)
[@egladman](https://github.com/egladman)
[@midzer](https://github.com/midzer)
[@eduardoboucas](https://github.com/eduardoboucas)
[@kremalicious](https://github.com/kremalicious)
[@tibotiber](https://github.com/tibotiber)
and many others!

## Stargazers over time

[![Stargazers over time](https://starchart.cc/christian-fei/Simple-Jekyll-Search.svg)](https://starchart.cc/christian-fei/Simple-Jekyll-Search)
