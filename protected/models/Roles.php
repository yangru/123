<?php
class Roles extends CActiveRecord {
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }
    
    public function tableName()
    {
        return '{{roles}}';
    }

    public function relations()
    {
        return array(	
	        'user_site' => array(self::HAS_ONE, 'User_site', 'user_id'),
	        'sites' => array(self::HAS_MANY, 'Sites', 'site_id', 'through'=>'user_site',  'select'=>'sites.sitename, sites.url, sites.id', 'together'=>true), 
	        'sites_count' => array(self::STAT, 'Sites', 'User_site(user_id, site_id)'),
	    );
    }
    
    /**
     * 获取角色信息    	
     * @param unknown_type $user_id     
     */
    public static function getRoles($user_id) {
        //获取用户ID获取网站信息
        try {
        	Yii::log(__CLASS__, __FUNCTION__, '获取用户角色信息(uid：' . $user_id . ')', YII_INFO);
            $roles = Roles::model()->findAll('user_id=' . $user_id);
        } catch (Exception $e) {
            Yii::log(__CLASS__, __FUNCTION__, '获取用户角色信息失败：' . $e->getMessage(), YII_ERROR);
        }
        return $roles;
    } 
	
	private static function loadItems($items)
	{
		$_items = array();
		if($items) {
			foreach ($items as $item) {
				$_items[] = $item->getAttributes();
			}
		}		
		return $_items;
	}	    


	public static function getRoleInfo($role_id) {
        if ($role_id == 0)
            return array('id' => 0, 'name' => '超级管理员');
        try {
        	Yii::log(__CLASS__, __FUNCTION__, '获取角色信息(role_id：' . $role_id . ')', YII_INFO);
            $role = self::model()->findByPk($role_id);
        } catch (Exception $e) {
            Yii::log(__CLASS__, __FUNCTION__, '获取角色信息失败：' . $e->getMessage(), YII_ERROR);
        }
        if ($role) {
            return array('id' => intval($role_id), 'name' => $role->name);
        }
        return array();
    }

	public static function getAuthorize($authorize, $list) {
		$authInfo = array();
		if ($list) {
			foreach ($list as $id) {
				switch(substr($id, 0, 1)) {
				case 1:
					$type = "user";break;
				case 2:
					$type = "monitor";break;
				default:
					continue 2;
				}
				if (isset($authorize[$type][$id])) {
					$authInfo[] = array(
						'id' => $id,
						'title' => $authorize[$type][$id]['title'],
						'desc' => @$authorize[$type][$id]['desc']
					);
				}
			}
		}
		return $authInfo;
	}
    
}

