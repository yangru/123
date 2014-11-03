<div class="loginTop"><img src="/resources/styles/images/img_login_top.jpg"/></div>
<style>.theCenterBox{width:515px!important;}</style>
<div class="theLoginBox">
  <div class="theLoginArea" id="loginBox">
    <?php  
           $form=$this->beginWidget('CActiveForm', array(
               'id' => 'leftForm',
               'focus' => array($model, 'user_name'),
               'enableAjaxValidation' => false,
        	   'enableClientValidation' => false,
        	   'clientOptions' => array(
        	       'validateOnSubmit'=>true,
        	     ),
            )); ?>
    <p <?php  $s = cut_errors($form->error($model,'user_name'));  echo 'style="position: relative;"'?>> <?php echo $form->labelEx($model, 'user_name'); ?>
        <?php
        echo $form->textField($model, 'user_name', array('placeholder'=>t('请输入您的账号'))); 
        if (empty($s)) {
            echo ' <span>请输入您的账号</span>';
        }else {
            echo '<span style="display:block">'.$s.'</span>';      
            }
         ?>

    </p>
    <p <?php  $s = cut_errors($form->error($model,'password'));  echo 'style="position: relative;"'?>> <?php echo $form->labelEx($model, 'password'); ?>      
        <?php
        echo $form->passwordField($model, 'password', array('placeholder'=>t('请输入您的密码'),'autocomplete'=>'off'));
        if (empty($s)) {
            echo ' <span>请输入您的密码</span>';
        }else {            
            echo '<span style="display:block">'.$s.'</span>';      
            }
         ?>
   </p>
    <?php /*if ( extension_loaded('gd') ) :  ?>
    <!--出错一定次数后出现验证码-->
    <p <?php  $s = cut_errors($form->error($model,'validateCode'));  echo 'style="position: relative;"'?>>     <?php echo $form->labelEx($model,  'validateCode'); ?>
         <?php echo CHtml::activeTextField($model, 'validateCode', array('class'=>'chkNum'));?> 
        <em>
         <?php $this->widget('CCaptcha',array(
		    'captchaAction' => 'captcha',
        	'showRefreshButton' => true,
		    'buttonLabel' => t('看不清?换一个'),
		    'buttonLabel' => t('看不清？'),
		    'buttonType' => 'link',
    		'clickableImage' => true,
		    'imageOptions' => array('title'=>t('点击图片重新获取验证码')),
        ));?>
         </em>
          <?php  if (empty($s)){echo ' <span>请输入右边显示的验证码</span>';}else{echo '<span style="display:block">'.$s.'</span>';} ?> 
   </p>
    <?php endif; */ ?>
    <div class="loginSubmitBnt fixPadding">
      <div class="clearfix"><?php echo $form->checkBox($model,'rememberMe', array('id'=>'autoLogin','class'=>'theRememberMe','checked'=>'','style'=>'display:none;')); ?><?php echo $form->label($model,'rememberMe',array('for' => 'autoLogin', 'class'=>'theRememberMeLabel','style'=>'display:none;')); ?> <!--em class="forgotPasswordEm"><a href="<?php echo url('user/forgot'); ?>" title="忘记密码">忘记密码?</a></em--><div class="login_submit"><?php echo CHtml::submitButton('submit', array('name'=>'userSubmit','class'=>'theSubmitButton', 'value'=>t(''))); ?></div>
</div>
     
      <!--<p class="G-c036">请使用Chrome,Firefox,Safari或IE9以获得最佳浏览体验</p>-->
    </div>
    <?php $this->endWidget(); ?>
  </div>
	<?php if (VERSION_TYPE === VERSION_TYPE_FREE) : ?>
	<div class="theRegArea fixLoginHeight">
    <h2><?php echo t('还没有Clicki账号？'); ?></h2>
    <p><?php echo t('马上获取一个Clicki账号！'); ?></p>
    <?php echo l(t(''),url('user/reg'), array('class' => 'login_reg')); ?>  </div>
	<?php endif; ?>
</div>
