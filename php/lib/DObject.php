<?php

abstract class DObject {
	private static $_methods = array();
	
	protected $_className	= false;
	protected $_pluginName	= '';
	protected $_plugins		= array();
	
	public static function addMethod($object, $scope, $key, $method){
		$object = strtolower( is_object($object) ? get_class($object) : $object );
		
		self::$_methods[$object][$scope][$key] = $method;
	}
	
	// debug method
	public static function inspect($object = null, $scope = null){
		if (!$object) {
			return self::$_methods;
		}
		
		if (is_object($object)) {
			$object = get_class($object);
		}
		
		$object = strtolower($object);
		
		if (empty(self::$_methods[$object])){
			return false;
		}
		
		if (!$scope){
			return self::$_methods[$object];
		}
		
		return isset(self::$_methods[$object][$scope]) ? self::$_methods[$object][$scope] : false;
	}
	
	private function _getMethodFrom($scope, $key){
		if (!$this->_className){
			$this->_className = strtolower(get_class($this));
		}
		
		$name = $this->_className;

		return isset(self::$_methods[$name][$scope][$key]) ? self::$_methods[$name][$scope][$key] : false;
	}
	
	private function _callMethod($scope, $method, $arguments = array()){
		if (!$method = $this->_getMethodFrom($scope, $method)){
			$exception = "DObject_Exception_Invalid" . ucfirst(substr($scope, 0, -1));
			throw new $exception($method);
		}
		
		if (is_string($method)){
			$method = array($this, $method);
		}
		
		return call_user_func_array($method, $arguments);
	}
	
	public function __get($key){
		return $this->_callMethod('getters', $key);
	}
	
	public function __set($key, $value){
		return $this->_callMethod('setters', $key, array($value));
	}
	
	public function __call($method, $arguments){
		return $this->_callMethod('methods', $method, $arguments);
	}
	
	protected function plugin($plugin){
		if (is_string($plugin)){
			$class	= new ReflectionClass($this->_pluginName . ucfirst($plugin));
			$plugin	= $class->newInstanceArgs(array($this) + array_slice(func_get_args(), 1));
		}

		if (!($plugin instanceof DObject_Delegate)){
			throw new DObject_Exception_InvalidDelegate(get_class($plugin));
		}
		
		$this->_plugins[] = $plugin;
	}
}