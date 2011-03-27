<?php 

require '../../boot.php';

class SomePlugin extends DObject_Delegate {
	private $name = '';
	
	public function __construct(DObject $object){
		$this->delegateGetter($object, 'name', 'getName');
		$this->delegateSetter($object, 'name', 'setName');
		$this->delegate($object, 'scream');
	}
	
	public function getName(){
		return $this->name;
	}
	
	public function setName($name){
		$this->name = $name;
	}
	
	public function scream(){
		d('...woro');
	}
}

class SomeModel extends DObject {
	public function __construct(){
		$this->plugin('SomePlugin');
	}
}

$s = new SomeModel();

echo 'name : ', $s->name, '<br />';

$s->name = 'change 1';

echo 'name : ', $s->name, '<br />';

$s->name = 'change 2';

echo 'name : ', $s->name, '<br />';

$s->scream();