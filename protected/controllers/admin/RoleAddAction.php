<?php

class RoleAddAction extends CAction
{

	public function run(
		$name = '', $desc = '', $authlist = '',
		$out = '', $callback = false, $tmpl = 'json'
	) {	
		if($out === 'html') {		
			$this->controller->render('roleadd');	
			app()->end();
		}		
		if(!$name) {
			$msg = array('error' => '-ERROR: 角色名不可以为空.');
			self::json_return($msg , $callback);
			app()->end();
		}
		$user_id = user()->id;	//用户ID	
		$now = DbUtils::getDateTimeNowStr();
		$query = array('user_id' => user()->id, 'name' => $name);	
		if (Roles::model()->findByAttributes($query)) {
			$msg = array('error' => '-ERROR: 角色名已存在.');
			self::json_return($msg , $callback);
			app()->end();
		}
		$role = new Roles;	
		$role->user_id = $user_id;		
		$role->name = $name;
		$role->desc = $desc;		
		$role->last_time = $now;
		$role->create_time = $now;		
		$role->authlist = $authlist;	
		if($role->save()) {
			Logs::writeLog('add','role',$name);
			$msg = array('success' => 'true', 'result' => array('role_id' => $role->id));
		} else {
			$msg = array('error' => '-ERROR: 保存失败.');
		}
		if ($tmpl == 'json') {
			self::json_return($msg , $callback);
		}				
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

