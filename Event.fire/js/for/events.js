new Test.Unit.Runner({
  testClickEvent: function(){
    var doc = 0, body = 0, main = 0, main = 0, inner = 0;
    
    document.observe('click',               function(e){ if (e.element() == document) ++doc; });
    $$('body').first().observe('click',     function(e){ ++body;	});
    $('test-bubble').observe('click',       function(e){ ++main;	});
    $('test-bubble-inner').observe('click', function(e){ ++inner;	});
    
    Event.fire(document, 'click');
    this.assertEqual(1, doc);
    
    Event.fire($$('body').first(), 'click');
    this.assertEqual(1, doc);
    this.assertEqual(1, body);
    
    Event.fire('test-bubble', 'click');
    this.assertEqual(1, doc);
    this.assertEqual(2, body);
    this.assertEqual(1, main);
    
    Event.fire('test-bubble-inner', 'click');
    this.assertEqual(1, doc);
    this.assertEqual(3, body);
    this.assertEqual(2, main);
    this.assertEqual(1, inner);
    
    // just in case re-test
    Event.fire('test-bubble-inner', 'click');
    this.assertEqual(1, doc);
    this.assertEqual(4, body);
    this.assertEqual(3, main);
    this.assertEqual(2, inner);
    
    Event.fire('test-bubble-inner', 'click', {bubbles: false});
    this.assertEqual(1, doc);
    this.assertEqual(4, body);
    this.assertEqual(3, main);
    this.assertEqual(3, inner);
    
    document.stopObserving('click');
    document.body.stopObserving('click');
    $('test-bubble').stopObserving('click');
    $('test-bubble-inner').stopObserving('click');
  },
  testEventStop: function(){
    var main = 0, inner = 0;
    
    $('test-event-stop').observe('click',         function(){ ++main; });
    $('test-event-stop-inner').observe('click',   function(e){ ++inner; e.stop(); });
    
    Event.fire('test-event-stop-inner', 'click');
    this.assertEqual(0, main);
    this.assertEqual(1, inner);
  },
  testKeyUpEvent: function(){
    var doc = 0, body = 0, main = 0, main = 0, inner = 0;
    
    document.observe('keyup',                 function(e){ if (e.element() == document) ++doc; });
    $$('body').first().observe('keyup',       function(e){ ++body;	});
    $('test-bubble2').observe('keyup',        function(e){ ++main;	});
    $('test-bubble2-inner').observe('keyup',  function(e){ ++inner;	});
    
    Event.fire(document, 'keyup');
    this.assertEqual(1, doc);
    
    Event.fire($$('body').first(), 'keyup');
    this.assertEqual(1, doc);
    this.assertEqual(1, body);
    
    Event.fire('test-bubble2', 'keyup');
    this.assertEqual(1, doc);
    this.assertEqual(2, body);
    this.assertEqual(1, main);
    
    Event.fire('test-bubble2-inner', 'keyup');
    this.assertEqual(1, doc);
    this.assertEqual(3, body);
    this.assertEqual(2, main);
    this.assertEqual(1, inner);
    
    // just in case re-test
    Event.fire('test-bubble2-inner', 'keyup');
    this.assertEqual(1, doc);
    this.assertEqual(4, body);
    this.assertEqual(3, main);
    this.assertEqual(2, inner);
    
    Event.fire('test-bubble2-inner', 'keyup', {bubbles: false});
    this.assertEqual(1, doc);
    this.assertEqual(4, body);
    this.assertEqual(3, main);
    this.assertEqual(3, inner);
    
    document.stopObserving('keyup');
    document.body.stopObserving('keyup');
    $('test-bubble2').stopObserving('keyup');
    $('test-bubble2-inner').stopObserving('keyup');
  },
  // focus event in IE's don't bubble (hope Prototype will fix this in next versions)
  testFocusInEvent: function(){
    var doc = 0, body = 0, main = 0, main = 0, inner = 0;
    
    document.observe('focusin',                   function(e){ if (e.element() == document) ++doc;});
    $$('body').first().observe('focusin',         function(e){ ++body;	});
    $('test-html-event').observe('focusin',       function(e){ ++main;	});
    $('test-html-event-text').observe('focusin',  function(e){ ++inner;	});
    
    Event.fire(document, 'focusin');
    this.assertEqual(1, doc);
    
    Event.fire($$('body').first(), 'focusin');
    this.assertEqual(1, doc);
    this.assertEqual(1, body);
    
    Event.fire('test-html-event', 'focusin');
    this.assertEqual(1, doc);
    this.assertEqual(2, body);
    this.assertEqual(1, main);
    
    Event.fire('test-html-event-text', 'focusin');
    this.assertEqual(1, doc);
    this.assertEqual(3, body);
    this.assertEqual(2, main);
    this.assertEqual(1, inner);
    
    document.stopObserving('focusin');
    document.body.stopObserving('focusin');
    $('test-html-event').stopObserving('focusin');
    $('test-html-event-text').stopObserving('focusin');
  }
})