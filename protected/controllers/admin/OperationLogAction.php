<?php

class OperationLogAction extends CAction
{

	public function run(
		$begindate = '', $enddate = '',
		$type = '', $logconfig = '',
		$condition = '', $order = '',
		$page = 1, $limit = 20,
		$out = '', $callback = false, $tmpl = 'json'
	) {	
		if ($out === 'html') {
			$this->controller->render("role");
			app()->end();
		}
		if (!empty($_POST) && isset($_POST["condition"])) {
			$condition = $_POST["condition"];
		}
		
		$params = reqParam('params');				
		if(isset($params['begindate'])) $begindate = addslashes($params['begindate']);
		if(isset($params['enddate'])) $enddate = addslashes($params['enddate'].' 23:59:59');				

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
        $criteria->condition = $this->controller->getWhere($param['filter']);
        
        //查找只属于当前管理员的用户日志	
        $userAuth = User_site::userAuth(user()->id);
        $user_level = isset($userAuth['level']) ? $userAuth['level'] : 0;
        if($user_level == 0) {
        	$criteria->addCondition('user_id = '.user()->id);
        }
        if($user_level == 1) {
        	$top_uid = $userAuth['top_uid'];          	  	
	        $uids = array();
	        $uids[] = user()->id;
	        $users = Users::model()->findAll('top_uid='.$top_uid);
	        if($users) {
	        	foreach ($users as $user) {        		
	        		$uids[] = $user->id;
	        	}
	        }
	        $criteria->addCondition('user_id in ('.implode(',',$uids).')');
        }
        if($user_level == 2) {
        	$criteria->addCondition('1=1');
        }        
		//$criteria->select = "id, sitename, url, status, description, last_time, create_time";		
		
		if($begindate) 	$criteria->addCondition('time>=\''.$begindate.'\'');
		if($enddate) 	$criteria->addCondition('time<=\''.$enddate.'\'');
		
//		$criteria->order = implode(",", $this->controller->getOrder($param['order']));
		$criteria->order = "`id` DESC";
		$criteria->limit = $param['limit'];
		$criteria->offset = $param['offset'];			
		if('delete' == $type) {
			$count = Logs::model()->count($criteria);
			$del_condition = 'time<=\''.date('Y-m-d',time()-3600*24*30).'\'';				
			$criteria->addCondition($del_condition);
			$count_d = Logs::model()->count($criteria);
			if($count != $count_d) {
				$msg = array('error' => '30天内的操作日志不能删除！');
				self::json_return($msg , $callback);
				app()->end();
			}
			Logs::model()->deleteAll($criteria);
			$msg = array('success' => 'true');
			if ($tmpl == 'json') {
				self::json_return($msg , $callback);
				app()->end();
			}
		}			
        $result = self::loadItems($criteria);
		if ($tmpl == 'json') {			
			self::json_return(array('success' => true,'result' => $result) , $callback);
		}
		return;
	}

	private static function loadItems($criteria) {
		$roles = Logs::model()->findAll($criteria);		
		$count = Logs::model()->count($criteria);
		$logconfig = require(app()->basePath . '/config/log.php');		
		$_items = array();
		if($roles) {
			foreach ($roles as $role) {
				$temp_role = $role->getAttributes();				
				$temp_role['operate'] = $logconfig['type'][$temp_role['operate']];
				$temp_role['object_type'] = $logconfig['objtype'][$temp_role['object_type']];
				$_items[] = $temp_role;
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

