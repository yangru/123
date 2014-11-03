<?php
/**
 * 算法应用场景列表
 */
class SceneAction extends CAction {
    public function run() {
        //加载算法配置
        $algorithm_config = require (dirname(__FILE__) . '/../../../config/algorithm_config.php');
        
        //从数据库中获取配置
        $scene_obj = new Scene();
        $setting_from_db = $scene_obj->get_scene_settings_all();
        
        
        if (isset($algorithm_config['scene']) && is_array($algorithm_config['scene'])) {
            $scenes = array();
            $ids = array();
            foreach ($algorithm_config['scene'] as $scene_no => $scene) {
                if (!isset($setting_from_db[$scene_no])) { //数据库没有，读默认配置
                    $scene['object_type'] = $algorithm_config['object_type'][$scene['object_type']];
                    $scene['algorithm'] = $algorithm_config['algorithm'][$scene['algorithm_id']]['name'];
                    $scene['filter'] = json_encode(array(0));
                } else { //数据库有，读已保存的配置
                    $scene['object_type'] = $algorithm_config['object_type'][$setting_from_db[$scene_no]['object_type']];
                    if (isset($setting_from_db[$scene_no]['algorithm_id']) && $setting_from_db[$scene_no]['algorithm_id']) {
                    	$scene['algorithm'] = $algorithm_config['algorithm'][$setting_from_db[$scene_no]['algorithm_id']]['name'];
                    	$scene['algorithm_id'] = $setting_from_db[$scene_no]['algorithm_id'];
                    } else {
                    	$scene['algorithm'] = $algorithm_config['algorithm'][$scene['algorithm_id']]['name'];
                    }
                    if (isset($setting_from_db[$scene_no]['filter_id']) && $setting_from_db[$scene_no]['filter_id']) {
                    	$scene['filter'] = $setting_from_db[$scene_no]['filter_id'];
                    } else {
                    	$scene['filter'] = json_encode(array(0,-1));
                    }
                }
                
                $scenes[] = $scene;
            }
        }
        if (!empty($scenes)) {
            header('Content-type: application/json');
            $json = json_encode(array('success' => true, 'result' => array('items' => $scenes, 'total' => count($algorithm_config['scene']))));
            echo $json;
            return;
        } else {
        	header('Content-type: application/json');
        	echo json_encode(array('success' => true, 'result' => array('items' => array(), 'total' => 0)));
        }
    }
}
