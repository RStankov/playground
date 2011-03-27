Element.addMethods({
  key: function(element, key){
    element = $(element);
    
    var keys = element.retrieve('cd3:keys')
    if (!keys){
      element.observe('keyup', checkForKey);
      keys = element.store('cd3:keys', $H());
    }
    
    keys.set(getKeyCode(key));
    
    return element;
  }
});


(function(){
 function checkForKey(event){
   var keyCode = event.keyCode === 0 ? event.charCode : event.keyCode;
   
   if (this.retrieve('cd3:keys', $H()).get(keyCode)){
     this.fire
   }
 }
 
 function getKeyCode(keyString){
   
 }
 
 Element.addMethods({
   key: function(element, key){
     element = $(element);
     
     var keys = element.retrieve('cd3:keys');
     if (!keys){
       element.observe('keyup', checkForKey);
       keys = element.store('cd3:keys', $H());
     }

     keys.set(getKeyCode(key));
     
     return element;
   }
 }); 
})();


element
  .observe('key:enter', open)
  .observe('key:up',    moveUp)
  .observe('key:down',  moveDown)
  

(function(){
  var CODE_FOR_KEYS = {
     8: 'backspace',
     9: 'tab',
    13: 'return',
    27: 'esc', 
    37: 'left',    
    38: 'up',      
    39: 'right',   
    40: 'down',    
    46: 'delete',  
    36: 'home',    
    35: 'end',     
    33: 'pageup',  
    34: 'pagedown',
    45: 'insert' 
  };

  document.observe('keyup', function(event){
    var keyCode = event.keyCode === 0 ? event.charCode : event.keyCode;

    if (CODE_FOR_KEYS[keyCode]){
      var customEvent = Element.fire(Event.findElement(e) || document, 'key:' + CODE_FOR_KEYS[keyCode], {originalEvent: event});
      if (customEvent.stopped){
        event.stop();
      }
    }
  });
})();





// old

  
// with my on extention  
element.on({
  'key:enter':  open
  'key:up':     moveUp,
  'key:down':   moveDown
});

Event.register('key:?', (function(){
  function getkey(eventName){
    return eventName.substr(eventName.indexOf(':'), eventName.length);
  }
  
  function isKey(e, key){
    var keyCode = (event.keyCode === 0) ? event.charCode : event.keyCode;
    
    if (key.length == 1){
    }
    
    return Event['KEY_' + key.toUpperCase()] == keyCode;
  }
  
  var registered = {};
  
  function register(key){
    function handle(e){
      if (isKey(e, key)){
        Element.fire(e.findElement(), 'key:' + key);
      }
    }
    
    registered[key] = {
      count:  1,
      handle: handle
    };
    
    document.observe('keyup', handle);
  }
  
  function setup(element, eventName, handler){
    var key = getkey(eventName);
    if (registered[key]){
      registered[key].count++;
    } else {
      register(key);
    }
  }
  
  function teardown(element, eventName){
    var key = getkey(eventName);
    if (registered[key]){
      if (--registered[key].count == 0){
        document.stopObserving('keyup', registered[key].handle);
        delete(registered[key]);
      }
    }
  }
  
  
  return {
    setup:    setup,
    teardown: teardown
  }
})());