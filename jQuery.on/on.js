(function($){
  $.fn.on = function(eventName, selector, handler){
    if (arguments.length == 3){
      return this.delegate(selector, eventName, handler);
    }

    if (!$.isPlainObject(selector)){
      return this.bind(eventName, selector);
    }

    for(var rule in selector){
      this.delegate(rule, eventName, selector[rule]);
    }

    return this;
  };
})(jQuery);