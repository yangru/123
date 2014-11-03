<?php
/**
 * 算法场景应用
 * @author Kevin
 */
class Scene {
	private $db = null;
	public function __construct() {
		$this->db = Yii::app ()->db;
	}
	public function __destruct() {
		$this->db->active = false;
	}
	
	/**
	 * 获取算法场景参数设置
	 */
	public function get_scene_settings_all() {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '获取算法场景参数设置', YII_INFO );
			$sql = "SELECT `id`,`object_type`,`algorithm_id`, `filter_id` FROM `algorithm_scene`";
			$st = $this->db->createCommand ( $sql );
			$st->execute ();
			$data = $st->queryAll ();
			if (! empty ( $data )) {
				$result = array ();
				foreach ( $data as $value ) {
					$result [$value ['id']] ['object_type'] = $value ['object_type'];
					$result [$value ['id']] ['algorithm_id'] = json_decode ( $value ['algorithm_id'], true );
					$result [$value ['id']] ['filter_id'] = json_decode ( $value ['filter_id'], true );
				}
				return $result;
			} else {
				return false;
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '获取算法场景参数设置失败' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 插入算法场景设置
	 */
	public function insert_scene_settings($object_type, $algorithm_id = null, $filter = array()) {
		if (empty ( $algorithm_id ) && empty ( $filter )) {
			return false;
		}
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '插入算法场景设置  algorithm_id:' . $algorithm_id, YII_INFO );
			$sql = "INSERT INTO `algorithm_scene` SET `object_type`=:object_type";
			$params [':object_type'] = $object_type;
			if (! empty ( $algorithm_id )) {
				$sql .= ", `algorithm_id`=:algorithm_id";
				$params [':algorithm_id'] = $algorithm_id;
			}
			if (! empty ( $filter ) && is_array ( $filter )) {
				$sql .= ", `filter_id`=:filter_id";
				$params [':filter_id'] = json_encode ( $filter );
			}
			$st = $this->db->createCommand ( $sql );
			$ret = $st->execute ( $params );
			if ($ret === false) {
				return false;
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '插入算法场景设置失败' . $e->getMessage (), YII_ERROR );
		}
		return $ret;
	}
	
	/**
	 * 更新算法场景设置
	 */
	public function update_scene_settings($id, $algorithm_id = null, $filter = array()) {
		$id = intval ( $id );
		if ($id == 0) {
			return false;
		}
		if (empty ( $algorithm_id ) && empty ( $filter )) {
			return false;
		}
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '更新算法场景设置  algorithm_id:' . $algorithm_id, YII_INFO );
			$sql = "UPDATE `algorithm_scene` SET";
			$params ['id'] = $id;
			if (! empty ( $algorithm_id )) {
				$sql .= "`algorithm_id`=:algorithm_id, ";
				$params [':algorithm_id'] = $algorithm_id;
			}
			if (! empty ( $filter ) && is_array ( $filter )) {
				$sql .= "`filter_id`=:filter_id, ";
				$params [':filter_id'] = json_encode ( $filter );
			}
			$sql = substr ( $sql, 0, strlen ( $sql ) - 2 );
			$sql .= " WHERE `id`=:id";
			$st = $this->db->createCommand ( $sql );
			$ret = $st->execute ( $params );
			if ($ret === false) {
				return false;
			}
			return $ret;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '更新算法场景设置失败' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 判断场景设置是否已存在
	 */
	public function is_exist($id) {
		$id = intval ( $id );
		if ($id == 0) {
			return false;
		}
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '判断场景设置是否已存在', YII_INFO );
			$sql = "SELECT `id` FROM `algorithm_scene` WHERE `id` = {$id}";
			$st = $this->db->createCommand ( $sql );
			$st->execute ();
			$data = $st->queryAll ();
			if ($data) {
				return true;
			} else {
				return false;
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '查询失败' . $e->getMessage (), YII_ERROR );
		}
	}
	/**
	 * 判断过滤植入是否已存在
	 */
	public function is_exist_handle($id) {
		$id = intval ( $id );
		if ($id == 0) {
			return false;
		}
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '判断过滤直入是否已存在', YII_INFO );
			$sql = "SELECT `id` FROM `algorithm_result_handle` WHERE `id` = {$id}";
			$st = $this->db->createCommand ( $sql );
			$st->execute ();
			$data = $st->queryAll ();
			if ($data) {
				return true;
			} else {
				return false;
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '查询失败' . $e->getMessage (), YII_ERROR );
		}
	}
}
