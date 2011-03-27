<?php

class Loader {
	public static $loadPaths = array();
	
	public static function autoload($class){
		// assume its name is its path
		$class = str_replace('_', '/', $class) . '.php';

		foreach (self::$loadPaths as $path){
			if (file_exists($src = $path . '/' . $class)){
				require $src;
				return;
			}
		}
	}
}