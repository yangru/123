<?php
/**
 * 微博人物类型 
 */
class WeiboTypeAction extends CAction {
    public function run() {
    	//获取微博类别
    	$weibo_type = require (dirname(__FILE__) . '/../../config/weibo_config.php');
    	$weibo_type = $weibo_type['type'];
    	$types = array();
    	$types[] = array('key'=>0, 'value'=>'全部');
    	$i = 0;
    	foreach ($weibo_type as $key => $value) {
    		if ($i >= 8)
    			break;
    		$types[] = array('key' => $key, 'value' => $value);
    		$i ++;
    	}
        if ($types !== false) {
            $json = json_encode(array('success' => true, 'result' => $types));
        } else {
            $json = json_encode(array('success' => true, 'result' => array()));
        }
        header('Content-type: application/json');
        echo $json;
        return;
    }
}