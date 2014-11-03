  <div class="theLoginBox regSuccess">
<?php if ($active === 'noexists') : ?>
<h1>账号不存在,请先注册！</h1>
        <div class="successTip">
            <p><?php echo CHtml::link(t('注册账号'), url('user/reg') ); ?></p>
        </div>
<?php elseif ($active === 'exists' ||  $active=== 'active') : ?>
<h1>验证确认成功！</h1>
<div class="successTip">
<p><?php echo CHtml::link(t('进入管理后台'), url('user/login')); ?></p>
</div>

<?php /*
<?php elseif ( $active === 'remail' ) : ?>
激活失败，链接已失效，重新发送邮件,请查收重新激活....
<?php */ endif; ?>
</div>