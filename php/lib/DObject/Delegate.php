<?php

class DObject_Delegate {
	protected function delegate($class, $key, $method = false, $scope = 'methods'){
		if (!$method) $method = $key;
		
		DObject::addMethod($class, $scope, $key, array($this, $method));
	}
	
	protected function delegateGetter($class, $key, $method){
		$this->delegate($class, $key, $method, 'getters');
	}
	
	protected function delegateSetter($class, $key, $method){
		$this->delegate($class, $key, $method, 'setters');
	}
}