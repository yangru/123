<?php
/**
 * 通行证用户信息
 * @author Kevin
 */
require_once (dirname ( __FILE__ ) . '/../../library/nosql/MongoDB.php');
class PassportUser {
	private $db = null;
	private $table = 'passport_user';
	public function __construct() {
		$this->db = new Mongo_DB ();
	}
	public function insert_user($user_id, $register_ip, $gender = '', $age = '') {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '插入通行证用户' . $user_id, YII_INFO );
			$params = array (
					'id' => $user_id,
					'register_ip' => $register_ip,
					'gender' => $gender,
					'age' => $age 
			);
			return $this->db->insert ( $this->table, $params );
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '插入通行证用户失败：' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 查找用户
	 */
	public function search_user($register_region = '', $video_history = '', $gender = '', $begin_age = '', $end_age = '', $unread = '', $start = 0, $limit = 20, $userId = '', $uesrNickname = '') {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '查找通行证用户', YII_INFO );
			$cond = array ();
			if (! empty ( $register_region )) {
				$cond ['province'] = $register_region;
			}
			if (! empty ( $video_history )) {
				$cond ['video_history'] = $video_history;
			}
			if (! empty ( $gender )) {
				$cond ['gender'] = intval ( $gender );
			}
			if (! empty ( $begin_age )) {
				$cond ['age'] ['$gte'] = $begin_age;
			}
			if (! empty ( $end_age )) {
				$cond ['age'] ['$lte'] = $end_age;
			}
			if (! empty ( $userId )) {
				$cond ['id'] = intval ( $userId );
			}
			if (! empty ( $uesrNickname )) {
				$cond ['nickname'] = $uesrNickname;
			}
			$sync_model = new Synchronous ();
			if (empty ( $userId ) === false) {
				$sync_model->users ( array (
						intval ( $userId ) 
				) );
			}
			$result = $this->db->find_by_cond ( $this->table, $cond, $start, $limit, array (
					'id' => - 1 
			) );
			if (empty ( $userId ) === true) {
				$result ['items'] = $sync_model->users ( $result ['items'], true );
			}
			return $result;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '查找通行证用户失败：' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 保存手动干预用户推荐
	 */
	public function save_manual_recommend($uid, $video_ids) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '保存手动干预结果', YII_INFO );
			$table_name = 'ppuser_manual_recomm';
			$params = array (
					'uid' => intval ( $uid ),
					'video_ids' => $video_ids,
					'recomm_time' => time () * 1000,
					'recomm_count' => 0 
			);
			$this->db->insert ( $table_name, $params );
			
			// 更新用户未读标识
			$table_name = 'passport_user';
			$condition = array (
					'id' => intval ( $uid ) 
			);
			$update_field = array (
					'unread' => 1 
			);
			$this->db->update ( $table_name, $condition, $update_field );
			
			return true;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '保存手动干预失败：' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 更新手动干预用户推荐
	 */
	public function update_manual_recommend($uid, array $video_ids) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '更新手动干预结果', YII_INFO );
			$table_name = 'ppuser_manual_recomm';
			$condition = array (
					'uid' => intval ( $uid ) 
			);
			$update_field = array (
					'video_ids' => $video_ids,
					'recomm_time' => time () * 1000,
					'recomm_count' => 0 
			);
			$this->db->update ( $table_name, $condition, $update_field );
			
			// 更新用户未读标识
			$table_name = 'passport_user';
			$condition = array (
					'id' => intval ( $uid ) 
			);
			$update_field = array (
					'unread' => 1 
			);
			$this->db->update ( $table_name, $condition, $update_field );
			
			return true;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '更新手动干预失败：' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 是否已存在手动推荐记录
	 */
	public function is_exist_manual_recomm($uid) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '查看是否已存在干预推荐记录' . $uid, YII_INFO );
			$table_name = 'ppuser_manual_recomm';
			$cond = array (
					'uid' => intval ( $uid ) 
			);
			$result = $this->db->find_one ( $table_name, $cond );
			return $result;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '查询失败：' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 根据UID查询推荐记录
	 */
	public function find_recomm_by_uid($arrUids) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '根据UID查询推荐记录' . json_encode ( $arrUids ), YII_INFO );
			$table_name = 'ppuser_manual_recomm';
			$cond = array (
					'uid' => array (
							'$in' => $arrUids 
					) 
			);
			$result = $this->db->find_by_cond ( $table_name, $cond );
			return $result;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '查询失败：' . $e->getMessage (), YII_ERROR );
		}
	}
	/**
	 * 根据UID删除推荐记录
	 */
	public function remove_recomm_by_uid($intUid) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '根据UID删除推荐记录' . $intUid, YII_INFO );
			$table_name = 'ppuser_manual_recomm';
			$this->db->delete_one ( $table_name, array (
					'uid' => intval ( $intUid ) 
			) );
			return true;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '查询失败：' . $e->getMessage (), YII_ERROR );
		}
	}
}
