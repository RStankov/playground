<?php

class SomePlugin extends DObject_Delegate {
	private $name = '';
	
	public function __construct(DObject $object){
		$this->delegateGetter($object, 'name', 'getName');
		$this->delegateSetter($object, 'name', 'setName');
		$this->delegate($object, 'shout');
	}
	
	public function getName(){
		return $this->name;
	}
	
	public function setName($name){
		$this->name = $name;
	}
	
	public function shout($noise = 'auuuuchh....'){
		return $noise;
	}
}

class SomeModel extends DObject {
	public function __construct(){
		$this->plugin('SomePlugin');
	}
}