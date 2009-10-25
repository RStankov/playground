//= require "admin/header"

CD3.Admin.LightWindow = Class.create({
	initialize: function(options){
		if (!options) options = {};
		
		this.build();
		
		this.loadUrl	= options.url || null;
		this.loaded		= false;
		this.opened		= false;
		this.callback	= options.callback || Prototype.emptyFunction;
		this.unload		= options.unload || Prototype.emptyFunction;
	
	},
	build: function(){
		/*
		<div  class="form-container lightwindow" style="display: none;">
			<ul class="head">
				<li class="close"><a href="javascript:;" title="{_ close}">{_ close}</a></li>
				<li class="first"></li>
			</ul>
			<div class="body" style="display: none;"></div>
			<div class="loading"><div>{_ loading}</div></div>
		</div>
		*/
		var element = new Element('div', {'class': 'form-container lightwindow'}).hide();
		element.innerHTML = '<ul class="head">
			<li class="close"><a href="javascript:;" title="{_ close}">{_ close}</a></li>
			<li class="first"></li>
		</ul>
		<div class="body" style="display: none;"></div>
		<div class="loading"><div>{_ loading}</div></div>';
		
		document.body.appendChild(element);
		
		this.container	= $(element);
		this.loading	= this.container.down('.loading');
		
		this.container.down('li.close').observe('click', this.hide.bind(this));
	},
	show: function(){
		if (!this.container.visible()){
			this.container.setStyle(this.getCenterStyle()).grow(!this.loaded ? {afterFinish: this.load.bind(this)} : {} );
		} else if (!this.loaded){
			this.load();
		}
	},
	hide: function(){
		this.container.fade();
	},
	load: function(){
		var div = this.container.down('div');
		
		if (div.visible()){
			this.unload(div);
			div.hide();
			div.innerHTML = '';
		}
		
		this.loading.show();
		
		new Ajax.Request(this.loadUrl, {
			onComplete: function(transport){
				this.loading.hide();
				this.callback(div.show().update(transport.responseText));
				this.container.morph(this.getCenterStyle());
			}.bind(this)
		});
		this.loaded = true;
	},
	setUrl: function(url){
		if (url != this.loadUrl){
			this.loadUrl = url;
			this.loaded = false;
			this.container.down('div').innerHTML = '';
			this.loading.show();
		}
		return this;
	},
	getCenterStyle: function(){
		var scroll = document.viewport.getScrollOffsets(), dim = document.viewport.getDimensions();
		return {
			top:	Math.max(0, scroll.top + (dim.height - this.container.getHeight()) / 2) + 'px',
			left:	Math.max(0, scroll.left + (dim.width  - this.container.getWidth()) / 2) + 'px'
		}
	}
});