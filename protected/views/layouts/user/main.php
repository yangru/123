<!DOCTYPE html>
<html>
<head>
<?php echo CHtml::metaTag('text/html; charset=' . app()->charset, null, 'Content-Type');?>
<title>登录CNTV互动运营管理平台</title>
<!--?php
echo CHtml::metaTag('document', 'Resource-Type');
echo CHtml::metaTag('global', 'Distribution');
echo CHtml::metaTag('general', 'rating');
echo CHtml::linkTag('shortcut icon', 'image/x-icon', resBu('images/favicon.ico'));
?-->
<?php $this->renderPartial("/public/tongji"); ?>
</head>
<body>
<div class="theCenterBox" style="<? echo app()->controller->action->id == 'forgot' ? 'width:517px' : '' ?>">
<?php echo $content; ?>
</div>
<div class="loginShadow"></div>
<!--div class="G-LRFooter">
  <p>&copy; 2007 - <?php echo date('Y'); ?> <?php echo param('sitename'); ?></p>
  <p class="G-c036">请使用Chrome,Firefox,Safari或IE9以获得最佳浏览体验</p>
</div-->
<?php
cs()->registerCssFile(resBu('styles/clicki.web.css'), 'screen');
if (VERSION_TYPE === VERSION_TYPE_FREE) 
	cs()->registerCssFile(resBu('styles/clicki.loginandreg.css'), 'screen');
else
	cs()->registerCssFile(resBu('styles/clicki.loginandreg.pro.css'), 'screen');
cs()->registerCssFile(resBu('styles/clicki.webkitanimation.css'), 'screen');
cs()->registerScriptFile(resBu('scripts/jq.1.6.1.min.js'), CClientScript::POS_END);
cs()->registerScriptFile(resBu('scripts/clicki.js'), CClientScript::POS_END);
cs()->registerScriptFile(resBu('scripts/clicki.login.js'), CClientScript::POS_END);
?>
</body>
</html>
