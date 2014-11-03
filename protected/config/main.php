<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.

require(dirname(__FILE__) . DS . 'define.php');
$params = require(dirname(__FILE__) . DS . 'params.php');
$jsconf = jsconf_load('app');
$dbconf = $jsconf[ $jsconf['dbtype'] ];
$dbConnectionString = array(
    'mysql' => 'mysql:host='.$dbconf['host'].';port='.$dbconf['port'].';dbname='.$dbconf['database'],
    'oracle' => 'oci:dbname='.$dbconf['host'].':'.$dbconf['port'].'/'.$dbconf['database'].';charset=UTF8',
);

return array(
	'id' => $params["cookieDomain"],
	'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'name' => $params['sitename'],
    'charset' => $params['charset'],
    'language' => $params['language'],
    'layout' => 'main',
    'theme' => $params['theme'],
    'timeZone' => $params['timezone'],
    
    //默认路由
    'defaultController' => 'user/login',

	// preloading 'log' component
	'preload'=>array('log'),

	// autoloading model and component classes
	'import'=>array(
        'ext.*',
		'application.models.*',
		'application.models.user.models.*',
		'application.models.user.components.*',
		'application.models.algorithm.*',
		'application.components.*',
		'application.components.Clicki.*',
        'application.components.Clicki.Portlet.*',
        //'application.modules.rights.*',
        //'application.modules.rights.components.*',
        'application.modules.admin.models.*',
        'application.modules.admin.components.*',
		'ext.YiiMongoDbSuite.*',
		'ext.yiidebugtb.*',
		'ext.CJuiDateTimePicker.*',
		'ext.mailer.*',
		'ext.OpenFlashChart2Widget.*',
		'ext.swfobject.*',
		//'ext.open-sdk.*',
	),

	'modules'=>array(
		// uncomment the following to enable the Gii tool
		/*
		'gii'=>array(
			'class'=>'system.gii.GiiModule',
			'password'=>'clicki',
		 	// If removed, Gii defaults to localhost only. Edit carefully to taste.
			//'ipFilters'=>array('127.0.0.1','::1'),
		),
		*/
    	'admincp' => array(
    	    'layout' => 'main',
    	),
    	/*'rights' => array(
    		'userNameColumn' => 'email',
    		'install' => true,
    		'debug' => true,
    	),	*/	
		/*
    	'open' => array(
			'layout' => 'main',
    	),
		 */
	),

	// application components
	'components'=>array(
		'user'=>array(
			//'class' => 'RWebUser',
			// enable cookie-based authentication
			'allowAutoLogin'=>true,
		    'identityCookie' => array(
                'path' => $params['cookiePath'],
                'domain' => $params['cookieDomain'],
            ),
		    'guestName' => 'guest',
		    'loginUrl' => array('user/login'),
		),
		// uncomment the following to enable URLs in path-format
		
		'urlManager' => array(
            'urlFormat' => $params['urlFormat'],
		    'showScriptName' => false,
		    'appendParams' => false,
		    //'urlSuffix' => '.html',
            'rules' => array(
		        //登录、注册、退出 URL
		        '<_a:(login|logout|reg|apply_account|forgot|callback)>' => array('user/<_a>', 'urlSuffix' => '.html'),
		        'user/<_a>/<id:\d+>/<checksum>' => 'user/<_a>',
		        'user/<_a>/<id:\d+>' => 'user/<_a>',
		        '<_a:resendmail>' => array('user/<_a>', 'urlSuffix'=>''),
		        //后台管理URL
		        'user/<uname:([^m]|[^(admin)]|[^(rights)]\w+)>' => array('home/user', 'urlSuffix'=>''),

				//后台首页
		        'site/<site_id:\-?\d+>' => 'home',
		        'manage/' => 'home',

				//download excel utm
                'download/<type:utm_page>/<site_id:\d+>/<begindate:\d+-\d+-\d+>/<enddate:\d+-\d+-\d+>' => array('feed/group', 'defaultParams' => array('order' => 'pageviews|-1', 'tmpl' => 'export', 'limit' => 99999)),
            ),
        ),
        
		// uncomment the following to use a MySQL database

		'db'=>array(
			'connectionString' => $dbConnectionString[$jsconf['dbtype']],
			'schemaCachingDuration' => 3600,
			'emulatePrepare' => true,
			'username' => $dbconf['username'],
			'password' => $dbconf['password'],
			'charset' => 'utf8',
			'tablePrefix' => '',
			'enableParamLogging' => true,
			'enableProfiling' => true,
		),
		'db_cntv_uc' => array (
				'class' => 'CDbConnection',
				'connectionString' => 'mysql:host=' . $jsconf ['mysql_cntv_uc'] ['host'] . ';port=' . $jsconf ['mysql_cntv_uc'] ['port'] . ';dbname=' . $jsconf ['mysql_cntv_uc'] ['database'],
				'emulatePrepare' => true,
				'username' => $jsconf ['mysql_cntv_uc'] ['username'],
				'password' => $jsconf ['mysql_cntv_uc'] ['password'],
				'charset' => 'utf8',
				'tablePrefix' => '',
				'enableParamLogging' => true,
				'enableProfiling' => true 
		),
		'authManager' => array(
		    'class' => 'RDbAuthManager',
            'connectionID' => 'db',
		),

		'assetManager' => array(
		    'basePath' => $params['resourceBasePath'] . 'assets',
		    'baseUrl' => $params['resourceBaseUrl'] . 'assets',
		),

		'themeManager' => array(
		    'basePath' => dirname(__FILE__) . '/../../themes',
		    'baseUrl' => $params['resourceBaseUrl'] . 'themes',
		),

		/*
		 * memcache的内存方式
		 
		'cache'=>array(
 			'class'=>'system.caching.CMemCache',
 			'servers'=>array(
 				array(
 					'host' => $jsconf['memcache']['host'],
 					'port'=> $jsconf['memcache']['port'],
 					'weight' => 60,
 				)
 			)
 		),*/
		
		'session' => array(
            'sessionName' => md5('d^&&S*Df'),
            'cookieParams' => array(
                'path' => $params['cookiePath'],
                'domain' => $params['cookieDomain'],
            ),
        ),
        
        
		/*
		'errorHandler'=>array(
			// use 'site/error' action to display errors
            'errorAction'=>'site/error',
        ),
        */
	),

	// application-level parameters that can be accessed
	// using Yii::app()->params['paramName']
	'params'=>$params,
);
