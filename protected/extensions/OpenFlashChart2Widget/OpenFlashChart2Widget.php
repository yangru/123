<?php
/**
 * Copyright 2011 Benjamin W�ster. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 * 
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 * 
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY BENJAMIN W�STER ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL BENJAMIN W�STER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Benjamin W�ster.
 */

Yii::import('zii.widgets.jui.CJuiWidget');

/**
 * 
 * 
 * OpenFlashChart2 API:
 * http://teethgrinder.co.uk/open-flash-chart-2/doxygen/html/index.html
 *
 * OpenFlashChart2 Tutorials:
 * http://teethgrinder.co.uk/open-flash-chart-2/tutorial.php
 *
 * OpenFlashChart2 Charts Overview:
 * http://teethgrinder.co.uk/open-flash-chart-2/area-hollow.php
 *
 * OpenFlashChart2 Chart Elements Overview:
 * http://teethgrinder.co.uk/open-flash-chart-2/x-axis.php
 *
 * OpenFlashChart2 Forums:
 * http://forums.openflashchart.com/
 */
class OpenFlashChart2Widget extends CJuiWidget
{
  static private $_instanceCounter = 0;

  private $_openFlashChartSwfAsset = '';
  private $_json2JsAsset = '';
  private $_openFlashChart2WidgetJsAsset = '';
  private $_swfObjectBaseUrl = '';
  private $_swfObjectFolder;

  public $width = 300;
  public $height = 200;
  public $chartId = 'openFlashChart2_0';
  public $openFlashChartData = 'open_flash_chart_data';
  public $chart = NULL;
  public $resizable = true;

  /////////////////////////////////////////////////////////////////////////////

  public function __construct( CBaseController $owner=NULL )
  {
    parent::__construct($owner);
    
    OpenFlashChart2Loader::load();

    $this->_swfObjectFolder = dirname(__FILE__) . '/swfobject';
    $this->chartId = 'openFlashChart2_' . OpenFlashChart2Widget::$_instanceCounter++;
  }

  /////////////////////////////////////////////////////////////////////////////

  /**
   * this method is called by CController::beginWidget()
   */
  public function init()
  {
    parent::init();

    $this->publishAssets();
    $this->registerClientScripts();
  }

  /////////////////////////////////////////////////////////////////////////////

  /**
   * this method is called by CController::endWidget()
   */
  public function run()
  {
    $chartData = $this->chart === NULL ? 'null' : $this->chart->toPrettyString();
    $width = $this->resizable ? '100%' : $this->width;
    $height = $this->resizable ? '100%' : $this->height;

    echo  $this->startResizable() .
            '<div id="'.$this->chartId.'"></div>'.
          $this->endResizable().'
    <script type="text/javascript">
    /* <![CDATA[ */

    addOpenFlashChartData( "'.$this->chartId.'", '.$chartData.' );

    // @see "http://code.google.com/p/swfobject/wiki/documentation#STEP_3:_Embed_your_SWF_with"
    swfobject.embedSWF(
      // swfUrl (String, required) specifies the URL of your SWF
      "'.$this->_openFlashChartSwfAsset.'?r=' . time() . '",

      // id (String, required) specifies the id of the HTML element (containing
      // your alternative content) you would like to have replaced by your
      // Flash content
      "'.$this->chartId.'",

      // width (String, required) specifies the width of your SWF
      "'.$width.'",

      // height (String, required) specifies the height of your SWF
      "'.$height.'",

      // version (String, required) specifies the Flash player version your SWF
      // is published for (format is: "major.minor.release" or "major")
      "9.0.0",

      // expressInstallSwfurl (String, optional) specifies the URL of your
      // express install SWF and activates Adobe express install. Please note
      // that express install will only fire once (the first time that it is
      // invoked), that it is only supported by Flash Player 6.0.65 or higher
      // on Win or Mac platforms, and that it requires a minimal SWF size of
      // 310x137px.
      "",

      // flashvars (Object, optional) specifies your flashvars with name:value
      // pairs
      {
        "get-data": "'.$this->openFlashChartData.'",
        "id"      : "'.$this->chartId.'"
      }
    );

    /* ]]> */
    </script>';
  }

  /////////////////////////////////////////////////////////////////////////////

	protected function publishAssets()
	{
    $assetManager = Yii::app()->getAssetManager();
    
		$this->_openFlashChartSwfAsset = $assetManager->publish(
      OpenFlashChart2Loader::getOpenFlashChartFolder() . '/open-flash-chart.swf' );
		$this->_json2JsAsset = $assetManager->publish(
      dirname(__FILE__) . '/json2.js' );
		$this->_openFlashChart2WidgetJsAsset = $assetManager->publish(
      dirname(__FILE__) . '/OpenFlashChart2Widget.js' );
		$this->_swfObjectBaseUrl = $assetManager->publish(
      $this->_swfObjectFolder );
	}

  /////////////////////////////////////////////////////////////////////////////

	protected function registerClientScripts()
	{
    Yii::app()->getClientScript()->registerScriptFile(
      $this->_swfObjectBaseUrl . '/swfobject.js' );
    Yii::app()->getClientScript()->registerScriptFile(
      $this->_json2JsAsset );
    Yii::app()->getClientScript()->registerScriptFile(
      $this->_openFlashChart2WidgetJsAsset );

    if ($this->resizable)
    {
      Yii::app()->getClientScript()->registerScript( 'resizable',
        '$(".resizable").resizable();', CClientScript::POS_READY );
    }
  }

  /////////////////////////////////////////////////////////////////////////////

	protected function startResizable()
	{
    if (!$this->resizable)
      return '';

    $width = $this->width;
    $height = $this->height;
    $style = "width: {$width}px; height: {$height}px; padding: 10px;";
    return '<div class="resizable" style="'.$style.'">';
  }

  /////////////////////////////////////////////////////////////////////////////

	protected function endResizable()
	{
    if (!$this->resizable)
      return '';

    return '</div>';
  }

  /////////////////////////////////////////////////////////////////////////////

}