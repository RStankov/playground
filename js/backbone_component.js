(function(Backbone, $){
  var Components = {};

  _.extend(Components, Backbone.Events);

  Components.View = Backbone.View.extend({
    name: 'ComponentView',
    elements: {},

    wasInitialized: $.noop,
    wasRemoved: $.noop,

    initialize: function(options) {
      this.Components = options.Components;

      delete options.Components;

      _.each(this.elements, function(selector, element) {
        return this[element] = this.$(selector);
      }, this);

      this.subviews = [];
      this.wasInitialized(options);

      this.render();
    },

    registerSubview: function(view) {
      this.subviews.push(view);

      return this;
    },

    removeSubviews: function(view) {
      _.invoke(this.subviews, 'remove');
      this.subviews = [];

      return this;
    },

    remove: function() {
      Components.removeComponents(this.$el);

      Backbone.View.prototype.remove.call(this);

      this.removeSubviews();
      this.wasRemoved();

      return this;
    },

    defer: function(time, callback) {
      var ref;
      if (arguments.length === 1) {
        ref = [time, 0], callback = ref[0], time = ref[1];
      }
      return setTimeout(callback, time);
    }
  });

  Components._createComponentFunction = function(name, component) {
    if (typeof component === 'function') {
      return function(element) {
        component(element);
        return {
          name: name,
          remove: $.noop
        };
      };
    }

    component.name = name;

    var View = Components.View.extend(component);
    return function(element) {
      return new View(element);
    }
  };

  Components.component = function(name, component) {
    if (this.components == null) {
      this.components = {};
    }

    if (this.components[name]) {
      throw new Error("Duplicated component name - " + name);
    }

    return this.component[name] = Components.View(name, component);
  };


  var SPLIT_REGEXP = /,\W*/;
  var KEY_INSTANCE = 'component-instances';

  Components.processComponents = function(root) {
    root = $(root);
    root.find('[data-component]').each(function(i, element) {
      element = $(element);

      if (!element.data('component')) {
        return;
      }

      _.each(element.data('component').split(SPLIT_REGEXP), function(name) {
        if (!this.components[name]) {
          throw new Error("Missing component - " + name);
        }

        var instances = element.data(KEY_INSTANCE) || {};

        if (instances[name]) {
          return;
        }

        instances[name] = this.components[name](element);

        element.data(KEY_INSTANCE, instances);
      }, this);
    }, this);

    this.trigger('components:mount', {element: root});
  };

  Components.removeComponents = function(root) {
    root = $(root);

    this.trigger('components:unmount', {element: root});

    root.find('[data-component]').each(function(i, element) {
      element = $(element);
      _.invoke(element.data(KEY_INSTANCE), 'remove');
      element.data(KEY_INSTANCE, {});
    });
  };

  // expose to jQuery
  $.fn.emptyWithComponents = function() {
    Components.removeComponents(this);
    this.empty();
    return this;
  };

  $.fn.removeWithComponents = function() {
    Components.removeComponents(this);
    this.remove();
    return this;
  };

  $.fn.htmlWithComponents = function(content) {
    Components.removeComponents(this);
    this.html(content);
    Components.processComponents(this);
    return this;
  };

  $.fn.appendWithComponents = function(content) {
    this.append(content);
    Components.processComponents(this);
    return this;
  };

  $.fn.prependWithComponents = function(content) {
    this.prepend(content);
    Components.processComponents(this);
    return this;
  };

  $.fn.replaceWithComponents = function(content) {
    var parent;
    Components.removeComponents(this);
    parent = this.parent();
    this.replaceWith(content);
    Components.processComponents(parent);
    return this;
  };

  // expose to Backbone
  Backbone.Components = Components;
})(Backbone, $);

