<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<?php echo CHtml::metaTag('text/html; charset=' . app()->charset, null, 'Content-Type');?>
<meta content="IE=8" http-equiv="X-UA-Compatible"/>
<title>CNTV互动运营管理平台</title>
<?php
echo CHtml::metaTag('document', 'Resource-Type');
echo CHtml::metaTag('global', 'Distribution');
echo CHtml::metaTag('general', 'rating');
//echo CHtml::linkTag('shortcut icon', 'image/x-icon', resBu('images/favicon.ico'));
echo CHtml::script('var site_id = ' . get_site_id() . '; var todaydate = \''. date('Y-m-d') . '\'; var begindate = \'' . get_begindate() . '\'; var enddate = \'' . get_enddate() . '\'; BU = \'' . abu() . '\'; TBU = \'' . tbu() . '\'; RESBU = \'' . resBu() . '\'; SBU = \'' . sbu() . '\'; CSRF_TOKEN = \'' . request()->csrfTokenName . '\'; VERSION = \'' . VERSION . '\';');
?>
<link  type="text/css" rel="stylesheet" href="<?php echo resBu('styles/clicki.web.css') ?>" />
<link  type="text/css" rel="stylesheet" href="<?php echo resBu('styles/clicki.innerpage.css') ?>" />
<link  type="text/css" rel="stylesheet" href="<?php echo resBu('styles/clicki.datepicker.css') ?>" />
<link  type="text/css" rel="stylesheet" href="<?php echo resBu('styles/newCss.css') ?>" />
<!--[if lte IE 9 ]><link  type="text/css" rel="stylesheet" href="<?php echo resBu('/styles/clicki.iehotfix.css') ?>" /><![endif]-->
<link id="forLess1200px"  type="text/css" rel="stylesheet" href="" />
</head>
<body>
<div id="container">
<!--头-->
<div class="G-frameHead">
  <div class="G-innerHead clearfix" id="theBigFrameHead">
    <div class="cntvlogo"></div>
    <!--h1><a href="/"><img src="<?php echo VERSION_TYPE === VERSION_TYPE_FREE ? resBu('images/logo_small.jpg') : resBu('images/logo_small1.png') ?>" alt="<?php echo app()->name;?>" title="<?php echo app()->name;?>" /></a></h1-->
    <div class="nav">
      <ul id="theNavList">
		<?php 
		$userAuth = User_site::userAuth(user()->id);
		$user_level = isset($userAuth['level']) ? $userAuth['level'] : 0;        
		$user_restrict = isset($userAuth['restrict']) ? $userAuth['restrict'] : 0; 
        ?>
        <li class="firstLi main" id="adminNav"><a class="needTrans" href="/manage/#/admin/user" title="系统管理">系统管理</a></li>
        <li id="algorithmNav"><a class="needTrans" href="/algorithm/#/algorithm/algorithmlist" title="算法平台">算法平台</a></li>
      </ul>
    </div>
    <div class="usertoolbar">
      <?php $this->widget('UserToolbar'); ?>
    </div>
  </div>
</div>

