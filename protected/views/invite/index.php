<h2 id="functionTitle">邀请码</h2>
<div id="showArea" class="theShowArea siteMane">
	<div class="G-tableSet">
		<div class="theTableBox grid" style="position: relative; height: 100%; overflow: hidden; width: 100%;">
			<p>
				<input type="button" class="btn" onclick="javascript:window.location.href='/site/'+site_id+'/#/invite/exchinvite'" value="积分兑换邀请码" />
				<input type="button" class="btn" onclick="javascript:window.location.href='/site/'+site_id+'/#/invite/pointrules'" value="积分对照表" />
			</p>
			<table style="width:100%">
				<caption>邀请码列表</caption>
				<thead>
					<tr>
						<th>邀请码</th>
						<th>可获积分</th>
						<th>用途</th>
						<th>状态</th>
						<th>有效期</th>
						<!-- <th>操作</th> -->
					</tr>
				</thead>
				<tbody>
				<? if($invites): foreach($invites as $row): ?>
					<? list($key, $func) = @explode('/', $row['func']); $func_title = app()->params->func_mapping[$key][$func]['title']; ?>
					<? $status = $row['status']; $txt_status = $status ? "已用" : "可用"; if (new DateTime() > new DateTime($row['indate']) && !$status) $txt_status = "失效"; ?>
					<? $use_username = $row->username ? "({$row->username})" : ''; ?>
					<tr>
						<td><? echo $row['code'] ?></td>
						<td><? echo $row['point'] ?></td>
						<td><? echo $func_title ?></td>
						<td><? echo $txt_status . $use_username ?></td>
						<td><? echo $row['indate'] ?></td>
						<!-- <td><? if($row['status'] == 0) : ?><a id="<? echo $row['code'] ?>" class="sendto" href="javascript:void(0);">发送</a><? endif; ?></td> -->
					</tr>
				<? endforeach; ?>
				<? endif ?>
				</tbody>
			</table>
		</div>
    </div>
    <span class="error_message"> <?php //echo CHtml::errorSummary($site);?> </span>
</div>
<div id="send_panel" style="width:200px;height:100px;display:none;">
发送
</div>

