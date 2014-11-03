<?php
class ProcessManageAction extends CAction {
	public function run() {
		$process_info = require (dirname ( __FILE__ ) . '/../../config/process_info.php');
		$process_model = new Process ();
		$process_list = $process_model->get_process_all ();
		$data = array ();
		if (! empty ( $process_info ) && is_array ( $process_info )) {
			foreach ( $process_info as $key => $value ) {
				$format = array (
						'num' => null,
						'name' => null,
						'desc' => null,
						'status' => null,
						'file_path' => null,
						'interval' => null,
						'last_time' => null,
						'next_time' => null 
				);
				$format ['num'] = $key;
				$format ['name'] = $value ['name'];
				$format ['desc'] = $value ['desc'];
				$format ['file_path'] = $value ['file_path'];
				$temp = $process_model->process_status_all ();
				$temp = $temp [$process_info [$key] ['process_name']];
				$format ['interval'] = $temp ['interval'] / 3600000;
				
				$format ['last_time'] = date ( 'Y-m-d H:i:s', $temp ['pre'] / 1000 );
				if($temp['next'] == '未知'){
					$format ['next_time'] = $temp['next'];
				}else{
					$format ['next_time'] = date ( 'Y-m-d H:i:s', $temp ['next'] / 1000 );
				}
				
				$format ['status'] = intval ( trim ( $process_model->process_status ( $key ) ) ) ? 1 : 0;
				$data [] = $format;
			}
			$output = array (
					'success' => true,
					'result' => array (
							'items' => $data,
							'total' => count ( $data ) 
					) 
			);
			header ( 'Content-type: application/json' );
			echo json_encode ( $output );
			return;
		} else {
			echo json_encode ( array (
					'success' => true,
					'result' => array (
							'items' => array (),
							'total' => 0 
					) 
			) );
			return;
		}
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