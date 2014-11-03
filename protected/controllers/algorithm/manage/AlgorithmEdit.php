<?php
/**
 * 算法参数修改
 */
class AlgorithmEdit extends CAction {
    public function run($algorithm_id, $params = '') {
        //加载算法配置
        $algorithm_config = require (dirname(__FILE__) . '/../../../config/algorithm_config.php');
        $flag = 0;
        //验证是否有此算法
        if (!isset($algorithm_config['algorithm'][$algorithm_id])) {
            $flag = 1;
        }
        //验证参数是否正确
        $params = json_decode($params, true);
        if (!empty($params)) {
            foreach ($params as $key => $value) {
                if (!is_numeric($key) || !is_numeric($value)) {
                    $flag = 1;
                    break;
                }
            }
        }
        
        if ($flag == 1) {
            header('Content-type: application/json');
            echo json_encode(array('error' => '参数错误'));
            return;
        }
        $algorithm = $algorithm_config['algorithm'][$algorithm_id];
        $format = array('id' => null, 'object_type' => null, 'params' => null);
        $format['id'] = $algorithm_id;
        $format['object_type'] = $algorithm['type'];
        if (!empty($params)) {
            foreach ($algorithm['params'] as $value) {
                $format['params'][$value] = isset($params[$value]) ? $params[$value] : $algorithm_config['params'][$value]['value'];
            }
        }
        $algorithm_obj = new Algorithm();
        $remote_model = new CallRemote();
        
        //通知算法服务器参数改变
        $params = array();
        foreach ($format['params'] as $key => $value) {
        	$params[$algorithm_config['params'][$key]['short']] = $value;
        }
        $result = $remote_model->change_algorithm_param($algorithm['short'], $params);
        
        //保存
        if ($result == true) {
            if ($algorithm_obj->is_exist($algorithm_id)) {
                $result = $algorithm_obj->update_algorithm($format['id'], $format['params']);
            } else {
                $result = $algorithm_obj->insert_algorithm($format['object_type'], $format['params']);
            }
        }
        if ($result !== false) {
        	Logs::writeLog('modify', 'algorithm', $algorithm['name']);
            $json = json_encode(array('success' => true));
        } else {
            $json = json_encode(array('error' => '设置失败'));
        }
        header('Content-type: application/json');
        echo $json;
        return;
    }
}
