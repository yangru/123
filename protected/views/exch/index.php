<div class="G-tabBox usePoint">
    
	<ul class="tabBnt">
		<li id="use_point_<? echo $func_info['name'] ?>" class="act"><a href="javascript:void(0);" title="积分兑换">积分兑换</a></li>
		<li id="use_code_<? echo $func_info['name'] ?>"><a href="javascript:void(0);" title="邀请码兑换">邀请码兑换</a></li>
	</ul>
	<?php $sur = $user_point - $func_info['point']; ?>
	<div class="tabBox">
		<div id="point_panel_<? echo $func_info['name'] ?>" style="text-align:center;">
			<p>兑换此功能所需积分：<strong><? echo $func_info['point'] ?></strong></p>
			<p>兑换使用至：<strong><? echo date('Y-m-d H:i', strtotime($func_info['indate'])) ?></strong></p>
			<div id="func_mapping" mapping="<? echo $func_info['func_str'] ?>">你当前的积分：<em><? echo $user_point ?></em>，兑换后剩余积分：<em><? echo $sur ?></em></div>
			<p><span id="error_msg" style="display:none;color:red;"></span></p>
			<p><input type="button" class="btn" id="exch_func" value="兑换" <?php if ($sur < 0) : ?> disabled="disabled" <?php endif; ?> /></p>
		</div>
		<div id="code_panel_<? echo $func_info['name'] ?>" style="display:none;text-align:center;">
			<p><label for="invite_code">请输入邀请码</label><input type="text" id="invite_code" /></p>
			<p><span id="error_msg" style="display:none;color:red;"></span></p>
			<p><input type="button" class="btn" id="submit_code" value="兑换" /></p>
		</div>
		<span class="error_message"> <?php //echo CHtml::errorSummary($site);?> </span>
	</div>
</div>
<script type="text/javascript">
(function(){
    
	var suffix = '<? echo $func_info["name"] ?>';
	$('#point_panel_' +suffix+ ' #exch_func').click(function(){
		var error_msg = $('#point_panel_' +suffix+ ' #error_msg');
		error_msg.html('');
		var func_mapping = $('#point_panel_' +suffix+ ' #func_mapping').attr('mapping');
		if (!func_mapping){
			error_msg.html('非法请求!').show();
			return;
		}
		if (confirm("确定使用积分兑换吗?")) {
			$.ajax({
				url:"/exch/func",
				data:{mapping:func_mapping},
				dataType:"json",
				type:"GET",
				success:function(data){
					if (data.error == "+OK"){
						window.location.reload();
						//var router = func_mapping.replace("@","/");
						//Clicki.Router.navigate("#/"+router,true);
					} else {
						error_msg.html(data.error).show();
					}
				},
				error:function(err){
					error_msg.html("服务器正忙,请稍后再试!").show();
				}
			});
		}
	});
	$('#use_point_'+suffix).click(function(){
		$(this).addClass('act');
		$('#use_code_'+suffix).removeClass('act');
		$('#code_panel_'+suffix).hide();
		$('#point_panel_'+suffix).show();
	});
	$('#use_code_'+suffix).click(function(){
		$(this).addClass('act');
		$('#use_point_'+suffix).removeClass('act');
		$('#point_panel_'+suffix).hide();
		$('#code_panel_'+suffix).show();
	});
	$('#code_panel_' +suffix+ ' #submit_code').click(function(){
		var error_msg = $('#code_panel_' +suffix+ ' #error_msg');
		error_msg.html('');
		var code = $('#code_panel_' +suffix+ ' #invite_code').val();
		var func_mapping = $('#point_panel_' +suffix+ ' #func_mapping').attr('mapping');
		if (!code || !func_mapping){
			error_msg.html("请输入邀请码").show();
			return;
		}
		$.ajax({
			url:"/exch/func",
			data:{mapping:func_mapping, code:code},
			dataType:"json",
			type:"GET",
			success:function(data){
				if (data.error == "+OK"){
					window.location.reload();
					//var router = func_mapping.replace("@","/");
					//Clicki.Router.navigate("#/"+router,true);
				} else {
					error_msg.html(data.error).show();
				}
			},
			error:function(err){
				error_msg.html("服务器正忙,请稍后再试!").show();
			}
		});
	});
})();
</script>
