
/**
 *  document.viewport
 *
 *  The `document.viewport` namespace contains methods that return information
 *  about the viewport &mdash; the rectangle that represents the portion of a web
 *  page within view. In other words, it's the browser window minus all chrome.
**/

document.viewport = {

  /**
   *  document.viewport.getDimensions() -> Object
   *
   *  Returns an object containing viewport dimensions in the form
   *  `{ width: Number, height: Number }`.
   *
   *  The _viewport_ is the subset of the browser window that a page occupies
   *  &mdash; the "usable" space in a browser window.
   *  
   *  ##### Example
   *  
   *      document.viewport.getDimensions();
   *      //-> { width: 776, height: 580 }
  **/
  getDimensions: function() {
    return { width: this.getWidth(), height: this.getHeight() };
  },

  /**
   *  document.viewport.getScrollOffsets() -> Array
   *
   *  Returns the viewport's horizontal and vertical scroll offsets.
   *
   *  Returns an array in the form of `[leftValue, topValue]`. Also accessible
   *  as properties: `{ left: leftValue, top: topValue }`.
   *
   *  ##### Examples
   *  
   *      document.viewport.getScrollOffsets();
   *      //-> { left: 0, top: 0 }
   *      
   *      window.scrollTo(0, 120);
   *      document.viewport.getScrollOffsets();
   *      //-> { left: 0, top: 120 }
  **/
  getScrollOffsets: function() {
    return Element._returnOffset(
      window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop);
  }
};

(function(viewport) {
  var B = Prototype.Browser, doc = document, element, property = {};

  function getRootElement() {
    // Older versions of Safari.
    if (B.WebKit && !doc.evaluate)
      return document;

    // Older versions of Opera.
    if (B.Opera && window.parseFloat(window.opera.version()) < 9.5)
      return document.body;

    return document.documentElement;
  }

  function define(D) {
    if (!element) element = getRootElement();

    property[D] = 'client' + D;

    viewport['get' + D] = function() { return element[property[D]] };
    return viewport['get' + D]();
  }

  /**
   *  document.viewport.getWidth() -> Number
   *
   *  Returns the width of the viewport.
   *
   *  Equivalent to calling `document.viewport.getDimensions().width`.
  **/
  viewport.getWidth  = define.curry('Width');

  /**
   *  document.viewport.getHeight() -> Number
   *
   *  Returns the height of the viewport.
   *
   *  Equivalent to `document.viewport.getDimensions().height`.
  **/
  viewport.getHeight = define.curry('Height');
})(document.viewport);