var CD3 = {};

CD3.UI = {};

/*

<div class="overlay" id="cd3_drop_box">
	<div class="frame loading">
		<header>
			<h2>title</h2>
			<button>close</button>
		</header>
		<section>
			....
		</section>
		<footer>
		
		</footer>
	</div>
</div>

*/

CD3.UI.DropBox = Class.create({
	initialize: function(){
		this.element = this.constructor.getContainer();	
	}
});

CD3.UI.DropBox.Container = Class.create({
	initialize: function(id){
		this.overlay	= new Element('div', {'class': 'overlay'});
		this.frame		= new Element('div', {'class': 'frame'}).setStyle({width: '400px'});
		this.header		= new Element('header');
		this.title 		= new Element('h2').update('Title');
		this.section	= new Element('section').setStyle({height: '200px'});
		this.footer		= new Element('footer');
		
		this.overlay.insert(this.frame
			.insert(this.header.insert(this.title))
			.insert(this.section)
			.insert(this.footer)
		);
		
		this.overlay.hide();
	},
	open: function(){
		if (!this.overlay.visible()) this.overlay.slideDown({duration: 0.5});
	},
	close: function(){
		if (this.overlay.visible()) this.overlay.slideUp({duration: 0.5});
	},
	toggle: function(){
		Effect.toggle(this.overlay, 'slide', {duration: 0.5});
	},
	size: function(width, height){
		if (width <= 0 || height <= 0) return this.close();
		
		this.frame.morph('width: ' + width + 'px;'); 
		this.section.morph('height: ' + height + 'px;');
	},
	setTitle: function(title){
		this.title.update(title);
	},
	setContent: function(content){
		this.section.update(content);
	},
	toElement: function(){
		return this.overlay;
	}
});

CD3.UI.DropBox.getContainer = function(){
	var container = new this.Container(); 
	
	document.body.appendChild(container.toElement());
	
	this.getContainer = function(){
		return container;
	};
	
	return container;
};