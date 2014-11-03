<?php
/**
 * Copyright 2011 Benjamin Wöster. All rights reserved.
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
 * or implied, of Benjamin Wöster.
 */



class OpenFlashChart2Loader
{
  private static $_openFlashChartFolder;
  private static $_loaded = false;

  static public function load()
  {
    if (OpenFlashChart2Loader::$_loaded)
      return;
    
    $openFlashChartBasePath = dirname(__FILE__) . '/open-flash-chart-2-Lug-Wyrm-Charmer';

    // I use the php lib, because the php5 lib is poorly documented and seems
    // to be incomplete (didn't find tooltip class).
    $openFlashChart_php_lib = $openFlashChartBasePath . '/php-ofc-library';

    // When using the php5 lib, adding the lib path to the include path is
    // important. The file php5-ocf-library/lib/OFC/OFC_Chart.php uses includes
    // relative to php5-ocf-library/lib
    // (e.g.: require_once('OFC/OFC_Elements.php');). So without
    // php5-ocf-library/lib being in the php include path, this won't work.
    //
    // With the php4 lib (php-ofc-library), this is not necessary. This lib is
    // organized as flat list of files, and most of the shipped files get
    // included right away when php-ofc-library/open-flash-chart.php
    // is included. There are some commented includes in this file, which makes
    // me believe, that the swf offers more than this library actually
    // supports. However, extending the API of the php language binding
    // is beyond the scope of this widget.
    //
    // Code for adding the php5-ocf-library to the include path:
    // $openFlashChart_php5_lib = $openFlashChartBasePath . '/php5-ofc-library/lib';
    // set_include_path( get_include_path() . PATH_SEPARATOR . $openFlashChart_php5_lib );

    Yii::setPathOfAlias('OpenFlashChart2', $openFlashChart_php_lib);
    include_once $openFlashChart_php_lib . '/open-flash-chart.php';
    include_once $openFlashChart_php_lib . '/ofc_sugar.php';

    OpenFlashChart2Loader::$_openFlashChartFolder = $openFlashChartBasePath;
    OpenFlashChart2Loader::$_loaded = true;
  }

  static public function getOpenFlashChartFolder()
  {
    OpenFlashChart2Loader::load();
    return OpenFlashChart2Loader::$_openFlashChartFolder;
  }

}