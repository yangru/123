<?php
/**
 * 算法列表
 */
class AlgorithmList extends CAction {
    public function run($type = '') {
        //加载算法配置
        $algorithm_config = require (dirname(__FILE__) . '/../../../config/algorithm_config.php');
        
        //从数据库中获取配置
        $algorithm_obj = new Algorithm();
        $algorithm_list = $algorithm_obj->get_all_algorithms();
        
        
        if (isset($algorithm_config['algorithm']) && is_array($algorithm_config['algorithm'])) {
            $scenes = array();
            $ids = array();
            foreach ($algorithm_config['algorithm'] as $algorithm_id => $algorithm) {
            	if (!empty($type) && $algorithm_config['object_type'][$algorithm['type']] != urldecode($type)) { //过滤算法类型
            		continue;
            	}
                if (!isset($algorithm_list[$algorithm_id])) { //数据库没有，读默认配置
                    $algorithm['type'] = $algorithm_config['object_type'][$algorithm['type']]."推荐";
                    if (isset($algorithm['params']) && is_array($algorithm['params'])) {
                        $params = array();
                        foreach ($algorithm['params'] as $param_no) {
                            $params[] = $algorithm_config['params'][$param_no];
                        }
                        $algorithm['params'] = $params;
                    }
                } else { //数据库有，读已保存的配置
                    $algorithm['type'] = $algorithm_config['object_type'][$algorithm_list[$algorithm_id]['type']]."推荐";
                    if (isset($algorithm_config['algorithm'][$algorithm_id]['params']) && $algorithm_config['algorithm'][$algorithm_id]['params']) {
                        $params = array();
                        foreach ($algorithm_config['algorithm'][$algorithm_id]['params'] as $param_no) {
                        	$temp = $algorithm_config['params'][$param_no];
                        	if (isset($algorithm_list[$algorithm_id]['params'][$param_no])) {
                        		$temp['value'] = $algorithm_list[$algorithm_id]['params'][$param_no];
                        	}
                            $params[] = $temp;
                        }
                        $algorithm['params'] = $params;
                    }
                }
                
                $algorithms[] = $algorithm;
            }
        }
        if (!empty($algorithms)) {
            header('Content-type: application/json');
            $json = json_encode(array('success' => true, 'result' => array('items' => $algorithms, 'total' => count($algorithm_config['algorithm']))));
            echo $json;
            return;
        } else {
        	header('Content-type: application/json');
        	echo json_encode(array('success' => true, 'result' => array('items' => array(), 'total' => 0)));
        }
    }
}
