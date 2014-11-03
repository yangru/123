<?php
/**
 * 结果控制方案修改
 */
class HandleEditAction extends CAction {
	public function run($id, $type = '', $content = '', $random = '', $mix_random = '', $num = '', $recomm_obj = '', $desc = '') {
		// 加载算法配置
		$algorithm_config = require (dirname ( __FILE__ ) . '/../../../config/algorithm_config.php');
		
		// 从数据库中获取配置
		$scene_obj = new Scene ();
		$setting_from_db = $scene_obj->get_scene_settings_all ();
		
		// 读取过滤/植入配置
		$handle_obj = new ResultHandle ();
		$filter_info = $handle_obj->get_handle_detail ( $id );
		$recomm_obj = $filter_info ['recomm_obj'];
		
		$scene_config = array ();
		foreach ( $algorithm_config ['scene'] as $k => $v ) {
			$scene_config [$v ['name']] = $v;
		}
		$scene_id = $scene_config [$recomm_obj] ['scene_id'];
		$filter_id = $setting_from_db [$scene_id] ['filter_id'];
		
		if (isset ( $filter_id [$type - 1] ) && $filter_id [$type - 1] === intval ( $id )) {
			$insert_count = empty ( $num ) === false ? $num : null;
			$insert_type = in_array ( $random, array (
					0,
					1 
			) ) === true ? $random : null;
			$blend_type = in_array ( $mix_random, array (
					0,
					1 
			) ) === true ? $mix_random : null;
			$remote_obj = new CallRemote ();
			$remote_obj->set_video_filter ( $scene_id, $filter_info ['type'], explode ( ',', $content ), $insert_count, $insert_type, $blend_type );
		}
		
		$setting = array ();
		if (in_array ( $random, array (
				0,
				1 
		) )) {
			$setting ['random'] = $random;
		}
		if (! empty ( $num )) {
			$setting ['num'] = $num;
		}
		if (in_array ( $mix_random, array (
				0,
				1 
		) )) {
			$setting ['mix_random'] = $mix_random;
		}
		$handle_obj = new ResultHandle ();
		if ($type === '1') {
			$setting = array ();
		}
		$result = $handle_obj->update_result_handle ( $id, $content, $setting, $recomm_obj, $desc );
		if ($result !== false) {
			$info = $handle_obj->get_handle_detail ( $id );
			Logs::writeLog ( 'edit', 'filter', $info ['name'] );
			$json = json_encode ( array (
					'success' => true 
			) );
		} else {
			$json = json_encode ( array (
					'error' => '保存失败' 
			) );
		}
		header ( 'Content-type: application/json' );
		echo $json;
		return;
	}
}
