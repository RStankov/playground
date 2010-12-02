(function($){
  function assignEvents(eventName, rules){
    if ($.isFunction(rules)){
      return this.bind(eventName, rules);
    }

    for(var rule in rules){
      this.delegate(rule, eventName, rules[rule]);
    }

    return this;
  }

  $.fn.on = function(eventNames, selectors, handler){
    if (arguments.length == 3){
      return this.delegate(selectors, eventNames, handler);
    }

    if (arguments.length == 2){
      return assignEvents.call(this, eventNames, selectors);
    }

    for(var event in eventNames){
      assignEvents.call(this, event, eventNames[event]);
    }

    return this;
  };
})(jQuery);