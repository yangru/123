<?php

class RoleDeleteAction extends CAction
{
	public function run(
		$role_id = 0, $name = '', $authlist = '',
		$out = '', $callback = false, $tmpl = 'json'
	) {	
		
		$now = DbUtils::getDateTimeNowStr();	
		$query = array('id' => $role_id);
		$role = Roles::model()->findByAttributes($query);				
		
		$msg = array('error' => '请求参数错误!');		
		
		if ($role) {
			$rolename = $role->name;
			if($role->delete())	{
				$msg = array('success' => 'true');				
				Logs::writeLog('delete','role',$rolename);
			}						
		}
		self::json_return($msg);
		app()->end();		
		return ;		
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

