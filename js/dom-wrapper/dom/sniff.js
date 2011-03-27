if (Prototype.Browser.Opera) {
  methods.getStyle = methods.getStyle.wrap(function(proceed, style) {
    switch (style) {
      case 'left': case 'top': case 'right': case 'bottom':
        if (proceed('position') === 'static') return null;
      case 'height': case 'width':
        // returns '0px' for hidden elements; we want it to return null
        if (!this.visible()) return null;

        // returns the border-box dimensions rather than the content-box
        // dimensions, so we subtract padding and borders from the value
        var dim = parseInt(proceed(element, style), 10);
        if (dim !== this.raw['offset' + style.capitalize()]){
          return dim + 'px';
        }
        
        var self        = this,
            properties  = style === 'height' ? 
              ['border-top-width', 'padding-top', 'padding-bottom', 'border-bottom-width'] : 
              ['border-left-width', 'padding-left', 'padding-right', 'border-right-width'] ;
        
        return properties.inject(dim, function(memo, property) {
          var val = proceed.call(self, property);
          return val === null ? memo : memo - parseInt(val, 10);
        }) + 'px';
      default:
        return proceed(style);
    }
  });

  methods.getAttribute = methods.getAttribute.wrap(function(proceed, attribute) {
    return attribute === 'title' ? this.raw.title : proceed(attribute);
  });
} else if (Prototype.Browser.IE) {
  // IE doesn't report offsets correctly for static elements, so we change them
  // to "relative" to get the values, then change them back.
  methods.getOffsetParent = methods.getOffsetParent.wrap(function(proceed) {
    // IE throws an error if element is not in document
    if (!this.raw.parentNode){
      return wrap(document.body);
    }

    var position = this.getStyle('position');
    if (position !== 'static'){
      return proceed();
    }
    
    this.setStyle({ position: 'relative' });
    var value = proceed();
    this.setStyle({ position: position });
    
    return value;
  });

  $w('positionedOffset viewportOffset').each(function(method) {
    methods[method] = methods[method].wrap(function(proceed) {
      if (!this.raw.parentNode){
        return Element._returnOffset(0, 0);
      }
      
      var position = this.getStyle('position');
      if (position !== 'static'){
        return proceed(element);
      }
      
      // Trigger hasLayout on the offset parent so that IE6 reports
      // accurate offsetTop and offsetLeft values for position: fixed.
      var offsetParent = this.getOffsetParent();
      if (offsetParent && offsetParent.getStyle('position') === 'fixed'){
        offsetParent.setStyle({ zoom: 1 });
      }
      
      this.setStyle({ position: 'relative' });
      var value = proceed();
      this.setStyle({ position: position });

      return value;
    });
  });

  methods.getStyle = function(style) {
    style = (style == 'float' || style == 'cssFloat') ? 'styleFloat' : style.camelize();
    
    var element = this.raw,
        value   = element.style[style];
        
    if (!value && element.currentStyle){
      value = element.currentStyle[style];
    }

    if (style == 'opacity') {
      value = (this.getStyle('filter') || '').match(/alpha\(opacity=(.*)\)/);
      return value && value[1] ? parseFloat(value[1]) / 100 : 1.0;
    }

    if (value == 'auto') {
      if ((style == 'width' || style == 'height') && (thi.getStyle('display') != 'none')){
        return element['offset' + style.capitalize()] + 'px';
      }
      return null;
    }
    return value;
  };

  methods.getAttribute = function(name){
    var t = Element._attributeTranslations.read;
    if (t.values[name]){
      return t.values[name](this.raw, name);
    }
  
    if (t.names[name]){
      name = t.names[name];
    }
  
    if (name.include(':')) {
      var attributes = this.raw.attributes
    
      return attributes && name in attributes ? attributes[name].value : null;
    }
    return this.raw.getAttribute(name);
  };

  methods.setOpacity = (function(){
    function stripAlpha(filter){
      return filter.replace(/alpha\([^\)]*\)/gi,'');
    }
    
    return function(value){
      var element       = this.raw,
          currentStyle  = element.currentStyle,
          style         = element.style;
          
      if ((currentStyle && !currentStyle.hasLayout) || (!currentStyle && style.zoom == 'normal'))
          style.zoom = 1;

      var filter = this.getStyle('filter');
      if (value == 1 || value === '') {
        (filter = stripAlpha(filter)) ? style.filter = filter : style.removeAttribute('filter');
        return this;
      }
      
      if (value < 0.00001){
        value = 0;
      }

      style.filter = stripAlpha(filter) + 'alpha(opacity=' + (value * 100) + ')';
            
      return this;
    };
  })();

  Element._attributeTranslations = (function(){
    var classProp   = 'className', 
        forProp     = 'for', 
        el          = document.createElement('div');

    // try "className" first (IE <8)
    el.setAttribute(classProp, 'x');

    if (el.className !== 'x') {
      // try "class" (IE 8)
      el.setAttribute('class', 'x');
      if (el.className === 'x') {
        classProp = 'class';
      }
    }
    el = null;

    el = document.createElement('label');
    el.setAttribute(forProp, 'x');
    if (el.htmlFor !== 'x') {
      el.setAttribute('htmlFor', 'x');
      if (el.htmlFor === 'x') {
        forProp = 'htmlFor';
      }
    }
    el = null;

    return {
      read: {
        names: {
          'class':      classProp,
          'className':  classProp,
          'for':        forProp,
          'htmlFor':    forProp
        },
        values: {
          _getAttr: function(element, attribute) {
            return element.getAttribute(attribute);
          },
          _getAttr2: function(element, attribute) {
            return element.getAttribute(attribute, 2);
          },
          _getAttrNode: function(element, attribute) {
            var node = element.getAttributeNode(attribute);
            return node ? node.value : "";
          },
          _getEv: (function(){

            var el = document.createElement('div'), f;
            el.onclick = Prototype.emptyFunction;
            var value = el.getAttribute('onclick');

            // IE<8
            if (String(value).indexOf('{') > -1) {
              // intrinsic event attributes are serialized as `function { ... }`
              f = function(element, attribute) {
                attribute = element.getAttribute(attribute);
                if (!attribute) return null;
                attribute = attribute.toString();
                attribute = attribute.split('{')[1];
                attribute = attribute.split('}')[0];
                return attribute.strip();
              };
            }
            // IE8
            else if (value === '') {
              // only function body is serialized
              f = function(element, attribute) {
                attribute = element.getAttribute(attribute);
                if (!attribute) return null;
                return attribute.strip();
              };
            }
            el = null;
            return f;
          })(),
          _flag: function(element, attribute) {
            return wrap(element).hasAttribute(attribute) ? attribute : null;
          },
          style: function(element) {
            return element.style.cssText.toLowerCase();
          },
          title: function(element) {
            return element.title;
          }
        }
      }
    }
  })();

  Element._attributeTranslations.write = {
    names: Object.extend({
      cellpadding: 'cellPadding',
      cellspacing: 'cellSpacing'
    }, Element._attributeTranslations.read.names),
    values: {
      checked: function(element, value) {
        element.checked = !!value;
      },

      style: function(element, value) {
        element.style.cssText = value ? value : '';
      }
    }
  };

  Element._attributeTranslations.has = {};

  $w('colSpan rowSpan vAlign dateTime accessKey tabIndex ' +
      'encType maxLength readOnly longDesc frameBorder').each(function(attr) {
    Element._attributeTranslations.write.names[attr.toLowerCase()] = attr;
    Element._attributeTranslations.has[attr.toLowerCase()] = attr;
  });

  (function(v) {
    Object.extend(v, {
      href:        v._getAttr2,
      src:         v._getAttr2,
      type:        v._getAttr,
      action:      v._getAttrNode,
      disabled:    v._flag,
      checked:     v._flag,
      readonly:    v._flag,
      multiple:    v._flag,
      onload:      v._getEv,
      onunload:    v._getEv,
      onclick:     v._getEv,
      ondblclick:  v._getEv,
      onmousedown: v._getEv,
      onmouseup:   v._getEv,
      onmouseover: v._getEv,
      onmousemove: v._getEv,
      onmouseout:  v._getEv,
      onfocus:     v._getEv,
      onblur:      v._getEv,
      onkeypress:  v._getEv,
      onkeydown:   v._getEv,
      onkeyup:     v._getEv,
      onsubmit:    v._getEv,
      onreset:     v._getEv,
      onselect:    v._getEv,
      onchange:    v._getEv
    });
  })(Element._attributeTranslations.read.values);

  // We optimize Element#down for IE so that it does not call
  // Element#descendants (and therefore extend all nodes).
  if (Prototype.BrowserFeatures.ElementExtensions) {
    (function() {
      function _descendants(element) {
        var nodes = element.getElementsByTagName('*'), results = [];
        for (var i = 0, node; node = nodes[i]; i++)
          if (node.tagName !== "!") // Filter out comment nodes.
            results.push(node);
        return results;
      }

      methods.down = function(element, expression, index) {
        element = $(element);
        if (arguments.length == 1) return element.firstDescendant();
        return Object.isNumber(expression) ? _descendants(element)[expression] :
          Element.select(element, expression)[index || 0];
      }
    })();
  }

} else if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
  methods.setOpacity = function(value) {
    this.style.opacity = (value == 1) ? 0.999999 : (value === '') ? '' : (value < 0.00001) ? 0 : value;
    return this;
  };
} else if (Prototype.Browser.WebKit) {
  methods.setOpacity = function(value) {
    style.opacity = (value == 1 || value === '') ? '' : (value < 0.00001) ? 0 : value;

    var element = this.raw;
    if (value == 1)
      if (element.tagName.toUpperCase() == 'IMG' && element.width) {
        element.width++; element.width--;
      } else try {
        var n = document.createTextNode(' ');
        element.appendChild(n);
        element.removeChild(n);
      } catch (e) { }

    return this;
  };

  // Safari returns margins on body which is incorrect if the child is absolutely
  // positioned.  For performance reasons, redefine Element#cumulativeOffset for
  // KHTML/WebKit only.
  methods.cumulativeOffset = function() {
    var valueT = 0, valueL = 0, element = this.raw;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      if (element.offsetParent == document.body)
        if (Element.getStyle(element, 'position') == 'absolute') break;

      element = element.offsetParent;
    } while (element);

    return Element._returnOffset(valueL, valueT);
  };
}

if ('outerHTML' in document.documentElement) {
  methods.replace = function(content) {
    var element = this.raw;

    if (content && content.toElement){
      content = content.toElement();
    }
    
    if (Object.isElement(content)) {
      element.parentNode.replaceChild(content, element);
      return this;
    }

    content = Object.toHTML(content);
    
    var parent = element.parentNode, 
        tagName = parent.tagName.toUpperCase();

    if (Element._insertionTranslations.tags[tagName]) {
      var nextSibling = element.next(),
          fragments   = Element._getContentFromAnonymousElement(tagName, content.stripScripts());
      
      parent.removeChild(element);
      
      fragments.each(nextSibling ? 
        function(node) { parent.insertBefore(node, nextSibling) } :
        function(node) { parent.appendChild(node) }
      );
    } else {
      element.outerHTML = content.stripScripts();
    }

    content.evalScripts.bind(content).defer();
    return this;
  };
}
