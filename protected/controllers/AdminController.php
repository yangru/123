<?php
require_once(dirname(__FILE__) . '/../../library/utils/utils.php');

class AdminController extends Controller {

public $authorize;

public function actions() {
	$this->authorize = require(dirname(__FILE__) . '/../config/authorize.php');
	return array(
		'site' => 'application.controllers.admin.SiteAction',
		'siteedit' => 'application.controllers.admin.SiteEditAction',
		'sitedelete' => 'application.controllers.admin.SiteDeleteAction',
		'siteuseredit' => 'application.controllers.admin.SiteUserEditAction',
		'visitauth' => 'application.controllers.admin.VisitAuthAction',
		'user' => 'application.controllers.admin.UserAction',
		'userlist' => 'application.controllers.admin.UserListAction',
		'userrecycle' => 'application.controllers.admin.UserRecycleAction',
		'userdelete' => 'application.controllers.admin.UserDeleteAction',
		'useredit' => 'application.controllers.admin.UserEditAction',		
		'usersite' => 'application.controllers.admin.UserSiteAction',
		'usersitejoin' => 'application.controllers.admin.UserSiteJoinAction',
		'usersiteedit' => 'application.controllers.admin.UserSiteEditAction',
		'usersitedelete' => 'application.controllers.admin.UserSiteDeleteAction',
		'usersubordinateedit' => 'application.controllers.admin.UserSubordinateEditAction',
		'userrestrictedit' => 'application.controllers.admin.UserRestrictEditAction',
		'role' => 'application.controllers.admin.RoleAction',
		'roleadd' => 'application.controllers.admin.RoleAddAction',
		'roledelete' => 'application.controllers.admin.RoleDeleteAction',
		'roleedit' => 'application.controllers.admin.RoleEditAction',		
		'roleuser' => 'application.controllers.admin.RoleUserAction',
		'roleuseradd' => 'application.controllers.admin.RoleUserAddAction',
		'roleuseredit' => 'application.controllers.admin.RoleUserEditAction',
		'operationlog' => 'application.controllers.admin.OperationLogAction',
		'serverlog' => 'application.controllers.admin.ServerLogAction',
		'processmanage' => 'application.controllers.admin.ProcessManageAction',
		'processedit' => 'application.controllers.admin.ProcessEditAction',
		'processmonitor' => 'application.controllers.admin.ProcessMonitorAction',
		'processlog' => 'application.controllers.admin.ProcessLogAction',
		'processctrl' => 'application.controllers.admin.ProcessCtrlAction',
	);
}

public function filters() {
	return array(
		'access'
	);
}

public function filterAccess($filterChain) {
	//验证权限
	$filterChain->run();
	return true;
}

public function initParam($param) {
	$param1 = array();
	$defaults = array(
		'fields' => array(),
		'group' => array(),
		'filter' => array(),
		'order' => array(),
		'limit' => 10,
		'offset' => 0,
	);
	foreach ($defaults as $k => $v) {
		if (isset($param[$k])) {
			$param1[$k] = $param[$k];
		} else {
			$param1[$k] = $v;
		}
	}
	return $param1;
}
public function getWhere($filter) {
	$where2 = array();
	foreach ($filter as $conditions) {
		$where1 = array();
		foreach ($conditions as $condition) {
			$where0 = array();
			foreach ($condition as $field => $value) {
				if ($in_str = $this->getSplit($value)) {
					$where0[] = "$field in($in_str)";
					continue;
				}
				if (strpos($value, '{}') === false) {
					$where0[] = "$field = '$value'";
				} else {
					$where0[] = str_replace('{}', $field, $value);
				}
			}
			$where1[] = "(" . implode(' and ', $where0) . ")";
		}
		$where2[] = "(" . implode(' or ', $where1) . ")";
	}
	$where =  implode(' and ', $where2);
	//echo json_encode ($where);
	//die();
	return $where;
}

private function getSplit($value) {
	$in_str = "";
	if (is_array($value) && $value) {
		foreach ($value as $val) {
			if (is_numeric($val)) {
				$in_str .= "$val,";
			} elseif (is_string($val)) {
				$in_str .= "'$val',";
			}
		}
		$in_str = substr($in_str, 0, strlen($in_str) - 1);
	}

	return $in_str;
}

public function getOrder($order) {
	$result = array();
	foreach ($order as $field => $value) {
		$index = ($value == 1) ? 'ASC' : 'DESC';

		$result[] = "$field $index";
	}
	return $result;
}
}