<!--身-->
<div class="G-frameBody">
  <!--[if lte IE 9 ]>
	<div class="ie6tips" style="display:none;">
		<h2>不推荐使用IE浏览器,请使用Chrome,Firefox或Safari以获得最佳浏览体验</h2>
	</div>
	<![endif]-->
  <div class="G-frameBodyInnner" id="theBigFrameBody">
    <div class="frameBodyBox">
      <div class="theWholeMask"></div>
      <!--左导航-->
      <div class="G-imNav clearfix" id="imNav">      

      <?php
		$auth_config = User_site::authData();		
		$auth_conf = array();
		foreach ($auth_config as $key=>$value) {
			foreach ($value as $k=>$v) {
				$auth_conf[$k] = $v;
			}    	
		}

		function show_list_check(&$show_auth_ids) {
			foreach ($show_auth_ids as $key=>$value) {
				if (!User_site::authById($key)) {
					unset($show_auth_ids[$key]);
				}
			}
		}
		 
      ?>
        <div id="theNavSetSite" class="G-setNav G-Nav" style="display: none;">
        	<div class="lan">
        		<div class="top clearfix">
          			<div class="left">
        				<strong class="system_manager needTrans">系统管理</strong>
	            		<ul>
	              			<li id="setpassword"><a class="needTrans" href="#/user/setpassword" title="修改密码">修改密码</a></li>
	            		</ul>
					</div>
					<div class="right">
	          			<div class="y_top"></div>
	          			<div class="y_bottom"></div>
	          		</div>
				</div>
				<div class="bottom"></div>
			</div>
        </div>
        
        <div id="theNavAdmin" class="G-Nav" style="display:none;">
        <?php
        	$show_auth_ids = array(10001=>'用户列表',10004=>'回收站');
			show_list_check($show_auth_ids);			
			if ($show_auth_ids) : 
		?>
		<div class="lan">
          	<div class="top clearfix">
          		<div class="left">
		          <strong class="setting needTrans">用户管理</strong>
		            <ul>            
					<?php				
						foreach ($show_auth_ids as $key=>$value) :
					?>				
						<li <?php if(isset($auth_conf[$key]['id']))?>id="<?php echo $auth_conf[$key]['id']?>">
						  <a class="needTrans" href="#/<?php echo User_site::getAuthPath($auth_conf[$key]); ?>" title="<?php echo $value; ?>"><?php echo $value; ?></a>
						</li>				
					<?php endforeach; ?>
		            </ul>
		          </div>
          		<div class="right">
          			<div class="y_top"></div>
          			<div class="y_bottom"></div>
          		</div>
          	</div>
          	<div class="bottom"></div>
        </div>
        <?php endif; ?>
        <?php
        	$show_auth_ids = array(10005=>'角色列表');
			show_list_check($show_auth_ids);			
			if ($show_auth_ids) : 
		?>
		<div class="lan">
          	<div class="top clearfix">
          		<div class="left">
		          <strong class="setting needTrans">权限管理</strong>
		            <ul>            
					<?php				
						foreach ($show_auth_ids as $key=>$value) :
					?>				
						<li <?php if(isset($auth_conf[$key]['id']))?>id="<?php echo $auth_conf[$key]['id']?>">
						  <a class="needTrans" href="#/<?php echo User_site::getAuthPath($auth_conf[$key]); ?>" title="<?php echo $value; ?>"><?php echo $value; ?></a>
						</li>				
					<?php endforeach; ?>
		            </ul>
		          </div>
          		<div class="right">
          			<div class="y_top"></div>
          			<div class="y_bottom"></div>
          		</div>
          	</div>
          	<div class="bottom"></div>
        </div>
        <?php endif; ?>
        <?php
        	$show_auth_ids = array(20001=>'业务日志',20003=>'服务日志');
			show_list_check($show_auth_ids);			
			if ($show_auth_ids) : 
		?>
		<div class="lan">
          	<div class="top clearfix">
          		<div class="left">
		          <strong class="setting needTrans">监控管理</strong>
		            <ul>            
					<?php				
						foreach ($show_auth_ids as $key=>$value) :
					?>				
						<li <?php if(isset($auth_conf[$key]['id']))?>id="<?php echo $auth_conf[$key]['id']?>">
						  <a class="needTrans" href="#/<?php echo User_site::getAuthPath($auth_conf[$key]); ?>" title="<?php echo $value; ?>"><?php echo $value; ?></a>
						</li>				
					<?php endforeach; ?>
		            </ul>
		          </div>
          		<div class="right">
          			<div class="y_top"></div>
          			<div class="y_bottom"></div>
          		</div>
          	</div>
          	<div class="bottom"></div>
        </div>
        <?php endif; ?>
        </div>
		
      </div>
      <!--主显示区域-->
      <div class="G-showArea G-statPage" id="imOutterArea">
      	<div class="showTop clearfix">
      		<div class="left">
      			<div class="inArea">
		          <h2 id="functionTitle" class="needTrans"> <img src="/resources/images/loading2.gif" alt="" valign="absmiddle" /> 正在加载，请稍候。</h2>
		          <div id="showArea" class="theShowArea"></div>
		        </div>
      		</div>
      		<div class="right">
      			<div class="bg_top"></div>
      			<div class="bg_y"></div>
      		</div>
      	</div>
        <div class="showBottom"></div>
      </div>
    </div>
  </div>
</div>
</div>
<script type="text/javascript">
if(window.screen.availWidth > 1024){
  document.getElementById("theBigFrameHead").className += " G-theWidescreenHead";
  document.getElementById("theBigFrameBody").className += " G-theWidescreen";
}
</script>
<script src="/resources/libs/seajs/1.2.0/sea.js" data-main="/resources/app/boot.js?v=<?= VERSION ?>"></script>
</body>
</html>
