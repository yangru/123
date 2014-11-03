<?php
/**
 * scribe 日志类
 * @author   kevin
 */

$GLOBALS['THRIFT_ROOT'] = BASEPATH . '/protected/extensions/thrift';
include_once $GLOBALS['THRIFT_ROOT'] . '/scribe.php';
include_once $GLOBALS['THRIFT_ROOT'] . '/transport/TSocket.php';
include_once $GLOBALS['THRIFT_ROOT'] . '/transport/TFramedTransport.php';
include_once $GLOBALS['THRIFT_ROOT'] . '/protocol/TBinaryProtocol.php';
require_once (dirname(__FILE__) . '/../../../library/jsconf/jsconf.php');

class CScribeLogRoute {
	
	private $log_host;
	private $log_port;
	
	public function __construct() {
		$jsconf = jsconf_load('module_log');
		$this->log_host = $jsconf['host'];
		$this->log_port = $jsconf['port'];
	}
    /**
     * 记录系统运行日志
     */
	public function log($module_name, $function_name, $msg, $level=CScribeLogRoute::LEVEL_INFO) {
		$date_time = date('Y-m-d H:i:s');
		$log_content = array($date_time, $level, $module_name, $function_name, $msg);
		foreach ($log_content as $key => $value) {
			if (empty($value)) {
				unset($log_content[$key]);
			}
		} 
		$log_content = implode('|', $log_content);
		switch ($level) {
			case 'INFO':
				$this->add_log($log_content, 'sys_manage_platform');
				break;
			case 'ERROR':
				$this->add_log($log_content, 'sys_manage_platform');
				$this->add_log($log_content, 'sys_manage_platform_error');
				break;
		}
	}
	
	
    /**
     * 向scribe服务器写入日志
     */
    function add_log($log_content, $log_category) {
        $msg['category'] = strtolower($log_category);
        $msg['message'] = $log_content;
        try {
            $entry = new LogEntry($msg);
            $messages = array($entry);
            
            $socket = new TSocket($this->log_host, $this->log_port, false);
            $transport = new TFramedTransport($socket);
            $protocol = new TBinaryProtocol($transport, false, false);
            $scribe_client = new scribeClient($protocol, $protocol);
            
            $transport->open();
            $scribe_client->Log($messages);
            $transport->close();
        } catch (Exception $e) {
        }
    }
}
?>