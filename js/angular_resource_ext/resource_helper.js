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

      var Resources = $resource("/a/" + name + "/:id/:action", {id: '@id'}, actions);

      Resources.save = save
      Resources.destroy = destroy

      return Resources;
    };
  });

  app.factory('Resource', function($resource) {
    return function(name, options) {
      options = options || {}
      actions = options.actions || {}

      actions['update'] = actions['update'] || {method: 'PATCH'};

      if (options.fileUpload) {
        actions = enableFileUploadsOnActions(actions);
      }

      var Resource = $resource("/a/" + name, {}, actions);

      Resource.save = save;

      return Resource;
    };
  });
})();

(function(){
  app.factory('Upload',  function(Resources) { return Resources('uploads', { fileUpload: true }); });
  app.factory('Task',    function(Resources) { return Resources('articles/ironing', {actions: {done: {method: 'PATCH'}}}); });
  app.factory('Product', function(Resources) { return Resources('reviews', {actions: {build: {method: 'GET', params: {action: 'new'}}}}); });
  app.factory('Comment', function(Resources) { return Resources('comments'); });
  app.factory('Profile', function(Resource)  { return Resource('password'); });
  app.factory('Email',   function(Resource)  { return Resource('email'); });
});
