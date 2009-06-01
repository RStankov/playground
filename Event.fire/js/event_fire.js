// credits to YUI ( http://developer.yahoo.com/yui/ )
// credits to kangax ( Juriy Zaytsev http://thinkweb2.com/projects/prototype/ )
var fireEvent = (function(){
	var createEvent, createCustomEvent, createMouseEvent, createKeyEvent, createHtmlEvent, dispatchEvent;
	if (document.createEvent){
		createEvent = function(name, eventName, bubble, options){
			var event = document.createEvent(name);
			event.initEvent(eventName, bubble, true);

			return options ? Object.extend(event, options) : event;
		};
		
		createHtmlEvent = createEvent.curry('HTMLEvents');
		
		createCustomEvent = createEvent.curry('HTMLEvents', 'dataavailable');

		createMouseEvent = function(eventName, bubble, options){
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
	    };

		createKeyEvent = (function(){
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
		
		dispatchEvent = function(element, event){
			element.dispatchEvent(event);
		};
	} else /* if (document.createEventObject()) */ {
		createEvent = function(eventType, bubble, options){
			var event			= document.createEventObject();

			event.bubble		= bubble;
			event.cancelable	= true;
			event.eventType		= 'on' + eventType;

			return options ? Object.extend(event, options) : event;
		};
		
		createHtmlEvent = createEvent;
		
		createCustomEvent = function(eventName, bubble){
			return createEvent(bubble ? 'dataavailable' : 'filterchange', bubble);
		};

		createMouseEvent = function(eventName, bubble, options){
			// fix options, IE button property
            switch(options.button){
                case 0:  options.button = 1; break;
                case 1:  options.button = 4; break;
                case 2:  /* no change */     break;
                default: options.button = 0;                    
            }	

			return createEvent(eventName, bubble, options);
	    };

		createKeyEvent = function(eventName, bubble, options){						
			options.keyCode = options.charCode > 0 ? options.charCode : options.keyCode
			delete(options.charCode);

			return createEvent(eventName, bubble, options);
		};
		
		dispatchEvent = function(element, event){
			element.fireEvent(event.eventType, event);
		};
	}
	
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
	
	// helpers for detecting event types
	var isCustomEvent	= function(event){ return event.include(':'); },
		isMouseEvent	= RegExp.prototype.test.bind(/^(click|dblclick|mouseover|mouseout|mousedown|mouseup|mousemove)$/),
		isKeyEvent		= RegExp.prototype.test.bind(/^(keydown|keyup|keypress)$/);
		
	return function(element, eventName, options){
		options = Object.extend(Object.clone(defaultOptions.event), options || {});
		element = $(element);
			
		if (element == document && document.createEvent && !element.dispatchEvent)
			element = document.documentElement;

		var event,
			memo   = options.memo,
			bubble = options.bubble;
			 
		delete(options.memo, options.bubble);
				
		if (isCustomEvent(eventName)){
			event = createCustomEvent(eventName, bubble);
			memo  = options;
		} else if (isMouseEvent(eventName)){
			event = createMouseEvent(eventName, bubble, Object.extend(Object.clone(defaultOptions.mouse), options));
		} else if (isKeyEvent(eventName)){
			event = createKeyEvent(eventName, bubble, Object.extend(Object.clone(defaultOptions.key), options));
		} else {
			event = createHtmlEvent(eventName, bubble, options);
		}

		if (!event){
			return false;
		}
		
		event.eventName = eventName;
		event.memo		= memo || {};

		dispatchEvent(element, event);
		
		// return extended element
		return Event.extend(event);
	};
})();

Event.fire = fireEvent;
Element.addMethods({ fire: fireEvent });
