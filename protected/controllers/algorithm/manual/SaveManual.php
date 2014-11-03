<?php
/**
 * 保存手动干预设置
 */
class SaveManual extends CAction {
    public function run($uids, $video_ids) {
    	$uids = json_decode($uids, true);
    	if (empty($uids) || empty($video_ids)) {
    		echo json_encode(array('error' => '参数错误'));
    		return ;
    	}
    	$passport_model = new PassportUser();
    	
    	//转化成整形
    	$video_ids = json_decode($video_ids, true);
    	foreach ($video_ids as $key => $value) {
    		$video_ids[$key] = intval($value);
    	}
    	
    	foreach ($uids as $uid) {
    		//看是否已有记录
    		$is_exist = $passport_model->is_exist_manual_recomm($uid);
    		if ($is_exist) {
    			$result = $passport_model->update_manual_recommend($uid, $video_ids);
    		} else {
    			$result = $passport_model->save_manual_recommend($uid, $video_ids);
    		}
    	}
        if ($result !== false) {
        	Logs::writeLog('set', 'manual_recomm', '');
        	$remote_model = new CallRemote();
        	$remote_model->add_manual_uids($uids);
            $json = json_encode(array('success' => true));
        } else {
            $json = json_encode(array('error' => '设置失败'));
        }
        header('Content-type: application/json');
        echo $json;
        return;
    }
}
