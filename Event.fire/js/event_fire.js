// credits to YUI ( http://developer.yahoo.com/yui/ )
var fireEvent = (function(){
	var optionsForMouseEvent = {
		view:			window,
		detail:			1, 
		screenX:		0,
		screenY:		0, 
		clientX:		0,
		clientY:		0,       
		ctrlKey:		0,
		altKey:			false, 
		shiftKey:		false,
		metaKey:		false, 
		button:			0,
		relatedTarget:	null
	};
	var optionsForKeyEvent = {
		view: 		null,
		ctrlKey: 	false,
		altKey: 	false,
		shiftKey: 	false,
		metaKey: 	false,
		keyCode: 	0,
		charCode: 	0
	};
	
	if (document.createEvent){
		function createEvent(name, eventName, bubble, options){
			var event = document.createEvent(name);
			event.initEvent(eventName, bubble, true);

			return options ? Object.extend(event, options) : event;
		}

		function createCustomEvent(bubble){
			return createEvent('HTMLEvents', 'dataavailable', bubble);
		}

		function createMouseEvent(eventName, bubble, options){
			options = Object.extend(Object.extend({}, optionsForMouseEvent), options);

			var event = document.createEvent('MouseEvents');
        
            // Safari 2.x doesn't implement initMouseEvent()
            if (event.initMouseEvent){
                event.initMouseEvent(eventName, bubble, true, 
					options.view,
					options.detail,
					options.screenX,
					options.screenY,
					options.clientX,
					options.clientY, 
					options.ctrlKey, 
					options.altKey,
					options.shiftKey, 
					options.metaKey, 
					options.button, 
					options.relatedTarget
				);
				
				// if there is relatedTarget options, but it isn't accepted to the event
				// addit ot toElement / fromElement, because FireFox won't let you assign value to relatedTarget
				if (options.relatedTarget && !event.relatedTarget){
	                if (evenName == 'mouseout'){
	                    event.toElement = options.relatedTarget;
	                } else if (evenName == 'mouseover'){
	                    event.fromElement = options.relatedTarget;
	                }
	            }

				return event;
            }
			
			// else in Safari, the closest thing available in Safari 2.x is UIEvents
			event.initEvent(eventName, bubble, true);

			return Object.extend(event, options);
	    }

		function createKeyEvent(eventName, bubble, options){
			options = Object.extend(Object.extend({}, optionsForKeyEvent), options);

			try {
				// only Firefox supports initKeyEvent(), for now
				var event = document.createEvent('KeyEvents');
				event.initKeyEvent(eventName, bubble, true, 
					options.view, 
					options.ctrlKey, 
					options.altKey, 
					options.shiftKey, 
					options.metaKey, 
					options.keyCode,
					options.charCode
				);
				return event;
			} catch(e) {
				try {
					// if initKeyEvent() is not , to create generic event - will fail in Safari 2.x
					return createEvent('Events', eventName, bubble, options);
				} catch(e){
					// if generic event fails, create a UIEvent for Safari 2.x
					return createEvent('UIEvents', eventName, bubble, options);
				}
			}
		}
		
		function createOtherEvent(){
			return false;
		}
		
		function dispatchEvent(element, event){
			element.dispatchEvent(event);
		}
	} else /* if (document.createEventObject()) */ {
		function createEvent(eventType, bubble, options){
			var event			= document.createEventObject();

			event.bubble		= bubble;
			event.cancelable	= true;
			event.eventType		= 'on' + eventType;

			return options ? Object.extend(event, options) : event;
		}
		
		// helpers for creating cross-browser events
		function createCustomEvent(eventName, bubble){
			return createEvent(bubble ? 'dataavailable' : 'filterchange', bubble);
		}

		function createMouseEvent(eventName, bubble, options){
			options = Object.extend(Object.extend({}, optionsForMouseEvent), options);

	           // fix options, IE button property
            switch(options.button){
                case 0:
                    options.button = 1;
                    break;
                case 1:
                    options.button = 4;
                    break;
                case 2:
                    // do not change
                    break;
                default:
                    options.button = 0;                    
            }

			return createEvent(eventName, bubble, options);
	    }

		function createKeyEvent(eventName, bubble, options){
			options = Object.extend(Object.extend({}, optionsForKeyEvent), options);
						
			options.keyCode = options.charCode > 0 ? options.charCode : options.keyCode
			delete(options.charCode);

			return createEvent(eventName, bubble, options);
		}
		
		function createOtherEvent(){
			return false;
		}
		
		function dispatchEvent(element, event){
			element.fireEvent(event.eventType, event);
		}
	}
	
	// helpers for detecting event types
	var isCustomEvent	= function(event){ return event.include(':'); },
		isMouseEvent	= RegExp.prototype.test.bind(/^(click|dblclick|mouseover|mouseout|mousedown|mouseup|mousemove)$/),
		isKeyEvent		= RegExp.prototype.test.bind(/^(keydown|keyup|keypress)$/);
		
	return function(element, eventName, options){
		// get correct element
		element = $(element);
			
		if (element == document && document.createEvent && !element.dispatchEvent)
			element = document.documentElement;

		// get options, bubble, memo
		var memo, bubble = true;
		
		if (Object.isUndefined(options)) {
			options = {};
		} else {
			if ('memo' in options){
				memo = options.memo;
				delete(options.memo);
			}
			
			if ('bubble' in options){
				bubble = options.bubble;
				delete(options.bubble);
			}
		}

		// get event
		var event;
		
		if (isCustomEvent(eventName)){		event = createCustomEvent(eventName, bubble); memo = options; }
		else if (isMouseEvent(eventName))	event = createMouseEvent(eventName, bubble, options);
		else if (isKeyEvent(eventName))		event = createKeyEvent(eventName, bubble, options);
		else 								event = createOtherEvent(eventName, bubble, options);

		if (!event)
			return false;

		event.eventName = eventName;
		event.memo		= memo || {};

		dispatchEvent(element, event);
		
		// return extended element
		return Event.extend(event);
	};
})();

Event.fire = fireEvent;
Element.addMethods({ fire: fireEvent });
