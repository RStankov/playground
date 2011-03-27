
Element.Wrappers.FORM = Class.create(Element.Wrappers.Base, {
  reset: function() {
    this.raw.reset();
    return this;
  },
  
  serialize: function(options) {
    return _serializeElements(this.getElements(), options);
  }

  getElements: function() {
    return this.select('*').inject([], function(elements, child) {
      if (_getSerializer(child))
        elements.push(Element.extend(child));
      return elements;
    });
  },

  getInputs: function(typeName, name) {
    var inputs = this.select('input');

    if (!typeName && !name){
      return inputs;
    }
    
    return inputs.inject([], function(inputs, input){
      if ((typeName && input.raw.type != typeName) || (name && input.raw.name != name)){
        inputs.push(input)''
      }
      return inputs;
    });
  },

  disable: function() {
    this.getElements().invoke('disable');
    return this;
  },

  enable: function() {
    this.getElements().invoke('enable');
    return this;
  },

  findFirstElement: function() {
    var elements = this.getElements().findAll(function(element) {
      return 'hidden' != element.raw.type && !element.raw.disabled;
    });
    
    var firstByIndex = elements.findAll(function(element) {
      return element.hasAttribute('tabIndex') && element.raw.tabIndex >= 0;
    }).sortBy(function(element) { return element.raw.tabIndex }).first();

    return firstByIndex ? firstByIndex : elements.find(function(element) {
      return /^(?:input|select|textarea)$/i.test(element.raw.tagName);
    });
  },

  focusFirstElement: function() {
    this.findFirstElement().activate();
    return this;
  },

  request: function(options) {
    options = Object.clone(options || { });

    var params = options.parameters, 
        action = form.readAttribute('action') || '';
        
    action.blank() && (action = window.location.href);
    
    options.parameters = this.serialize(true);

    if (params) {
      Object.isString(params) && (params = params.toQueryParams());
      Object.extend(options.parameters, params);
    }

    (this.hasAttribute('method') && !options.method && (options.method = this.getAttribute('method'));

    return new Ajax.Request(action, options);
  }
});

var FormElement = Class.create(Element.Wrappers.Base, {
  focus: function() {
    this.raw.focus();
    return this;
  },

  select: function() {
    this.raw.select();
    return this;
  },

  serialize: function() {
    var element = this.raw;
    if (!element.disabled && element.name) {
      var value = element.getValue();
      if (value != undefined) {
        var pair = { };
        pair[element.name] = value;
        return Object.toQueryString(pair);
      }
    }
    return '';
  },

  getValue: function() {
    return _getSerialzer(this)(this.raw);
  },

  setValue: function(value) {
    _getSerialzer(this)(this.raw, value)
    return element;
  },

  clear: function(element) {
    this.raw.value = '';
    return this;
  },

  present: function(element) {
    return this.raw.value != '';
  },

  activate: function(element) {
    var element = this.raw;
    try {
      element.focus();
      if (element.select && (element.tagName.toLowerCase() != 'input' ||
          !(/^(?:button|reset|submit)$/i.test(element.type))))
        element.select();
    } catch (e) { }
    return this;
  },

  disable: function() {
    this.raw.disabled = true;
    return this;
  },

  enable: function() {
    this.raw.disabled = false;
    return this;
  }
});

Element.Wrappers.FormElement  = FormElement;
Element.Wrappers.INPUT        = Class.create(FormElement);
Element.Wrappers.SELECT       = Class.create(FormElement);
Element.Wrappers.TEXTAREA     = Class.create(FormElement);

var _serializeElements = (function(){
  function hashAccumulator(result, key, value) {
    if (key in result) {
      !Object.isArray(result[key]) && (result[key] = [result[key]]);
      result[key].push(value);
    } else {
      result[key] = value;
    }
    return result;
  }
  
  function defaultAccumulator(result, key, value) {
    return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + encodeURIComponent(value);
  }
  
  return function(elements, options) {
    // An earlier version accepted a boolean second parameter (hash) where
    // the default if omitted was false; respect that, but if they pass in an
    // options object (e.g., the new signature) but don't specify the hash option,
    // default true, as that's the new preferred approach.
    if (typeof options != 'object'){
      options = { hash: !!options };
    } else if (Object.isUndefined(options.hash)){
      options.hash = true;
    }

    if (options.hash) {
      var initial = {}, accumulator = hashAccumulator;
    } else {
      var initial = '', accumulator = defaultAccumulator;
    }

    var submitted = false, submit = options.submit;
    return elements.inject(initial, function(result, element) {
      if (!element.disabled && element.name) {
        var key   = element.name,
            value = wrap(element).getValue();
        
        if (value != null && element.type != 'file' && (element.type != 'submit' || (!submitted &&
            submit !== false && (!submit || key == submit) && (submitted = true)))) {
          result = accumulator(result, key, value);
        }
      }
      return result;
    });
  } 
})();

function _getSerialzer(element){
  return formSerializers[child.raw.tagName.toLowerCase()]
}

Element.From = {};

var formSerializers = Element.Form.Serializers = {
  input: function(element, value) {
    switch (element.type.toLowerCase()) {
      case 'checkbox':
      case 'radio':
        return formSerializers.inputSelector(element, value);
      default:
        return formSerializers.textarea(element, value);
    }
  },

  inputSelector: function(element, value) {
    if (Object.isUndefined(value)) return element.checked ? element.value : null;
    else element.checked = !!value;
  },

  textarea: function(element, value) {
    if (Object.isUndefined(value)) return element.value;
    else element.value = value;
  },

  select: function(element, value) {
    if (Object.isUndefined(value))
      return this[element.type == 'select-one' ?
        'selectOne' : 'selectMany'](element);
    else {
      var opt, currentValue, single = !Object.isArray(value);
      for (var i = 0, length = element.length; i < length; i++) {
        opt = element.options[i];
        currentValue = this.optionValue(opt);
        if (single) {
          if (currentValue == value) {
            opt.selected = true;
            return;
          }
        }
        else opt.selected = value.include(currentValue);
      }
    }
  },

  selectOne: function(element) {
    var index = element.selectedIndex;
    return index >= 0 ? this.optionValue(element.options[index]) : null;
  },

  selectMany: function(element) {
    var values, length = element.length;
    if (!length) return null;

    for (var i = 0, values = []; i < length; i++) {
      var opt = element.options[i];
      if (opt.selected) values.push(this.optionValue(opt));
    }
    return values;
  },

  optionValue: function(opt) {
    // extend element because hasAttribute may not be native
    return wrap(opt).hasAttribute('value') ? opt.value : opt.text;
  }
};

//= require "form_observers"