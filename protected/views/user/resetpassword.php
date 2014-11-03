<div class="theLoginBox">
  <div class="loginTxt"><?php echo "重置" . param("sitename") . "账号密码"; ?></div>
  <?php  $form=$this->beginWidget('CActiveForm', array(
       'id' => 'leftForm',
       'enableAjaxValidation' => false,
	   'enableClientValidation' => false,
	   'clientOptions' => array(
	       'validateOnSubmit'=>true,
	     ),
        )); ?>
  <div class="theLoginArea" id="loginBox" style="width:290px;">
    <p <?php  $s = cut_errors($form->error($model,'email'));  echo 'style="position: relative;"'?>>
     <?php echo $form->labelEx($model, 'email'); ?>
     <?php echo CHtml::activeTextField($user, 'email', array('readonly' => 'readonly')); ?>
        <?php if (empty($s)){echo ' <span>请输入您的邮箱</span>';}else{echo '<span style="display:block">'.$s.'</span>';} ?>
     </p>
    <p <?php  $s = cut_errors($form->error($model,'password'));  echo 'style="position: relative;"'?>>
     <?php echo $form->labelEx($model, 'password'); ?>
     <?php echo $form->passwordField($model, 'password', array('placeholder'=>t('请输入新的密码'))); ?>
        <?php if (empty($s)){echo ' <span>请输入新的密码</span>';}else{echo '<span style="display:block">'.$s.'</span>';} ?>
     </p>
    <p <?php  $s = cut_errors($form->error($model,'repassword'));  echo 'style="position: relative;"'?>>
     <?php echo $form->labelEx($model, 'repassword'); ?>
     <?php echo $form->passwordField($model, 'repassword', array('placeholder'=>t('请再次输入新的密码'))); ?>
        <?php if (empty($s)){echo ' <span>请再次输入新的密码</span>';}else{echo '<span style="display:block">'.$s.'</span>';} ?>
     </p>
	<p class="no_allow">
		<?php echo user()->getFlash('message'); ?>
	</p>
    <div class="loginSubmitBnt">
      <div class="setpassword_submit">
      <?php echo CHtml::submitButton('submit', array('class' => 'theSubmitButton', 'name'=>'userSubmit' ,'value'=>'')); ?>
      </div>
    </div>
  </div>
  <?php $this->endWidget(); ?>
</div>
