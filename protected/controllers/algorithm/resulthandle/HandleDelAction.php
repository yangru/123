<?php
/**
 * 结果控制方案删除
 */
class HandleDelAction extends CAction {
	public function run($id) {
		$setting = array ();
		$handle_obj = new ResultHandle ();
		$info = $handle_obj->get_handle_detail ( $id );
		// 加载算法配置
		$algorithm_config = require (dirname ( __FILE__ ) . '/../../../config/algorithm_config.php');
		
		// 从数据库中获取配置
		$scene_obj = new Scene ();
		$setting_from_db = $scene_obj->get_scene_settings_all ();
		$scene_config = array ();
		foreach ( $algorithm_config ['scene'] as $k => $v ) {
			$scene_config [$v ['name']] = $v;
		}
		$recomm_obj_id = $scene_config [$info ['recomm_obj']] ['scene_id'];
		$filter_id = $setting_from_db [$recomm_obj_id] ['filter_id'];
		if (isset ( $filter_id [$info ['type'] - 1] ) && $filter_id [$info ['type'] - 1] === intval ( $info ['id'] )) {
			$json = json_encode ( array (
					'error' => '不能删除，删除前请修改场景设置' 
			) );
			header ( 'Content-type: application/json' );
			echo $json;
			return;
		}
		$result = $handle_obj->del_result_handle ( $id );
		if ($result !== false) {
			$json = json_encode ( array (
					'success' => true 
			) );
			Logs::writeLog ( 'delete', 'filter', $info ['name'] );
		} else {
			$json = json_encode ( array (
					'error' => '删除失败' 
			) );
		}
		header ( 'Content-type: application/json' );
		echo $json;
		return;
	}
}
