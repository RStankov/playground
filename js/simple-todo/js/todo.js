var EditInPlace = Class.create({
	initialize: function(element){
		this.input		= new Element('input', {type: 'text', value: ''});
		this.text		= new Element('span').update(element.innerHTML.strip());
		this.controls	= new Element('span').hide().insert(
			'<a href="javascript:;" class="edit" >edit</a> | <a href="javascript:;" class="delete" >delete</a>'
		);
		this.editor		= new Element('span').hide().insert(this.input).insert(
			' <input type="button" value="Save" /> | <a href="javascript:;" class="cancel">cancel</a>'
		);
		
		element.innerHTML = ''; 
		element.insert(this.text).insert(' ').insert(this.controls).insert(' ').insert(this.editor);
		element.observe('mouseover', function(){
			if (!this.editor.visible())
				this.controls.show();
		}.bind(this));
		element.observe('mouseout', function(e){
			this.controls.hide();
		}.bind(this));
		
		this.controls.down('a.edit').observe('click', this.edit.bind(this));
		this.editor.down('input[type=button]').observe('click', this.save.bind(this));
		this.editor.down('a.cancel').observe('click', this.cancel.bind(this));
		this.input.observe('keypress', this.onKeyPress.bind(this));
		this.input.observe('blur', this.save.bind(this));
	},
	onKeyPress: function(e){
		if (e.keyCode == Event.KEY_RETURN)
			this.save();
		else if (e.keyCode == Event.KEY_ESC)
			this.cancel();
	},
	edit: function(){
		this.input.setValue(this.text.innerHTML);
		this.input.focus();
		this.text.hide();
		this.controls.hide();
		this.editor.show();
	},
	save: function(){
		this.text.update(this.input.getValue()).show();
		this.text.up().highlight();
		this.editor.hide();
	},
	cancel: function(){
		this.text.show();
		this.editor.hide();
	}
});

new EditInPlace($$('div.section h1').first());
new EditInPlace($$('li.title').first());
$$('label').each(function(e){
	new EditInPlace(e);
});

function addTask(){
	var text = new Element('label').update('New task');
	
	this.up('li').insert({before: new Element('li')
		.insert(new Element('input', {type: 'checkbox'}))
		.insert(text)
	});
	new EditInPlace(text).edit();
}

$$('a.add-task').first().observe('click', addTask);
$$('a.add-task-list').first().observe('click', function(e){
	var ul = new Element('ul', {className: 'tasks'}).update(
		'<li class="title">New task list</li><li class="last"><a href="javascript:;" class="add-task">add new task</a></li>'
	);
	this.insert({before: ul});
	
	ul.down('a.add-task').observe('click', addTask);
	new EditInPlace(ul.down('li.title')).edit();
});