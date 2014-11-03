<?php
/**
 * 微博热度趋势
 */
class WeiboTrendAction extends CAction {
	public function run($period, $id) {
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
		$weibo_model = new WeiboModel ();
		$data = $weibo_model->query_weibo_trend_by_id ( $id, $start_date, $end_date );
		if (! empty ( $data )) {
			foreach ( $data as $key => $value ) {
				$xaxis [] = $key;
				$forward_array [] = $value ['forward_count'];
				$comment_array [] = $value ['comment_count'];
			}
			$result ['xAxis'] = array (
					'categories' => $xaxis 
			);
			$result ['series'] = array (
					array (
							'name' => '转发量',
							'data' => $forward_array 
					),
					array (
							'name' => '评论量',
							'data' => $comment_array 
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
