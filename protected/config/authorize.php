<?php
/**
 * *【重要说明】
 * * 如要添加新权限配置，请选择一个未使用过的权限ID，以免造成数据错乱 
 */
return array(	
	//用户管理
	'user' => array(	
		10001 => array('controller' => 'admin','action' => 'user','title' => '用户列表', 'desc'=>'查看系统内所有用户', 'is_show'=>1, 'path'=>'user', 'id'=>'userList'),
		10002 => array('controller' => 'admin','action' => 'useredit','title' => '添加用户', 'desc'=>'添加系统用户', 'is_show'=>1, 'path'=>'addUser', 'id'=>'addUser'),
		10003 => array('controller' => 'admin','action' => 'userdelete','title' => '删除用户', 'desc'=>'删除系统用户', 'is_show'=>1),
		10004 => array('controller' => 'admin','action' => 'userrecycle','title' => '还原用户', 'desc'=>'恢复已删除的用户', 'is_show'=>1, 'path'=>'userRecycle', 'id'=>'userRecycle'),
		10005 => array('controller' => 'admin','action' => 'role','title' => '角色列表', 'desc'=>'查看系统内已有的角色', 'is_show'=>1, 'path'=>'role', 'id'=>'roleList'),
		10006 => array('controller' => 'admin','action' => 'roleadd','title' => '添加角色', 'desc'=>'为系统添加用户角色', 'is_show'=>1, 'path'=>'addrole', 'id'=>'addRole'),
		10007 => array('controller' => 'admin','action' => 'roleedit','title' => '编辑角色', 'desc'=>'修改系统角色信息', 'is_show'=>1),
		10008 => array('controller' => 'admin','action' => 'roledelete','title' => '删除角色', 'desc'=>'删除系统角色', 'is_show'=>1),
		10009 => array('controller' => 'admin','action' => 'roleuseredit','title' => '修改用户权限', 'desc'=>'修改用户的系统功能权限', 'is_show'=>1),		
	),
	//系统监控
	'monitor' => array(
	    20001 => array('controller' => 'admin','action' => 'operationLog','title' => '业务日志', 'desc'=>'查看系统用户的关键操作日志', 'is_show'=>1, 'path'=>'operationlog', 'id'=>'operationLog'),
	    20003 => array('controller' => 'admin','action' => 'monitorprocess','title' => '服务日志', 'desc'=>'查看系统进程与服务的运行日志、状态', 'is_show'=>1, 'path'=>'monitorprocess', 'id'=>'monitorprocess'),
	),
	//算法平台
	'algorithm' => array(
	    30001 => array('controller' => 'algorithm', 'action' => 'scene', 'title' => '应用场景', 'desc' => '查看算法应用场景的具体信息', 'is_show' => 1),
	    30002 => array('controller' => 'algorithm', 'action' => 'editscene', 'title' => '修改应用场景参数', 'desc' => '修改算法应用场景的具体参数', 'is_show' => 1),
	    30003 => array('controller' => 'algorithm', 'action' => 'resulthandle', 'title' => '结果控制', 'desc' => '人工干预算法结果', 'is_show' => 1),
	    30004 => array('controller' => 'algorithm', 'action' => 'resulthandle', 'title' => '新增结果控制', 'desc' => '新增结果控制方案', 'is_show' => 1),
	    30005 => array('controller' => 'algorithm', 'action' => 'resulthandle', 'title' => '编辑结果控制', 'desc' => '编辑结果控制方案', 'is_show' => 1),
	    30006 => array('controller' => 'algorithm', 'action' => 'delhandle', 'title' => '删除结果控制', 'desc' => '删除结果控制方案', 'is_show' => 1),
	    30007 => array('controller' => 'algorithm', 'action' => 'handledetail', 'title' => '结果控制明细', 'desc' => '查看结果控制明细', 'is_show' => 1),
	    30008 => array('controller' => 'algorithm', 'action' => 'training', 'title' => '算法训练', 'desc' => '根据算法参数设置执行算法训练', 'is_show' => 1),
	    30009 => array('controller' => 'algorithm', 'action' => 'previewresult', 'title' => '推荐结果预览', 'desc' => '查看算法推荐结果', 'is_show' => 1),
	    30010 => array('controller' => 'algorithm', 'action' => 'algorithmlist', 'title' => '算法列表', 'desc' => '查看系统所有算法', 'is_show' => 1),
	    30011 => array('controller' => 'algorithm', 'action' => 'editalgorithm', 'title' => '算法设置', 'desc' => '修改算法的参数', 'is_show' => 1),
	    30012 => array('controller' => 'algorithm','action' => 'manageprocess','title' => '作业管理', 'desc'=>'管理算法作业', 'is_show'=>1, 'path'=>'manageprocess', 'id'=>'manageprocess'),
	    30013 => array('controller' => 'algorithm', 'action' => 'passportuser', 'title' => '通行证用户查询', 'desc' => '根据属性条件搜索通行证用户群', 'is_show' => 1),
	    30014 => array('controller' => 'algorithm', 'action' => 'videosource', 'title' => '视频源搜索', 'desc' => '根据查询条件搜索指定的视频', 'is_show' => 1),
	    30015 => array('controller' => 'algorithm', 'action' => 'manualrecomm', 'title' => '手动干预', 'desc' => '为特定用户群推送特定视频', 'is_show' => 1),
	    30016 => array('controller' => 'algorithm', 'action' => 'feedback', 'title' => '推荐反馈', 'desc' => '查看推荐结果的反馈效果', 'is_show' => 1),
	),
	//热点微博
	'weibo' => array(
		40001 => array('controller' => 'algorithm', 'action' => 'weiborank', 'title' => '排行榜', 'desc' => '查看微博内容、用户、话题的排行', 'is_show' => 1),
		40002 => array('controller' => 'algorithm', 'action' => 'weibotrend,usertrend,topictrend', 'title' => '趋势', 'desc' => '查看微博内容、用户、话题的热度趋势', 'is_show' => 1),
	)
);
