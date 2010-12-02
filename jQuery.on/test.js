function pending(message){
    ok(false, message || "not implemented yet");
}

test("called with eventName(string), selector(string), handler(function)", 2, function(){
  var element   = $("#example-1"),
      returened = element.on("click", ".delete", function(){
        ok(true, "this should be fired, by trigger click");
      });

  equal(element, returened, "jQuery#on should return jQuery instance");

  element.find(".delete").trigger("click");
});

test("called with eventName(string), hanlder(function)", function(){
  var element   = $("#example-2"),
      returened = element.on("click", function(){
        ok(true, "this should be fired, by trigger click");
      });

  equal(element, returened, "jQuery#on should return jQuery instance");

  element.trigger("click");
});

test("called with eventName(string), handles({ selector: handler })(object) ", function(){
  pending();
});

test("called with { eventName : handles }(object)", function(){
  pending();
});