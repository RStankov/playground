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
            } else {
				// Safari 2.x doesn't implement initMouseEvent(), the closest thing available is UIEvents
				event = createEvent('UIEvents', eventName, bubble, options);
			}
			
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
	    };

		createKeyEvent = (function(){
			var e;
			try { // only Firefox supports KeyEvents
				e = document.createEvent('KeyEvents');
				if (typeof e != 'undefined') return function(eventName, bubble, options){
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
	
	// default event options
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
	}, optionsForKeyEvent = {
		view: 		null,
		ctrlKey: 	false,
		altKey: 	false,
		shiftKey: 	false,
		metaKey: 	false,
		keyCode: 	0,
		charCode: 	0
	};
	
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
		
		if (isCustomEvent(eventName)){
			event = createCustomEvent(eventName, bubble);
			memo  = options;
		} else if (isMouseEvent(eventName)){
			event = createMouseEvent(eventName, bubble, Object.extend(Object.extend({}, optionsForMouseEvent), options));
		} else if (isKeyEvent(eventName)){
			event = createKeyEvent(eventName, bubble, Object.extend(Object.extend({}, optionsForKeyEvent), options));
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
