<?php
/**
 * 算法训练
 */
class TrainAction extends CAction {
    public function run($engine, $param, $user_num = '', $start_date, $end_date, $min_unit_num = '') {
    	//加载算法配置
        $algorithm_config = require (dirname(__FILE__) . '/../../../config/algorithm_config.php');
		$params = array();
		foreach ($algorithm_config['params'] as $value) {
			$params[] = $value['short'];
		}
		if (!in_array($engine, array('icf','ucf','dwr')) || !in_array($param, $params)) {
			header('Content-type: application/json');
			echo json_encode(array('error' => '参数错误'));
			return ;
		}
		$remote_model = new CallRemote();
        if (in_array($engine, array('icf','ucf'))) {
        	$result = $remote_model->video_training($engine, $param, $user_num, strtotime($start_date)*1000, strtotime($end_date)*1000 + 86400000, $min_unit_num);
        } else {
        	$result = $remote_model->weibo_content_training($param, strtotime($start_date)*1000, strtotime($end_date)*1000 + 86400000);
        }
        
        $data = array('dataNum' => '', 'userNum' => '', 'xAxis' => array(), 'all_series' => array(), 'precision_series' => array(), 'recall_series' => array(), 'coverage_series' => array());
        $xaxis = array();
        $precision_series = array('name' => '准确率', 'data' => array());
        $recall_series = array('name' => '召回率', 'data' => array());
        $coverage_series = array('name' => '覆盖率', 'data' => array());
		$isHasDataNum = in_array($engine, array('icf','ucf'));
		
    	if ( (!$isHasDataNum ||$result['dataNum']!=0) && !empty($result['values'])) {
        	foreach ($result['values'] as $value) {
        		$xaxis[] = $value['xAxis'];
        		$precision_series['data'][] = isset($value['precision']) ? number_format($value['precision'], 4) * 100 : 0;
        		$recall_series['data'][] = isset($value['recall']) ? number_format($value['recall'], 4) * 100 : 0;
        		$coverage_series['data'][] = isset($value['coverage']) ? number_format($value['coverage'], 4) * 100 : 0;
        	}
        	if ($engine != 'dwr') {
        		$data['dataNum'] = $result['dataNum'];
        		$data['userNum'] = $result['userNum'];
        		$data['coverage_series'] = array($coverage_series);
        	}else{
        		$data['dataNum'] = $result['dataNum'];
        		$data['userNum'] = $result['userNum'];
        	}
        	$data['xAxis'] = array('categories' => $xaxis);
        	$data['all_series'] = array($precision_series, $recall_series, $coverage_series);
        	$data['precision_series'] = array($precision_series);
        	$data['recall_series'] = array($recall_series);
        	$json = json_encode(array('success' => true, 'result' => $data));
        } else {
        	$json = json_encode(array('success' => true, 'result' => array('dataNum'=>0,'userNum'=>0,'xAxis'=>array(),'all_series'=>array(),'precision_series'=>array(),'recall_series'=>array(),'coverage_series'=>array())));
        }
        header('Content-type: application/json');
        echo $json;
        return;
    }
}
