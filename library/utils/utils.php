<?php
define('PARAM_TYPE_STRING', 10000);
define('PARAM_TYPE_MAP', 10001);
define('PARAM_TYPE_ARRAY', 10002);
define('PARAM_TYPE_INT', 10003);
define('PARAM_TYPE_FILTER', 10004);
class Utils {

static $getfilter = "'|(and|or)\\b.+?(>|<|=|in|like)|\\/\\*.+?\\*\\/|<\\s*script\\b|\\bEXEC\\b|UNION.+?Select|Update.+?SET|Insert\\s+INTO.+?VALUES|(Select|Delete).+?FROM|(Create|Alter|Drop|TRUNCATE)\\s+(TABLE|DATABASE)";
static $postfilter = "\\b(and|or)\\b.{1,6}?(=|>|<|\\bin\\b|\\blike\\b)|\\/\\*.+?\\*\\/|<\\s*script\\b|\\bEXEC\\b|UNION.+?Select|Update.+?SET|Insert\\s+INTO.+?VALUES|(Select|Delete).+?FROM|(Create|Alter|Drop|TRUNCATE)\\s+(TABLE|DATABASE)";
static $cookiefilter = "\\b(and|or)\\b.{1,6}?(=|>|<|\\bin\\b|\\blike\\b)|\\/\\*.+?\\*\\/|<\\s*script\\b|\\bEXEC\\b|UNION.+?Select|Update.+?SET|Insert\\s+INTO.+?VALUES|(Select|Delete).+?FROM|(Create|Alter|Drop|TRUNCATE)\\s+(TABLE|DATABASE)";

static private function stopAttack($str) {
	if (preg_match("/" . self::$getfilter . "/is", $str)) exit("error param");
}

/**
 * 解析参数
 * @param  mixed $value 有可能为String或Array
 * @param  PARAM_TYPE $type  参数类型
 * @param  PARAM_TYPE $type2 如果$type为数组，则可以通过$type2指定数组里面的类型
 * @return [type]        [description]
 */
static public function parseParam($value, $type, $type2 = PARAM_TYPE_STRING) {
	if (is_string($value)) {
		self::stopAttack($value);
		$value = addslashes($value);
	}

	switch ($type) {
		case PARAM_TYPE_STRING:
			if (empty($value)) {
				return '';
			} else {
				return $value;
			}
			break;
		case PARAM_TYPE_INT:
			if (empty($value)) {
				return 0;
			} else {
				return intval($value);
			}
		case PARAM_TYPE_ARRAY:
			if (empty($value)) {
				return array();
			} else {
				$res = explode(',', $value);
				if ($type2 != PARAM_TYPE_STRING) {
					foreach ($res as $key => $val) {
						$res[$key] = self::parseParam($val, $type2);
					}
				}
				return $res;
			}
		case PARAM_TYPE_MAP:
			if (empty($value)) {
				return array();
			} else {
				$param = array();
				$items = explode(',', $value);
				foreach ($items as $item) {
					$map = explode('|', $item);
					$k = $map[0];
					$v = $map[1];
					if (isset($param[$k])) {
						//针对“效果分析” 的过滤条件改动
						$val = $param[$k];
						$param[$k] = array(
							'min' => $val,
							'max' => $v
						);
					} else {
						$param[$k] = $v;
					}
				}
				return $param;
			}
		case PARAM_TYPE_FILTER:
			if (empty($value)) {
				return array();
			} elseif (is_array($value)) {
				return array(array($value));
			} else {
				//按这个顺序
				//或、大于等于、小于等于、不等于、大于、小于
				$split = array("|", ">=", "=<", "<>", ">", "<");
				$condition = array();
				foreach (explode(',', $value) as $str0) {
					foreach($split as $char) {
						@list($key, $value) = explode($char, $str0);
						#echo "$char#$key#$value\n";
						if ($char == "|" && $key && strlen($value)) {
							if (isset($condition[$key])) {
								$temp = $condition[$key];
								if (is_array($temp)) {
									$condition[$key] = array_merge($temp, array($value));
								} else {
									$condition[$key] = array_merge(array($temp), array($value));
								}
							} else {
								$condition[$key] = $value;
							}
						} elseif ($key && strlen($value)) {
							if (preg_match("/^[A-Za-z0-9_]+$/is", $key)) $condition[$key] = "{} $char '$value'";
						}
					}
				}
				return array(array($condition));
			}
		default:
			return $value;
			break;
	}
}

static public function renderTime($time) {
	$time = intval($time);
	$second = $time % 60; $time = intval($time/60);
	$min = $time % 60; $time = intval($time/60);
	$hour = $time % 24; $time = intval($time/24);
	$day = $time;

	$str = '';

	$flag = false;
	if ($day > 0 || $flag) {
		$flag = true;
		$str .= "{$day}天";
	}
	$flag = false;
	if ($hour > 0 || $flag) {
		$flag = true;
		$str .= "{$hour}小时";
	}
	$flag = false;
	if ($min > 0 || $flag) {
		$flag = true;
		$str .= "{$min}分钟";
	}

	$str .= "{$second}秒";
	return $str;
}

static public function getDomain($url) {
	$url = parse_url($url);
	return isset($url['host']) ? $url['host'] : false;
}

static public function convertToUTF8($input) {
	mb_detect_order("ASCII,UTF-8,CP936");
	$encode = mb_detect_encoding($input);
	if($encode == "CP936"){
		$input = iconv("CP936", "UTF-8", $input);
	}
	return $input;
}

static public $reviews_interval = array(
	10 => array('text'	=> '1次', 'min'	=> 1, 'max'	=> 1),
	11 => array('text'	=> '2次', 'min'	=> 2, 'max'	=> 2),
	12 => array('text'	=> '3次', 'min' => 3, 'max' => 3),
	13 => array('text'	=> '4次', 'min'	=> 4, 'max'	=> 4),
	14 => array('text'	=> '5 ~ 10次',	'min' => 5,  'max' => 10),
	15 => array('text'	=> '11 ~ 20次',	'min' => 11, 'max' => 20),
	16 => array('text'	=> '21 ~ 50次', 'min' => 21, 'max' => 50),
	17 => array('text'	=> '50次以上',	'min' => 50, 'max' => 1000000000),
);
static public function unconvertReviewSlot($input) {
	return isset(self::$reviews_interval[$input]) ?  self::$reviews_interval[$input]['text'] : '未知';
}
static public function convertReviewSlot($input) {
	foreach (self::$reviews_interval as $id => $point) {
		if ($input >= $point['min'] && $input <= $point['max']) {
			return $id;
		}
	}
	return 0;
}
static public function getReviewslotList() {
	$data = array();
	foreach (self::$reviews_interval as $k => $v) {
		$data[] = array(
			'value' => $k,
			'name' => $v['text'],
		);
	}
	return $data;
}

static public $depth_interval = array(
	10 => array('text'	=> '1页', 'min'	=> 1, 'max'	=> 1),
	11 => array('text'	=> '2页', 'min'	=> 2, 'max'	=> 2),
	12 => array('text'	=> '3页', 'min' => 3, 'max' => 3),
	13 => array('text'	=> '4页', 'min'	=> 4, 'max'	=> 4),
	14 => array('text'	=> '5 ~ 10页',	'min' => 5,  'max' => 10),
	15 => array('text'	=> '11 ~ 20页',	'min' => 11, 'max' => 20),
	16 => array('text'	=> '21 ~ 50页', 'min' => 21, 'max' => 50),
	17 => array('text'	=> '50页以上',	'min' => 50, 'max' => 1000000000),
);
static public function unconvertDepth($input) {
	return isset(self::$depth_interval[$input]) ?  self::$depth_interval[$input]['text'] : '未知';
}
static public function convertDepth($input) {
	foreach (self::$depth_interval as $id => $point) {
		if ($input >= $point['min'] && $input <= $point['max']) {
			return $id;
		}
	}
	return 0;
}
static public function getDepthList() {
	$data = array();
	foreach (self::$depth_interval as $k => $v) {
		$data[] = array(
			'value' => $k,
			'name' => $v['text'],
		);
	}
	return $data;
}


static public $time_interval = array(
	10 => array('text'	=> '0 ~ 10秒',		'min' => 0,		'max' => 10),
	11 => array('text'	=> '10 ~ 30秒',		'min' => 10,	'max' => 30),
	12 => array('text'	=> '30 ~ 60秒',		'min' => 30,	'max' => 60),
	13 => array('text'	=> '1 ~ 5分钟',		'min' => 60,	'max' => 300),
	14 => array('text'	=> '5 ~ 10分钟',	'min' => 300,	'max' => 600),
	15 => array('text'	=> '10 ~ 30分钟',	'min' => 600,	'max' => 1800),
	16 => array('text'	=> '30 ~ 60分钟',	'min' => 1800,	'max' => 3600),
	17 => array('text'	=> '1小时以上',		'min' => 3600,	'max' => 10000000),
);
static public function unconvertTimeSlot($input) {
	return isset(self::$time_interval[$input]) ?  self::$time_interval[$input]['text'] : '未知';
}
static public function convertTimeSlot($input) {
	if ($input < 0) {
		$input = 0;
	}
	foreach (self::$time_interval as $id => $point) {
		if ($input >= $point['min'] && $input < $point['max']) {
			return $id;
		}
	}
	return 0;
}
static public function getStayslotList() {
	$data = array();
	foreach (self::$time_interval as $k => $v) {
		$data[] = array(
			'value' => $k,
			'name' => $v['text'],
		);
	}
	return $data;
}

static public $pixels_interval = array(
	10 => array('text'	=> '0 ~ 1万(像素)',			'min' => 0,		'max' => 1),
	11 => array('text'	=> '1 ~ 10万(像素)',		'min' => 1,		'max' => 10),
	12 => array('text'	=> '10 ~ 50万(像素)',		'min' => 10,		'max' => 50),
	13 => array('text'	=> '50 ~ 100万(像素)',		'min' => 50,		'max' => 100),
	14 => array('text'	=> '100 ~ 150万(像素)',		'min' => 100,		'max' => 150),
	15 => array('text'	=> '150 ~ 200万(像素)',		'min' => 150,		'max' => 200),
	16 => array('text'	=> '200 ~ 500万(像素)',		'min' => 200,		'max' => 500),
	17 => array('text'	=> '500万(像素)以上',		'min' => 500,		'max' => 10000000),
);
static public function unconvertPixels($input) {
	return isset(self::$pixels_interval[$input]) ?  self::$pixels_interval[$input]['text'] : '未知';
}
static public function convertPixels($input) {
	foreach (self::$pixels_interval as $id => $point) {
		if ($input >= $point['min'] && $input < $point['max']) {
			return $id;
		}
	}
	return 0;
}

static public function flattenArray($param, $sp = '.') {
	$result = array();
	foreach ($param as $k => $v) {
		if (is_array($v)) {
			$items = Utils::flattenArray($v);
			foreach ($items as $k0 => $v0) {
				$result[$k . $sp . $k0] = $v0;
			}
		} else {
			$result[$k] = $v;
		}
	}
	return $result;
}

static public function createSign($str) {
	return sprintf("%d", hexdec(substr(md5($str), 8, 15)));
}

static public function zeroSign() {
	return 0;
}

/**
 * 生成访问路径的节点id
 * @param  String $url  url或者频道聚类ID
 * @return Int     节点ID
 */
static public function createVisitPathNodeId($url) {
	if (is_numeric($url)) {
		return intval($url);
	}
	return self::createSign($url);
}

/**
 * 获取访问路径的完整路径ID
 * @param  integer  $node_id          节点id
 * @param  integer $parent_path_id=0 父节点路径id
 * @return integer                    完整的路径id
 */
static public function getVisitPathId($node_id, $parent_path_id=0) {
	if ($parent_path_id === 0) {
		return $node_id;
	}
	return self::createSign($parent_path_id.$node_id);
}

/**
 * 获取访问路径维度过滤的key
 * @param  integer $dim_type          过滤的维度类型
 * @param  integer $dim_value		  维度的值
 * @return integer                    key
 */
static public function getVisitPathDimKey($dim_type, $dim_value) {
	if (intval($dim_type) === 0) {
		return 0;
	}
	return self::createSign($dim_type."_".$dim_value);
}

}


//var_export(Utils::parseParam('browser_type_id|100_200_300+os_type_id|100,geo|120', PARAM_TYPE_FILTER));
//var_export(Utils::convertTimeSlot(0));


