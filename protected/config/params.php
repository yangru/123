<?php

return array(
    // 网站名称
    'sitename' => '互动运营管理平台',
    'cookieDomain' => $_SERVER["HTTP_HOST"],
    // cookie路径
    'cookiePath' => '/',
    
    'staticBasePath' => dirname(__FILE__) . DS . '..' . DS . '..' . DS . 'public' . DS . 'attachments' . DS,
    // 最后带 /
    'staticBaseUrl' => '/attachments/',

    // resource 路径
    'resourceBasePath' => dirname(__FILE__) . DS . '..' . DS . '..' . DS . 'public' . DS . 'resources' . DS,
    'resourceBaseUrl' => '/resources/',

	/* 是否开启数据请求Session验证 */
	'dataAuth' => 0,

    // 编码
    'charset' => 'utf-8',
    // 语言
    'language' => 'zh_cn',
    // 模板
    'theme' => 'default',
    /*
     * url类型 ，可取值为get或path，如果要实现伪静态，请设置为path
     * 并且将public目录下的.htaccess.bak文件改名为.htaccess
     */
    'urlFormat' => 'path',
    
    // 时区
    'timezone' => 'Asia/Shanghai',

    // 用户登陆失败几次后显示验证码
    'maxLoginErrorNums' => 3,
    
    // 用户登录如果选择在记住状态，默认cookie保存时间
    'autoLoginDuration' => 30*24*60*60,

    /*
     * Cookie名称
     */
    'cookieSiteToken' => md5('siteToken'),
    'cookiePostCommentInterval' => md5('cookiePostCommentInterval'),
    'cookieCommentInterval' => md5('cookieCommentInterval'),

    /*
     * 时间格式
     */
    // 日期时间格式
    'formatDateTime' => 'Y-m-d H:i:s',
    'formatShortDateTime' => 'Y-m-d H:i',
    'formatDate' => 'Y-m-d',
    'formatTime' => 'H:i:s',
    'formatShortTime' => 'H:i',
);
