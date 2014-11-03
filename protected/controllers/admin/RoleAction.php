<?php
class RoleAction extends CAction {
	public function run($role_id = 0, $authorize = '', $user_id = 0, $word = '', $page = 1, $limit = 20, $out = '', $callback = false, $tmpl = 'json') {
		if ($out === 'html') {
			$this->controller->render ( "role" );
			app ()->end ();
		}
		
		if (! empty ( $_POST ) && isset ( $_POST ["condition"] )) {
			$condition = $_POST ["condition"];
		}
		
		$page = Utils::parseParam ( $page, PARAM_TYPE_INT );
		$limit = Utils::parseParam ( $limit, PARAM_TYPE_INT );
		$offset = $limit * ($page - 1);
		
		if ($authorize !== '') {
			$limit = - 1;
		}
		
		$param = $this->controller->initParam ( array (
				// 'filter' => Utils::parseParam($condition, PARAM_TYPE_FILTER),
				// 'order' => Utils::parseParam($order, PARAM_TYPE_MAP),
				'limit' => $limit,
				'offset' => $offset 
		) );
		
		$criteria = new CDbCriteria ();
		$top_uid = Users::getTopBelong ( user ()->id );
		$criteria->join = "INNER JOIN users u ON u.id = t.user_id AND u.top_uid = " . $top_uid;
		if ($role_id)
			$criteria->addCondition ( 't.id=' . Utils::parseParam ( $role_id, PARAM_TYPE_INT ) );
		
		$word = addslashes ( urldecode ( $word ) );
		if ($word)
			$criteria->addSearchCondition ( 't.name', $word );
		
		$criteria->limit = $param ['limit'];
		$criteria->offset = $param ['offset'];
		
		$result = self::loadItems ( $criteria );
		if (! empty ( $result ['items'] )) {
			foreach ( $result ['items'] as $key => $value ) {
				$result ['items'] [$key] ['role_num'] = User_site::get_role_num ( $value ['id'], $top_uid );
			}
		}
		
		if ($tmpl == 'json') {
			if ($authorize) {
				$result ['authorize'] = self::loadAuthorizes ();
			}
			self::json_return ( array (
					'success' => true,
					'result' => $result 
			), $callback );
		}
	}
	private static function loadItems($criteria) {
		$roles = Roles::model ()->findAll ( $criteria );
		$count = Roles::model ()->count ( $criteria );
		$_items = array ();
		if ($roles) {
			foreach ( $roles as $role ) {
				$_items [] = $role->getAttributes ();
			}
		}
		return array (
				'items' => $_items,
				'total' => $count 
		);
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
	private function loadAuthorizes() {
		$authorizes = $this->controller->authorize;
		$new_authorizes = array ();
		foreach ( $authorizes as $key => $value ) {
			foreach ( $value as $k => $v ) {
				if (isset ( $v ['is_show'] ) && $v ['is_show']) {
					$new_authorizes [$key] [$k] = $v;
				}
			}
		}
		return $new_authorizes;
	}
}

