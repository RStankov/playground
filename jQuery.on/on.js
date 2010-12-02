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

  $.fn.on = function(eventName, selector, handler){
    if (arguments.length == 3){
      return this.delegate(selector, eventName, handler);
    }

    if (arguments.length == 2){
      return assignEvents.call(this, eventName, selector);
    }

    for(var event in eventName){
      assignEvents.call(this, event, eventName[event]);
    }

    return this;
  };
})(jQuery);