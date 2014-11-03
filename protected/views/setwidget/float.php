<h2 id="functionTitle">插件管理</h2>
<div id="showArea" class="theShowArea siteMane">
	<div class="G-tabBox">
		<ul class="tabBnt" id="tabBar">
			<li class="act"><a href="javascript:void(0);" id="tabWidget" title="浮动Widget">浮动插件</a> </li>
		</ul>
		<div class="tabBox floatWidgetManageLayout">

			<div class="floatWidgetManage">

				<div class="G-pieceBox G-left" id="theLeftWidgthSmall">
					<div class="boxTitle">请选择插件小标签</div>
					<div class="boxContent">
						<ul class="theSmallWidget">
							<?php $skin = $group_info->setting['skin']; $skin = $skin ? $skin : 'white'; $checked = "checked=checked"; ?>
							<li><label for="white_1"><img src="/resources/images/blank.gif" class="theClassWhite" alt="Clicki 经典白" /><input type="radio" value="white_1" id="white_1" name="smallWidget" <?php echo $skin == 'white' ? $checked : '' ?> /></label></li>
							<li><label for="black_2"><img src="/resources/images/blank.gif" class="theClassBlack" alt="Clicki 经典黑" /><input type="radio" value="black_2" id="black_2" name="smallWidget" <?php echo $skin == 'black' ? $checked : '' ?> /></label></li>
							<li><label for="darkblue_3"><img src="/resources/images/blank.gif" class="theClassDarkblue" alt="Clicki 经典深蓝" /><input type="radio" value="darkblue_3" id="darkblue_3" name="smallWidget" <?php echo $skin == 'darkblue' ? $checked : '' ?> /></label></li>
							<li><label for="darkgreen_4"><img src="/resources/images/blank.gif" class="theClassDarkgreen" alt="Clicki 经典绿" /><input type="radio" value="darkgreen_4" id="darkgreen_4" name="smallWidget" <?php echo $skin == 'darkgreen' ? $checked : '' ?> /></label></li>
							<li><label for="lightblue_5"><img src="/resources/images/blank.gif" class="theClassLightblue" alt="Clicki 经典浅蓝" /><input type="radio" value="lightblue_5" id="lightblue_5" name="smallWidget" <?php echo $skin == 'lightblue' ? $checked : '' ?> /></label></li>
							<li><label for="lightred_6"><img src="/resources/images/blank.gif" class="theClassLightred" alt="Clicki 经典粉红" /><input type="radio" value="lightred_6" id="lightred_6" name="smallWidget" <?php echo $skin == 'lightred' ? $checked : '' ?> /></label></li>
							<li><label for="lightyellow_7"><img src="/resources/images/blank.gif" class="theClassLightyellow" alt="Clicki 经典黄" /><input type="radio" value="lightyellow_7" id="lightyellow_7" name="smallWidget" <?php echo $skin == 'lightyellow' ? $checked : '' ?> /></label></li>
							<li><label for="orange_8"><img src="/resources/images/blank.gif" class="theClassOrange" alt="Clicki 经典橙" /><input type="radio" value="orange_8" id="orange_8" name="smallWidget" <?php echo $skin == 'orange' ? $checked : '' ?> /></label></li>
							<li><label for="red_9"><img src="/resources/images/blank.gif" class="theClassRed" alt="Clicki 经典红" /><input type="radio" value="red_9" id="red_9" name="smallWidget" <?php echo $skin == 'red' ? $checked : '' ?> /></label></li>
							<li><label for="brown_10"><img src="/resources/images/blank.gif" class="theClassBrown" alt="Clicki 经典棕" /><input type="radio" value="brown_10" id="brown_10" name="smallWidget" <?php echo $skin == 'brown' ? $checked : '' ?> /></label></li>
							<li><label for="coffee_11"><img src="/resources/images/blank.gif" class="theClassCoffee" alt="Clicki 经典咖啡" /><input type="radio" value="coffee_11" id="coffee_11" name="smallWidget" <?php echo $skin == 'coffee' ? $checked : '' ?> /></label></li>
							<li><label for="gray_12"><img src="/resources/images/blank.gif" class="theClassGray" alt="Clicki 经典灰" /><input type="radio" value="gray_12" id="gray_12" name="smallWidget" <?php echo $skin == 'gray' ? $checked : '' ?> /></label></li>
						</ul>
					</div>
				</div>

				<div class="G-pieceBox G-left" id="theRightWidgetPosition">
					<div class="boxTitle">请选择插件浮动位置</div>
					<div class="boxContent">
						<div class="selectWidgetPositionBox">
							<div class="selectWidgetPosition" id="selectPosition">
								<? $position = $group_info->setting['position'];$position = $position ? $position : 'br'; ?>
								<span class="pos_lt"><input type="radio" name="widgetPosition" <?php echo $position == 'lt' ? $checked : '' ?> /></span>
								<span class="pos_lm"><input type="radio" name="widgetPosition" <?php echo $position == 'lm' ? $checked : '' ?> /></span>
								<span class="pos_lb"><input type="radio" name="widgetPosition" <?php echo $position == 'lb' ? $checked : '' ?> /></span>
								<span class="pos_bl"><input type="radio" name="widgetPosition" <?php echo $position == 'bl' ? $checked : '' ?> /></span>
								<span class="pos_bm"><input type="radio" name="widgetPosition" <?php echo $position == 'bm' ? $checked : '' ?> /></span>
								<span class="pos_br"><input type="radio" name="widgetPosition" <?php echo $position == 'br' ? $checked : '' ?> /></span>
								<span class="pos_rt"><input type="radio" name="widgetPosition" <?php echo $position == 'rt' ? $checked : '' ?> /></span>
								<span class="pos_rm"><input type="radio" name="widgetPosition" <?php echo $position == 'rm' ? $checked : '' ?> /></span>
								<span class="pos_rb"><input type="radio" name="widgetPosition" <?php echo $position == 'rb' ? $checked : '' ?> /></span>

							</div>

						</div>
					</div>
				</div>

			</div>
			<!--
			<div class="floatWidgetManage">

				<div class="G-pieceBox G-left" id="theLeftWidgetTypeSelect">
					<div class="boxTitle">请选择Widget类型</div>
					<div class="boxContent selectWidgetBox">

						<ul class="selectWidget toBe" id="toBeSelect">
							<? if (isset($apps)): foreach ($apps as $app): ?>
							<? $selected = $group_info->setting['selected']; ?>
							<li id="float_widget_<?=$app['id'] ?>">
								<? echo $app['title'] ?>
								<img src="/resources/images/thumbnail/big_widget/def_widget.gif" alt="" />
								<input type="button" class="<?php echo in_array($app['id'], $selected) ? 'thisSelected' : 'selectThis' ?>" value="选择" />
							</li>
							<? endforeach;endif; ?>
						</ul>

					</div>
				</div>

				<div class="G-pieceBox G-left" id="theRightWidgetAlready">
					<div class="boxTitle">已选择Widget类型</div>
					<div class="boxContent selectWidgetBox">
						<ul class="selectWidget" id="alreadySelected">
						</ul>
					</div>
				</div>

			</div>
			-->
			<p class="widgetSettingCtrl">
				<input class="G-gotoBnt" id="theSettingSubmit" type="button" value="完成" />
			</p>
		</div>
    </div>
</div>
<script>
$(function(){
    Clicki.widgetManage({
        type:"float",
        load:{
            positionSelect:{
                id:"selectPosition"
            },
            typeSelect:{
                id:"theLeftWidgthSmall"
            },
            widgetSelect:{
                ids:{
                    tobe:"toBeSelect",
                    already:"alreadySelected"
                },
                settingId:"theWidgetSettingBox",
                selectedCls:"thisSelected",
                noSelectCls:"selectThis",
                cancelCls:"cancelThis"
            }
        },
        urls:"/setwidget/ajaxsetwidget",
        sidEl:$("#siteList"),
        submitBnt:$("#theSettingSubmit"),
        balance:{"tagArr":[["#theLeftWidgthSmall","#theRightWidgetPosition"],["#theLeftWidgetTypeSelect","#theRightWidgetAlready"]]}
    });

});
</script>
<?php
cs()->registerScriptFile(resBu('styles/skin/theme_classic'),  'screen');
?>
