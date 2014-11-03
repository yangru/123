<?php

class RoleUserEditAction extends CAction
{

	public function run(
		$user_id = 0, $site_id = 0, $role_id = 0, $authorize = '',
		$out = '', $callback = false, $tmpl = 'json'
	) {	
		//查找到用户即可修改
		$usite = User_site::model()->findByAttributes(array(
		  'user_id' => (int)$user_id,
		  'site_id' => (int)$site_id	  
		));	
		$now = DbUtils::getDateTimeNowStr();
		if($usite) {		
			$usite->role_id = Utils::parseParam($role_id, PARAM_TYPE_INT);
			$usite->authorize = Utils::parseParam($authorize, PARAM_TYPE_STRING);	
			$usite->last_time = $now;		
			$msg = $usite->update() ? array('success' => 'true') : array('error' => '-ERROR:请求参数错误!');					
		} else {
			$usite = new User_site;
			$usite->user_id = Utils::parseParam($user_id, PARAM_TYPE_INT);
			$usite->site_id = Utils::parseParam($site_id, PARAM_TYPE_INT);
			//对role_id与authorize做一个合并过滤处理
			if($role_id > 0) {
				$role = Roles::model()->findByPk($role_id);				
				$authlist = $role->authlist;
				$authorize_array = explode(',',$authorize);
				$authlist_array = explode(',',$authlist);				
				$common = array_intersect($authlist_array,$authlist_array);				
				$differ = array_diff($authorize_array,$common);
				$authorize = implode(',',$differ);
			}
			$usite->role_id = Utils::parseParam($role_id, PARAM_TYPE_INT);
			$usite->top_uid = Users::getTopBelong(user()->id);
			$usite->authorize = Utils::parseParam($authorize, PARAM_TYPE_STRING);	
			$usite->last_time = $now;
			$usite->create_time = $now;
			$msg = $usite->save() ?	array('success' => 'true') : array('error' => '-ERROR:请求参数错误!');
		}
		$json = json_encode($msg)	;
		if ($callback !== false) {
			echo "{$callback}({$json})";
		} else {
			echo $json;
		}
		app()->end();	
	}

}

