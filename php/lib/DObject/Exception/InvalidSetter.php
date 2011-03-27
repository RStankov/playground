<?php

class DObject_Exception_InvalidSetter extends DObject_Exception {
	public function __construct($method){
			parent::__construct("Invalid setter method - {$method}");
	}
}