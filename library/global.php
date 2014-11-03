<?php
/**
 * @author Chris Chen(cdcchen@gmail.com)
 * @version v1.0
 * @since 2010-9-7 10:39
 */

require_once(dirname(__FILE__) . '/db/utils.php');

/**
 * This is the shortcut to DIRECTORY_SEPARATOR
 */
defined('DS') or define('DS', DIRECTORY_SEPARATOR);

/**
* the clicki version
*/
defined('VERSION') or define('VERSION', 'test');

/**
 * This is the shortcut to Yii::app()
 * @return CApplication Yii::app()
 */
function app()
{
    return Yii::app();
}

/**
 * app path
 */
function app_path(){
	return YII_PATH . '/../../';
}

/**
 * Json输出
 *
 * @param array $result
 */
function json_encode_end($result)
{
	header('Content-Type: application/json; charset=utf-8'); 
	die(json_encode($result));
}
/**
 * This is the shortcut to Yii::app()->clientScript
 * @return CClientScript Yii::app()->clientScript
 */
function cs()
{
    return Yii::app()->clientScript;
}

/**
 * This is the shortcut to Yii::app()->createUrl()
 * @param string $route
 * @param array $params
 * @param string $anchor
 * @param string $ampersand
 * @return string 相对url地址
 */
function url($route, array $params=array(), $anchor = null, $ampersand='&')
{
    return Yii::app()->createUrl($route, $params, $ampersand) . ($anchor !== null ? '#' . $anchor : '');
}
/**
 * This is the shortcut to Yii::app()->createAbsoluteUrl()
 * @param string $route
 * @param array $params
 * @param string $anchor
 * @param string $ampersand
 * @return string 绝对url地址
 */
function aurl($route, array $params=array(), $schema='', $anchor = null, $ampersand='&')
{
    return Yii::app()->createAbsoluteUrl($route, $params, $schema, $ampersand) . ($anchor !== null ? '#' . $anchor : '');
}
 
/**
 * This is the shortcut to CHtml::encode
 * @param string $text 待处理字符串
 * @return string 使用CHtml::encode(即htmlspecialchars)处理过的字符串
 */
function h($text)
{
    return CHtml::encode($text);
}
 
/**
 * This is the shortcut to CHtml::link()
 * @param string $text 链接显示文本
 * @param string $url 链接地址
 * @param array $htmlOptions <a>标签附加属性
 * @return string <a>链接html代码
 */
function l($text, $url = '#', $htmlOptions = array())
{
    return CHtml::link($text, $url, $htmlOptions);
}
 
/**
 * This is the shortcut to Yii::t() with default category = 'stay'
 */
function t($message, $category = 'main', $params = array(), $source = null, $language = null)
{
    return Yii::t($category, $message, $params, $source, $language);
}
 
/**
 * This is the shortcut to Yii::app()->request->baseUrl
 * If the parameter is given, it will be returned and prefixed with the app baseUrl.
 * @param string $url 相对url地址
 * @return string 返回相对url地址
 */
function bu($url = null)
{
    static $baseUrl = null;
    if ($baseUrl === null)
        $baseUrl = rtrim(Yii::app()->request->baseUrl, '/') . '/';
    return $url === null ? $baseUrl : $baseUrl . ltrim($url, '/');
}

/**
 * This is the shortcut to Yii::app()->request->getBaseUrl(true)
 * If the parameter is given, it will be returned and prefixed with the app absolute baseUrl.
 * @param string $url 相对url地址
 * @return string 返回绝对url地址
 */
function abu($url = null)
{
    static $baseUrl = null;
    if ($baseUrl === null)
        $baseUrl = rtrim(Yii::app()->request->getBaseUrl(true), '/') . '/';
    return $url === null ? $baseUrl : $baseUrl. ltrim($url, '/');
}
 
/**
 * Returns the named application parameter.
 * This is the shortcut to Yii::app()->params[$name].
 * @param string $name 参数名称
 * @return mixed 参数值
 */
function param($name)
{
    return Yii::app()->params[$name];
}
 
/**
 * This is the shortcut to Yii::app()->user.
 * @return CWebUser
 */
function user()
{
    return Yii::app()->user;
}

/**
 * this is the shortcut to Yii::app()->theme->baseUrl
 * @param string $url
 * @return string Yii::app()->theme->baseUrl
 */
function tbu($url = null)
{
    static $themeBaseUrl = null;
    if ($themeBaseUrl === null)
        $themeBaseUrl = rtrim(Yii::app()->theme->baseUrl, '/') . '/';
    return $url === null ? $themeBaseUrl : $themeBaseUrl . ltrim($url, '/');
}

/**
 * This is the shortcut to Yii::app()->authManager.
 * @return IAuthManager Yii::app()->authManager
 */
function auth()
{
    return Yii::app()->authManager;
}


/**
 * 此函数返回附件地址的BaseUrl
 * @param string $url 附件文件相对url地址
 * @return string
 */
