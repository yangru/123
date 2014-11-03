<?php

class Users extends CActiveRecord {
    
	/**
	 * 表'users'的字段:
	 * @var int $id
	 * @var int $visitor_id
	 * @var char $email
	 * @var char $password
	 * @var varchar $sina
	 * @var varchar $qq
	 * @var varchar $renren
	 * @var tynyint $status
	 * @var char $checksum
	 * @var int $point
	 * @var tinyint $level
	 * @var tinyint $developer
	 * @var int $count
	 * @var char $avatar
	 * @var int $ip
	 * @var datetime $last_time
	 * @var datetime $create_time
	 */
    public $id;
    public $user_name;
	public $email;
	public $password;
	public $status;
	public $checksum;
	public $create_time;
	public $last_time;

    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }
    
    public function tableName()
    {
        return '{{users}}';
    }
    
    public function rules()
    {
        return array(
            array('user_name, password','required'),
            array('user_name, password', 'length', 'max'=>128),        
        );
    }
    
    public function relations()
    {
        return array(
//        	'usite' => array(self::HAS_ONE, 'User_site' , 'user_id', 'with' => 'sitelist', 'order' => 'sitelist.create_time DESC'),
            'user_site' => array(self::HAS_ONE, 'User_site', 'user_id'),
            'sites' => array(self::HAS_MANY, 'Sites', 'site_id', 'through'=>'user_site',  'select'=>'sites.sitename, sites.url, sites.id', 'together'=>true), 
            'sites_count' => array(self::STAT, 'Sites', 'User_site(user_id, site_id)'),
        );
    }
    
    public function behaviors()
    {
        return array(
            'CTimestampBehavior' => array(
  			   'class' => 'zii.behaviors.CTimestampBehavior',
  			   'updateAttribute' => 'last_time',
  			   'timestampExpression' => 'date("Y-m-d H:i:s", time())',
  		     ),
  	    );
   }
        
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'status' => t('状态'),
            'repassword' => t('确认密码'),
        );
    }
    
    public function validatePassword($password)
    {
        return $this->hashPassword($password) === $this->password;
    }
    
    public function hashPassword($password)
    {
        return md5($password);
    }
 
    /**
     * 生成用户名验证字符串checksum,根据时间和email生成
     *
     * @param string $user_name
     * @param string $time,格式(2011-05-05 04:04:04)
     * @return string 用户名验证字符串值checksum
     */
    public static function generate_checksum($user_name = null, $time = null)
    {
        return get_uniqid_key($user_name.$time);
    }
    
    
    /**
     * 邮箱验证字符串checksum是否失效, 有效返回true, 失效返回false
     * 有效时间为1天
     *
     * @return boolean
     */
    public static function is_checksum_effective($time = null)
    {
        if ( time() - strtotime($time) > 86400 )
        {
            return false;
        }
       
        return true;
    }
    
	protected function beforeSave()
	{
		if(parent::beforeSave())
		{
		    $cr = new CHttpRequest;
		    $this->ip = ip2long($cr->getUserHostAddress());
		    $this->last_time = DbUtils::getDateTimeNowStr();
			if($this->isNewRecord)
			{
			    $this->status = 1;
        	    $this->level = 0;
        	    $this->developer = 0;
        	    $this->count = 0;
			}
			return true;
		}
		else
			return false;
	}
	
    
    /**
     * 获得邮箱的网址
     *
     * @param string $pieces[1]
     */
    public static function getEmailDomain($email)
    {
        $pieces = explode('@', $email);

        $domain_rules = param('domain_rules');
        
        foreach ( $domain_rules as $rule )
        {
            if ( $pieces[1] === $rule['email'] )
            {
                return $rule['domain'];
            }
        }
        
        return $pieces[1];
    }
    
	
	/**
	 * 获取某一用户的所有站点
	 *
	 */
	public static function getUserSites($criteria, $user_id)
	{	    
	    if(!$user_id) return false;
		$criteria->join = "INNER JOIN user_site us ON us.site_id = t.id INNER JOIN users u ON us.user_id = u.id";	
	    #$criteria->group = 't.id';
		$userAuth = User_site::userAuth($user_id);
		$user_level = isset($userAuth['level']) ? $userAuth['level'] : 0;
		if($user_level == 2 || $user_level == 3) {
			if( !isset($criteria->limit) || !$criteria->limit || $criteria->limit < 0  ) {
				$criteria->limit = 200;		//注意：超级管理员由于没有查询条件会导出所有数据，这里加上限制
			}			
		}		
		if($user_level == 1) {
			$criteria->addCondition('u.id='.$userAuth['top_uid']);			
		}
		if($user_level == 0) {					
			$criteria->addCondition('u.id='.$user_id);
		}		
		$sitelist = Sites::model()->findAll($criteria);
		return $sitelist;	    
	}
	
	/**
     * 获取用户ID获取网站信息
     */
    public static function getSitesByUser($user_id)
    {    	
    	$criteria = new CDbCriteria();
    	$criteria->select = 'id, sitename, url';		
		$criteria->join = "INNER JOIN user_site ON user_site.site_id = t.id AND user_site.user_id = " . $user_id;	
		$sites = Sites::model()->findAll($criteria);					    	
		return $sites;   	
    }
	
	public static function getUserDefaultSiteId($user_id) {
	    $criteria = new CDbCriteria();
	    $criteria->limit = 1;
	    $sites = self::getUserSites($criteria, $user_id);	    
	    return $sites ? $sites[0]->id : -1;
	}

	/**
	 * 获取顶级的父ID
	 *
	 * @param  $user_id
	 * @return 
	 */
	public static function getTopBelong($user_id)
    {    	
    	$top_uid = 0;
    	if($user_id != 0) {    		
    		$user_info = self::model()->findByPk($user_id);
    		if($user_info && $user_info->top_uid) $top_uid = $user_info->top_uid;
    		if($top_uid > 0 && $top_uid != $user_id) {
    			return self::getTopBelong($top_uid);
    		} else {
    			return $user_id;
    		}
    	}
    }
	
}
