<?php
defined('DS') or define('DS', DIRECTORY_SEPARATOR);
defined('VERSION_TYPE_FREE') or define('VERSION_TYPE_FREE', 1);
defined('VERSION_TYPE_PRO') or define('VERSION_TYPE_PRO', 2);
defined('YII_INFO') or define('YII_INFO', 'INFO');
defined('YII_ERROR') or define('YII_ERROR', 'ERROR');
defined('VERSION_TYPE_PRO') or define('VERSION_TYPE_PRO', 2);
require_once(dirname(__FILE__) . '/../library/jsconf/jsconf.php');
$jsconf = jsconf_load('app');
defined('VERSION_TYPE') or define('VERSION_TYPE', $jsconf['version_type']);
defined('DB_TYPE') or define('DB_TYPE', $jsconf["dbtype"]);
defined('YII_DEBUG') or define('YII_DEBUG', $jsconf["yii_debug"]);
defined('YII_TRACE_LEVEL') or define('YII_TRACE_LEVEL',10);
$base_path = rtrim(dirname(dirname(__FILE__)), DS);
define('BASEPATH', $base_path);
$yii = dirname(__FILE__) . '/../library/framework/yii.php';
$config = dirname(__FILE__) . '/../protected/config/main.php';
$global = dirname(__FILE__) . '/../library/global.php';

require_once($yii);
require_once($global);
$app = Yii::createWebApplication($config);
mb_internal_encoding(app()->charset);
$app->run();
