<?php
/**
 * 视频类型数据
 * @author daizhaolin
 */
require_once (dirname ( __FILE__ ) . '/../../library/nosql/MongoDB.php');
class VideoType {
	private $db = null;
	private $table = 'video_type';
	public function __construct() {
		$this->db = new Mongo_DB ();
	}
	public function insert($strType) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '插入视频类型', YII_INFO );
			$this->db->upsert ( $this->table, array (
					'type' => $strType 
			), array (
					'type' => $strType 
			) );
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '插入视频类型失败 ' . $e->getMessage (), YII_ERROR );
			return false;
		}
		return true;
	}
	public function search() {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '查询视频类型', YII_INFO );
			$result = $this->db->find_by_cond ( $this->table );
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '查询视频类型失败 ' . $e->getMessage (), YII_ERROR );
			return false;
		}
		return $result;
	}
}
