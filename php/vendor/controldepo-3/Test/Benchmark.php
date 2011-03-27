<?php 

class Test_Benchmark {
	// properties
	protected $times	= 4000;		// times to repeat
	protected $tests	= array();	// functions to run
	
	// preform action	
	final private function preform($method) {
		$start = microtime(true);
		$this->$method();
		$stop = microtime(true);
		
		return $stop - $start;
	}
	
	// run the test
	final public function run() {
		// before
		$this->beforeStart();
		
		// set times and totals
		$totals = array();
		$times  = array();
		 
		// initiazie the starting test times
		foreach ($this->tests as $test) {
			$times[$test] = $totals[$test] = 0;
		}
		
		// run the test
		for ($i=0; $i < $this->times; $i++) {
			$end = array();
			foreach ($this->tests as $test) {
				$times[$test] += $end[$test] = $this->preform($test);
			}
			
			// whitch functions is the fastest one ?
			$test = array_search(min($end), $end);
			$totals[$test]++;
		}
		
		// after
		$this->afterFinish();
		
		// return output
		echo $this->output($times, $totals);
	}
	
	private function output($times, $totals){
		// color for the functiosns
		$colors = array('green', 'blue', 'gray', 'red', 'black');
		$i = 0;
		
		// display the tests
		$output = '';
		$ttimes = array_sum($times);
		foreach ($totals as $test => $total) {
			$color	 = isset($colors[$i]) ? $colors[$i++] : $colors[$i=0];	// little trick with $i++ and $i=0;
			$perc	 = round(($times[$test] * 100) / $ttimes); 
			$output .= "<div style='color: {$color}'>{$test}: {$total} (" . $times[$test] . ") {$perc}%</div>\n";
		}
		$output .= "<div style='color: red'>total time: " . $ttimes . " ({$this->times})</div>";
		
		return $output;
	}
	
	// before and after events functions
	protected function beforeStart(){}
	protected function afterFinish(){}
}