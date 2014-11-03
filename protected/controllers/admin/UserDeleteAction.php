<?php
class UserDeleteAction extends CAction {
	public function run($uid = 0, $out = '', $callback = false, $tmpl = 'json') {
		header ( 'Content-type: application/json' );
		$uid = intval ( $uid );
		if ($uid == user ()->id) {
			echo json_encode ( array (
					'error' => '不能删除自己的账户' 
			) );
			return;
		}
		$op_user = Users::model ()->findByPk ( user ()->id );
		if ($op_user->top_uid == $uid) {
			echo json_encode ( array (
					'error' => '不能删除自己的顶级账户' 
			) );
			return;
		}
		$user = Users::model ()->findByPk ( $uid );
		if ($op_user->level != 2 && $op_user->top_uid != $user->top_uid) {
			echo json_encode ( array (
					'error' => '不是归属于同一个顶级账户，不能进行操作' 
			) );
			return;
		}
		if ($user->id) {
			$user->status = 0;
			if ($user->update ()) {
				$objUsers = User_site::model ()->findAllByAttributes ( array (
						'user_id' => $user->id 
				) );
				foreach ( $objUsers as $objUser ) {
					$objUser->delete ();
				}
				Logs::writeLog ( 'delete', 'user', $user->user_name );
				echo json_encode ( array (
						'success' => true 
				) );
				return;
			}
		} else {
			echo json_encode ( array (
					'error' => '删除失败' 
			) );
			return;
		}
	}
}
