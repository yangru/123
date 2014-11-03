<?php
/**
 * 数据同步
 * @author daizhaolin
 */
class Synchronous {
	private $mongodb = null;
	private $mysql = null;
	private $table_video = 'video_source';
	private $table_users = 'passport_user';
	private $vms_server = null;
	private $city = null;
	public function __construct() {
		require_once (dirname ( __FILE__ ) . '/../../library/jsconf/jsconf.php');
		require_once (dirname ( __FILE__ ) . '/../config/city_config.php');
		$this->mongodb = new Mongo_DB ();
		$this->mysql = Yii::app ()->db_cntv_uc;
		$this->vms_server = jsconf_load ( 'vms_server' );
		global $city_config;
		$this->city = $city_config;
	}
	public function __destruct() {
		$this->mysql->active = false;
	}
	public function videos($arrVideos = array()) {
		if (empty ( $arrVideos ) === true) {
			return array ();
		}
		$arrMaps = array (
				'id' => false,
				'vid' => false,
				'type' => null,
				'title' => 'videoName',
				'play_url' => false,
				'preview_image_url' => 'videoCoverPic',
				'create_time' => null,
				'channel' => 'playChannel',
				'last' => false,
				'play_count' => false 
		);
		foreach ( $arrVideos as $vk => $arrVideo ) {
			foreach ( $arrMaps as $key => $value ) {
				if (isset ( $arrVideo [$key] ) === false) {
					$strJson = file_get_contents ( $this->vms_server . '?guid=' . $arrVideo ['vid'] );
					$arrJson = json_decode ( $strJson, true );
					if (empty ( $arrJson ['classname'] ) === false) {
						$strType = $arrJson ['classname'];
					} elseif (empty ( $arrJson ['keywords'] ) === false) {
						$strType = $arrJson ['keywords'];
						// } elseif (preg_match ( '/.*第.*集.*/', $arrJson ['videoName'], $matches )) {
						// $strType = '电视剧';
					} else {
						$strType = '';
					}
					if ($strType !== '') {
						$video_type_model = new VideoType ();
						$video_type_model->insert ( $strType );
					}
					$intCreateTime = $arrJson ['playTime'] !== '' ? $arrJson ['playTime'] : $arrJson ['videoTime'];
					$intCreateTime = strtotime ( $intCreateTime );
					$update_field = array ();
					foreach ( $arrMaps as $v => $k ) {
						if ($k === null) {
							continue;
						} elseif ($k === false) {
							if (isset ( $arrVideo [$v] ) === true) {
								$update_field [$v] = $arrVideo [$v];
							}
						} else {
							$update_field [$v] = $arrJson [$k];
						}
					}
					$update_field ['type'] = $strType;
					$update_field ['create_time'] = $intCreateTime;
					$this->mongodb->update ( $this->table_video, array (
							'vid' => $arrVideo ['vid'] 
					), $update_field );
					$arrVideos [$vk] = array_merge ( $arrVideo, $update_field );
					break;
				}
			}
		}
		return $arrVideos;
	}
	public function users($arrUids = array(), $blnUsers = false) {
		if (empty ( $arrUids ) === true) {
			return array ();
		}
		if ($blnUsers === true) {
			$arrTmpUsersTmp = array ();
			$arrTmpUsers = $arrUids;
			$arrTmpUdis = array ();
			foreach ( $arrTmpUsers as $arrUser ) {
				$arrTmpUsersTmp [$arrUser ['id']] = $arrUser;
				$arrTmpUdis [] = intval ( $arrUser ['id'] );
			}
			$arrUids = $arrTmpUdis;
		}
		$arrUsers = array ();
		for($i = 1; $i <= 50; $i ++) {
			$strSQL = 'SELECT * FROM `user_' . intval ( $i ) . '` WHERE `userid` IN (' . implode ( ',', $arrUids ) . ')';
			$cmd = $this->mysql->createCommand ( $strSQL );
			$cmd->execute ();
			$arrUsers = array_merge ( $arrUsers, $cmd->queryAll () );
		}
		$arrResult = array ();
		foreach ( $arrUsers as $uk => $arrUser ) {
			$age = null;
			if (empty ( $arrUser ['birthday'] ) === false) {
				$arrAge = explode ( '-', $arrUser ['birthday'] );
				$age = intval ( $arrAge [0] );
			}
			if ($age === 0) {
				$age = null;
			}
			$gender = null;
			if ($arrUser ['sex'] !== null) {
				$gender = intval ( $arrUser ['sex'] );
			}
			$update_field = array (
					'id' => intval ( $arrUser ['userid'] ),
					'age' => $age,
					'gender' => $gender,
					'username' => $arrUser ['username'],
					'nickname' => $arrUser ['nickname'],
					'passuserid' => $arrUser ['passuserid'],
					'lastlogin' => intval ( $arrUser ['lastlogin'] ),
					'province' => $this->city [$arrUser ['province']] [0],
					'city' => $this->city [$arrUser ['province']] [$arrUser ['city']],
					'education' => intval ( $arrUser ['education'] ),
					'industry' => intval ( $arrUser ['industry'] ),
					'job' => intval ( $arrUser ['job'] ),
					'unread' => 0,
					'video_history' => null,
					'register_region' => null 
			);
			$this->mongodb->upsert ( $this->table_users, array (
					'id' => intval ( $arrUser ['userid'] ) 
			), $update_field );
			$arrResult [] = $update_field;
		}
		if ($blnUsers === true) {
			foreach ( $arrResult as $arrUser ) {
				$arrTmpUsersTmp [$arrUser ['id']] = array_merge ( $arrTmpUsersTmp [$arrUser ['id']], $arrUser );
			}
			$arrResult = array ();
			foreach ( $arrTmpUsersTmp as $arrUser ) {
				$arrResult [] = $arrUser;
			}
		}
		return $arrResult;
	}
}
