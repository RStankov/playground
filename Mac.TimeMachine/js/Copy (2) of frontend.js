document.observe('dom:loaded', function(){
	$$('#container img').invoke('hide').invoke('setOpacity', 0.0);
	var front = $('container').down('img').show().setOpacity(1.0);
	var status = 1;
	$('puff').observe('click', function(){
		if (front.next('img'))
			new ZoomEffect(front, front.next('img'), {
				afterFinish: function(effect){
					front = effect.back;
					$('status').innerHTML = (++status) + '/9';
				}
			});
	});
	$('back').observe('click', function(){
		if (front.previous('img'))
			new ZoomEffect(front.previous('img'), front, {
				afterFinish: function(effect){
					front = effect.front;
					$('status').innerHTML = (--status) + '/9';
				}
			});
	});
});

var ZoomEffect = Class.create(Effect.Base, {
	initialize: function(front, back) {
		this.front	= $(front); 
		this.back	= $(back);
		this.start(Object.extend({
			queue: {scope: 'zoom', limit: 1}
		}, arguments[2] || {}));
	},
	setup: function() {
		// check visibility
		this.factor	= this.front.visible() ? 1 : -1;
		this.prepare('front');
		this.prepare('back');
	},
	prepare: function(name){
		var element = this[name];
		element.absolutize();
		element.show();
		
		this[name + 'Original'] = {
			dims:	[element.offsetHeight, element.offsetWidth],
			top:	element.offsetTop,
			left:	element.offsetLeft,
			style:	['top','left','width','height'].inject({}, function(style, p) {
				style[p] = element.style[p] || null;
				return style;
			}),
		};
	},
	update: function(position) {
		var scale = this.factor * position;
		if (this.factor > 0){
			this.setDimensions('front',	1 + scale);
			this.setDimensions('back',	scale);
			this.front.setOpacity(1 - position);
			this.back.setOpacity(position);
		} else {
			this.setDimensions('front',	2 + scale);
			this.setDimensions('back',	1 + scale);
			this.front.setOpacity(position);
			this.back.setOpacity(1 - position);
		}
	},
	setDimensions: function(name, scale) {
		var original = this[name + 'Original'],
			height	 = original.dims[0] * scale,
			width	 = original.dims[1] * scale;
		this[name].setStyle({
			width:	width.round() + 'px',
			height:	height.round() + 'px',
			top:	original.top - (height - original.dims[0])/6 + 'px',
			left:	original.left - (width	- original.dims[1])/2 + 'px'
		});
	},
	finish: function(position) {
		this.front.setStyle(this.frontOriginal.style);
		this.back.setStyle(this.backOriginal.style);
		this[this.factor > 0 ? 'front' : 'back'].hide();
	}
});