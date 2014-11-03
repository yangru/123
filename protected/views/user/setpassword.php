<?php
header("Content-type: application/html");
if (isset($_GET['_NEW']) && $_GET['_NEW']==2012){
    $data = array(
        'error' => 0,
        'result' => array(
          'checksum' => $user->checksum,
          'user_name' => $user->user_name
        )
    );
    echo json_encode($data);
    return;
}
?>

<div class="setpassword">
  <div class="thepwdArea" id="thepwdBox">
    <input type="hidden" name="checksum" id="checksum" value="<?php echo $user->checksum ?>" />
    <p style="position: relative;">
      <label class="needTrans" for="LoginForm_email">用户名：</label>
      <input readonly="readonly" disabled="true" name="user_name" id="Users_email" type="text" maxlength="128" value="<?php echo $user->user_name ?>">
      <span></span>
    </p>
    <p style="position: relative;">
      <label class="needTrans" for="LoginForm_password">密码：</label>
      <input class="needTrans"  placeholder="请输入新的密码" name="password" id="LoginForm_password" type="password" maxlength="16">
      <span class="needTrans">请输入密码</span>
    </p>
    <p style="position: relative;">
      <label class="needTrans" for="LoginForm_repassword">确认密码：</label>
      <input class="needTrans" placeholder="请再次输入新的密码" name="repassword" id="LoginForm_repassword" type="password" maxlength="16">
      <span class="needTrans">请再次输入密码</span>
    </p>
    <p class="no_allow">
    </p>
    <div class="setpasswordSubmitBnt">
      <div class="setpassword_submit">
        <input id="LoginForm_submit" class="theSubmitButton btn_lan02" name="userSubmit" value="确定" type="submit">      
      </div>
    </div>
  </div>
</div>
<script type="text/javascript">
//页面语言转换
pageTextTranslate(".needTrans");
</script>