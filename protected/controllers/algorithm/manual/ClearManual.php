<?php
/**
 * 清除手动干预设置
 */
class ClearManual extends CAction {
	public function run($uid) {
		if (empty ( $uid )) {
			echo json_encode ( array (
					'error' => '参数错误' 
			) );
			return;
		}
		$passport_model = new PassportUser ();
		$passport_model->remove_recomm_by_uid ( $uid );
		Logs::writeLog ( 'set', 'clear_recomm', '' );
		$json = json_encode ( array (
				'success' => true 
		) );
		header ( 'Content-type: application/json' );
		echo $json;
		return;
	}
}
