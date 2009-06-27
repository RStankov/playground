// credits to YUI ( http://developer.yahoo.com/yui/ )
// credits to kangax ( Juriy Zaytsev http://thinkweb2.com/projects/prototype/ )
var fireEvent = (function(){
  // keep this here before moving fireEvent into Prototype's Event module
  var _getDOMEventName = Prototype.K;

  if (!Prototype.Browser.IE){
    _getDOMEventName = function(eventName) {
      var translations = { mouseenter: "mouseover", mouseleave: "mouseout" };
      return eventName in translations ? translations[eventName] : eventName;
    };
  }
  
  var isCustomEvent = function(event){ return event.include(':'); },
      mouseEvent    = /^(click|dblclick|mouseover|mouseout|mousedown|mouseup|mousemove)$/,
      keyEvent      = /^(keydown|keyup|keypress)$/;
      
  var defaultOptions = {
    event: {
      bubbles:    true,
      cancelable: true,
      memo:       {},
      view:       document.defaultView,
      ctrlKey:    false,
      altKey:     false,
      shiftKey:   false,
      metaKey:    false
    },
    mouse: {
      detail:         1,
      screenX:        0,
      screenY:        0,
      clientX:        0,
      clientY:        0,
      button:         0,
      relatedTarget:  null
    },
    key: {
      keyCode:  0,
      charCode: 0
    }
  };
  
  var createEvent, dispatchEvent;
  if (document.createEvent){
    createEvent = (function(){
      var createEvent = function(name, eventName, options){
        var event = document.createEvent(name);
        
        event.initEvent(eventName, options.bubbles, options.cancelable);
        
        delete(options.bubbles);
        delete(options.cancelable);
        
        return Object.extend(event, options);
      };
      
      var createKeyEvent = (function(){
        try { // only Firefox supports KeyEvents
          if (typeof document.createEvent('KeyEvents') != 'undefined')
            return function(eventName, options){
              var event = document.createEvent('KeyEvents');
                event.initKeyEvent(eventName, options.bubbles, options.cancelable, options.view, 
                  options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
                  options.keyCode, options.charCode);
              return event;
            };
        } catch(e){}
      
        try { // try to use generic event (will fail in Safari 2.x)
          if (typeof document.createEvent('Events') != 'undefined')
            return createEvent.curry('Events');
        } catch(e){}
        
        // generic event fails, use UIEvent for Safari 2.x
        return createEvent.curry('UIEvents');
      }());
      
      return function(eventName, options){
        if (isCustomEvent(eventName)){
          return createEvent('HTMLEvents', 'dataavailable', options);
        }
        
        if (mouseEvent.test(eventName)){
          options = Object.extend(Object.clone(defaultOptions.mouse), options);
          var event = document.createEvent('MouseEvents');
          
          if (event.initMouseEvent){
            event.initMouseEvent(eventName, options.bubbles, options.cancelable, options.view, 
              options.detail, options.screenX, options.screenY, options.clientX, options.clientY, 
              options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,  
              options.button, options.relatedTarget);
            
            return event;
          }
          
          // Safari 2.x doesn't implement initMouseEvent(), the closest thing available is UIEvents
          return createEvent('UIEvents', eventName, options);
        }
        
        if (keyEvent.test(eventName)){
          return createKeyEvent(eventName, Object.extend(Object.clone(defaultOptions.key), options));
        }
        
        return createEvent('HTMLEvents', eventName, options);
      };
    })();
    
    dispatchEvent = function(element, event){
      if (element == document && !element.dispatchEvent) element = document.documentElement;
      
      element.dispatchEvent(event);
    };
  } else /* if (document.createEventObject()) */ {
    createEvent = function(eventName, options){
      if (isCustomEvent(eventName)){
        eventName = options.bubbles ? 'dataavailable' : 'filterchange';
      } else if (mouseEvent.test(eventName)){
        options = Object.extend(Object.clone(defaultOptions.mouse), options);
        
        // fix options, IE button property
        switch(options.button){
          case 0:  options.button = 1; break;
          case 1:  options.button = 4; break;
          case 2:  /* no change */     break;
          default: options.button = 0;                    
        }
      } else if (keyEvent.test(eventName)){
        options = Object.extend(Object.clone(defaultOptions.key), options);
        
        if (options.charCode > 0)
          options.keyCode = options.charCode;
        
        delete(options.charCode);
      }
      
      options.eventType = 'on' + eventName;
      
      return Object.extend(document.createEventObject(), options);
    };
    
    dispatchEvent = function(element, event){
      // for some reason event.cancelBubble doesn't work
      // and document.fireEvent doesn't support some events
      // in both cases we could just take all events form 'prototype_event_registry'
      if (!event.bubbles || (element == document && event.eventType in element)){
        var registry = Element.retrieve(element, 'prototype_event_registry');
        if (registry){
          var handlers = registry.get(event.eventName);
          if (handlers){
            handlers.each(function(responder){
              responder(event);
            });
          }
        }
      } else {
        element.fireEvent(event.eventType, event);
      } 
    };
  }
  
  return function(element, eventName){
    var memo, options = Object.extend(Object.clone(defaultOptions.event), arguments[2] || {});
    
    // for backward compability
    if (isCustomEvent(eventName)){
      memo    = options;
      options = {bubbles: Object.isUndefined(arguments[3]) ? true : arguments[3] };
    } else {
      eventName = _getDOMEventName(eventName);
      memo      = options.memo;
      delete(options.memo);
    }
    
    var event = createEvent(eventName, options);
    
    event.eventName = eventName;
    event.memo      = memo;
    
    dispatchEvent($(element), event);
    
    return Event.extend(event);
  };
})();

Event.fire = fireEvent;
Element.addMethods({ fire: fireEvent });