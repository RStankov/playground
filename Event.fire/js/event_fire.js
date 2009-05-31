// credits to YUI ( http://developer.yahoo.com/yui/ )
var fireEvent = (function(){
	// helpers for creating browser spesific event objects
	function createEventIE(eventName, bubble, options){
		var event			= document.createEventObject();
		event.bubble		= bubble;
		event.cancelable	= true;
		event.eventType		= 'on' + eventName;
		
		return options ? Object.extend(event, options) : event;

	}
	
	function createEvent(name, eventName, bubble, options){
		var event = document.createEvent(name);
        event.initEvent(eventName, bubble, true);
		
		return options ? Object.extend(event, options) : event;
	}
	
	// helpers for creating cross-browser events
	function createCustomEvent(eventName, bubble){
		if (document.createEvent)
			return createEvent('HTMLEvents', 'dataavailable', bubble);
		
		if (document.createEventObject)
			return createEventIE(bubble ? 'dataavailable' : 'filterchange', bubble);
		
		return false;
	}
	
	function createMouseEvent(eventName, bubble, options){
		options = Object.extend({
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
		}, options);
		
	    if (document.createEvent){
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
		
		if (document.createEventObject){
            // fix options, IE button property have problems
            switch(options.button){
                case 0:
                    options.button = 1;
                    break;
                case 1:
                    options.button = 4;
                    break;
                case 2:
                    //leave as is
                    break;
                default:
                    options.button = 0;                    
            }
			
			return createEventIE(eventName, bubble, options);
        }

		return false;
    }
	
	function createKeyEvent(eventName, bubble, options){
		options = Object.extend({
			view: 		null,
			ctrlKey: 	false,
			altKey: 	false,
			shiftKey: 	false,
			metaKey: 	false,
			keyCode: 	0,
			charCode: 	0
		}, options);

        if (document.createEvent){
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
		
		if (document.createEventObject){
			// fix options for IE, because it doesn't support charCode
			options.keyCode = options.charCode > 0 ? options.charCode : keyCode
			delete(options.charCode);
			
			return createEventIE(eventName, bubble, options);
        }

		return false;
    }

	function createOtherEvent(){
		// todo
		return false;
	}

	// helpers for detecting event types
	var isCustomEvent	= function(event){ return event.include(':'); },
		isMouseEvent	= Enumerable.include.bind($w('click dblclick mouseover mouseout mousedown mouseup mousemove'));
		isKeyEvent		= Enumerable.include.bind($w('keydown keyup keypress'));
		
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

		// dispatch event
		if (document.createEvent){
            element.dispatchEvent(event);
		} else {
			element.fireEvent('on' + eventName, event);
		}
		
		// return extended element
		return Event.extend(event);
	};
})();

Event.fire = fireEvent;
Element.addMethods({ fire: fireEvent });
