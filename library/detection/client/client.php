<?php
require_once(dirname(__FILE__) . '/../db.php');
require_once("transform/UserAgentParser.php");

class Client extends DB {

	static function detectOsBrowserLang($agent = false, $accept_language = false) {
		return array_merge(
			array('os' => self::detectOs($agent)),
			array('browser' => self::detectBrowser($agent)),
			array('language' => self::detectLanguage($accept_language)
		));
	}
	// agent: true表示从header读入agent, 否则需要手动传入
	// code: true表示返回type/version/subversion三个字段, false表示不返回
	// name: true表示返回type_name/version_name/subversion_name/description/icon字段, false表示不返回
	// 返回: 失败返回false, 成功返回相应
	static function detectOs($agent = false, $code = true, $name = true) {
		self::initMemcache();
		if (!$info = self::getMemcache("os" . md5($agent))) {
			$info = self::detectParser("os", $agent);
			self::setMemcache("os" . md5($agent), $info);
		}
		if ($info) {
			if ($code === true && $name === true) {
				return $info;
			} elseif ($code === true) {
				unset($info['icon']);
				unset($info['type_name']);
				unset($info['version_name']);
				unset($info['subversion_name']);
				unset($info['description']);
			} else {
				unset($info['id']);
				unset($info['type']);
				unset($info['version']);
				unset($info['subversion']);
			}
			return $info;
		}
		return false;
	}
	static function getOsByCode($type = 0, $version = 0, $code = 0) {
		return UserAgentParser::getOSById($type, $version, $code);
		$result = false;
		foreach(UserAgentParser::$osInfo as $os) {
			if ($type == $os['type'] && $version == $os['version'] && $code == $os['subversion']) {
				$result = array(
					'type_name' => @$os['type_name'],
					'version_name' => @$os['version_name'],
					'subversion_name' => @$os['subversion_name'],
					'description' => @$os['description'],
					'icon' => @$os['icon'],
				);
			}
		}
		return $result;
	}


	static function detectBrowser($agent = false, $code = true, $name = true) {
		self::initMemcache();
		if (!$info = self::getMemcache("browser" . md5($agent))) {
			$info = self::detectParser("browser", $agent);
			self::setMemcache("browser" . md5($agent), $info);
		}
		if ($info) {
			if ($code === true && $name === true) {
				return $info;
			} elseif ($code === true) {
				unset($info['icon']);
				unset($info['type_name']);
				unset($info['version_name']);
				unset($info['subversion_name']);
				unset($info['description']);
			} else {
				unset($info['id']);
				unset($info['type']);
				unset($info['version']);
				unset($info['subversion']);
			}
			return $info;
		}
		return false;
	}
	static function getBrowserByCode($type = 0, $version = 0, $code = 0) {
		return UserAgentParser::getBrowserById($type, $version, $code);
		$result = false;
		$type_name = $version_name = $subversion_name = $description = $icon = null;
		foreach(UserAgentParser::$browserInfo as $browser) {
			if ($type == $browser['type']) {
				$type_name = @$browser['type_name'];
				$icon = @$browser['icon'];
				if ($version == $browser['version']) {
					$version_name = @$browser['version_name'];
					if ($code == $browser['subversion']) {
						$subversion_name = @$browser['subversion_name'];
						$description = @$browser['description'];
					}
				}
			}
		}

		if (!$description) {
			$version_name = ($version - $type) / 10;
			$description = "{$type_name}{$version_name}";
		}
		$result = array(
			'type_name' => $type_name,
			'version_name' => $version_name,
			'subversion_name' => $subversion_name,
			'description' => $description,
			'icon' => $icon,
		);
		return $result;
	}


	static function detectLanguage($accept_language, $code = true, $name = true) {
		$accept_language = !empty($accept_language) ? $accept_language :
			( (!empty($_SERVER["HTTP_ACCEPT_LANGUAGE"])) ?  $_SERVER["HTTP_ACCEPT_LANGUAGE"] : '');
		if ($accept_language) {
			$lang = explode(";", $accept_language);
			$lang = explode(",", $lang[0]);
			$language = strtolower($lang[0]);

			if ($language) {
				$lanInfo = require("language.code.php");
				foreach($lanInfo as $type => $lan) {
					if ($language == @$lan['name']) {
						return array('type' => $type);
					}
				}
			}
		}
		return array('type' => 0);
	}
	static function getLanguageByCode($type = 0) {
		$lanInfo = require("language.code.php");
		return isset($lanInfo[$type]) ? $lanInfo[$type]['description'] : '其他';
	}

