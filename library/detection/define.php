<?php

require_once(dirname(__FILE__) . '/../jsconf/jsconf.php');
$jsconf = jsconf_load('app');

// define('MYSQL_HOST', $jsconf['mysql']['host']);
// define('MYSQL_PORT', $jsconf['mysql']['port']);
// define('MYSQL_DB', $jsconf['mysql']['database']);
// define('MYSQL_USER', $jsconf['mysql']['username']);
// define('MYSQL_PASSWORD', $jsconf['mysql']['password']);

define('MEMCACHE_HOST', $jsconf['memcache']['host']);
define('MEMCACHE_PORT', $jsconf['memcache']['port']);
define('MEMCACHE_SWITCH', "on");
define('MEMCACHE_KEY_PRE', "detection_");
