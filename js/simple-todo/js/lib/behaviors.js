// ControlDepo Widget Commonent
// @date 21.09.2008
// @version 1.1
// based on 
//		Justin Palmer's EventSelectors (http://encytemedia.com/event-selectors)
// 		Dan Webb's LowPro http://svn.danwebb.net/external/lowpro
if (!CD3) var CD3 = {};

CD3.Behaviors = function(rules){
	document.observe('dom:loaded', CD3.Behaviors.assign.curry(rules, null));
}

Object.extend(CD3.Behaviors, {
	cache: [],
	assign: function(rules, parent){
		for (var selector in rules){
			var observer = rules[selector];
			selector.split(',').each(function(sel){
				var parts = sel.split(/:(?=[a-z]+$)/), css = parts.shift(), event = parts.join('');
				Selector.findChildElements(parent || document, [css]).each(function(element){
					if (event) {
						CD3.Behaviors.observe(element, event, observer);
					} else if (Object.isArray(observer)){
						var klass = observer.shift();
						new klass(element, observer.shift()); 
					} else if (observer.prototype && observer.prototype.initialize){
						new observer(element);
					} else if (Object.isFunction(observer)){
						observer.call(element, element);
					} else {
						for(var e in observer){
							CD3.Behaviors.observe(element, e, observer[e]);
						}
					}
				});
			});
		}
	},
	assignIf: function(selector, rules){
		var parent = $$(selector).first();
		if (parent) CD3.Behaviors.assign(rules, parent);
	},
	when: function(selector, rules){
		document.observe('dom:loaded', CD3.Behaviors.assignIf.curry(selector, rules));
	},
	observe: function(element, event, observer){
		if (!Object.isFunction(observer))
			observer = this.delegate(observer);
			
		$(element).observe(event, observer)
		CD3.Behaviors.cache.push([element, event, observer]);
	},
	delegate: function(rules){
		return function(e){
			var element;
			for (var selector in rules)
				if (element = e.findElement(selector))
					return rules[selector].call(element, e);
		}
	},
	unload: function(){
		CD3.Behaviors.cache.each(function(c){ Event.stopObserving.apply(Event, c); });
		CD3.Behaviors.cache = [];
	}
});

Event.observe(window, 'unload', CD3.Behaviors.unload);