<?php
/**
 * 结果干预方案信息
 * @author Kevin
 */
class ResultHandle {
	private $db = null;
	public function __construct() {
		$this->db = Yii::app ()->db;
	}
	public function __destruct() {
		$this->db->active = false;
	}
	
	/**
	 * 获取结果干预方案信息
	 */
	public function get_all_handleinfo($start = 0, $offset = 20, $recomm_obj = '') {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '获取结果干预方案信息', YII_INFO );
			$sql = "SELECT `id`, `name`, `type`, `setting`, `desc` FROM `algorithm_result_handle` WHERE `recomm_obj`='$recomm_obj' LIMIT $start, $offset";
			$st = $this->db->createCommand ( $sql );
			$data = $st->queryAll ();
			if (! empty ( $data )) {
				foreach ( $data as $key => $value ) {
					$data [$key] ['setting'] = json_decode ( $value ['setting'], true );
				}
			}
			return $data;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '获取结果干预方案信息失败' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 获取总条数
	 */
	public function get_handle_count($recomm_obj = '') {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '获取结果干预方案条数', YII_INFO );
			$sql = "SELECT COUNT(1) FROM `algorithm_result_handle` WHERE `recomm_obj`='$recomm_obj'";
			$st = $this->db->createCommand ( $sql );
			$st->execute ();
			$data = $st->queryAll ();
			if (! empty ( $data )) {
				$data = $data [0];
				return reset ( $data );
			}
			return $data;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '获取结果干预方案条数失败' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 获取某个结果干预方案的详细信息
	 */
	public function get_handle_detail($id) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '获取结果干预方案的详细信息  id:' . $id, YII_INFO );
			$id = intval ( $id );
			if ($id == 0) {
				return false;
			}
			$sql = "SELECT `id`, `name`, `type`, `setting`, `content`, `recomm_obj`, `desc` FROM `algorithm_result_handle` WHERE `id`=:id";
			$params [':id'] = $id;
			$st = $this->db->createCommand ( $sql );
			$st->bindParam ( ":id", $id, PDO::PARAM_INT );
			$data = $st->queryAll ( $params );
			if ($data) {
				return $data [0];
			} else {
				return false;
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '获取结果干预方案的详细信息失败' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 插入结果干预方案
	 */
	public function insert_result_handle($name, $type, $content = '', $setting_params = array(), $recomm_obj, $desc) {
		if (empty ( $setting_params ) && empty ( $content )) {
			return false;
		}
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '插入结果干预方案:' . $name, YII_INFO );
			$sql = "INSERT INTO `algorithm_result_handle` SET `name`=:name, `type`=:type, `recomm_obj`=:recomm_obj, `desc`=:desc";
			$params [':name'] = $name;
			$params [':type'] = $type;
			$params [':recomm_obj'] = $recomm_obj;
			$params [':desc'] = $desc;
			if (! empty ( $setting_params ) && is_array ( $setting_params )) {
				$sql .= ", `setting`=:setting";
				$params [':setting'] = json_encode ( $setting_params );
			}
			if (! empty ( $content )) {
				$sql .= ", `content`=:content";
				$params [':content'] = $content;
			}
			$st = $this->db->createCommand ( $sql );
			$ret = $st->execute ( $params );
			if ($ret === false) {
				return false;
			}
			return $ret;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '插入结果干预方案失败' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 更新结果干预方案
	 */
	public function update_result_handle($id, $content = '', $setting_params = array(), $recomm_obj = '', $desc = '') {
		$id = intval ( $id );
		if ($id == 0) {
			return false;
		}
		if (empty ( $setting_params ) && empty ( $content )) {
			return false;
		}
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '更新结果干预方案  id:' . $id, YII_INFO );
			$sql = "UPDATE `algorithm_result_handle` SET `recomm_obj`=:recomm_obj, `desc`=:desc";
			$params ['id'] = $id;
			$params [':recomm_obj'] = $recomm_obj;
			$params [':desc'] = $desc;
			if (! empty ( $setting_params ) && is_array ( $setting_params )) {
				$sql .= ", `setting`=:setting";
				$params ['setting'] = json_encode ( $setting_params );
			}
			if (! empty ( $content )) {
				$sql .= ", `content`=:content";
				$params ['content'] = $content;
			}
			$sql .= " WHERE `id`=:id";
			$st = $this->db->createCommand ( $sql );
			$ret = $st->execute ( $params );
			if ($ret === false) {
				return false;
			}
			return $ret;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '更新结果干预方案失败' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 删除结果干预方案
	 */
	public function del_result_handle($id) {
		$id = intval ( $id );
		if ($id == 0) {
			return false;
		}
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '删除结果干预方案  id:' . $id, YII_INFO );
			$sql = "DELETE FROM `algorithm_result_handle` WHERE `id`=:id";
			$params [':id'] = $id;
			$st = $this->db->createCommand ( $sql );
			$data = $st->execute ( $params );
			if ($data) {
				return true;
			} else {
				return false;
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '删除结果干预方案失败' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 判断过滤植入是否已存在
	 */
	public function is_exist($id) {
		$id = intval ( $id );
		if ($id == 0) {
			return false;
		}
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '判断过滤植入是否已存在', YII_INFO );
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
	public function where_exist($where) {
		if (empty ( $where ) || is_array ( $where ) === false) {
			return false;
		}
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '根据指定条件查询干预方案', YII_INFO );
			$strWhere = array ();
			foreach ( $where as $k => $v ) {
				$strWhere [] = '`' . $k . '`="' . $v . '"';
			}
			$sql = 'SELECT * FROM `algorithm_result_handle` WHERE ' . implode ( ' AND ', $strWhere );
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
