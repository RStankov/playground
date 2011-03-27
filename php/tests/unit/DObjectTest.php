<?php

require TESTS_ASSETS . DS . 'DObjectTest.php';

class DObjectTest extends Test_TestCase {
	private $model;
	
	function setup(){
		$this->model = new SomeModel();
	}
	
	function testGetterAndSetters(){
		$this->assertEquals('', $this->model->name);

		$this->model->name = 'change 1';
		
		$this->assertEquals('change 1', $this->model->name);

		$this->model->name = 'change 2';
		
		$this->assertEquals('change 2', $this->model->name);
	}
	
	function testMethod(){
		$this->assertEquals('auuuuchh....', $this->model->shout());
		$this->assertEquals('ggggrrrr...', $this->model->shout('ggggrrrr...'));
	}
	
	function testExceptions(){
		try{
			echo $this->model->notDelegating;
			$this->fail();
		} catch (DObject_Exception_InvalidGetter $e){}
		
		try{
			$this->model->notDelegating = 'value';
			$this->fail();
		} catch (DObject_Exception_InvalidSetter $e){}
		
		try{
			$this->model->notDelegating();
			$this->fail();
		} catch (DObject_Exception_InvalidMethod $e){}
	}
}