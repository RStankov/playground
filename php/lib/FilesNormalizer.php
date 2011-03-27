<?php

class FilesNormalizer {
	public static function mergeWithPost(){
		return $_POST = array_merge_recursive($_POST, self::normalize($_FILES));
	}
	
	public static function merge(array $data = array()){
		return array_merge_recursive($data, self::normalize($_FILES));
	}
	
	public static function normalize($files){
		$return = array();
		foreach($files as $name => $file){
			$return[$name] = is_array($file['name']) ? self::normalizeFile($file) : $file;
		}
		
		return $return;
	}
	
	private static function normalizeFile($file){
		$return = array();
		$normalize = false;
		foreach(array('name', 'type', 'tmp_name', 'error', 'size') as $prop){
			foreach($file[$prop] as $key => $value){
				$return[$key][$prop] = $value;
				
				if (!$normalize && is_array($value)){
					$normalize = true;
				}
			}
		}
		
		return $normalize ? self::normalize($return) : $return;
	}
}