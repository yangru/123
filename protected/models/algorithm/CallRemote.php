<?php
/**
 * 远程调用算法平台
 * 算法服务器按场景部署
 * 从算法服务器获取数据时，从场景所在的服务器群中随机选择一台连接并获取数据
 * 改变算法设置时，需要向场景所在的多台服务器都推送设置消息
 * @author Kevin
 */
require_once (dirname ( __FILE__ ) . '/../../../library/jsconf/jsconf.php');
class CallRemote {
	private $fp;
	private $server_list;
	private $time_out = 300;
	public function __construct() {
		$this->time_out = jsconf_load ( 'algorithm_time_out' );
	}
	
	/**
	 * 连接算法场景下的任意一台服务器
	 */
	public function connect_server_by_sence($server_name) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '连接算法所在场景服务器  scene_name:' . $server_name, YII_INFO );
			
			// 获取算法服务器列表
			$config = jsconf_load ( 'algorithm_server' );
			$config = $config [$server_name];
			$config = explode ( ',', $config );
			foreach ( $config as $server ) {
				list ( $addr, $port ) = explode ( ':', $server, 2 );
				$this->server_list [] = array (
						'host' => $addr,
						'port' => $port 
				);
			}
			// 哈希选择一个服务器，并连接
			$n = count ( $this->server_list );
			$n = hash ( 'crc32', time () ) % $n;
			Yii::log ( __CLASS__, __FUNCTION__, '连接服务器信息：' . $this->server_list [$n] ['host'] . ':' . $this->server_list [$n] ['port'], YII_INFO );
			$this->fp = fsockopen ( $this->server_list [$n] ['host'], $this->server_list [$n] ['port'], $errno, $errstr, $this->time_out );
			if (! $this->fp) {
				Yii::log ( __CLASS__, __FUNCTION__, "连接{$this->server_list[$n]['host']}:{$this->server_list[$n]['port']}失败  $errno - $errstr", YII_ERROR );
				return false;
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '连接算法所在场景服务器失败' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 根据IP、端口连接服务器
	 */
	public function connect_server($host, $port) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '连接服务器：' . $host . ':' . $port, YII_INFO );
			$this->fp = fsockopen ( $host, $port, $errno, $errstr, $this->time_out );
			if (! $this->fp) {
				Yii::log ( __CLASS__, __FUNCTION__, "连接{$host}:{$port}失败  $errno - $errstr", YII_ERROR );
				return false;
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '连接服务器失败' . $e->getMessage (), YII_ERROR );
		}
	}
	public function __destruct() {
		@fclose ( $this->fp );
	}
	
	/**
	 * 获取视频推荐结果
	 */
	public function get_video_recommend($uid, $vid, $playtime, $filter_ids = array()) {
		$this->connect_server_by_sence ( 'video' );
		try {
			$commend = array (
					'video_recommend_req' => array (
							'user_id' => $uid,
							'video_id' => $vid,
							'play_date' => $playtime 
					) 
			);
			Yii::log ( __CLASS__, __FUNCTION__, '远程获取视频推荐结果  指令：' . json_encode ( $commend ), YII_INFO );
			fwrite ( $this->fp, json_encode ( $commend ) . "\n" );
			$result = '';
			while ( $data = fread ( $this->fp, 1024 ) ) {
				$result .= $data;
			}
			fclose ( $this->fp );
			$result = json_decode ( $result, true );
			$result = $result ['video_recommend_res'];
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '远程获取视频推荐结果失败' . $e->getMessage (), YII_ERROR );
		}
		return $result;
	}
	
	/**
	 * 获取微博内容推荐结果
	 */
	public function get_weibo_content_recommend($uid) {
		$this->connect_server_by_sence ( 'weibo_content' );
		try {
			$commend = array (
					'weibo_content_recommend_req' => array (
							'user_id' => $uid 
					) 
			);
			Yii::log ( __CLASS__, __FUNCTION__, '远程获微博内容推荐结果  指令：' . json_encode ( $commend ), YII_INFO );
			fwrite ( $this->fp, json_encode ( $commend ) . "\n" );
			$result = '';
			while ( $data = fread ( $this->fp, 1024 ) ) {
				$result .= $data;
			}
			fclose ( $this->fp );
			$result = json_decode ( $result, true );
			return $result;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '远程获取微博内容推荐结果失败' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 获取微博用户推荐结果
	 */
	public function get_weibo_user_recommend($uid) {
		$this->connect_server_by_sence ( 'weibo_user' );
		try {
			$commend = array (
					'weibo_user_recommend_req' => array (
							'user_id' => $uid 
					) 
			);
			Yii::log ( __CLASS__, __FUNCTION__, '远程获微博用户推荐结果  指令：' . json_encode ( $commend ), YII_INFO );
			fwrite ( $this->fp, json_encode ( $commend ) . "\n" );
			$result = '';
			while ( $data = fread ( $this->fp, 1024 ) ) {
				$result .= $data;
			}
			fclose ( $this->fp );
			$result = json_decode ( $result, true );
			return $result;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '远程获取微博用户推荐结果失败' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 获取视频推荐预览结果
	 */
	public function get_preview_video($uid, $video_id) {
		try {
			$this->connect_server_by_sence ( 'video' );
			$commend = array (
					'video_preview_req' => array (
							'user_id' => $uid,
							'video_id' => $video_id 
					) 
			);
			Yii::log ( __CLASS__, __FUNCTION__, '远程获视频推荐预览结果  指令：' . json_encode ( $commend ), YII_INFO );
			fwrite ( $this->fp, json_encode ( $commend ) . "\n" );
			$result = '';
			while ( $data = fread ( $this->fp, 1024 ) ) {
				$result .= $data;
			}
			fclose ( $this->fp );
			$result = json_decode ( $result, true );
			return $result;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '远程获视频推荐预览结果失败' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 视频算法训练
	 */
	public function video_training($algorithm_name, $param, $user_num, $start_time, $end_time, $min_unit_num) {
		$this->connect_server_by_sence ( 'video' );
		try {
			$commend = array (
					'video_train' => array (
							'engine' => $algorithm_name,
							'param' => $param 
					),
					'user_num' => $user_num,
					'start_time' => $start_time,
					'end_time' => $end_time,
					'min_unit_num' => $min_unit_num 
			);
			Yii::log ( __CLASS__, __FUNCTION__, '远程视频算法训练  指令：' . json_encode ( $commend ), YII_INFO );
			stream_set_timeout ( $this->fp, $this->time_out );
			fwrite ( $this->fp, json_encode ( $commend ) . "\n" );
			$result = '';
			while ( $data = fread ( $this->fp, 1024 ) ) {
				$result .= $data;
			}
			fclose ( $this->fp );
			$result = json_decode ( $result, true );
			if (! empty ( $result ['dataNum'] ) && ! empty ( $result ['values'] ) && is_array ( $result ['values'] )) {
				foreach ( $result ['values'] as $key => $value ) {
					$temp ['xAxis'] = floatval ( $value [0] );
					$temp ['precision'] = isset ( $value [1] ) ? $value [1] : 0;
					$temp ['recall'] = isset ( $value [1] ) ? $value [2] : 0;
					$temp ['coverage'] = $value [3];
					$result ['values'] [$key] = $temp;
				}
			}
			return $result;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '远程视频算法训练失败' . $e->getMessage (), YII_ERROR );
		}
	}
	
	/**
	 * 微博内容算法训练
	 */
	public function weibo_content_training($param, $start_time, $end_time) {
		$this->connect_server_by_sence ( 'weibo_content' );
		try {
			$commend = array (
					'weibo_content_train_req' => array (
							'param' => $param 
					),
					'start_time' => $start_time,
					'end_time' => $end_time 
			);
			Yii::log ( __CLASS__, __FUNCTION__, '远程微博内容算法训练  指令：' . json_encode ( $commend ), YII_INFO );
			stream_set_timeout ( $this->fp, $this->time_out );
			fwrite ( $this->fp, json_encode ( $commend ) . "\n" );
			$result = '';
			while ( $data = fread ( $this->fp, 1024 ) ) {
				$result .= $data;
			}
			fclose ( $this->fp );
			$result = json_decode ( $result, true );
			if (! empty ( $result ['values'] ) && is_array ( $result ['values'] )) {
				foreach ( $result ['values'] as $key => $value ) {
					$temp ['xAxis'] = floatval ( $value [0] );
					$temp ['precision'] = $value [1];
					$temp ['recall'] = $value [2];
					$result ['values'] [$key] = $temp;
				}
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '远程微博内容算法训练失败' . $e->getMessage (), YII_ERROR );
		}
		return $result;
	}
	
	/**
	 * 改变算法设置
	 */
	public function change_algorithm_param($algorithm_name, $params) {
		$server_list = $this->get_algorithm_server_list ();
		$error_count = 0;
		foreach ( $server_list as $server ) { // 向所有算法服务器发送配置修改指令
			try {
				Yii::log ( __CLASS__, __FUNCTION__, '远程改变算法参数设置  算法名称：' . $algorithm_name . ' 算法参数：' . json_encode ( $params ), YII_INFO );
				$this->connect_server ( $server ['host'], $server ['port'] );
				$commend = array (
						'video_setpara_req' => array (
								'engine' => $algorithm_name,
								'params' => $params 
						) 
				);
				fwrite ( $this->fp, json_encode ( $commend ) . "\n" );
				$result = '';
				while ( $data = fread ( $this->fp, 1024 ) ) {
					$result .= $data;
				}
				fclose ( $this->fp );
				if ($result != 'true') {
					$error_count ++;
				}
			} catch ( Exception $e ) {
				Yii::log ( __CLASS__, __FUNCTION__, '远程改变算法参数设置失败  服务器信息：' . "{$server['host']}:{$server['port']}" . $e->getMessage (), YII_ERROR );
				continue;
			}
		}
		return true;
	}
	
	/**
	 * 动态切换算法
	 */
	public function algorithm_switch($scene_id, $algorithm_name) {
		$server_list = $this->get_algorithm_server_list ();
		$error_count = 0;
		foreach ( $server_list as $server ) { // 向所有算法服务器发送配置修改指令
			try {
				Yii::log ( __CLASS__, __FUNCTION__, '远程动态切换算法  scene_id：' . $scene_id . ' 算法名称：' . $algorithm_name, YII_INFO );
				$this->connect_server ( $server ['host'], $server ['port'] );
				$commend = array (
						'algorithm_switch_req' => array (
								'scene_id' => $scene_id,
								'engine' => $algorithm_name 
						) 
				);
				fwrite ( $this->fp, json_encode ( $commend ) . "\n" );
				$result = '';
				while ( $data = fread ( $this->fp, 1024 ) ) {
					$result .= $data;
				}
				fclose ( $this->fp );
				if ($result != 'true') {
					$error_count ++;
				}
			} catch ( Exception $e ) {
				Yii::log ( __CLASS__, __FUNCTION__, '远程动态切换算法失败  服务器信息：' . "{$server['host']}:{$server['port']}" . $e->getMessage (), YII_ERROR );
				continue;
			}
		}
		return true;
	}
	
	/**
	 * 设置场景过滤器
	 */
	public function set_video_filter($scene_id, $type, $filter_ids, $insert_count = 0, $insert_type = 0, $blend_type = 0) {
		$server_list = $this->get_algorithm_server_list ();
		$error_count = 0;
		foreach ( $server_list as $server ) { // 向所有算法服务器发送配置修改指令
			try {
				Yii::log ( __CLASS__, __FUNCTION__, '设置场景过滤器 ', YII_INFO );
				$this->connect_server ( $server ['host'], $server ['port'] );
				if ($type == 1) {
					$commend = array (
							'setVideInterfereFilter' => array (
									'scene_id' => $scene_id,
									'type' => $type,
									'filterIds' => $filter_ids 
							) 
					);
				}
				if ($type == 2) {
					$commend = array (
							'setVideInterfereFilter' => array (
									'scene_id' => $scene_id,
									'type' => $type,
									'filterIds' => $filter_ids,
									'insertCount' => $insert_count,
									'insertType' => $insert_type,
									'blendType' => $blend_type 
							) 
					);
				}
				fwrite ( $this->fp, json_encode ( $commend ) . "\n" );
				$result = '';
				while ( $data = fread ( $this->fp, 1024 ) ) {
					$result .= $data;
				}
				fclose ( $this->fp );
				if ($result != 'true') {
					$error_count ++;
				}
			} catch ( Exception $e ) {
				Yii::log ( __CLASS__, __FUNCTION__, '设置场景过滤器失败  服务器信息：' . "{$server['host']}:{$server['port']}" . $e->getMessage (), YII_ERROR );
				continue;
			}
		}
		return true;
	}
	
	/**
	 * 视频手动干预
	 */
	public function add_manual_uids($uids) {
		$server_list = $this->get_algorithm_server_list ();
		$error_count = 0;
		foreach ( $server_list as $server ) { // 向所有算法服务器发送配置修改指令
			try {
				Yii::log ( __CLASS__, __FUNCTION__, '远程设置视频手动干预 uids:' . implode ( ',', $uids ), YII_INFO );
				$this->connect_server ( $server ['host'], $server ['port'] );
				$commend = array (
						'addManualUserIds' => array (
								'ids' => $uids 
						) 
				);
				fwrite ( $this->fp, json_encode ( $commend ) . "\n" );
				$result = '';
				while ( $data = fread ( $this->fp, 1024 ) ) {
					$result .= $data;
				}
				fclose ( $this->fp );
				if ($result != 'true') {
					$error_count ++;
				}
			} catch ( Exception $e ) {
				Yii::log ( __CLASS__, __FUNCTION__, '远程设置视频手动干预失败  服务器信息：' . "{$server['host']}:{$server['port']}" . $e->getMessage (), YII_ERROR );
				continue;
			}
		}
		return true;
	}
	
	/**
	 * 获取所有算法服务器
	 */
	public function get_algorithm_server_list() {
		$server_list = array ();
		$config = jsconf_load ( 'algorithm_server' );
		foreach ( $config as $value ) {
			$server = $value;
			$server = explode ( ',', $server );
			foreach ( $server as $value ) {
				list ( $addr, $port ) = explode ( ':', $value, 2 );
				$server_list [] = array (
						'host' => $addr,
						'port' => $port 
				);
			}
		}
		return $server_list;
	}
	
	/**
	 * start启动某个job
	 */
	public function start_job($job_name) {
		$server_list = $this->get_algorithm_server_list ();
		$error_count = 0;
		foreach ( $server_list as $server ) { // 向所有算法服务器发送配置修改指令
			try {
				Yii::log ( __CLASS__, __FUNCTION__, '启动JOB:' . $job_name, YII_INFO );
				$this->connect_server ( $server ['host'], $server ['port'] );
				$command = array (
						'start_job' => array (
								'job_name' => $job_name 
						) 
				);
				
				fwrite ( $this->fp, json_encode ( $command ) . "\n" );
				$result = '';
				while ( $data = fread ( $this->fp, 1024 ) ) {
					$result .= $data;
				}
				fclose ( $this->fp );
				if ($result != 'true') {
					$error_count ++;
				}				
			} catch ( Exception $e ) {
				Yii::log ( __CLASS__, __FUNCTION__, '启动JOB:' . $job_name . ' 服务器信息：' . "{$server['host']}:{$server['port']}" . $e->getMessage (), YII_ERROR );
				continue;
			}
			break;
		}
		return true;
	}
	public function pause_job($job_name) {
		$server_list = $this->get_algorithm_server_list ();
		$error_count = 0;
		foreach ( $server_list as $server ) { // 向所有算法服务器发送配置修改指令
			try {
				Yii::log ( __CLASS__, __FUNCTION__, '停止JOB:' . $job_name, YII_INFO );
				$this->connect_server ( $server ['host'], $server ['port'] );
				$command = array (
						'pause_job' => array (
								'job_name' => $job_name 
						) 
				);
				
				fwrite ( $this->fp, json_encode ( $command ) . "\n" );
				$result = '';
				while ( $data = fread ( $this->fp, 1024 ) ) {
					$result .= $data;
				}
				fclose ( $this->fp );
				if ($result != 'true') {
					$error_count ++;
				}
			} catch ( Exception $e ) {
				Yii::log ( __CLASS__, __FUNCTION__, '停止JOB:' . $job_name . ',服务器信息：' . "{$server['host']}:{$server['port']}" . $e->getMessage (), YII_ERROR );
				continue;
			}
			break;
		}
		return true;
	}
	public function get_job_state() {
		$server_list = $this->get_algorithm_server_list ();
		$error_count = 0;
		
		foreach ( $server_list as $server ) { // 向所有算法服务器发送配置修改指令
			try {
				Yii::log ( __CLASS__, __FUNCTION__, '获取JOB状态', YII_INFO );
				$this->connect_server ( $server ['host'], $server ['port'] );
				$command = array (
						'get_job_state' => array (
								'job_name' => 'all' 
						) 
				);
				
				fwrite ( $this->fp, json_encode ( $command ) . "\n" );
				$result = '';
				while ( $data = fread ( $this->fp, 1024 ) ) {
					$result .= $data;
				}
				fclose ( $this->fp );
			} catch ( Exception $e ) {
				Yii::log ( __CLASS__, __FUNCTION__, '获取JOB状态信息' . ',服务器信息：' . "{$server['host']}:{$server['port']}" . $e->getMessage (), YII_ERROR );
				continue;
			}
			break;
		}
		return $result;
	}
	public function modify_job_interval($job_name, $interval_hours) {
		$server_list = $this->get_algorithm_server_list ();
		$error_count = 0;
		foreach ( $server_list as $server ) { // 向所有算法服务器发送配置修改指令
			try {
				$command = array (
						'modify_job_interval' => array (
								'job_name' => $job_name,
								'hours' => $interval_hours 
						) 
				);
				Yii::log ( __CLASS__, __FUNCTION__, '修改JOB:' . json_encode ( $command ), YII_INFO );
				$this->connect_server ( $server ['host'], $server ['port'] );
				
				fwrite ( $this->fp, json_encode ( $command ) . "\n" );
				$result = '';
				while ( $data = fread ( $this->fp, 1024 ) ) {
					$result .= $data;
				}
				fclose ( $this->fp );
				if ($result != 'true') {
					$error_count ++;
				}
			} catch ( Exception $e ) {
				Yii::log ( __CLASS__, __FUNCTION__, '修改JOB执行频率,服务器信息：' . "{$server['host']}:{$server['port']}" . $e->getMessage (), YII_ERROR );
				continue;
			}
		
			break;
		}
		return true;
	}
}