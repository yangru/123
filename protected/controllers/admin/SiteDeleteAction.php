<?php

class SiteDeleteAction extends CAction
{
	public function run(
		$site_id = 0, $user_id = 0, $name = '', $authlist = '',
		$out = '', $callback = false, $tmpl = 'json'
	) {	
		$now = DbUtils::getDateTimeNowStr();				
		
		//只能删除自己所属的最高级下面的网站
		$top_uid = Users::getTopBelong(user()->id);
		$condition = array('top_uid' => $top_uid);
		if($site_id) $condition['site_id'] = intval($site_id);
		if($user_id) $condition['user_id'] = intval($user_id);
		$usites = User_site::model()->findAllByAttributes($condition);
		
		if ($usites) {
			$msg = array('success' => 'true');			
			foreach ($usites as $key=>$usite) {
				$siteinfo = Sites::model()->findByPk($usite->site_id);		
				if(!$usite->delete()) {																	
					$msg = array('error' => '删除站点过程出错!');	
					break;
				}
				Logs::writeLog('delete','site',$siteinfo->sitename);
			}			
		} else {
			$msg = array('error' => '你没有该站点!');
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

