<?php
class ProcessMonitorAction extends CAction {
    public function run($date = null) {
        if (empty($date)) {
            $date = date('Y-m-d');
        } else {
            $is_date = strtotime($date);
            if (!$is_date) {
                header('Content-type: application/json');
                echo json_encode(array('error' => '日期格式错误'));
                return;
            }
            $date = date('Y-m-d', strtotime($date));
        }
        $server_log = require_once (dirname(__FILE__) . '/../../config/log.php');
        $server_log = $server_log['server_log'];
        $data = array();
        if (!empty($server_log) && is_array($server_log)) {
            foreach ($server_log as $key => $value) {
                $format = array('num' => null, 'name' => null, 'log_size' => null, 'err_log_size' => null);
                $format['num'] = $key;
                $format['name'] = $value['server_name'];
                if (file_exists(sprintf($value['running_log'], $date))) {
                    $file_size = filesize(sprintf($value['running_log'], $date));
                    $file_size = $file_size ? $this->format_file_size($file_size) : '0K';
                    $format['log_size'] = $file_size;
                } else {
                    $format['log_size'] = '0K';
                }
                if (file_exists(sprintf($value['error_log'], $date))) {
                    $file_size = filesize(sprintf($value['error_log'], $date));
                    $file_size = $file_size ? $this->format_file_size($file_size) : '0K';
                    $format['err_log_size'] = $file_size;
                } else {
                    $format['err_log_size'] = '0K';
                }
                $data[] = $format;
            }
            $output = array('success' => true, 'result' => array('items' => $data, 'total' => count($data), 'date' => $date));
            header('Content-type: application/json');
            echo json_encode($output);
            return;
        } else {
            echo json_encode(array('success' => true, 'result' => array('items' => array(), 'total' => 0, 'date' => $date)));
            return;
        }
    }
    function format_file_size($file_size) {
        if (!is_numeric($file_size)) {
            return false;
        }
        if ($file_size > 1024 * 1024) {
            $file_size = number_format($file_size / (1024 * 1024), 2) . 'M';
        } else {
            $file_size = number_format($file_size / 1024, 2) . 'K';
        }
        return $file_size;
    }
}