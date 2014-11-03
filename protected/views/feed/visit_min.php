<?if (empty($sessions)):?>
<div class="theGeneralNoData">暂无数据</div>
<?else:?>
<table style="width:100%;" class="currentOnline">
	<tbody class="gridContentBody">
	<?php foreach ($sessions as $id => $session): ?>
	<?php $trclass = $id % 2 == 0 ? 'even' : 'odd' ?>
		<tr class="<?=$trclass?> first">
			<td width="2%"><div style="width:48px;">
			<!--	<span class="hint">上站:</span> -->
				<?=strftime("%H:%M:%S", $session['begintime'])?>
			</div></td>
			<td width="5%"><div style="width:84px;">
			<!--	<span class="hint">地区:</span> -->
				<img src="/resources/images/icons/geo/<?=$session['geo_icon']?>.png" alt=""/>
				<?=$session['geo_name']?>
			</div></td>
			<td width="5%"><div style="width:93px;">
				<?=$session['ip']?>
			</div></td>
			<td width="5%"><div style="width:81px;">
				第<?=$session['reviews']?>次访问
				<? if ($session['reviews'] == 1):?>
					<span class="new"></span>
				<? endif ?>
			</div></td>
			<td width="100px" style="padding:10px 0;">
				<div style="width:170px;">
				<img src="/resources/images/icons/os/<?=$session['os_icon']?>.png" alt=""/>
				<?=$session['os_name']?>
				<img src="/resources/images/icons/browser/<?=$session['browser_icon']?>.png" alt=""/>
				<?=$session['browser_name']?>
				</div>
			</td>
			<td  width="30%" style="position:relative;padding:10px 0;"> <div>
				<a href="javascript:void(0)" onclick="changeEngine(<?=$id?>);"> <span class="show"  id="showtype_<?=$id?>" ></span> </a>
			</div> </td>
		
		</tr>
		<tr class="<?=$trclass?>">

			<td colspan="3">
				<span class="hint">来源:</span>
				<div>
				<? switch ($session['referer_type']) :
					case 0: ?>
						直接输入网址或书签
						<? break; ?>
					<? case 2: ?>
						在<?=$session['se_name']?>搜索<?=mb_strimwidth($session['keyword'], 0, 40, '...');?>
						<? break; ?>
					<? case 1: case 3: case 4: ?>
					<? default: ?>
						<a href="<?= $session['referer_url']?>" target="_blank"><?=mb_strimwidth($session['referer_url'], 0, 40, '...');?></a>
						<? break; ?>
				<? endswitch ?>
				</div>
			</td>
			<td colspan="3">

				<span class="hint">当前停留：</span>
				<div>
					<a href="<?=$session['exit']?>" title="<?=$session['exit']?>" target="_blank"><?=mb_strimwidth(Utils::convertToUTF8(urldecode($session['exit_title'])), 0, 60, '...');?></a>
				</div>

			</td>
		</tr>
		<tr class="subIsShow <?=$trclass?>" id="showline_<?=$id?>" style="display:none;">
			<td colspan="6" class="firstChild">
				<div class="subDiv" style="height:100%">
					<table>
						<tbody>
							<tr>

								<td>停留: <?=round(($session['endtime'] - $session['begintime']) / 60, 2)?>分钟</td>
								<td>最后响应: <?=strftime("%H:%M:%S", $session['endtime'])?></td>
								<td>访问深度: <?=$session['depth']?></td>

							</tr>
							<tr>
								<td>网络: <?=$session['isp_name']?></td>
								<td>语言: <?=$session['language_name']?></td>
								<td>分辨率: <?=$session['resolution_width']?> X <?=$session['resolution_height']?></td>

							</tr>
							<tr>
								<td colspan="3">&nbsp;</td>
							</tr>
							<tr>
								<th>开始时间</th>
								<th>停留</th>
								<th>访问页面</th>
							</tr>
							<? if (!empty($session['flows'])): ?>
							<? foreach ($session['flows'] as $flow): ?>
								<tr>
									<td><?=strftime("%H:%M:%S", $flow['begintime'])?></td>
									<td><?=($flow['endtime'] - $flow['begintime'])?>''</td>
									<td><a href="<?=$flow['page_url']?>" title="<?=$flow['page_url']?>"><?=mb_strimwidth($flow['page_title'], 0, 40, "...");?></a></td>
								</tr>
							<? endforeach ?>
							<? endif ?>
						</tbody>
					</table>
				</div>
			</td>
		</tr>
	<? endforeach ?>
	</tbody>
</table>
<?endif?>
