CD3.ContinuesSlider = Class.create({
	initialize: function(container, options){
		var options = Object.extend({
			prev: 			null,
			next:			null,
			scrollBy:		0,
			scrollType:		'horizontal',
			beforeSlide:	false,
			afterSlide:		false
		}, options || {});

		this.container		= $(container);
		this.scroll			= options.scrollType == 'vertical' ? ['top', 'offsetHeight', 'y'] : ['left', 'offsetWidth', 'x'];
		this.beforeSlide	= options.beforeSlide || Prototype.emptyFunction;
		this.afterSlide		= options.afterSlide || Prototype.emptyFunction;
		this.prev			= $(options.prev);
		this.next			= $(options.next);

		this.prev.observe('mouseover', this.startSliding.bind(this, options.scrollBy));
		this.prev.observe('mouseout', this.stopSliding.bind(this));
		
		this.next.observe('mouseover', this.slide.bind(this, -options.scrollBy));
		this.next.observe('mouseout', this.stopSliding.bind(this));
		
		var pos = parseInt(this.container.style[this.scroll[0]]) || 0;

		this.setVisibility('prev', pos != 0);
		this.setVisibility('next', this.container[this.scroll[1]] - (options.scrollBy - pos) >= 1);
	},
	setVisibility: function(button, visible){
		this[button].style.visibility = visible ? 'visible' : 'hidden';
	},
	startSliding: function(moveBy){
		if (this.interval){
			clearInterval(this.interval);
		}
		this.beforeSlide.call(this);
		this.interval = setInterval(this.slide.bind(this, moveBy), 100);
	},
	stopSliding: function(){
		if (this.interval){
			clearInterval(this.interval);
			this.interval = null;
			this.afterSlide.call(this);
		}
	}
	slide: function(value){
		var property	= parseInt(this.container.style[this.scroll[0]]) || 0,	// top or left
			offset		= this.container[this.scroll[1]]; // offsetHeight or offsetWidth

		if ((moveBy > 0 && property > 0) || (moveBy < 0 && property + offset + moveBy < 0)) return;

		this.setVisibility('prev', property + moveBy < 0);
		this.setVisibility('next', offset + property + moveBy * 2 > 1);
		this.sliding = true;

		moveBy = moveBy < 0 ? Math.max(moveBy, - (offset + property + moveBy)) : Math.min(moveBy, -property);
		
		this.container.style[this.scroll[0]] = moveBy + property + 'px';
	}
});