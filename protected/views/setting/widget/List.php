<h2 id="functionTitle">插件管理</h2>
<div id="showArea" class="theShowArea siteMane">
        <div class="G-tabBox">
			<ul class="tabBnt" id="tabBar">
				<li class="act"><a href="javascript:void(0);" id="tabWidget" title="Widget设置">我的插件</a> </li>
            </ul>
            <div class="tabBox">
                <div class="innerTabBox" style="padding:1em 0.1em;">
                    <div class="G-tableSet processTable thePhotosManage widgetList">
                        <ul id="theListBody" class="clearfix">
                            <? $i=0; foreach ($widgets as $widget): ?>
                            <? if ($widget->apps == NULL) continue; ?>
                            <li id="widget_list_<?=$widget->id?>" <?php echo ($i%2 === 0)?"class='noMargin'":""; ?>>
                                <a href="#/setting/widget/detail/<?=$widget->id?>" class="appLogo"><img src="/widget/apps/app_<?=$widget->app_id?>/<?=$widget->apps->logo?>" width="110px" height="110px" /></a>
                                <div class="appInfo">
                                    <h5><?=$widget->title?></h5>
                                    <div class="des"><b><?=$widget->apps->name?></b>: <?=$widget->apps->description?></div>
                                    <div class="btns">
                                        <input type="button" class="btn fixedSet" value="设置" wi="0">
                                        <input type="button" class="btn getCode" value="获取代码">
                                        <input type="button" class="btn disabledThis" isdisabl="<?= $widget->status == 0 ? "true" : "false" ?>" value="禁用">
                                        <input type="button" class="btn deleteThis" value="删除">
                                    </div>
                                </div>
                            </li>
                            <? $i++; endforeach ?>
                        </ul>
                    </div>

                    <div class="widgetRecommBox">
                        <div class="recommTitle">
                            <h3>推荐Widget</h3>
                            <a href="#" class="theMore" title="查看更多">查看更多&gt;&gt;</a>
                        </div>
                        <div class="recommBox widgetList">
                            <ul id="theRecommWidget" class="clearfix">
                                <?php $i=0; foreach ($apps as $app): ?>
                                <li <?php echo ($i%2 === 0)?"class='noMargin'":""; ?>>
                                    
                                    <a href="#/setting/widget/create?appid=<?=$app->id?>" class="appLogo"><img src="/widget/apps/app_<?=$app->id?>/<?=$app->logo?>" width="110px" height="110px" /></a>
                                    <div class="appInfo">
                                        <h5><a href="#/setting/widget/create?appid=<?=$app->id?>"><?=$app->name?></a></h5>
                                        <div class="des" title="<?=$app->description?>"><?=$app->description?></div>
                                        <div class="btns">
                                            <input value="" id="theWidget_<?=$app->id?>" type="button" />
                                        </div>
                                    </div>
                                </li>
                                <?php $i++; endforeach?>
                            </ul>
                        </div>
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




