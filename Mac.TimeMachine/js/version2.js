var offset = {
	width	: 550,					//item.offsetWidth,
//	height	: item.offsetHeight,
	top		: 150,					// item.offsetTop,
	left	: 400,					// item.offsetLeft
};

var options = {
	visible	 : 4,
	zoom	 : 10,
	fade	 : 10,
	duration : .5,
}

function scale(item, number){
	if (number > options.visible )	number = options.visible;
	else if (number < 0)			number = -options.fade;
	
	var ratio = (options.zoom - number ) / options.zoom;
	
	return {
		width	: Math.round(offset.width	* ratio) + 'px',
		height	: Math.round(item._height	* ratio) + 'px',
		top		: Math.round(offset.top		* ratio) + 'px',
		left	: Math.round(offset.left + (offset.width - offset.width * ratio)/2) + 'px'
	};
}


document.observe('dom:loaded', function(){
	var images = $$('#container img').reverse();
	
	images.each(function(item, key){
		item._height = item.offsetHeight;
		item.setStyle(scale(item, key));
	});
	
	var current = 0;	
	
	$('puff').observe('click', function(e){
		if (current + 1 >= images.length) return;
		
		new Effect.Parallel(
			images.slice(current, current + options.visible + 1).inject([], function(memo, item, key){
				var style = scale(item, key - 1);
				
				if (key == 0)
					style.opacity = '0';
				memo.push(new Effect.Morph(item, {style: style, sync: true}));
				return memo;
			}),{
				queue: {scope: 'fly', limit: 1},
				duration: options.duration,
				afterFinish: function(){
					images[current].hide();
					current++;
					
					$('status').innerHTML = current + 1 + '/' + images.length;
				}
			}
		);
	});
	$('back').observe('click', function(e){
		if (current <= 0) return;
		
		current--;
		images[current].show();
		new Effect.Parallel(
			images.slice(current, current + options.visible + 1).inject([], function(memo, item, key){
				var style = scale(item, key);
				
				if (key == 0)
					style.opacity = '1';
					
				memo.push(new Effect.Morph(item, {style: style, sync: true}));
				return memo;
			}),{
				queue: {scope: 'fly', limit: 1},
				duration: options.duration,
				afterFinish: function(){
					$('status').innerHTML = current + 1 + '/' + images.length;
				}
			}
		);
	});
});