<?php

class DObject_Exception_InvalidDelegate extends DObject_Exception {
	public function __construct($class){
		parent::__construct("{$class} is not instance of DObject_Delegate");
	}	
}
