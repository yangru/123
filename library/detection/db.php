<?php

require_once(dirname(__FILE__) . '/../db/db.php');
require_once('define.php');
class DB {

	static $db = false;
	static $memcache;
	static function initDb() {
		if (self::$db === false) {
			self::$db = DbFactory::getInstance('app');
		}
	}

	static function getSqlBuilder() {
		return DbFactory::createSqlBuilder('app');
	}

	static function initMemcache() {
		if (!self::$memcache && MEMCACHE_SWITCH == "on") {
			self::$memcache = new Memcached();
			//self::$memcache->connect(MEMCACHE_HOST, MEMCACHE_PORT);
		}
	}

	static function getMemcache($key) {
		if (self::$memcache) return self::$memcache->get($key);
	}

	static function setMemcache($key, $data, $timeout = 86400) {
		if (self::$memcache) {
			self::$memcache->set(MEMCACHE_KEY_PRE . $key, $data, $timeout);
		}
	}
}
