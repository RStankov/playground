<?php

class Test_TestCase extends PHPUnit_Framework_TestCase {
	// check if two tag are equal in term of tagName, attributes, value
	protected function assertEqualTags($tag, $match){ 
		$matcher = new Test_Util_TagMatcher($tag);
		$this->assertTrue($matcher->equal($match));
	}
	
	// check if two tags have the same attrubutes
	protected function assertEqualTagAttributes($attributes, $tag1, $tag2){
		$matcher = new Test_Util_TagMatcher($tag1);
		$this->assertTrue($matcher->equalAttributes($tag2, $attributes));
	}
}
