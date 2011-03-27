Prototype.Element = (function(){
  var Element = Element = function(tagName, attributes){
    return wrap(_createElement(tagName)).setAttribute(attribute);
  };
  
  //= require "dom/wrappers"
  //= require "dom/dom"  
  //= require "dom/store"
  //= require "dom/form"
  //= require "dom/selector"
  //= require <selector_engine>
  
  return Element;
})();
