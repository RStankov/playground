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
      if(e.currentTarget !== this) this.failed();
      else this.passed();
    });
    
    $('currentTarget').fire('click');
    this.assert($('currentTarget').isPassed());
  },

  testEventFindElement: function(){
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
       this.assertEqual(0, e.charCode);
      
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
    
    element.clear('<code id="mouseenter_child">mouseenter/mouseleave</code> test');
    
    element.fire('mouseenter', { relatedTarget: parent });
    
    this.assert(element.isPassed());
    
    element.clear('<code id="mouseenter_child">mouseenter/mouseleave</code> test');

    element.fire('mouseleave', { relatedTarget: parent });
    
    this.assert(element.isPassed());
  },
  
  testUnloadEvent: function(){
    var runned = 0;

    window.onunload = function(){ ++runned; }
    Event.observe(window, 'unload', function(event){
      if (!event.target) {
        this.fail('event.target should not be null!');
      }
      ++runned;
    }.bind(this));

    Event.fire(window, 'unload');
    
    this.assertEqual(2, runned);
  }
});