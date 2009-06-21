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
CD3.Dnd = {};

// drag helpers
/*
	options:
		- filter
		- moveX
		- moveY
		- scroll
 */
(function(){
	var element, original, options, offset;

	function start(drag, e){
		if (element) end(e);
		
		e.stop();
				
		element		= $(drag);
		options		= arguments[2] || {};
		original	= {
			position:	element.style.position,
			zIndex:		element.style.zIndex,
			top:		element.style.top,
			left:		element.style.left
		};
	
		var cumulativeOffset = element.cumulativeOffset(); 
		offset = {
			x: e.pointerX() - cumulativeOffset[0],
			y: e.pointerY() - cumulativeOffset[1]
		};
		
		element.makePositioned();
		
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
		
	    if (options.filter) 		position = options.filter(position);
		if (options.moveX != false) element.style.left = position.x + 'px';
		if (options.moveY != false) element.style.top  = position.y + 'px';

		if (options.scroll != false){
			Position.prepare();
			if (!Position.withinIncludingScrolloffsets(element, 0, 0))
				element.scrollTo();
		}
		
		element.fire('cd3:drag:move' /* todo: data */);
	}
	
	function end(e){
		if (!element) return;
		
		e.stop();
		
		element.fire('cd3:drag:stop' /* todo: data */);
		element.setStyle(original);
		
		element = original = options = offset = null;
		
		document.stopObserving('mousemove', move);
		document.stopObserving('mouseup', end);
	}
	
	// expose
	CD3.Dnd.drag = start;
	
	CD3.Dnd.startDragging = function(options, e){
		if (arguments.length < 2){
			e = options;
			options = {};
		}
		start(this, e, options);
	};
})();

// Sortable
CD3.Dnd.Sortable = Class.create({
	initialize: function(container, options){
		container	= $(container);
		options		= Object.extend(this.constructor.defaultOptions, options || {});
		
		this.container	= container;
		this.options	= options;
	}
});

CD3.Dnd.Sortable.defaultOptions = {
	container:	'ul',
	sort:		'li',
	handle:		'.drag',
	onChange:	null,
	onUpdate: 	null
	// other dnd options
}