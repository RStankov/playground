function $(element) {
  if (arguments.length > 1) {
    for (var i = 0, elements = [], length = arguments.length; i < length; i++){
      elements.push($(arguments[i]));
    }
    return elements;
  }
  
  Object.isString(element) && (element = document.getElementById(element));
  
  return wrap(element);
}

Element.get = $;

Element.cache = { };
var _createElement = (function() {
  var HAS_EXTENDED_CREATE_ELEMENT_SYNTAX = (function(){
    try {
      var el = document.createElement('<input name="x">');
      return el.tagName.toLowerCase() === 'input' && el.name === 'x';
    } catch(err) {
      return false;
    }
  })();

  function createElement(tagName) {
    attributes  = attributes || { };
    tagName     = tagName.toLowerCase();
    
    var cache = Element.cache;
    if (HAS_EXTENDED_CREATE_ELEMENT_SYNTAX && attributes.name) {
      tagName = '<' + tagName + ' name="' + attributes.name + '">';
      delete attributes.name;
      return document.createElement(tagName);
    }
    
    !cache[tagName] && cache[tagName] = document.createElement(tagName);
    
    return cache[tagName].cloneNode(false);
  };
  
  return createElement;
})();

if (!Node) var Node = { };
if (!Node.ELEMENT_NODE) {
  // DOM level 2 ECMAScript Language Binding
  Object.extend(Node, {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  });
}

Element.idCounter = 1;

