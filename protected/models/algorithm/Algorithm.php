<?php
/**
 * 算法场景应用
 * @author Kevin
 */
class Algorithm {
    
    private $db = null;
    
    public function __construct() {
        $this->db = Yii::app()->db;
    }
    
    public function __destruct() {
        $this->db->active = false;
    }
    
    /**
     * 获取所有算法列表
     */
    public function get_all_algorithms() {
        try {
            Yii::log(__CLASS__, __FUNCTION__, '获取所有算法列表', YII_INFO);
            $sql = "SELECT `id`,`type`,`params` FROM `algorithm_list`";
            $st = $this->db->createCommand($sql);
            $st->execute();
            $data = $st->queryAll();
            if (!empty($data)) {
                $result = array();
                foreach ($data as $value) {
                    $result[$value['id']]['type'] = $value['type'];
                    $result[$value['id']]['params'] = json_decode($value['params'], true);
                }
                return $result;
            } else {
                return false;
            }
        } catch (Exception $e) {
            Yii::log(__CLASS__, __FUNCTION__, '获取算法列表失败：' . $e->getMessage(), YII_ERROR);
        }
    }
    
    /**
     * 插入算法
     */
    public function insert_algorithm($type, $param = array()) {
        if (empty($param) || !is_array($param)) {
            return false;
        }
        try {
            Yii::log(__CLASS__, __FUNCTION__, '插入算法设置', YII_INFO);
            $sql = "INSERT INTO `algorithm_list` SET `type`=:type, `params`=:params";
            $params[':type'] = $type;
            $params[':params'] = json_encode($param);
            $st = $this->db->createCommand($sql);
            $ret = $st->execute($params);
            if ($ret === false) {
                return false;
            }
            return $ret;
        } catch (Exception $e) {
            Yii::log(__CLASS__, __FUNCTION__, '插入算法设置失败：' . $e->getMessage(), YII_ERROR);
        }
    }
    
    /**
     * 修改算法参数
     */
    public function update_algorithm($id, $param = array()) {
        $id = intval($id);
        if ($id == 0) {
            return false;
        }
        if (empty($param) || !is_array($param)) {
            return false;
        }
        try {
            Yii::log(__CLASS__, __FUNCTION__, '修改算法参数  algorithm_id:' . $id, YII_INFO);
            $sql = "UPDATE `algorithm_list` SET `params`=:params  WHERE `id`=:id";
            $params[':id'] = $id;
            $params[':params'] = json_encode($param);
            $st = $this->db->createCommand($sql);
            $ret = $st->execute($params);
            if ($ret === false) {
                return false;
            }
            return $ret;
        } catch (Exception $e) {
            Yii::log(__CLASS__, __FUNCTION__, '修改算法参数失败：' . $e->getMessage(), YII_ERROR);
        }
    }
    
    /**
     * 判断算法是否已存在 
     */
    public function is_exist($id) {
        $id = intval($id);
        if ($id == 0) {
            return false;
        }
        try {
            Yii::log(__CLASS__, __FUNCTION__, '判断算法是否已存在  algorithm_id:' . $id, YII_INFO);
            $sql = "SELECT `id` FROM `algorithm_list` WHERE `id` = {$id}";
            $st = $this->db->createCommand($sql);
            $st->execute();
            $data = $st->queryAll();
            if ($data) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            Yii::log(__CLASS__, __FUNCTION__, '查询失败：' . $e->getMessage(), YII_ERROR);
        }
    }
}