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
    
    element.withTransition({
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
    $(this).closest('[data-component="item"]').css('overflow', 'hidden').animate({
      height: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      opacity: 0
    }, 'fast', function() { $(this).remove(); });
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

       elementToShow.mutateTo(elementToHide, 'fast');
    });
});

(function($) {
  $.fn.withTransition = Modernizr.csstransitions ? withTransition : withoutTransition;

  var transition = {
        'WebkitTransition' : { prop: '-webkit-transition', event: 'webkitTransitionEnd'},
        'MozTransition'    : { prop: '-moz-transition', event: 'transitionend'},
        'OTransition'      : { prop: '-o-transition', event: 'oTransitionEnd'},
        'transition'       : { prop: 'transition', event: 'transitionEnd'}
      }[Modernizr.prefixed('transition')];

  function withTransition(style, callback) {
    this.css(transition.prop, 'all 0.5s');
    this.css(style);
    this.bind(transition.event, function(){
      $(this).css(transition.prop, '');
      callback.call(this);
    });
    return this;
  }

  function withoutTransition(style, callback) {
    this.css(style);
    this.each(callback);
    return this;
  }
})(jQuery);

(function($) {
  $.fn.mutateTo = function(element, speed) {
    mutate(this, $(element), speed || 'fast');
    return this;
  };

  function createResetCallback(counter, callback) {
    return function() {
      counter -= 1;
      if (counter == 0) {
        callback();
      }
    };
  }

  var resetStyle = {
    position: '',
    top: '',
    left: '',
    overflow: '',
    opacity: '',
    width: '',
    height: ''
  };

  function mutate(elementToShow, elementToHide, speed) {
    var finishEffect = createResetCallback(2, function() {
      elementToShow.css(resetStyle);
      elementToHide.hide().css(resetStyle);
    });

    var startPosition = elementToHide.position(),
        startHeight = elementToHide.outerHeight(),
        startWidth = elementToHide.outerWidth();

    elementToShow.css('opacity', 0.0).show();

    var endHeight = elementToShow.outerHeight(),
        endWidth = elementToShow.outerWidth();

    elementToShow.css({
      overflow: 'hidden',
      position: 'absolute',
      top: startPosition.top,
      left: startPosition.left,
      width: startWidth,
      height: startHeight
    });
    elementToShow.animate({
      opacity: 1.0,
      width: endWidth,
      height: endHeight
    }, speed, finishEffect);

    elementToHide.css('overflow', 'hidden');
    elementToHide.animate({
      opacity: 0.0,
      width: endWidth,
      height: endHeight
    }, speed, finishEffect);
  }
})(jQuery);
