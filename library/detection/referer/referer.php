<?php
require_once(dirname(__FILE__) . '/../../utils/utils.php');
require_once(dirname(__FILE__) . '/../../../midlayer/Info/inc.php');

class Referer {
static function keywordDecode($keyword) {
	$keyword = urldecode(urldecode($keyword));

	mb_detect_order("ASCII,UTF-8,CP936");
	$encode = mb_detect_encoding($keyword);
	if($encode == "CP936"){
		$keyword = iconv("CP936", "UTF-8", $keyword);
	}
	return trim($keyword);
}

static function getSearchEngine($url) {
	$se_regx = require(dirname(__FILE__) . "/se.conf.php");
	foreach ($se_regx as $se => $rules) {
		foreach ($rules as $rule) {
			if (preg_match('#'.$rule.'#i', $url, $matches)) {
				$keyword = self::keywordDecode($matches[1]);
				$seInfo = self::getSe("$se");
				return array(
					"subtype" => $seInfo['subtype'],
					"subtype_name" => $seInfo['name'],
					"icon" => $seInfo['icon'],
					"description" => $seInfo['description'],
					"keyword" => $keyword,
				);
			}
		}
	}

	return null;
}

static function getSe($name) {
	$config = require(dirname(__FILE__) . "/referer.code.php");
	foreach ($config[2]['child'] as $subtype => $se) {
		if ($name === $se['name']) {
			$se['subtype'] = $subtype;
			return $se;
		}
	}

	return null;
}

static function getSeNameByCode($subtype) {
	if (empty($subtype)) {
		return null;
	}
	$config = require(dirname(__FILE__) . "/referer.code.php");
	if ($config) {
		return $config[2]['child'][$subtype];
	}

	return false;
}

static function getRefererTypeByCode($type) {
	$config = require(dirname(__FILE__) . "/referer.code.php");
	if ($config) {
		return $config[$type]['name'];
	}

	return false;
}

static function getSnsReferer($domain) {
	$config = require(dirname(__FILE__) . "/referer.code.php");
	foreach ($config[3]['child'] as $subtype => $sns) {
		if (strstr($domain, $sns['name'])) {
			$sns['subtype'] = $subtype;
			return $sns;
		}
	}

	return null;
}

static function getMailReferer($domain, $url) {
	$config = require(dirname(__FILE__) . "/referer.code.php");
	foreach ($config[4]['child'] as $subtype => $mail) {
		if (strstr($domain, $mail['name'])) {
			$mail['subtype'] = $subtype;
			return $mail;
		}
	}
	return null;
}

// @type: 0: directly; 1: other; 2: se; 3: sns; 4: mail; 5: ad;
static public function getReferer($referer_url, $page_url, $mz_ad_cookie=false)
{
	$page_domain = Utils::getDomain($page_url);
	$referer_domain = Utils::getDomain($referer_url);
	//来源类型
	$referer_type = 0;
	//是否广告来源  0 否  1 是
	$is_advertise = 0;
	$keyword = null;
	$se_name = null;
	$se = null;
	$gutm = InfoGUtm::detectGUtm($page_url);
	// 检查是否同一域名
	if ($mz_ad_cookie !== false) {
		if (strpos($mz_ad_cookie.',', 'dm:'.$page_domain.',') === false) {
			$mz_ad_cookie=false;
		}
	}
	$utm  = InfoUtm::detectUtm($page_url, $mz_ad_cookie);
	if ($gutm !== false || $utm !== false) {
		$is_advertise = 1;
		$referer_type = 5;
		$referer_subtype = 0;
	} else {
		if (empty($referer_domain) || empty($referer_url) || $referer_domain === $page_domain) {
			//直接访问
			$referer_type = 0;
			$referer_url = null;
			$referer_domain = null;
			$referer_subtype = 0;
		} else if (($se = self::getSearchEngine($referer_url)) !== null ) {
			//搜索引擎
			$referer_type = 2;
			$referer_subtype = $se['subtype'];
		} else if (($sns = self::getSnsReferer($referer_domain, $referer_url)) != null) {
			//社会化媒体
			$referer_type = 3;
			$referer_subtype = $sns['subtype'];
		} else if (($mail = self::getMailReferer($referer_domain, $referer_url)) != null) {
			//邮件
			$referer_type = 4;
			$referer_subtype = $mail['subtype'];
		} else {
			//其它链接
			$referer_type = 1;
			$referer_subtype = 0;
		}
	}

	$referer = array(
		'type' => $referer_type,
		'subtype' => $referer_subtype,
		'is_advertise' => $is_advertise,
		'keyword' => @$se['keyword'],
		'se' => @$se['subtype'],
		'se_name' => @$se['subtype_name'],
		'domain' => $referer_domain,
		'url' => $referer_url,

		'caid' => @$utm['caid'],
		'spid' => @$utm['spid'],
		'kwid' => @$utm['kwid'],
		'mzcr' => @$utm['mzcr'],
		'mzsr' => @$utm['mzsr'],
		'mzsb' => @$utm['mzsb'],

		'gutm_source_id'    => @$gutm['source_id'],
		'gutm_medium_id'    => @$gutm['medium_id'],
		'gutm_term_id'      => @$gutm['term_id'],
		'gutm_content_id'   => @$gutm['content_id'],
		'gutm_campaign_id'  => @$gutm['campaign_id'],
	);

	return $referer;
}

static function getSource0List() {
	$config = require(dirname(__FILE__) . "/referer.code.php");
	$data = array();
	foreach ($config as $k => $v) {
		$data[] = array(
			'name' => $v['name'],
			'value' => $k,
		);
	}
	return $data;
}

}


/** test
var_dump(Referer::getReferer("http://mail.163.com", "http://www.clicki.cn"));
var_dump(Referer::getReferer("http://weibo.com", "http://www.clicki.cn"));
var_dump(Referer::getReferer("http://www.baidu.com/s?word=%B5%DA%C8%FD%B7%BD%CD%F8%D5%BE%CD%B3%BC%C6&tn=sitehao123", "http://www.clicki.cn"));
/**/

