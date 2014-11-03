
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="zh">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Clicki- Error</title>
 
	
</head>

<body>
    <style type="text/css">
 body{height: 100%; font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; margin: 0pt; padding: 0pt; border: 0pt none; background:url(<?php echo resBu('images/inviteIndex_bg.gif');?>) repeat-x 0 0 #1A78B0}

.mainPage{height:100%; position:relative; min-height:580px}

.errorMsgBox{height: 369px; background:url(<?php echo resBu('images/error_bg.png'); ?>) no-repeat center center; left: 50%; margin: -184px auto 0 -484px; position: absolute; text-align: center; top: 50%; width: 969px; overflow:hidden}
.errorMsgContentBox{font:16px/1.8 微软雅黑,Arial, Helvetica, sans-serif; color:#444; width:500px; margin-top:106px; text-align:left; padding-left:80px; float:left;}
.error_help{
	margin-top: 10px;
	clear: both;
}
.error_help p{
	font-size:18px;
}
.error_help ul{
	list-style-position: inside;
	list-style-type: circle;
	margin-top: 15px;
}
.error_help li{
	display: inline-block;
	margin-right: 15px;
	width:120px;
	list-style:none;
	 float:left;
}
.error_help li a{
	font-size: 14px;
	text-decoration: none;
	color: #2bc3e1;
	background:url(<?php echo resBu('images/main_sprite.png'); ?>) no-repeat -201px -293px;
	padding-left:15px;
	margin-right:20px;
	font-weight: bold;
}
.errorMsgContentBox h5{
	font-size:28px;
	margin-bottom:15px;/*text-shadow:0 3px 1px rgba(67,97,125,0.6)*/
	line-height: 35px;
	height: 50px;
}
.errorMsgContentBox .msg{color:#223D52; text-shadow:0 1px 0px rgba(225,225,225,0.3);}
.errorMsgContentBox .bottom{ clear:both; margin-top:10px}
.errorMsgContentBox button{ float:none;background-position:0 0; width:130px; margin:10px auto; text-align:center; padding:1px 10px}
.error_num{
	color: #575757;
    float: left;
    font-family:Arial, Helvetica, sans-serif;
    font-size: 34px;
    font-weight: bold;
    margin-left: 132px;
    margin-top: 268px;
    text-align: center;
    width: 240px;
	display:none;
}
</style>
<div class="mainPage" id="mainPage">
  <div class="errorMsgBox">
    <div class="errorMsgContentBox">
        <h5>您的请求无效!</h5>
<!--<h5>Error 404</h5>-->
      <!--<div class="msg"> 无法解析请求 &quot;akfjlda&quot;。 </div>
      <button type="submit">发送错误信息</button>-->
      <div class="error_help">
      <p>您可以尝试以下操作</p>
      <ul>
            			<li><a href="<?php echo app()->homeUrl; ?>">返回首页</a></li>
      			<li><a href="javascript:window.history.back()">回上一页</a></li>
            </ul>
      </div>
    </div>
    <div class="error_num">
    	Error  404    </div>
  </div>
</div></body>
</html>
<?php die();?>