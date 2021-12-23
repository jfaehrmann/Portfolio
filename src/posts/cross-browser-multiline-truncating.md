---
title: Cross Browser Multiline Truncating
picture: /assets/img/browser.jpg
date: 2020-03-21T17:21:50.665Z
summary: >-
  Truncating Strings with Ellipsis is a common way to handle longer content.
  This is an example of how you can deal with multiline truncating.
tags:
  - html
  - css
  - truncating
---
## Single Line Truncating

Single line truncating is a common way to handle longer content and it is possible with [CSS only](https://css-tricks.com/snippets/css/truncate-string-with-ellipsis/). Truncating multiple lines is a bit harder. 

## Multi Line Truncating

It is not impossible.. but the solutions described so far, e.g. [pure CSS](https://css-tricks.com/multi-line-truncation-with-pure-css/) with pseudo Elements ::before, ::after and line-height for measuring or plenty JavaScript based Solutions, are not the perfect way to deal with multiline truncating. Fortunately there is a proper way to handle this common problem: 

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="jfaehrmann" data-slug-hash="MWwQZNe" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Multiline Truncating (Cross Browser)">
  <span>See the Pen <a href="https://codepen.io/jfaehrmann/pen/MWwQZNe">
  Multiline Truncating (Cross Browser)</a> by Jonas Fährmann (<a href="https://codepen.io/jfaehrmann">@jfaehrmann</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

## What is happening here?

All examples are in fact identical, except for value of `display` for the container. The third example is a fallback for our beloved Internet Explorer. But more about that later.  
All the magic for the multiline truncating is happening within the following lines:
```css
.block-container,
.flex-container {
  display: -webkit-box;
  -webkit-line-clamp: var(--line-clamp);
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```
And as you can see [line-clamp](https://caniuse.com/#feat=css-line-clamp) is mostly supported across all modern browsers. `line-clamp` is a undocumented CSS property that will contain text to a given amount of lines when used in combination with `display: -webkit-box`. In this demo there is a `line-clamp` of 3. If you change the CSS Variable `--line-clamp` you can see that the amount of lines will change. Perfect! Well.. and then there is the IE.   

**Fallback IE**  
For the IE we have to add a little trick that calculates the height of the container:
```css
.ie-block-container {
  height: calc(var(--line-height) * var(--multiplicator));
}
```
