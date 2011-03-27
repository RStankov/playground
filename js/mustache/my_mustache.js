var Mustache = (function(){
  function isArray(object){
    return Array.isArray(object);
  }

  function extend(object, source){
    for(var key in source){
      if (source.hasOwnProperty(key)){
        object[key] = source[key]
      }
    }
    return object;
  }

  function newContext(data, context){
    return extend(extend({}, context), data);
  }

  var newLnRe   = /\n/g,
      splitRe   = /({{2,3}[^{#\/]*}})/,
      tagRe     = /^{{([^{]*)}}/,
      escapedRe = /^{{{([^{]*)}}}/,
      contextRe = /{{#(.*)}}(.*){{\/\1}}/g;

  function compile(template){
    template = template.replace(newLnRe, "");
    template = template.split(splitRe);
    template = template.map(function(value){
      if (!tagRe.test(value) && !escapedRe.test(value)){
        return "'" + value.replace(/'/g, "\\'") + "'";
      }

      value = value.replace(escapedRe, function(_, match){
        return "this.value(data['" + match + "'])";
      });

      value = value.replace(tagRe, function(_, match){
        return "this.escape(this.value(data['" + match + "']))";
      });

      return value;
    });
    template = template.join(" + ");
    template = template.replace(contextRe, function(_, tag, content){
      return "' + this.context(data['" + tag + "'], data, function(data){return '" + content + "';}) + '";
    });

    return template;
  }

  function Mustache(template){
    this.render = new Function("data", "return " + compile(template) + ";");
    this.render.name = "mustacheRender";
  }

  Mustache.prototype = {
    escape: function(s){
      return String(s === null ? "" : s).replace(/&(?!\w+;)|["'<>\\]/g, function(s){
        switch(s) {
          case "&":  return "&amp;";
          case "\\": return "\\\\";
          case '"':  return '&quot;';
          case "'":  return '&#39;';
          case "<":  return "&lt;";
          case ">":  return "&gt;";
          default:   return s;
        }
      });
    },
    value: function(value){
      typeof value == "function"  && (value = value());
      typeof value == "undefined" && (value = "");

      return value;
    },
    context: function(data, context, func){
      content = "";

      if (isArray(data)){
        for(var i=0, l=data.length; i<l; i++){
          content += func.call(this, newContext(data[i], context));
        }
      } else if (data){
        content += func.call(this, newContext(data, context));
      }

      return content;
    }
  };

  return Mustache;
})();
