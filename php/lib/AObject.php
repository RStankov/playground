<?php
/*
N	array_change_key_case
N	array_chunk
N	array_combine
N	array_count_values
N	array_diff_assoc
N	array_diff_key
N	array_diff_uassoc
N	array_diff_ukey
N	array_diff
-	array_fill_keys
-	array_fill
N	array_filter
N	array_flip
N	array_intersect_assoc
N	array_intersect_key
N	array_intersect_uassoc
N	array_intersect_ukey
N	array_intersect
BN	array_key_exists
N	array_keys
BN	array_map
N	array_merge_recursive
N	array_merge
N	array_multisort
N	array_pad
N	array_pop
N	array_product
N	array_push
N	array_rand
N	array_reduce
N	array_reverse
BN	array_search
N	array_shift
N	array_slice
N	array_splice
N	array_sum
N	array_udiff_assoc
N	array_udiff_uassoc
N	array_udiff
N	array_uintersect_assoc
N	array_uintersect_uassoc
N	array_uintersect
N	array_unique
N	array_unshift
N	array_values
N	array_walk_recursive
N	array_walk
-------------------------------------------
A	arsort
A	asort
X	compact
V	count
V	current
A	each
A	end
A	extract
BN	in_array
V	key
A	krsort
A	ksort
A	natcasesort
A	natsort
V	next
A	pos
A	prev
X	range
V	reset
A	rsort
A	shuffle
A	sizeof
A	sort
A	uasort
A	uksort
A	usort
A	join
	
N  : function array_*(StlArray arr, ...)
A  : function *(StlArray arr, ...)
BN : function *(..., StlArray arr)
-  : no pattern (yet)
V  : implemented 
X  : won't be implemented

 
*/
/*


$array = new StlArray();

$array['name'] = 'jack';

if ($array->is_there('jack'))
	echo 'yes';
	
$array->sort();

$array->push('some');
$array->pop('other');

function array_custom($array, $arg1) { 
	$array[] = $arg1;
	return $array;
}

function custom($arg1, $array) { 
	$array[] = $arg1;
	return $array;
}

StlArray::$FUNCTION_BACK['custo2'] = 'custom';

$array->custom('some')->custom('some')->print();
$array->custo2('some')->custo2('some')->print();

*/
class AObject implements ArrayAccess, IteratorAggregate, Countable {
	private $elements		= array();
	public static $FUNCTIONS	= array(
		'arsort', 'asort', 'each', 'end', 'extract', 'natcasesort', 
		'natsort', 'pos', 'prev', 'rsort', 'shuffle', 'sizeof', 
		'sort', 'uasort', 'uksort', 'usort', 'krsort', 'ksort',
		'print' => 'print_r'
	);
	public static $FUNCTIONS_BACK = array(
		'in_there' => 'in_array', 'join',  'search' => 'array_search', 'map' => 'array_map', 'exists' => 'array_key_exists'
	);
	
	public function __construct($elements = array()){
		$this->elements = $elements;
	}
	
	public function offsetExists($offset){
		return isset($this->elements[$offset]);
	}
	
	public function offsetGet($offset){
		return $this->elements[$offset];
	}
	
	public function offsetSet($offset, $value){
		return is_null($offset) ? $this->elements[] = $value : $this->elements[$offset] = $value;
	}
	
	public function offsetUnset($offset){
		unset($this->elements[$offset]);
	}
		
	public function getIterator(){
	
	}
	
	public function count(){
		return count($this->elements);
	}
	
	// @note: here we can tranform this pattern
	// methodCalledFromObject -> method_called_from_object	
	private function toFunction($method){
		// loop througth "overlaped" function and check if search $method is there
		foreach(array('FUNCTIONS' => 'array_unshift', 'FUNCTIONS_BACK' => 'array_unshift') as $scope => $setter){
			$functions = self::$$scope;
			
			// check pattern: $method => 'real_function_name' 
			if (isset($functions[$method])){
				return array($functions[$method], $setter);
			}
			
			// check pattern: $method (use method name is not changed
			if (in_array($method, $functions)){
				return array($method, $setter);
			}
			
		}
		
		// if we havent find any thing return the defauls
		// function name is "array_{$method}"
		// StlArray is the first argument
		return array('array_' . $method, 'array_unshift');
	}
	
	public function __call($method, $arguments){
		// get corrent method(now function) name and setter for the array
		// setter add the elements of the StlArray object to the begining or the end of the arguments list
		list($method, $setter) = $this->toFunction($method);
		
		// check if function exists
		if (!function_exists($method)){
			throw new AObject_Exception("Array function {$method} don't exists!");	
		}
	
		// use the setter to set StlArray elements to begining(array_unshift) or the end(array_push)
		$setter($arguments, $this->elements);
		
		// loop throug all arguments and search for StlArrays 
		// if we find some just replce it with reference to his elements array
		// this is needed if reference is wanted in the arguments list
		foreach($arguments as & $val){
			if (is_a($val, 'AObject')){
				$val = & $val->elements;
			}
		}
		
		// finally preform the function		
		$return = call_user_func_array($method, $arguments);
		
		// check if function return an array
		// if so replace it with similar StlArray Object
		return is_array($return) ? new AObject($return) : $return;
	}
	
	public function clear(){
		$this->elements = array();
	}
	
	public function toString($separator = ','){
		return join($separator, $this->elements);
	}
}