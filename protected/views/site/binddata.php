<div id="chanel-nav"><?php echo t('当前位置'); ?>: <?php echo l(t('首页'), app()->homeUrl); ?> &gt; <?php echo l(t('绑定网站'), url('site/bindsite')); ?> &gt; <?php echo t('获取代码'); ?> &gt; <?php echo t('绑定数据'); ?></div>
<div id="right-content">
  <div class="get-code">
    <h3 class="con-title getcode-title"><?php echo t('点击按钮,将注册前的统计数据绑定到此账号!'); ?></h3>
    <div class="code-area"> <?php echo CHtml::button('button', array('id'=>'binddata','value'=>t('绑定数据'))); ?> </div>
  </div>
  <div id="bindsuccess"  style="display:none;">
    <p><?php echo t('恭喜，成功绑定数据！你可以返回网站列表查看网站数据或者继续添加网站，你也可以查看刚才绑定的统计数据！'); ?></p>
    <p><?php echo  l(t('返回网站列表'), url('site'), array('class'=>'tip-link')); ?> <?php echo  l(t('查看统计数据'), url('general'), array('class'=>'tip-link')); ?></p>
  </div>
  <div id="binderror" style="display:none;">
    <p><?php echo t('绑定过程中出现错误，请返回重新复制代码，将按照帮助 文档中的说明正确操作，如果无法查出问题，请联系客服。'); ?></p>
    <p><?php echo  l(t('返回,复制代码'), url('site/getcode'), array('class'=>'tip-link')); ?> <?php echo  l(t('联系客服'), url('#'), array('class'=>'tip-link')); ?></p>
  </div>
  <script type="text/javascript">
  $(document).ready(function(){
						   $("#binddata").click(function(){
															$("#bindsuccess").fadeIn();
															
															});						   
						   });
  </script>
</div>
