<?php
require_once(dirname(__FILE__) . '/../db.php');
define("IP_DATA", "/data/resources/geo/ip.dat");
class Geo extends DB {
	static $default_geo = array(
		'country' => 0,
		'region' => 0,
		'city' => 0,
		'ip' => 0,
		'isp' => 0,
	);
	static function detectGeo($ip = false, $code = true, $name = true) {
		self::initDb();
		if ($ip === false) {
			if (isset($_SERVER['REMOTE_ADDR'])) {
				$ip = $_SERVER['REMOTE_ADDR'];
			} else {
				return self::$default_geo;
			}
		}

		self::initMemcache();
		if ($info = self::getMemcache("ip" . md5($ip))) {
			return $info;
		}

		$isp = self::getIsp($ip);

		$ip_int = ip2long($ip);

		// $sql = sprintf('SELECT * FROM conf_ip WHERE start_ip <= %s ORDER BY start_ip DESC limit 1', $ip_int);
		$sqlBuilder = self::getSqlBuilder();
		$sql = $sqlBuilder->select('conf_ip')
					->where(sprintf("`start_ip` <= %s", $ip_int))
					->order('`start_ip` DESC')
					->limit(1)->text();
		if (($result = self::$db->query($sql)) === false) {
			return self::$default_geo;
		}
		if (($row = self::$db->fetchAssoc($result)) === false || $ip_int >= $row['end_ip']) {
			//$row['location_id'] = 1;
			return self::$default_geo;
		}

		// $sql = sprintf('SELECT * FROM conf_location WHERE id = %s limit 1', $row['location_id']);
		$sqlBuilder = self::getSqlBuilder();
		$sql = $sqlBuilder->select('conf_location')
					->where(sprintf("`id` = %s", $row['location_id']))
					->limit(1)->text();
		if (($result = self::$db->query($sql)) === false) {
			return self::$default_geo;
		}
		if (($row = self::$db->fetchAssoc($result)) === false) {
			return self::$default_geo;
		}

		$info = array(
			'country' => $row['country'],
			'region' => $row['region'],
			'city' => $row['city'],
			'ip' => $ip,
			'isp' => $isp,
		);
		self::setMemcache("ip" . md5($ip), $info);
		return $info;
	}

	static function getGeoByCode($country = 0, $region = 0, $code = 0) {
		self::initDb();

		// $sql = sprintf("SELECT * FROM conf_location WHERE country = %d AND region = %d AND city = %d",
		// 	intval($country),
		// 	intval($region),
		// 	intval($code)
		// );
		$sqlBuilder = self::getSqlBuilder();
		$sql = $sqlBuilder->select('conf_location')
					->where(sprintf("`country` = %d AND `region` = %d AND `city` = %d", 
									intval($country), intval($region), intval($code))
					)->text();
		if (($result = self::$db->query($sql)) === false) {
			return false;
		}
		if (($row = self::$db->fetchAssoc($result)) === false) {
			return false;
		}

		return array(
			'country_name' => $row['country_name_cn'],
			'region_name' => $row['region_name_cn'],
			'city_name' => $row['city_name_cn'],
			'icon' => $row['icon'],
			'latitude' => $row['latitude'],
			'longitude' => $row['longitude'],
		);
	}

	static function getCountryIdsByWord($word) {
		self::initDb();
		//$sql = sprintf("SELECT country FROM conf_location WHERE MATCH(`country_name`, `country_name_cn`) AGAINST('%s')", "%$word%");
		// $sql = sprintf("SELECT country FROM conf_location WHERE country_name LIKE '%s' OR country_name_cn LIKE '%s'", "%$word%", "%$word%");
		$sqlBuilder = self::sql_builder();
		$sql = $sqlBuilder->select('conf_location', '`country`')
						  ->where( sprintf("`country_name` LIKE '%s' OR `country_name_cn` LIKE '%s'", "%$word%", "%$word%") )
						  ->text();
		if (($result = self::$db->query($sql)) === false) {
			return false;
		}
		$ids = array();
		while($row = self::$db->fetchAssoc($result)) {
			$ids[] = $row["country"];
		}
		return $ids;

	}

	static function getRegionIdsByWord($word) {
		self::initDb();
		//$sql = sprintf("SELECT region FROM conf_location WHERE MATCH(`region_name`, `region_name_cn`) AGAINST('%s')", "%$word%");
		// $sql = sprintf("SELECT region FROM conf_location WHERE region_name LIKE '%s' OR region_name_cn LIKE '%s'", "%$word%", "%$word%");
		$sqlBuilder = self::sql_builder();
		$sql = $sqlBuilder->select('conf_location', '`region`')
						  ->where( sprintf("`region_name` LIKE '%s' OR `region_name_cn` LIKE '%s'", "%$word%", "%$word%") )
						  ->text();
		if (($result = self::$db->query($sql)) === false) {
			return false;
		}
		$ids = array();
		while($row = self::$db->fetchAssoc($result)) {
			$ids[] = $row["region"];
		}
		return $ids;

	}

