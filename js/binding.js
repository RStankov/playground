(function(){
  window.BindedView = Backbone.View.extend({
    // TODO remove previous bindings
    applyBindings: function() {
      if (!this.model) {
        return;
      }

      this.listenTo(this.model, 'destroy', this.remove);

      var self = this;
      this.$('[data-bind]').each(function() {
        var element = $(this),
            bind    = element.data('bind').split(':'),
            name    = bind[0],
            render  = BindedView.renders[bind[1] || 'html'],
            option  = bind[2];

        // TODO validation

        function renderAttribute(_, value) {
          render(element, option, value);
        }

        self.listenTo(self.model, 'change:' + name, renderAttribute);

        renderAttribute(null, self.model.get(name));
      });
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

