<?php
/**
 * 视频源明细数据
 * @author Kevin
 */
require_once (dirname ( __FILE__ ) . '/../../library/jsconf/jsconf.php');
require_once (dirname ( __FILE__ ) . '/../../library/nosql/MongoDB.php');
class Video {
	private $db = null;
	private $table = 'video_source';
	public function __construct() {
		$this->db = new Mongo_DB ();
	}
	public function search_video_by_vids($vids = array(), $video_type = '', $video_name = '', $begin_time = '', $end_time = '', $page = 1, $offset = 0) {
		$cond = array ();
		if ($vids !== null) {
			$cond ['vid'] ['$in'] = array ();
		}
		if (! empty ( $vids )) {
			$cond ['vid'] ['$in'] = $vids;
		}
		if (! empty ( $video_type )) {
			$cond ['type'] = $video_type;
		}
		if (! empty ( $video_name )) {
			$cond ['title'] = $this->db->like ( $video_name );
		}
		if (! empty ( $begin_time )) {
			$cond ['create_time'] ['$gte'] = $begin_time;
		}
		if (! empty ( $end_time )) {
			$cond ['create_time'] ['$lte'] = $end_time + 86399;
		}
		$start = ($page - 1) * $offset;
		$result = array (
				'items' => array (),
				'total' => 0 
		);
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '查询视频信息', YII_INFO );
			$result = $this->db->find_by_cond ( $this->table, $cond, $start, $offset );
			if (empty ( $result ['items'] ) === false) {
				$sync_model = new Synchronous ();
				$result ['items'] = $sync_model->videos ( $result ['items'] );
			}
			foreach ( $result ['items'] as $vk => $arrVideo ) {
				$result ['items'] [$vk] ['create_time'] = $arrVideo ['create_time'] === false ? '' : date ( 'Y-m-d H:i:s', $arrVideo ['create_time'] );
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '查询视频信息失败' . $e->getMessage (), YII_ERROR );
		}
		return $result;
	}
	public function find_video_by_ids($ids = array()) {
		$cond = array (
				'id' => array (
						'$in' => $ids 
				) 
		);
		$result = array (
				'items' => array (),
				'total' => 0 
		);
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '查询视频信息', YII_INFO );
			$result = $this->db->find_by_cond ( $this->table, $cond );
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '查询视频信息失败' . $e->getMessage (), YII_ERROR );
		}
		return $result;
	}
}
