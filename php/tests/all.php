<?php 

require '../boot.php';

$count = 0;
foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator(INCLUDE_DIR), true) as $file){
	if (!$file->isDir() && preg_match('/\.php$/', $file->getFilename())){
		require_once $file;
		echo str_replace(array(INCLUDE_DIR . '/', '/', '.php'), array('', '_', ''), $file), '<br />';
		$count++;
	}
}

echo "<strong>Total {$count} classes</strong>";
