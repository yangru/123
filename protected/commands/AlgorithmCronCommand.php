<?php
/**
 * 作业/进程后台程序
 * 每个5分钟运行一次，检查需要运行的作业
 * 在crontab -e 中增加"【  每5分钟运行   /程序根目录/protected/yiic algorithmcron  】"
 * @author Kevin
 */
class AlgorithmCronCommand extends CConsoleCommand {
    private $process_config;
    
    function __construct() {
        $this->process_config = require (dirname(__FILE__) . '/../config/process_info.php');
    }
    public function actionIndex() {
        $process_model = new Process();
        //获取作业列表信息
        $process_list = $process_model->get_process_all();
        foreach ($this->process_config as $process_id => $info) {
            try {
                //检查是否到时间该执行
                $last_time = $process_list[$process_id]['last_time'];
                if (!$last_time || time() > $last_time + $process_list[$process_id]['interval'] * 3600) {
                    //启动进程
                    $ret = $process_model->start_process($process_id);
                    if ($ret) {
                        //更新执行时间
                        $process_model->update_process($process_id, null, time());
                    }
                }
            } catch (Exception $e) {
                continue;
            }
        }
    }
}

