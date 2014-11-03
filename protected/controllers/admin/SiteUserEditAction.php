<?php
class SiteUserEditAction extends CAction
{

	public function run(
		$site_id = 0, 
		$out = '',
		$callback = false, $tmpl = 'json'
	) {
		if ($out === 'html') {
			$site_id = 10004;
			$out_data = array('authorize'=>$this->controller->authorize,							  
							  'users' => Sites::getUsersBySite($site_id),							  
							  'roles' => Roles::getRoles(user()->id)
							);															
			$this->controller->render("siteuseredit",$out_data);
			app()->end();
		}
	}
}