function sbu($url = null)
{
    static $staticBaseUrl = null;
    if ($staticBaseUrl === null)
        $staticBaseUrl = rtrim(param('staticBaseUrl'), '/') . '/';
    
    return $url === null ? $staticBaseUrl : $staticBaseUrl . ltrim($url, '/');
}

/**
 * 此函数返回附件地址的BaseUrl
 * @param string $url 静态资源文件相对url地址
 * @return string
 */
function resBu($url = null)
{
    static $resourceBaseUrl = null;
    if ($resourceBaseUrl === null)
        $resourceBaseUrl = rtrim(param('resourceBaseUrl'), '/') . '/';
    
    return $url === null ? $resourceBaseUrl : $resourceBaseUrl . ltrim($url, '/') . '?V=' . VERSION;
}

/**
 * This is the shortcut to Yii::app()->getStatePersister().
 * @return CStatePersister
 */
function sp()
{
    return Yii::app()->getStatePersister();
}

/**
 * This is the shortcut to Yii::app()->getSecurityManager().
 * @return CSecurityManager
 */
function sm()
{
    return Yii::app()->getSecurityManager();
}

/**
 * This is the shortcut to Yii::app()->request
 * @return CHttpRequest
 */
function request()
{
    return Yii::app()->request;
}

/**
 * This is the shortcut to Yii::app()->request->getParam($name)
 * @return CHttpRequest
 */
function reqParam($name, $defaultValue=null)
{
    return request()->getParam($name, $defaultValue=null);
}

/**
 * memcache
 *
 * @return unknown
 */
function memcache()
{
	return app()->cache;
}

/**
 * 二维数组排序
 */
function array_2d_sort($arr,$keys,$type='asc'){ 
	$keysvalue = $new_array = array();
	foreach ($arr as $k=>$v){
		$keysvalue[$k] = $v[$keys];
	}
	if(strtolower($type) == 'asc'){
		asort($keysvalue);
	}else{
		arsort($keysvalue);
	}
	reset($keysvalue);
	foreach ($keysvalue as $k=>$v){
		$new_array[$k] = $arr[$k];
	}
	return $new_array; 
} 

/**
 * 三维数组排序
 */
function array_3d_sort($arr, $field, $key, $type='asc'){ 
	$keysvalue = $new_array = $keys = array();
	foreach ($arr as $k => $v){
		if (count($keys) == 0)
			$keys = array_keys($v);
		if (isset($v[$field]))
			$keysvalue[$k] = $v[$field][$key];
	}
	if(strtolower($type) == 'asc'){
		asort($keysvalue);
	}else{
		arsort($keysvalue);
	}
	reset($keysvalue);
	foreach ($keysvalue as $k=>$v){
		$new_arr = array();
		foreach ($keys as $ks => $kfield) {
			$new_arr[$kfield] = $arr[$k][$kfield];
		}
		reset($new_arr);
		$new_array[] = $new_arr;
	}
	unset($keys);
	unset($keysvalue);
	unset($arr);
	return $new_array; 
} 

/**
 * 浏览器
 */
function getClientBrowser($agent = false) {
	require_once('detection/inc.php');
	return Client::detectBrowser($agent);
}

/**
 * 是否ajax请求
 *
 * @param Boolean $post
 * @return Boolean
 */
function isAjax($post = true){
	if (!$post){
		return !empty($_GET['ajax']) ? true : false;
	}
	return $_POST['ajax'] ? true : false;
}

/**
 * 截取验证错误提示信息,去除html
 *
 * @param string $str
 * @return 错误提示
 */

function cut_errors($str)
{
    preg_match('/<div class="errorMessage"(.*?)>(.*?)<\/div>/is', $str, $matches);
    return isset($matches[2]) ? $matches[2] : '';
}

/**
 * 返回唯一的Key
 *
 * @param string $str
 * @return string 返回md5
 */
function get_uniqid_key($str) {
    return substr(md5($str), 8, 16);
}

function get_site_id() {
	$current_site_id = user()->getState('site_id');	
	$userAuth = User_site::userAuth(user()->id);
	$user_level = isset($userAuth['level']) ? $userAuth['level'] : 0;
	if($user_level == 1) {
		$query = array('site_id' => $current_site_id, 'top_uid' => get_search_uid());
	} else if ($user_level == 2 || $user_level == 3) {
		$query = array('site_id' => $current_site_id);
	} else {
		$query = array('site_id' => $current_site_id, 'user_id' => user()->id);
	}
	$usite = User_site::model()->findByAttributes($query);
	if ($usite) {
		$site_id = $current_site_id;
	} else {		
		$default_site_id = Users::getUserDefaultSiteId(get_search_uid()); 
		set_site_id($default_site_id);
		$site_id = $default_site_id;
	}
	return $site_id;
}
function set_site_id($site_id) {
	user()->setState('site_id', $site_id);
}
function get_search_uid() {
	if(isset(user()->level) && user()->level == 1 && isset(user()->top_uid) && user()->top_uid > 0 ) {
		return user()->top_uid;		
	} else {
		return user()->id;		
	}
}

