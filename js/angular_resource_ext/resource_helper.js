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

  function transformRequestWithFormData(resource) {
    var formData = new FormData();
    formData.append('_', '_');

    for (var key in resource) {
      var value = resource[key];
      if (!angular.isArray(value)) {
        formData.append(key, value);
      } else {
        if (value.length == 0) {
          formData.append(key, "");
        } else {
          for (var i = 0, len = value.length; i < len; i += 1) {
            formData.append("" + key + "[]", value[i]);
          }
        }
      }
    }

    return formData;
  }

  function enableFileUploadsOnActions(actions) {
    for(var action in actions) {
      var method = actions[action].method;
      if (method == 'POST' || method == 'PUT' || method == 'PATH') {
        actions[action].headers = {'Content-Type':  undefined};
        actions[action].transformRequest = transformRequestWithFormData;
      }
    }
  }

  app.factory('Resources', function($resource) {
    return function(name, options) {
      options = options || {}
      actions = options.actions || {}

      actions['update'] = actions['update'] || {method: 'PATCH'};

      if (!options.singular) {
        actions['create'] = actions['create'] || {method: 'POST'};
        actions['destroy'] = actions['create'] || {method: 'DELETE'};
      }

      if (options.fileUpload) {
        actions = enableFileUploadsOnActions(actions);
      }

      if (options.singular) {
        var Resource = $resource("/a/" + name + ":action", {}, actions);
      } else {
        var Resource = $resource("/a/" + name + "/:id/:action", {id: '@id'}, actions);
      }

      Resource.save = save

      return Resource;
    };
  });
})();
