---
title: Custom Elements, event listener and this
picture: /assets/img/custom-elements.jpg
date: 2021-02-01T17:36:50.665Z
summary: >-
  I use Custom Elements a lot. I also like to use .bind(this) in Custom Element event listeners for several reasons. Why this can be a problem if the event listener needs to be removed and how a workaround could look like, i will explain in this post.
tags:
  - html
  - javascript
  - custom elements
  - web components
---

## Custom Elements 

Custom Elements are great. You can extend the generic `HTMLElement` or more specific `HTMLParagraphElement`, `HTMLButtonElement` and so on. To register a custom element you use the `define()` method with a string for the name and a class object. The class object is written using standard ES 2015 class syntax: 
```javascript
class MyCustomElement extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
    }
    // Element functionality down here
}
customElements.define("my-custom-element", MyCustomElement);
```
This is a very basic example. You can read more about using [Custom Elements on MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)

## Use Case: Event Listener 
Imagine you will register a click listener for a button, like this: 
```javascript
class MyCustomElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.querySelector(".my-button").addEventListener("click", this.handleButtonClick.bind(this));
    }

    handleButtonClick(event) {
        // some action on button click
        this.anotherMethod();
    }

    anotherMethod() {
        // some more action
    }
}
customElements.define("my-custom-element", MyCustomElement);
```
Maybe you have already recognized `.bind(this)` at the end of the passed method `handleButtonClick()`. In an event listener `this` normally corresponds to the EvenTarget (`event.target`). The `bind` method is used to ensure that `this` corresponds to the instance of the custom element instead. If you don't do this, you can not call any other methods of the Custom Element instance, e.g. `this.anotherMethod()` won't be executed. If you perform `console.log(this)`, the code from above should output the Custom Element and not the button element. 

## The Problem: removeEventListener 
The example above works fine until you want to remove the eventListener. The following code won't work: 
```javascript
class MyCustomElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.querySelector(".my-button").addEventListener("click", this.handleButtonClick.bind(this));

        this.querySelector(".my-button").removeEventListener("click", this.handleButtonClick.bind(this));
    }

    handleButtonClick(event) {
        // some action on button click
        this.anotherMethod();
    }

    anotherMethod() {
        // some more action
    }
}
customElements.define("my-custom-element", MyCustomElement);
```
The `removeEventListener()` has no effect, the event for the button remains. The reason for this is that `removeEventListener()` expects the exact same method (`===`) as passed in `addEventListener()`. With `bind` this is simply not possible, because it creates a new function when called: 

*The bind() function creates a new bound function, which is an exotic function object (a term from ECMAScript 2015) that wraps the original function object. Calling the bound function generally results in the execution of its wrapped function. <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind/>

## The Solution: boundedListener 
With a bounded listener property you can get around the problem. Instead of passing the method directly you can create a `boundListener` in the `constructor()`, like this: 
```javascript
class MyCustomElement extends HTMLElement {
    constructor() {
        super();
        this.buttonBoundListener = this.handleButtonClick.bind(this));
    }

    connectedCallback() {
        this.querySelector(".my-button").addEventListener("click", this.buttonBoundListener;
        this.querySelector(".my-button").removeEventListener("click", this.buttonBoundListener;
    }

    handleButtonClick(event) {
        // some action on button click
        this.anotherMethod();
    }

    anotherMethod() {
        // some more action
    }
}
customElements.define("my-custom-element", MyCustomElement);
```
Now `this.buttonBoundListener` is a property of the Custom Element instance. You can use it to add and remove EventListener to the button element and you are able to use `this` as the instance of the Custom Element. 
And that's it. Thank you for reading. 
