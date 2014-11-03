<?php
class CLogging {
	const RAW = -1;
	const ERROR = 0;
	const WARNING = 1;
	const NOTICE = 2;
	const DEBUG = 3;
	const TRACE = 4;

	private $file = null;
	private $error_log_file = null;
	private $id = "";
	private $level = 100;

	public 
	function open($param) {
		$this->file = fopen($param["filename"], "a");
		$this->error_log_file = fopen($param["filename"].'.err', "a");
		if (!$this->file) {
			return false;
		}

		$this->id = isset($param["id"]) ? $param["id"] : "";

		$this->level = isset($param["level"]) ? $param["level"] : 100;

		return true;
	}

	public
	function log($level, $message) {
		if ($level > $this->level) {
			return;
		}
		$date = date("Y-m-d H:i:s");
		// level
		switch ($level) {
		case self::RAW:
			$message = "$message\n";
			break;
		case self::ERROR:
			$message = "$date [{$this->id}] [ERROR] $message\n";
			break;
		case self::WARNING:
			$message = "$date [{$this->id}] [WARNING] $message\n";
			break;
		case self::NOTICE:
			$message = "$date [{$this->id}] [NOTICE] $message\n";
			break;
		case self::DEBUG:
			$message = "$date [{$this->id}] [DEBUG] $message\n";
			break;
		case self::TRACE:
			$message = "$date [{$this->id}] [TRACE] $message\n";
			break;
		}
		if ($level == self::ERROR && $this->error_log_file) {
			fwrite($this->error_log_file, $message);
			fflush($this->error_log_file);
		} else if ($this->file) {
			fwrite($this->file, $message);
			fflush($this->file);
		} else {
			fputs(STDOUT, $message);
			fflush(STDOUT);
		}

		return;
	}

	public
	function error($message) {
		$this->log(self::ERROR, $message);
	}

	public
	function warning($message) {
		$this->log(self::WARNING, $message);
	}

	public
	function notice($message) {
		$this->log(self::NOTICE, $message);
	}

	public
	function debug($message) {
		$this->log(self::DEBUG, $message);
	}

	public
	function trace($message) {
		$this->log(self::TRACE, $message);
	}

	public
	function raw($message) {
		$this->log(self::RAW, $message);
	}

	public
	function close() {
		fclose($this->file);
		fclose($this->error_log_file);
		return ;
	}
}
