<?php
/**
 * 用户站点管理
 * @author skyoo61@gmail.com 2011-08-12
 */
class SiteController extends Controller
{
    const PAGE = 1;
    const LIMIT = 10;
	/**
	 * Declares class-based actions.
	 */
	public function actions() {
		return array();
	}

	public function filters() {
	    return array(
			'accessControl',
			//'ajaxOnly + addSite, ajaxEditSite, ajaxGetSitesList, ajaxGetSites, ajaxSetSite, ajaxSearchSite, ajaxDelSite, getCode, editSite',
	    );
	}

	public function accessRules() {
		return array(
			array(
				'deny',
				//'actions' => array('addsite', 'ajaxeditsite', 'ajaxdelsite', 'editsite'),
				'actions' => array('ajaxeditsite', 'ajaxdelsite'),
				'expression'=>'$user->getState("demo") == 1',
				//'users' => array('clicki@163.com'),
				//'expression' => "json_encode_end(array('error' => '您未被授权执行这个操作!'))",
			),
		);
	}

	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */

	public function actionIndex() {
		$this->layout = 'main2';
		$this->render('index');
	}

	public function actionList(
		$word = '', $order = '',
		$page = 1, $limit = 20,
		$callback = false, $tmpl = 'json') {

		require_once(dirname(__FILE__) . '/../../library/utils/utils.php');
		$captions = require_once(dirname(__FILE__) . '/captions.php');

		$page = Utils::parseParam($page, PARAM_TYPE_INT);
		$limit = Utils::parseParam($limit, PARAM_TYPE_INT);
		$offset = $limit * ($page - 1);

		$result = User_site::getSitesByUserId(user()->id, $limit, $offset, $word, $order);

		//返回json数据
		if ($tmpl == 'json') {
			$json = json_encode(array(
				'success' => true,
				'result' => array(
					'items' => $result['items'],
					'amount' => array(),
					'total' => $result['total'],
					'caption' => $captions,
				),
				'debug' => array(),
			));
			if ($callback !== false) {
				echo "{$callback}({$json})";
			} else {
				echo $json;
			}
		}
	}

	private function getSiteSortLimit($items, $offset = 0, $limit = 20) {
	}

	/*
	 * 添加站点view
	 */
    public function actionAddSite() {
	    $this->setPageTitle('添加网站');
		//if (reqParam('from') == "c.h.s") {
		//	$site->addError('noHasSite','你还没有添加站点,请先添加站点.');
		//}
        user()->setFlash('navText', '添加网站');
        user()->setFlash('headerText', ' 添加网站');
        user()->setFlash('submitText', '');
        user()->setFlash('getCodeText', '获取代码');   
		$site = new Sites();
		$this->render('siteinfo', array('site' => $site));
    }

	/*
	 * 添加/修改站点action
	 */
	public function actionAjaxEditSite($site_id = 0, $url = '', $sitename = '') {
		if ($site_id) {
			//TODO 修改站点
			$userAuth = User_site::userAuth(user()->id);
			$top_uid = $userAuth['top_uid'];
			if($userAuth['level'] == 2 || $userAuth['level'] == 3) {				
				$query = array('site_id' => $site_id);
			} elseif($userAuth['level'] == 1) {				
				$query = array('top_uid' => $top_uid, 'site_id' => $site_id);
			} else {
				$query = array('user_id' => user()->id, 'site_id' => $site_id);
			}
			
			if (User_site::model()->findByAttributes($query)) {
				$site = Sites::model()->findByPk($site_id);				
				$site->sitename = $sitename;				
				if($url && $site->url != $url) {					
					$isExists = $this->isUserSiteExists(user()->id, $url);
					if($isExists) {
						json_encode_end(array('error' => '-ERROR: 网址已经存在.'));
					}
					$site->url = $url;
				}
				$msg = $site->update() ? array('error' => '+OK') : array('error' => '-ERROR:请求参数错误!');
				Logs::writeLog('edit','site',$sitename);
				json_encode_end($msg);
			}
		} else {
			//TODO 添加站点
			$site = new Sites();
			$site->url = $url;
			$site->sitename = $sitename;
			$isExists = $this->isUserSiteExists(user()->id, $site->url);			
            if ($isExists == 2) {
				json_encode_end(array('error' => '-ERROR: 网址格式不正确.'));
			} elseif ($isExists == 0) {
				//$site->create_time = DbUtils::getDateTimeNowStr();
				if ($siteid = $this->saveSite($site)){
					Logs::writeLog('add','site',$sitename);
					json_encode_end(array('error' => '+OK', 'result' => array('site_id' => $siteid)));
				}
			} else {
				json_encode_end(array('error' => '-ERROR: 不能重复添加.'));
			}
		}
	}

