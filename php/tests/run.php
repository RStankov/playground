<?php 

require '../boot.php';

require 'PHPUnit/Framework.php';
require 'PHPUnit/Framework/Test.php';
require 'PHPUnit/TextUI/TestRunner.php';

// we need a lot time and memory here!
set_time_limit(120);
ini_set('memory_limit', '100M');

// code covarage starts now (if we need it, and xdebug is available)
if (isset($_GET['report'])){
	if (function_exists('xdebug_start_code_coverage')){
		xdebug_start_code_coverage();
	} else {
		unset($_GET['report']);
	}
}

// define constas needed for test suite
define('DS', DIRECTORY_SEPARATOR);
define('TESTS_DIR',			TESTS_ROOT . DS . 'unit');
define('TESTS_REPORTS',		TESTS_ROOT . DS . 'reports');
define('TESTS_ASSETS',		TESTS_ROOT . DS . 'assets');

$options = array();

if (isset($_GET['report'])){
	$options['reportDirectory'] = TESTS_REPORTS;
}

// run the test
$r = new Test_Runner(array_cut($_GET, 'for', ''), isset($_GET['skip']) ? explode(',', $_GET['skip']) : array());
$r->runHtml($options);

