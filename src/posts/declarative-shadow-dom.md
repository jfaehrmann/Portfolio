---
title: Declarative Shadow DOM
picture: /assets/img/shadow.jpg
date: 2020-10-14T05:48:48.972Z
summary: "There is a new way using the Shadow DOM API for Self-Containing Web
  Components: the declarative Shadow DOM for Server Side Rendering"
tags:
  - html
  - web components
  - shadow dom
---
## V1 - The imperative way   

*[Shadow DOM](https://developers.google.com/web/fundamentals/web-components/shadowdom) is one of the three Web Components standards, rounded out by [HTML Templates](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots) and [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements). Shadow DOM provides a way to scope CSS styles to a specific DOM subtree and isolate that subtree from the rest of the document. The `<slot>` element gives us a way to control where the children of a Custom Element should be inserted within its Shadow Tree. These features combined enable a system for building self-contained, reusable components that integrate seamlessly into existing applications just like a built-in HTML element. - web.dev (1)*  

The Shadow DOM v1 can only be enabled as an imperative API with JavaScript and is perfect for Client Side Rendering. But what if your Web Component doesn't need JavaScript to work as expected? What if some Crawlers ignore JavaScript and therefore can't visit and see your website? One main idea of the declarative Shadow DOM is to use the API with the advantages of Server Side Rendering without the need of JavaScript. For example rendering content as fast as possible with less priority on interactivity. Or even take of care of users who run the Browser or System with JavaScript disabled. With v1 of the Shadow DOM this is not possible.   

## How to use the declarative way 

The proposed Solution is to use the Shadow DOM with the HTML Template and an additional attribute `shadowroot`. 

```html
<host-element>
  <template shadowroot="open">
    <slot></slot>
  </template>
  <h2>Light content</h2>
</host-element>
```

The HTML Parser will detect the Template tag with the `shadowroot` attribute and append its content as the shadow root of its parent element, in this example the Custom Element `host-element`. The HTML Structure above will result in the following DOM tree: 

```html
<host-element>
  #shadow-root (open)
  <slot>
    ↳
    <h2>Light content</h2>
  </slot>
</host-element>
```

At the time of writing this post, the declarative Shadow DOM is only available as an experimental feature from Chrome 85 (`chrome://flags/#enable-experimental-web-platform-features`) and "The Chrome team is tentatively looking at un-flagging Declarative Shadow DOM in Chrome 88".   

Read more about the new declarative way of using the Shadow DOM here:  
 
1. <https://web.dev/declarative-shadow-dom/>
2. <https://github.com/mfreed7/declarative-shadow-dom/blob/master/README.md>
3. <https://developers.google.com/web/fundamentals/web-components/shadowdom>
