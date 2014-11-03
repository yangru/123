<?php
class AddsiteForm extends CFormModel
{
	public $url;
	public $sitename;
	public $description;
	public $sitetype;

	public function rules()
	{
		return array(
			array('url, sitename, sitetype', 'required'),
			array('url', 'url'),
			array('sitename, description', 'length', 'max'=>128),
 
		);
	}
	
	public function attributeLabels()
	{
		return array(
			'url' => t('网站域名'),
			'sitename' => t('网站名称'),
			'description' => t('网站描述'),
			'sitetype' => t('网站类型'),
		);
	}
 
}