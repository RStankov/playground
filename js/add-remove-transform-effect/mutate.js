$(function() {
  var jDoc = $(document);

  jDoc.delegate('[data-add]', 'click', function() {
    var element = $('[data-component="container"]').append($('script[type="text/template"]').html()).find('[data-component="item"]:last');
    var height = element.height();

    element.css({
      overflow: 'hidden',
      opacity: 0,
      height: 0
    });

    element.animate({
      opacity: 1,
      height: height
    }, function() {
      element.css({
        overflow: '',
        opacity: '',
        height: ''
      });
    });
  });

  jDoc.delegate('[data-remove]', 'click', function() {
    $(this).closest('[data-component="item"]').remove();
  });

  jDoc.delegate('[data-show]', 'click', function() {
    var element = $(this),
        item = element.closest('[data-component="item"]'),
        toggle = {
          form: 'body',
          body: 'form'
        },
        show = element.data('show'),
        hide = toggle[show],
        elementToShow = item.find('[data-component="' + show + '"]'),
        elementToHide = item.find('[data-component="' + hide + '"]');

        elementToShow.show();
        elementToHide.hide();
    });
});
