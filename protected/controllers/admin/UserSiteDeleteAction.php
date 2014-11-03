<?php
class UserSiteDeleteAction extends CAction
{

	public function run(
		$user_id = 0, $site_id = 0, $out = '',
		$callback = false, $tmpl = 'json'
	) {		
		$user_site = User_site::model()->findByAttributes( array('user_id' => intval($user_id), 'site_id' => intval($site_id)) );
		if(!$user_site) {
			json_encode_end(array('error' => '没有查找到相关记录'));
		}
		$user = Users::model()->findByPk($user_id);
		if(!$user) {
			json_encode_end(array('error' => '没有查找到相关用户'));
		}
		if($user->level == 1 || $user->level ==2) {
			json_encode_end(array('error' => '管理员不能通过这里取消授权'));
		}
		if($user_site->user_id == $user_site->top_uid) {
			json_encode_end(array('error' => '不能删除网站创始人的网站关联记录'));
		}					
		if($user_site->delete()) {
//			Logs::writeLog('delete','user_site',$user->email.'');
			json_encode_end(array('success' => true));
		} else {
			json_encode_end(array('error' => '删除失败'));
		}
	}
}