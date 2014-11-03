<?php

// This is the configuration for yiic console application.
// Any writable CConsoleApplication properties can be configured here.

require_once(dirname(__FILE__) . '/../../library/jsconf/jsconf.php');
$jsconf = jsconf_load('app');
return array(
	'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'name'=>'My Console Application',
	'import'=>array(
        'ext.*',
		'application.models.*',
		'application.components.*',
	),
	// application components
	'components'=>array(
		'db'=>array(
			'connectionString' => 'mysql:host='.$jsconf['mysql']['host'].';port='.$jsconf['mysql']['port'].';dbname='.$jsconf['mysql']['database'],
			'emulatePrepare' => true,
			'username' => $jsconf['mysql']['username'],
			'password' => $jsconf['mysql']['password'],
			'charset' => 'utf8',
			'tablePrefix' => '',
			'enableParamLogging' => true,
			'enableProfiling' => true,
		),
	),
);
