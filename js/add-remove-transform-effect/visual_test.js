$(function() {
  var jDoc = $(document);

  jDoc.delegate('[data-add]', 'click', function() {
    $($('script[type="text/template"]').html()).tfx('insert', 'into', '[data-component="container"]');
  });

  jDoc.delegate('[data-remove]', 'click', function() {
    $(this).closest('[data-component="item"]').tfx('remove');
  });

  jDoc.delegate('[data-show="form"]', 'click', function() {
    replace.call(this, 'body', 'form');
  });

  jDoc.delegate('[data-show="body"]', 'click', function() {
    replace.call(this, 'form', 'body');
  });

  function replace(from, to) {
    var item = $(this).closest('[data-component="item"]');

    from = item.find('[data-component="' + from + '"]');
    to = item.find('[data-component="' + to + '"]');

    from.tfx('replaceWith', to);
  }
});