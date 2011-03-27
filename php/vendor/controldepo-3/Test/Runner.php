<?php 

/**
 * Run test codes
 *
 */

class Test_Runner {
	private $suite;		// suite to run
	private $skip;		// folders to skip
	private $root;		// root folder
	
/**
 * The constructor
 *
 * @param	string 		$name		name of the test suite
 */
	public function __construct($name = '', $skip = array()){
		$this->root		= TESTS_DIR . DS;
		$this->skip		= (array) $skip;
		$this->suite	= new PHPUnit_Framework_TestSuite("{$name} Unit tests suit");
		$this->collect($this->root . $name);
	}
	
/**
 * Convert a file to class name of the test case class
 *
 * @param	DirectoryIterator		$file		test case file
 * @return	string								test case class name
 */
	private function className($file){
		return str_replace('/', '_', str_replace(array($this->root, '.php'), '', $file->getRealPath()));
	}
	
/**
 * Collects all test from the directory and it sub directories
 *
 * @param	string		$dname		directory name
 */
	private function collect($dname){
		if (in_array(basename($dname), $this->skip)) return;
		
		foreach(new DirectoryIterator($dname) as $file){
			if ($file == '.' || $file == '..') {
				continue;
			}
			
			if ($file->isDir()){
				$this->collect($file->getRealPath());
			} else if (preg_match('/Test\.php$/', $file)) {
				require_once $file->getRealPath();
				$this->suite->addTestSuite($this->className($file));
			} else if ($file == 'setup.php'){
				require_once $file->getRealPath();
			}
		}
	}
		
/**
 * Run the tests 
 *
 * @param	array		$arguments		arguments, options, for the PHPUnit::TestRunner 
 */
	public function runHtml($arguments = array()){
		try {
			echo '<pre>';
			$runner	= new PHPUnit_TextUI_TestRunner();
			$result = $runner->doRun($this->suite, $arguments);
			
			if (isset($arguments['reportDirectory'])){
				echo 'Code covarage reports can be found ';
				echo '<a href="', str_replace(TESTS_ROOT . DS, '', $arguments['reportDirectory']), '">here</a>.';
			}
			
			echo '</pre>';
		} catch (Exception $e) {
			throw new RuntimeException("Could not create and run test suite: {$e->getMessage()}");
		}
		
		if ($result->wasSuccessful()){
			exit(PHPUnit_TextUI_TestRunner::SUCCESS_EXIT);
		} else if($result->errorCount() > 0){
			exit(PHPUnit_TextUI_TestRunner::EXCEPTION_EXIT);
		} else {
			exit(PHPUnit_TextUI_TestRunner::FAILURE_EXIT);	
		}
	}
}