	/*
	 * 获取代码view
	 */
	public function actionGetCode($site_id) {
	    $this->setPageTitle('添加网站');
        user()->setFlash('navText', '添加网站');
		user()->setFlash('headerText', '第二步: 获取代码');
		$this->render('getcode', array('site_id' => $site_id));
	}
    
    public function actionAjaxGetSitesList() {
		$current_page = reqParam('page') && (intval(reqParam('page'))>0) ? intval(reqParam('page')) : self::PAGE;
		$limit = reqParam('limit') && (intval(reqParam('limit'))>0) ? intval(reqParam('limit')) : self::LIMIT;

		$criteria = new CDbCriteria();
		$criteria->limit = $limit;
		$criteria->offset = ($current_page - 1) * $limit;

		$item_total = User_site::model()->count('t.user_id='.user()->id);
		
		json_encode_end(self::buildSiteListJson(Users::getUserSites($criteria, user()->id), $limit, $item_total));
    }
    
	/**
	 * Ajax 请求站点列表
	 *
	 */
	public function actionAjaxGetSites() {
		$criteria = new CDbCriteria();
		
		$sites = Users::getUserSites($criteria, user()->id);

		$data = array();
		if ($sites !== null && is_array($sites)) {
			foreach ($sites as $site) {
				$data[] = array(
					 'key' => $site->id,
					 'value' => $site->sitename,
					 'url' => self::clearUrl($site->url),
				);
			}
		}
		header('Content-type: application/json');
		json_encode_end(array(
			"success" => true,
			"result" => array(
				'items' => $data
			)
		));
	}
	/**
	 * Ajax 保存当前请求站点ID
	 *
	 */
	public function actionAjaxSetSite() {
		$site_id = (int)reqParam('sid');
		if (!$site_id || $this->site_id == $site_id) {
			json_encode_end(array('error' => '-ERROR:000'));
		}
		set_site_id($site_id);
		json_encode_end(array('error' => '+OK'));
	}
	
	public function actionAjaxSearchSite() {
		$current_page = reqParam('page') && (intval(reqParam('page')) > 0) ? intval(reqParam('page')) : self::PAGE;
		$limit = reqParam('limit') && (intval(reqParam('limit')) > 0) ? intval(reqParam('limit')) : self::LIMIT;

		$find = reqParam('keyword');
		$criteria = new CDbCriteria();
		$criteria->addSearchCondition('t.url', trim($find));
		$criteria->addSearchCondition('t.sitename', trim($find), true, "OR");
		$sitelist = Users::getUserSites($criteria, user()->id);
		$item_total = count($sitelist);
		
		$criteria->offset = ($current_page - 1) * $limit;
		$criteria->limit = $limit;
					
		json_encode_end(self::buildSiteListJson(Users::getUserSites($criteria, user()->id), $limit, $item_total));
	}
	
	private static function buildSiteListJson($sites, $item_num = self::LIMIT, $item_total) {
        $data = array();
        
        if ($item_total > 0 && $sites) {
            $items = array();
            foreach ($sites as $site) {
                $items[] = array(
                    'site_name' => trim($site->sitename),
                    'site_url' => self::clearUrl($site->url, true),
                    'site_id'  => $site->id,
                    /*  暂时不用
                    'yestoday_pv' => 0,  //TODO
                    'yestoday_ip' => 0,  //TODO
                    'today_pv'    => 0,  //TODO
                    'today_ip'    => 0,  //TODO
                    'status'      => $site->status,
                    */
                );
			}
	       $result = array(
                'item_num'  =>  $item_num,
                'item_total'=>  $item_total,
                'items'     =>  $items,
            );
            $data = array(
                'error'     =>  '+OK',
                'result'    =>  $result,
            );
        } else {
            $data = array('error' => '-ERROR:请求参数错误!');
        }
        
        return $data;
	}

