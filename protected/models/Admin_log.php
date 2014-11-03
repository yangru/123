<?php

class Admin_log extends CActiveRecord {
    
	/**
	 * 表'admin_log'的字段:
	 * @var int $id
	 * @var int $user_id
	 * @var int $site_id
	 * @var varchar $action
	 * @var varchar $message
	 * @var int $ip
	 * @var datetime $time
	 */
	
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }
    
    public function tableName()
    {
        return '{{admin_log}}';
    }
    
    public function rules()
    {
        return array(
        );
    }
    
    public function relations()
    {
        
    }
    
    public function attributeLabels()
    {
        return array();
    }
}