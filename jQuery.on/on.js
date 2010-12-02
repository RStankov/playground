(function($){
  $.fn.on = function(eventName, selector, handler){
    if (arguments.length == 3){
      return this.delegate(selector, eventName, handler);
    }

    if (arguments.length == 2){
       if (!$.isPlainObject(selector)){
          return this.bind(eventName, selector);
        }

        for(var rule in selector){
          this.delegate(rule, eventName, selector[rule]);
        }

        return this;
    }

    if (arguments.length == 1){
      for(var event in eventName){
        if ($.isFunction(eventName[event])){
          this.bind(event, eventName[event]);
        } else {
          for(var rule in eventName[event]){
            this.delegate(rule, event, eventName[event][rule]);
          }
        }
      }

      return this;
    }
  };
})(jQuery);