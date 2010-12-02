(function($){
  function observe(eventName, rules){
    if ($.isFunction(rules)){
      return this.bind(eventName, rules);
    }

    for(var rule in rules){
      this.delegate(rule, eventName, rules[rule]);
    }

    return this;
  }

  $.fn.on = function(eventNames, selectors, handler){
    if (eventNames && selectors){
      if (handler){
        return this.delegate(selectors, eventNames, handler);
      }

      return observe.call(this, eventNames, selectors);
    }

    for(var event in eventNames){
      observe.call(this, event, eventNames[event]);
    }

    return this;
  };
})(jQuery);