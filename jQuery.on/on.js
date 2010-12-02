(function($){
  $.fn.on = function(eventName, selector, handler){
    return this.delegate(selector, eventName, handler);
  }
})(jQuery);