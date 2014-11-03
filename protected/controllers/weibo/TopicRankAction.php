<?php
/**
 * 热点微博排行
 */
class TopicRankAction extends CAction {
	public function run($period = '', $page = 1, $offset = 20) {
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
		// 获取话题排行
		$weibo_model = new WeiboModel ();
		$result = $weibo_model->query_weibo_topic_rank ( $start_time, $end_time, $page, $offset );
		$json = json_encode ( array (
				'success' => true,
				'result' => $result 
		) );
		header ( 'Content-type: application/json' );
		echo $json;
		return;
	}
}
