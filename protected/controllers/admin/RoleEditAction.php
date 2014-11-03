<?php
class RoleEditAction extends CAction {
	public function run($role_id = 0, $name = '', $desc = '', $authlist = '', $out = '', $callback = false, $tmpl = 'json') {
		$role = Sites::model ()->findByPk ( $role_id );
		if ($out === 'html') {
			$this->setPageTitle ( '修改角色' );
			user ()->setFlash ( 'navText', '修改角色' );
			user ()->setFlash ( 'readonly', array (
					'readonly' => 'readonly',
					'disabled' => 'disabled' 
			) );
			user ()->setFlash ( 'headerText', '修改角色 [' . $role->name . ']' );
			user ()->setFlash ( 'submitText', '' );
			$this->controller->render ( 'roleedit', array (
					'role' => $role 
			) );
			app ()->end ();
		}
		$objRole = Roles::model ()->findByAttributes ( array (
				'name' => $name 
		) );
		if ($objRole !== NULL) {
			if ($objRole->id !== $role_id) {
				$msg = array (
						'error' => '-ERROR: 角色名已存在.' 
				);
				self::json_return ( $msg, $callback );
				app ()->end ();
			}
		}
		$now = DbUtils::getDateTimeNowStr ();
		$query = array (
				'id' => $role_id 
		);
		$role = Roles::model ()->findByAttributes ( $query );
		if ($role) {
			$role->name = Utils::parseParam ( $name, PARAM_TYPE_STRING );
			$role->desc = Utils::parseParam ( $desc, PARAM_TYPE_STRING );
			$role->authlist = Utils::parseParam ( $authlist, PARAM_TYPE_STRING );
			$role->last_time = $now;
			if ($role->update ()) {
				$msg = array (
						'success' => 'true' 
				);
				Logs::writeLog ( 'edit', 'role', $role->name );
			} else {
				$msg = array (
						'error' => '请求参数错误1!' 
				);
			}
		} else {
			$msg = array (
					'error' => '请求参数错误2!' 
			);
		}
		if ($tmpl == 'json') {
			self::json_return ( $msg, $callback );
		}
		app ()->end ();
	}
	private static function json_return($data, $callback = false) {
		$json = json_encode ( $data );
		header ( 'Content-type: application/json' );
		if ($callback !== false) {
			echo "{$callback}({$json})";
		} else {
			echo $json;
		}
	}
}
