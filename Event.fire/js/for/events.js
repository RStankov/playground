new Test.Unit.Runner({
	testClickEventBuble: function(){
		var doc = 0, body = 0, main = 0, main = 0, inner = 0;

		document.observe('click', 				function(e){ if (e.element() == document) ++doc; });
		document.body.observe('click', 			function(e){ ++body;	});
		$('test-bubble').observe('click',		function(e){ ++main;	});
		$('test-bubble-inner').observe('click',	function(e){ ++inner;	});

		Event.fire(document, 'click');
		this.assertEqual(1, doc);
		
		Event.fire(document.body, 'click');
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
/* 
		// IE Have issues with bubble false
		Event.fire('test-bubble-inner', 'click', {bubble: false});
		this.assertEqual(1, doc);
		this.assertEqual(4, body);
		this.assertEqual(3, main);
		this.assertEqual(3, inner);
*/	
		document.stopObserving('click');
		document.body.stopObserving('click');
		$('test-bubble').stopObserving('click');
		$('test-bubble-inner').stopObserving('click');
	},
	testEventStop: function(){
		var main = 0, inner = 0;
		
		$('test-event-stop').observe('click', 		function(){ ++main; });
		$('test-event-stop-inner').observe('click', function(e){ ++inner; e.stop(); });
		
		Event.fire('test-event-stop-inner', 'click');
		this.assertEqual(0, main);
		this.assertEqual(1, inner);
	},
	testKeyUpEventBuble: function(){
		var doc = 0, body = 0, main = 0, main = 0, inner = 0;

		document.observe('keyup', 				function(e){ if (e.element() == document) ++doc; });
		document.body.observe('keyup', 			function(e){ ++body;	});
		$('test-bubble2').observe('keyup',		function(e){ ++main;	});
		$('test-bubble2-inner').observe('keyup',function(e){ ++inner;	});

		Event.fire(document, 'keyup');
		this.assertEqual(1, doc);
		
		Event.fire(document.body, 'keyup');
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
/* 
		// IE Have issues with bubble false
		Event.fire('test-bubble2-inner', 'click', {bubble: false});
		this.assertEqual(1, doc);
		this.assertEqual(4, body);
		this.assertEqual(3, main);
		this.assertEqual(3, inner);
*/	
		document.stopObserving('keyup');
		document.body.stopObserving('keyup');
		$('test-bubble2').stopObserving('keyup');
		$('test-bubble2-inner').stopObserving('keyup');
	},
	testFocusEvent: function(){
			var doc = 0, body = 0, main = 0, main = 0, inner = 0;

			document.observe('focus', 					function(e){ if (e.element() == document) ++doc; });
			document.body.observe('focus', 				function(e){ ++body;	});
			$('test-html-event').observe('focus',		function(e){ ++main;	});
			$('test-html-event-text').observe('focus',	function(e){ ++inner;	});

			Event.fire(document, 'focus');
			this.assertEqual(1, doc);

			Event.fire(document.body, 'focus');
			this.assertEqual(1, doc);
			this.assertEqual(1, body);

			Event.fire('test-html-event', 'focus');
			this.assertEqual(1, doc);
			this.assertEqual(2, body);
			this.assertEqual(1, main);

			Event.fire('test-html-event-text', 'focus');
			this.assertEqual(1, doc);
			this.assertEqual(3, body);
			this.assertEqual(2, main);
			this.assertEqual(1, inner);
			
			document.stopObserving('keyup');
			document.body.stopObserving('keyup');
			$('test-html-event').stopObserving('keyup');
			$('test-html-event-text').stopObserving('keyup');
	}
})