// Part of CD3.Wigets ( http://github.com/RStankov/controldepo-3-widgets/ )
var CD3 = {};

CD3.Growl = Class.create({
	initialize: function(list){
		list = $(list);
		
		if (!list){
			list = new Element('ul', {className: 'growl'});
			document.body.appendChild(list);
		}

		this.quque = list.delegate('li', 'click', this.hideTarget.bind(this));
//		this.positionate();
	},
	positionate: function(){
		this.quque.insert(new Element('li').update('here I am'));
		
		var scroll = document.viewport.getScrollOffsets();
		
		this.quque.style.top = scroll.top + 'px';
	},
	show: function(options){
		if (Object.isString(options)) options = {text: options};
		
		var item = new Element('li')
			.insert( new Element('img', {src: options.image, alt: ''}))
			.insert( new Element('h3').update(options.title || ''))
			.insert( new Element('p').update(options.text || ''));

		this.quque.insert(item.hide());
		
		item.store('cd3:growl:timer', this.hide.delay(3, item));
		item.appear();
	},
	hideTarget: function(e){
		this.hide(e.findElement('li'));
	},
	hide: function(element){
		if (!element) return;
		
		clearTimeout(element.retrieve('cd3:growl:timer'));
		element.unsetStorage();
		
		new Effect.Opacity(element, {
			from: 1.0, 
			to: 0.0,
			duration: 0.5,
			afterFinish: function(e){
				e.element.blindUp({
					duration: 0.2,
					afterFinish: function(e){
						if (e.element.parentNode)
							e.element.remove();
					}
				});
			}
		});
	}
});
CD3.Growl.notify = function(options){
	var instance = new CD3.Growl();
	instance.show(options);
	CD3.Growl.notify = function(options){
		instance.show(options);
	};	
};