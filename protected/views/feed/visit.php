<?if (empty($items)):?>
<div class="theGeneralNoData">暂无数据</div>
<?else:?>
<table style="width:100%;" class="currentOnline">
	<tbody class="gridContentBody">
	<?php foreach ($items as $id => $item): ?>
	<?php $trclass = $id % 2 == 0 ? 'even' : 'odd' ?>
	<?php $session = $item['x_axis'] ?>
	<?php $flows = $item['flows'] ?>
		<tr class="<?=$trclass?> first">
			<td width="2%"><div style="width:68px;">
			<!--	<span class="hint">上站:</span> -->
				<?=strftime("%m-%d %H:%M", $session['endtime'])?>
			</div></td>
			<td width="5%"><div style="width:72px;">
			<!--	<span class="hint">地区:</span> -->
				<img src="/resources/images/icons/geo/<?=$session['country_icon']?>.png" alt=""/>
				<?=$session['country_name'] . $session['region_name']?>
			</div></td>
			<td width="5%"><div style="width:90px;">
				<?=$session['ip']?>
			</div></td>
			<td width="5%"><div style="width:85px;" class="visitedNum">
				第<?=$session['reviews']?>次访问
				<? if ($session['reviews'] == 1):?>
					<span class="new"></span>
				<? endif ?>
			</div></td>
			<td width="100px" style="padding:10px 0;">
				<div style="width:175px;">
				<img src="/resources/images/icons/os/<?=$session['os_icon']?>.png" alt=""/>
				<?=$session['os_type_name']?>
				<img src="/resources/images/icons/browser/<?=$session['browser_icon']?>.png" alt=""/>
				<?=$session['browser_type_name']?>
				</div>
			</td>
			<td  width="30%"><div style="position:relative;padding:10px 0;">
				<a href="javascript:void(0)" onclick="changeEngine(<?=$id?>);"> <span class="show"  id="showtype_<?=$id?>" ></span> </a>
			</div> </td>
		
		</tr>
		<tr class="<?=$trclass?>">
			<td colspan="3">
			<span class="hint">来源:</span>
			<div>
			<? switch ($session['source0_name']) :
				case 0: ?>
					直接输入网址或书签
					<? break; ?>
				<? case 2: ?>
					在<strong><a href="<?=$session['referer_url']?>" target="_blank"><?=$session['se_name']?></a></strong>搜索
					<a href="<?=$session['referer_url']?>" target="_blank">
						<strong><?=mb_strimwidth($session['keyword'], 0, 40, '...');?></strong>
					</a>
					<? break; ?>
				<? case 1: case 3: case 4: ?>
				<? default: ?>
					<a href="<?= $session['referer_url']?>" target="_blank"><?=mb_strimwidth($session['referer_url'], 0, 40, '...');?></a>
					<? break; ?>
			<? endswitch ?></div>	
			</td>
			<td colspan="3">
			<span class="hint">当前停留：</span>
			<div>
			<a href="<?=$session['exit_url_name']?>" title="<?=$session['exit_url_name']?>" target="_blank"><?=mb_strimwidth(Utils::convertToUTF8(urldecode($session['exit_url_title'])), 0, 60, '...');?></a></div>
			</td>
			
		</tr>
		<tr class="subIsShow <?=$trclass?>" id="showline_<?=$id?>" style="display:none;">
			<td colspan="6" class="firstChild">
				<div class="subDiv" style="height:100%">
					<table>
						<tbody>
							<tr>
								<td>停留: <?=Utils::RenderTime($session['endtime'] - $session['begintime']);?></td>
								<td>进站时间: <?=strftime("%m-%d %H:%M", $session['begintime'])?></td>
								<td>访问深度: <?=count($flows)?></td>
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
							<? if (!empty($flows)): ?>
							<? foreach ($flows as $flow): ?>
							<?$staytime = $flow['over'] == 1 ? $flow['endtime'] - $flow['begintime'] : time() - $flow['begintime']?>
								<tr>
									<td><?=strftime("%m-%d %H:%M", $flow['begintime'])?> (<?=$flow['over'] == 1 ? '离线' : '在线'?>) </td>
									<td><?=Utils::RenderTime($staytime);?></td>
									<td><a href="<?=$flow['page_url_name']?>" title="<?=$flow['page_url_name']?>"><?=mb_strimwidth($flow['page_url_title'], 0, 40, "...");?></a></td>
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
<script>
var ___total = <?=$total?>;
</script>