	/**
	 * Ajax 删除站点
	 *
	 */
	public function actionAjaxDelSite($site_id) {		
		$site = Sites::model()->findByPk(intval($site_id));		
		if($site) {
			$sitename = $site->sitename;
			$userAuth = User_site::userAuth(user()->id);
			$top_uid = $userAuth['top_uid'];
			if($userAuth['level'] == 2 || $userAuth['level'] == 3)	{
				$query = array('site_id' => (int)$site_id);
			} elseif($userAuth['level'] == 1) {				
				$query = array('top_uid' => $top_uid,'site_id' => (int)$site_id);
			} else {
				$query = array('user_id' => user()->id,'site_id' => (int)$site_id);
			}
			$usites = User_site::model()->findAllByAttributes($query);
			if(!$usites) json_encode_end(array('error' => '-ERROR:你没有该站点!'));
			foreach ($usites as $key=>$usite) {				
				if(!$usite->delete()) {
					json_encode_end(array('error' => '删除出错!'));
				}
			}
			Logs::writeLog('delete','site',$sitename);
		}
		json_encode_end(array('error' => '+OK'));		
	}
	
	/**
	 * 判断站点和用户id是否有关联
	 *
	 * @param unknown_type $sid
	 */
	private function isUserSiteExists($user_id, $url) {
	    $u = new CUrlValidator;
        $u->defaultScheme = 'http';
        $url = $u->validateValue($url);

		if ($url) {
			$criteria = new CDbCriteria(); 
			$criteria->condition = "t.url='{$url}'";
			$sites = Users::getUserSites($criteria, $user_id);
			
			return $sites ? 1 : 0;
		}
		return 2;
	}
	
	/**
	 * 修改站点
	 *
	 */
	public function actionEditSite($site_id) {
	    $this->setPageTitle('修改站点');
	    if ($site_id) {       			
			$site = Sites::model()->findByPk($site_id);
			user()->setFlash('navText', '修改网站');
			user()->setFlash('readonly', array(
			     'readonly' => 'readonly',
			     'disabled' => 'disabled',
			));
			user()->setFlash('headerText', '修改站点 ['.$site->sitename.']');
			user()->setFlash('submitText', '');
			$this->render('siteinfo', array('site' => $site));
		} else {
	         $this->redirect('/main/#/site/addsite');
	    }
	}
	
	/**
	 * 保存站点
	 *
	 * @param object $site
	 */
	private function saveSite($site) {
		// $now = date('Y-m-d H:i:s', time());
		$now = DbUtils::getDateTimeNowStr();
		$site->last_time = $now;
		if ($site->save()) {
			if ($site->user_site === null) {
				$top_uid = Users::getTopBelong(user()->id);
				$user_site = new User_site;
				$user_site->user_id = user()->id;
				$user_site->top_uid = $top_uid;
				$user_site->site_id = $site->id;
				$user_site->create_time = $now;
				if ($user_site->save()) {					
					//如果用户不是初始top_uid，则user_site表添加一条top_uid的记录，只有在删除网站的时候才清除这条记录					
					if(user()->id != $top_uid) {
						$top_user_site = User_site::model()->findByAttributes(array('user_id'=>$top_uid, 'site_id'=>$site->id));
						if(!$top_user_site) {
							$top_user_site = new User_site;
							$top_user_site->user_id = $top_uid;
							$top_user_site->top_uid = $top_uid;
							$top_user_site->site_id = $site->id;
							$top_user_site->create_time = $now;
							$top_user_site->save();
						}
					}
					return $site->id;
				}		
			}
		}
		return false;
	}
	
	public static function clearUrl($url, $link = false) {	    
	    $u = new CUrlValidator;
        $u->defaultScheme = 'http';
        $u->pattern = '/(^|\s|\()((http(s?):\/\/)|(www\.))(\w+[^\s\)\<]+)$/i';
        $url = $u->validateValue($url);
        $old_url = $url;        
    	$url = parse_url($url);
    	if (isset($url['host']) && isset($url['path'])) {
    	    return $link ?  "<a href=\"{$old_url}\" target=\"_blank\" title=\"{$old_url}\">".$url['host'].rtrim($url['path'], '/')."</a>" : $url['host'].rtrim($url['path'], '/');
    	} elseif (isset($url['host'])) {
    	    return $link ? "<a href=\"{$old_url}\" target=\"_blank\" title=\"{$old_url}\">".$url['host']."</a>" : $url['host'];
    	} else {
    	    return  '';
    	}
    }
    
    public function actionError() {
        $this->render('error');
    }
}
