<?php
/**
 * 获取用户的目录访问权限 
 * @author Kevin
 */
class VisitAuthAction extends CAction {
    
    public function run() {
        $auth_config = User_site::authData();
        $visit_auth_ids = array(10001,10004,10005,20001,20003,30010,30008,30012,30001,30003,30015,30009,30016,40001,40002);
        $auth_list = array();
        foreach ($auth_config as $values) {
            foreach ($values as $key => $value) {
                $auth_list[$key] = $value;
            }
        }
        foreach ($auth_list as $key => $value) {
        	if (!in_array($key, $visit_auth_ids)) {
        		unset($auth_list[$key]);
        	}
        }
        foreach ($auth_list as $key => $value) {
            if (!User_site::authById($key)) {
                unset($auth_list[$key]);
            }
        }
        $visit_auth = array('sys' => array(), 'algo' => array());
        if (!empty($auth_list)) {
            foreach ($auth_list as $key => $value) {
            	if ($key == 40001) {
            		$visit_auth['algo'][] = '#/algorithm/hotweibo';
            		$visit_auth['algo'][] = '#/algorithm/hotuser';
            		$visit_auth['algo'][] = '#/algorithm/hottopic';
            		$visit_auth['algo'][] = '#/algorithm/potential';
            	}
                if (strpos(strval($key), '1') === 0 || strpos($key, '2') === 0) {
                    $visit_auth['sys'][] = '#/' . User_site::getAuthPath($value);
                } else if (strpos($key, '3') === 0 || strpos($key, '4') === 0) {
                    $visit_auth['algo'][] = '#/' . User_site::getAuthPath($value);
                }
            }
        }
        header('Content-type: application/json');
        echo json_encode($visit_auth);
        return;
    }
}