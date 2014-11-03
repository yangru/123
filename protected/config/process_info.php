<?php
/** 作业管理 **/
return array(
    '1' => array(
		'name' => '视频推荐ICF算法离线计算作业',
		'desc' => '将用户视频行为数据持续更新到视频相似度矩阵中，为ICF算法的在线推荐服务提供数据支持。',
		'file_path' => '/home/cntv/shell/offlineCompute.sh',
		'engine' => 'sh ',
		'engine_params' => ' ',
		'process_name' => 'videoOfflineICF',
		'process_params' => ' videoOffline icf %s %s',
		'remote_ip' => '127.0.0.1',
		'remote_port' => 22,
		'login_name' => 'root',
		'login_pwd' => 'P@ssw0rd1234'
	),
	'2' => array(
		'name' => '视频推荐UCF算法离线计算作业',
		'desc' => '将用户视频行为数据持续更新到视频相似度矩阵中，为UCF算法的在线推荐服务提供数据支持。',
		'file_path' => '/home/cntv/shell/offlineCompute.sh',
		'engine' => 'sh ',
		'engine_params' => ' ',
		'process_name' => 'videoOfflineUCF',
		'process_params' => ' videoOffline ucf %s %s',
		'remote_ip' => '127.0.0.1',
		'remote_port' => 22,
		'login_name' => 'root',
		'login_pwd' => 'P@ssw0rd1234'
	),
	'3' => array(
		'name' => '微博好友推荐离线计算作业',
		'desc' => '根据用户的关系数据计算出好友推荐结果，为在线微博好友推荐服务提供数据支持。',
		'file_path' => '/home/cntv/shell/offlineCompute.sh',
		'engine' => 'sh ',
		'engine_params' => ' ',
		'process_name' => 'wbFriendOffline',
		'process_params' => ' wbFriendOffline ',
		'remote_ip' => '127.0.0.1',
		'remote_port' => 22,
		'login_name' => 'root',
		'login_pwd' => 'P@ssw0rd1234'
	),
	'4' => array(
		'name' => '微博内容推荐离线计算作业',
		'desc' => '根据用户的微博行为和关系数据计算出微博内容推荐结果，为在线微博内容推荐服务提供数据支持。',
		'file_path' => '/home/cntv/shell/offlineCompute.sh',
		'engine' => 'sh ',
		'engine_params' => ' ',
		'process_name' => 'wbContentOffline',
		'process_params' => ' wbContentOffline ',
		'remote_ip' => '127.0.0.1',
		'remote_port' => 22,
		'login_name' => 'root',
		'login_pwd' => 'P@ssw0rd1234'
	)
);
