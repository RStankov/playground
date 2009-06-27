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
    (el.down('span') || el).update('');
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
  }
});