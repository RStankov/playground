(function($){
  $.fn.on = function(eventName, selector, handler){
    if (arguments.length == 2){
      return this.bind(eventName, selector);
    }

    return this.delegate(selector, eventName, handler);
  }
})(jQuery);