	static function detectParser($type, $agent = false) {
		$agent = $agent ? $agent : $_SERVER["HTTP_USER_AGENT"];
		$result = array();

		if ($type == "browser")
			$result = UserAgentParser::getBrowser($agent);
		else if ($type == "os")
			$result = UserAgentParser::getOperatingSystem($agent);

		if ($result) {
			return $result;
		}
		return false;
	}

	static function getLanguageList() {
		$lanInfo = require(dirname(__FILE__) . "/language.code.php");
		$data = array();
		foreach ($lanInfo as $k => $value) {
			$data[] = array(
				'name' => $value['description'],
				'value' => $k,
			);
		}
		return $data;
	}
	static function getBrowserTypeList() {
		return UserAgentParser::getBrowserTypeList();
	}
	static function getOsTypeList() {
		return UserAgentParser::getOsTypeList();
	}
	static function getResolutionList() {
		return array(
			array(
				'name' => '1024 X 768', 
				'value' => 10240768,
			),
			array(
				'name' => '1280 X 800', 
				'value' => 12800800,
			),
			array(
				'name' => '1440 X 900', 
				'value' => 14400900,
			),
			array(
				'name' => '1366 X 768', 
				'value' => 13660768,
			),
			array(
				'name' => '1920 X 1080', 
				'value' => 19201080,
			),
			array(
				'name' => '1680 X 1050', 
				'value' => 16801050,
			),
			array(
				'name' => '800 X 600', 
				'value' => 8000600,
			),
			array(
				'name' => '1600 X 900', 
				'value' => 16000900,
			),
			array(
				'name' => '1152 X 720', 
				'value' => 11520720,
			),
			array(
				'name' => '1360 X 768', 
				'value' => 13600768,
			),
			array(
				'name' => '1364 X 768', 
				'value' => 13640768,
			),
			array(
				'name' => '320 X 480', 
				'value' => 3200480,
			),
			array(
				'name' => '768 X 1024', 
				'value' => 7681024,
			),
			array(
				'name' => '640 X 480', 
				'value' => 6400480,
			),
		);
	}
}

//var_dump(Client::detectOsBrowserLang("Mozilla/5.0 (iPad; U; CPU OS 5_1_1 like Mac OS X; zh-cn) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3"));

/** test 
var_dump(Client::detectBrowser("Mozilla/5.0 (Windows NT 5.1; rv:9.0.1) Gecko/20100101 Firefox/9.0"));
//var_dump($l = Client::detectLanguage('zh-cn'));
//var_dump(Client::getLanguageByCode($l['type']));
**/
//var_dump(Client::detectOs("Mozilla/5.0 (Windows NT 5.1; rv:9.0.1) Gecko/20100101 Firefox/9.0.1"));
//var_dump(Client::getOsByCode(10012,10019));
//var_dump(Client::detectOsBrowserLang("Mozilla/5.0 (Windows NT 5.1; rv:10.0.2) Gecko/20100101 Firefox/10.0.2"));
//var_dump(Client::detectOsBrowserLang("Mozilla/5.0 (Linux; U; Android 2.3.5; zh-cn; MI-ONE Plus Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"));
//var_dump(Client::getBrowserByCode(10013, 10113));
//var_dump(Client::detectBrowser("Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 702; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; 360SE)"));
//var_dump(Client::detectOsBrowserLang("Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 702; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; baidubrowser 1.x)"));
//var_dump(Client::detectOsBrowserLang("Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 702; TencentTraveler 4.0; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)"));
//var_dump(Client::detectOsBrowserLang("Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 702; TencentTraveler 4.0; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; SE 2.X MetaSr 1.0)"));
//var_dump(Client::detectOsBrowserLang("Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 702; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729) QQBrowser/6.10.11509.201"));
//var_dump(Client::detectOsBrowserLang("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11"));
