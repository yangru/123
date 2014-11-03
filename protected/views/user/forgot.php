<div class="theLoginBox" style="width:657px">
  <div class="loginTxt"><?php echo t('忘记密码??'); ?></div>
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
	<p class="forgot_message">
		<? echo user()->getFlash('message'); ?>
	</p>
    <div class="loginSubmitBnt">
      <div class="forgot_submit">
      <?php echo CHtml::submitButton('submit', array('class' => 'theSubmitButton', 'name'=>'userSubmit', 'value'=>t(''))); ?>
      </div>
    </div>
  </div>
  <div class="theRegArea fixRegHeight forgot_right">
    <h2><?php echo "已经有" . param("sitename") . "账号？"; ?></h2>
    <p class="forgot_space">&nbsp;</p>
    <?php echo l(t(''),url('user/login'), array('class'=>'forgot_login')); ?> </div>
  <?php $this->endWidget(); ?>
</div>
