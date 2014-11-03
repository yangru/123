<?php
/**
 * 视频类型
 */
class VideoTypeAction extends CAction {
	public function run() {
		// 获取视频类别
		$video_type_model = new VideoType ();
		$result = $video_type_model->search ();
		if ($result !== false) {
			$json = json_encode ( array (
					'success' => true,
					'result' => $result 
			) );
		} else {
			$json = json_encode ( array (
					'success' => true,
					'result' => array () 
			) );
		}
		header ( 'Content-type: application/json' );
		echo $json;
		return;
	}
}
