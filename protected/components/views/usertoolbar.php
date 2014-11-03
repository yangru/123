<ul>
<?php if (!$guest) : ?>
	<?php if (VERSION_TYPE === VERSION_TYPE_FREE) : ?>
    <li class="add"></li>
    <!--li class="yaoqing"><?php echo l(t('邀请'), url('site/'.get_site_id().'/#/invite'),array('class' =>'needTrans')); ?></li>
    <li class="jifen">积分:<?php echo $point; ?></li-->
	<?php endif; ?>
    <li class="email">
    	<div  id="user_name" class="clearfix">
    		<div class="left"></div>
    		<div class="mid"><span class="txt"><?php echo $user_name; ?></span></div>
    		<div class="right"><span class="bg"></span></div>
		</div>
		<div id="sub_list">
			<!--div class="backg"-->
				<div class="opList">
			        <p><?php echo l(t('修改密码'),url('site/'.get_site_id().'/#/user/setpassword'),array('id' =>'setpassword','class' =>'needTrans')); ?></p>
					<p><?php echo l(t('退出'), url('user/logout'),array('class' =>'needTrans')); ?></p>         
				</div>
			<!--/div-->
			
		</div>
      </li>
<?php else : ?>
    <p><span style="color:#fff;">游客</span></p>
    <p><?php echo l(t('登录'), user()->loginUrl,array('class' =>'needTrans')); ?></p>
    <p><?php echo l(t('注册'), url('user/reg'),array('class' =>'needTrans')); ?></p>
<?php endif; ?>
</ul>
