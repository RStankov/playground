var CD3 = {};
CD3.I18n = (function(){
	var store = {};
	return {
		add: function(term, value){
			if (arguments.length == 1){
				Object.extend(store, term);
			} else {
				store[term] = value;
			}
		},
		clear: function(){
			if (arguments.length == 0){
				store = {};
			} else {
				$A(arguments).each(function(term){
					delete(store[term]);
				});
			}
		},
		translate: function(term, options){
			options = options || {};
			
			var value = store[term] || options.default;
			
			if (Object.isUndefined(value)){
				throw new Exception('Undefined term ' + term);
			}
			
			if (Object.isString(value)){
				if (arguments.length == 1){
					return value;
				}
			} else {
				value = value[Object.isUndefined(options.count) ? options.count = 0 : options.count] || value.others;
			}
			
			if (options.default){
				delete(options.default);
			}
			
			return value.interpolate(options);
		}
	} 
})();
CD3.t = CD3.I18n.translate;

