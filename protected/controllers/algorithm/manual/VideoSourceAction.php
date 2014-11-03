<?php
/**
 * 视频源信息
 */
class VideoSourceAction extends CAction {
	public function run($title = '', $type = '', $begin_time = '', $end_time = '', $page = 1, $limit = 20, $vid = '') {
		// 获取视频源信息
		$arrVid = null;
		if (empty ( $vid ) === false)
			$arrVid = array (
					$vid 
			);
		$video_model = new Video ();
		$result = $video_model->search_video_by_vids ( $arrVid, urldecode ( $type ), urldecode ( $title ), strtotime ( $begin_time ), strtotime ( $end_time ), $page, $limit );
		$json = json_encode ( array (
				'success' => true,
				'result' => $result 
		) );
		header ( 'Content-type: application/json' );
		echo $json;
		return;
	}
}
