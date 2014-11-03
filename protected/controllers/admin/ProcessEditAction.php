<?php
class ProcessEditAction extends CAction {
	public function run($id, $interval) {
		$process_info = require (dirname ( __FILE__ ) . '/../../config/process_info.php');
		$process_ids = array_keys ( $process_info );
		$id = intval ( $id );
		if (empty ( $id ) || ! in_array ( $id, $process_ids )) {
			header ( 'Content-type: application/json' );
			echo json_encode ( array (
					'error' => '参数错误' 
			) );
			return;
		}
		$remote_model = new CallRemote ();
		$stream = $remote_model->modify_job_interval ( $process_info [$id] ['process_name'], $interval );
		$data = array ();
		if (! empty ( $stream )) {
			Logs::writeLog ( 'modify', 'process', $process_info [$id] ['name'] );
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
	function get_process_status($file_path) {
		$command = "ps -aux | grep $file_path | grep -v grep";
		$pp = popen ( $command, 'r' );
		$read = fread ( $pp, 2096 );
		$status = strpos ( $read, $file_path ) !== false ? 1 : 0;
		pclose ( $pp );
		return $status;
	}
}