<?php
/**
 * 微薄类型
 */
require_once (dirname ( __FILE__ ) . '/../../library/nosql/MongoDB.php');
class WeiboTypeModel {
	private $db = null;
	private $table = 'xwb_v_cate';
	public function __construct() {
		$this->db = new Mongo_DB ();
	}
	private function _queue_type($arrTypeMaps, $intPid = 0, $intLevel = 0) {
		$arrList = array ();
		foreach ( $arrTypeMaps [$intPid] as $tk => $tv ) {
			$arrList [] = array (
					'name' => str_repeat ( '-', $intLevel ) . $tv ['verifycategname'],
					'id' => $tv ['verifycategid'] 
			);
			if (isset ( $arrTypeMaps [$tv ['verifycategid']] ) === true) {
				$arrList = array_merge ( $arrList, $this->_queue_type ( $arrTypeMaps, $tv ['verifycategid'], $intLevel + 1 ) );
			}
		}
		return $arrList;
	}
	public function type_list() {
		$arrTypes = $this->db->find_by_cond ( $this->table );
		$arrTypeMaps = array ();
		foreach ( $arrTypes ['items'] as $tk => $tv ) {
			if (isset ( $arrTypeMaps [$tv ['pid']] ) === false) {
				$arrTypeMaps [$tv ['pid']] = array ();
			}
			$arrTypeMaps [$tv ['pid']] [] = $tv;
		}
		return $this->_queue_type ( $arrTypeMaps );
	}
	public function find_type_by_ids($arrIds = array()) {
		$arrTypes = $this->db->find_by_cond ( $this->table, array (
				'verifycategid' => array (
						'$in' => $arrIds 
				) 
		) );
		$arrNewTypes = array ();
		foreach ( $arrTypes ['items'] as $tk => $tv ) {
			$arrNewTypes [$tv ['verifycategid']] = $tv ['verifycategname'];
		}
		return $arrNewTypes;
	}
}
