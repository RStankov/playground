(function(){
 function delegateHandler(e){
    var element = e.element(), elements = [element].concat(element.ancestors());
    ((this.retrieve('prototype_delegates') || $H()).get(e.eventName || e.type) || []).each(function(pair){
      if (element = Selector.matchElements(elements, pair.key)[0])
        pair.value.invoke('call', element, e); 
    });
  }

  function delegate(element, selector, event, handler){
    element = $(element);
        
    var store = element.retrieve('prototype_delegates');
    
    if (Object.isUndefined(store)){
      element.store('prototype_delegates', store = $H());
    }
    
    var eventStore = store.get(event);
    
    if (Object.isUndefined(eventStore)){
      Event.observe(element, event, delegateHandler);
      store.set(event, $H()).set(selector, [handler]);
    } else {
      (eventStore.get(selector) || eventStore.set(selector, [])).push(handler);
    }

    return element;
  }
  
  function clearEvent(element, store, event){
    store.unset(event);
    Event.observe(element, event, delegateHandler);
  };
  
  function clearSelector(element, store, selector, event, estore){
    estore.unset(selector);
    if (estore.values().length == 0){
      clearEvent(element, store, event);
    }
  }
    
  // stopDelegating(element[, selector[, event[, handler]]])
  function stopDelegating(element, selector, event, handler){
    element = $(element);

    var store = element.retrieve('prototype_delegates');
    if (Object.isUndefined(store)) return;

    switch(arguments.length){
      case 1: store.each(function(pair){ clearEvent(element, store, pair.key); }); break;
      case 2: store.each(function(pair){ clearSelector(element, store, selector, pair.key, pair.value); }); break;
      case 3: 
          var estore = store.get(event);
          if (estore) clearSelector(element, store, selector, event, estore);
        break;
      default:
      case 4:
        var estore = store.get(event);
        if (!estore) return;

         var sstore = estore.get(selector);
         if (sstore){
            sstore = sstore.reject(function(c){ return c == handler; });
            if (sstore.length > 0){
              estore.set(selector, sstore);
            } else {
              clearSelector(element, store, selector, event, estore);
            }          
        }
    }
  }

  // expose
  document.delegate = delegate.methodize();
  document.stopDelegating = stopDelegating.methodize();
  Event.delegate = delegate;
  Event.stopDelegating = stopDelegating;
  Element.addMethods({ delegate: delegate, stopDelegating: stopDelegating });
})();