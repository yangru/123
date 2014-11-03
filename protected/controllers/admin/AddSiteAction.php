<?php
class GroupAction extends CAction
{

public function run(
	$site_id, $type,
	$begindate, $enddate,
	$condition = '', $order = '',
	$metrics = '', $dims = '', $keys = '',
	$ctype = 0, $csubtype = 0, $tabid = 0,
	$word = '',
	$page = '1', $limit = '20',
	$callback = false, $tmpl = 'json'
) {
	if (!empty($_POST) && isset($_POST["condition"])) {
		$condition = $_POST["condition"];
	}
	$cdo = new ClickiModel($site_id);
	$page = Utils::parseParam($page, PARAM_TYPE_INT);
	$limit = Utils::parseParam($limit, PARAM_TYPE_INT);
	$offset = $limit * ($page - 1);

	//过滤已经删除的频道
	if (!$word && $type == "page_channel") {
		//读取站点已设置的频道
		$custom_type = "channel";
		$custom = require(dirname(__FILE__) . '/../custom_options.php');
		$channel_type_id = $custom["type_map"][$custom_type];
		$channels = Custom_option::model()->getChannelIds(array('site_id' => $site_id, 'type' => $channel_type_id));
		if ($channels) {
			//拼装IN语句
			$condition = array(
				'channel_id' => "{} in (" . implode(",", $channels) . ")"
			);
		} else {
			$condition = array(
				'channel_id' => "{} > 0"
			);
		}
	}

	//搜索
	if ($word) {
		$search_result = $cdo->search(array(
			'site_id'	=> Utils::parseParam($site_id, PARAM_TYPE_INT),
			'word'		=> Utils::parseParam(urldecode($word), PARAM_TYPE_STRING),
			'type'		=> $this->controller->type_map[$type],
		));
		$ids_filter = '';
		if ($search_result) {
			foreach ($search_result['ids'] as $id) $ids_filter .= "{$search_result['field']}|$id,";
		}
		$condition .= $ids_filter;
		if ($ids_filter === '') $site_id = 0;
	}

	$result = $cdo->group(array(
		'site_id'	=> Utils::parseParam($site_id, PARAM_TYPE_INT),
		'begindate'	=> Utils::parseParam($begindate, PARAM_TYPE_STRING),
		'enddate'	=> Utils::parseParam($enddate, PARAM_TYPE_STRING),
		'filter'	=> Utils::parseParam($condition, PARAM_TYPE_FILTER),
		'order'		=> Utils::parseParam($order, PARAM_TYPE_MAP),
		'type'		=> $this->controller->type_map[$type],
		'metrics'	=> Utils::parseParam($metrics, PARAM_TYPE_ARRAY),
		'dims'		=> Utils::parseParam($dims, PARAM_TYPE_ARRAY),
		'keys'		=> Utils::parseParam($keys, PARAM_TYPE_ARRAY),
		'offset'	=> $offset,
		'limit'		=> $limit,
	));
	if ($result === false) {
		echo json_encode(array(
			'success' => false,
		));
		return;
	}

	$_items = array();
	foreach ($result['items'] as $item) {
		$_item = array(
			'keys' => $item['keys'],
			'x_axis' => $item['dims'],
			'y_axis' => $item['metrics'],
		);
		$_items[] = $_item;
	}

	$_amount = array();
	$_amount['y_axis'] = $result['amount']['metrics'];

	$caption = $this->controller->caption;
	if ($ctype > 0) {
		$where = array(
			'site_id'	=> Utils::parseParam($site_id, PARAM_TYPE_INT),
			'type'		=> Utils::parseParam($ctype, PARAM_TYPE_INT),
			'subtype'	=> Utils::parseParam($csubtype, PARAM_TYPE_INT),
		);
		$custom_option = Custom_option::model()->findByAttributes($where);
		if ($custom_option) {
			$data = json_decode($custom_option->config, true);
			$config = $data["items"];
			if ($config && isset($config["id$tabid"])) {
				unset($config["id$tabid"]["title"]);
				unset($config["id$tabid"]["template"]);
				unset($config["id$tabid"]["last_time"]);
				foreach ($config["id$tabid"] as $item => $ivalue) {
					if (strpos($item, "value") !== false) {
						$caption[str_replace("_name", "", $item)]["title"] = $ivalue;
						$caption[str_replace("_name", "", $item)]["desc"] = '';
					} else {
						$caption[$item]["title"] = $ivalue;
						$caption[$item]["desc"] = '';
					}
				}
			}
		}
	}
	//转化指标
	$reserve_keys = array();
	if ($reserve = user()->getState("reserve")) {
		foreach ($reserve as $field => $val) {
			$reserve_keys[] = $field;
			$caption[$field]["title"] = $val["name"];
		}
	}

	// amount 是返回给前端的表头总汇
	// caption 是返回给前端的表列名称
	// filter 是返回给前端表头的配置
	if ($tmpl == 'json') {
		header('Content-type: application/json');
		$json = json_encode(array(
			'success' => true,
			'result' => array(
				'items' => $_items,
				'amount' => $_amount,
				'total' => $result['total'],
				'caption' => $caption,
				'filter' => array(
					'build' => array(
						'def' => array(
							'text' => '默认',
							'build' => isset($result['build_metrics']['def']) ? $result['build_metrics']['def'] : array(),
						),
						'traffic' => array(
							'text' => '流量指标',
							'build' => isset($result['build_metrics']['traffic']) ? $result['build_metrics']['traffic'] : array(),
						),
						'quality' => array(
							'text' => '质量指标',
							'build' => isset($result['build_metrics']['quality']) ? $result['build_metrics']['quality'] : array(),
						),
						'reserve' => array(
							'text' => '转化指标',
							'build' => !in_array($type, array("page_url", "page_domain", "page_channel")) ? $reserve_keys : array(), //页面级别不返回转化指标
						),
						'custom' => array(
							'text' => '自定义',
						),
					),
				),
			),
			'debug' => $result['debug'],
		));
		if ($callback !== false) {
			echo "{$callback}({$json})";
		} else {
			echo $json;
		}
	} elseif ($tmpl == 'table') {
		$this->controller->render('group', array(
			'items' => $_items,
			'amount' => $_amount,
			'caption' => $caption,
			'type' => $type,
			'total' => $result['total'],
		));
	} elseif ($tmpl == 'export') {
		$this->controller->buildExcel(array(
			'success' => true,
			'result' => array(
				'items' => $_items,
				'amount' => $_amount,
				'total' => $result['total'],
				'caption' => $caption,
			),
		));
	}
	return;
}

}
