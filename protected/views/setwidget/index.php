<h2 id="functionTitle">插件管理</h2>
    <div id="showArea" class="theShowArea siteMane">
        <div class="G-tabBox">
			<ul class="tabBnt" id="tabBar">
				<li class="act"><a href="javascript:void(0);" id="tabWidget" title="Widget设置">插件设置</a> </li>
            </ul>
			<div class="tabBox fixedWidgetManageLayout">

				<div class="G-tableSet processTable thePhotosManage">
					<div class="theTableBox">
						 <table class="widgetTable">
							<thead>
								<tr>
									<th>名称</th>
									<th class="theImg">缩略图</th>
									<th class="widgetType">类型</th>
									<th>设置</th>
									<th class="ctrlCol" style="width:200px;">操作</th>
								</tr>
							 </thead>
							 <tbody id="theListBody" class="theList">
								<?php if ($widget_group) : foreach ($widget_group as $group) : ?>
								<?php $type = $group->type; ?>
								<?php $status = $group->status; ?>

								<?php $width = isset($group->setting['width']) ? $group->setting['width'] : 0; ?>
								<?php $height = isset($group->setting['height']) ? $group->setting['height'] : 0; ?>
								<?php $background = isset($group->setting['background']) ? $group->setting['background'] : '#ff0000'; ?>
								<?php $color = isset($group->setting['color']) ? $group->setting['color'] : '#ff0000'; ?>
								<?php $position = isset($group->setting['position']) ? $group->setting['position'] : 'br'; ?>
								<?php $cn_widget = param('widget'); ?>

								<?php $setinfo = $type ? "尺寸: " . $width . " X " . $height : "位置: " . $cn_widget['position'][$position]; ?>
								<tr id="<?php echo $type ? 'fixed' : 'float' ?>_widget_<?php echo $group->id?>">
									<td><?php echo $group->title ?></td>
									<td><img src="<?php echo resBu('images/thumbnail/big_widget/def_widget.gif') ?>" /></td>
									<td><?php echo $type ? '固定' : '浮动' ?></td>
									<td gcolor="<?php echo isset($background) ? $background : ''; ?>" tgcolor="<?php echo isset($color) ? $color : ''; ?>"><?php echo $setinfo ?></td>
									<td>
										<input type="button" class="btn fixedSet" value="设置" wi="<?php echo $type ?>" />
										<input type="button" class="btn getCode" value="获取代码" />
										<input type="button" class="btn disabledThis" isDisabl="<?php echo $status ? 'false' : 'true' ?>" value="启用" />
									</td>
								</tr>
								<?php endforeach; endif;?>
							 </tbody>
						 </table>
					</div>

				</div>



			</div>
        </div>
    </div>
<div class="pageShadow G-none">
<div class="widgetSettingGetCode" id="theWidgetSettingGetCodeBox">
    <p class="popBoxTitle">获取代码<a class="getCodeHelp" href="#" title="我需要帮助">我需要帮助</a></p>
    <div>
        <div style="padding-left:20px;">请将下面的定位代码插入你的网站代码里</div>
        <textarea id="copyCodeText"></textarea>
    </div>
    <div id="copied" style="display:none"></div>
    <span id='clicki_js_clipboard'></span>
    <!--<input class="btn" type="button" value="获取代码" />-->
</div>
</div>
<?
cs()->registerScriptFile(resBu('styles/skin/theme_classic'),  'screen');
?>
<script type="text/javascript">
Clicki.widgetManageList({
    sidEl:$("#siteList"),
    id:"theListBody",
    mark:{
        set:"fixedSet",
        get:"getCode",
        disabl:"disabledThis"
    },
    pop:{
        set:"theWidgetSettingBox",
        get:"theWidgetSettingGetCodeBox"
    },
    urls:{
        /*widge启用/禁用接口*/
        "change":"/setwidget/ajaxstatus",
        /*widget设置接口*/
        "set":"/setwidget/ajaxsetwidget",
        /*跳转接口*/
        "jump":{
            "float":"/setwidget/float",
            "fixed":"/setwidget/fixed"
        }
    }
});
</script>
