---
title: HTML <select> with dynamic size
picture: /assets/img/select.jpg
date: 2020-04-02T20:21:51.632Z
summary: "Did you ever face the problem to set the width of a <select> Element
  based on the selected option? Maybe this post will help you out. "
tags:
  - html
  - css
  - javascript
---
## The `<select>` Element 

The HTML `<select>` represents a control that provides a menu of various options. In general you set the following HTML structure: 

```html
<label for="category-select">Choose a category:</label>

<select name="category" id="category-select">
    <option value="">All</option>
    <option value="books">Books</option>
    <option value="audio-books">Audio-Books</option>
    <option value="living">Living and more</option>
</select>
```

Normally the `<select>` has zero or more `<option>` or `<optgrou>` elements. The `<label>` in the example above is optional. 

## The size (width) problem 

In most cases there is a problem with the width of the `select` Element. The normal behavior of the Element is, that it will automatically grow to the width of the largest `option`. Even if this one is not selected (`:checked`). The Designer often describes only one state of the Element with the initial `option` selected and a fixed width, e.g. 'All' and 80px. So if you set the width of the `select` to a fixed size of 80px and there is an `option` like 'Audio-Books' which is larger, the UI will break. As i mentioned before, the element will not change its size depending on the largest `option` and the text will overflow the space. 

## The solution 

First of all i want you to keep in mind that you should try to implement components with HTML and CSS first. Only if there is no other way you can enhance your HTML/CSS with JavaScript. Well.. this solution is based on JavaScript, but only because i could not find a native one. If you have a better one without JavaScript, please contact me ;-) 

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="jfaehrmann" data-slug-hash="ExjpVEE" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Select-Element with dynamic size">
  <span>See the Pen <a href="https://codepen.io/jfaehrmann/pen/ExjpVEE">
  Select-Element with dynamic size</a> by Jonas Fährmann (<a href="https://codepen.io/jfaehrmann">@jfaehrmann</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

## What is happening? 

The magic: Set the width of the `select` Element with JavaScript based on the selected `option`. Easy, right? With a little trick it is easy. The trick is to set a helper element which contains the text of the `:checked` option. In this demo i have set up a helper Element with `position: absolute` and `left: 9999px` so that it is accessible with JavaScript but visually hidden for the user. I've also added a `aria-hidden="true"` to tell the browser that it should hide the element for Screen-Reader or other a11y-Tools. On every `change` the script will change the `innerText` of the helper element, gets the new offset width and updates the CSS Custom Property `--dynamic-size` with the new width. Furthermore there is a Custom Property `arrow-size` for the dropdown-arrow-width of the `select` element, which is added up to the dynamic sized property. That's it. 
