<?php
/**
 * 微博话题热度趋势
 */
class TopicTrendAction extends CAction {
	public function run($period, $topic) {
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
		$weibo_model = new WeiboModel ();
		$data = $weibo_model->query_weibo_topic_trend ( $topic, $start_date, $end_date );
		if (! empty ( $data )) {
			foreach ( $data as $key => $value ) {
				$xaxis [] = $key;
				$content_array [] = $value ['content_count'];
				$interact_array [] = $value ['interact_count'];
			}
			$result ['xAxis'] = array (
					'categories' => $xaxis 
			);
			$result ['series'] = array (
					array (
							'name' => '内容生成量',
							'data' => $content_array 
					),
					array (
							'name' => '互动量',
							'data' => $interact_array 
					) 
			);
			$json = json_encode ( array (
					'success' => true,
					'result' => $result 
			) );
		} else {
			$json = json_encode ( array (
					'success' => true,
					'result' => array (
							'xAxis' => array (),
							'series' => array () 
					) 
			) );
		}
		header ( 'Content-type: application/json' );
		echo $json;
		return;
	}
}
