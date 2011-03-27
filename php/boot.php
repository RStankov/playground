<?php

// set error responding to max
error_reporting(E_ALL | E_STRICT);

// set utf-8 encoding
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');
mb_http_input('UTF-8');
mb_language('uni');
mb_regex_encoding('UTF-8');

// define directory constants
define('ROOT_DIR',		realpath(dirname(__FILE__)));
define('INCLUDE_DIR', 	ROOT_DIR . '/lib');
define('VENDOR_DIR',	ROOT_DIR . '/vendor');
define('TESTS_ROOT',	ROOT_DIR . '/tests');

// base controldepo 3 components
require VENDOR_DIR . '/controldepo-3/helpers.php';
require VENDOR_DIR . '/controldepo-3/Loader.php';

// start classes autoloading
Loader::$loadPaths = array(INCLUDE_DIR, VENDOR_DIR, VENDOR_DIR . '/controldepo-3');

spl_autoload_register(array('Loader', 'autoload'));
