$(function() {
  var jDoc = $(document);

  jDoc.delegate('[data-add]', 'click', function() {
    var itemHtml = $('script[type="text/template"]').html();

    $(itemHtml).tfx('insert', 'into', '[data-component="container"]');
  });

  jDoc.delegate('[data-remove]', 'click', withItem(function() {
    this.tfx('remove');
  }));

  jDoc.delegate('[data-show="form"]', 'click', withItem(function() {
    var body = this.find('[data-component="body"]');
        form = this.find('[data-component="form"]');

    body.tfx('replaceWith', form);
  }));

  jDoc.delegate('[data-show="body"]', 'click', withItem(function() {
    var body = this.find('[data-component="body"]');
        form = this.find('[data-component="form"]');

    form.tfx('replaceWith', body);
  }));

  function withItem(callback) {
    return function(e) {
      return callback.call($(this).closest('[data-component="item"]'), e);
    };
  }
});