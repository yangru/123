<?php
/**
 * 城市
 */
class CityAction extends CAction {
	public function run() {
		require_once (dirname ( __FILE__ ) . '/../../../config/city_config.php');
		global $city_config;
		$arrNewCity = array ();
		foreach ( $city_config as $arrCity ) {
			$arrNewCity [] = $arrCity [0];
		}
		$json = json_encode ( array (
				'success' => true,
				'result' => array (
						'items' => $arrNewCity,
						'total' => count ( $arrNewCity ) 
				) 
		) );
		header ( 'Content-type: application/json' );
		echo $json;
		return;
	}
}
