<?php
/**
 * 作业、进程管理
 * @author Kevin
 */
class Process {
	private $db = null;
	private $process_config;
	public function __construct() {
		$this->process_config = require (dirname ( __FILE__ ) . '/../config/process_info.php');
	}
	public function __destruct() {
		@$this->db->active = false;
	}
	
	/**
	 * 获取作业配置列表
	 */
	public function get_process_all() {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '获取作业列表', YII_INFO );
			$this->db = Yii::app ()->db;
			$sql = "SELECT `id`,`last_time`,`interval` FROM `process_manage`";
			$st = $this->db->createCommand ( $sql );
			$st->execute ();
			$data = $st->queryAll ();
			if (! empty ( $data )) {
				$result = array ();
				foreach ( $data as $value ) {
					$result [$value ['id']] = $value;
				}
				return $result;
			} else {
				return false;
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '获取作业列表失败', YII_INFO );
		}
	}
	
	/**
	 * 插入作业配置
	 */
	public function insert_process($process_id, $interval) {
		if (empty ( $process_id ) || empty ( $interval )) {
			return false;
		}
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '插入作业信息', YII_INFO );
			$this->db = Yii::app ()->db;
			$sql = "INSERT INTO `process_manage` SET `id`=:id, `interval`=:interval";
			$params [':id'] = $process_id;
			$params [':interval'] = $interval;
			$st = $this->db->createCommand ( $sql );
			$ret = $st->execute ( $params );
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '插入作业信息失败', YII_ERROR );
		}
		if ($ret === false) {
			return false;
		}
		return $ret;
	}
	
	/**
	 * 更新作业信息
	 */
	public function update_process($id, $interval = null, $last_time = null) {
		$id = intval ( $id );
		if ($id == 0) {
			return false;
		}
		if (empty ( $interval ) && empty ( $last_time )) {
			return false;
		}
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '更新作业信息', YII_INFO );
			$this->db = Yii::app ()->db;
			$sql = "UPDATE `process_manage` SET ";
			$params [':id'] = $id;
			if (! empty ( $interval )) {
				$sql .= "`interval`=:interval, ";
				$params [':interval'] = $interval;
			}
			if (! empty ( $last_time )) {
				$sql .= "`last_time`=:last_time, ";
				$params [':last_time'] = $last_time;
			}
			$sql = substr ( $sql, 0, strlen ( $sql ) - 2 );
			$sql .= " WHERE `id`=:id";
			$st = $this->db->createCommand ( $sql );
			$ret = $st->execute ( $params );
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '更新作业信息失败', YII_ERROR );
		}
		if ($ret === false) {
			return false;
		}
		return true;
	}
	
	/**
	 * 判断作业设置是否已存在
	 */
	public function is_exist($id) {
		$id = intval ( $id );
		if ($id == 0) {
			return false;
		}
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '查看作业信息是否已存在', YII_INFO );
			$this->db = Yii::app ()->db;
			$sql = "SELECT `id` FROM `process_manage` WHERE `id` = {$id}";
			$st = $this->db->createCommand ( $sql );
			$st->execute ();
			$data = $st->queryAll ();
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '查询失败', YII_ERROR );
		}
		if ($data) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 启动作业/进程
	 */
	public function start_process($process_id) {
		try {
			$process_info = $this->process_config [$process_id];
			Yii::log ( __CLASS__, __FUNCTION__, '启动作业  ' . $process_info ['name'], YII_INFO );
			$remote_model = new CallRemote ();
			$stream = $remote_model->start_job ( $process_info ['process_name'] );
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '启动作业失败：' . $process_info ['name'], YII_ERROR );
		}
		if ($stream === true) {
			Logs::writeLog ( 'start', 'process', $process_info ['name'] );
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 查看作业/进程的运行状态
	 */
	public function process_status($process_id) {
		try {
			$process_info = $this->process_config [$process_id];
			Yii::log ( __CLASS__, __FUNCTION__, '查看作业状态  ' . $process_info ['name'], YII_INFO );
			$remote_model = new CallRemote ();
			$stream = $remote_model->get_job_state ( $process_info ['process_name'] );
			$arrStream = json_decode ( $stream, true );
			$arrState = $arrStream ['state'];
			foreach ( $arrState as $sk => $sv ) {
				if ($sv ['name'] === $process_info ['process_name']) {
					$stream = $sv ['running'];
					break;
				}
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '查看作业状态失败：' . $process_info ['name'], YII_ERROR );
		}
		if ($stream === true) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 查看作业/进程的运行状态
	 */
	public function process_status_all() {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '查看作业状态', YII_INFO );
			$remote_model = new CallRemote ();
			$stream = $remote_model->get_job_state ();
			$arrStream = json_decode ( $stream, true );
			$arrState = $arrStream ['state'];
			$arrNewState = array ();
			foreach ( $arrState as $sk => $sv ) {
				$arrNewState [$sv ['name']] = $sv;
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '查看作业状态失败', YII_ERROR );
		}
		if ($stream !== false) {
			return $arrNewState;
		} else {
			return false;
		}
	}
	
	/**
	 * 停止作业/进程
	 */
	public function stop_process($process_id) {
		try {
			$process_info = $this->process_config [$process_id];
			Yii::log ( __CLASS__, __FUNCTION__, '停止作业  ' . $process_info ['name'], YII_INFO );
			$remote_model = new CallRemote ();
			$stream = $remote_model->pause_job ( $process_info ['process_name'] );
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '停止作业失败：' . $process_info ['name'], YII_ERROR );
		}
		if ($stream === true) {
			Logs::writeLog ( 'stop', 'process', $process_info ['name'] );
			return true;
		} else {
			return false;
		}
	}
}