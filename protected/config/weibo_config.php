<?php
//微博用户类型
$weibo_config['type'] = array(
	'2' => '娱乐明星',
	'3' => '央视名栏目',
	'4' => '央视编辑、记者',
	'5' => '名人',
	'7' => '央视编辑',
	'12' => 'CNTV记者',
	'13' => '企业',
	'14' => 'CNTV品牌栏目',
	'15' => '出版社',
	'16' => '媒体',
	'17' => '中央电视台驻外记者',
	'19' => 'CNTV政务微博'
);
$weibo_config['base_url'] = "http://t.cntv.cn/";
$weibo_config['user_url'] = $weibo_config['base_url'] . "%s";
$weibo_config['weibo_url'] = $weibo_config['base_url'] . "?m=show&id=%s";
return $weibo_config;