# portfolio

## Build
### js
JavaScript build via Parcel

### css
CSS build via postcss as eleventy filter:
```html
<link rel="stylesheet" href="{{ '/assets/css/shell.css' | postcss('link') | safe }}">
<style>{{ '/assets/css/shell.css' | postcss('inline') | safe }}</style>
```
