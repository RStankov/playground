var Taskar = {
	mouseover: function(){
		if (!this.down('span'))
			this.insert(new Element('span', {className: 'controls'}).update(
				 ' <a href="javascript:;" class="edit" >edit</a> | <a href="javascript:;" class="delete" >delete</a>'
			));
	},
	mouseout: function(e){
		if (e.relatedTarget != this && e.relatedTarget.up(this.tagName) != this){
			var controls = this.select('span.controls').last()
			if (controls) controls.remove();
		}
	},
	editLine: function(){
		var span = this.up('span');
		var element = span.up();
		span.remove();
		
		new Taskar.EditInPlace.Line(element);
	},
	addTask: function(){
		var label = new Element('label').update('New task...');
		this.up('li').insert({
			before: new Element('li')
				.insert(new Element('input', { type: 'checkbox' }))
				.insert(label)
		});
		
		new Taskar.EditInPlace.Task(label);
	},
	addTaskList: function(){
		var li = new Element('li', {className: 'title'}).update('New task list...');
		this.up('span').insert({
			before: new Element('ul', {className: 'tasks'})
				.insert(li)
				.insert(new Element('li', {className: 'last'})
					.update('<a href="javascript:;" class="add-task">add new task</a>')
				)
		});
		
		new Taskar.EditInPlace.Line(li);
	},
	addNote: function(){
		var div = new Element('div', {className: 'note'}).update('Note content..');
		this.up('span').insert({ before: div });
		
		new Taskar.EditInPlace.Note(div);
	}
};

Taskar.EditInPlace = { instance: null };
Taskar.EditInPlace.Base = {
	setup: function(){
		if (Taskar.EditInPlace.instance){
			Taskar.EditInPlace.instance.save();
		}
		Taskar.EditInPlace.instance = this;
	},
	buildEditor: function(element){
		this.editor = element || new Element('span');
		this.editor.innerHTML = this.constructor.Template;
		
		// bind events
		this.input = this.editor.down('.editbox').setValue(this.element.innerHTML.strip());
		this.input.observe('keypress', this.onKeyPress.bind(this));
		this.input.focus();
		
		(this.saveButton = this.editor.down('.save-button')).observe('click', this.save.bind(this));
		(this.cancelButton = this.editor.down('.cancel-button')).observe('click', this.cancel.bind(this));
		
		return this.editor;
	},
	onKeyPress: function(e){
		if (e.keyCode == Event.KEY_RETURN)
			this.save();
		else if (e.keyCode == Event.KEY_ESC)
			this.cancel();
	},
	destroy: function(){
		this.input.stopObserving();
		this.input = null;
		this.saveButton.stopObserving();
		this.saveButton = null;
		this.cancelButton.stopObserving();
		this.cancelButton = null;
		this.editor.innerHTML = '';
		this.editor.remove();
		this.editor = null;
		this.element = null;
		Taskar.EditInPlace.instance = null;
	}
}

Taskar.EditInPlace.Task = Class.create(Taskar.EditInPlace.Base, {
	initialize: function(element){
		this.setup();
		this.element = element;
		this.buildEditor(new Element('li'))
		this.parent	= element.up('li').hide().insert({
			after: this.buildEditor(new Element('li'))
		});
	},
	save: function(){
		this.element.update(this.input.getValue());
		this.parent.show();
		this.parent = null;
		this.destroy();
	},
	cancel: function(){
		this.parent.show();
		this.parent = null;
		this.destroy();
	}
});
Taskar.EditInPlace.Task.Template = [
	'<form>',
		'<input type="text" class="editbox" />',
		'<br />',
		'<input type="submit" class="save-button" value="Save" /> | ',
		'<a href="javascript:;" class="cancel-button">Cancel</a>',
	'</form>'
].join('');
Taskar.EditInPlace.Line = Class.create(Taskar.EditInPlace.Base, {
	initialize: function(element){
		this.setup();
		this.element = element;
		this.element._text = element.innerHTML;
		var editor = this.buildEditor();
		this.element.innerHTML = '';
		this.element.insert(editor);
	},
	save: function(){
		var element = this.element, value = this.input.getValue();
		this.destroy();
		element.update(value);
	},
	cancel: function(){
		var element = this.element;
		this.destroy();
		element.update(element._text);
		element._text = null;
	}
});
Taskar.EditInPlace.Line.Template = [
	'<input type="text" class="editbox" /> ',
	'<input type="submit" class="save-button" value="Save" /> | ',
	'<a href="javascript:;" class="cancel-button">Cancel</a>',
].join('');
// ----------------------------------------------------------------------------
// TODO
//
Taskar.EditInPlace.Note = Class.create(Taskar.EditInPlace.Base, {
	initialize: function(element){
		this.setup();
		this.element = element;
		this.element._text = element.innerHTML;
		this.element.innerHTML = this.element.innerHTML.replace('<br>', "\n");
		var editor = this.buildEditor();
		this.element.innerHTML = '';
		this.element.insert(editor);
	},
	onKeyPress: function(e){
		if (e.keyCode == Event.KEY_ESC)
			this.cancel();
	},
	save: function(){
		var element = this.element, value = this.input.getValue().replace("\n", '<br>');
		this.destroy();
		element.update(value);
	},
	cancel: function(){
		var element = this.element;
		this.destroy();
		element.update(element._text);
		element._text = null;
	}
});
Taskar.EditInPlace.Note.Template = [
	'<form>',
		'<textarea class="editbox" rows="5" cols="100"></textarea>',
		'<br />',
		'<input type="submit" class="save-button" value="Save" /> | ',
		'<a href="javascript:;" class="cancel-button">Cancel</a>',
	'</form>'
].join('');

CD3.Behaviors.assign({
	'#container .section': {
		mouseover: {
			'h1':		Taskar.mouseover,
			'li.title':	Taskar.mouseover
		},
		mouseout: {
			'h1':		Taskar.mouseout,
			'li.title':	Taskar.mouseout
		},
		click: {
			'label':			function(){ new Taskar.EditInPlace.Task(this); },
			'.note':			function(){ if (!this.down('textarea')) new Taskar.EditInPlace.Note(this); },
			'a.edit':			Taskar.editLine,
			'a.add-task':		Taskar.addTask,
			'a.add-task-list':	Taskar.addTaskList,
			'a.add-note':		Taskar.addNote
		}
	}
});