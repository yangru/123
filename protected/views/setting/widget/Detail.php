<h2 id="functionTitle">插件管理22</h2>
<script>
	Clicki.WidgetManager.updateWidgetInfo({
		appId: <?=$widget->app_id?>,
		widgetId: <?=$widget->id?>,
		setting: <?=$widget->setting?>
	}, true);
</script>
<div id="showArea" class="theShowArea siteMane">

    <div class="widgetInfoBox">
        <div class="widgetImg">
            <div><img src="/widget/apps/app_<?=$widget->app_id?>/<?=$widget->apps->logo?>" style="width:110px;height:110px;" /></div>
        </div>
        <div class="widgetInfo">
            <strong><?=$widget->apps->name?></strong>
            <strong class="title"><?=$widget->title?></strong>
            <p><?=$widget->apps->description?></p>
        </div>
    </div>

    <div class="widgetPreview">
        <div class="theWidgetSettingBoxTitle">个性化设定</div>
        <p class="setWidgetTitles"><label for="theWidgetTitles">应用别名:</label><input type="text" id="theWidgetTitles" placeholder="填写应用的自定义名称" value="<?=$widget->title?>" /></p>
        <iframe id="widgetSettingFrame" src="/widget/apps/app_<?=$widget->app_id?>/setting.html?wid=<?=$widget->id?>" width="100%" align="center,center" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" allowtransparency="true"> </iframe>
    </div>
	<div id="clicki_widget_preview"></div>
</div>

