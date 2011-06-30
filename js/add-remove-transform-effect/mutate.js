$(function() {
  var jDoc = $(document);

  jDoc.delegate('[data-add]', 'click', function() {
    var element = $('[data-component="container"]').append($('script[type="text/template"]').html()).find('[data-component="item"]:last');
    var height = element.height();

    element.tfx('animate', {
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
    $(this).closest('[data-component="item"]').tfx('animate', {
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

       elementToHide.tfx('overlayWith', elementToShow);
    });
});

(function($) {
  var transition = (function() {
    if (!Modernizr.csstransitions){
      return function(element, style, duration, callback) {
        element.css(style);
        element.each(callback);
      };
    }

    var t = {
      'WebkitTransition' : { prop: '-webkit-transition', event: 'webkitTransitionEnd'},
      'MozTransition'    : { prop: '-moz-transition', event: 'transitionend'},
      'OTransition'      : { prop: '-o-transition', event: 'oTransitionEnd'},
      'transition'       : { prop: 'transition', event: 'transitionEnd'}
    }[Modernizr.prefixed('transition')];

    return function(element, style, duration, callback) {
      setTimeout(function() {
        element.css(t.prop, 'all ' + duration + 's');
        element.css(style);
        element.bind(t.event, function(){
          element.css(t.prop, '');
          callback.call(this);
        });
      }, 1);
    };
  })();


  var Tfx = {
        defaultDuration: 0.5,
        transition: transition,
        registerEffect: function(name, effect) { TfxEffects[name] = effect; }
      },
      TfxEffects = {
        transition: transition,
        animate: function(element, states) {
          states.before && element.css(states.before);
          transition(element, states.transition, states.duration || Tfx.defaultDuration, function() {
            var after = states.after;
            if (after){
              switch($.type(after)){
                case 'string':
                  element[after]();
                  break;
                case 'function':
                  after.call(this);
                  break;
                default:
                  element.css(after);
              }
            }
          });
        }
      };

  $.Tfx = Tfx;

  $.fn.tfx = function(name){
    var args = $.makeArray(arguments);
    args[0] = this;
    TfxEffects[name].apply(this, args);
    return this;
  };
})(jQuery);

(function($) {
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

  $.Tfx.registerEffect('overlayWith', function(elementToHide, elementToShow, duration){
    elementToShow = $(elementToShow);

    var finishEffect = createResetCallback(2, function() {
      elementToShow.css(resetStyle);
      elementToHide.hide().css(resetStyle);
    });

    var startPosition = elementToHide.position(),
        startHeight = elementToHide.height(),
        startWidth = elementToHide.width();

    elementToShow.css('opacity', 0.0).show();

    var endHeight = elementToShow.height(),
        endWidth = elementToShow.width();

    elementToShow.tfx('animate', {
      duration: duration,
      before: {
        overflow: 'hidden',
        width: startWidth,
        height: startHeight
      },
      transition: {
        opacity: 1.0,
        width: endWidth,
        height: endHeight
      },
      after: finishEffect
    });

    elementToHide.tfx('animate', {
      before: {
        position: 'absolute',
        top: startPosition.top,
        left: startPosition.left,
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
  });
})(jQuery);
