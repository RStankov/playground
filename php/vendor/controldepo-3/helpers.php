<?php


function profile($end = false){
	static $time;
	
	if ($end){
		return microtime(true) - $time;
	}
	
	$time = microtime(true);
}

 
// only in d() used
function join_assoc(array $array, $glue_key = '', $glue_value = ''){
	$temp = array();
	foreach($array as $key => $value)
		$temp[] = $key . $glue_key . $value;
		
	return join($glue_value, $temp);
}

function d($var){
	if (func_num_args() > 1){
		foreach(func_get_args() as $var){
			d($var);
		}
		return;
	}
	
	// start the display div
	$style = array(
		'background-color'	=> '#DCE2E8',
		'text-align'		=> 'left',
		'color'				=> '#000',
		'padding-left'		=> '10px',
		'padding-top'		=> '5px',
		'padding-bottom'	=> '5px',
		'margin'			=> '5px',
		'border-left'		=> '4px solid #C4C3C3'
	);
	echo '<div style="' . join_assoc($style, ':', '; ') . '">' . "\n";

	// if variable is an array or an object
	if (is_array($var) || is_object($var)) {
		echo '<pre>';
		print_r($var);
		echo '</pre>';
		echo '</div>';
		
		return $var;
	}
	
	// save old value
	$var_old = $var;

	// cut the first 6 symbols for comparison
	$part		= strtoupper(substr($var, 0, 6));
	$sqlwords	= array('INSERT', 'UPDATE', 'DELETE', 'SELECT');
	
	// check if given value is sql query
	if (in_array($part, $sqlwords)) {
		// give more complete list of sql reserve words
		$sqlwords = array_merge($sqlwords, array('ASC', 'AS', 'AND', 'BETWEEN', 'BY', 'DESC',
			'FROM', 'GROUP', 'INTO', 'LIKE', 'LIMIT', 'ORDER', 'OR', 'SET', 'WHERE', 'VALUES', 'COUNT'));
			
		// highlight sql reserve words
		foreach ($sqlwords as $val)
			$var = str_replace("{$val} ", ' <strong style="color: #03f">' . $val . '</strong> ', $var);
		
		// highlight strings
		$matches = array();
		preg_match_all("/['].*?[']/", $var, $matches);
		
		foreach ($matches[0] as $val)
			$var = str_replace($val, '<span style="color: #f00">' . $val . '</span>', $var);
	} else {
		$var = htmlspecialchars($var);
	}
	echo "{$var} <br />\n";
	echo '</div>';
			
	return $var_old;
}

/**
 * Take a key from value 
 *
 * @param	string		$key			key to take
 * @param	array		$array  		array with data
 * @param	mixed		$default		default value to be returned
 * @return	mixed						$array[$key]
 */
function array_cut(array &$array, $key, $default = null){
	if (!isset($array[$key])){
		return $default;
	}

	$value = $array[$key];
	unset($array[$key]);
	
	return $value;
}

