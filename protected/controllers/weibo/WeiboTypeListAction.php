<?php
/**
 * 微薄类型
 */
class WeiboTypeListAction extends CAction {
	public function run() {
		$weibo_type_model = new WeiboTypeModel ();
		$arrTypes = $weibo_type_model->type_list ();
		$json = json_encode ( array (
				'success' => true,
				'result' => $arrTypes 
		) );
		header ( 'Content-type: application/json' );
		echo $json;
		return;
	}
}
