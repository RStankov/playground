<?php

require '../../boot.php';

if (count($_FILES)){
	
	$_POST['product']['name'] = 'Test name';
	$_POST['product']['id'] = '15';
	
	FilesNormalizer::mergeWithPost();
	
	d($_POST);
}

require 'files_normalizer.html';