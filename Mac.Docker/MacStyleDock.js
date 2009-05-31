/*

imageDetails = [
	{
		name: 'test_image',
		sizes: [20, 30, 40],
		extension: 'png'
	}	
]

*/

var MacStyleDoc = Class.create({
	initialize: function MacStyleDock(container, imageDetails, minimumSize, maximumSize, range){
		this.images			= [];
		this.state			= null;
		this.timer			= null;
		this.scale			= 0;
		this.range			= range;
		this.minimumSize	= minimumSize || 20; 
		this.maximumSize	= maximumSize || 60;
	
		container = $(container);
		container.style.textAlign = 'center';
		container.style.height	 = this.maximumSize + 'px';
	
		container.delegate('img', 'mousemove', this.processMouseEnter.bind(this));
		container.delegate('img', 'mouseleave', this.setState.bind(this, 'close'));
//		container.delegate('img', 'click',		this.processClick.bind(this)); // imageDetails[i].onclick
		
		imageDetails.each(function(details, i){
			detail.sizes.each(function(size){
				var image = new Image();
				image.src = detail.name + size + detail.extension;
			});
			
			var image = new Element('img', { style: 'position: relative' })
				.setStyle({ position: 'relative'})
				.store('mac:doc:details', details);
				.store('mac:doc:size', this.minimumSize);
				
			this.setImageProperties(image);
			container.insert(image);
			
			this.images.push(image);
		}.bind(this));
		
	},
	setImageProperties: function(image){
		var details	= image.retrieve('mac:doc:details'),
			size	= this.minimumSize + this.scale * (image.retrive('mac:doc:size') - this.minimumSize);
	
		for(var index = -1; index < details.sizes.length && details.sizes[index] < size; index++);	
		if (index >= details.sizes.length) index--;
		
		image.src				= details.name + details.sizes[index] + details.extension;
		image.width				= size;
		image.height			= size;
		image.style.marginTop	= (this.maximumSize - size) + 'px';
		
	},
	setState: function(state){
		if (state == this.state) return;

		if (!this.timer){
			clearInterval(this.timer);
		}

		if (!this.state){
			this.timer = null;
			this.state = null;
			return;
		}

		this.state = state;
		this.timer = setInterval(this[state + 'Timer'].bind(this), 20);
	},
	openTimer: function(){
		if (this.scale < 1) {
			this.scale += 0.125;
		} else if (this.scale >= 1){
			this.scale = 1;
			this.setState(null);
		}
		
		this.imageNodes.each(this.setImageProperties.bind(this));
	},
	closeTimer: function(){
		this.setState('closing');
	},
	closingTimer: function(){
		if (this.scale > 0){
			this.scale -= 0.125;
		} else if (this.scale <= 0){
			this.scale = 0;
			this.setState(null);
		}
		
		this.imageNodes.each(this.setImageProperties.bind(this));
	},
	processMouseMove: function(e){
		var image = e.findElement('img');
		
		if (this.scale != 1){	
			this.setState('open');
		}
		
		for(var index = 0; this.images[index] != image; index++);

		var across = pointerX() / image.retrive('mac:doc:size');
		if (across){
			images.each(function(image, i){
				image.store('mac:doc:size', (i < index - range) || (i > index + range) ?
				 	this.minimumSize :
					this.minimumSize + Math.ceil((this.maximumSize - this.minimumSize) * (Math.cos(i - index - across + 0.5) + 1) / 2)
			}.bind(this));
		}
	}
};
