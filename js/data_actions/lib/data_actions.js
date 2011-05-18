(function() {
  function initialEventObject(element, dataAttr, eventName){
     element.delegate('[data-' + dataAttr + ']', eventName, function(e, data) {
       var target = $(this),
           handler = element.data('delegates')[dataAttr][eventName][ target.data(dataAttr) ];

       if (handler){
         return handler.call(this, target, e, data);
       }
     });

     return {};
   };

  $.fn.dataAction = function(dataAttr, eventName, actionName, actionHandler) {
    return this.each(function(args) {
      var element   = $(this),
          delegates = element.data('delegates') || (element.data('delegates', {}) && element.data('delegates')),
          events    = delegates[dataAttr] || (delegates[dataAttr] = {}),
          actions   = events[eventName] || (events[eventName] = initialEventObject(element, dataAttr, eventName));

      if ($.isPlainObject(actionName)) {
        actions = $.extend(actions, actionName);
      } else {
        actions[actionName] = actionHandler;
      }
    });
  };

  $.fn.onAction = function(eventName, actionName, actionHandler) {
    return this.dataAction('action', eventName, actionName, actionHandler);
  };
})(jQuery);