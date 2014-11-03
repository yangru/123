<?php
/**
 * 用户列表查询 
 */
class UserAction extends CAction
{
	/**	 
	 * @param $sid 网站ID
	 * @param $word 关键词查询
	 * @param $role_id 角色ID
	 * @param $no_sid 过滤筛选的ID	 
	 * @param $is_super 筛选顶级管理用户	 
	 * @param $admin_id 某个用户下的所有用户
	 * @param $no_sid 过滤筛选的ID	 
	 */
	public function run(
		$sid = 0, $word = '', $role_id = -1,
		$no_sid = 0, $is_super = 0, 
		$admin_id = 0, $subordinate = 0,
		$condition = '', $order = '',
		$page = '1', $limit = '20',
		$out = '',
		$callback = false, $tmpl = 'json'
	) {

		if (!empty($_POST) && isset($_POST["condition"])) {
			$condition = $_POST["condition"];
		}

		$page = Utils::parseParam($page, PARAM_TYPE_INT);
		$limit = Utils::parseParam($limit, PARAM_TYPE_INT);
		$offset = $limit * ($page - 1);

		$param = $this->controller->initParam(array(
			'filter' => Utils::parseParam($condition, PARAM_TYPE_FILTER),
			'order' => Utils::parseParam($order, PARAM_TYPE_MAP),
			'limit' => $limit,
			'offset' => $offset,
		));

		$sid = intval($sid);

        $criteria = new CDbCriteria();
		$criteria->select = array("t.id", "t.user_name", "t.email", "t.count", "t.last_time", "t.create_time","t.level","t.top_uid","t.restrict");
		$criteria->condition = $this->controller->getWhere($param['filter']);		
		$criteria->join = "LEFT JOIN user_site us ON us.user_id = t.id ";	

		$userAuth = User_site::userAuth(user()->id);
		$user_level = isset($userAuth['level']) ? $userAuth['level'] : 0;
		
		if ($sid > 0) {
			if($user_level == 1) {
				$criteria->addCondition('us.site_id='.$sid.' OR t.level=1');
			}
			if($user_level == 2) {
				$criteria->addCondition('us.site_id='.$sid);
			}
		}		
		if($is_super) {
			$criteria->addCondition('t.level=1');
		}
		$criteria->addCondition('t.status=1');	
		$word = addslashes(urldecode($word));
		if($word) $criteria->addSearchCondition('t.user_name',$word);			
		if($role_id >= 0) $criteria->addCondition('us.role_id='.intval($role_id));		
		if($no_sid > 0) {
			$criteria->addCondition('t.level!=1');
			$criteria->having = 'BIT_OR(CASE us.site_id WHEN ' . intval($no_sid) .' THEN 1 ELSE 0 END ) !=1';
		}
		
		$criteria->order = implode(",", $this->controller->getOrder($param['order']));
		$criteria->limit = $param['limit'];
		$criteria->offset = $param['offset'];

        $result = self::loadUsers($criteria);

		if ($result === false) {
			echo json_encode(array(
				'success' => false,
			));
			return;
		}

		$_items = array();
		foreach($result['info'] as $item) {
			$data = $item->getAttributes();
			$_item = array();
			if ($criteria->select) {
				foreach ($criteria->select as $field) {
					list($prefix, $_field) = explode(".", $field);
					$_item[$_field ? $_field : $prefix] = $data[$_field];
					if ($_field == "id") {
						$usite = User_site::model()->findAllByAttributes( array('user_id' => $data[$_field]) );
						$relation_site = $this->getRelationSite($usite, $sid);
						$_item['role'] = isset($relation_site[0]) ? $relation_site[0]['role']['name'] : "";
						$_item['sites'] = $relation_site;
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
					'total' => intval($result['total']),
				),
			));
			if ($callback !== false) {
				echo "{$callback}({$json})";
			} else {
				echo $json;
			}
		}
	}

	private function getRelationSite($usite, $sid) {
		$sites = array();
		if ($usite) {
			foreach ($usite as $s) {
				//返回某一个网站的用户信息和权限
				if ($sid > 0 && $sid != $s->site_id) continue;
				$site = Sites::model()->findByPk($s->site_id);
				if ($site) {
					$sites[] = array(
						'id' => $site->id,
						'sitename' => $site->sitename,
						'url' => $site->url,
						'role' => Roles::getRoleInfo($s->role_id),
						'authorize' => Roles::getAuthorize($this->controller->authorize, @explode(",", $s->authorize)),
					);
				}
			}
		}
		return $sites;
	}

	private static function loadUsers($criteria)
	{		
	    $info = Users::model()->findAll($criteria);	
		$count = Users::model()->count($criteria);
		return array(
			'info' => $info,
			'total' => $count
		);
	}

}
