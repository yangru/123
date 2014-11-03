<?php
class Timer {

public $begin = false;
public $end = false;

public function __construct() {
	$this->begin = gettimeofday(true);
	$this->end = gettimeofday(true);
}

public function end() {
	$this->end = gettimeofday(true);
	return round($this->end - $this->begin, 3);
}

}
