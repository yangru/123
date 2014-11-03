<?php
class ProcessLogAction extends CAction {
    public function run($process_id, $log_type, $download = 0, $date = null) {
        $process_id = Utils::parseParam($process_id, PARAM_TYPE_INT);
        $date = strtotime($date) ? date('Y-m-d', strtotime($date)) : date('Y-m-d');
        $log_type = Utils::parseParam($log_type, PARAM_TYPE_INT);
        $log_type = $log_type == 1 ? 'running_log' : ($log_type == 2 ? 'error_log' : null);
        if (empty($process_id) || empty($log_type) || empty($date)) {
            return;
        }
        $server_log = require_once (dirname(__FILE__) . '/../../config/log.php');
        $server_log = $server_log['server_log'];
        $file_path = sprintf($server_log[$process_id][$log_type], $date);
        if (file_exists($file_path)) {
            if ($download == 1) { //下载日志
                ob_start();
                ob_clean();
                $file_name = explode('/', $file_path);
                $file_name = end($file_name);
                header('Content-type: application/txt');
                header('Content-Disposition: attachment; filename="' . $file_name . '.txt"');
                readfile($file_path, $date);
                ob_end_flush();
            } else { //查看日志
                $command = "tail -100 $file_path";
                $fp = popen($command, 'r');
                if ($fp) {
                    $content = array();
                    while (!feof($fp)) {
                        $temp = fgets($fp, 4096);
                        if ($temp) {
                            $content[] = trim($temp);
                        }
                    }
                    header('Content-type: application/txt');
                    echo json_encode(array('success' => true, 'msg' => $content));
                } else {
                	header('Content-type: application/txt');
                    echo json_encode(array('error' => '没有数据'));
                }
            }
        }
        return;
    }
}