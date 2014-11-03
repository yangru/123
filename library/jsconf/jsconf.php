<?php
/*
 * 加载json配置文件
 */
defined('VERSION_CONFIG') or define('VERSION_CONFIG', dirname(__FILE__) . "/../../config/cntv_sysmanager.json");
function jsconf_load($module, $filename = VERSION_CONFIG) {
	if (($json = file_get_contents($filename)) === false) {
		trigger_error("jsconf_load - Failed to load file[$filename]", E_USER_WARNING);
		return false;
	}

	if (($conf = json_decode($json, true)) === NULL) {
		switch (json_last_error()) {
			case JSON_ERROR_DEPTH:
				trigger_error('jsconf_load - Maximum stack depth exceeded', E_USER_WARNING);
				break;
			case JSON_ERROR_STATE_MISMATCH:
				trigger_error('jsconf_load - Underflow or the modes mismatch', E_USER_WARNING);
				break;
			case JSON_ERROR_CTRL_CHAR:
				trigger_error('jsconf_load - Unexpected control character found', E_USER_WARNING);
				break;
			case JSON_ERROR_SYNTAX:
				trigger_error('jsconf_load - Syntax error, malformed JSON', E_USER_WARNING);
				break;
			case JSON_ERROR_UTF8:
				trigger_error('jsfconf_load - Malformed UTF-8 characters, possibly incorrectly encoded', E_USER_WARNING);
				break;
			default:
				trigger_error('jsconf_load - Unknown error');
				break;
		}
		return false;
	}

	if ($module === '') {
		return $conf;
	}

	if (!isset($conf[$module])) {
		trigger_error("jsconf_load - Unknown module[$module]", E_USER_WARNING);
		return false;
	}

	return $conf[$module];
}