var methods = {
  tagName: function(){
    return this.tagName.toLowerCase();
  },
  
  visible: function() {
    return this.style.display != 'none';
  },

  toggle: function(element) {
    return this[this.visible() ? 'hide' : 'show']();
  },

  hide: function() {
    this.style.display = 'none';
    return this;
  },
  
  show: function() {
    this.style.display = '';
    return this;
  },

  remove: function(element) {
    this.raw.parentNode.removeChild(this.raw);
    return this;
  },

  update: (function(){

    // see: http://support.microsoft.com/kb/276228
    var SELECT_ELEMENT_INNERHTML_BUGGY = (function(){
      var element = document.createElement("select"),
          isBuggy = true;
      element.innerHTML = "<option value=\"test\">test</option>";
      if (element.options && element.options[0]) {
        isBuggy = element.options[0].nodeName.toUpperCase() !== "OPTION";
      }
      element = null;
      return isBuggy;
    })();

    // see: http://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx
    var TABLE_ELEMENT_INNERHTML_BUGGY = (function(){
      try {
        var element = document.createElement("table");
        if (element && element.tBodies) {
          element.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
          var isBuggy = typeof element.tBodies[0] == "undefined";
          element = null;
          return isBuggy;
        }
      } catch (e) {
        return true;
      }
    })();

    var SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING = (function () {
      var s = document.createElement("script"),
          isBuggy = false;
      try {
        s.appendChild(document.createTextNode(""));
        isBuggy = !s.firstChild || s.firstChild && s.firstChild.nodeType !== 3;
      } catch (e) {
        isBuggy = true;
      }
      s = null;
      return isBuggy;
    })();

    function update(content) {
      var element = this.raw;
      
      // Purge the element's existing contents of all storage keys and
      // event listeners, since said content will be replaced no matter
      // what.
      var descendants = element.getElementsByTagName('*'),
          i           = descendants.length;
      while (i--) purgeElement(descendants[i]);
      
      content && content.toElement && (content = content.toElement());

      if (Object.isElement(content)){
        return this.update().insert(content);
      }

      content = Object.toHTML(content);

      var tagName = element.tagName.toUpperCase();

      if (tagName === 'SCRIPT' && SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING) {
        // scripts are not evaluated when updating SCRIPT element
        element.text = content;
        return this;
      }

      if ((SELECT_ELEMENT_INNERHTML_BUGGY || TABLE_ELEMENT_INNERHTML_BUGGY) && tagName in Element._insertionTranslations.tags) {
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
        Element._getContentFromAnonymousElement(tagName, content.stripScripts()).each(function(node) {
          element.appendChild(node)
        });
      } else {
        element.innerHTML = content.stripScripts();
      }

      content.evalScripts.bind(content).defer();
      
      return this;
    }

    return update;
  })(),

  replace: function(content) {
    var element = this.raw;
    if (content && 'toElement' in content){
      content = content.toElement();
    } else if (!Object.isElement(content)) {
      content = Object.toHTML(content);
      var range = element.ownerDocument.createRange();
      range.selectNode(element);
      content.evalScripts.bind(content).defer();
      content = range.createContextualFragment(content.stripScripts());
    }
    
    element.parentNode.replaceChild(content, element);
    return this;
  },

  insert: function(insertions) {
    if (Object.isString(insertions) || Object.isNumber(insertions) || Object.isElement(insertions) || (insertions && ('toElement' in insertions || 'toHTML' in insertions))){
      insertions = { bottom:insertions };
    }
          
    var element = this.raw, 
        content, insert, tagName, childNodes;

    for (var position in insertions) {
      content   = insertions[position];
      position  = position.toLowerCase();
      insert    = Element._insertionTranslations[position];

      if (content && 'toElement' in content){
        content = content.toElement();
      }
      
      if (Object.isElement(content)) {
        insert(this.raw, content);
        continue;
      }

      content = Object.toHTML(content);

      tagName = ((position == 'before' || position == 'after') ? element.parentNode : element).tagName.toUpperCase();

      childNodes = Element._getContentFromAnonymousElement(tagName, content.stripScripts());

      if (position == 'top' || position == 'after'){
        childNodes.reverse();
      }
      
      childNodes.each(insert.curry(element));

      content.evalScripts.bind(content).defer();
    }

    return element;
  },

  wrap: function(wrapper, attributes) {
    if (Object.isElement(wrapper)){
      wrapper = $(wrapper).setAttribute(attributes || { });
    } else if (Object.isString(wrapper)){
      wrapper = new Element(wrapper, attributes);
    } else {
      wrapper = new Element('div', wrapper);
    }
    
    
    if (this.raw.parentNode){
      this.raw.parentNode.replaceChild(wrapper.raw, this.wrap);
    }
    
    wrapper.raw.appendChild(this.raw);
    return wrapper;
  },

  inspect: function() {
    var result = '<' + element.raw.tagName.toLowerCase();
    
    this.raw.id         && (result += ' id='    + this.raw.id.toString().inspec(true));
    this.raw.className  && (result += ' class=' + this.raw.className.toString().inspec(true));
    
    return result + '>';
  },

  recursivelyCollect: function(property, maximumLength) {
    maximumLength = maximumLength || -1;
    
    var elements = [],
        element  = this.raw;
        
    while (element = element[property]) {
      if (element.nodeType == 1){
        elements.push(wrap(element));
      }
      
      if (elements.length == maximumLength){
        break;
      }
    }
    
    return elements;
  },

  ancestors: function() {
    return this.recursivelyCollect('parentNode');
  },

  descendants: function(element) {
    return this.select("*");
  },

  firstDescendant: function() {
    var element = this.raw.firstChild;
    
    while (element && element.nodeType != 1){
      element = element.nextSibling;
    }
    
    return wrap(element);
  },

  immediateDescendants: function() {
    var results = [],
        child   = this.raw.firstChild;

    while (child) {
      if (child.nodeType === 1) {
        results.push(wrap(child));
      }
      child = child.nextSibling;
    }

    return results;
  },

  previousSiblings: function(maximumLength) {
    return this.recursivelyCollect('previousSibling', maximumLength);
  },

  nextSiblings: function(maximumLength) {
    return this.recursivelyCollect('nextSibling', maximumLength);
  },

  siblings: function() {
    return this.previousSiblings().reverse().concat(this.nextSiblings());
  },

  match: function(selector) {
    return Object.isString(selector) ? Prototype.Selector.match(this, selector) : selector.match(this);
  },

  up: function(expression, index) {
    if (arguments.length == 0){
      return wrap(this.raw.parentNode);
    }
    
    var ancestors = this.ancestors();
    
    return Object.isNumber(expression) ? ancestors[expression] : Prototype.Selector.find(ancestors, expression, index);
  },

  down: function(expression, index) {
    if (arguments.length == 0) {
      return this.firstDescendant();
    }
    return Object.isNumber(expression) ? this.descendants()[expression] : this.select(expression)[index || 0];
  },

  previous: function(expression, index) {
    if (Object.isNumber(expression)) index = expression, expression = false;
    if (!Object.isNumber(index)) index = 0;
    
    if (expression) {
      return Prototype.Selector.find(this.previousSiblings(), expression, index);
    } else {
      return this.recursivelyCollect("previousSibling", index + 1)[index];
    }
  },

  next: function(expression, index) {
    if (Object.isNumber(expression)) index = expression, expression = false;
    if (!Object.isNumber(index)) index = 0;
    
    if (expression) {
      return Prototype.Selector.find(this.nextSiblings(), expression, index);
    } else {
      var maximumLength = Object.isNumber(index) ? index + 1 : 1;
      return this.recursivelyCollect("nextSibling", index + 1)[index];
    }
  },

  select: function() {
    return Prototype.Selector.select(Array.prototype.join.call(arguments, ', '), this);
  },

  adjacent: function() {
    return Prototype.Selector.select(Array.prototype.join.call(arguments, ', ')), this.up()).without(this);
  },

  identify: function() {
    var id = this.getAttribute('id');
    if (id) return id;
    do { id = 'anonymous_element_' + Element.idCounter++ } while ($(id));
    this.setAttribute('id', id);
    return id;
  },

  getAttribute: function(name) {
    return this.raw.getAttribute(name);
  },

  setAttribute: function(name, value) {
    var element     = this.raw,
        attributes  = { },
        t           = Element._attributeTranslations.write;

    if (typeof name == 'object'){
      attributes = name;
    } else {
      attributes[name] = Object.isUndefined(value) ? true : value;
    }

    for (var attr in attributes) {
      name  = t.names[attr] || attr;
      value = attributes[attr];
      
      if (t.values[attr]) {
        name = t.values[attr](element, value);
      }
      
      if (value === false || value === null) {
        element.removeAttribute(name);
      } else if (value === true){
        element.setAttribute(name, name);
      } else {
        element.setAttribute(name, value);
      }
    }
    
    return this;
  },

  hasAttribute: (function(){
    if (document.documentElement.hasAttribute){
      return function(attribute){
        return this.raw.hasAttribute(attribute);
      };
    }
    
    return function(attribute) {
      attribute = Element._attributeTranslations.has[attribute] || attribute;
      var node = this.raw.getAttributeNode(attribute);
      return !!(node && node.specified);
    };
  })();

  getHeight: function() {
    return this.getDimensions().height;
  },

  getWidth: function() {
    return this.getDimensions().width;
  },

  hasClassName: function(className) {
    var elementClassName = this.raw.className;
    return (elementClassName.length > 0 && (elementClassName == className || new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
  },

  addClassName: function(className) {
    if (!this.hasClassName(className)){
      this.raw.className += (this.raw.className ? ' ' : '') + className;
    }
    return this;
  },

  removeClassName: function(className) {
    this.raw.className = this.raw.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').strip();
    return this;
  },

  toggleClassName: function(className) {
    return this[this.hasClassName(className) ? 'removeClassName' : 'addClassName'](className);
  },

  cleanWhitespace: function() {
    var element = this.raw,
        node    = element.firstChild;
        
    while (node) {
      var nextNode = node.nextSibling;
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue)){
        element.removeChild(node);
      }
      node = nextNode;
    }
    
    return this;
  },

  empty: function() {
    return this.raw.innerHTML.blank();
  },

  descendantOf: function(ancestor) {
    ancestor = $(ancestor);
    
    var element = this.raw;

    if ('compareDocumentPosition' in element){
      return (element.compareDocumentPosition(ancestor) & 8) === 8;
    }

    if ('contains' in ancestor){
      return ancestor.contains(element) && ancestor !== element;
    }

    while (element = element.parentNode){
      if (element == ancestor){
        return true;
      }
    }

    return false;
  },

  scrollTo: function() {
    var pos = this.cumulativeOffset();
    window.scrollTo(pos[0], pos[1]);
    return this;
  },

  getStyle: function(style) {
    style = style == 'float' ? 'cssFloat' : style.camelize();
    
    var element = this.raw,
        value   = element.style[style];
        
    if (!value || value == 'auto') {
      var css = document.defaultView.getComputedStyle(element, null);
      value = css ? css[style] : null;
    }
    
    if (style == 'opacity') {
      return value ? parseFloat(value) : 1.0;
    }
    
    return value == 'auto' ? null : value;
  },

  getOpacity: function() {
    return this.getStyle('opacity');
  },

  setStyle: function(styles) {
    var style = this.style;

    if (Object.isString(styles)) {
      style.cssText += ';' + styles;
      return styles.include('opacity') ? this.setOpacity(styles.match(/opacity:\s*(\d?\.?\d*)/)[1]) : this;
    }

    for (var property in styles){
      if (property == 'opacity'){
        this.setOpacity(styles[property]);
      } else {
        var name = property == 'float' || property == 'cssFloat' ? Object.isUndefined(style.styleFloat) ? 'cssFloat' : 'styleFloat') : property;
        style[name] = styles[property];
      }
    }

    return this;
  },

  setOpacity: function(value) {
    this.style.opacity = (value == 1 || value === '') ? '' : (value < 0.00001) ? 0 : value;
    return this;
  },

  makePositioned: function() {
    var pos = this.getStyle('position');
    if (pos == 'static' || !pos) {
      this.raw._madePositioned = true;
      this.style.position = 'relative';
      // Opera returns the offset relative to the positioning context, when an
      // element is position relative but top and left have not been defined
      if (Prototype.Browser.Opera) {
        this.style.top = 0;
        this.style.left = 0;
      }
    }
    return this;
  },

  undoPositioned: function() {
    if (this.raw._madePositioned) {
      this.raw._madePositioned = undefined;
      var style = this.style;
      style.position = style.top = style.left = style.bottom = style.right = "";
    }
    return element;
  },

  makeClipping: function() {
    var element = this.raw;
    if (!element._overflow){
      element._overflow = this.getStyle('overflow') || 'auto';
    
      if (element._overflow !== 'hidden'){
        element.style.overflow = 'hidden';
      }
    }
    return this;
  },

  undoClipping: function() {
    var element = this.raw;
    if (element._overflow){
      element.style.overflow = element._overflow == 'auto' ? '' : element._overflow;
      element._overflow = null;
    }

    return this;
  },

  cumulativeOffset: function(element) {
    var valueT = 0, valueL = 0;
    if (element.parentNode) {
      do {
        valueT += element.offsetTop  || 0;
        valueL += element.offsetLeft || 0;
        element = element.offsetParent;
      } while (element);
    }
    return Element._returnOffset(valueL, valueT);
  },

  positionedOffset: function(element) {
    var valueT = 0, valueL = 0, element = this.raw;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
      if (element && (element.tagName.toUpperCase() == 'BODY' || Element.getStyle(element, 'position') !== 'static')){
        break;
      }
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  absolutize: function() {
    if (this.getStyle('position') != 'absolute'){
      var element = this.raw,
          style   = element.style,
          offsets = this.positionedOffset(),
          top     = offsets[1],
          left    = offsets[0],
          width   = element.clientWidth,
          height  = element.clientHeight;

      element._originalLeft   = left - parseFloat(style.left || 0);
      element._originalTop    = top  - parseFloat(style.top  || 0);
      element._originalWidth  = style.width;
      element._originalHeight = style.height;

      style.position  = 'absolute';
      style.top       = top + 'px';
      style.left      = left + 'px';
      style.width     = width + 'px';
      style.height    = height + 'px';
    }
    return this;
  },

  relativize: function() {
    if (this.getStyle('position') != 'relative'){
      var element = this.raw,
          style   = element.style,
          top     = parseFloat(style.top  || 0) - (element._originalTop || 0),
          left    = parseFloat(style.left || 0) - (element._originalLeft || 0);
      
      style.position  = 'relative';
      style.top       = top + 'px';
      style.left      = left + 'px';
      style.height    = element._originalHeight;
      style.width     = element._originalWidth;
    }
    return this;
  },

  cumulativeScrollOffset: function() {
    var valueT = 0, valueL = 0, element = this.raw;
    do {
      valueT += element.scrollTop  || 0;
      valueL += element.scrollLeft || 0;
      element = element.parentNode;
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  getOffsetParent: function() {
    var element = this.raw;
    
    if (element.offsetParent)     return wrap(element.offsetParent);
    if (element == document.body) return wrap(element);

    while ((element = element.parentNode) && element != document.body){
      if (Element.getStyle(element, 'position') != 'static'){
        return wrap(element);
      }
    }

    return wrap(document.body);
  },

  viewportOffset: function() {
    var valueT = 0, 
        valueL = 0,
        element = this.raw;
        
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;

      // Safari fix
      if (element.offsetParent == document.body && Element.getStyle(element, 'position') == 'absolute'){
        break;
      }
    } while (element = element.offsetParent);

    element = this.raw;
    do {
      if (!Prototype.Browser.Opera || (element.tagName && (element.tagName.toUpperCase() == 'BODY'))) {
        valueT -= element.scrollTop  || 0;
        valueL -= element.scrollLeft || 0;
      }
    } while (element = element.parentNode);

    return Element._returnOffset(valueL, valueT);
  },

  clonePosition: function(source, options) {
    source  = $(source);
    options = Object.extend({
      setLeft:    true,
      setTop:     true,
      setWidth:   true,
      setHeight:  true,
      offsetTop:  0,
      offsetLeft: 0
    }, options || { });


    var position  = source.viewportOffset(),
        delta     = [0, 0],
        parent    = null;

    // delta [0,0] will do fine with position: fixed elements,
    // position:absolute needs offsetParent deltas
    if (this.getStyle('position') == 'absolute') {
      parent = this.getOffsetParent();
      delta  = parent.viewportOffset(parent);
    }

    // correct by body offsets (fixes Safari)
    if (parent == document.body) {
      delta[0] -= document.body.offsetLeft;
      delta[1] -= document.body.offsetTop;
    }

    // set position
    if (options.setLeft)   this.style.left    = (position[0] - delta[0] + options.offsetLeft) + 'px';
    if (options.setTop)    this.style.top     = (position[1] - delta[1] + options.offsetTop) + 'px';
    if (options.setWidth)  this.style.width   = source.raw.offsetWidth + 'px';
    if (options.setHeight) this.style.height  = source.raw.offsetHeight + 'px';

    return this;
  }
};

methods = methods.select;
methods = childElements.immediateDescendants;

Element._attributeTranslations = {
  write: {
    names: {
      className: 'class',
      htmlFor:   'for'
    },
    values: { }
  }
};

Element._returnOffset = function(l, t) {
  var result = [l, t];
  result.left = l;
  result.top = t;
  return result;
};

Element._getContentFromAnonymousElement = function(tagName, html) {
  var div = new Element('div'), 
      t   = Element._insertionTranslations.tags[tagName];
      
  if (t) {
    div.innerHTML = t[0] + html + t[1];
    for (var i = t[2]; i--; ) {
      div = div.firstChild;
    }
  } else {
    div.innerHTML = html;
  }
  return $A(div.childNodes);
};

Element._insertionTranslations = {
  before: function(element, node) {
    element.parentNode.insertBefore(node, element);
  },
  top: function(element, node) {
    element.insertBefore(node, element.firstChild);
  },
  bottom: function(element, node) {
    element.appendChild(node);
  },
  after: function(element, node) {
    element.parentNode.insertBefore(node, element.nextSibling);
  },
  tags: {
    TABLE:  ['<table>',                '</table>',                   1],
    TBODY:  ['<table><tbody>',         '</tbody></table>',           2],
    TR:     ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
    TD:     ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
    SELECT: ['<select>',               '</select>',                  1]
  }
};

(function() {
  var tags = Element._insertionTranslations.tags;
  Object.extend(tags, {
    THEAD: tags.TBODY,
    TFOOT: tags.TBODY,
    TH:    tags.TD
  });
})();

//= require "sniff"

Element.addMethods(methods);
