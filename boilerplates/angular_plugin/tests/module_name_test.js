"use strict";

function loadModule(module, name) {
  name || (name = module);

  var loaded;
  angular.injector(['ng', module], false).invoke(function() {
  });

  return loaded;
}

describe('Module Name', function() {
});
