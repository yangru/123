<?php
/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class Controller extends CController
{
	protected $act = false;
	public $site_id = 0;

	public function init()
	{   	    
		$current_path = str_ireplace('.html','', Yii::app()->getRequest()->getPathInfo());	    
	    $controller =  app()->controller->id;

	    if ('api' == $controller) {
	    	return;
	    }

		if ( 'user' != $controller ) {

			//获取客户端传递的session标识
			$sessionid=isset($_POST["sess_sessionid"]) ? $_POST["sess_sessionid"] : null;
			if ($sessionid) {
				session_id($sessionid);
			}
			if (!user()->id) {
				if (isAjax(false)) {
					json_encode_end(array('error' => '请先登录.'));
				} else {
					if (VERSION_TYPE === VERSION_TYPE_FREE) {
						//模拟登录
						$model = new LoginForm('login');
						$_POST['LoginForm'] = array(
							'email' => 'clicki@163.com',
							'password' => '123456',
							'rememberMe' => 0,
						);
						if (isset($_POST['LoginForm'])) {
							$model->attributes = $_POST['LoginForm'];
							if ($model->validate() && $user = $model->login()) {
								user()->setState('demo', true);
							}
						}
					} else {
						$this->redirect('/login.html', false);
					}
				}
			} else {
				if (isset($_GET['out']) && $_GET['out'] == 'html') {
					$this->layout = 'xxx';
				}
				// get from cookie(or default)
				if (!empty($_GET["site_id"])) {
					set_site_id($_GET["site_id"]);
				}
				if (!empty($_POST["site_id"])) {
					set_site_id($_POST["site_id"]);
				}
				//过滤趋势改变日期
				if ($current_path != "feed/trend") {
					if (!empty($_GET["begindate"])) {
						set_begindate($_GET["begindate"]);
					}
					if (!empty($_GET["enddate"])) {
						set_enddate($_GET["enddate"]);
					}
				}
				$this->site_id = intval(get_site_id());
			}
		}		
		
		if($controller == 'home') {
			if(isset($_REQUEST['site_id']) && $_REQUEST['site_id'] != -1 && $_REQUEST['site_id'] != $this->site_id) {
				$_REQUEST['site_id'] = $this->site_id;
				$this->redirect('/site/'.$this->site_id.'/',true);
			}
		}
		
		if( !$this->authUser() ) {
			json_encode_end(array('success' => false, 'code' => 'AUTH_FAILURE', 'message' => "没有使用权限，请与系统管理员联系"));
			exit();
		}
		
	} 

	/**
	 * 免费版积分限制功能
	 */
	public function mapping($c = NULL, $a = NULL, $return = NULL){
		if (!isset(user()->demo) || (isset(user()->demo) && !user()->demo)) {
			$func_mapping = param('func_mapping');
			$controller =  app()->controller->id;
			$action = app()->controller->action->id;
			//echo $controller . " " . $action;
			if (isset($_GET['type'])) $action = $_GET['type'];
			if ($c) $controller = $c;
			if ($a) $action = $a;
			$mapping = isset($func_mapping[$controller][$action]) ? $func_mapping[$controller][$action] : '';
			if ($mapping && isset($mapping['switch']) && $mapping['switch']) {
				//取得当前站点的功能权限
				if ($this->site_id) {
					$siteinfo = Sites::model()->findByPk($this->site_id);
					user()->setState('func_limit', isset($siteinfo['func_limit']) ? $siteinfo['func_limit'] : '');
					if (!isset(user()->func_siteid) || $this->site_id != user()->func_siteid) {
						user()->setState('func_siteid', $this->site_id);
					}
					if (isset(user()->func_limit))
					$func_limit = json_decode(user()->func_limit,true);
					$s_func = isset($func_limit[$mapping['name']]) ? $func_limit[$mapping['name']] : '';
					$now = new DateTime();
					if (!isset($s_func['indate']) || $now > new DateTime($s_func['indate'])) {
						//没开通该功能
						$user = Users::model()->findByPk(user()->id);
						$mapping['func_str'] = "$controller@$action";
						$this->layout = 'xx';
						if ($return) return true;
						die($this->render('/exch/index', array('user_point' => $user['point'], 'func_info' => $mapping), true));
					} else {
						user()->setFlash('func_indate', $s_func['indate']);
						if ($return) return false;
					}
				}
			}
		}
	}
	
	public function authUser() {
		$path = str_ireplace('.html','', Yii::app()->getRequest()->getPathInfo());	  
		$querystring = Yii::app()->getRequest()->getQueryString();
		if(isset($_REQUEST['tmpl']) && $_REQUEST['tmpl'] == 'export') {
			$path .= '/export';
		}		
		
		if($path == 'custom/tab_edit' && isset($_REQUEST['type']) && $_REQUEST['type'] == 18000) {
			$path .= '/'.$_REQUEST['type'];
		}
		return User_site::authByPath($path);
	}
	
}
