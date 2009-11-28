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

  function checkForKey(event){	
	var keyCode = event.keyCode === 0 ? event.charCode : event.keyCode;
    if (CODE_FOR_KEYS[keyCode]){
      var customEvent = Element.fire(Event.findElement(event) || document, event.type + ':' + CODE_FOR_KEYS[keyCode], {originalEvent: event});
      if (customEvent.stopped){
        event.stop();
      }
    }
  }

  document.observe('keyup', checkForKey);
  document.observe('keypress', checkForKey);
  document.observe('keydown', checkForKey);
})();
