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
      if (actions[action].method != 'GET') {
        actions[action].headers = {'Content-Type':  undefined};
        actions[action].transformRequest = transformRequestWithFormData;
      }
    }
  }

  app.factory('Resources', function($resource) {
    return function(name, options) {
      options = options || {}
      actions = options.actions || {}

      actions['create'] = actions['create'] || {method: 'POST'};
      actions['update'] = actions['update'] || {method: 'PATCH'};

      if (options.fileUpload) {
        actions = enableFileUploadsOnActions(actions);
      }

      if (options.singular) {
        var Resource = $resource("/a/" + name, {}, actions);
      } else {
        var Resources = $resource("/a/" + name + "/:id/:action", {id: '@id'}, actions);
        Resources.destroy = destroy
      }

      Resources.save = save

      return Resources;
    };
  });
})();
