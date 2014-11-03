<?php
class SiteEditAction extends CAction
{

	public function run(
		$site_id = 0, $sitename = '', $url = '',
		$out = '',
		$callback = false, $tmpl = 'json'
	) {
		if ($out === 'html') {
			$this->controller->render("siteedit");
			app()->end();
		}

		if ($site_id) {
			$query = array('user_id' => user()->id, 'site_id' => $site_id);
			if (User_site::model()->findByAttributes($query)) {
				$site = Sites::model()->findByPk($site_id);
				$site->sitename = $sitename;				
				$msg = $site->update() ? array('error' => '+OK') : array('error' => '-ERROR:请求参数错误!');
				Logs::writeLog('edit','site',$sitename);
				json_encode_end($msg);
			}
		} else {
			$site = new Sites();
			$site->url = $url;
			$site->sitename = $sitename;
			$isExists = $this->isUserSiteExists(user()->id, $site->url);
            if ($isExists == 2) {
				json_encode_end(array('error' => '-ERROR: 网址格式不正确.'));
			} elseif ($isExists == 0) {
				// $site->create_time = dbUtils()->getDateTimeNowStr();
				if ($siteid = $this->saveSite($site)){
					Logs::writeLog('add','site',$sitename);
					json_encode_end(array('error' => '+OK', 'result' => array('site_id' => $siteid)));
				}
			} else {
				json_encode_end(array('error' => '-ERROR: 不能重复添加.'));
			}
		}
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
			$criteria->condition = "sites.url='{$url}'";
			$sites = Users::getUserSites($criteria, $user_id);
			
			return $sites ? 1 : 0;
		}
		return 2;
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
				$user_site = new User_site;
				$user_site->user_id = user()->id;
				$user_site->site_id = $site->id;
				$user_site->create_time = $now;
				if ($user_site->save()) {
					return $site->id;
				}
			}
		}
		return false;
	}

}
