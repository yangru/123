<?php
require_once (dirname ( __FILE__ ) . '/../../library/jsconf/jsconf.php');
class Mongo_DB {
	private $conn;
	private $db;
	public function __construct() {
		ini_set ( 'mongo.native_long', 1 );
		$jsconf = jsconf_load ( 'app' );
		$jsconf = $jsconf ['mongodb'];
		$host = $jsconf ['host'];
		$port = $jsconf ['port'];
		$db_name = $jsconf ['db_name'];
		try {
			Yii::log ( __CLASS__, __FUNCTION__, "连接mongoDB mongodb://$host:$port DB_NAME:$db_name", YII_INFO );
			$this->conn = new Mongo ( "mongodb://$host:$port" );
			$this->db = $this->conn->$db_name;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, "连接mongoDB失败" . $e->getMessage (), YII_ERROR );
		}
	}
	public function insert($collection_name, $params) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, "mongoDB插入数据  collection:$collection_name PARAMS:" . json_encode ( $params ), YII_INFO );
			$collection = $this->db->$collection_name;
			$collection->insert ( $params );
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, "mongoDB插入数据失败" . $e->getMessage (), YII_ERROR );
		}
		return true;
	}
	public function update($collection_name, $condition, $update_field) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, "mongoDB更新数据  collection:$collection_name update_field" . json_encode ( $update_field ) . "condition:" . json_encode ( $condition ), YII_INFO );
			$collection = $this->db->$collection_name;
			$update_field = array (
					'$set' => $update_field 
			);
			$collection->update ( $condition, $update_field, array (
					'upsert' => true 
			) );
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, "mongoDB更新数据失败" . $e->getMessage (), YII_ERROR );
		}
		return true;
	}
	public function upsert($collection_name, $condition, $update_field) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, "MongoDB upsert collection:$collection_name update_field:" . json_encode ( $update_field ) . " condition:" . json_encode ( $condition ), YII_INFO );
			$collection = $this->db->$collection_name;
			$update_field = array (
					'$set' => $update_field 
			);
			$collection->update ( $condition, $update_field, array (
					'upsert' => true 
			) );
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, "MongoDB upsert failure " . $e->getMessage (), YII_ERROR );
		}
		return true;
	}
	public function delete_one($collection_name, $condition) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, "mongoDB删除数据  collection:$collection_name condition:" . json_encode ( $condition ), YII_INFO );
			$collection = $this->db->$collection_name;
			$collection->remove ( $condition, array (
					"justOne" => true 
			) );
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, "mongoDB删除数据失败" . $e->getMessage (), YII_ERROR );
		}
		return true;
	}
	public function find_by_cond($collection_name, $condition = array(), $start = 0, $offset = 0, $order_by = array(), $query_field = array()) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, "mongoDB查询数据  collection:$collection_name condition:" . json_encode ( $condition ), YII_INFO );
			$collection = $this->db->$collection_name;
			$cursor = $collection->find ( $condition, $query_field )->limit ( intval ( $offset ) )->skip ( intval ( $start ) )->sort ( $order_by );
			$count = $collection->find ( $condition )->count ();
			$result = array (
					'items' => array (),
					'total' => 0 
			);
			foreach ( $cursor as $value ) {
				$result ['items'] [] = $value;
			}
			$result ['total'] = $count;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, "mongoDB查询数据失败" . $e->getMessage (), YII_ERROR );
		}
		return $result;
	}
	public function find_one($collection_name, $condition, $query_field = array()) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, "mongoDB查询数据  collection:$collection_name condition:" . json_encode ( $condition ), YII_INFO );
			$collection = $this->db->$collection_name;
			$cursor = $collection->findOne ( $condition, $query_field );
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, "mongoDB删除数据失败" . $e->getMessage (), YII_ERROR );
		}
		return $cursor;
	}
	public function like($value, $flags = "i", $enable_start_wildcard = TRUE, $enable_end_wildcard = TRUE) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, "mongoDB生成like正则  '$value'", YII_INFO );
			$value = ( string ) trim ( $value );
			$value = quotemeta ( $value );
			if ($enable_start_wildcard !== TRUE) {
				$value = "^" . $value;
			}
			if ($enable_end_wildcard !== TRUE) {
				$value .= "$";
			}
			$regex = "/.*{$value}.*/$flags";
			$like = new MongoRegex ( $regex );
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, "mongoDB生成like正则失败" . $e->getMessage (), YII_ERROR );
		}
		return $like;
	}
	public function group($collection_name, $keys, $initial, $reduce, $condition = array()) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, "mongoDB分组查询  collection:$collection_name keys:" . json_encode ( $keys ) . " initial:" . json_encode ( $initial ) . " reduce:" . json_encode ( $reduce ), YII_INFO );
			$collection = $this->db->$collection_name;
			if (empty ( $condition )) {
				$cursor = $collection->group ( $keys, $initial, $reduce );
			} else {
				$cursor = $collection->group ( $keys, $initial, $reduce, array (
						'condition' => $condition 
				) );
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, "mongoDB分组查询失败" . $e->getMessage (), YII_ERROR );
		}
		return $cursor;
	}
	public function count_by_cond($collection_name, $condition = array()) {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, "mongoDB查询数量  collection:$collection_name condition:" . json_encode ( $condition ), YII_INFO );
			$collection = $this->db->$collection_name;
			$count = $collection->find ( $condition )->count ();
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, "mongoDB查询数量失败" . $e->getMessage (), YII_ERROR );
		}
		return $count;
	}
	public function __destruct() {
		$this->conn->close ();
	}
}