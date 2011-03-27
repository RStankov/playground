<?php 

require '../boot.php';

if (empty($_GET['name'])){
	echo '<ul>';
	foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator(TESTS_ROOT . '/benchmarks'), true) as $file){
		if (!$file->isDir() && preg_match('/\.php$/', $file->getFilename())){
			$name = basename($file, '.php');
			
			echo '<li><a href="benchmark.php?name=', $name, '">', $name, '</a></li>';
		}
	}
	echo '</ul>';
} else {
	// get benchmark name
	$class = $_GET['name'];

	// get the neede benchmark
	require "benchmarks/{$class}.php";

	$benchmark = new $class();
	$benchmark->run();
}