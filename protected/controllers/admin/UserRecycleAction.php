<?php
class UserRecycleAction extends CAction
{

	public function run( $user_id = 0
	) {
		
		$user_id = intval($user_id);
		if(!$user_id) json_encode_end(array('error'=>'非法的用户ID'));		
		$query = array('id'=>$user_id);
		$user = Users::model()->findByAttributes($query);
		if($user) {
			$user->status = 1;
			if($user->update()) {
				Logs::writeLog('recycle','user',$user->user_name);
				json_encode_end(array('success'=>true));
			}
		}
		json_encode_end(array('error'=>'还原失败'));		
	}
}
