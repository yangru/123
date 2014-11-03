<?php
error_reporting ( 0 );
class WeiboController extends Controller {
	private $weibo;
	public $id = 'api';
	function __construct() {
		$this->weibo = new WeiboModel ();
	}
	public function actionHotWeiboRank($period = '', $type = '', $page = 1, $offset = 20) {
		if (! in_array ( $period, array (
				'24',
				'48',
				'week' 
		) )) {
			header ( 'Content-type: application/json' );
			echo json_encode ( array (
					'error' => '参数错误' 
			) );
			return;
		}
		$end_time = time ();
		switch ($period) {
			case 24 :
				$start_time = $end_time - 86400;
				break;
			case 48 :
				$start_time = $end_time - 86400 * 2;
				break;
			case 'week' :
				$start_time = $end_time - 86400 * 7;
				break;
		}
		$start_time *= 1000;
		$end_time *= 1000;
		json_encode_end ( $this->weibo->hot_weibo_rank ( $start_time, $end_time, intval ( $type ), $page, $offset ) );
	}
	public function actionHotWeiboUserRank($period = '', $type = '', $page = 1, $offset = 20) {
		if (! in_array ( $period, array (
				'24',
				'48',
				'week' 
		) )) {
			header ( 'Content-type: application/json' );
			echo json_encode ( array (
					'error' => '参数错误' 
			) );
			return;
		}
		$end_time = time ();
		switch ($period) {
			case 24 :
				$start_time = $end_time - 86400;
				break;
			case 48 :
				$start_time = $end_time - 86400 * 2;
				break;
			case 'week' :
				$start_time = $end_time - 86400 * 7;
				break;
		}
		$start_time *= 1000;
		$end_time *= 1000;
		json_encode_end ( $this->weibo->hot_weibo_user_rank ( $start_time, $end_time, intval ( $type ), $page, $offset ) );
	}
	public function actionQueryWeiboTopicRank($period = '', $page = 1, $offset = 20) {
		if (! in_array ( $period, array (
				'24',
				'48',
				'week' 
		) )) {
			header ( 'Content-type: application/json' );
			echo json_encode ( array (
					'error' => '参数错误' 
			) );
			return;
		}
		$end_time = time ();
		switch ($period) {
			case 24 :
				$start_time = $end_time - 86400;
				break;
			case 48 :
				$start_time = $end_time - 86400 * 2;
				break;
			case 'week' :
				$start_time = $end_time - 86400 * 7;
				break;
		}
		$start_time *= 1000;
		$end_time *= 1000;
		json_encode_end ( $this->weibo->query_weibo_topic_rank ( $start_time, $end_time, $page, $offset ) );
	}
	public function actionQueryWeiboTopicTrend($period, $topic) {
		$topic = urldecode ( $topic );
		if (! in_array ( $period, array (
				'24',
				'48',
				'week' 
		) ) || empty ( $topic )) {
			header ( 'Content-type: application/json' );
			echo json_encode ( array (
					'error' => '参数错误' 
			) );
			return;
		}
		$end_date = date ( 'Y-m-d' );
		switch ($period) {
			case 24 :
				$start_date = date ( 'Y-m-d', strtotime ( $end_date ) );
				break;
			case 48 :
				$start_date = date ( 'Y-m-d', strtotime ( $end_date ) - 86400 );
				break;
			case 'week' :
				$start_date = date ( 'Y-m-d', strtotime ( $end_date ) - 86400 * 6 );
				break;
		}
		$end_date = date ( 'Y-m-d', strtotime ( $end_date ) + 86400 );
		json_encode_end ( $this->weibo->query_weibo_topic_trend ( $topic, $start_date, $end_date ) );
	}
	public function actionQueryWeiboTrendById($period, $id) {
		if (! in_array ( $period, array (
				'24',
				'48',
				'week' 
		) )) {
			header ( 'Content-type: application/json' );
			echo json_encode ( array (
					'error' => '参数错误' 
			) );
			return;
		}
		$end_date = date ( 'Y-m-d' );
		switch ($period) {
			case 24 :
				$start_date = date ( 'Y-m-d', strtotime ( $end_date ) );
				break;
			case 48 :
				$start_date = date ( 'Y-m-d', strtotime ( $end_date ) - 86400 );
				break;
			case 'week' :
				$start_date = date ( 'Y-m-d', strtotime ( $end_date ) - 86400 * 6 );
				break;
		}
		$end_date = date ( 'Y-m-d', strtotime ( $end_date ) + 86400 );
		json_encode_end ( $this->weibo->query_weibo_trend_by_id ( $id, $start_date, $end_date ) );
	}
	public function actionQueryWeiboUserTrendById($period, $id) {
		if (! in_array ( $period, array (
				'24',
				'48',
				'week' 
		) )) {
			header ( 'Content-type: application/json' );
			echo json_encode ( array (
					'error' => '参数错误' 
			) );
			return;
		}
		$end_date = date ( 'Y-m-d' );
		switch ($period) {
			case 24 :
				$start_date = date ( 'Y-m-d', strtotime ( $end_date ) );
				break;
			case 48 :
				$start_date = date ( 'Y-m-d', strtotime ( $end_date ) - 86400 );
				break;
			case 'week' :
				$start_date = date ( 'Y-m-d', strtotime ( $end_date ) - 86400 * 6 );
				break;
		}
		$end_date = date ( 'Y-m-d', strtotime ( $end_date ) + 86400 );
		json_encode_end ( $this->weibo->query_weibo_user_trend_by_id ( $id, $start_date, $end_date ) );
	}
	public function actionWeiboPotentialRank($page = 1, $offset = 20) {
		json_encode_end ( $this->weibo->weibo_potential_rank ( $page, $offset ) );
	}
	public function actionWeiboFriendsRecommend($id = '') {
		$weibo_model = new WeiboModel ();
		$result = $weibo_model->friendsRecommend ( $id );
		if ($result !== false) {
			json_encode_end ( $result );
		}
	}
	public function actionWeiboContentRecommend($id = '') {
		$weibo_model = new WeiboModel ();
		$result = $weibo_model->contentRecommend ( $id );
		if ($result !== false) {
			json_encode_end ( $result );
		}
	}
	public function actionWeiboContentSort($id = '', $ids = '') {
		$weibo_model = new WeiboModel ();
		$arrIds = explode ( ',', $ids );
		$arrNewIds = array ();
		foreach ( $arrIds as $ik => $iv ) {
			$arrNewIds [] = intval ( $iv );
		}
		json_encode_end ( $weibo_model->contentSort ( $id, $arrNewIds ) );
	}
}
