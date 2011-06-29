$(function() {
  var jDoc = $(document);

  jDoc.delegate('[data-add]', 'click', function() {
    var element = $('[data-component="container"]').append($('script[type="text/template"]').html()).find('[data-component="item"]:last');
    var height = element.height();

    element.mutateCss({
      before: {
        overflow: 'hidden',
        opacity: 0,
        height: 0
      },
      transition: {
        opacity: 1,
        height: height
      },
      after: {
        overflow: '',
        opacity: '',
        height: ''
      }
    });
  });

  jDoc.delegate('[data-remove]', 'click', function() {
    $(this).closest('[data-component="item"]').mutateCss({
      duration: 0.3,
      before: {
        overflow: 'hidden'
      },
      transition: {
        height: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        opacity: 0
      },
      after: 'remove'
    });
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

       elementToShow.mutateTo(elementToHide);
    });
});

(function($) {
  $.fn.transitionTo = Modernizr.csstransitions ? withTransition : withoutTransition;

  var transition = {
        'WebkitTransition' : { prop: '-webkit-transition', event: 'webkitTransitionEnd'},
        'MozTransition'    : { prop: '-moz-transition', event: 'transitionend'},
        'OTransition'      : { prop: '-o-transition', event: 'oTransitionEnd'},
        'transition'       : { prop: 'transition', event: 'transitionEnd'}
      }[Modernizr.prefixed('transition')];

  function withTransition(style, duration, callback) {
    var self = this;
    setTimeout(function() {
      self.css(transition.prop, 'all ' + duration + 's');
      self.css(style);
      self.bind(transition.event, function(){
        $(this).css(transition.prop, '');
        callback.call(this);
      });
    }, 1);
    return this;
  }

  function withoutTransition(style, callback) {
    this.css(style);
    this.each(callback);
    return this;
  }
})(jQuery);

(function($) {
  $.fn.mutateCss = function(states){
    states.before && this.css(states.before);
    this.transitionTo(states.transition, states.duration || 0.5, function() {
      var after = states.after;
      if (after){
        switch($.type(after)){
          case 'string':
            $(this)[after]();
            break;
          case 'function':
            after.call(this);
            break;
          default:
            $(this).css(after);
        }
      }
    });
    return this;
  };
})(jQuery);

(function($) {
  $.fn.mutateTo = function(element, duration) {
    mutate(this, $(element), duration || 0.5);
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
    height: '',
  };

  function mutate(elementToShow, elementToHide, duration) {
    var finishEffect = createResetCallback(2, function() {
      elementToShow.css(resetStyle);
      elementToHide.hide().css(resetStyle);
    });

    var startPosition = elementToHide.position(),
        startHeight = elementToHide.outerHeight(),
        startWidth = elementToHide.outerWidth();

    elementToShow.css('opacity', 0.0).show();

    var endHeight = elementToShow.outerHeight(),
        endWidth = elementToShow.outerWidth()

    elementToShow.mutateCss({
      duration: duration,
      before: {
        overflow: 'hidden',
        position: 'absolute',
        top: startPosition.top,
        left: startPosition.left,
        width: startWidth,
        height: startHeight,
      },
      transition: {
        opacity: 1.0,
        width: endWidth,
        height: endHeight,
      },
      after: finishEffect
    });

    elementToHide.mutateCss({
      before: {
        overflow: 'hidden',
        width: startWidth,
        height: startHeight
      },
      transition: {
        opacity: 0.0,
        width: endWidth,
        height: endHeight
      },
      after: finishEffect
    });
  }
})(jQuery);
