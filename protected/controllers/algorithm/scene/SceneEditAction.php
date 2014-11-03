<?php
/**
 * 场景设置修改
 */
class SceneEditAction extends CAction {
	public function run($scene_id, $algorithm_id = '', $filter = '') {
		// 加载算法配置
		$algorithm_config = require (dirname ( __FILE__ ) . '/../../../config/algorithm_config.php');
		$flag = 0;
		if (! isset ( $algorithm_config ['scene'] [$scene_id] )) {
			$flag = 1;
		}
		// 验证参数
		$filter = json_decode ( $filter, true );
		if (! empty ( $filter )) {
			foreach ( $filter as $key => $value ) {
				if ($value > 0) {
					$scene_obj = new Scene ();
					if ($scene_obj->is_exist_handle ( $value ) === false) {
						$json = json_encode ( array (
								'error' => '设置失败' 
						) );
						header ( 'Content-type: application/json' );
						echo $json;
						return;
					}
				}
				if (! is_numeric ( $key ) || ! is_numeric ( $value )) {
					$flag = 1;
					break;
				}
			}
		}
		if (! empty ( $algorithm_id )) {
			$algorithm_array = array_keys ( $algorithm_config ['algorithm'] );
			if (! in_array ( $algorithm_id, $algorithm_array )) {
				$flag = 1;
			}
		}
		if ($flag == 1) {
			header ( 'Content-type: application/json' );
			echo json_encode ( array (
					'error' => '参数错误' 
			) );
			return;
		}
		$scene_config = $algorithm_config ['scene'] [$scene_id];
		$format = array (
				'id' => null,
				'object_type' => null,
				'algorithm_id' => null,
				'filter_id' => null 
		);
		$format ['id'] = $scene_id;
		$format ['object_type'] = $scene_config ['object_type'];
		$format ['algorithm_id'] = $algorithm_id;
		$format ['filter_id'] = $filter;
		
		// 通知算法服务器算法切换
		if (! empty ( $algorithm_id )) {
			$remote_obj = new CallRemote ();
			$result = $remote_obj->algorithm_switch ( $scene_id, $algorithm_config ['algorithm'] [$algorithm_id] ['short'] );
			if (! $result) {
				header ( 'Content-type: application/json' );
				echo json_encode ( array (
						'error' => '设置失败' 
				) );
				return;
			}
			Logs::writeLog ( 'modify', 'scene_algo', $algorithm_config ['algorithm'] [$algorithm_id] ['name'] );
		}
		
		// 通知算法服务器过滤/植入改变
		if (! empty ( $filter )) {
			$remote_obj = new CallRemote ();
			if ($algorithm_config ['scene'] [$scene_id] ['object_type'] == (1 || 2 || 3)) {
				foreach ( $filter as $filter_id ) {
					if ($filter_id == 0) { // 取消过滤
						$result = $remote_obj->set_video_filter ( $scene_id, 1, array (), null, null, null );
						$filter_info ['name'] = '取消过滤';
					} else if ($filter_id == - 1) { // 取消植入
						$result = $remote_obj->set_video_filter ( $scene_id, 2, array (), null, null, null );
						$filter_info ['name'] = '取消植入';
					} else {
						$handle_model = new ResultHandle ();
						$filter_info = $handle_model->get_handle_detail ( $filter_id );
						$setting = json_decode ( $filter_info ['setting'], true );
						$insert_count = isset ( $setting ['num'] ) ? $setting ['num'] : null;
						$insert_type = isset ( $setting ['random'] ) ? $setting ['random'] : null;
						$blend_type = isset ( $setting ['mix_random'] ) ? $setting ['mix_random'] : null;
						$result = $remote_obj->set_video_filter ( $scene_id, $filter_info ['type'], explode ( ',', $filter_info ['content'] ), $insert_count, $insert_type, $blend_type );
					}
					if (! $result) {
						header ( 'Content-type: application/json' );
						echo json_encode ( array (
								'error' => '设置失败' 
						) );
						return;
					}
				}
				Logs::writeLog ( 'modify', 'scene_filter', $filter_info ['name'] );
			}
		}
		
		// 保存修改到数据库
		$scene_obj = new Scene ();
		if ($scene_obj->is_exist ( $scene_id )) {
			$result = $scene_obj->update_scene_settings ( $format ['id'], $format ['algorithm_id'], $format ['filter_id'] );
		} else {
			$result = $scene_obj->insert_scene_settings ( $format ['object_type'], $format ['algorithm_id'], $format ['filter_id'] );
		}
		if ($result !== false) {
			$json = json_encode ( array (
					'success' => true 
			) );
		} else {
			$json = json_encode ( array (
					'error' => '设置失败' 
			) );
		}
		header ( 'Content-type: application/json' );
		echo $json;
		return;
	}
}
