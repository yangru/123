<?php
$cfg = array(
	'display' => array(
		'reviewslot' => array(
			'x_axis' => 'reviewslot_name',
			'y_axis' => 'sessions',
			'more' => '#/statistic/loyalty',
			'cols' => array('1次', '2次', '3次', '4次', '5 ~ 10次', '11 ~ 20次', '21 ~ 50次', '50次以上'),
		),
		'depth' => array(
			'x_axis' => 'depth_name',
			'y_axis' => 'sessions',
			'more' => '#/statistic/loyalty',
			'cols' => array('1页', '2页', '3页', '4页', '5 ~ 10页', '11 ~ 20页', '21 ~ 50页', '50页以上'),
		),
		'stayslot' => array(
			'x_axis' => 'stayslot_name',
			'y_axis' => 'sessions',
			'more' => '#/statistic/loyalty',
			'cols' => array('0 ~ 10秒', '10 ~ 30秒', '30 ~ 60秒', '1 ~ 5分钟', '5 ~ 10分钟', '10 ~ 30分钟', '30 ~ 60分钟', '1小时以上'),
		),
		'geo' => array(
			'x_axis' => 'region_name',
			'y_axis' => 'sessions',
			'more' => '#/statistic/geo',
		),
		'browser_type' => array(
			'x_axis' => 'browser_type_name',
			'y_axis' => 'sessions',
			'more' => '#/statistic/client',
		),
		'os_type' => array(
			'x_axis' => 'os_type_name',
			'y_axis' => 'sessions',
			'more' => '#/statistic/client',
		),
		'referer_type' => array(
			'x_axis' => 'source0_name',
			'y_axis' => 'sessions',
			'more' => '#/statistic/referer_sort',
		),
		'referer_url' => array(
			'x_axis' => 'referer_url_name',
			'y_axis' => 'sessions',
			'more' => '#/statistic/referer_name',
		),
		'referer_domain' => array(
			'x_axis' => 'referer_domain_name',
			'y_axis' => 'sessions',
			'more' => '#/statistic/referer',
		),
		'se' => array(
			'x_axis' => 'se_name',
			'y_axis' => 'sessions',
			'more' => '#/statistic/se',
		),
		'keyword' => array(
			'x_axis' => 'keyword_name',
			'y_axis' => 'sessions',
			'more' => '#/statistic/keyword',
		),
		'page_url' => array(
			'x_axis' => 'page_url_name',
			'y_axis' => 'pageviews',
			'more' => '#/statistic/page',
		),
		'page_domain' => array(
			'x_axis' => 'page_domain_name',
			'y_axis' => 'pageviews',
			'more' => '#/statistic/page',
		),
	),
);
?>
<div class="theReplacBox">
	<?if (empty($items)):?>
	<div class="theGeneralNoData needTrans">暂无数据</div>
	<?else:?>
	<table>
	<?if (!empty($cfg['display'][$type]['cols'])): ?>
		<?foreach ($cfg['display'][$type]['cols'] as $col): ?>
			<?
			$match = false;
			foreach ($items as $item) {
				if ($item['x_axis'][$cfg['display'][$type]['x_axis']] === $col) {
					$match = true;
					break;
				}
			}
			if ($match === false) {
				$item = array(
					'x_axis' => array(
						$cfg['display'][$type]['x_axis'] => $col,
					),
					'y_axis' => array(
						$cfg['display'][$type]['y_axis'] => 0,
					),
				);
			}
			?>
			<tr>
				<th>
					<!--翻译-----访问次数，访问深度，停留时间的表格-->
					<div class="needTrans"><?=$item['x_axis'][$cfg['display'][$type]['x_axis']]?></div>
				</th>
				<td>
					<?=$item['y_axis'][$cfg['display'][$type]['y_axis']]?>
				</td>
				<td>
					<div class="minChartH">
						<span><?=intval($item['y_axis'][$cfg['display'][$type]['y_axis']] * 100 / $amount['y_axis'][$cfg['display'][$type]['y_axis']])?>%</span>
						<em style="width: <?=intval($item['y_axis'][$cfg['display'][$type]['y_axis']] * 100 / $amount['y_axis'][$cfg['display'][$type]['y_axis']])?>%;"></em>
					</div>
				</td>
			</tr>
		<?endforeach?>
	<?else:?>
		<?foreach ($items as $item): ?>
			<tr>
				<th>
					<!--翻译-----来源地区的表格-->
					<div class="needTrans"><?=$item['x_axis'][$cfg['display'][$type]['x_axis']]?></div>
				</th>
				<td>
					<?=$item['y_axis'][$cfg['display'][$type]['y_axis']]?>
				</td>
				<td>
					<div class="minChartH">
						<span><?=intval($item['y_axis'][$cfg['display'][$type]['y_axis']] * 100 / $amount['y_axis'][$cfg['display'][$type]['y_axis']])?>%</span>
						<em style="width: <?=intval($item['y_axis'][$cfg['display'][$type]['y_axis']] * 100 / $amount['y_axis'][$cfg['display'][$type]['y_axis']])?>%;"></em>
					</div>
				</td>
			</tr>
		<?endforeach?>
	<?endif?>
	</table>
	<?endif?>
</div>
<p class="theGeneralMore"><?if ($total > 10): ?><em data-do="prev" class="needTrans">上一页</em><em data-do="next" class="needTrans">下一页</em><?endif ?><a class="needTrans" href="<?=$cfg['display'][$type]['more']?>" title="查看更多">查看更多</a></p>
<script type="text/javascript">
//页面语言转换
pageTextTranslate(".needTrans");
</script>
