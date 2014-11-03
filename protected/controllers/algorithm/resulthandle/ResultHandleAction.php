<?php
/**
 * 算法应用场景列表
 */
class ResultHandleAction extends CAction {
	public function run($all = '', $page = 1, $limit = 20, $recomm_obj = '') {
		// 加载算法配置
		$algorithm_config = require (dirname ( __FILE__ ) . '/../../../config/algorithm_config.php');
		
		// 从数据库中获取配置
		$scene_obj = new Scene ();
		$setting_from_db = $scene_obj->get_scene_settings_all ();
		$scene_config = array ();
		foreach ( $algorithm_config ['scene'] as $k => $v ) {
			$scene_config [$v ['name']] = $v;
		}
		$recomm_obj_id = $scene_config [$recomm_obj] ['scene_id'];
		$filter_id = $setting_from_db [$recomm_obj_id] ['filter_id'];
		$handle_obj = new ResultHandle ();
		$start = ($page - 1) * $limit;
		$handle_count = $handle_obj->get_handle_count ( $recomm_obj );
		$result = array ();
		if (empty ( $all )) {
			$start = 0;
			$limit = $handle_count;
			$result ['filter'] [] = array (
					'id' => 0,
					'name' => '不使用过滤' 
			);
			$result ['implant'] [] = array (
					'id' => - 1,
					'name' => '不使用植入' 
			);
		}
		$handle_info = $handle_obj->get_all_handleinfo ( $start, $limit, $recomm_obj );
		if (! empty ( $handle_info ) && is_array ( $handle_info )) {
			foreach ( $handle_info as $value ) {
				if (isset ( $filter_id [$value ['type'] - 1] ) && $filter_id [$value ['type'] - 1] === intval ( $value ['id'] )) {
					$value ['use'] = true;
				}
				$value ['type'] = $algorithm_config ['result_handle_type'] [$value ['type']];
				$setting_string = array ();
				if (! empty ( $value ['setting'] ) && is_array ( $value ['setting'] )) {
					foreach ( $value ['setting'] as $set_key => $set_value ) {
						switch ($set_key) {
							case 'random' :
								$setting_string [] = $set_value == 1 ? '植入次序：随机' : '植入次序：正序';
								break;
							case 'mix_random' :
								$setting_string [] = $set_value == 1 ? '与推荐结果混合方式：随机' : '与推荐结果混合方式：置顶';
								break;
							case 'num' :
								$setting_string [] = '植入个数：' . $set_value;
								break;
							case 'filter_obj' :
								$setting_string [] = $set_value == 1 ? '过滤对象：ID' : '过滤对象：文本';
								break;
						}
					}
				}
				$value ['setting'] = $setting_string;
				if (! empty ( $all )) {
					$result [] = $value;
				} else {
					if ($value ['type'] == $algorithm_config ['result_handle_type'] [1]) {
						$result ['filter'] [] = $value;
					} else if ($value ['type'] == $algorithm_config ['result_handle_type'] [2]) {
						$result ['implant'] [] = $value;
					}
				}
			}
		}
		header ( 'Content-type: application/json' );
		echo json_encode ( array (
				'success' => true,
				'result' => array (
						'items' => $result,
						'total' => $handle_count 
				) 
		) );
		return;
	}
}
