<h2 id="functionTitle">客户端</h2>
<div id="showArea" class="theShowArea siteMane">
	<div class="theTokenBox">
		<div class="theTokenDetail">
			<p>当前启用的Token为：</p>
			<?if (empty($token)): ?>
			<strong id="theToken">您未启用Token或Token已被禁用，请点击下方启用按钮启用新的Token</strong>
			<?else:?>
			<strong id="theToken"><?=$token?></strong>
			<?endif?>
		</div>
		<div class="theTokenTip" id="tokenTip" <?=empty($token)?'style="display:none"':''?> >
			<ul>
				<li>关于API的使用方法, 请参考<strong><a href="#apidocs">API帮助文档</a></strong></li>
				<li>重置或禁用将导致原有token失效，请慎重使用此功能。</li>
			</ul>
		</div>
	</div>

	<div class="theTokenCtrlBox" id="tokenCtrl">
		<input type="button" id="enableToken" class="btn" <?=empty($token)?'':'style="display:none"'?> value="启用" />
		<input type="button" id="updateToken" class="btn" <?=empty($token)?'style="display:none"':''?> value="重置" />
		<input type="button" id="disableToken" class="btn" <?=empty($token)?'style="display:none"':''?> value="禁用" />
	</div>
	<div id="apidocs" style="margin-top:20px;">
		<iframe height="800" frameborder="0" align="middle" width="100%" scrolling="auto" src="/apihelp/index.html" name="win" id="win"></iframe>
	</div>
</div>
<script>
function SetWinHeight(obj){
	var win = obj;
	if (document.getElementById)
	{
		if (win && !window.opera)
		{
			if (win.contentDocument && win.contentDocument.body.offsetHeight) 
				win.height = win.contentDocument.body.offsetHeight + 200;
			else if(win.Document && win.Document.body.scrollHeight)
				win.height = win.Document.body.scrollHeight + 50;
		}
	}
}
$(document).ready(function() {
	if(Clicki.Balance){
        Clicki.Balance();
    }
});

</script>
