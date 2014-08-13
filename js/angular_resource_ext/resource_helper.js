(function() {
  function save(object, success, failure) {
    if (object.$saving) { return 'already in saving mode'; }
    object.$saving = true;

    sucess  = success || angular.noop;
    failure = failure || angular.noop;

    var failureWrap = function(xhr) {
      object.$saving = false;
      if (xhr.status === 422) {
        object.errors = xhr.data.errors;
        failure(object, xhr.data.errors);
      }
    };

    var successWrap = function(object) {
      object.$saving = false;
      success(object);
    };

    delete object.errors;
    return this[object.id ? 'update' : 'create'](object, successWrap, failureWrap);
  }

  function destroy(object, success, failure) {
    return this["delete"]({id: object.id}, success, failure);
  }

  app.factory('Resources', function($resource) {
    return function(pluralName, actions) {
      actions = actions || {}
      actions['create'] = actions['create'] || {method: 'POST'};
      actions['update'] = actions['update'] || {method: 'PATCH'};

      var Resources = $resource("/a/" + pluralName + "/:id/:action", {id: '@id'}, actions);

      Resources.save = save
      Resources.destroy = destroy

      return Resources;
    };
  });

  app.factory('Resource', function($resource) {
    return function(singularName, actions) {
      actions = actions || {}
      actions['update'] = actions['update'] || {method: 'PATCH'};

      var Resource = $resource("/a/" + singularName, {}, actions);

      Resource.save = save;

      return Resource;
    };
  });
})();
