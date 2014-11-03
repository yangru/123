<?php
/**
 * 热门用户排行
 */
class UserRankAction extends CAction {
	public function run($period = '', $type = '', $page = 1, $limit = 20) {
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
		// 获取热门用户排行
		$weibo_model = new WeiboModel ();
		$result = $weibo_model->hot_weibo_user_rank ( $start_time, $end_time, intval ( $type ), $page, $limit );
		$json = json_encode ( array (
				'success' => true,
				'result' => $result 
		) );
		header ( 'Content-type: application/json' );
		echo $json;
		return;
	}
}
