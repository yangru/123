<?php
/**
 * 赋予下属超级管理查看的权限 
 */
class UserSubordinateEditAction extends CAction
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
		if($user->top_uid != user()->id) {
			json_encode_end(array('error'=>'只能操作自己的下属'));
		}		
		if($user->level == 2) {
			json_encode_end(array('error'=>'不能操作该用户权限等级'));
		}
		if($grant) {
			$user->level = 3;
		} else {
			$user->level = 0;
		}
		if($user->update()) {
			Logs::writeLog('edit','user',$user->email);
			json_encode_end(array('success'=>true));
		}
		json_encode_end(array('error'=>'下属管理失败'));
	}
}
