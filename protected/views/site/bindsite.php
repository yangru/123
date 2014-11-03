<div id="chanel-nav"><?php echo t('当前位置'); ?>: <?php echo l(t('首页'), app()->homeUrl); ?> &gt; <?php echo l(t('绑定网站'), url('site/bindsite')); ?></div>
<div id="right-content">
  <?php $this->renderPartial('_siteinfo', array('model'=>$model));  ?>
</div>
