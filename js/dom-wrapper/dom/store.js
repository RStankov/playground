var Store = Element.Store = {
  UID:    1,
  data:  {},
  get: function(element) {
     var uid;
     if (element === window) {
       uid = 0;
     } else {
       if (Object.isUndefined(element._prototypeUID)){
         element._prototypeUID = this.UID++;
       }
       uid = element._prototypeUID;
     }
     
     return this.data[uid] || (this.data[uid] = $H());
   },
   store: function(element, key, value) {
     if (arguments.length === 2) {
       this.get(element).update(key);
     } else {
       this.get(element).set(key, value);
     }
   },
   retrieve: function(element, key, defaultValue) {
     var hash   = this.get(element),
         value  = hash.get(key);

     if (Object.isUndefined(value)) {
       hash.set(key, defaultValue);
       value = defaultValue;
     }

     return value;
   }
};

function purgeElement(element) {
  var uid = element._prototypeUID;
  if (uid) {
    Event.stopObserving(element);
    element._prototypeUID = void 0;
    delete Storage.data[uid];
  }
}

Element.addMethods({
  getStorage: function(){
    return Store.get(this.raw);
  },
  store: function(key, value){
    return Store.store(this.raw, key, value);
  },
  retrieve: function(key, defaultValue) {
    return Store.retrieve(this.raw, key, defaultValue);
  }
  clone: function(deep) {
    var clone = this.raw.cloneNode(deep);
    clone._prototypeUID = void 0;
    if (deep) {
      var descendants = this.raw.getElementsByTagName('*'), i = descendants.length;
      while (i--) descendants[i]._prototypeUID = void 0;
    }
    return wrap(clone);
  },
  purge: function(){
    purgeElement(this.raw);

    var descendants = this.raw.getElementsByTagName('*'), i = descendants.length;

    while (i--) purgeElement(descendants[i]);

    return null;
  }
});