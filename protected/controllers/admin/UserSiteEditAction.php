<?php
class UserSiteEditAction extends CAction
{

	public function run(		
		$rights = '', $out = '',
		$callback = false, $tmpl = 'json'
	) {
		$rights = json_decode($rights, true);
		if(!$rights) {
			json_encode_end(array('error' => '参数错误'));
		}		
		if($this->withRights($rights)) {
			json_encode_end(array('success' => 'true'));
		} else {
			json_encode_end(array('error' => '保存权限失败'));
		}
	}

	private function withRights($rights) {
		if ($rights) {			
			//保存权限分配信息
			foreach($rights as $item) {				
				$uid = intval($item['uid']);
				$top_uid = Users::getTopBelong($uid);
				$right = User_site::model()->findByAttributes(array('user_id' => $uid, 'top_uid' => $top_uid, 'site_id' => $item['site_id']));
				if(isset($item['custom']) && is_array($item['custom'])) {
					$item['custom'] = @implode(',',$item['custom']);
				}
				//对权限中重复的部分进行过滤
				if($item['role_id'] && $item['custom']) {
					$role_id = $item['role_id'];
					$authorize = $item['custom'];
					$role = Roles::model()->findByPk($role_id);	
					if($role) {
						$authlist = $role->authlist;
						$authorize_array = explode(',',$authorize);
						$authlist_array = explode(',',$authlist);				
						$common = array_intersect($authlist_array,$authlist_array);				
						$differ = array_diff($authorize_array,$common);
						$item['custom'] = implode(',',$differ);
					}
				}
				if ($right) {
					$right->role_id = $item['role_id'];
					$right->authorize = $item['custom'];
					$right->last_time = DbUtils::getDateTimeNowStr();
					$right->update();
				} else {
					$user_site = new User_site();
					$user_site->user_id = $uid;
					$user_site->top_uid = $top_uid;
					$user_site->site_id = $item['site_id'];
					$user_site->role_id = $item['role_id'];
					$user_site->authorize = $item['custom'];
					$user_site->last_time = DbUtils::getDateTimeNowStr();
					$user_site->save();
				}
			}
			return true;
		}
		return false;
	}
}
