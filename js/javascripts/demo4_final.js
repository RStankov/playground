function template(view) {
  return Handlebars.compile($('#' + view + '-template').html());
}

Todo = Backbone.Model.extend({
  defaults: {
    done:  false,
    text:  ''
  },
  toggle: function() { this.save({done: !this.get('done')}); },
  isDone: function() { return this.get('done'); }
});

TodoList = Backbone.Collection.extend({
  localStorage: new Store('todos'),
  model:        Todo,
  done:         function() { return this.filter(function(todo){ return todo.isDone(); }); },
  remaining:    function() { return this.without.apply(this, this.done()); }
});

TodoView = BindedView.extend({
  tagName:  'li',
  template: template('todo'),
  events: {
    'click :checkbox': 'toggleDone',
    'click button':    'destroy',
    'dblclick span':   'edit',
    'keyup :text':     'handleKeyboard',
    'blur :text':      'update'
  },
  elements: {
    input: ':text'
  },
  toggleDone: function() {
    this.model.toggle();
  },
  edit: function() {
    this.$el.addClass('editing');
    this.input.focus();
  },
  update: function() {
    this.model.save({text: this.input.val()});
    this.$el.removeClass('editing');
  },
  handleKeyboard: function(e) {
    e.keyCode == 13 && this.update();
    e.keyCode == 27 && (this.$el.removeClass('editing'), this.input.val(this.model.get('text')));
  },
  destroy: function() {
    this.model.destroy();
  }
});

TodoStatsView = Backbone.View.extend({
  tagName: 'footer',
  events: {
    'click a': 'clearCompleted'
  },
  bindToCollection: {
    'all': 'render'
  },
  templateData: function() {
    return {
      total:      this.collection.length,
      done:       this.collection.done().length,
      remaining:  this.collection.remaining().length
    };
  },
  clearCompleted: function() {
    _.invoke(this.collection.done(), 'destroy');
    return false;
  }
});

TodoAppView = Backbone.View.extend({
  className: 'todo-app',
  template: template('todo-app'),
  templateData: function() {
    return {collection: this.collection};
  },
  events: {
    'keyup :text': 'createOnEnter'
  },
  elements: {
    input: 'header :text'
  },
  createOnEnter: function(e) {
    var text = this.input.val();
    if (!text) {
      this.input.focus();
      return;
    }
    if (e.keyCode != 13) {
      return;
    }
    this.collection.create({text: text});
    this.input.val('');
  },
});

collection = new TodoList();
collection.add(new Todo({text: 'demo 1', done: false}));
collection.add(new Todo({text: 'demo 2', done: true}));

new TodoAppView({collection: collection, el: '#js-todo-app'}).render();


