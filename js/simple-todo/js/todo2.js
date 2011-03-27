function mouseover(){
	if (!this.down('span'))
		this.insert(new Element('span', {className: 'controls'}).update(
			 ' <a href="javascript:;" class="edit" >edit</a> | <a href="javascript:;" class="delete" >delete</a>'
		));
}

function mouseout(e){
	if (e.relatedTarget != this && e.relatedTarget.up(this.tagName) != this){
		var controls = this.select('span.controls').last()
		if (controls) controls.remove();
	}
}

CD3.Behaviors.assign({
	'#container .section': {
		mouseover: {
			'h1':		mouseover,
			'li.title':	mouseover,
			'li':		function () { var label = this.down('label'); if (label) mouseover.call(label) }
		},
		mouseout: {
			'h1':		mouseout,
			'li.title':	mouseout,
			'li':		function (e) { var label = this.down('label'); if (label) mouseout.call(label, e) }
		},
		click: {
			'a.edit': function(){
				var text	= this.up('span').previousSibling.textContent.strip();
				var element	= this.up('span').up();
					element._text = text;
					element.innerHTML = '';
					element.insert(new Element('span')
						.insert(new Element('input', {type: 'text', value: text}))
						.insert(' <input type="button" class="save" value="Save" /> | <a href="javascript:;" class="cancel">cancel</a>')
					);
			},
			'a.cancel': function(){
				var element = this.up('span').up();
				element.innerHTML = element._text;
			},
			'input[type=button].save': function(){
				var element = this.up('span').up();
				element.innerHTML = this.previous('input[type=text]').getValue();
			},
			'a.add-task': function(){
				var label = new Element('label');
					label._text = 'New task';
					label.insert(new Element('span')
						.insert(new Element('input', {type: 'text', value: 'New task'}))
						.insert(' <input type="button" class="save" value="Save" /> | <a href="javascript:;" class="cancel">cancel</a>')
					);
				
				this.up('li').insert({before: new Element('li')
					.insert(new Element('input', {type: 'checkbox'}))
					.insert(label)
				});
			},
			'a.add-task-list': function(){
				var ul = new Element('ul', {className: 'tasks'})
					.update('<li class="title"></li><li class="last"><a href="javascript:;" class="add-task">add new task</a></li>');
				this.insert({before: ul});
				
				var title = ul.down('li.title');
					title._text = 'New task list';
					title.insert(new Element('span')
						.insert(new Element('input', {type: 'text', value: 'New task list'}))
						.insert(' <input type="button" class="save" value="Save" /> | <a href="javascript:;" class="cancel">cancel</a>')
					);
			}
		}
	}
});