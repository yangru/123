<?php
class ProcessCtrlAction extends CAction {
	public function run($process_id, $cmd) {
		$process_info = require (dirname ( __FILE__ ) . '/../../config/process_info.php');
		$process_ids = array_keys ( $process_info );
		if (! in_array ( $process_id, $process_ids ) || ! in_array ( $cmd, array (
				1,
				2 
		) )) {
			header ( 'Content-type: application/json' );
			echo json_encode ( array (
					'error' => '参数错误' 
			) );
		}
		$process_model = new Process ();
		if ($cmd == 1) {
			$result = $process_model->start_process ( $process_id );
			if ($result === true) {
				$process_model->update_process ( $process_id, null, time () );
			}
		} else if ($cmd == 2) {
			$result = $process_model->stop_process ( $process_id );
		}
		if ($result === true) {
			header ( 'Content-type: application/json' );
			echo json_encode ( array (
					'success' => true 
			) );
		} else {
			header ( 'Content-type: application/json' );
			echo json_encode ( array (
					'error' => '设置失败' 
			) );
		}
		return;
	}
}