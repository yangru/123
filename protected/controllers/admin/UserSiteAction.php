<?php

class UserSiteAction extends CAction
{
	public function run(
		$site_id = 0, $user_id=0,
		$page = 1, $limit = 20, 		
		$out = '', $callback = false, $tmpl = 'json'
	) {	

		if (!empty($_POST) && isset($_POST["condition"])) {
			$condition = $_POST["condition"];
		}		

		$site_id = Utils::parseParam($site_id, PARAM_TYPE_INT);
		$user_id = Utils::parseParam($user_id, PARAM_TYPE_INT);

		$page = Utils::parseParam($page, PARAM_TYPE_INT);
		$limit = Utils::parseParam($limit, PARAM_TYPE_INT);
		$offset = $limit * ($page - 1);	

        $criteria = new CDbCriteria();		
		$criteria->addCondition('site_id='.$site_id);
		$criteria->addCondition('user_id='.$user_id);		
		$criteria->limit = $limit;
		$criteria->offset = $offset;
		
        $result = self::loadItems($criteria);
		if ($tmpl == 'json') {						
			self::json_return(array('success' => true,'result' => $result), $callback);
		}
	}
	
	private static function loadItems($criteria) {
		$user_sites = User_site::model()->findAll($criteria);
		$count = User_site::model()->count($criteria);
		$_items = array();
		if($user_sites) {
			foreach ($user_sites as $user_site) {
				$_items[] = $user_site->getAttributes();
			}
		}
		return array(
			'items' => $_items,
			'total' => $count			
		);
		return $user_site;		
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

