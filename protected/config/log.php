<?php
// 操作类型
$log ['type'] = array (
		'add' => '增加了',
		'delete' => '删除了',
		'edit' => '编辑了',
		'modify' => '修改了',
		'start' => '启动了',
		'stop' => '停止了',
		'set' => '设置了',
		'login' => '登陆',
		'logout' => '退出',
		'join' => '关联',
		'unjoin' => '取消关联',
		'restrict' => '限制',
		'unrestrict' => '取消限制',
		'recycle' => '还原了' 
);
// 操作对象类型
$log ['objtype'] = array (
		'site' => '网站',
		'user' => '用户',
		'role' => '角色',
		'process' => '作业',
		'algorithm' => '算法',
		'scene_algo' => '应用场景的算法',
		'scene_filter' => '应用场景的过滤/植入方案',
		'filter' => '过滤/植入方案',
		'manual_recomm' => '手动干预',
		'clear_recomm' => '清空干预' 
);

// 系统服务日志
$log ['server_log'] = array (
		'1' => array (
				'server_name' => '系统管理平台',
				'running_log' => '/data/logs/scribe/sys_manage_platform/sys_manage_platform-%s_00000',
				'error_log' => '/data/logs/scribe/sys_manage_platform_error/sys_manage_platform_error-%s_00000' 
		),
		'2' => array (
				'server_name' => '算法平台',
				'running_log' => '/data/logs/scribe/algorithm_platform/algorithm_platform-%s_00000',
				'error_log' => '/data/logs/scribe/algorithm_platform_error/algorithm_platform_error-%s_00000' 
		)
/*
		'3' => array(
		'server_name' => '平台接入层',
		'running_log' => '/data/logs/scribe/interface_platform/interface_platform-%s_00000',
		'error_log' => '/data/logs/scribe/interface_platform_error/interface_platform_error-%s_00000'
	),
	'4' => array(
		'server_name' => '数据挖掘平台',
		'running_log' => '/data/logs/scribe/database_platform/database_platform-%s_00000',
		'error_log' => '/data/logs/scribe/database_platform_error/database_platform_error-%s_00000'
	),
*/
);
return $log;