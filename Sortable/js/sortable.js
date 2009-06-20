/*

events:
	cd3:drag:start
	cd3:drag:move
	cd3:drag:stop
	cd3:sort:changed
	cd3:sort:updated
	
Then staring draging something just fire custom events for that and recive them from CD3.Sortable

*/
var CD3 = {};

// drag and drop
CD3.startDragging = (function(){
	var element, oldZIndex, options, offset;

	function start(drag, e){
		if (element) end(e);
		
		e.stop();
		
		element		 = $(drag).makePositioned();
		oldZIndex 	 = element.style.zIndex;
		options 	 = arguments[2] || {};
			
		var cumulativeOffset = element.cumulativeOffset(); 
		offset = {
			x: e.pointerX() - cumulativeOffset[0],
			y: e.pointerY() - cumulativeOffset[1]
		};
		
		element.fire('cd3:drag:start' /* todo: data */);
				
		document.observe('mousemove', move);
		document.observe('mouseup', end);
	}
	
	function move(e){
		if (!element) return;
		
		e.stop();
		
		var cumulativeOffset = element.cumulativeOffset(); 
		var position = {
			x: e.pointerX() - cumulativeOffset[0] + (parseInt(element.getStyle('left')) || 0) - offset.x,
			y: e.pointerY() - cumulativeOffset[1] + (parseInt(element.getStyle('top'))  || 0) - offset.y
		}
		
	    if (options.filter) 		position = options.filter(p);
		if (options.moveX != false) element.style.left = position.x + 'px';
		if (options.moveY != false) element.style.top  = position.y + 'px';

/*		
		#TODO scrolling
		if (options.scroll != false){
			Position.prepare();
			if (!Position.withinIncludingScrolloffsets(element, 0, 0))
				element.scrollTo();
		}
*/		
		element.fire('cd3:drag:move' /* todo: data */);
	}
	
	function end(e){
		if (!element) return;
		
		e.stop();
		
		element.fire('cd3:drag:stop' /* todo: data */);
		element.style.zIndex = oldZIndex;
		
		element = oldZIndex = options = offset = null;
		
		document.stopObserving('mousemove', move);
		document.stopObserving('mouseup', end);
	}
	
	return start;
})();

CD3.Sortable = Class.create({
	initialize: function(container, options){
		options = Object.extend(this.constructor.defaultOptions, options || {});
		
		if (!options.handle){
			options.handle = options.sort;
		}
		
		this.container = $(container).delegate(options.handle, 'mousedown', this.startDragging.bind(this));
		
		if (options.onChange){
			this.on('change', options.onChange);
		}
		
		if (options.onUpdate){
			this.on('update', options.onUpdate);
		}
		
		delete(options.handle);
		delete(options.onChange);
		delete(options.onUpdate);
		
		this.options = options;
	},
	startDragging: function(e){
		e.stop();
		
		var element = e.findElement(this.options.sort);
			
		// start drag element
		// probably save:
		// 	- drag element
		//  - element default zIndex
		//  - serialize containers contents
		
		// probably map every list/items
	},
	onDragging: function(){
		// move element around (from one list ot other)
		
		this.checkForChanges('change')
	},
	stopDragging: function(){
		this.checkForChanges('update')
	},
	checkForChanges: function(eventName){
		// check for changes ('cd3:sort:' + eventName)
		// this.container.fire('cd3:sort:change', { ... })
		// this.container.fire('cd3:sort:updated', { ... })
	},
	serialize: function(/* ??? */){
		
	},
	on: function(eventName, callback){
		this.container.observe('cd3:sort:' + eventName, callback.bind(this));
	}
});

CD3.Sortable.defaultOptions = {
	container:	'ul',
	sort:		'li',
	handle:		'.drag',
	onChange:		null,
	onUpdate: 	null
	// other dnd options
}



