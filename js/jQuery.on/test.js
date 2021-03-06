test("called with eventName(string), selector(string), handler(function)", 2, function(){
  var element   = $("#example-1"),
      returened = element.on("click", ".delete", function(){
        ok(true, "this should be fired, by trigger click");
      });

  equal(element, returened, "jQuery#on should return jQuery instance");

  element.find(".delete").trigger("click");
});

test("called with eventName(string), hanlder(function)", 2, function(){
  var element   = $("#example-2"),
      returened = element.on("click", function(){
        ok(true, "this should be fired, by trigger click");
      });

  equal(element, returened, "jQuery#on should return jQuery instance");

  element.trigger("click");
});

test("called with eventName(string), handles({ selector: handler })(object) ", 3, function(){
  var element   = $("#example-3"),
      returened = element.on("click", {
        ".view": function(){ ok(true, "this should be fired, by trigger click"); },
        ".edit": function(){ ok(true, "this should be fired, by trigger click"); },
        ".fail": function(){ ok(false, "this not should be fired, by trigger click");}
      });

  equal(element, returened, "jQuery#on should return jQuery instance");

  element.find(".view").trigger("click");
  element.find(".edit").trigger("click");
  element.find(".unexisting").trigger("click");
});

test("called with { eventName : handles }(object)", 5, function(){
  var element   = $("#example-4"),
      returened = element.on({
        mouseover: function(){ ok(true, "this should be fired 2 times, by trigger click"); },
        mouseout:  function(){ ok(false, "this not should be fired, by trigger click"); },
        click: {
        ".item-1": function(){ ok(true, "this should be fired, by trigger click"); },
        ".item-2": function(){ ok(true, "this should be fired, by trigger click"); }
        }
      });

  equal(element, returened, "jQuery#on should return jQuery instance");

  element.find(".item-1").trigger("click");
  element.find(".item-2").trigger("click").trigger("mouseover");
  element.trigger("mouseover");
  element.find(".unexisting").trigger("mouseover");
});