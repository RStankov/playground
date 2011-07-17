$(function() {
  var jDoc = $(document);

  jDoc.delegate('[data-add]', 'click', function() {
    $($('script[type="text/template"]').html()).tfx('insert', 'into', '[data-component="container"]');
  });

  jDoc.delegate('[data-remove]', 'click', withItem(function() {
    this.tfx('remove');
  }));

  jDoc.delegate('[data-show="form"]', 'click', withItem(function() {
    replace.call(this, 'body', 'form');
  }));

  jDoc.delegate('[data-show="body"]', 'click', withItem(function() {
    replace.call(this, 'form', 'body');
  }));

  function withItem(callback) {
    return function(e) {
      return callback.call($(this).closest('[data-component="item"]'), e);
    };
  }

  function replace(from, to) {
    from = this.find('[data-component="' + from + '"]');
    to = this.find('[data-component="' + to + '"]');

    from.tfx('replaceWith', to);
  }
});