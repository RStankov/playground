function _getWrapper(tagName){
  tagName = tagName.toUpperCase();
  return Element.Wrappers[tagName] || Element.Wrappers[tagName] = Class.create(Element.Wrappers.Base);
}

function wrap(element){
  var wrapper = _getWrapper(element.tagName);
  return new wrapper(element);
}

Element.Wrappers = {
  Base: Class.create({
    initialize: function(raw){
      this.raw    = raw;
      this.style  = raw.style;
    }
  })
};

Element.addMethods = function(tagName, methods){
  var wrapper;
  if (arguments.length == 2){
    wrapper = _getWrapper(tagName);
  } else {
    wrapper = Element.Wrappers.Base;
    methods = tagName;
    
    _registerStaticMethods(methods);
  }
  
  wrapper.addMethods(methods);
};

Element.extend = wrap;

function _staticMethod(method){
  return function(element){
    var element = $(element);
    return element[method].apply(element, Array.prototype.slice.call(arguments, 1));
  }
}

function _registerStaticMethods(methods){
  for(method in methods){
    Element[method] = _staticMethod(method);
  }
}