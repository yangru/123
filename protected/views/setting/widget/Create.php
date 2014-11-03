<h2 id="functionTitle">插件管理</h2>
<script>
Clicki.WidgetManager.updateWidgetInfo({
    appId: <?=$app->id?>,
    widgetId:'create',
    setting:null
}, true);
</script>
<div id="showArea" class="theShowArea siteMane">

    <div class="widgetInfoBox">
        <div class="widgetImg">
            <div><img src="/widget/apps/app_<?=$app->id?>/<?=$app->logo?>" style="width:110px;height:110px;" /></div>
        </div>
        <div class="widgetInfo">
            <strong><?=$app->name?></strong>
            <p><?=$app->description?></p>
            <p><label for="theWidgetTitles">应用别名:</label><input type="text" id="theWidgetTitles" placeholder="填写应用的自定义名称" value="" /></p>
        </div>
    </div>

    <div class="widgetPreview">
        <iframe id="widgetSettingFrame" src="/widget/apps/app_<?=$app->id?>/setting.html" width="100%" align="center,center" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" allowtransparency="true"> </iframe>
    </div>
	<div id="clicki_widget_preview"></div>
</div>


<div class="pageShadow G-none">
<div class="widgetSettingGetCode" id="theWidgetSettingGetCodeBox">
    <p class="popBoxTitle">获取代码<a class="getCodeHelp" href="#" title="我需要帮助">我需要帮助</a></p>
    <div>
        <div style="padding-left:20px;">Widget创建成功，请将下面的定位代码插入你的网站代码里</div>
        <textarea id="copyCodeText"></textarea>
    </div>
    <div id="copied" style="display:none"></div>
    <span id='clicki_js_clipboard'></span>
    <!--<input class="btn" type="button" value="获取代码" />-->
</div>
</div>
