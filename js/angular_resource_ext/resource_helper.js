app.factory('Resources', function($resource) {
  return function(pluralName, actions) {
    actions = actions || {}
    actions['create'] = actions['create'] || {method: 'POST'};
    actions['update'] = actions['update'] || {method: 'PATCH'};

    var Resources = $resource("/a/" + pluralName + "/:id/:action", {id: '@id'}, actions);

    Resources.save = function(object, success, failure) {
      if (object.$saving) {
        return 'already in saving mode';
      }

      failure = failure || function(object, errors) { return object.errors = errors; };

      var failureWrap = function(xhr) {
        object.$saving = false;
        if (xhr.status === 422) {
          failure(object, xhr.data.errors);
        }
      };

      var successWrap = function(object) {
        object.$saving = false;
        success(object);
      };

      delete object.errors;

      object.$saving = true;
      return this[object.id ? 'update' : 'create'](object, successWrap, failureWrap);
    };

    Resources.destroy = function(object, success, failure) {
      return this["delete"]({id: object.id}, success, failure);
    };

    return Resources;
  };
});

app.factory('Resource', function($resource) {
  return function(singularName, actions) {
    actions = actions || {}
    actions['update'] = actions['update'] || {method: 'PATCH'};

    var Resource = $resource("/a/" + singularName, {}, actions);

    Resource.save = function(object, success, failure) {
      if (object.$saving) {
        return 'already in saving mode';
      }
      failure = failure || function(object, errors) { return object.errors = errors; };

      var failureWrap = function(xhr) {
        object.$saving = false;
        if (xhr.status === 422) {
          failure(object, xhr.data.errors);
        }
      };

      var successWrap = function(object) {
        object.$saving = false;
        success(object);
      };

      delete object.errors;
      object.$saving = true;

      return this.update(object, successWrap, failureWrap);
    };

    return Resource;
  };
});
