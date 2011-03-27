<?php

class FilesNormalizerTest extends Test_TestCase {
	private $given = array(
		'original_file' => array(
			'name'		=> 'image_file.jpg',
			'type'		=> 'image/jpeg',
			'tmp_name'	=> '/Applications/xampp/xamppfiles/temp/phpFas933',
			'error'		=> 0,
			'size'		=> 980619
		),
		'product' => array(
			'name' => array(
				'logo' 		=> '50-years-exploration-huge.jpg',
				'pictures' 	=> array(
					'0' => '328-onedollarinvestment.jpg',
					'1' => '0724_6insiid_a.gif',
					'2' => '01520_chicagoskyline_1280x800.jpg'
				)
			),
			'type' => array(
				'logo' 		=> 'image/jpeg',
				'pictures'	=> array(
					'0' => 'image/jpeg',
					'1' => 'image/gif',
					'2' => 'image/jpeg'
				)
			),
			'tmp_name' => array(
				'logo' 		=> '/Applications/xampp/xamppfiles/temp/phpFm7qNi',
				'pictures'	=> array(
					'0' => '/Applications/xampp/xamppfiles/temp/phpYMEzE6',
					'1' => '/Applications/xampp/xamppfiles/temp/phptgW14R',
					'2' => '/Applications/xampp/xamppfiles/temp/phpyDXfLt'
				)
			),
			'error' => array(
				'logo'		=> 0,
				'pictures'	=> array(
					'0' => 0,
					'1' => 0,
					'2' => 0
				)
			),
			'size' => array(
				'logo' 		=> 980619,
				'pictures'	=> array(
					'0' => 43367,
					'1' => 135988,
					'2' => 670497
				)
			)
		)
	);
	
	private $expected = array(
		'original_file' => array(
			'name'		=> 'image_file.jpg',
			'type'		=> 'image/jpeg',
			'tmp_name'	=> '/Applications/xampp/xamppfiles/temp/phpFas933',
			'error'		=> 0,
			'size'		=> 980619
		),
		'product' => array(
			'logo' => array(
				'name'		=> '50-years-exploration-huge.jpg',
				'type'		=> 'image/jpeg',
				'tmp_name'	=> '/Applications/xampp/xamppfiles/temp/phpFm7qNi',
				'error'		=> 0,
				'size'		=> 980619
			),
			'pictures' => array(
				'0' => array(
					'name'		=> '328-onedollarinvestment.jpg',
					'type'		=> 'image/jpeg',
					'tmp_name'	=> '/Applications/xampp/xamppfiles/temp/phpYMEzE6',
					'error'		=> 0,
					'size'		=> 43367
				),
				'1' => array(
					'name'		=> '0724_6insiid_a.gif',
					'type'		=> 'image/gif',
					'tmp_name'	=> '/Applications/xampp/xamppfiles/temp/phptgW14R',
					'error'		=> 0,
					'size'		=> 135988
				),
				'2' => array(
					'name'		=> '01520_chicagoskyline_1280x800.jpg',
					'type'		=> 'image/jpeg',
					'tmp_name'	=> '/Applications/xampp/xamppfiles/temp/phpyDXfLt',
					'error'		=> 0,
					'size'		=> 670497
				),
			)
		)
	);
	
	function testNormalizer(){
		$this->assertEquals($this->expected, FilesNormalizer::normalize($this->given));
	}
	
	function testMerge(){
		$_FILES = $this->given;
		
		$this->expected['product']['id'] = '15';
		$this->expected['product']['name'] = 'test name';
		
		$this->assertEquals($this->expected, FilesNormalizer::merge(array(
			'product' => array(
				'id'	=> '15', 
				'name'	=> 'test name'
			)
		)));
	}
}