function get_begindate() {
	$begindate = user()->getState('begindate');
	if (empty($begindate)) {
		return date("Y-m-d");
	} else {
		return $begindate;
	}
}
function set_begindate($begindate) {
	user()->setState('begindate', $begindate);
}

function get_enddate() {
	$enddate = user()->getState('enddate');
	if (empty($enddate)) {
		return date("Y-m-d");
	} else {
		return $enddate;
	}
}
function set_enddate($enddate) {
	user()->setState('enddate', $enddate);
}
function encode($string, $key, $expiry = 0) {
	$ckey_length = 4;
	$key = md5($key);
	$keya = md5(substr($key, 0, 16));
	$keyb = md5(substr($key, 16, 16));
	$keyc =substr(md5(microtime()), -$ckey_length);

	$cryptkey = $keya.md5($keya.$keyc);
	$key_length = strlen($cryptkey);

	$string = sprintf('%010d', $expiry ? $expiry + time() : 0).substr(md5($string.$keyb), 0, 16).$string;
	$string_length = strlen($string);

	$result = '';
	$box = range(0, 255);

	$rndkey = array();
	for($i = 0; $i <= 255; $i++) {
		$rndkey[$i] = ord($cryptkey[$i % $key_length]);
	}

	for($j = $i = 0; $i < 256; $i++) {
		$j = ($j + $box[$i] + $rndkey[$i]) % 256;
		$tmp = $box[$i];
		$box[$i] = $box[$j];
		$box[$j] = $tmp;
	}

	for($a = $j = $i = 0; $i < $string_length; $i++) {
		$a = ($a + 1) % 256;
		$j = ($j + $box[$a]) % 256;
		$tmp = $box[$a];
		$box[$a] = $box[$j];
		$box[$j] = $tmp;
		$result .= chr(ord($string[$i]) ^ ($box[($box[$a] + $box[$j]) % 256]));
	}
	$result = $keyc.str_replace('=', '', base64_encode($result));
	$result = str_replace("/", "@", $result);
	return $result;


}
function decode($string, $key, $expiry = 0) {
	$string = str_replace("@", "/", $string);
	$ckey_length = 4;
	$key = md5($key);
	$keya = md5(substr($key, 0, 16));
	$keyb = md5(substr($key, 16, 16));
	$keyc = substr($string, 0, $ckey_length);

	$cryptkey = $keya.md5($keya.$keyc);
	$key_length = strlen($cryptkey);

	$string = base64_decode(substr($string, $ckey_length));
	$string_length = strlen($string);

	$result = '';
	$box = range(0, 255);

	$rndkey = array();
	for($i = 0; $i <= 255; $i++) {
		$rndkey[$i] = ord($cryptkey[$i % $key_length]);
	}

	for($j = $i = 0; $i < 256; $i++) {
		$j = ($j + $box[$i] + $rndkey[$i]) % 256;
		$tmp = $box[$i];
		$box[$i] = $box[$j];
		$box[$j] = $tmp;
	}

	for($a = $j = $i = 0; $i < $string_length; $i++) {
		$a = ($a + 1) % 256;
		$j = ($j + $box[$a]) % 256;
		$tmp = $box[$a];
		$box[$a] = $box[$j];
		$box[$j] = $tmp;
		$result .= chr(ord($string[$i]) ^ ($box[($box[$a] + $box[$j]) % 256]));
	}

	if((substr($result, 0, 10) == 0 || substr($result, 0, 10) - time() > 0) && substr($result, 10, 16) == substr(md5(substr($result, 26).$keyb), 0, 16)) {
		$result = substr($result, 26);
		return $result;
	} else {
		return '';
	}
}

function authCode ($string, $operation, $key = '') {

	$key = md5($key ? $key : $GLOBALS['discuz_auth_key']);
	$key_length = strlen($key);

	$string = $operation == 'DECODE' ? base64_decode($string) : substr(md5($string.$key), 0, 8).$string;
	$string_length = strlen($string);

	$rndkey = $box = array();
	$result = '';

	for($i = 0; $i <= 255; $i++) {
		$rndkey[$i] = ord($key[$i % $key_length]);
		$box[$i] = $i;
	}

	for($j = $i = 0; $i < 256; $i++) {
		$j = ($j + $box[$i] + $rndkey[$i]) % 256;
		$tmp = $box[$i];
		$box[$i] = $box[$j];
		$box[$j] = $tmp;
	}

	for($a = $j = $i = 0; $i < $string_length; $i++) {
		$a = ($a + 1) % 256;
		$j = ($j + $box[$a]) % 256;
		$tmp = $box[$a];
		$box[$a] = $box[$j];
		$box[$j] = $tmp;
		$result .= chr(ord($string[$i]) ^ ($box[($box[$a] + $box[$j]) % 256]));
	}

	if($operation == 'DECODE') {
		if(substr($result, 0, 8) == substr(md5(substr($result, 8).$key), 0, 8)) {
			return substr($result, 8);
		} else {
			return '';
		}
	} else {
		return str_replace('=', '', base64_encode($result));
	}

}
