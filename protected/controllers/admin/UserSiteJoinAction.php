<?php
/**
 * 关联用户与网站 
 */
class UserSiteJoinAction extends CAction
{
	public function run(		
		$user_id = 0 , $site_id = 0 , $unjoin = 0
	) {
		$user_id = intval($user_id);
		$site_id = intval($site_id);
		$userAuth = User_site::userAuth(user()->id);
		$user_level = isset($userAuth['level']) ? $userAuth['level'] : 0;
		if($user_level != 2) {
			json_encode_end(array('error'=>'没有权限操作'));
		}
		if($user_id == 0 || $site_id == 0) {
			json_encode_end(array('error'=>'用户与网站信息错误'));
		}
		$user = Users::model()->findByPk($user_id);
		if(!$user) {
			json_encode_end(array('error'=>'没有找到该用户'));
		}
		if($user->level != 1 || $user->top_uid != $user->id ) {
			json_encode_end(array('error'=>'只能是最初始的管理员才能进行网站关联'));
		}
		$site = Sites::model()->findByPk($site_id);
		if(!$site) {
			json_encode_end(array('error'=>'没有找到该网站'));
		}		
		
		if($unjoin) {		//取消关联
			$usites = User_site::model()->findAllByAttributes(array('top_uid'=>$user_id,'site_id'=>$site_id));		
			if(!$usites) {
				json_encode_end(array('error'=>'用户与网站已没有关联'));
			}
			Logs::writeLog('unjoin','site',$user->email);
			foreach ($usites as $usite) {
				$usite->delete();
			}
			json_encode_end(array('success'=>true));			
		}
		
		$usite = User_site::model()->findByAttributes(array('user_id'=>$user_id,'site_id'=>$site_id));		
		//关联操作
		if($usite) {
			json_encode_end(array('error'=>'用户与网站已经关联'));
		}
		$usite = new User_site();
		$usite->user_id = $user_id;
		$usite->site_id = $site_id;
		$usite->top_uid = $user->top_uid ? $user->top_uid : $user_id;
		$usite->role_id = 0;
		$usite->authorize = '';
		$usite->last_time = DbUtils::getDateTimeNowStr();
		if($usite->save()) {
			Logs::writeLog('join','site',$user->email);
			json_encode_end(array('success'=>true));
		}
		json_encode_end(array('error'=>'关联失败'));		
	}
}
