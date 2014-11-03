<?php
/**
 * 结果控制方案修改
 */
class HandleAddAction extends CAction {
	public function run($name = '', $type = '', $content = '', $filter_obj = '', $random = '', $mix_random = '', $num = '', $recomm_obj = '', $desc = '') {
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
		if (! empty ( $filter_obj )) {
			$setting ['filter_obj'] = $filter_obj;
		}
		$handle_obj = new ResultHandle ();
		if ($handle_obj->where_exist ( array (
				'name' => $name 
		) ) === true) {
			$json = json_encode ( array (
					'success' => false,
					'error' => '名称已存在' 
			) );
		} else {
			if ($type === '1') {
				$setting = array ();
			}
			$result = $handle_obj->insert_result_handle ( $name, $type, $content, $setting, $recomm_obj, $desc );
			if ($result !== false) {
				Logs::writeLog ( 'add', 'filter', $name );
				$json = json_encode ( array (
						'success' => true 
				) );
			} else {
				$json = json_encode ( array (
						'error' => '保存失败' 
				) );
			}
		}
		header ( 'Content-type: application/json' );
		echo $json;
		return;
	}
}
