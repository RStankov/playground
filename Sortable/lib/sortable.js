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

