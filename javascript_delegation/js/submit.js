Element.addMethods({
	delegateSubmit: (function(){
		var el = document.createElement('div'), isSupported = 'onsubmit' in el;
		
		if (!isSupported){
			el.setAttribute('onsubmit', 'return;');
			isSupported = typeof el.onsubmit == 'function';
		}
		
		return isSupported ? function(element, callback){
			return Event.observe(element, 'submit', callback);
		} : function(element, callback){
			return $(element)
				.observe('click', function(e){
					if (e.findElement('form') && e.findElement('input[type=submit],input[type=image]'))
		                 callback.call(this, e);
				})
				.observe('keyup', function(e){
					if (e.keyCode  == Event.KEY_RETURN && e.findElement('input') && e.findElement('form'))
		                 callback.call(this, e);
				})
		};
	})()
});


if (!console){
	console = { log: alert };
}

$('containter').delegateSubmit(function(e){
	e.stop();
	console.log(this);
	console.log('onsubmit' in this);
	
	this.setAttribute('onsubmit', 'return;');
	console.log(typeof this.onsubmit == 'function');
	console.log(e.findElement('form'));
});