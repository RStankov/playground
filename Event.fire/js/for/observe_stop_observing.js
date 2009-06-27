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

function log(obj) {
  var line, all = [];
  for (prop in obj) {
    if (typeof obj[prop] == 'function' || /^[A-Z]|[XY]$/.test(prop)) continue;
    line = prop + ": " + Object.inspect(obj[prop]);
    all.push(line.escapeHTML());
  }
//  $('log').update(all.join('<br />'));
}

new Test.Unit.Runner({
  testBasicClickCallback: function(){
    var clickBasic = 0;
	  var basicCallback = function(e){
      $('basic').passed();
      
      clickBasic++;
      
      if ($('basic_remove')){
        $('basic_remove').show();
      } else {
        this.fail();
        $('basic').failed();
      }
      
      log(e);
    }.bind(this);

    $('basic').observe('click', basicCallback)
    
    $('basic_remove').observe('click', function(e){
      el = $('basic');
      el.passed('This test should now be inactive (try clicking)');
      el.stopObserving('click');
      
      $('basic_remove').remove();
      
      log(e);
    }).hide();
    
    $('basic').fire('click');
    
    this.assertEqual(clickBasic, 1);
    this.assert($('basic_remove').visible());
    
    $('basic_remove').fire('click');
    
    $('basic').fire('click');
    
    this.assertEqual(clickBasic, 1);
    
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
      
      log(e);
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
       log(evt);
     });
     
     $('basic3').fire('click');
     
     this.assert($('basic3').isPassed());
  },

  testLeftMouseClick: function(){
    $w('left middle right').each(function(button){
      Event.observe(button, 'mousedown', function(e){
    	  if (Event['is' + this.id.capitalize() + 'Click'](e)){
    	    this.passed('Squeak!')
    	  } else {
    	    this.failed('OH NO!');
  	    }
    	  log(e);
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
        this.assertEqual(id == button, element.isPassed());
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
        log(e);
    });
    
    $('context').fire('contextmenu');
    this.assert($('context').isPassed());
  },
  
  testEventElementMethod: function(){
    $('target').observe('click', function(e) {
      if (e.element() == this && e.target == this) this.passed();
      else this.failed();
      log(e);
    });
     
    $('target').fire('click');
    this.assert($('target').isPassed());
  },

  testCurrentTarget: function(){
    $('currentTarget').observe('click', function(e){
      if(e.currentTarget !== this) this.failed();
      else this.passed();
      log(e);
    });
    
    $('currentTarget').fire('click');
    this.assert($('currentTarget').isPassed());
  },

  testEventFindElement: function(){
    $('findElement').observe('click', function(e){
      if(e.findElement('p') == this && e.findElement('body') == document.body &&
         e.findElement('foo') == null) this.passed();
      else this.failed();
      log(e);
    });
  
    $('findElement').fire('click');
    this.assert($('findElement').isPassed());
  },

  testObjectInspect: function(){
    $('obj_inspect').observe('click', function(e){
      el = $('obj_inspect')
      try { el.passed(Object.inspect(e)) }
      catch (err) { el.failed('Failed! Error thrown') }
      log(e);
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
      log(e);
    }.bindAsEventListener(document.body, 'foo', [1,2,3]));
    
    $('bind').fire('click');
    this.assert($('bind').isPassed());
  },

  testStopPropagation: function(){
    $('stop').observe('click', function(e){
      e.stop();
      this.passed();
      log(e);
    });
    $('container').observe('click', function(e){
      $('stop').failed();
      log(e);
    });
    
    
    this.assert(!$('stop').isPassed());
    
    $('stop').fire('click');
    
    this.assert($('stop').isPassed());
  },

  testNotStopingPropagation: function(){
    $('container2').observe('click', function(e){
      $('don_not_stop').passed();
      log(e);
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
       log(e);
     }.bind(this));
     
     $('keyup').fire('keyup', {keyCode: 65, charCode: 0}); // 'a' char
     this.assert($('keyup_log').isPassed());
  },
  
  testMouseEnterMouseLeave: function(){
    $('mouseenter').observe('mouseenter', function(event) {
      if ($(event.relatedTarget).descendantOf($('mouseenter'))){
        $('mouseenter').failed('<code id="mouseenter_child">mouseenter</code> failed');
      } else {
        $('mouseenter').passed('<code id="mouseenter_child">mouseenter</code> passed');
      }
    });
    $('mouseenter').observe('mouseleave', function(event) {
      if ($(event.relatedTarget).descendantOf($('mouseenter'))){
        $('mouseenter').failed('<code id="mouseenter_child">mouseleave</code> failed');
      } else {
        $('mouseenter').passed('<code id="mouseenter_child">mouseleave</code> passed');
      }
    });
    
    // for browser who do not support natively mouseenter/mouseleave make extra checks
    if (!('onmouseenter' in document.documentElement && 'onmouseleave' in document.documentElement)){
      $('mouseenter').fire('mouseover', { relatedTarget: $('mouseenter_child') });
      $('mouseenter').fire('mouseout', { relatedTarget: $('mouseenter_child') });
      this.assert(! $('mouseenter').className );
      
      $('mouseenter').fire('mouseout', { relatedTarget: $('mouseenter_parent') });
      this.assert($('mouseenter').isPassed());
    }
    
    
    $('mouseenter').clear('<code id="mouseenter_child">mouseenter/mouseleave</code> test');
    
    $('mouseenter').fire('mouseenter', { relatedTarget: $('mouseenter_parent') });
    
    this.assert($('mouseenter').isPassed());
    
    $('mouseenter').clear('<code id="mouseenter_child">mouseenter/mouseleave</code> test');

    $('mouseenter').fire('mouseleave', { relatedTarget: $('mouseenter_parent') });
      
    this.assert($('mouseenter').isPassed());
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