function $$() {
  return Prototype.Selector.select(Array.prototype.join.call(arguments, ', '), document);
};

Prototype.Selector = (function() {
  
  function select() {
    throw new Error('Method "Prototype.Selector.select" must be defined.');
  }

  function match() {
    throw new Error('Method "Prototype.Selector.match" must be defined.');
  }

  function find(elements, expression, index) {
    index = index || 0;
    
    var match = Prototype.Selector.match;
    for (var i = 0, length = elements.length, matchIndex = 0; i < length; i++) {
      if (match(elements[i], expression) && index == matchIndex++) {
        return wrap(elements[i]);
      }
    }
  }
  
  function extendElements(elements) {
    i = element.length;
    while(i--) element[i] = wrap(element[i])
    return elements;
  }
  

  var K = Prototype.K;
  
  return {
    select:         select,
    match:          match,
    find:           find,
    extendElements: extendElements,
    extendElement:  wrap
  };
})();
