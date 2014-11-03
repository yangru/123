<?php
/**
 * 推荐结果预览
 */
require_once (dirname ( __FILE__ ) . '/../../../../library/nosql/MongoDB.php');
require_once (dirname ( __FILE__ ) . '/../../../../library/jsconf/jsconf.php');
class RecommendPreviewAction extends CAction {
	private function sort_by_key($keys, $array, $key) {
		$arrTmp = array ();
		foreach ( $array as $v ) {
			$arrTmp [$v [$key]] = $v;
		}
		$arrNew = array ();
		foreach ( $keys as $v ) {
			if (isset ( $arrTmp [$v] ))
				$arrNew [] = $arrTmp [$v];
		}
		return $arrNew;
	}
	public function run($id = '', $type = '', $vids = '') {
		if (! in_array ( $type, array (
				'1',
				'2',
				'3',
				'4' 
		) ) || $id === '') {
			header ( 'Content-type: application/json' );
			echo json_encode ( array (
					'error' => '参数错误' 
			) );
			return;
		}
		$remote_model = new CallRemote ();
		$mongo_db = new Mongo_DB ();
		if ($type == 1) {
			$arrUsers = $mongo_db->find_by_cond ( 'passport_user', array (
					'id' => intval ( $id ) 
			) );
			if (empty ( $arrUsers ['items'] ) === true) {
				header ( 'Content-type: application/json' );
				echo json_encode ( array (
						'error' => '用户不存在' 
				) );
				return;
			}
			$arrUsers = $mongo_db->find_by_cond ( 'video_source', array (
					'vid' => $vids 
			) );
			if (empty ( $arrUsers ['items'] ) === true) {
				header ( 'Content-type: application/json' );
				echo json_encode ( array (
						'error' => '视频不存在' 
				) );
				return;
			}
			$preview_videos = $remote_model->get_preview_video ( $id, $vids );
			$video_model = new Video ();
			$candidates = array (
					'items' => array (),
					'total' => 0 
			);
			$finalresult = array (
					'items' => array (),
					'total' => 0 
			);
			if (isset ( $preview_videos ['candidates'] ) && is_array ( $preview_videos ['candidates'] )) {
				$candidates_id = array ();
				foreach ( $preview_videos ['candidates'] as $value ) {
					if (is_array ( $value )) {
						$candidates_id [] = $value ['id'];
					}
				}
				$candidates = $video_model->search_video_by_vids ( $candidates_id );
				$candidates ['items'] = $this->sort_by_key ( $candidates_id, $candidates ['items'], 'vid' );
			}
			if (isset ( $preview_videos ['finalResults'] ) && is_array ( $preview_videos ['finalResults'] )) {
				$finalresult_id = array ();
				foreach ( $preview_videos ['finalResults'] as $value ) {
					if (is_array ( $value )) {
						$finalresult_id [] = $value ['id'];
					}
				}
				$finalresult = $video_model->search_video_by_vids ( $finalresult_id );
				$finalresult ['items'] = $this->sort_by_key ( $finalresult_id, $finalresult ['items'], 'vid' );
			}
			$result = array (
					'candidates' => $candidates,
					'finalresult' => $finalresult 
			);
		} else if ($type == 2) {
			$weibo_model = new WeiboModel ();
			$result = $weibo_model->friendsRecommend ( $id );
			if ($result === false) {
				return;
			}
		} else if ($type == 3) {
			$weibo_model = new WeiboModel ();
			$result = $weibo_model->contentRecommend ( $id );
			if ($result === false) {
				return;
			}
		} else if ($type == 4) {
			$jsconf = jsconf_load ( 'api_server' );
			$handle = fopen ( $jsconf . '/friend/recommend/format/json?uid=' . $id . '&dzl=1988', 'rb' );
			$strJson = '';
			while ( ! feof ( $handle ) ) {
				$strJson .= fread ( $handle, 8192 );
			}
			fclose ( $handle );
			$arrJson = json_decode ( $strJson, true );
			if ($arrJson ['status'] === 0) {
				$json = json_encode ( array (
						'success' => false,
						'error' => $arrJson ['error'] 
				) );
				header ( 'Content-type: application/json' );
				echo $json;
				return;
			}
			$result = array (
					'items' => $arrJson ['data'],
					'total' => $arrJson ['counters'] 
			);
		}
		if (! empty ( $result )) {
			$json = json_encode ( array (
					'success' => true,
					'result' => $result 
			) );
		} else {
			$json = json_encode ( array (
					'success' => true,
					'result' => array (
							'items' => array (),
							'total' => 0 
					) 
			) );
		}
		header ( 'Content-type: application/json' );
		echo $json;
		return;
	}
}
