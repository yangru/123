<h2 id="functionTitle">积分对照表</h2>
<div id="showArea" class="theShowArea siteMane">
	<div class="G-tableSet">
		<div class="theTableBox grid" style="position: relative; height: 100%; overflow: hidden; width: 100%;">
			<p>
				<input type="button" class="btn" onclick="javascript:window.location.href='/site/'+site_id+'/#/invite/exchinvite'" value="积分兑换邀请码" />
				<input type="button" class="btn" onclick="javascript:window.location.href='/site/'+site_id+'/#/invite/pointrules'" value="积分对照表" />
			</p>
			<table style="width:100%">
				<caption>积分对照表</caption>
				<thead>
					<tr>
						<th>积分途径</th>
						<th>周期范围</th>
						<th>周期内最多奖励次数</th>
						<th>积分</th>
						<th>备注</th>
						<!-- <th>操作</th> -->
					</tr>
				</thead>
				<tbody>
				<? if($rules): foreach($rules as $rule): ?>
					<?php $point_str = $rule['point'] > 0 ? "<font color='green'>+{$rule['point']}</font>" : "<font color='red'>{$rule['point']}</font>"; ?>
					<?php $point_str = $rule['point'] == 0 ? "<font color='red'>时价</font>" : $point_str; ?>
					<tr>
						<td><? echo $rule['title'] ?></td>
						<td><? echo $rule['cycle'] ?></td>
						<td><? echo $rule['in_cycle_count'] == 0 ? "不限次数" : $rule['in_cycle_count'] ?></td>
						<td><? echo $point_str ?></td>
						<td><? echo $rule['description'] ?></td>
					</tr>
				<? endforeach; ?>
				<? endif ?>
				</tbody>
			</table>
		</div>
    </div>
</div>
<style>
.theTableBox table td {
	padding:15px 24px 22px;
	line-height:25px;
}
</style>

