<style>.theCenterBox{width:670px;}</style>
<div class="theLoginBox" style="width:657px">
<div class="loginTxt"><?php echo "注册" . param("sitename") . "账号"; ?></div>
  <?php  $form=$this->beginWidget('CActiveForm', array(
       'id' => 'leftForm',
       'enableAjaxValidation' => false,
	   'enableClientValidation' => false,
	   'clientOptions' => array(
	       'validateOnSubmit'=>true,
	     ),
        )); ?>
  <div class="theLoginArea" id="loginBox">
	<?php $is_applyUser = user()->getFlash("apply_user"); ?>
    <p <?php  $s = cut_errors($form->error($model,'email'));  echo 'style="position: relative;"'?>>
     <?php echo $form->labelEx($model, 'email'); ?>
     <?php 
     echo $form->textField($model, 'email', array('placeholder'=>t('请输入您的邮箱'), 'readonly' => $is_applyUser));
     if (empty($s)) {
         echo ' <span>请输入您的邮箱</span>';
     } else {         
         echo '<span style="display:block">'.$s.'</span>';
     }
     ?>
     </p>
    <p <?php  $s = cut_errors($form->error($model,'password'));  echo 'style="position: relative;"'?>>
     <?php echo $form->labelEx($model, 'password'); ?>
     <?php 
         echo $form->passwordField($model, 'password', array('placeholder'=>t('请输入您的密码')));
     if (empty($s)) {
         echo ' <span>请输入您的密码</span>';
     } else {
         echo '<span style="display:block">'.$s.'</span>';
     }
     ?>
     </p>
    <p <?php  $s = cut_errors($form->error($model,'checksum'));  echo 'style="position: relative;"'?>>
    <?php echo $form->labelEx($model, 'checksum'); ?>
     <?php 
     echo $form->textField($model, 'checksum', array('placeholder'=>t('请输入您的邀请码'), 'readonly' => $is_applyUser));
     if (empty($s)) {
         echo ' <span>请输入您的邀请码</span>';
     } else {         
         echo '<span style="display:block">'.$s.'</span>';
     }
     ?>
     </p>
    <div class="loginSubmitBnt">
      <div class="reg_submit">
      <?php echo CHtml::submitButton('submit', array('name'=>'userSubmit','class'=>'theSubmitButton', 'value'=>t(''))); ?>
      </div>
    </div>
  </div>
  <div class="theRegArea fixRegHeight" id="reg_reg">
    <h2><?php echo "没有" . param("sitename") . "邀请码？"; ?></h2>
	<br/>
    <?php echo l(t(''),url('user/apply_account'), array('class' => 'apply_reg')); ?>
	<br/>
    <h2><?php echo "已经有" . param("sitename") . "账号？"; ?></h2>
	<br/>
    <?php echo l(t(''),url('user/login'), array('class' => 'reg_login')); ?> </div>
  <?php $this->endWidget(); ?>
</div>


