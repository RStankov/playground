// credits to YUI ( http://developer.yahoo.com/yui/ )
// credits to kangax ( Juriy Zaytsev http://thinkweb2.com/projects/prototype/ )
var fireEvent = (function(){
	var defaultOptions = {
		event: {
			bubble: 		true,
//			cancelable:		true,
			memo:			{},
			view: 			document.defaultView,
			ctrlKey: 		false,
			altKey: 		false,
			shiftKey: 		false,
			metaKey: 		false
		},
		mouse: {
			detail:			1, 
			screenX:		0,
			screenY:		0, 
			clientX:		0,
			clientY:		0, 
			button:			0,
			relatedTarget:	null
		},
		key: {
			keyCode: 		0,
			charCode: 		0
		}
	};
	
	var isCustomEvent	= function(event){ return event.include(':'); },
		mouseEvent  	= /^(click|dblclick|mouseover|mouseout|mousedown|mouseup|mousemove)$/,
		keyEvent		= /^(keydown|keyup|keypress)$/;

	var createEvent, dispatchEvent;
	if (document.createEvent){
		createEvent = (function(){
			var createEvent = function(name, eventName, bubble, options){
				var event = document.createEvent(name);
				event.initEvent(eventName, bubble, true);

				return options ? Object.extend(event, options) : event;
			};
			
			var createKeyEvent = (function(){
				var e;
				try { // only Firefox supports KeyEvents
					e = document.createEvent('KeyEvents');
					if (typeof e != 'undefined') return function(eventName, bubble, options){
						var event = document.createEvent('KeyEvents');
						event.initKeyEvent(eventName, bubble, true, options.view, 
							options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
							options.keyCode, options.charCode);
						return event;
					};
				} catch(e){}

				try { // try to use generic event (will fail in Safari 2.x)
					e = document.createEvent('Events');
					if (typeof e != 'undefined') return createEvent.curry('Events');
				} catch(e){}

				// generic event fails, use UIEvent for Safari 2.x
				return createEvent.curry('UIEvents');
			}());
			
			return function(eventName, bubble, options){
				if (isCustomEvent(eventName)){
					return createEvent('HTMLEvents', 'dataavailable', bubble);
				}
				
				if (mouseEvent.test(eventName)){
					options = Object.extend(Object.clone(defaultOptions.mouse), options);
					var event = document.createEvent('MouseEvents');

		            if (event.initMouseEvent){
		                event.initMouseEvent(eventName, bubble, true, options.view, 
							options.detail, options.screenX, options.screenY, options.clientX, options.clientY, 
							options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,  
							options.button, options.relatedTarget);
						return event;
		            }

					// Safari 2.x doesn't implement initMouseEvent(), the closest thing available is UIEvents
					return createEvent('UIEvents', eventName, bubble, options);
				}
				
				if (keyEvent.test(eventName)){
					return createKeyEvent(eventName, bubble, Object.extend(Object.clone(defaultOptions.key), options));
				}
				
				return createEvent('HTMLEvents', eventName, bubble, options);
			};
		})();
		
		dispatchEvent = function(element, event){
			if (element == document && !element.dispatchEvent)
				element = document.documentElement;
			
			element.dispatchEvent(event);
		};
	} else /* if (document.createEventObject()) */ {
		createEvent = function(eventName, bubble, options){
			if (isCustomEvent(eventName)){
				eventName = bubble ? 'dataavailable' : 'filterchange';
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
				options.keyCode = options.charCode > 0 ? options.charCode : options.keyCode
				delete(options.charCode);
			}
			
			options.eventType = 'on' + eventName;
			
			return Object.extend(document.createEventObject(), options)
		};
		
		dispatchEvent = function(element, event){
			element.fireEvent(event.eventType, event);
		};
	}
		
	return function(element, eventName, options){
		options = Object.extend(Object.clone(defaultOptions.event), options || {});
	
		var memo   = options.memo,
			bubble = options.bubble;
			 
		delete(options.memo, options.bubble);
	
		if (isCustomEvent(eventName)){
			memo = options;
			options = {};
		}
		
		var event = createEvent(eventName, bubble, options);
		
		event.eventName = eventName;
		event.memo		= memo || {};

		dispatchEvent($(element), event);

		return Event.extend(event);
	};
})();

Event.fire = fireEvent;
Element.addMethods({ fire: fireEvent });