Element.From.AbstarctTimedObserver = Class.create(PeriodicalExecuter, {
  initialize: function($super, element, frequency, callback) {
    $super(callback, frequency);
    this.element   = $(element);
    this.lastValue = this.getValue();
  },

  execute: function() {
    var value = this.getValue();
    if (Object.isString(this.lastValue) && Object.isString(value) ? this.lastValue != value : String(this.lastValue) != String(value)) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  }
});

Element.From.AbstarctEventObserver = Class.create({
  initialize: function(element, callback) {
    this.element  = $(element);
    this.callback = callback;

    this.lastValue = this.getValue();
    if (this.element.tagName() == 'form')
      this.registerFormCallbacks();
    else
      this.registerCallback(this.element);
  },

  onElementEvent: function() {
    var value = this.getValue();
    if (this.lastValue != value) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  },

  registerFormCallbacks: function() {
    this.element.getElements().each(this.registerCallback, this);
  },

  registerCallback: function(element) {
    if (element.getAttribute('type')) {
      switch (element.getAttribute('type')) {
        case 'checkbox':
        case 'radio':
          Event.observe(element, 'click', this.onElementEvent.bind(this));
          break;
        default:
          Event.observe(element, 'change', this.onElementEvent.bind(this));
          break;
      }
    }
  }
});


Element.From.ElementObserver = Class.create(Element.From.AbstarctTimedObserver, {
  getValue: function() {
    return this.element.getValue();
  }
});

Element.From.FormObserver = Class.create(Element.From.AbstarctTimedObserver, {
  getValue: function() {
    return this.element.serialize();
  }
});

Element.From.ElementEventObserver = Class.create(Element.From.AbstarctEventObserver, {
  getValue: function() {
    return this.element.getValue();
  }
});

Element.From.FormEventObserver = Class.create(Element.From.AbstarctEventObserver, {
  getValue: function() {
    return this.element.serialize();
  }
});
