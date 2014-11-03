<?php
/**
 * 推荐反馈
 * @author Kevin
 */
require_once (dirname ( __FILE__ ) . '/../../../library/nosql/MongoDB.php');
class FeedBack {
	private $db = null;
	public function __construct() {
		$this->db = new Mongo_DB ();
	}
	
	/**
	 * 接口调用次数统计
	 */
	public function query_interface_stat($start_date, $end_date) {
		$start_time = strtotime ( $start_date );
		$end_time = strtotime ( $end_date );
		if (empty ( $start_time ) || empty ( $end_time )) {
			return false;
		}
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '查询推荐反馈数据', YII_INFO );
			$end_time += 86400;
			$group_by_day = 0;
			if ($end_time - $start_time > 86400 * 3) { // 大于三天的数据按天统计
				$group_by_day = 1;
			}
			$trend_list = array ();
			$cond = array ();
			$cond ['date'] ['$gte'] = $start_time;
			$cond ['date'] ['$lte'] = $end_time;
			
			if ($group_by_day == 1) { // 按天查询
				$key = array (
						'date' => 1 
				);
				$initial = array (
						'recommend_count' => 0,
						'feedback_count' => 0 
				);
				$reduce = "function (obj, out) {out.recommend_count+=obj.recommend_count;out.feedback_count+=obj.feedback_count;}";
				$result = $this->db->group ( 'interface_stat', $key, $initial, $reduce );
				if (! empty ( $result ['retval'] )) {
					$data = array ();
					foreach ( $result ['retval'] as $value ) {
						$key = $value ['date'];
						$data [$key] = $value;
					}
					for($i = $start_time; $i < $end_time; $i += 86400) {
						$key = date ( 'Y-m-d', $i );
						if (isset ( $data [$i] )) {
							$temp = $data [$i];
							
							$trend_list [$key] ['recommend_count'] = isset ( $temp ['recommend_count'] ) ? $temp ['recommend_count'] : 0;
							$trend_list [$key] ['feedback_count'] = isset ( $temp ['feedback_count'] ) ? $temp ['feedback_count'] : 0;
						} else {
							$trend_list [$key] ['recommend_count'] = 0;
							$trend_list [$key] ['feedback_count'] = 0;
						}
					}
				}
			} else if (! $group_by_day) { // 按小时查询
				$result = $this->db->find_by_cond ( 'interface_stat', $cond );
				if (! empty ( $result ['items'] )) {
					$data = array ();
					foreach ( $result ['items'] as $value ) {
						$key = $value ['date'] + $value ['hour'] * 3600;
						$data [$key] = $value;
					}
					$hour = 0;
					for($i = $start_time; $i < $end_time; $i += 3600) {
						if (isset ( $data [$i] )) {
							$temp = $data [$i];
							$trend_list [$hour . ':00'] ['recommend_count'] = isset ( $temp ['recommend_count'] ) ? $temp ['recommend_count'] : 0;
							$trend_list [$hour . ':00'] ['feedback_count'] = isset ( $temp ['feedback_count'] ) ? $temp ['feedback_count'] : 0;
						} else {
							$trend_list [$hour . ':00'] ['recommend_count'] = 0;
							$trend_list [$hour . ':00'] ['feedback_count'] = 0;
						}
						$hour ++;
					}
				}
			}
			return $trend_list;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '查询推荐反馈数据失败' . $e->getMessage (), YII_ERROR );
		}
	}
}