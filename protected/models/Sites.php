<?php

class Sites extends CActiveRecord {
    
	/**
	 * 表'sites'的字段:
	 * @var int $id
	 * @var varchar $sitename
	 * @var varchar $url
	 * @var varchar $description
	 * @var datetime $last_time
	 * @var datetime $create_time
	 */
	
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }
    
    public function tableName()
    {
        return '{{sites}}';
    }
    
    public function rules()
    {
        return array(
            array('url', 'required', 'message'=>'网站地址不可为空白.'),
            array('sitename','required', 'message'=>'网站名称不可为空白.'),
            array('sitename','length', 'max'=>32),
            array('url', 'length', 'max'=>256),
            array('url', 'url', 'defaultScheme'=>'http', 'message'=>'网站地址不是有效的URL.'),
         //  array('url', 'exist', 'on'=>'addSite'),
         //   array('url', 'unique', 'on' => 'insert'),			
 //           array('type', 'in', 'range' => array(0,1,2,3,4)),
   //         array('last_time, create_time', 'date', 'format'=>'Y-M-d H:m:s'),
        );
    }
    
    public function relations()
    {
        return array(
            'user_site' => array(self::HAS_ONE, 'User_site', 'site_id', ),
        );
    }
    
    public function behaviors()
	{
	    return array(
	        'CTimestampBehavior' => array(
	            'class' => 'zii.behaviors.CTimestampBehavior',
	            'updateAttribute' => 'last_time',
                'timestampExpression' => DbUtils::getDateTimeNowStr(),
	        ),
	    );
	}

    protected function beforeSave()
    {
        if(parent::beforeSave())
        {
            if($this->isNewRecord)
            {
                $this->status = 1;
                $this->type = 0;
                $this->func_limit = ' ';
                $this->create_time = DbUtils::getDateTimeNowStr();
            }
            return true;
        }
        else
            return false;
    }
    	
    public function attributeLabels()
    {
        return array(
            'url' => t('网站地址'),
            'sitename' => t('网站名称'),
            'description' => t('网站描述'),
            'type' => t('网站类型'),
        );
    }
    
     /**
     * 获取用户ID获取网站信息
     */
    public static function getUsersBySite($site_id)
    {    	
    	$criteria = new CDbCriteria();
    	$criteria->select = 'id, email';		
		$criteria->join = "INNER JOIN user_site ON user_site.site_id = t.id AND user_site.site_id = " . $site_id;
		$users = Users::model()->findAll($criteria);
		return $users;   	
    }
    
}
