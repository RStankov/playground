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

Number.prototype.constrain = function(min, max) {
	return min > max ? this.constrain(max, min) : this > max ? max : this < min ? min : parseFloat(this);
};

Element.addMethods({
    insert: Element.insert.wrap(function(insert, element, insertation){
        if (!Object.isArray(insertation)) return insert(element, insertation);

        element = $(element);
        insertation.each(insert.curry(element));
        return element;
    })
});


CD3.UI.Util = {
	getContentDimensions: function(content){
		var wrap = document.createElement('span');
		wrap.innerHTML = content;
		
		document.body.appendChild(wrap);
		
		var dimensions = {
			width:	wrap.offsetWidth,
			height: wrap.offsetHeight
		};
		
		document.body.removeChild(wrap);
		
		delete wrap;
		
		return dimensions;
	}
}

CD3.UI.DropBox = Class.create({
	initialize: function(options){
		if (!options) options = {};
		
		this.container	= this.constructor.getContainer(options);
		this.url		= null;
		this.onload		= options.onload   || Prototype.emptyFunction;
		this.onunload	= options.onunload || Prototype.emptyFunction;
	},
	loadUrl: function(url){
		if (this.container.visible()){
			this.load(url);
		} else {
			this.container.open(this.load.bind(this, url));
		}
	},
	loadLink: function(link){
		this.container.setTitle(link.getAttribute('title') || '');
		this.loadUrl(link.href);
	},
	load: function(url){
		if (this.url == url) return;
		
		this.url = url;
		
		this.onunload();
		
		this.container.setLoading(true);
		
		new Ajax.Request(this.url, {
			onComplete: function(transport){
				this.container.setLoading(false);
				this.container.setContent(transport.responseText, this.onload);
			}.bind(this)
		});
	}
});

CD3.UI.DropBox.Container = Class.create({
	initialize: function(id, options){
		if (!options) options = {};
		
		this.overlay	= new Element('div', {'class': 'overlay'});
		this.frame		= new Element('div', {'class': 'frame'}).setStyle({width: '400px'});
		this.header		= new Element('header');
		this.title 		= new Element('h2').update(options.title || '');
		this.button		= new Element('button');
		this.section	= new Element('section').setStyle({height: '200px'});
		this.footer		= new Element('footer');
		
		this.overlay.insert(this.frame.insert(
			[ this.header.insert([ this.button, this.title ]), this.section, this.footer ]
		));
		
		this.overlay.hide();
		
		this.minWidth  = options.minWidth  || 100;
		this.maxWidth  = options.maxWidth  || 600;
		this.minHeight = options.minHeight || 100;
		this.maxHeight = options.maxHeight || 500;
		
		this.button.observe('click', this.close.bind(this));
	},
	visible: function(){
		return this.overlay.visible();
	},
	open: function(callback){
		if (!this.overlay.visible()) this.overlay.slideDown({
			duration: 		0.5,
			afterFinish:	callback || Prototype.emptyFunction
		});
	},
	close: function(){
		if (this.overlay.visible()) this.overlay.slideUp({duration: 0.5});
	},
	setTitle: function(title){
		this.title.update(title);
	},
	setLoading: function(loading){
		if (loading){
			this.section.addClassName('loading');
			this.section.innerHTML = '';
		} else {
			this.section.removeClassName('loading');
		}
	},
	setContent: function(content, callback){
		var dim = CD3.UI.Util.getContentDimensions(content);
		
		this.frame.morph('width: ' + dim.width.constrain(this.minWidth, this.maxWidth) + 'px;');
		this.section.morph('height: ' + dim.height.constrain(this.minHeight, this.maxHeight) + 'px;', {
			afterFinish: function(){
				this.section.innerHTML = content;
				if (callback) callback();
			}.bind(this)
		});
	},
	toElement: function(){
		return this.overlay;
	},
});

CD3.UI.DropBox.getContainer = function(options){
	var container = new this.Container(options); 
	
	document.body.appendChild(container.toElement());
	
	CD3.UI.DropBox.getContainer = function(){
		return container;
	};
	
	return container;
};