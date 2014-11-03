<?php

/**
 * 微博数据读取
 * @author Kevin
 */
require_once (dirname ( __FILE__ ) . '/../../library/nosql/MongoDB.php');
class WeiboModel {
	private $db = null;
	private $weibo_config;
	public function __construct() {
		$this->weibo_config = include (dirname ( __FILE__ ) . '/../config/weibo_config.php');
		$this->db = new Mongo_DB ();
	}
	/**
	 * 冒泡排序
	 *
	 * @param unknown $arrArr        	
	 * @param unknown $strKey        	
	 */
	private function _bubble_sort_by_key($arrArr, $strKey) {
		$intArrCount = count ( $arrArr );
		for($i = 0; $i < $intArrCount; $i ++) {
			for($j = $intArrCount - 1; $j > $i; $j --) {
				if ($arrArr [$j] [$strKey] > $arrArr [$j - 1] [$strKey]) {
					$arrTemp = $arrArr [$j];
					$arrArr [$j] = $arrArr [$j - 1];
					$arrArr [$j - 1] = $arrTemp;
				}
			}
		}
		return $arrArr;
	}
	/**
	 *
	 * @param unknown $arrArr        	
	 * @param unknown $strKey        	
	 */
	private function _get_id_by_key($arrArr, $strKey) {
		$arrIds = array ();
		foreach ( $arrArr as $ak => $av ) {
			$arrIds [] = $av [$strKey];
		}
		return $arrIds;
	}
	/**
	 * 根据微博ID查询微博内容明细
	 */
	public function fans_count_by_uid($strUid) {
		$count = 0;
		$count += $this->db->count_by_cond ( 'xwb_user_follow', array (
				'$or' => array (
						array (
								'type' => 1,
								'followed_uid' => $strUid 
						),
						array (
								'type' => 2,
								'uid' => $strUid 
						),
						array (
								'type' => 2,
								'followed_uid' => $strUid 
						) 
				) 
		) );
		return $count;
	}
	/**
	 * 根据微博ID查询微博内容明细
	 */
	public function query_weibo_by_ids($ids) {
		if (! is_array ( $ids )) {
			return false;
		}
		$cond = array ();
		$cond ['wb_id'] ['$in'] = $ids;
		try {
			$result = $this->db->find_by_cond ( 'wb_info', $cond );
			if (! empty ( $result ['items'] )) {
				$data = array ();
				foreach ( $result ['items'] as $value ) {
					$data [$value ['wb_id']] = $value;
				}
				$result ['items'] = $data;
			}
			Yii::log ( __CLASS__, __FUNCTION__, '根据微博ID查询微博内容明细(wb_ids:' . implode ( ',', $ids ) . ')', YII_INFO );
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '根据微博ID查询微博内容明细失败：' . $e->getMessage (), YII_ERROR );
		}
		return $result;
	}
	
	/**
	 * 根据微博ID查询微博内容明细(包含详细用户信息)
	 */
	public function query_weibo_detail_by_ids($ids) {
		if (! is_array ( $ids )) {
			return false;
		}
		Yii::log ( __CLASS__, __FUNCTION__, '根据微博ID查询微博内容明细(包含详细用户信息)', YII_INFO );
		$weibo_list = $this->query_weibo_by_ids ( $ids );
		if (! empty ( $weibo_list ['items'] )) {
			$uid_arr = array ();
			foreach ( $weibo_list ['items'] as $value ) {
				$uid_arr [] = intval ( $value ['user_id'] );
			}
			$uid_list = $this->query_weibo_user_by_ids ( $uid_arr );
			if (! empty ( $uid_list ['items'] )) {
				$result = array (
						'items' => array (),
						'total' => $weibo_list ['total'] 
				);
				foreach ( $weibo_list ['items'] as $value ) {
					$format = array (
							'wb_id' => '',
							'category' => '',
							'content' => '',
							'public_date' => '',
							'user_id' => '',
							'user_name' => '',
							'user_url' => '' 
					);
					$format ['wb_id'] = $value ['wb_id'];
					$format ['public_date'] = date ( 'Y-m-d H:i:s', $value ['date'] / 1000 );
					$format ['user_id'] = $value ['user_id'];
					$format ['face'] = $this->getFaceImg ( $value ['user_id'] );
					$format ['content'] = $value ['content'];
					$format ['user_url'] = sprintf ( $this->weibo_config ['user_url'], $value ['user_id'] );
					if (isset ( $uid_list ['items'] [$value ['user_id']] )) {
						$format ['user_nick'] = $uid_list ['items'] [$value ['user_id']] ['nickname'];
						$format ['verifycategid'] = isset ( $uid_list ['items'] [$value ['user_id']] ['verifycategid'] ) ? $uid_list ['items'] [$value ['user_id']] ['verifycategid'] : 0;
					}
					$result ['items'] [] = $format;
				}
				return $result;
			}
		}
		return false;
	}
	
	/**
	 * 根据微博用户ID查询微博用户信息
	 */
	public function query_weibo_user_by_ids($ids) {
		if (! is_array ( $ids )) {
			return false;
		}
		$cond = array ();
		$cond ['uid'] ['$in'] = $ids;
		try {
			$result = $this->db->find_by_cond ( 'xwb_users', $cond );
			if (! empty ( $result ['items'] )) {
				$data = array ();
				foreach ( $result ['items'] as $value ) {
					$value ['face'] = $this->getFaceImg ( $value ['uid'] );
					$data [$value ['uid']] = $value;
				}
				$result ['items'] = $data;
			}
			Yii::log ( __CLASS__, __FUNCTION__, '根据微博用户ID查询微博用户信息(use_ids:' . implode ( ',', $ids ) . ')', YII_INFO );
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '根据微博用户ID查询微博用户信息失败：' . $e->getMessage (), YII_ERROR );
		}
		return $result;
	}
	
	/**
	 * 降序对微博进行排行
	 */
	public function query_weibo_rank($start_time, $end_time, $type = '', $page = 1, $offset = 20) {
		$cond = array ();
		$start = ($page - 1) * $offset;
		if (! empty ( $type ) && $type !== - 1) {
			$cond ['verifycategid'] = $type;
		}
		$cond ['date'] ['$gte'] = intval ( $start_time );
		$cond ['date'] ['$lte'] = intval ( $end_time );
		$order_by = array (
				'all_count' => - 1 
		);
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '降序对微博进行排行 ', YII_INFO );
			$result = $this->db->find_by_cond ( 'wb_ranking_list', $cond, $start, $offset, $order_by );
			if (! empty ( $result ['items'] )) {
				$data = array ();
				foreach ( $result ['items'] as $value ) {
					if (isset ( $data [$value ['wb_id']] ) === false) {
						$data [$value ['wb_id']] = $value;
					} else {
						$data [$value ['wb_id']] ['forward_count'] += $value ['forward_count'];
						$data [$value ['wb_id']] ['all_count'] += $value ['all_count'];
						$data [$value ['wb_id']] ['comment_count'] += $value ['comment_count'];
					}
				}
				$result ['items'] = $this->_bubble_sort_by_key ( array_values ( $data ), 'all_count' );
				return $result;
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '降序对微博进行排行失败：' . $e->getMessage (), YII_ERROR );
		}
		return false;
	}
	
	/**
	 * 降序对微博用户进行排行
	 */
	public function query_weibo_user_rank($start_time, $end_time, $type = '', $page = 1, $offset = 20) {
		$cond = array ();
		$start = ($page - 1) * $offset;
		if (! empty ( $type ) && $type !== - 1) {
			$cond ['verifycategid'] = $type;
		}
		$cond ['date'] ['$gte'] = intval ( $start_time );
		$cond ['date'] ['$lte'] = intval ( $end_time );
		$order_by = array (
				'all_count' => - 1 
		);
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '降序对微博用户进行排行 ', YII_INFO );
			$result = $this->db->find_by_cond ( 'user_ranking_list', $cond, $start, $offset, $order_by );
			if (! empty ( $result ['items'] )) {
				$data = array ();
				foreach ( $result ['items'] as $value ) {
					if (isset ( $data [$value ['user_id']] ) === false) {
						$data [$value ['user_id']] = $value;
					} else {
						$data [$value ['user_id']] ['funs_count'] += $value ['funs_count'];
						$data [$value ['user_id']] ['all_count'] += $value ['all_count'];
						$data [$value ['user_id']] ['at_count'] += $value ['at_count'];
					}
				}
				$result ['items'] = $this->_bubble_sort_by_key ( array_values ( $data ), 'all_count' );
				return $result;
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '降序对微博用户进行排行失败：' . $e->getMessage (), YII_ERROR );
		}
		return false;
	}
	
	/**
	 * 降序对微博话题进行排行
	 */
	public function query_weibo_topic_rank($start_time, $end_time, $page = 1, $offset = 20) {
		$cond = array ();
		$start = ($page - 1) * $offset;
		$cond ['date'] ['$gte'] = intval ( $start_time );
		$cond ['date'] ['$lte'] = intval ( $end_time );
		$order_by = array (
				'all_count' => - 1 
		);
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '降序对微博用户进行排行 ', YII_INFO );
			$result = $this->db->find_by_cond ( 'topic_rank_list', $cond, $start, $offset, $order_by );
			if (! empty ( $result ['items'] )) {
				$arrNewResult = array ();
				foreach ( $result ['items'] as $k => $v ) {
					if (isset ( $arrNewResult [$v ['topic_name']] ) === false) {
						$arrNewResult [$v ['topic_name']] = $v;
					} else {
						$arrNewResult [$v ['topic_name']] ['content_count'] += $v ['content_count'];
						$arrNewResult [$v ['topic_name']] ['all_count'] += $v ['all_count'];
						$arrNewResult [$v ['topic_name']] ['interact_count'] += $v ['interact_count'];
					}
				}
				$result ['items'] = $this->_bubble_sort_by_key ( array_values ( $arrNewResult ), 'all_count' );
			}
			return $result;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '降序对微博用户进行排行失败：' . $e->getMessage (), YII_ERROR );
		}
		return false;
	}
	
	/**
	 * 按潜力值降序对微博进行排行
	 */
	public function query_weibo_potential_rank($date, $hour, $page = 1, $offset = 20) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '按潜力值降序对微博进行排行 ', YII_INFO );
			$cond = array ();
			$start = ($page - 1) * $offset;
			$cond ['date'] = intval ( $date );
			$cond ['hour'] = intval ( $hour );
			$order_by = array (
					'val' => - 1 
			);
			$result = $this->db->find_by_cond ( 'wb_potentials_hour', $cond, $start, $offset, $order_by );
			if (! empty ( $result ['items'] )) {
				$data = array ();
				foreach ( $result ['items'] as $value ) {
					$data [$value ['wb_id']] = $value;
				}
				$result ['items'] = $data;
				return $result;
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '按潜力值降序对微博进行排行失败：' . $e->getMessage (), YII_ERROR );
		}
		return false;
	}
	
	/**
	 * 热点微博排行榜
	 */
	public function hot_weibo_rank($start_time, $end_time, $type, $page, $offset) {
		$list = $this->query_weibo_rank ( $start_time, $end_time, $type, $page, $offset );
		if (! empty ( $list ['items'] )) {
			$weibo_type_model = new WeiboTypeModel ();
			$uids = $this->_get_id_by_key ( $list ['items'], 'user_id' );
			$uids = array_unique ( $uids );
			$users = $this->query_weibo_user_by_ids ( $uids );
			foreach ( $list ['items'] as $key => $value ) {
				$format = array (
						'wb_id' => '',
						'user_id' => '',
						'user_name' => '',
						'user_face' => '',
						'content' => '',
						'public_time' => '',
						'forward_count' => '',
						'comment_count' => '',
						'wb_url' => '' 
				);
				$format ['wb_id'] = $value ['wb_id'];
				$format ['content'] = array_key_exists ( 'content', $value ) ? $value ['content'] : '';
				$format ['public_time'] = date ( 'Y-m-d H:i:s', ($value ['public_date'] / 1000) );
				$format ['forward_count'] = isset ( $value ['forward_count'] ) ? $value ['forward_count'] : 0;
				$format ['comment_count'] = isset ( $value ['comment_count'] ) ? $value ['comment_count'] : 0;
				$format ['wb_url'] = sprintf ( $this->weibo_config ['weibo_url'], $value ['wb_id'] );
				if (isset ( $users ['items'] [$value ['user_id']] )) {
					if (isset ( $users ['items'] [$value ['user_id']] ['verifycategid'] ) === true) {
						$verifycategid = $users ['items'] [$value ['user_id']] ['verifycategid'];
						$verifycategid = intval ( $verifycategid );
						$arrTypes = $weibo_type_model->find_type_by_ids ( array (
								$verifycategid 
						) );
						$category = $arrTypes [$verifycategid];
					} else {
						$category = '';
					}
					$format ['category'] = $category;
					$format ['user_id'] = $users ['items'] [$value ['user_id']] ['uid'];
					$format ['user_name'] = $users ['items'] [$value ['user_id']] ['nickname'];
					$format ['user_face'] = isset ( $users ['items'] [$value ['user_id']] ['face'] ) ? $users ['items'] [$value ['user_id']] ['face'] : '';
				}
				$list ['items'] [$key] = $format;
			}
			return $list;
		}
		return array (
				'items' => array (),
				'total' => 0 
		);
	}
	
	/**
	 * 热点用户排行
	 */
	public function hot_weibo_user_rank($start_time, $end_time, $type, $page, $offset) {
		$list = $this->query_weibo_user_rank ( $start_time, $end_time, $type, $page, $offset );
		if (! empty ( $list ['items'] )) {
			$uids = $this->_get_id_by_key ( $list ['items'], 'user_id' );
			$users = $this->query_weibo_user_by_ids ( $uids );
			$weibo_type_model = new WeiboTypeModel ();
			foreach ( $list ['items'] as $key => $value ) {
				if (isset ( $users ['items'] [$value ['user_id']] )) {
					$format = array (
							'user_id' => '',
							'user_name' => '',
							'user_face' => '',
							'at_count' => '',
							'funs_count' => '',
							'user_url' => '',
							'usertype' => '',
							'category' => '' 
					);
					$format ['at_count'] = isset ( $value ['at_count'] ) ? $value ['at_count'] : 0;
					$format ['funs_count'] = isset ( $value ['funs_count'] ) ? $value ['funs_count'] : 0;
					$format ['user_url'] = sprintf ( $this->weibo_config ['user_url'], $value ['user_id'] );
					$format ['user_id'] = $users ['items'] [$value ['user_id']] ['uid'];
					$format ['user_name'] = $users ['items'] [$value ['user_id']] ['nickname'];
					$format ['user_face'] = isset ( $users ['items'] [$value ['user_id']] ['face'] ) ? $users ['items'] [$value ['user_id']] ['face'] : '';
					if (isset ( $users ['items'] [$value ['user_id']] ['verifycategid'] ) === true) {
						$verifycategid = $users ['items'] [$value ['user_id']] ['verifycategid'];
						$verifycategid = intval ( $verifycategid );
						$arrTypes = $weibo_type_model->find_type_by_ids ( array (
								$verifycategid 
						) );
						$category = $arrTypes [$verifycategid];
					} else {
						$category = '';
					}
					$format ['category'] = $category;
					$list ['items'] [$key] = $format;
				} else {
					unset ( $list ['items'] [$key] );
				}
			}
			return $list;
		}
		return array (
				'items' => array (),
				'total' => 0 
		);
	}
	
	/**
	 * 潜力微博排行
	 */
	public function weibo_potential_rank($page = 1, $offset = 20) {
		$date = strtotime ( date ( 'Y-m-d' ) );
		$hour = intval ( date ( 'H' ) ) - 1;
		if ($hour < 0) {
			$date = strtotime ( date ( 'Y-m-d' ) ) - 86400;
			$hour = 23;
		}
		$result = $this->query_weibo_potential_rank ( $date * 1000, $hour, $page, $offset );
		if (! empty ( $result ['items'] )) {
			$wb_ids = array_keys ( $result ['items'] );
			$wb_list = $this->query_weibo_detail_by_ids ( $wb_ids );
			$data = array ();
			foreach ( $wb_list ['items'] as $value ) {
				$data [$value ['wb_id']] = $value;
			}
			foreach ( $result ['items'] as $key => $value ) {
				if (array_key_exists ( $key, $data ) === false) {
					continue;
				}
				$temp ['content'] = $data [$key] ['content'];
				$temp ['forward_count'] = $value ['count'];
				$temp ['potential'] = number_format ( $value ['val'], 2 );
				$temp ['public_date'] = $data [$key] ['public_date'];
				$temp ['username'] = $data [$key] ['user_nick'];
				$temp ['wb_url'] = sprintf ( $this->weibo_config ['weibo_url'], $data [$key] ['wb_id'] );
				$temp ['fans'] = $this->fans_count_by_uid ( $data [$key] ['user_id'] );
				$potential_list [] = $temp;
			}
			$result ['items'] = $potential_list;
			return $result;
		} else {
			return array (
					'items' => array (),
					'total' => 0 
			);
		}
	}
	
	/**
	 * 查看某条微博的热度趋势
	 */
	public function query_weibo_trend_by_id($id, $start_date, $end_date) {
		$start_time = strtotime ( $start_date );
		$end_time = strtotime ( $end_date );
		if (empty ( $id ) || empty ( $start_time ) || empty ( $end_time ) || $end_time - $start_time > 86400 * 30) {
			return false;
		}
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '查看微博的热度趋势  wb_id:' . $id, YII_INFO );
			$group_by_day = 0;
			if ($end_time - $start_time > 86400 * 3) { // 大于三天的数据按天统计
				$group_by_day = 1;
			}
			$trend_list = array ();
			$cond = array ();
			$cond ['wb_id'] = intval ( $id );
			$cond ['monitor_date'] ['$gte'] = intval ( $start_time ) * 1000;
			$cond ['monitor_date'] ['$lt'] = intval ( $end_time ) * 1000;
			
			if ($group_by_day == 1) { // 按天查询
				$key = array (
						'monitor_date' => 1 
				);
				$initial = array (
						'forward_count' => 0,
						'comment_count' => 0 
				);
				$reduce = "function (obj, out) {out.forward_count+=obj.forward_count;out.comment_count+=obj.comment_count;}";
				$result = $this->db->group ( 'wb_monitor_hour', $key, $initial, $reduce, $cond );
				if (! empty ( $result ['retval'] )) {
					$data = array ();
					foreach ( $result ['retval'] as $value ) {
						$key = $value ['monitor_date'];
						$data [$key] = $value;
					}
					for($i = $start_time; $i < $end_time; $i += 86400) {
						$key = date ( 'm.d', $i );
						if (isset ( $data [$i * 1000] )) {
							$temp = $data [$i * 1000];
							$trend_list [$key] ['forward_count'] = isset ( $temp ['forward_count'] ) ? $temp ['forward_count'] : 0;
							$trend_list [$key] ['comment_count'] = isset ( $temp ['comment_count'] ) ? $temp ['comment_count'] : 0;
						} else {
							$trend_list [$key] ['forward_count'] = 0;
							$trend_list [$key] ['comment_count'] = 0;
						}
					}
				}
			} else if (! $group_by_day) { // 按小时查询
				$result = $this->db->find_by_cond ( 'wb_monitor_hour', $cond );
				if (! empty ( $result ['items'] )) {
					$data = array ();
					foreach ( $result ['items'] as $value ) {
						$key = $value ['monitor_date'] + $value ['hour'] * 3600000;
						$data [$key] = $value;
					}
					$hour = 0;
					for($i = $start_time; $i < $end_time; $i += 3600) {
						if (isset ( $data [$i * 1000] )) {
							$temp = $data [$i * 1000];
							$trend_list [$hour . ':00'] ['forward_count'] = isset ( $temp ['forward_count'] ) ? $temp ['forward_count'] : 0;
							$trend_list [$hour . ':00'] ['comment_count'] = isset ( $temp ['comment_count'] ) ? $temp ['comment_count'] : 0;
						} else {
							$trend_list [$hour . ':00'] ['forward_count'] = 0;
							$trend_list [$hour . ':00'] ['comment_count'] = 0;
						}
						$hour ++;
					}
				}
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '查看微博的热度趋势失败：' . $e->getMessage (), YII_ERROR );
		}
		return $trend_list;
	}
	
	/**
	 * 查看某个用户的热度趋势
	 */
	public function query_weibo_user_trend_by_id($id, $start_date, $end_date) {
		$start_time = strtotime ( $start_date );
		$end_time = strtotime ( $end_date );
		if (empty ( $id ) || empty ( $start_time ) || empty ( $end_time ) || $end_time - $start_time > 86400 * 30) {
			return false;
		}
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '查看微博用户的热度趋势  uid:' . $id, YII_INFO );
			$group_by_day = 0;
			if ($end_time - $start_time > 86400 * 3) { // 大于三天的数据按天统计
				$group_by_day = 1;
			}
			$trend_list = array ();
			$cond = array ();
			$cond ['user_id'] = intval ( $id );
			$cond ['monitor_date'] ['$gte'] = intval ( $start_time ) * 1000;
			$cond ['monitor_date'] ['$lt'] = intval ( $end_time ) * 1000;
			
			if ($group_by_day == 1) { // 按天查询
				$key = array (
						'monitor_date' => 1 
				);
				$initial = array (
						'at_count' => 0,
						'funs_count' => 0 
				);
				$reduce = "function (obj, out) {out.at_count+=obj.at_count;out.funs_count+=obj.funs_count;}";
				$result = $this->db->group ( 'user_monitor_hour', $key, $initial, $reduce, $cond );
				if (! empty ( $result ['retval'] )) {
					$data = array ();
					foreach ( $result ['retval'] as $value ) {
						$key = $value ['monitor_date'];
						$data [$key] = $value;
					}
					for($i = $start_time; $i < $end_time; $i += 86400) {
						$key = date ( 'm.d', $i );
						if (isset ( $data [$i * 1000] )) {
							$temp = $data [$i * 1000];
							
							$trend_list [$key] ['at_count'] = isset ( $temp ['at_count'] ) ? $temp ['at_count'] : 0;
							$trend_list [$key] ['funs_count'] = isset ( $temp ['funs_count'] ) ? $temp ['funs_count'] : 0;
						} else {
							$trend_list [$key] ['at_count'] = 0;
							$trend_list [$key] ['funs_count'] = 0;
						}
					}
				}
			} else if (! $group_by_day) { // 按小时查询
				$result = $this->db->find_by_cond ( 'user_monitor_hour', $cond );
				if (! empty ( $result ['items'] )) {
					$data = array ();
					foreach ( $result ['items'] as $value ) {
						$key = $value ['monitor_date'] + $value ['hour'] * 3600000;
						$data [$key] = $value;
					}
					$hour = 0;
					for($i = $start_time; $i < $end_time; $i += 3600) {
						if (isset ( $data [$i * 1000] )) {
							$temp = $data [$i * 1000];
							$trend_list [$hour . ':00'] ['at_count'] = isset ( $temp ['at_count'] ) ? $temp ['at_count'] : 0;
							$trend_list [$hour . ':00'] ['funs_count'] = isset ( $temp ['funs_count'] ) ? $temp ['funs_count'] : 0;
						} else {
							$trend_list [$hour . ':00'] ['at_count'] = 0;
							$trend_list [$hour . ':00'] ['funs_count'] = 0;
						}
						$hour ++;
					}
				}
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '查看微博用户的热度趋势失败：' . $e->getMessage (), YII_ERROR );
		}
		return $trend_list;
	}
	
	/**
	 * 查看某个话题的热度趋势
	 */
	public function query_weibo_topic_trend($topic, $start_date, $end_date) {
		$start_time = strtotime ( $start_date );
		$end_time = strtotime ( $end_date );
		if (empty ( $topic ) || empty ( $start_time ) || empty ( $end_time ) || $end_time - $start_time > 86400 * 30) {
			return false;
		}
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '查看微博话题的热度趋势  topic:' . $topic, YII_INFO );
			$group_by_day = 0;
			if ($end_time - $start_time > 86400 * 3) { // 大于三天的数据按天统计
				$group_by_day = 1;
			}
			$trend_list = array ();
			$cond = array ();
			$cond ['topic_name'] = $topic;
			$cond ['day'] ['$gte'] = intval ( $start_time ) * 1000;
			$cond ['day'] ['$lt'] = intval ( $end_time ) * 1000;
			
			if ($group_by_day == 1) { // 按天查询
				$key = array (
						'day' => 1 
				);
				$initial = array (
						'content_count' => 0,
						'interact_count' => 0 
				);
				$reduce = "function (obj, out) {out.content_count+=obj.content_count;out.interact_count+=obj.interact_count;}";
				$result = $this->db->group ( 'topic_monitor_hour', $key, $initial, $reduce, $cond );
				if (! empty ( $result ['retval'] )) {
					$data = array ();
					foreach ( $result ['retval'] as $value ) {
						$key = $value ['day'];
						$data [$key] = $value;
					}
					for($i = $start_time; $i < $end_time; $i += 86400) {
						$key = date ( 'm.d', $i );
						if (isset ( $data [$i * 1000] )) {
							$temp = $data [$i * 1000];
							
							$trend_list [$key] ['content_count'] = isset ( $temp ['content_count'] ) ? $temp ['content_count'] : 0;
							$trend_list [$key] ['interact_count'] = isset ( $temp ['interact_count'] ) ? $temp ['interact_count'] : 0;
						} else {
							$trend_list [$key] ['content_count'] = 0;
							$trend_list [$key] ['interact_count'] = 0;
						}
					}
				}
			} else if (! $group_by_day) { // 按小时查询
				$result = $this->db->find_by_cond ( 'topic_monitor_hour', $cond );
				if (! empty ( $result ['items'] )) {
					$data = array ();
					foreach ( $result ['items'] as $value ) {
						$key = $value ['day'] + $value ['hour'] * 3600000;
						$data [$key] = $value;
					}
					$hour = 0;
					for($i = $start_time; $i < $end_time; $i += 3600) {
						if (isset ( $data [$i * 1000] )) {
							$temp = $data [$i * 1000];
							$trend_list [$hour . ':00'] ['content_count'] = isset ( $temp ['content_count'] ) ? $temp ['content_count'] : 0;
							$trend_list [$hour . ':00'] ['interact_count'] = isset ( $temp ['interact_count'] ) ? $temp ['interact_count'] : 0;
						} else {
							$trend_list [$hour . ':00'] ['content_count'] = 0;
							$trend_list [$hour . ':00'] ['interact_count'] = 0;
						}
						$hour ++;
					}
				}
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '查看微博话题的热度趋势失败：' . $e->getMessage (), YII_ERROR );
		}
		return $trend_list;
	}
	function getFaceImg($uid, $size = '60') {
		$size = $size . 'x' . $size;
		return 'http://userface.img.cctvpic.com/' . $size . '/' . ($uid % 999) . '/' . (intval ( $uid / 7 ) % 999) . '/' . $uid . '.jpg';
	}
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
	function friendsRecommend($id) {
		$remote_model = new CallRemote ();
		$mongo_db = new Mongo_DB ();
		$arrUsers = $mongo_db->find_by_cond ( 'xwb_users', array (
				'uid' => intval ( $id ) 
		) );
		if (empty ( $arrUsers ['items'] ) === true) {
			header ( 'Content-type: application/json' );
			echo json_encode ( array (
					'error' => '用户不存在' 
			) );
			return false;
		}
		$arrUsers = $mongo_db->find_by_cond ( 'passport_user', array (
				'id' => $arrUsers ['items'] [0] ['uid'] 
		) );
		$arrUser = $arrUsers ['items'] [0];
		$ids = $remote_model->get_weibo_user_recommend ( $id );
		$result = $this->query_weibo_user_by_ids ( $ids );
		$arrUids = array ();
		foreach ( $result ['items'] as $uk => $uv ) {
			$arrUids [] = $uv ['uid'];
		}
		$arrUsers = $mongo_db->find_by_cond ( 'passport_user', array (
				'id' => array (
						'$in' => $arrUids 
				) 
		) );
		$sync_model = new Synchronous ();
		$arrUsers = $sync_model->users ( $arrUsers ['items'], true );
		$arrUsersNew = array ();
		foreach ( $arrUsers as $uk => $uv ) {
			$arrUsersNew [$uv ['id']] = $uv;
		}
		$weibo_config = include (dirname ( __FILE__ ) . '/../config/weibo_config.php');
		$education_config = include (dirname ( __FILE__ ) . '/../config/education_config.php');
		$industry_config = include (dirname ( __FILE__ ) . '/../config/industry_config.php');
		global $education_config;
		global $industry_config;
		if (! empty ( $result ['items'] )) {
			$result ['items'] = $this->sort_by_key ( $ids, $result ['items'], 'uid' );
			foreach ( $result ['items'] as $key => $value ) {
				$data ['id'] = $value ['uid'];
				$data ['nickname'] = isset ( $value ['nickname'] ) ? $value ['nickname'] : '';
				$data ['face'] = isset ( $value ['face'] ) ? $value ['face'] : '';
				$data ['usertype'] = isset ( $value ['usertype'] ) ? $value ['usertype'] : '';
				$data ['user_url'] = sprintf ( $weibo_config ['user_url'], $value ['uid'] );
				$arrReason = array ();
				if (isset ( $arrUsersNew [$value ['uid']] ) === true) {
					$arrTempUser = $arrUsersNew [$value ['uid']];
					if ($arrTempUser ['gender'] === $arrUser ['gender']) {
						$arrReason [] = $arrTempUser ['gender'] === 1 ? '男' : $arrTempUser ['gender'] === 2 ? '女' : '保密';
					}
					if ($arrTempUser ['age'] === $arrUser ['age']) {
						$arrReason [] = intval ( date ( 'Y' ) ) - intval ( $arrTempUser ['age'] ) + 1;
					}
					if ($arrTempUser ['city'] === $arrUser ['city']) {
						$arrReason [] = $arrTempUser ['city'];
					}
					if ($arrTempUser ['education'] !== 0 && $arrTempUser ['education'] === $arrUser ['education']) {
						$arrReason [] = $education_config [$arrTempUser ['education']];
					}
					if ($arrTempUser ['industry'] !== 0 && $arrTempUser ['industry'] === $arrUser ['industry']) {
						$arrReason [] = $industry_config [$arrTempUser ['industry']];
					}
				}
				$data ['reason'] = $arrReason;
				$result ['items'] [$key] = $data;
			}
			$result ['items'] = array_values ( $result ['items'] );
		}
		return $result;
	}
	function contentRecommend($id) {
		$remote_model = new CallRemote ();
		$mongo_db = new Mongo_DB ();
		$arrUsers = $mongo_db->find_by_cond ( 'xwb_users', array (
				'uid' => intval ( $id ) 
		) );
		if (empty ( $arrUsers ['items'] ) === true) {
			header ( 'Content-type: application/json' );
			echo json_encode ( array (
					'error' => '用户不存在' 
			) );
			return false;
		}
		$ids = $remote_model->get_weibo_content_recommend ( $id );
		$result = $this->contentSort ( $id, $ids );
		return $result;
	}
	function contentSort($strUid, $arrIds) {
		$mongo_db = new Mongo_DB ();
		$arrUsers = $mongo_db->find_by_cond ( 'xwb_users', array (
				'uid' => intval ( $strUid ) 
		) );
		$arrUsers = $mongo_db->find_by_cond ( 'passport_user', array (
				'id' => $arrUsers ['items'] [0] ['uid'] 
		) );
		$sync_model = new Synchronous ();
		$arrUsers ['items'] = $sync_model->users ( $arrUsers ['items'], true );
		$arrUser = $arrUsers ['items'] [0];
		$result = $this->query_weibo_detail_by_ids ( $arrIds );
		$arrUids = array ();
		foreach ( $result ['items'] as $uk => $uv ) {
			$arrUids [] = $uv ['user_id'];
		}
		$arrUsers = $mongo_db->find_by_cond ( 'passport_user', array (
				'id' => array (
						'$in' => $arrUids 
				) 
		) );
		$arrUsers = $sync_model->users ( $arrUsers ['items'], true );
		$arrUsersNew = array ();
		foreach ( $arrUsers as $uk => $uv ) {
			$arrUsersNew [$uv ['id']] = $uv;
		}
		$weibo_config = include (dirname ( __FILE__ ) . '/../config/weibo_config.php');
		$education_config = include (dirname ( __FILE__ ) . '/../config/education_config.php');
		$industry_config = include (dirname ( __FILE__ ) . '/../config/industry_config.php');
		global $education_config;
		global $industry_config;
		if (! empty ( $result ['items'] )) {
			foreach ( $result ['items'] as $key => $value ) {
				$arrReason = array ();
				if (isset ( $arrUsersNew [$value ['user_id']] ) === true) {
					$arrTempUser = $arrUsersNew [$value ['user_id']];
					if ($arrTempUser ['gender'] === $arrUser ['gender']) {
						$arrReason [] = $arrTempUser ['gender'] === 1 ? '男' : $arrTempUser ['gender'] === 2 ? '女' : '保密';
					}
					if ($arrTempUser ['age'] === $arrUser ['age']) {
						$arrReason [] = intval ( date ( 'Y' ) ) - intval ( $arrTempUser ['age'] ) + 1;
					}
					if ($arrTempUser ['city'] === $arrUser ['city']) {
						$arrReason [] = $arrTempUser ['city'];
					}
					if ($arrTempUser ['education'] !== '0' && $arrTempUser ['education'] === $arrUser ['education']) {
						$arrReason [] = $education_config [$arrTempUser ['education']];
					}
					if ($arrTempUser ['industry'] !== '0' && $arrTempUser ['industry'] === $arrUser ['industry']) {
						$arrReason [] = $industry_config [$arrTempUser ['industry']];
					}
				}
				$result ['items'] [$key] ['reason_count'] = count ( $arrReason );
			}
		}
		$result ['items'] = $this->_bubble_sort_by_key ( $result ['items'], 'reason_count' );
		return $result;
	}
}
