<?php

// change the following paths if necessary
$yiic=dirname(__FILE__).'/../library/framework/yiic.php';
$config=dirname(__FILE__).'/config/console.php';
defined('DS') or define('DS', DIRECTORY_SEPARATOR);
$base_path = rtrim(dirname(dirname(__FILE__)), DS);
define('BASEPATH', $base_path);
defined('YII_INFO') or define('YII_INFO', 'INFO');
defined('YII_ERROR') or define('YII_ERROR', 'ERROR');
@putenv('YII_CONSOLE_COMMANDS='. dirname(__FILE__).'/commands' );

require_once($yiic);
