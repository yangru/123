<?php
/**
 * 限制客户顶级管理账户
 * $uid 顶级客户ID 
 * $grant 0表示不限制，1表示限制
 */
class UserRestrictEditAction extends CAction
{
	public function run(		
		$uid = 0, $grant = 0
	) {	
		$user_id = intval($uid);		
		if(!$user_id) {
			json_encode_end(array('error'=>'用户参数错误'));
		}		
		$userAuth = User_site::userAuth(user()->id);
		$user_level = isset($userAuth['level']) ? $userAuth['level'] : 0;
		if($user_level != 2) {
			json_encode_end(array('error'=>'没有权限操作'));
		}	
		$user = Users::model()->findByPk($user_id);
		if(!$user) {
			json_encode_end(array('error'=>'没有找到该用户'));
		}
		if($user->top_uid != $user->id || $user->level != 1) {
			json_encode_end(array('error'=>'不是顶级账户'));
		}		
		if($grant) {
			$restrict = 1;
			$log_action = 'restrict';
		} else {
			$restrict = 0;
			$log_action = 'unrestrict';			
		}
		$user->restrict = $restrict;		
		if($user->update()) {
			Logs::writeLog($log_action,'client',$user->email);			
		} else {
			json_encode_end(array('error'=>'限制操作失败'));
		}
		$users = Users::model()->findAllByAttributes(array('top_uid' => $user_id));
		if($users) {
			foreach ($users as $u) {
				$u->restrict = $restrict;
				$u->update();				
			}			
		}
		json_encode_end(array('success'=>'true'));
		
		
	}
}
