/*

options (draggable):
	- filter
	- moveX
	- moveY
	- scroll
	
options (sortable)
	view CD3.Dnd.Sortable.defaultOptions variable

events (dragable):
	cd3:drag:start
	cd3:drag:move
	cd3:drag:finish
	
events (sortable)
	cd3:sort:changed
	cd3:sort:updated

*/

var CD3 = {};

// drag and drop
CD3.Dnd = {};

// drag helpers
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
		
		element.style.position = 'absolute'; // element.makePositioned();
		
		element.fire('cd3:drag:start', {
			element: element
		});
				
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
/*
		if (options.scroll != false){
			Position.prepare();
			if (!Position.withinIncludingScrolloffsets(element, 0, 0))
				element.scrollTo();
		}
*/		
		element.fire('cd3:drag:move', {
			x:		 e.pointerX(),
			y:		 e.pointerY(),
			element: element
		});
	}
	
	function end(e){
		if (!element) return;
		
		e.stop();
		
		element.fire('cd3:drag:finish', {
			element: element
		});
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
		
		if (!options.handle){
			options.handle = options.item;
		}
		
		this.container	= container;
		this.options	= options;
		
		container.delegate(options.handle, 'mousedown', CD3.Dnd.startDragging);
		
		container.observe('cd3:drag:start', 	this.onDragStart.bind(this));
		container.observe('cd3:drag:move',		this.onDrag.bind(this));
		container.observe('cd3:drag:finish',	this.onDragEnd.bind(this));
		 
		if (options.ghosting){
			var ghost = this.constructor.Ghost;
			
			container.observe('cd3:drag:start',		ghost.create.bind(this));
			container.observe('cd3:sort:changed',	ghost.insert.bind(this));
			container.observe('cd3:drag:finish',	ghost.remove.bind(this));
		}
	},
	onDragStart: function(e){
		var handle  = e.memo.element,
			options = this.options,
			drag	= handle.match(options.item) ? handle : handle.up(options.item);
		
		this.changed = false;
		this.drag 	 = drag;
		this.items	 = this.container.select(options.list + ' ' + options.item).reject(function(item){ return item == drag });
	},
	onDrag: function(e){
		var hover = this.items.find(function(item){
			return Position.within(item, e.memo.x, e.memo.y);
		});
		
		if (!hover) return;
		
		var overlap = Position.overlap('vertical', hover);
		if (overlap > 0.5){
			hover.insert({before: this.drag});
		} else {
			hover.insert({after: this.drag});
		}
		
		this.changed = true;
		this.container.fire('cd3:sort:changed', {
			sortable: this
		});
	},
	onDragEnd: function(e){
		if (this.changed){
			this.container.fire('cd3:sort:updated', {
				sortable: this
			});
		}
		this.changed = this.drag = this.items = null;
	},
	serialize: function(name, list){
		var id, rule = this.constructor.SERIALIZE_RULE;
		
		return list.select(this.options.item).inject([], function(memo, item){
			if (id = (item.id && item.id.match(rule)[1])){
				memo.push( name + '=' + id );
			}
			return memo;
		}).join('&');
	}
});

// Sortable default options	
CD3.Dnd.Sortable.defaultOptions = {
	list:		'ul',
	item:		'li',
	handle:		null,
	ghosting:	true
};

// Serialize rule
CD3.Dnd.Sortable.SERIALIZE_RULE = /\w+_(\d+)/;

// Sortable Ghost plugin
CD3.Dnd.Sortable.Ghost = {
	create: function(){
		this.ghost = $(this.drag.cloneNode(true));
		this.ghost.id = null;
		this.ghost.setOpacity(0.5);
		this.ghost.style.position = null;
		
		this.drag.insert({ after: this.ghost });
	},
	insert: function(){
		this.drag.insert({ after: this.ghost });
	},
	remove: function(){
		this.ghost.remove();
		this.ghost = false;
	}
};
