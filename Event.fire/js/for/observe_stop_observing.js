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
    $('inline_test').fire('click');
    this.assertEqual($('inline_test').className, 'passed');
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
  }
});