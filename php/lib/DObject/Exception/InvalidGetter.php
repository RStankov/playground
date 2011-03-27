<?php

class DObject_Exception_InvalidGetter extends DObject_Exception {
	public function __construct($method){
			parent::__construct("Invalid getter method - {$method}");
	}
}