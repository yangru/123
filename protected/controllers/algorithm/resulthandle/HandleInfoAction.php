<?php
/**
 * 结果控制方案明细
 */
class HandleInfoAction extends CAction {
    public function run($id) {
    	$setting = array();
        $handle_obj = new ResultHandle();
        $result = $handle_obj->get_handle_detail($id);
        if ($result !== false) {
        	$result['setting'] = json_decode($result['setting'], true);
            $json = json_encode(array('success' => true, 'result' => $result));
        } else {
            $json = json_encode(array('success' => false));
        }
        header('Content-type: application/json');
        echo $json;
        return;
    }
}
