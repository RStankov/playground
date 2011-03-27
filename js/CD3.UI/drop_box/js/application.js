var box = new CD3.UI.DropBox();


document.observe('click', function(e){
	var a = e.findElement('a');

	if (a){
		e.stop();
		box.loadLink(a);
	}
});