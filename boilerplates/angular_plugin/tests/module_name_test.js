"use strict";

function loadModule(module, name) {
  name || (name = module);

  var loaded;
  angular.injector(['ng', module], false).invoke([name, function(module) {
    loaded = module;
  }]);

  return loaded;
}

describe('Module Name', function() {
});
