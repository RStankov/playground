(function(){
  window.BindedView = Backbone.View.extend({
    applyBindings: function() {
      if (!this.model) {
        return;
      }

      this.listenTo(this.model, 'destroy', this.remove);

      var bindings = {};
      var self = this;
      this.$('[data-bind]').each(function() {
        var element = $(this),
            bind    = element.data('bind').split(':'),
            name    = bind[0],
            render  = BindedView.renders[bind[1] || 'html'],
            option  = bind[2];

        bindings[name] || (bindings[name] = []);
        bindings[name].push(function(value) { render(element, option, value); });
      });

      for (var attributeName in bindings) {
        var value = this.model.get(attributeName);
        _.each(bindings[attributeName], function(render) { render(value); });
        (function(attributeName){
          this.listenTo(this.model, 'change:' + attributeName, function(model, value) {
            renderAttribute(bindings[attributeName], value);
          });
        }).call(this, attributeName)
      }

      this.bindings = bindings;
    }
  });

  BindedView.renders = {
    'toggle-class': function(element, name, value) {
      element.toggleClass(name, value);
    },
    'attr': function(element, name, value) {
      element.attr(name, value);
    },
    'prop': function(element, name, value) {
      element.prop(name, value);
    },
    'html': function(element, _, value) {
      element.html(value);
    }
  };
})();

