<?php

class RoleUserAction extends CAction
{
	public function run(
		$condition = '', $order = '', $groupby = '', $with = '',
		$page = 1, $limit = 20,
		$out = '', $callback = false, $tmpl = 'json'
	) {
		if ($out === 'html') {
			$this->controller->render("roleuser");
			app()->end();
		}

		if (!empty($_POST) && isset($_POST["condition"])) {
			$condition = $_POST["condition"];
		}

		//网站信息
		$page = Utils::parseParam($page, PARAM_TYPE_INT);
		$limit = Utils::parseParam($limit, PARAM_TYPE_INT);
		$offset = $limit * ($page - 1);

		$param = $this->controller->initParam(array(
			'filter' => Utils::parseParam($condition, PARAM_TYPE_FILTER),
			'order' => Utils::parseParam($order, PARAM_TYPE_MAP),
			'limit' => $limit,
			'offset' => $offset,
		));

        $criteria = new CDbCriteria();        
        if($with)$criteria->with = $with;        
		$criteria->condition = $this->controller->getWhere($param['filter']);
		$criteria->order = implode(",", $this->controller->getOrder($param['order']));
		$criteria->limit = $param['limit'];
		$criteria->offset = $param['offset'];		
        $result = self::loadItems($criteria);
		if ($tmpl == 'json') {			
			self::json_return(array('success' => true,'result' => $result) , $callback);
		}
	}
	
	private static function loadItems($criteria) {
		$t_fields = array(
					'sites' => array('url','sitename','last_time','create_time'),
					'users'	=> array('email','last_time','count'),
					);
		$roles = User_site::model()->findAll($criteria);		
		$count = User_site::model()->count($criteria);		
		$_items = array();
		$with = $criteria->with;		
		if($roles) {
			foreach ($roles as $role) {				
				$data = $role->getAttributes();																
				if($with && $role->$with) {
					$with_data = $role->$with->getAttributes();
					foreach ($t_fields[$with] as $fields) {
						$data[$fields] = $with_data[$fields];
					}
				}
				$_items[] = $data;
			}
		}		
		return array(			
			'items' => $_items,
			'total' => $count
		);
	}
	
	private static function json_return($data, $callback = false) {
		$json = json_encode($data);
		header('Content-type: application/json');		
		if ($callback !== false) {
			echo "{$callback}({$json})";
		} else {
			echo $json;
		}
	}

}

