<?php
/**
 * 推荐视频源信息
 */
class RecommVideoSourceAction extends CAction {
	public function run($uid) {
		if (empty ( $uid )) {
			echo json_encode ( array (
					'error' => '参数错误' 
			) );
			return;
		}
		$passport_model = new PassportUser ();
		$result = $passport_model->find_recomm_by_uid ( array (
				intval ( $uid ) 
		) );
		$vids = array ();
		if (empty ( $result ['items'] ) === false) {
			$vids = $result ['items'] [0] ['video_ids'];
		}
		$video_model = new Video ();
		$result = $video_model->find_video_by_ids ( $vids );
		$json = json_encode ( array (
				'success' => true,
				'result' => $result 
		) );
		header ( 'Content-type: application/json' );
		echo $json;
		return;
	}
}
