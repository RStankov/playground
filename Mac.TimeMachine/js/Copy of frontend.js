document.observe('dom:loaded', function(){
	$('puff').observe('click', function(){
		Puff($('container').down('img'));
	});
	$('back').observe('click', function(){
		Back($('container').down('img'));
	});
});


var Puff = function(element) {
	element = $(element);

	return new Effect.Parallel([
		new Effect.Flash(element, 				{ sync: true, scaleFrom: 1, scaleTo: 2}), 
		new Effect.Flash(element.next('img'),	{ sync: true, scaleFrom: 0, scaleTo: 1})
	]);
};

var Back = function(element) {
	element = $(element).show();
	return new Effect.Parallel([
		new Effect.Flash(element,				{ sync: true, scaleFrom: 2, scaleTo: 1}), 
		new Effect.Flash(element.next('img'),	{ sync: true, scaleFrom: 1, scaleTo: 0})
	]);
};

Effect.Flash = Class.create(Effect.Base, {
	initialize: function(element) {
		this.element = $(element);
		this.start(Object.extend({
			scaleContent:		true,
			scaleFrom:			1,
			scaleTo:			2,
		}, arguments[1] || {}));
	},
	setup: function() {
		var element = this.element;
		element.absolutize();
		element.show();
		
		this.originalTop		= element.offsetTop;
		this.originalLeft		= element.offsetLeft;
		this.originalStyle		= ['top','left','width','height','fontSize'].inject({}, function(style, p) {
			style[p] = element.style[p] || null;
			return style;
		});
	
		if (this.options.scaleContent){
			var fontSize = element.getStyle('font-size') || '100%';
			['em','px','%','pt'].each(function(fontSizeType) {
				if (fontSize.indexOf(fontSizeType) > 0) {
					this.fontSize		= parseFloat(fontSize);
					this.fontSizeType	= fontSizeType;
					throw $break;
				}
			}.bind(this));
		}
		
		this.factor		= (this.options.scaleTo - this.options.scaleFrom);
		this.dims		= [element.offsetHeight, element.offsetWidth];
		this.showing	= (this.factor > 0) ? this.options.scaleFrom < 1 : this.options.scaleFrom > 1;
	},
	update: function(position) {
		var currentScale = (this.options.scaleFrom) + (this.factor * position);
		if (this.options.scaleContent && this.fontSize)
			this.element.setStyle({fontSize: this.fontSize * currentScale + this.fontSizeType });
		this.setDimensions(this.dims[0] * currentScale, this.dims[1] * currentScale);
		this.element.setOpacity(this.showing ? position : 1 - position);
	},
	finish: function(position) {
		this.element.setStyle(this.originalStyle);
		if (!this.showing)
			this.element.hide();
	},
	setDimensions: function(height, width) {
		this.element.setStyle({
			width:	width.round() + 'px',
			height:	height.round() + 'px',
			top:	this.originalTop - (height - this.dims[0])/6 + 'px',
			left:	this.originalLeft - (width	- this.dims[1])/2 + 'px'
		});
	}
});