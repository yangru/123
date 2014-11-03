<?php
/**
 * 通行证用户信息
 */
require_once (dirname ( __FILE__ ) . '/../../../../library/jsconf/jsconf.php');
class PassportUserAction extends CAction {
	public function run($gender = '', $begin_age = '', $end_age = '', $history = '', $region = '', $page = 1, $limit = 20, $uesrId = '', $uesrNickname = '') {
		// 获取通行证用户信息
		$passportuser_model = new PassportUser ();
		$start = ($page - 1) * $limit;
		$end_age1 = $begin_age === '' ? '' : intval ( date ( 'Y' ) ) - intval ( $begin_age ) + 1;
		$begin_age1 = $end_age === '' ? '' : intval ( date ( 'Y' ) ) - intval ( $end_age ) + 1;
		$result = $passportuser_model->search_user ( urldecode ( $region ), urldecode ( $history ), $gender, $begin_age1, $end_age1, '', $start, $limit, $uesrId, urldecode ( $uesrNickname ) );
		$arrUids = array ();
		foreach ( $result ['items'] as $k => $v ) {
			$arrUids [] = $v ['id'];
			if ($v ['age'] !== null) {
				$result ['items'] [$k] ['age'] = intval ( date ( 'Y' ) ) - intval ( $v ['age'] ) + 1;
			}
		}
		$arrRecomm = $passportuser_model->find_recomm_by_uid ( $arrUids );
		$arrRecommNew = array ();
		foreach ( $arrRecomm ['items'] as $k => $v ) {
			$arrRecommNew [$v ['uid']] = $v;
			$arrRecommNew [$v ['uid']] ['video_count'] = count ( $v ['video_ids'] );
		}
		$jsconf = jsconf_load ( 'manual_recomm' );
		foreach ( $result ['items'] as $k => $v ) {
			if (array_key_exists ( $v ['id'], $arrRecommNew ) === false) {
				$result ['items'] [$k] ['video_count'] = 0;
				$result ['items'] [$k] ['expired'] = 0;
				$result ['items'] [$k] ['recomm'] = 0;
				continue;
			}
			$expired = ($arrRecommNew [$v ['id']] ['recomm_time'] + $jsconf) / 1000;
			$recomm_count = $arrRecommNew [$v ['id']] ['recomm_count'];
			$result ['items'] [$k] ['video_count'] = $arrRecommNew [$v ['id']] ['video_count'];
			$result ['items'] [$k] ['expired'] = date ( 'Y-m-d H:i:s', $expired );
			$result ['items'] [$k] ['recomm'] = (($expired < time ()) && $recomm_count === 0) ? - 1 : $recomm_count;
		}
		if ($result !== false) {
			$json = json_encode ( array (
					'success' => true,
					'result' => $result 
			) );
		} else {
			$json = json_encode ( array (
					'success' => false,
					'result' => array (
							'total' => 0 
					) 
			) );
		}
		header ( 'Content-type: application/json' );
		echo $json;
		return;
	}
}
