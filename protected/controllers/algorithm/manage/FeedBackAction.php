<?php
/**
 * 推荐反馈
 */
class FeedBackAction extends CAction {
	public function run($begin_date = '', $end_date = '') {
		// 获取推荐反馈统计
		$feedback_model = new FeedBack ();
		$result = $feedback_model->query_interface_stat ( $begin_date, $end_date );
		if ($result !== false) {
			$xaxis = array ();
			$recomm_array = array ();
			$feedbk_array = array ();
			foreach ( $result as $key => $value ) {
				$result [$key] ['recommend_count'] = is_nan ( $value ['recommend_count'] ) === true ? 0 : $value ['recommend_count'];
				$result [$key] ['feedback_count'] = is_nan ( $value ['feedback_count'] ) === true ? 0 : $value ['feedback_count'];
			}
			foreach ( $result as $key => $value ) {
				// 列表数据
				$data ['date'] = $key;
				$data ['recommend_count'] = $value ['recommend_count'];
				$data ['feedback_count'] = $value ['feedback_count'];
				$data ['feedback_percent'] = $value ['recommend_count'] ? number_format ( $value ['feedback_count'] / $value ['recommend_count'], 4 ) * 100 . '%' : '/';
				$result ['items'] [$key] = $data;
				
				// 图表数据
				$xaxis [] = $key;
				$recomm_array [] = $value ['recommend_count'];
				$feedbk_array [] = $value ['feedback_count'];
			}
			$result ['items'] = isset ( $result ['items'] ) ? array_values ( $result ['items'] ) : array ();
			$result ['xAxis'] = array (
					'categories' => $xaxis 
			);
			$result ['series'] = array (
					array (
							'name' => '推荐次数',
							'data' => $recomm_array 
					),
					array (
							'name' => '召回次数',
							'data' => $feedbk_array 
					) 
			);
			$json = json_encode ( array (
					'success' => true,
					'result' => $result 
			) );
		} else {
			$json = json_encode ( array (
					'success' => true,
					'result' => $result 
			) );
		}
		header ( 'Content-type: application/json' );
		echo $json;
		return;
	}
}
