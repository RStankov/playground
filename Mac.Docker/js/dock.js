var Dock = Class.create({
	initialize: function(container, options){
		container = $(container)
		options   = Object.extend({
			min:	36,
			max:	79,
			range:	3
		}, options || {});
		
		this.container	= container;
		this.minSize	= options.min;
		this.maxSize	= options.max;
		this.range		= options.range;
		this.sizeDiff	= this.maxSize - this.minSize;
		this.images		= container.select('img').invoke('setStyle', this.imageSizeStyle(0));

		container.observe('mousemove', this.onMouseMove.bind(this));
		container.observe('mouseleave', this.onMouseLeave.bind(this));
	},
	imageSizeStyle: function(size){
		size += this.minSize;
		return "width:" + size + "px;height:" + size + "px;margin-top:" + (this.maxSize - size) + "px";
	},
	onMouseMove: function(e){
		var image = e.findElement('img');
		if (image){	
			var index 	= this.images.indexOf(image),
				across	= (e.pointerX() - image.cumulativeOffset().left) / this.maxSize,
				diff	= this.sizeDiff,
				range	= this.range,
				style	= this.imageSizeStyle.bind(this);
		
			this.images.each(function(image, i){
				var scale = i - index;
				image.setStyle(style( 
					scale < range && scale > - range ? Math.ceil(diff * (Math.cos(scale - across + 0.5) + 1) / 2) : 0 
				));
			});
		}
	},
	onMouseLeave: function(){
		this.images.invoke('morph', this.imageSizeStyle(0));
	}
});