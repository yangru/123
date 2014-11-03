<?php
class Logs extends CActiveRecord {
	
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }
    
    public function tableName()
    {
        return '{{logs}}';
    }

    public function relations()
    {
        return array();
    }

    /**
     * 添加日志，详细类型信息请查看config/log.php
     *
     * @param $type	操作类型
     * @param $objtype	操作信息类型
     * @param $object  操作信息
     */
    public static function writeLog($operate, $object_type, $object)
    {
        try {
        	Yii::log(__CLASS__, __FUNCTION__, '记录业务日志', YII_INFO);
            $log = new Logs();
            $log->user_id = user()->id;
            $log->user_name = user()->name;
            $log->operate = $operate;
            $log->object_type = $object_type;
            $log->object = $object;
            $cr = new CHttpRequest();
            $log->ip = ip2long($cr->getUserHostAddress());
            $log->time = DbUtils::getDateTimeNowStr();
            $log->save();
        } catch (Exception $e) {
            Yii::log(__CLASS__, __FUNCTION__, '记录业务日志失败：' . $e->getMessage(), YII_ERROR);
        }
    }
}