<div id="chanel-nav"><?php echo t('当前位置'); ?>: <?php echo l(t('首页'), app()->homeUrl); ?> &gt; <?php echo l(t('绑定网站'), url('site/bindsite')); ?> &gt; <?php echo t('获取代码'); ?></div>
<div id="right-content">
  <div class="get-code">
    <h3 class="con-title getcode-title"><?php echo t('成功绑定网站!请将下面的JS代码插入你的网站代码里边.'); ?></h3>
    <div class="code-area">
    <textarea  >
    		<a href=" http://www.clicki.cc" title="统计系统"><img title="实时统计" src="http://www.clicki.cn/refer/feeler_img.php" /></a>
    </textarea>
 
    <?php echo l(t('下一步:绑定数据'), url('site/binddata'), array('class'=>'getcode')); ?>
    </div>
  </div>
</div>
