Welcome to the Simple-Jekyll-Search wiki!

Here is a list of the available options, usage questions, troubleshootings, guides.

## Options
### searchInput (Element) [required]

The input element on which the plugin should listen for keyboard event and trigger the searching and rendering for articles.


### resultsContainer (Element) [required]

The container element in which the search results should be rendered in. Typically an `<ul>`.


### json (String|JSON) [required]

You can either pass in an URL to the `search.json` file, or the results in form of JSON directly, to save one round trip to get the data.


### searchResultTemplate (String) [optional]

The template of a single rendered search result.

The templating syntax is very simple: You just enclose the properties you want to replace with curly braces.

E.g.

The template

```html
<li><a href="{url}">{title}</a></li>
```

will render to the following

```html
<li><a href="/jekyll/update/2014/11/01/welcome-to-jekyll.html">Welcome to Jekyll!</a></li>
```

If the `search.json` contains this data

```json
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


### templateMiddleware (Function) [optional]

A function that will be called whenever a match in the template is found.

It gets passed the current property name, property value, and the template.

If the function returns a non-undefined value, it gets replaced in the template.

This can be potentially useful for manipulating URLs etc.

Example:

```js
SimpleJekyllSearch({
  ...
  templateMiddleware: function(prop, value, template) {
    if (prop === 'bar') {
      return value.replace(/^\//, '')
    }
  }
  ...
})
```

See the [tests](tests/Templater.test.js) for an in-depth code example

### sortMiddleware (Function) [optional]

A function that will be used to sort the filtered results.

It can be used for example to group the sections together.

Example:

```js
SimpleJekyllSearch({
  ...
  sortMiddleware: function(a, b) {
    var astr = String(a.section) + "-" + String(a.caption);
    var bstr = String(b.section) + "-" + String(b.caption);
    return astr.localeCompare(bstr)
  }
  ...
})
```

### noResultsText (String) [optional]

The HTML that will be shown if the query didn't match anything.


### limit (Number) [optional]

You can limit the number of posts rendered on the page.


### fuzzy (Boolean) [optional]

Enable fuzzy search to allow less restrictive matching.

### exclude (Array) [optional]

Pass in a list of terms you want to exclude (terms will be matched against a regex, so urls, words are allowed).

### debounceTime (Number) [optional]

Limit how many times the search function can be executed over the given time window. This is especially useful to improve the user experience when searching
over a large dataset (either with rare terms ou because the number of posts to display is large). If no `debounceTime` is provided a search will be triggered
on each keystroke.


---

## If search isn't working due to invalid JSON

- There is a filter plugin in the _plugins folder which should remove most characters that cause invalid JSON. To use it, add the simple_search_filter.rb file to your _plugins folder, and use `remove_chars` as a filter.

For example: in search.json, replace
```json
"content"  : "{{ page.content | strip_html | strip_newlines }}"
```
with
```json
"content"  : "{{ page.content | strip_html | strip_newlines | remove_chars | escape }}"
```

If this doesn't work when using Github pages you can try ```jsonify``` to make sure the content is json compatible:
```js
"content"   : {{ page.content | jsonify }}
```
**Note: you don't need to use quotes ' " ' in this since ```jsonify``` automatically inserts them.**


## Enabling full-text search

Replace 'search.json' with the following code:

```yaml
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
