(function( $ ) {
  "use strict";

  // When invoked, the arguments can be defined in several ways:
  //
  // .comments() - Gets all child comments.
  // .comments( true ) - Gets all comments (deep search).
  // .comments( value ) - Gets all child comments with the current value.
  // .comments( value, true ) - Gets all comments with the current value (deep search).
  // .comments( name, value ) - Gets all child comments with given name-value pair.
  // .comments( name, value, true ) - Gets all comments with given name-value pair (deep search).
  $.fn.comments = function() {
    var settings = normalizeArguments( arguments );
    var comments = [];

    this.each(function(){
      Array.prototype.push.apply(comments, collectComments(this, settings.deep, matcher(settings)));
    });

    return this.pushStack($.unique(comments), 'comments', arguments);
  };

  // I collect the comment nodes contained within the given root node.
  var COMMENT_NODE = 8,
      ELEMENT_NODE = 1;

  function collectComments(rootNode, isDeepSearch, matcher) {
    var comments = [];
    var node = rootNode.firstChild;

    while (node) {
      // Is comment node.
      if (node.nodeType === COMMENT_NODE) {
        if (matcher(node)) {
          comments.push(node);
        }
        // Is element node (and we want to recurse).
      } else if (isDeepSearch && (node.nodeType === ELEMENT_NODE)) {
        Array.prototype.push(comments, collectComments(node, isDeepSearch, matcher));
      }

      node = node.nextSibling;
    }

    return comments;
  }


  // I determine if the given name-value pair is contained within the given text.
  function containsAttribute( text, name, value ) {
    if (!text) {
      return false;
    }

    if ( value && text.indexOf(value) === -1) {
      return false;
    }

    if ( parseAttributes(text)[ name.toLowerCase() ] != value ) {
      return false;
    }

    return true;

  }

  function matchByAttribute(name, value) {
    return function(node) {
      return containsAttribute(node.nodeValue, name, value);
    };
  }

  var WHITESPACE = /^\s+|\s+$/g;
  function matchByText(value) {
    return function(node) {
      return (node.nodeValue || "" ).replace(node, "" ) == value;
    };
  }

  function matchEverything() {
    return function(){
      return true;
    };
  }

  function matcher(settings) {
    if (settings.name, settings.value) {
      return matchByAttribute(settings.name, settings.value);
    }

    if (settings.value) {
      return matchByText(settings.value);
    }

    return matchEverything();
  }

  // I convert the invocation arguments into a normalized settings hash that the search
  // algorithm can use with confidence.
  function normalizeArguments( args ) {
    if (args.length > 3 ) {
      throw new Error("Unexpected number of arguments.");
    }

    if (args.length == 0) {
      return {deep: false, name: "", value: "" });
    }

    if (args.length === 3) {
      return {deep: !!args[2], name: args[0], value: args[1]});
    }

    var lastValue = Array.prototype.pop.call(args);

    if ((lastValue === true) || (lastValue === false)) {
      if (!args.length) {
        return {deep: lastValue, name: "", value: "" };
      }

      if (args.length === 1 ) {
        return {deep: lastValue, name: "", value: args[0]};
      }

      if ( args.length === 2 ) {
        return {deep: lastValue, name: args[ 0 ], value: args[ 1 ]};
      }
    }

    if (args.length === 0) {
      return {deep: false, name: "", value: lastValue };
    }

    if ( args.length === 1 ) {
      return {deep: false, name: args[0], value: lastValue};
    }

    if ( args.length === 2 ) {
      return {deep: false, name: args[1], value: lastValue};
    }
  }

  // I parse the given text value into a collection of name-value pairs.
  var ATTRIBUTE_REGEX = /([a-zA-Z][^=\s]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/gi;
  function parseAttributes( text ) {
    var attributes  = {};
    var matches = null;

    while (matches = ATTRIBUTE_REGEX.exec(text)) {
      attributes[matches[1].toLowerCase()] = matches[2] || matches[3] || matches[4] || "";
    }

    return attributes;
  }
})( jQuery );

