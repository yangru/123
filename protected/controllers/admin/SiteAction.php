<?php
class SiteAction extends CAction
{
	/**
	 * 查询网站接口
	 *
	 * @param $uid 用户ID
	 * @param $no_uid 不包含的用户ID
	 * @param $role_id 角色ID
	 * @param $site_id 网站ID
	 * @param $word 关键词
	 * @param $condition 查询条件
	 * @param $order 排序
	 * @param $page 页码
	 * @param $limit 每页数量
	 */
	public function run(
		$uid = 0, $no_uid = 0, $role_id = -1,$site_id = 0,
		$word = '',
		$condition = '', $order = '',
		$page = '1', $limit = '20',
		$out = '',
		$callback = false, $tmpl = 'json'
	) {
		if ($out === 'html') {
			$this->controller->render("site");
			app()->end();
		}

		if (!empty($_POST) && isset($_POST["condition"])) {
			$condition = $_POST["condition"];
		}
		
		$userAuth = User_site::userAuth(user()->id);
		$user_level = isset($userAuth['level']) ? $userAuth['level'] : 0;

		$page = Utils::parseParam($page, PARAM_TYPE_INT);
		$limit = Utils::parseParam($limit, PARAM_TYPE_INT);
		$offset = $limit * ($page - 1);		

		$param = $this->controller->initParam(array(
			'filter' => Utils::parseParam($condition, PARAM_TYPE_FILTER),
			'order' => Utils::parseParam($order, PARAM_TYPE_MAP),
			'limit' => $limit,
			'offset' => $offset,
		));

		$uid = intval($uid);
		$site_id = intval($site_id);

        $criteria = new CDbCriteria();
		$criteria->select = array("t.id", "t.sitename", "t.url", "t.last_time", "t.create_time", "us.role_id", "us.authorize","u.level");		
		$criteria->condition = $this->controller->getWhere($param['filter']);		
		$criteria->join = "INNER JOIN user_site us ON us.site_id = t.id INNER JOIN users u ON us.user_id = u.id AND u.status=1 ";				
		if($uid > 0) {
			$criteria->addCondition("us.user_id=".$uid);
		} else {			
			if($user_level == 1) {
				$top_uid = $userAuth['top_uid'];
				$criteria->addCondition('u.id='.$top_uid);
			}
			if($user_level == 0) {
				$criteria->addCondition('u.id='.user()->id);
			}			
		}
		if($role_id >= 0) {
			$criteria->select = array("t.id", "t.sitename", "t.url", "t.last_time", "t.create_time", "us.role_id", "us.authorize","count(t.id) as members");
			$criteria->addCondition("us.role_id=".$role_id);		
		}
		if($no_uid > 0) {
			$criteria->select = array("t.id", "t.sitename", "t.url");	
			$criteria->having = 'BIT_OR(CASE us.user_id WHEN ' . intval($no_uid) .' THEN 1 ELSE 0 END ) !=1';
		}
		if($site_id > 0) $criteria->addCondition('t.id='.$site_id);		
		$word = addslashes(urldecode($word));
		if($word) {
			$criteria->addCondition(("t.sitename LIKE '%$word%' OR t.url LIKE '%$word%'"));
		}
		
		$criteria->group = 't.id';
		$criteria->order = implode(",", $this->controller->getOrder($param['order']));
		$criteria->limit = $param['limit'];
		$criteria->offset = $param['offset'];

        $result = self::loadSites($criteria);

		if ($result === false) {
			echo json_encode(array(
				'success' => false,
			));
			return;
		}

		$_items = array();
		foreach($result['info'] as $item) {
			$data = $item->getAttributes();		
			if ($criteria->select) {
				$_item = array();
				foreach ($criteria->select as $field) {
					if($field == 'count(t.id) as members') {
						$_field = 'members';
					} else {
						list($prefix, $_field) = explode(".", $field);
					}					
					
					if ($_field == "role_id") {
						$_item['role'] = Roles::getRoleInfo($data[$_field]);
					} elseif ($_field == "authorize") {
						$_item['authorize'] = Roles::getAuthorize($this->controller->authorize, @explode(",", $data[$_field]));
					} else {
						$_item[$_field ? $_field : $prefix] = $data[$_field];
					}
				}
			}
			$_items[] = $_item;
		}

		if ($tmpl == 'json') {
			header('Content-type: application/json');
			$json = json_encode(array(
				'success' => true,
				'result' => array(
					'items' => $_items,
					'total' => $result['total'],
				),
			));
			if ($callback !== false) {
				echo "{$callback}({$json})";
			} else {
				echo $json;
			}
		}
	}

	private static function loadSites($criteria)
	{
		$info = Sites::model()->findAll($criteria);
		$count = Sites::model()->count($criteria);
		return array(
			'info' => $info,
			'total' => $count
		);
	}

}
