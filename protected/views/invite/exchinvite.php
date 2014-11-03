<h2 id="functionTitle">积分兑换邀请码</h2>
<div id="showArea" class="theShowArea siteMane">
    <div class="node_form" style="margin-left:1.5em">
		<div>
			<p>你当前共有 <span id="total_point"><? echo $total_point ?></span> 积分
			<p>邀请码用途 
			<select id="func_mapping" style="height:auto;">
				<? if(param('func_mapping')) : ?>
					<? foreach(param('func_mapping') as $key => $mapping) : ?>
						<? if(is_array($mapping)) : foreach($mapping as $func => $value) : ?>
							<? if ($value['switch']) : ?>
								<option value="<? echo "$key@$func" ?>" point="<? echo $value['point'] ?>"><? echo $value['title'] ?></option>
							<? endif; ?>
						<? endforeach;endif; ?>
					<? endforeach; ?>
				<? endif; ?>
			</select>
			<p>兑换数量 <input type="text" id="code_count" value="1" />
		</div>
		<p style="margin-top:2px;"><button id="exch_code" class="btn">兑换</button><button id="exch_back" class="btn" style="margin-left:10px;" onclick="javascript:window.location.href='/site/'+site_id+'/#/invite';">返回</button>
    </div>
</div>
<style>
.node_form div p {
	margin-bottom:22px;
	color:#565656;
	font-size:14px;
}
.node_form div p select {
	color:#8D8D8D;
	font-size:14px;
	width:121px;
}
.node_form div p input {
	color:#131313;
	font-size:14px;
	width:46px;
	text-align:center;
}
</style>
