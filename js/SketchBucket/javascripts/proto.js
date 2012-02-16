(function(){
  function notOverwriteExtend(destination, source){
    for (var property in source){
      if (!property in destination){
        destination[property] = source[property];
      }
    }
    return destination;
  }
  
  notOverwriteExtend(Object, (function() {
    var _toString    = Object.prototype.toString,
        NUMBER_CLASS = '[object Number]',
        STRING_CLASS = '[object String]';

    function isElement(object) {
      return !!(object && object.nodeType == 1);
    }

    function isString(object) {
      return _toString.call(object) === STRING_CLASS;
    }

    function isNumber(object) {
      return _toString.call(object) === NUMBER_CLASS;
    }

    function isUndefined(object) {
      return typeof object === "undefined";
    }
    
    var hasNativeIsArray = (typeof Array.isArray == 'function') && Array.isArray([]) && !Array.isArray({});

    return {
      extend:        jQuery.extend,
      isElement:     isElement,
      isArray:       hasNativeIsArray ? Array.isArray : jQuery.isArray,
      isFunction:    jQuery.isFunction,
      isString:      isString,
      isNumber:      isNumber,
      isUndefined:   isUndefined
    });
  })();
  
  notOverwriteExtend(Function.prototype, (function() {
    var slice = Array.prototype.slice;

    function update(array, args) {
      var arrayLength = array.length, length = args.length;
      while (length--) array[arrayLength + length] = args[length];
      return array;
    }

    function merge(array, args) {
      array = slice.call(array, 0);
      return update(array, args);
    }

    function bind(context) {
      if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
      var __method = this, args = slice.call(arguments, 1);
      return function() {
        var a = merge(args, arguments);
        return __method.apply(context, a);
      }
    }

    function curry() {
      if (!arguments.length) return this;
      var __method = this, args = slice.call(arguments, 0);
      return function() {
        var a = merge(args, arguments);
        return __method.apply(this, a);
      }
    }

    function delay(timeout) {
      var __method = this, args = slice.call(arguments, 1);
      timeout = timeout * 1000;
      return window.setTimeout(function() {
        return __method.apply(__method, args);
      }, timeout);
    }

    function defer() {
      var args = update([0.01], arguments);
      return this.delay.apply(this, args);
    }

    function wrap(wrapper) {
      var __method = this;
      return function() {
        var a = update([__method.bind(this)], arguments);
        return wrapper.apply(this, a);
      }
    }

    function methodize() {
      if (this._methodized) return this._methodized;
      var __method = this;
      return this._methodized = function() {
        var a = update([this], arguments);
        return __method.apply(null, a);
      };
    }

    return {
      bind:                bind,
      curry:               curry,
      delay:               delay,
      defer:               defer,
      wrap:                wrap,
      methodize:           methodize
    }
  })());

  RegExp.prototype.match = RegExp.prototype.test;

  RegExp.escape = function(str) {
    return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  };
 
  notOverwriteExtend(String.prototype, (function() {
    function prepareReplacement(replacement) {
      if (Object.isFunction(replacement)) return replacement;
      var template = new Template(replacement);
      return function(match) { return template.evaluate(match) };
    }

    function gsub(pattern, replacement) {
      var result = '', source = this, match;
      replacement = prepareReplacement(replacement);

      if (Object.isString(pattern))
        pattern = RegExp.escape(pattern);

      if (!(pattern.length || pattern.source)) {
        replacement = replacement('');
        return replacement + source.split('').join(replacement) + replacement;
      }

      while (source.length > 0) {
        if (match = source.match(pattern)) {
          result += source.slice(0, match.index);
          result += replacement(match) == null ? '' : String(replacement(match));
          source  = source.slice(match.index + match[0].length);
        } else {
          result += source, source = '';
        }
      }
      return result;
    }

    function sub(pattern, replacement, count) {
      replacement = prepareReplacement(replacement);
      count = Object.isUndefined(count) ? 1 : count;

      return this.gsub(pattern, function(match) {
        if (--count < 0) return match[0];
        return replacement(match);
      });
    }

    function scan(pattern, iterator) {
      this.gsub(pattern, iterator);
      return String(this);
    }

    function truncate(length, truncation) {
      length = length || 30;
      truncation = Object.isUndefined(truncation) ? '...' : truncation;
      return this.length > length ?
        this.slice(0, length - truncation.length) + truncation : String(this);
    }

    function strip() {
      return this.replace(/^\s+/, '').replace(/\s+$/, '');
    }

    function stripTags() {
      return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
    }

    function escapeHTML() {
      return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function unescapeHTML() {
      return this.stripTags().replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
    }

    function toQueryParams(separator) {
      var match = this.strip().match(/([^?#]*)(#.*)?$/);
      if (!match) return { };

      return match[1].split(separator || '&').inject({ }, function(hash, pair) {
        if ((pair = pair.split('='))[0]) {
          var key = decodeURIComponent(pair.shift()),
              value = pair.length > 1 ? pair.join('=') : pair[0];

          if (value != undefined) value = decodeURIComponent(value);

          if (key in hash) {
            if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
            hash[key].push(value);
          }
          else hash[key] = value;
        }
        return hash;
      });
    }

    function camelize() {
      return this.replace(/-+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
    }

    function capitalize() {
      return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
    }

    function underscore() {
      return this.replace(/::/g, '/')
                 .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
                 .replace(/([a-z\d])([A-Z])/g, '$1_$2')
                 .replace(/-/g, '_')
                 .toLowerCase();
    }

    function dasherize() {
      return this.replace(/_/g, '-');
    }

    function include(pattern) {
      return this.indexOf(pattern) > -1;
    }

    function startsWith(pattern) {
      return this.lastIndexOf(pattern, 0) === 0;
    }

    function endsWith(pattern) {
      var d = this.length - pattern.length;
      return d >= 0 && this.indexOf(pattern, d) === d;
    }

    function empty() {
      return this == '';
    }

    function blank() {
      return /^\s*$/.test(this);
    }

    return {
      gsub:           gsub,
      sub:            sub,
      scan:           scan,
      truncate:       truncate,
      strip:          String.prototype.trim || strip,
      stripTags:      stripTags,
      escapeHTML:     escapeHTML,
      unescapeHTML:   unescapeHTML,
      toQueryParams:  toQueryParams,
      parseQuery:     toQueryParams,
      camelize:       camelize,
      capitalize:     capitalize,
      underscore:     underscore,
      dasherize:      dasherize,
      include:        include,
      startsWith:     startsWith,
      endsWith:       endsWith,
      empty:          empty,
      blank:          blank
    };
  })());

  var $break = { };
  
  function $A(iterable) {
    if (!iterable) return [];
    var length = iterable.length || 0, results = new Array(length);
    while (length--) results[length] = iterable[length];
    return results;
  }

  Array.from = $A;

  (function() {
    var arrayProto = Array.prototype,
        slice = arrayProto.slice,
        _each = arrayProto.forEach; // use native browser JS 1.6 implementation if available


    function each(iterator) {
      for (var i = 0, length = this.length; i < length; i++)
        iterator(this[i]);
    }
    if (!_each) _each = each;
    
    function each(iterator, context) {
      var index = 0;
      try {
        this._each(function(value) {
          iterator.call(context, value, index++);
        });
      } catch (e) {
        if (e != $break) throw e;
      }
      return this;
    }

    function eachSlice(number, iterator, context) {
      var index = -number, slices = [], array = this;
      if (number < 1) return array;
      while ((index += number) < array.length)
        slices.push(array.slice(index, index+number));
      return slices.collect(iterator, context);
    }

    function all(iterator, context) {
      iterator = iterator || Prototype.K;
      var result = true;
      this.each(function(value, index) {
        result = result && !!iterator.call(context, value, index);
        if (!result) throw $break;
      });
      return result;
    }

    function any(iterator, context) {
      iterator = iterator || Prototype.K;
      var result = false;
      this.each(function(value, index) {
        if (result = !!iterator.call(context, value, index))
          throw $break;
      });
      return result;
    }

    function collect(iterator, context) {
      iterator = iterator || Prototype.K;
      var results = [];
      this.each(function(value, index) {
        results.push(iterator.call(context, value, index));
      });
      return results;
    }

    function detect(iterator, context) {
      var result;
      this.each(function(value, index) {
        if (iterator.call(context, value, index)) {
          result = value;
          throw $break;
        }
      });
      return result;
    }

    function findAll(iterator, context) {
      var results = [];
      this.each(function(value, index) {
        if (iterator.call(context, value, index))
          results.push(value);
      });
      return results;
    }

    function grep(filter, iterator, context) {
      iterator = iterator || Prototype.K;
      var results = [];

      if (Object.isString(filter))
        filter = new RegExp(RegExp.escape(filter));

      this.each(function(value, index) {
        if (filter.match(value))
          results.push(iterator.call(context, value, index));
      });
      return results;
    }

    function include(object) {
      if (Object.isFunction(this.indexOf))
        if (this.indexOf(object) != -1) return true;

      var found = false;
      this.each(function(value) {
        if (value == object) {
          found = true;
          throw $break;
        }
      });
      return found;
    }

    function inGroupsOf(number, fillWith) {
      fillWith = Object.isUndefined(fillWith) ? null : fillWith;
      return this.eachSlice(number, function(slice) {
        while(slice.length < number) slice.push(fillWith);
        return slice;
      });
    }

    function inject(memo, iterator, context) {
      this.each(function(value, index) {
        memo = iterator.call(context, memo, value, index);
      });
      return memo;
    }

    function invoke(method) {
      var args = $A(arguments).slice(1);
      return this.map(function(value) {
        return value[method].apply(value, args);
      });
    }

    function partition(iterator, context) {
      iterator = iterator || Prototype.K;
      var trues = [], falses = [];
      this.each(function(value, index) {
        (iterator.call(context, value, index) ?
          trues : falses).push(value);
      });
      return [trues, falses];
    }

    function pluck(property) {
      var results = [];
      this.each(function(value) {
        results.push(value[property]);
      });
      return results;
    }

    function reject(iterator, context) {
      var results = [];
      this.each(function(value, index) {
        if (!iterator.call(context, value, index))
          results.push(value);
      });
      return results;
    }

    function sortBy(iterator, context) {
      return this.map(function(value, index) {
        return {
          value: value,
          criteria: iterator.call(context, value, index)
        };
      }).sort(function(left, right) {
        var a = left.criteria, b = right.criteria;
        return a < b ? -1 : a > b ? 1 : 0;
      }).pluck('value');
    }

    function clear() {
      this.length = 0;
      return this;
    }

    function first() {
      return this[0];
    }

    function last() {
      return this[this.length - 1];
    }

    function compact() {
      return this.select(function(value) {
        return value != null;
      });
    }

    function flatten() {
      return this.inject([], function(array, value) {
        if (Object.isArray(value))
          return array.concat(value.flatten());
        array.push(value);
        return array;
      });
    }

    function without() {
      var values = slice.call(arguments, 0);
      return this.select(function(value) {
        return !values.include(value);
      });
    }

    function uniq(sorted) {
      return this.inject([], function(array, value, index) {
        if (0 == index || (sorted ? array.last() != value : !array.include(value)))
          array.push(value);
        return array;
      });
    }

    function clone() {
      return slice.call(this, 0);
    }

    function indexOf(item, i) {
      i || (i = 0);
      var length = this.length;
      if (i < 0) i = length + i;
      for (; i < length; i++)
        if (this[i] === item) return i;
      return -1;
    }

    function lastIndexOf(item, i) {
      i = isNaN(i) ? this.length : (i < 0 ? this.length + i : i) + 1;
      var n = this.slice(0, i).reverse().indexOf(item);
      return (n < 0) ? n : i - n - 1;
    }

    function concat() {
      var array = slice.call(this, 0), item;
      for (var i = 0, length = arguments.length; i < length; i++) {
        item = arguments[i];
        if (Object.isArray(item) && !('callee' in item)) {
          for (var j = 0, arrayLength = item.length; j < arrayLength; j++)
            array.push(item[j]);
        } else {
          array.push(item);
        }
      }
      return array;
    }

    Object.extend(arrayProto, {
      _each:     _each,
      
      each:       each,
      eachSlice:  eachSlice,
      all:        all,
      any:        any,
      
      map:        collect,
      find:       detect,
      select:     findAll,
      grep:       grep,
      include:    include,
      inGroupsOf: inGroupsOf,
      inject:     inject,
      invoke:     invoke,
      pluck:      pluck,
      reject:     reject,
      sortBy:     sortBy,
        
      clear:     clear,
      first:     first,
      last:      last,
      compact:   compact,
      flatten:   flatten,
      without:   without,
      uniq:      uniq
    });

    var CONCAT_ARGUMENTS_BUGGY = (function() {
      return [].concat(arguments)[0][0] !== 1;
    })(1,2)

    if (CONCAT_ARGUMENTS_BUGGY) arrayProto.concat = concat;

    if (!arrayProto.indexOf) arrayProto.indexOf = indexOf;
    if (!arrayProto.lastIndexOf) arrayProto.lastIndexOf = lastIndexOf;
  })();

  notOverwriteExtend(Number.prototype, (function() {
    function abs() {
      return Math.abs(this);
    }

    function round() {
      return Math.round(this);
    }

    function ceil() {
      return Math.ceil(this);
    }

    function floor() {
      return Math.floor(this);
    }

    return {
      abs:    abs,
      round:  round,
      ceil:   ceil,
      floor:  floor
    };
  })());

})();



//// 00000000000000000000000000




(function(){
  
  function notOverwriteExtend(destination, source){
    for (var property in source){
      if (!property in destination){
        destination[property] = source[property];
      }
    }
    return destination;
  }
  
  (function() {
    var arrayProto = Array.prototype,
        slice = arrayProto.slice,
        _each = arrayProto.forEach || function(iterator) {
          for (var i = 0, length = this.length; i < length; i++){
            iterator(this[i]);
          }
        };
    
    function each(iterator, context) {
      var index = 0;
      try {
        _each.call(this, function(value) {
          iterator.call(context, value, index++);
        });
      } catch (e) {
        if (e != $break) throw e;
      }
      return this;
    }

    function eachSlice(number, iterator, context) {
      var index = -number, slices = [], array = this;
      if (number < 1) return array;
      while ((index += number) < array.length)
        slices.push(array.slice(index, index+number));
      return slices.collect(iterator, context);
    }

    function all(iterator, context) {
      iterator = iterator || Prototype.K;
      var result = true;
      this.each(function(value, index) {
        result = result && !!iterator.call(context, value, index);
        if (!result) throw $break;
      });
      return result;
    }

    function any(iterator, context) {
      iterator = iterator || Prototype.K;
      var result = false;
      this.each(function(value, index) {
        if (result = !!iterator.call(context, value, index))
          throw $break;
      });
      return result;
    }

    function collect(iterator, context) {
      iterator = iterator || Prototype.K;
      var results = [];
      this.each(function(value, index) {
        results.push(iterator.call(context, value, index));
      });
      return results;
    }

    function detect(iterator, context) {
      var result;
      this.each(function(value, index) {
        if (iterator.call(context, value, index)) {
          result = value;
          throw $break;
        }
      });
      return result;
    }

    function findAll(iterator, context) {
      var results = [];
      this.each(function(value, index) {
        if (iterator.call(context, value, index))
          results.push(value);
      });
      return results;
    }

    function grep(filter, iterator, context) {
      iterator = iterator || Prototype.K;
      var results = [];

      if (Object.isString(filter))
        filter = new RegExp(RegExp.escape(filter));

      this.each(function(value, index) {
        if (filter.match(value))
          results.push(iterator.call(context, value, index));
      });
      return results;
    }

    function include(object) {
      if (Object.isFunction(this.indexOf))
        if (this.indexOf(object) != -1) return true;

      var found = false;
      this.each(function(value) {
        if (value == object) {
          found = true;
          throw $break;
        }
      });
      return found;
    }

    function inGroupsOf(number, fillWith) {
      fillWith = Object.isUndefined(fillWith) ? null : fillWith;
      return this.eachSlice(number, function(slice) {
        while(slice.length < number) slice.push(fillWith);
        return slice;
      });
    }

    function inject(memo, iterator, context) {
      this.each(function(value, index) {
        memo = iterator.call(context, memo, value, index);
      });
      return memo;
    }

    function invoke(method) {
      var args = $A(arguments).slice(1);
      return this.map(function(value) {
        return value[method].apply(value, args);
      });
    }

    function partition(iterator, context) {
      iterator = iterator || Prototype.K;
      var trues = [], falses = [];
      this.each(function(value, index) {
        (iterator.call(context, value, index) ?
          trues : falses).push(value);
      });
      return [trues, falses];
    }

    function pluck(property) {
      var results = [];
      this.each(function(value) {
        results.push(value[property]);
      });
      return results;
    }

    function reject(iterator, context) {
      var results = [];
      this.each(function(value, index) {
        if (!iterator.call(context, value, index))
          results.push(value);
      });
      return results;
    }

    function sortBy(iterator, context) {
      return this.map(function(value, index) {
        return {
          value: value,
          criteria: iterator.call(context, value, index)
        };
      }).sort(function(left, right) {
        var a = left.criteria, b = right.criteria;
        return a < b ? -1 : a > b ? 1 : 0;
      }).pluck('value');
    }

    function clear() {
      this.length = 0;
      return this;
    }

    function first() {
      return this[0];
    }

    function last() {
      return this[this.length - 1];
    }

    function compact() {
      return this.select(function(value) {
        return value != null;
      });
    }

    function flatten() {
      return this.inject([], function(array, value) {
        if (Object.isArray(value))
          return array.concat(value.flatten());
        array.push(value);
        return array;
      });
    }

    function without() {
      var values = slice.call(arguments, 0);
      return this.select(function(value) {
        return !values.include(value);
      });
    }

    function uniq(sorted) {
      return this.inject([], function(array, value, index) {
        if (0 == index || (sorted ? array.last() != value : !array.include(value)))
          array.push(value);
        return array;
      });
    }

    function clone() {
      return slice.call(this, 0);
    }

    function indexOf(item, i) {
      i || (i = 0);
      var length = this.length;
      if (i < 0) i = length + i;
      for (; i < length; i++)
        if (this[i] === item) return i;
      return -1;
    }

    function lastIndexOf(item, i) {
      i = isNaN(i) ? this.length : (i < 0 ? this.length + i : i) + 1;
      var n = this.slice(0, i).reverse().indexOf(item);
      return (n < 0) ? n : i - n - 1;
    }

    function concat() {
      var array = slice.call(this, 0), item;
      for (var i = 0, length = arguments.length; i < length; i++) {
        item = arguments[i];
        if (Object.isArray(item) && !('callee' in item)) {
          for (var j = 0, arrayLength = item.length; j < arrayLength; j++)
            array.push(item[j]);
        } else {
          array.push(item);
        }
      }
      return array;
    }

    Object.extend(arrayProto, {
      _each:     _each,
      
      each:       each,
      eachSlice:  eachSlice,
      all:        all,
      any:        any,
      
      map:        collect,
      find:       detect,
      select:     findAll,
      grep:       grep,
      include:    include,
      inGroupsOf: inGroupsOf,
      inject:     inject,
      invoke:     invoke,
      pluck:      pluck,
      reject:     reject,
      sortBy:     sortBy,
        
      clear:     clear,
      first:     first,
      last:      last,
      compact:   compact,
      flatten:   flatten,
      without:   without,
      uniq:      uniq
    });

    var CONCAT_ARGUMENTS_BUGGY = (function() {
      return [].concat(arguments)[0][0] !== 1;
    })(1,2)

    if (CONCAT_ARGUMENTS_BUGGY) arrayProto.concat = concat;

    if (!arrayProto.indexOf) arrayProto.indexOf = indexOf;
    if (!arrayProto.lastIndexOf) arrayProto.lastIndexOf = lastIndexOf;
  })();
  
})();