(function($){
  $.fn.on = function(eventName, selector, handler){
    if (arguments.length == 2){
      if (!$.isPlainObject(selector)){
        return this.bind(eventName, selector);
      }

      for(var rule in selector){
        this.delegate(rule, eventName, selector[rule]);
      }

      return this;
    }

    return this.delegate(selector, eventName, handler);
  }
})(jQuery);