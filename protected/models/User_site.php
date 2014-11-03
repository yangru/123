<?php

class User_site extends CActiveRecord {
    
	/**
	 * 表'user_site'的字段:
	 * @var int $user_id
	 * @var int $site_id
	 * @var tinyint $level
	 * @var datetime $create_time
	 */
	
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }
    
    public function tableName()
    {
        return '{{user_site}}';
    }
    
    public function primaryKey()
	{
		return 'site_id';
	}
	
    public function rules()
    {
        return array(
        );
    }
    
    public function relations()
    {        
        return array(
            'sites' => array(self::HAS_ONE, 'Sites', 'id', ),
            'users' => array(self::HAS_ONE, 'Users', 'id', ),
            'roles'=>array(self::HAS_ONE, 'Roles','','on'=>'r.id=t.role_id','alias'=>'r'),
        );
    }
    
    public function attributeLabels()
    {
        return array();
    }

    protected function beforeSave()
    {
        if(parent::beforeSave())
        {
            if($this->isNewRecord)
            {
                $this->create_time = DbUtils::getDateTimeNowStr();
            }
            return true;
        }
        else
            return false;
    }

    /**
     * 获取用户的权限数据     
     */
    public static function userAuth($user_id)
    {    	    	
    	static $_items = array();
    	if(!$_items) {    		
    		
//    		if(isset(Yii::app()->session['userAuth'])) {    			
//    			$_items = Yii::app()->session['userAuth'];    			
//    			if($_items['timestamp'] - time() < 1800) {	//session有效时间为半个小时
//    				return $_items;
//    			} else {
//    				$_items = array();
//    			}
//    		}
    		$user = Users::model()->findByPk($user_id);    		
	    	if(!$user) {
	    		$_items['level'] = 0;
	    		$_items['top_uid'] = $user_id;
	    		return $_items;
	    	}
	    	$user_level = isset($user->level) ? $user->level : 0;
	    	$_items['level'] = $user_level;
	    	$_items['top_uid'] = ($user->top_uid == 0) ? $user->id : $user->top_uid;
	    	$_items['restrict'] = isset($user->restrict) ? $user->restrict : 0;
	    	$_items['timestamp'] = time();	    	
	    		    	
	    	$criteria = new CDbCriteria();    	
			if ($user_level == 1 || $user_level == 2) {
				$_items[-1]['authorize'] = 'all';
			}
			if($user_level == 1)	{			
				$criteria->select = 'site_id';
				$criteria->condition = 'top_uid='.$user->top_uid;
				$criteria->group = 'site_id';
				$usites = User_site::model()->findAll($criteria);					
				if($usites) {
					foreach ($usites as $usite) {
						$_items[$usite->site_id]['authorize'] = 'all';
					}
				}
			}
			if($user_level == 0) {			
				$criteria->select = "t.role_id,t.authorize,r.*,t.user_id";
				$criteria->addCondition('t.user_id='.$user_id);					
		    	$usites = User_site::model()->with('roles')->findAll($criteria);	    	
		    	if($usites) {
		    		foreach ($usites as $usite) {    			
		    			$_items[$usite->site_id]['authorize'] = $usite->authorize;    			
		    			$_items[$usite->site_id]['role_id'] = $usite->role_id; 
		    			if($usite && $usite->roles && $usite->roles->authlist) {
		    				$_items[$usite->site_id]['authlist'] = $usite->roles->authlist;    						    				   	
		    			}    			
		    		}
		    	}
			}
//			Yii::app()->session['userAuth'] = $_items;
    	}
    	return $_items;    			
    }
    
    /**
     * 权限的基本数据     
     * @return unknown
     */
    public static function authData()
    {
    	static $auth_config = null;
    	if($auth_config == null) {
    		$auth_config = require(dirname(__FILE__) . '/../config/authorize.php');    		
    	}
    	return $auth_config;
    }

    /**
     * 通过访问路径验证权限
     *
     * @param unknown_type $path
     * @return unknown
     */
    public static function authByPath($path, $site_id = 0) {
    	
    	$auths = User_site::getAuthByPath($path);     	
    	if(!$auths) return true;
    	foreach ($auths as $auth) {
    		if(User_site::auth($auth, $site_id)) {
    			return true;
    		}
    	}    	
    	return false;
    }
    
    /**
     * 通过权限ID验证是否拥有权限
     *
     * @param unknown_type $id
     * @return unknown
     */
    public static function authById($id, $site_id = 0) {
    	$auth = User_site::getAuthById($id);    	
    	return User_site::auth($auth, $site_id);
    }

	/**
	 * 根据路径查找有无相关配置信息	 	 
	 * @return unknown
	 */
	public static function getAuthByPath($current_path) {
		$auth_config = User_site::authData();
		$auths = array();		
		foreach ($auth_config as $key=>$value) {
			$auth = array();
			foreach ($value as $k=>$v) {
				$path = User_site::getAuthPath($v);							
				if (!$path || !$current_path) continue;	
				$path_array = explode('|',$path);				
				if (in_array($current_path,$path_array)) {						
					$auth = $v;
					$auth['id'] = $k;
					$auth['type']= $key;
					break;
				}									
			}
			if($auth)$auths[] = $auth;
		}
		return $auths;
	}
	
	/**
	 * 根据ID获取相关验证权限的分配信息	 
	 */
	public static function getAuthById($authid) {
		$auth_config = User_site::authData();		
		$auth = array();
		foreach ($auth_config as $key=>$value) {			
			foreach ($value as $k=>$v) {
				if($authid == $k) {					
					$auth = $v;
					$auth['id'] = $k;
					$auth['type']= $key;
				}			
			}
		}
		return $auth;
	}
	
	/**
	 * 验证用户权限	 
	 */
	public static function auth($auth = array() , $site_id = 0)
	{
		if(!$site_id) $site_id = get_site_id(); 
		if ( !isset($auth['id']) ) return true;		
		if( isset($auth['version']) && $auth['version'] != VERSION_TYPE) return false;	
			
		//需要用户的level判断系统权限:管理员默认拥有所有权限		
		$userAuths = User_site::userAuth(user()->id);		
		$user_level = isset($userAuths['level']) ? $userAuths['level'] : 0;										
		$user_restrict = isset($userAuths['restrict']) ? $userAuths['restrict'] : 0;
		
		//超级管理员通过所有验证
		if($user_level == 2)	return true;		
		
		$auth_id = $auth['id'];
        $authRs = false;
        if (isset($userAuths[$site_id]['authorize'])) {
            if ($userAuths[$site_id]['authorize'] == 'all') {
                $authRs = true;
            } else {
                if ($userAuths[$site_id]['role_id'] == 0 && $auth['type'] == 'data')
                    $authRs = true;
                if (strstr($userAuths[$site_id]['authorize'], (string)$auth_id))
                    $authRs = true;
            }
        }
        if (isset($userAuths[$site_id]['authlist'])) {
            if (strstr($userAuths[$site_id]['authlist'], (string)$auth_id))
                $authRs = true;
        }
        return $authRs;
	}
	
	/**
	 * 生成Auth对应的路
	 */
	public static function getAuthPath($auth)
	{
		$attach = '';
		if (isset($auth['attach'])) $attach = '/'.$auth['attach'];
		$action_array = isset($auth['path']) ? explode(',',$auth['path']) : explode(',',$auth['action']);		
		$path = '';
		foreach ($action_array as $key=>$value) {
			$path .= '|'.$auth['controller'].'/'.$value.$attach;
		}
		if($path) $path = substr($path,1);		 
		return $path;
	}
	
	/**
	 * 根据ID获取对应的路径
	 *
	 * @param unknown_type $id
	 * @return unknown
	 */
	public static function getAuthPathById($id)
	{		
		$auth_config = User_site::authData();		
		$auth = array();
		foreach ($auth_config as $key=>$value) {			
			foreach ($value as $k=>$v) {
				if($authid == $k) {					
					$auth = $v;
				}			
			}
		}
		return User_site::getAuthPath($auth);
	}    
    
    public static function getSitesByUserId($user_id, $limit=20, $offset=0, $search='', $order='')
    {
        require_once(dirname(__FILE__) . '/../../midlayer/ClickiModel/ClickiModel.php');
        

        $criteria = new CDbCriteria();
        if (!$order) {
            $criteria->offset = $offset;
            $criteria->limit = $limit;
        }
        /*
        if ($order) {
            $orders = Utils::parseParam($order, PARAM_TYPE_MAP);
            $str = '';
            if (is_array($orders)) {
                foreach ($orders as $k => $v) {
                    if ($v === 1) $sortv = "ASC";
                    else $sortv = "DESC";
                    $str .= "$k $sortv,";
                }
                $criteria->order = substr($str, 0, strlen($str) - 1);
            }
        }
         */
        $wordCount = '';
        if ($search = addslashes(urldecode($search))) {
            $criteria->addSearchCondition('sitename',trim($search));
            $criteria->addSearchCondition('url',trim($search), true, "OR");
            $wordCount = sprintf("AND (s.url LIKE '%s' OR s.sitename LIKE '%s')", "%$search%", "%$search%");
        }
        $sites = Users::getUserSites($criteria, $user_id);        
        
        $isMobile = isset($_POST["from"]) && $_POST["from"] == "mobile" ? 1 : 0;
        $_items = array();
        
        if ($sites !== null && is_array($sites)) {
            foreach ($sites as $site) {            	
                $cdo = new ClickiModel($site->id);
                $statistic = $cdo->trendViewTB(array(
                    'site_id' => $site->id,
                    'begindate' => strftime('%Y-%m-%d', strtotime('today')),
                    'enddate' => strftime('%Y-%m-%d', strtotime('today')),
                    'metrics' => array('pageviews', 'new_pageviews', 'sessions', 'ips', 'visitors', 'new_visitors', 'active_visitors', 'new_visitor_rate', 'old_visitors', 'old_visitor_rate', 'avg_loadtime', 'avg_staytime', 'avg_pageviews', 'avg_pagepixels', 'bounces', 'bounce_rate', 'click', 'inclick', 'outclick', 'input', 'stop', 'reserve0', 'reserve1', 'reserve2', 'reserve3', 'reserve4'),
                ), 1);

                $y_axis = array(
                    'pageviews' => 0,
                    'new_pageviews' => 0,
                    'sessions' => 0,
                    'ips' => 0,
                    'visitors' => 0,
                    'new_visitors' => 0,
                    'active_visitors' => 0,
                    'new_visitor_rate' => 0,
                    'old_visitors' => 0,
                    'old_visitor_rate' => 0,
                    'avg_loadtime' => 0,
                    'avg_staytime' => 0,
                    'avg_pageviews' => 0,
                    'avg_pagepixels' => 0,
                    'bounces' => 0,
                    'bounce_rate' => 0,
                    'click' => 0,
                    'inclick' => 0,
                    'outclick' => 0,
                    'input' => 0,
                    'stop' => 0,
                    'reserve0' => 0,
                    'reserve1' => 0,
                    'reserve2' => 0,
                    'reserve3' => 0,
                    'reserve4' => 0
                );
                if (isset($statistic['items'])) {
                    foreach ($statistic['items'] as $values) {
                        $y_axis = $values["metrics"];
                        break;//只有一天的数据，直接跳出了。
                    }
                }

                $_items[] = array(
                     'keys' => array('id' => $site->id),
                     'siteedit' => User_site::authById(20001,$site->id),        //用户是否有设置网站的权限
                     'sitedelete' => User_site::authById(30015,$site->id),      //用户是否有删除网站的权限                  
                     'x_axis' => array(
                         'sitename' => $site->sitename,
                         'url' => $site->url
                     ),
                     'y_axis' => $y_axis
                );
            }
            if ($order) {
                list($key, $sort) = @explode("|", $order);
                $sort = $sort == -1 ? "DESC" : "ASC";
                $_items_sort = array_3d_sort($_items, 'y_axis', $key, $sort);
                $_items = array();
                if ($_items_sort) {
                    $idx = 0;
                    foreach ($_items_sort as $item) {
                        if (count($_items) >= $limit) break;
                        if ($idx < $offset) {
                            $idx ++;
                            continue;
                        }
                        $_items[] = $item;
                        $idx ++;
                    }
                }
            }
        }        
        $userAuth = User_site::userAuth($user_id);
        $user_level = isset($userAuth['level']) ? $userAuth['level'] : 0;
        $top_uid = $userAuth['top_uid'];
        $countSql = '';
        if (DB_TYPE === 'oracle') {
        	$base_sql = 'SELECT COUNT(disctinct "s".id) FROM "user_site" "us", "sites" "s", "users" "u" WHERE "us"."site_id" = "s"."id" AND "us"."user_id" = "u"."id" AND "u"."status"=1 ';
        	if($user_level == 0) {
        		$countSql = sprintf('AND "u"."id" = %d ', $user_id) ;            	
        	}
            if($user_level == 1) {
                $countSql = sprintf('AND "u"."id" = %d ', $top_uid ) ;            	
            }            
        } else {
        	$base_sql = 'SELECT COUNT(distinct(s.id)) FROM user_site us, sites s, users u WHERE us.site_id = s.id AND us.user_id=u.id AND u.status=1 ';
        	if($user_level == 0) {
        		$countSql = sprintf(" AND u.id = %d ", $user_id);
        	}
            if($user_level == 1) {
                $countSql = sprintf(" AND u.id = %d ", $top_uid);
            }            
        }
        $countSql = $base_sql.$countSql;
        $total = User_site::model()->countBySql($countSql . $wordCount);
        return array(
            'items' => $_items,
            'total' => $total,
        );
    }
    
    public static function get_role_num($role_id, $top_uid) {
        $criteria = new CDbCriteria();
        $criteria->select = 'site_id,role_id,COUNT(1) as count';
        $criteria->condition = 'top_uid=:top_uid and role_id=:role_id';
        $criteria->params = array(':top_uid' => $top_uid, ':role_id' => $role_id);
        $criteria->group = "site_id,role_id";
        $roles = User_site::model()->findAll($criteria);
        if (!empty($roles)) {
            $roles = reset($roles);
            $items = $roles->getAttributes();
            return $items['count'];
        } else {
            return 0;
        }
    }
}
