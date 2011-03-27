(function($){
  function observe(element, eventName, rules){
    if ($.isFunction(rules)){
      return element.bind(eventName, rules);
    }

    for(var rule in rules){
      element.delegate(rule, eventName, rules[rule]);
    }

    return element;
  }

  $.fn.on = function(eventNames, selectors, handler){
    if (eventNames && selectors){
      if (handler){
        return this.delegate(selectors, eventNames, handler);
      }

      return observe(this, eventNames, selectors);
    }

    for(var event in eventNames){
      observe(this, event, eventNames[event]);
    }

    return this;
  };
})(jQuery);