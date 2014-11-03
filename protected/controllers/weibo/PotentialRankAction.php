<?php
/**
 * 潜力微博排行
 */
class PotentialRankAction extends CAction {
    public function run($page = 1, $offset = 20) {
    	//获取微博排行
    	$weibo_model = new WeiboModel();
        $result = $weibo_model->weibo_potential_rank($page, $offset);
        $json = json_encode(array('success' => true, 'result' => $result));
        header('Content-type: application/json');
        echo $json;
        return;
    }
}
