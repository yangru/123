<div class="theLoginBox regSuccess">
<?php
if ( ( NULL !== user()->getState('email') ) AND ( '0' === user()->getState('status') )  ) 
{
    $title = '请先激活！';
    $tip = '';
    $email = user()->getState('email');
    $id = user()->getState('id');
}
else 
{
    $tip = '恭喜，注册成功！';
    $title = '注册成功！';
}
?>
        <h1><?php echo $title; ?></h1>
        <div class="successTip">
        
           <form>
    <?php 
    
            $domain = 'http://'.Users::getEmailDomain($email);
            $str = '<p>'.$tip;
            $str .= '我们已发送激活邮件到您的注册邮箱账号下，请【'.l(t('登录邮箱'),$domain).'】进行激活！</p>';
            $str .= '<p>如果你60分钟内还未收到激活邮件，请【';
            $str .=  CHtml::ajaxLink('点击此处', 
                array('user/resendmail'),
                array('type'=>'POST',
                     'success'=>'function(msg){jQuery("#resendemail").html(msg)}', 
                     'data'=>'id='.$id,
                     'error' => 'function(){jQuery("#resendemail").html("请求失败")}'),
                array('id'=>'resendmail')
            );
            $str .= '】重新获取激活邮件！</p>';
            echo $str;
    ?>
    </form>
    <p id="resendemail"></p>


        </div>

    </div>
    
    