<?php
if (isset($_GET['_NEW']) && $_GET['_NEW']==2012){
    $data = array(
        'error' => 0,
        'result' => array(
        	'sitename' => $site->sitename,
        	'siteurl' => $site->url
        )
    );
    echo json_encode($data);
    return;
}
?>
<h2 id="functionTitle"><?php echo user()->getFlash('navText'); ?></h2>
<div id="showArea" class="theShowArea siteMane">
    <div class="node_form">
    	<div class="node_add_stepone">

        <!--翻译----php写出的带needTrans的class-->
        <p><?php echo CHtml::activeLabel($site, 'sitename', array('class' => 'needTrans'));?><?php echo CHtml::activeTextField($site, 'sitename', array('class' => 'xlarge needTrans', 'placeholder'=>'请输入网站名称'));?><span class="error_message"><?php echo cut_errors(CHtml::error($site, 'sitename')); ?></span></p>
        <!--翻译----php写出的带needTrans的class-->
        <p><?php echo CHtml::activeLabel($site, 'url', array('class' => 'needTrans')); ?><?php echo CHtml::activeTextField($site, 'url', array('class' => 'xlarge needTrans', 'placeholder'=>'请输入要添加的网站')); ?><span class="error_message"><?php echo cut_errors(CHtml::error($site, 'url')); ?></span></p>

        <?php echo CHtml::Button(user()->getFlash('submitText'),array('class' => 'saveAndCode','style'=>'', 'id'=>'nextstep')) ?>

        <?php echo CHtml::Button(user()->getFlash('getCodeText'), array('class' => 'btn','style'=>'margin:10px 0 0 0;display:none;', 'id'=>'getCode')) ?>

    </div>
    <span class="error_message"> <?php echo CHtml::errorSummary($site);?> </span>
</div>
<script type="text/javascript">
//页面语言转换
pageTextTranslate(".needTrans");
</script>
