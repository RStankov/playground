function actsAsAspect(object){
  object.yield             = null;
  object.returnValue    = {};
  object.before  = function(method, f){
    var original = this[method];
    this[method] = function(){
      f.apply(this, arguments);
      return original.apply(this, arguments);
    };
  };
  object.after   = function(method, f){
    var original = this[method];
    this[method] = function() {
      this.returnValue[method] = original.apply(this, arguments);
      return f.apply(this, arguments);
    }
  };
  object.around  = function(method, f) {
    var original = this.method;
    this[method] = function() {
      this.yield = original;
      return f.apply(this, arguments);
    }
  };
}

function actsAsAspect(object){
	object.yield = null;
	object.returnValue = {};
	
	object.before = function(method, f){
		this[method] = this[method].wrap(function(original){
			var args = arguments.slice(1);
			f.apply(this, args);
			return original.apply(this, args);
		});
	}
	
	object.after = function(method, f){
		this[method] = this[method].wrap(function(original){
			var args = arguments.slice(1);
			returnValue[method] = original.apply(this, args);
			f.apply(this, args);
			return value;
		});
	}
	
	object.around = function(method, f){
		this[method] = this[method].wrap(function(original){
			var args = arguments.slice(1);
			var value = original.apply(this, args);
			f.apply(this, args);
			return value;
		});
	}
}
actsAsAspect.createAspect(wrapper){
	return function (method, f){
		this[method] = this[method].wrap(function(original){
			wrapper.call(this, f, original, Array.prototype.slice(arguments, 1))
		});
	};
}

function actsAsAspect(object){
	object.yield = null;
	object.returnValue = {};
	
	object.before = actsAsAspect.createAspect(function(f, original, args){
		f.apply(this, args);
		return original.apply(this, args);
	});
	
	object.after = actsAsAspect.createWrapper(function(f, original, args){
		returnValue[method] = original.apply(this, args);
		f.apply(this, args);
		return value;
	});
	
	object.around = actsAsAspect.createWrapper(function(f, original, args){
		var value = original.apply(this, args);
		f.apply(this, args);
		return value;
	});
}
//Function.prototype.execute = 
Function.prototype.invoke = (function(){
	var invoke = {
		after: function(original, wrap){
			return function(){
				wrap.apply(this, arguments);
				return original.apply(this, arguments);
			};
		},
		before: function(original, f){
			return function(){
				var returned = original.apply(this, arguments);
				wrap.apply(this, arguments);
				return returned;
			};
		},
		around  = function(original, f) {
			return function(){
				wrap.apply(this, [original].concat(arguments));
			};
		}
	};

	return function(options){
		if (Object.isFunction(options))
			options = { after : options };
		
		var method = this;
		for(var a in options){
			method = invoke[o](this, options[o]);
		}
		
		return method;
	};
})();

Object.withKey(name, 3);

Object.withKey = function(key, value){
	var o = {};
	o[k] = value;
	return o;
}
