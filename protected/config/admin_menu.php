<?php
$user = array(
    array('label' => '用户列表', 'url'=>url('admincp/user/find')),
    array('label' => '添加用户', 'url'=>url('admincp/user/create')),
    array('label' => '关联网站', 'url'=>url('admincp/user/relate')),
    array('label' => '管理成员', 'url'=>url('admincp/user/manager')),
);
$site = array(
    array('label' => '站点列表', 'url'=>url('admincp/site/find')),
    array('label' => '添加站点', 'url'=>url('admincp/site/create')),
);

if (VERSION_TYPE === VERSION_TYPE_FREE) {
	array_push($site, array('label' => '无效站点', 'url'=>url('admincp/site/deny')));
	array_push($user, array('label' => '无效用户', 'url'=>url('admincp/user/deny')));
	array_push($user, array('label' => '审核用户', 'url'=>url('admincp/user/apply')));
}

return array(
    'site' => array(
    	'label'		=> '站点',
        'url'    	=> url('admincp/default/left', array('sub'=>'site')),
    	'sub'		=> $site,
        'show'		=> true,
    ),
    'user' => array(
    	'label'		=> '用户',
        'url'    	=> url('admincp/default/left', array('sub'=>'user')),
    	'sub'		=> $user,
        'show'		=> true,
    ),
);