	static function getCityIdsByWord($word) {
		self::initDb();
		//$sql = sprintf("SELECT city FROM conf_location WHERE MATCH(`city_name`, `city_name_cn`) AGAINST('%s')", "%$word%");
		// $sql = sprintf("SELECT city FROM conf_location WHERE city_name LIKE '%s' OR city_name_cn LIKE '%s'", "%$word%", "%$word%");
		$sqlBuilder = self::sql_builder();
		$sql = $sqlBuilder->select('conf_location', '`city`')
						  ->where( sprintf("`city_name` LIKE '%s' OR `city_name_cn` LIKE '%s'", "%$word%", "%$word%") )
						  ->text();
		if (($result = self::$db->query($sql)) === false) {
			return false;
		}
		$ids = array();
		while($row = self::$db->fetchAssoc($result)) {
			$ids[] = $row["city"];
		}
		return $ids;

	}

	static function getCountryList() {
		self::initDb();
		// $sql = sprintf("SELECT * FROM conf_location GROUP BY country");
		$sql = DbUtils::getSqlf('Lib_Det_Geo_1');
		if (($result = self::$db->query($sql)) === false) {
			return false;
		}
		$data = array();
		while($row = self::$db->fetchAssoc($result)) {
			if ($row['country_name_cn']) {
				$data[] = array(
					'id' => $row['country'],
					'name' => $row['country_name_cn'],
				);
			} else {
				$data[] = array(
					'id' => $row['country'],
					'name' => $row['country_name'],
				);
			}
		}
		return $data;
	}

	static function getRegionListByCountryID($country = 10761) {
		self::initDb();
		// $sql = sprintf("SELECT * FROM conf_location WHERE country = %d GROUP BY region", intval($country));
		$sql = DbUtils::getSqlf('Lib_Det_Geo_2', intval($country));
		if (($result = self::$db->query($sql)) === false) {
			return false;
		}
		$data = array();
		while($row = self::$db->fetchAssoc($result)) {
			if ($row['region_name_cn']) {
				$data[] = array(
					'value' => $row['region'],
					'name' => $row['region_name_cn'],
				);
			} else {
				$data[] = array(
					'value' => $row['region'],
					'name' => $row['region_name'],
				);
			}
		}
		return $data;
	}

	static function getIspList() {
		$list = require(dirname(__FILE__) . '/isp.conf.php');
		$data = array();
		foreach ($list as $k => $v) {
			$data[] = array(
				'value' => $k,
				'name' => $v['name'],
			);
		}
		return $data;
	}

	static function getIsp($ip) {
		include_once("iplocation.php");
		$ipquery = new IpLocation(IP_DATA);
		$location = $ipquery->getlocation(ip2long($ip));
		$city = isset($location['city']) ? $location['city'] : "";
		$city = iconv("CP936", "UTF-8", $city);

		$config = require(dirname(__FILE__) . "/isp.conf.php");
		foreach ($config as $isp => $rules) {
			if (strpos($city, $rules['name']) !== false) {
				return $isp;
			}

			if (isset($rules['in'])) {
				foreach ($rules['in'] as $rule) {
					if (strpos($city, $rule) !== false) {
						return $isp;
					}
				}
			}
		}

		return 0; //其他
	}

	static function getIspByCode($code) {
		$config = require(dirname(__FILE__) . "/isp.conf.php");
		return isset($config[$code]) ? $config[$code]['name'] : '其他';
	}

	static function getIspIdsByWord($word) {
		$ids = array();
		$config = require(dirname(__FILE__) . "/isp.conf.php");
		foreach ($config as $isp => $rules) {
			if (strpos($word, $rules['name']) !== false) {
				$ids[] = $isp;
			}

			if (isset($rules['in'])) {
				foreach ($rules['in'] as $rule) {
					if (strpos($word, $rule) !== false) {
						$ids[] = $isp;
					}
				}
			}
		}

		return $ids;
	}
}


/*
var_export(Geo::detectGeo('211.66.1.1', true, true));
var_export(Geo::detectGeo('59.41.242.167', true, true));
var_export(Geo::detectGeo('220.181.112.143', true, true));
var_export(Geo::detectGeo('180.149.134.17', true, true));
var_export(Geo::detectGeo('121.10.141.90', true, true));
var_export(Geo::detectGeo('210.14.69.133', true, true));
var_export(Geo::detectGeo('202.97.224.69', true, true));
var_export(Geo::detectGeo('61.128.105.1', true, true));
var_export(Geo::detectGeo('124.31.80.17', true, true));
var_export(Geo::getIsp('121.10.141.90'));
var_export(Geo::getIsp('211.66.1.1'));
var_export(Geo::getIsp('113.108.49.106'));
var_export(Geo::detectGeo('211.66.1.1', false, true));
var_export(Geo::detectGeo('211.66.1.1', true, false));
var_export(Geo::detectGeo('211.66.1.1', false, false));
var_export(Geo::detectGeo('113.108.49.106', true, true));
var_export(Geo::getIspByCode(12000));
var_export(Geo::detectGeo('211.66.1.1'));
var_export(Geo::detectGeo('59.41.242.167'));
var_export(Geo::detectGeo('220.181.112.143'));
var_export(Geo::detectGeo('180.149.134.17'));
var_export(Geo::detectGeo('121.10.141.90'));
var_export(Geo::detectGeo('210.14.69.133'));

var_export(Geo::getGeoByCode(10761, 10789, 47667));
var_export(Geo::getGeoByCode(10761, 10789, 0));
var_export(Geo::getGeoByCode(10761, 0, 0));
// print_r(Geo::getRegionListByCountryID());
// print_r(Geo::getCountryList());
// Geo::getGeoByCode();
*/

