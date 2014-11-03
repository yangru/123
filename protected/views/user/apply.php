<style>.theCenterBox{width:670px;}</style>
<div class="theLoginBox" style="width:657px">
<div class="loginTxt"><?php echo "申请" . param("sitename") . "账号"; ?></div>
  <?php  $form=$this->beginWidget('CActiveForm', array(
       'id' => 'leftForm',
       'enableAjaxValidation' => false,
	   'enableClientValidation' => false,
	   'clientOptions' => array(
	       'validateOnSubmit'=>true,
	     ),
        )); ?>
  <div class="theLoginArea" id="loginBox">
    <p <?php  $s = cut_errors($form->error($model,'email'));  echo 'style="position: relative;"'?>>
     <?php echo $form->labelEx($model, 'email'); ?>
     <?php 
     echo $form->textField($model, 'email', array('placeholder'=>t('请输入您的邮箱')));
     if (empty($s)) {
         echo ' <span>请输入您的邮箱</span>';
     } else {         
         echo '<span style="display:block">'.$s.'</span>';
     }
     ?>
     </p>
    <p <?php  $s = cut_errors($form->error($model,'site_url'));  echo 'style="position: relative;"'?>>
     <?php echo $form->labelEx($model, 'site_url'); ?>
     <?php 
         echo $form->textField($model, 'site_url', array('placeholder'=>t('请输入您的网站地址')));
     if (empty($s)) {
         echo ' <span>请输入您的网址</span>';
     } else {
         echo '<span style="display:block">'.$s.'</span>';
     }
     ?>
     </p>
	<?php if ($apply_msg = user()->getFlash("apply_msg")) : ?>
	 <p><span style="display:block;top:auto;"><?=$apply_msg ?></span></p>
	<?php endif; ?>
    <div class="loginSubmitBnt">
      <div class="apply_submit">
      <?php echo CHtml::submitButton('submit', array('name'=>'userSubmit','class'=>'theSubmitButton', 'value'=>t(''))); ?>
      </div>
    </div>
  </div>
  <div class="theRegArea fixRegHeight" id="reg_reg">
    <h2><?php echo "已经有" . param("sitename") . "账号？"; ?></h2>
    <p>&nbsp;</p>
    <?php echo l(t(''),url('user/login'), array('class' => 'reg_login')); ?> </div>
  <?php $this->endWidget(); ?>
</div>


