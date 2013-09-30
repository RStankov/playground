(function() {
  var original = Backbone.View.prototype.renderTemplate;

  Backbone.View.prototype.renderTemplate = function(context) {
    var result = original.call(this, context);

    if (this.elements) {
      for(var name in this.elements) {
        this[name] = this.$(this.elements[name]);
      }
    }

    this.applyBindings && this.applyBindings();

    return result;
  };

  // TODO
  // TODO remove stuff from subview array
  var BH = Backbone.Handlebars;

  Handlebars.registerHelper('views', function(name, models, options) {
    var callback, markers, _this = this;

    callback = function(model) {
      options.hash.model = model;
      return BH.postponeRender(name, options, _this._parentView);
    };

    markers = 'map' in models ? models.map(callback) : _.map(callback);

    if ('map' in models) {
      var parentView = options.data.view || this.parentView,
          id   = '_' + parentView.cid + '_subviews';
      markers.push('<script id="' + id + '" type="text/x-placeholder"></script>');
      parentView.listenTo(models, 'add', function(model) {
        var viewClass = _.inject((name || '').split('.'), (function(memo, fragment) {
          return memo[fragment] || false;
        }), window);
        if (!viewClass) {
          throw "Invalid view name - " + name;
        }
        options.hash.model = model;
        var view = new viewClass(options.hash);
        BH.rendered[this.cid].push(view);
        this.$('#' + id).before(view.render().el);
      });
    }

    return new Handlebars.SafeString(markers.join(''));
  });
})();

Handlebars.registerHelper('pluralize', function(value, single, plural) {
  if (!typeof plural != 'string') { plural = single + 's' }
  return value == 1 ? single : plural;
});
