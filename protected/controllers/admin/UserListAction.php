<?php
class UserListAction extends CAction
{

	/**
	 * 用户查询列表
	 *
	 * @param $deleted  是否是被删除用户
	 * @param $is_admin 是管理员
	 * @param $no_admin 非管理员
	 * @param $word		关键词查询
	 * @param unknown_type $limit
	 */
	public function run(
		$deleted = 0, $word = '',
		$is_super = 0, $no_super = 0,
		$page = '1', $limit = '20'		
	) {
		$page = Utils::parseParam($page, PARAM_TYPE_INT);
		$limit = Utils::parseParam($limit, PARAM_TYPE_INT);
		$offset = $limit * ($page - 1);	

        $criteria = new CDbCriteria();
        $criteria->limit = $limit;
        $criteria->offset = $offset;
		$criteria->select = array("t.id", "t.user_name", "t.email", "t.count", "t.last_time", "t.create_time","t.level","t.top_uid");					
		$userAuth = User_site::userAuth(user()->id);
		$level = isset($userAuth['level']) ? $userAuth['level'] : 0;

		if($deleted) {
			$criteria->addCondition('t.status=0');
		} else {
			$criteria->addCondition('t.status=1');
		}
		if($is_super) {
			$criteria->addCondition('t.level=1');
		}
		if($no_super) {
			$criteria->addCondition('t.level=0');
		}
		if($word) {
			$criteria->addSearchCondition('t.user_name',$word);
		}
				
		$result = self::loadUsers($criteria);
		header('Content-type: application/json');
		json_encode_end(array('success'=>true, 'result'=>$result));		
	}
	
	private static function loadUsers($criteria)
	{		
	    $items = Users::model()->findAll($criteria);	
	    $_items = array();
		$count = Users::model()->count($criteria);
		if($items) {
			foreach ($items as $item) {
				$_items[] = $item->getAttributes();
			}
		}
		return array(
			'items' => $_items,
			'total' => $count
		);
	}

}
