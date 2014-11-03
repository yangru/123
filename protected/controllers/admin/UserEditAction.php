<?php
class UserEditAction extends CAction {
	public function run($name = '', $email = '', $pass = '', $uid = 0, $super = false, $rights = '', $out = '', $callback = false, $tmpl = 'json') {
		$arrRights = json_decode ( $rights, true );
		if (isset ( $arrRights [0] ['role_id'] ) === false) {
			json_encode_end ( array (
					'error' => '没有权限操作' 
			) );
		}
		
		$userAuth = User_site::userAuth ( user ()->id );
		$user_level = isset ( $userAuth ['level'] ) ? $userAuth ['level'] : 0;
		
		$top_uid = isset ( $userAuth ['top_uid'] ) ? $userAuth ['top_uid'] : user ()->id;
		
		if ($pass) {
			if (! $this->password_reg ( $pass )) {
				json_encode_end ( array (
						'error' => '密码长度不小于8位，且同时包含大写字母、小写字母、数字和特殊字符四类要素中的任意三种' 
				) );
			}
		}
		
		// 如果是免费版，还要对BBS记录用户信息
		$model = new LoginForm ( 'reg' );
		if ($uid) {
			$top_uid = $userAuth ['top_uid'];
			if ($user_level == 2) {
				$query = array (
						'id' => $uid 
				);
			} else {
				$query = array (
						'id' => $uid,
						'top_uid' => $top_uid 
				);
			}
			if ($user = Users::model ()->findByAttributes ( $query )) {
				if ($user->status == 0)
					json_encode_end ( array (
							'error' => '用户在回收站中，不能操作' 
					) );
				if ($user->id == user ()->id)
					json_encode_end ( array (
							'error' => '不能操作自己的权限' 
					) );
				if ($model->validate ()) {
					if ($pass) {
						$user->password = $user->hashPassword ( $pass );
					}
					$user->checksum = Users::generate_checksum ( $user->email, time () );
					$user->last_time = DbUtils::getDateTimeNowStr ();
					if (($user_level == 1 || $user_level == 2) && $super) {
						$user->level = 1;
					} else {
						if ($uid == $user->top_uid) {
							json_encode_end ( array (
									'error' => '不能取消顶级管理的管理员身份' 
							) );
						}
						if ($user->id == $top_uid) {
							json_encode_end ( array (
									'error' => '不能取消顶级管理的管理员身份' 
							) );
						}
						$user->level = 0;
					}
					if ($user->update ()) {
						if ($user_level != 2) { // 超级管理员不能修改用户的网站分配权限信息
							$this->withRights ( $rights, $user );
						}
					}
				}
				Logs::writeLog ( 'edit', 'user', $user->user_name );
				json_encode_end ( array (
						'success' => 'true' 
				) );
			}
		} else {
			$model->user_name = $name;
			$model->email = $email;
			$model->password = $pass;
			
			if ($model->validate () && $user = $model->createUser ()) {
				/**
				 * 如果是超级管理员start*
				 */
				if ($user_level == 2) {
					$user->belong_uid = $user->id;
					$user->top_uid = $user->id;
					if ($super) {
						$user->level = 1;
					} else {
						$user->level = 3;
						$user->belong_uid = user ()->id;
						$user->top_uid = user ()->id;
					}
					$user->update ();
					json_encode_end ( array (
							'success' => 'true' 
					) );
				}
				/**
				 * end*
				 */
				
				$user->belong_uid = user ()->id;
				$user->top_uid = $userAuth ['top_uid'];
				
				if ($user_level == 1 && $super) {
					$user->level = 1;
				}
				$user->update ();
				// 设置管理权限
				if ($user->level != 1) {
					$this->withRights ( $rights, $user );
				}
				Logs::writeLog ( 'add', 'user', $user->user_name );
				json_encode_end ( array (
						'success' => 'true' 
				) );
			}
			$errors = $model->getErrors ();
			$error_txt = '保存失败';
			
			if ($errors) {
				foreach ( $errors as $key => $error ) {
					$error_txt .= ' ' . $model->getError ( $key );
				}
			}
			json_encode_end ( array (
					'error' => $error_txt 
			) );
		}
	}
	private function withRights($rights, $user) {
		if ($rights) {
			$rights = json_decode ( $rights, true );
			$old_rights = User_site::model ()->findAllByAttributes ( array (
					'user_id' => $user->id,
					'top_uid' => $user->top_uid 
			) );
			// 保存权限分配信息
			foreach ( $rights as $item ) {
				$right = array ();
				$item ['site_id'] = intval ( $item ['site_id'] );
				if ($old_rights) {
					foreach ( $old_rights as $key => $old_right ) {
						if ($item ['site_id'] == $old_right->site_id) {
							$right = $old_right;
							unset ( $old_rights [$key] );
						}
					}
				}
				if (isset ( $item ['custom'] ) && is_array ( $item ['custom'] )) {
					$item ['custom'] = @implode ( ',', $item ['custom'] );
				}
				// 对权限中重复的部分进行过滤
				if ($item ['role_id'] && $item ['custom']) {
					$role_id = $item ['role_id'];
					$authorize = $item ['custom'];
					$role = Roles::model ()->findByPk ( $role_id );
					if ($role) {
						$authlist = $role->authlist;
						$authorize_array = explode ( ',', $authorize );
						$authlist_array = explode ( ',', $authlist );
						$common = array_intersect ( $authlist_array, $authlist_array );
						$differ = array_diff ( $authorize_array, $common );
						$item ['custom'] = implode ( ',', $differ );
					}
				}
				if ($right) {
					$right->role_id = $item ['role_id'];
					$right->authorize = $item ['custom'];
					$right->last_time = DbUtils::getDateTimeNowStr ();
					$right->update ();
				} else {
					$user_site = new User_site ();
					$user_site->user_id = $user->id;
					$user_site->top_uid = $user->top_uid;
					$user_site->site_id = $item ['site_id'] ? $item ['site_id'] : '10001';
					$user_site->role_id = $item ['role_id'];
					$user_site->authorize = $item ['custom'];
					$user_site->last_time = DbUtils::getDateTimeNowStr ();
					$user_site->save ();
				}
			}
			if ($old_rights) {
				foreach ( $old_rights as $key => $old_right ) {
					$old_right->delete ();
				}
			}
			return true;
		}
		return false;
	}
	private function password_reg($str) {
		if (strlen ( $str ) < 8)
			return false;
		$reg_array = array (
				'/[a-z]/',
				'/[A-Z]/',
				'/[0-9]/',
				'/[^a-zA-Z0-9_]/' 
		);
		$reg_count = 0;
		foreach ( $reg_array as $reg ) {
			$reg_count += preg_match ( $reg, $str );
		}
		return $reg_count > 2 ? true : false;
	}
}
