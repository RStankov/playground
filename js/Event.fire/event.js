// helpers for functional simulation test
Element.addMethods({
  passed: function(el, message) {
    el = $(el);
    el.className = 'passed';
    (el.down('span') || el).update(message || 'Test passed!');
  },

  failed: function(el, message) {
    el = $(el);
    el.className = 'failed';
    (el.down('span') || el).update(message || 'Test failed');
  },

  clear: function(el, message) {
    el = $(el);
    el.className = '';
    (el.down('span') || el).update(message || '');
  },

  isPassed: function(el){
    return $(el).className == 'passed';
  }
});

new Test.Unit.Runner({
/*
 * Prototype current Unit tests
 */
  // test firing an event and observing it on the element it's fired from
  testCustomEventFiring: function() {
    var span = $("span"), fired = false, observer = function(event) {
      this.assertEqual(span, event.element());
      this.assertEqual(1, event.memo.index);
      fired = true;
    }.bind(this);

    span.observe("test:somethingHappened", observer);
    span.fire("test:somethingHappened", { index: 1 });
    this.assert(fired);

    fired = false;
    span.fire("test:somethingElseHappened");
    this.assert(!fired);

    span.stopObserving("test:somethingHappened", observer);
    span.fire("test:somethingHappened");
    this.assert(!fired);
  },

  // test firing an event and observing it on a containing element
  testCustomEventBubbling: function() {
    var span = $("span"), outer = $("outer"), fired = false, observer = function(event) {
      this.assertEqual(span, event.element());
      fired = true;
    }.bind(this);

    outer.observe("test:somethingHappened", observer);
    span.fire("test:somethingHappened");
    this.assert(fired);

    fired = false;
    span.fire("test:somethingElseHappened");
    this.assert(!fired);

    outer.stopObserving("test:somethingHappened", observer);
    span.fire("test:somethingHappened");
    this.assert(!fired);
  },

  testCustomEventCanceling: function() {
    var span = $("span"), outer = $("outer"), inner = $("inner");
    var fired = false, stopped = false;

    function outerObserver(event) {
      fired = span == event.element();
    }

    function innerObserver(event) {
      event.stop();
      stopped = true;
    }

    inner.observe("test:somethingHappened", innerObserver);
    outer.observe("test:somethingHappened", outerObserver);
    span.fire("test:somethingHappened");
    this.assert(stopped);
    this.assert(!fired);

    fired = stopped = false;
    inner.stopObserving("test:somethingHappened", innerObserver);
    span.fire("test:somethingHappened");
    this.assert(!stopped);
    this.assert(fired);

    outer.stopObserving("test:somethingHappened", outerObserver);
  },

  testEventObjectIsExtended: function() { 
    var span = $("span"), event, observedEvent, observer = function(e) { observedEvent = e };
    span.observe("test:somethingHappened", observer);
    event = span.fire("test:somethingHappened");
    this.assertEqual(event, observedEvent);
    this.assertEqual(Event.Methods.stop.methodize(), event.stop);
    span.stopObserving("test:somethingHappened", observer);

    event = span.fire("test:somethingHappenedButNoOneIsListening");
    this.assertEqual(Event.Methods.stop.methodize(), event.stop);
  },

  testEventObserversAreBoundToTheObservedElement: function() {
    var span = $("span"), target, observer = function() { target = this };

    span.observe("test:somethingHappened", observer);
    span.fire("test:somethingHappened");
    span.stopObserving("test:somethingHappened", observer);
    this.assertEqual(span, target);
    target = null;

    var outer = $("outer");
    outer.observe("test:somethingHappened", observer);
    span.fire("test:somethingHappened");
    outer.stopObserving("test:somethingHappened", observer);
    this.assertEqual(outer, target);
  },

  testMultipleCustomEventObserversWithTheSameHandler: function() {
    var span = $("span"), count = 0, observer = function() { count++ };

    span.observe("test:somethingHappened", observer);
    span.observe("test:somethingElseHappened", observer);
    span.fire("test:somethingHappened");
    this.assertEqual(1, count);
    span.fire("test:somethingElseHappened");
    this.assertEqual(2, count);
  },

  testStopObservingWithoutArguments: function() {
    var span = $("span"), count = 0, observer = function() { count++ };

    span.observe("test:somethingHappened", observer);
    span.observe("test:somethingElseHappened", observer);
    span.stopObserving();
    span.fire("test:somethingHappened");
    this.assertEqual(0, count);
    span.fire("test:somethingElseHappened");
    this.assertEqual(0, count);
  },

  testStopObservingWithoutHandlerArgument: function() {
    var span = $("span"), count = 0, observer = function() { count++ };

    span.observe("test:somethingHappened", observer);
    span.observe("test:somethingElseHappened", observer);
    span.stopObserving("test:somethingHappened");
    span.fire("test:somethingHappened");
    this.assertEqual(0, count);
    span.fire("test:somethingElseHappened");
    this.assertEqual(1, count);
    span.stopObserving("test:somethingElseHappened");
    span.fire("test:somethingElseHappened");
    this.assertEqual(1, count);
  },

  testStopObservingRemovesHandlerFromCache: function() {
    var span = $("span"), observer = Prototype.emptyFunction, eventID;

    span.observe("test:somethingHappened", observer);

    var registry = span.getStorage().get('prototype_event_registry');

    this.assert(registry);
    this.assert(Object.isArray(registry.get('test:somethingHappened')));
    this.assertEqual(1, registry.get('test:somethingHappened').length);

    span.stopObserving("test:somethingHappened", observer);

    registry = span.getStorage().get('prototype_event_registry');

    this.assert(registry);
    this.assert(Object.isArray(registry.get('test:somethingHappened')));
    this.assertEqual(0, registry.get('test:somethingHappened').length);
  },

  testObserveAndStopObservingAreChainable: function() {
    var span = $("span"), observer = Prototype.emptyFunction;

    this.assertEqual(span, span.observe("test:somethingHappened", observer));
    this.assertEqual(span, span.stopObserving("test:somethingHappened", observer));

    span.observe("test:somethingHappened", observer);
    this.assertEqual(span, span.stopObserving("test:somethingHappened"));

    span.observe("test:somethingHappened", observer);
    this.assertEqual(span, span.stopObserving());
    this.assertEqual(span, span.stopObserving()); // assert it again, after there are no observers

    span.observe("test:somethingHappened", observer);
    this.assertEqual(span, span.observe("test:somethingHappened", observer)); // try to reuse the same observer
    span.stopObserving();
  },

  testEventStopped: function() {
    var span = $("span"), event;

    span.observe("test:somethingHappened", Prototype.emptyFunction);
    event = span.fire("test:somethingHappened");
    this.assert(!event.stopped, "event.stopped should be false with an empty observer");
    span.stopObserving("test:somethingHappened");

    span.observe("test:somethingHappened", function(e) { e.stop() });
    event = span.fire("test:somethingHappened");
    this.assert(event.stopped, "event.stopped should be true for an observer that calls stop");
    span.stopObserving("test:somethingHappened");
  },

  testEventFindElement: function() {
    var span = $("span"), event;
    event = span.fire("test:somethingHappened");
    this.assertElementMatches(event.findElement(), 'span#span');
    this.assertElementMatches(event.findElement('span'), 'span#span');	
    this.assertElementMatches(event.findElement('p'), 'p#inner');
    this.assertEqual(null, event.findElement('div.does_not_exist'));
    this.assertElementMatches(event.findElement('.does_not_exist, span'), 'span#span');
  },

  testEventIDDuplication: function() {
    $('container').down().observe("test:somethingHappened", Prototype.emptyFunction);
    $('container').innerHTML += $('container').innerHTML;
    this.assertEqual(null, $('container').down(1)._prototypeEventID);
  },

/*
 * Prototype current Functional tests
 */
    testBasicClickCallback: function(){
     var runned = 0;
     $('basic').observe('click', function(e){
        $('basic').passed();

        runned++;

        if ($('basic_remove')){
          $('basic_remove').show();
        } else {
          this.fail();
          $('basic').failed();
        }
      }.bind(this));

      $('basic_remove').observe('click', function(e){
        el = $('basic');
        el.passed('This test should now be inactive (try clicking)');
        el.stopObserving('click');

        $('basic_remove').remove();
      }).hide();

      $('basic').fire('click');

      this.assertEqual(runned, 1);
      this.assert($('basic_remove').visible());

      $('basic_remove').fire('click');

      $('basic').fire('click');

      this.assertEqual(runned, 1);
      this.assertNull($('basic_remove'));
    },

    testInlineEvents: function(){
      // #inline_test onclick="Event.stop(event); $(this).passed();"
      this.assert(!$('inline_test').isPassed());

      $('inline_test').fire('click');

      this.assert($('inline_test').isPassed());
    },

    testScopeOfTheHandler: function(){
      var runned = false;

      $('basic2').observe('click', function(e) {
        runned = true;

        if(this === window){
          $('basic2').failed('Window scope! (needs scope correction)');
        } else {
          this.passed();
        }
      });

      this.assert(!$('basic2').isPassed());

      $('basic2').fire('click');

      this.assert(runned);
      this.assert($('basic2').isPassed());
    },

    testEventObjectAsFirstArgument: function(){
      $('basic3').observe('click', function(evt) {
         el = $('basic3');
         if (typeof evt != 'object') this.failed('Expected event object for first argument');
         else this.passed('Good first argument');
       });

       $('basic3').fire('click');

       this.assert($('basic3').isPassed());
    },

    testLeftMouseClick: function(){
      $w('left middle right').each(function(button){
        Event.observe(button, 'mousedown', function(e){
          if (Event['is' + button.capitalize() + 'Click'](e)){
            this.passed('Squeak!')
          } else {
            this.failed('OH NO!');
            }
        });
      });
      var BUTTONS = {
        left: 0,
        middle: 1,
        right: 2
      };

      $w('left middle right').each(function(id){
        var element = $(id);

        for(var button in BUTTONS){
          element.clear();
          element.fire('mousedown', { button: BUTTONS[button] });
          this.assertEqual(id == button, element.isPassed(), id + " on " + button);
        }
      }.bind(this));

      $('left').fire('mousedown');
      this.assert($('left').isPassed());

      $('middle').fire('mousedown', { button: BUTTONS.middle });
      this.assert($('middle').isPassed());

      $('right').fire('mousedown', { button: BUTTONS.right });
      this.assert($('right').isPassed());
    },

    testContextMenuEvent: function(){
      $('context').observe('contextmenu', function(e){
          this.passed();
          Event.stop(e);
      });

      $('context').fire('contextmenu');
      this.assert($('context').isPassed());
    },

    testEventElementMethod: function(){
      $('target').observe('click', function(e) {
        if (e.element() == this && e.target == this) this.passed();
        else this.failed();
      });

      $('target').fire('click');
      this.assert($('target').isPassed());
    },

    testCurrentTarget: function(){
      $('currentTarget').observe('click', function(e){
        this[ e.element() == this ? 'passed' : 'failed']();
      });
      
      Element.Methods.clear('currentTarget');
      
      $('currentTarget').fire('click');
      this.assert($('currentTarget').isPassed());
    },

    testEventFindElementAfterClickEvent: function(){
      $('findElement').observe('click', function(e){
        if(e.findElement('p') == this && e.findElement('body') == document.body &&
           e.findElement('foo') == null) this.passed();
        else this.failed();
      });

      $('findElement').fire('click');
      this.assert($('findElement').isPassed());
    },

    testObjectInspect: function(){
      $('obj_inspect').observe('click', function(e){
        el = $('obj_inspect')
        try { el.passed(Object.inspect(e)) }
        catch (err) { el.failed('Failed! Error thrown') }
      });

      $('obj_inspect').fire('click');
      this.assert($('obj_inspect').isPassed());
    },

    testBindAsEventListener: function(){
      $('bind').observe('click', function(e, str, arr){
        el = $('bind')
        try {
          if (arguments.length != 3) throw arguments.length + ' arguments: ' + $A(arguments).inspect()
          if (str != 'foo') throw 'wrong string: ' + str
          if (arr.constructor != Array) throw '3rd parameter is not an array'
          el.passed();
        }
        catch (err) { el.failed(err.toString()) }
      }.bindAsEventListener(document.body, 'foo', [1,2,3]));

      $('bind').fire('click');
      this.assert($('bind').isPassed());
    },

    testStopPropagation: function(){
      $('stop').observe('click', function(e){
        e.stop();
        this.passed();
      });
      $('container').observe('click', function(e){
        $('stop').failed();
      });


      this.assert(!$('stop').isPassed());

      $('stop').fire('click');

      this.assert($('stop').isPassed());
    },

    testPreventDefault: function(){
        $('checkbox').checked = false;
        $('checkbox').observe('click', function(e){
          $('prevent_default').passed();
          e.preventDefault();
        });

        $('checkbox').fire('click');

        this.assert(!$('checkbox').checked);
        this.assert($('prevent_default').isPassed());
    },

    testNotStopingPropagation: function(){
      $('container2').observe('click', function(e){
        $('don_not_stop').passed();
      });

      this.assert(!$('don_not_stop').isPassed());

      $('don_not_stop').fire('click');

      this.assert($('don_not_stop').isPassed());
    },

    testKeyUp: function(){
      $('keyup').observe('keyup', function(e){
         this.assertEqual(65, e.keyCode);
         this.assert(!e.charCode);

         el = $('keyup_log');
         el.passed('Key captured: the length is ' + $('keyup').value.length);
       }.bind(this));

       $('keyup').fire('keyup', {keyCode: 65, charCode: 0}); // 'a' char
       this.assert($('keyup_log').isPassed());
    },

    testMouseEnterMouseLeave: function(){
       var element = $('mouseenter'), 
            child   = element.down(), 
            parent  = element.up();

      element.observe('mouseenter', function(event) {
        if ($(event.relatedTarget).descendantOf(element)){
          this.fail();
          element.failed('<code id="mouseenter_child">mouseenter</code> failed');
        } else {
          element.passed('<code id="mouseenter_child">mouseenter</code> passed');
        }
      }.bind(this));

      element.observe('mouseleave', function(event) {
        if ($(event.relatedTarget).descendantOf($('mouseenter'))){
          this.fail();
          element.failed('<code id="mouseenter_child">mouseleave</code> failed');
        } else {
          element.passed('<code id="mouseenter_child">mouseleave</code> passed');
        }
      }.bind(this));

      // for browser who do not support natively mouseenter/mouseleave make extra checks
      if (!('onmouseenter' in document.documentElement && 'onmouseleave' in document.documentElement)){
        element.fire('mouseover', { relatedTarget: child });
        element.fire('mouseout', { relatedTarget: child });

        this.assert(! element.className );

        element.fire('mouseout', { relatedTarget: parent });
        this.assert(element.isPassed());
      }

      Element.Methods.clear(element, '<code id="mouseenter_child">mouseenter/mouseleave</code> test');

      element.fire('mouseenter', { relatedTarget: parent });

      this.assert(element.isPassed());

      Element.Methods.clear(element, '<code id="mouseenter_child">mouseenter/mouseleave</code> test');

      element.fire('mouseleave', { relatedTarget: parent });

      this.assert(element.isPassed());
    },

    testUnloadEvent: function(){
      var runned = 0;

      document.onunload = function(){ ++runned; }
      Event.observe(document, 'unload', function(event){
        if (!event.target) {
          this.fail('event.target should not be null!');
        }
        ++runned;
      }.bind(this));

      Event.fire(document, 'unload');

      this.assertEqual(2, runned);
    },

/*
 * Prototype Event.fire tests
 */
  testFiringClickEvent: function(){
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

  testStropingFiredEvent: function(){
    var main = 0, inner = 0;

    $('test-event-stop').observe('click',         function(){ ++main; });
    $('test-event-stop-inner').observe('click',   function(e){ ++inner; e.stop(); });

    Event.fire('test-event-stop-inner', 'click');
    this.assertEqual(0, main);
    this.assertEqual(1, inner);
  },

  testFiringKeyUpEvent: function(){
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
  testFiringFocusInEvent: function(){
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
});