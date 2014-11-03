<?php
/**
 * 算法管理平台
 */
require_once (dirname ( __FILE__ ) . '/../../library/utils/utils.php');
class AlgorithmController extends Controller {
	public function actions() {
		return array (
				'scene' => 'application.controllers.algorithm.scene.SceneAction',
				'editscene' => 'application.controllers.algorithm.scene.SceneEditAction',
				'edithandle' => 'application.controllers.algorithm.resulthandle.HandleEditAction',
				'addhandle' => 'application.controllers.algorithm.resulthandle.HandleAddAction',
				'resulthandle' => 'application.controllers.algorithm.resulthandle.ResultHandleAction',
				'delhandle' => 'application.controllers.algorithm.resulthandle.HandleDelAction',
				'handledetail' => 'application.controllers.algorithm.resulthandle.HandleInfoAction',
				'algorithmlist' => 'application.controllers.algorithm.manage.AlgorithmList',
				'editalgorithm' => 'application.controllers.algorithm.manage.AlgorithmEdit',
				'training' => 'application.controllers.algorithm.manage.TrainAction',
				'passportuser' => 'application.controllers.algorithm.manual.PassportUserAction',
				'recommvideosource' => 'application.controllers.algorithm.manual.RecommVideoSourceAction',
				'videosource' => 'application.controllers.algorithm.manual.VideoSourceAction',
				'videotype' => 'application.controllers.algorithm.manual.VideoTypeAction',
				'manualrecomm' => 'application.controllers.algorithm.manual.SaveManual',
				'clearrecomm' => 'application.controllers.algorithm.manual.ClearManual',
				'weibotype' => 'application.controllers.weibo.WeiboTypeAction',
				'weiborank' => 'application.controllers.weibo.WeiboRankAction',
				'weibotrend' => 'application.controllers.weibo.WeiboTrendAction',
				'userrank' => 'application.controllers.weibo.UserRankAction',
				'usertrend' => 'application.controllers.weibo.UserTrendAction',
				'topicrank' => 'application.controllers.weibo.TopicRankAction',
				'topictrend' => 'application.controllers.weibo.TopicTrendAction',
				'potentialrank' => 'application.controllers.weibo.PotentialRankAction',
				'feedback' => 'application.controllers.algorithm.manage.FeedBackAction',
				'recommpreview' => 'application.controllers.algorithm.manage.RecommendPreviewAction',
				'city' => 'application.controllers.algorithm.manual.CityAction',
				'weibotypelist' => 'application.controllers.weibo.WeiboTypeListAction' 
		);
	}
	public function filters() {
		return array (
				'access' 
		);
	}
	public function filterAccess($filterChain) {
		// 验证权限
		$filterChain->run ();
		return true;
	}
	public function actionIndex() {
		$this->layout = 'main2';
		$this->render ( 'index' );
	}
	public function actionError() {
		$this->render ( 'error' );
	}
}
