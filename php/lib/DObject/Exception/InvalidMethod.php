<?php

class DObject_Exception_InvalidMethod extends DObject_Exception {
	public function __construct($method){
			parent::__construct("Invalid method - {$method}");
	}
}