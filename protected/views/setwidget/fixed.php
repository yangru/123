<h2 id="functionTitle">插件管理</h2>
<div id="showArea" class="theShowArea siteMane">
	<div class="G-tabBox">
		<ul class="tabBnt" id="tabBar">
			<li class="act"><a href="javascript:void(0);" id="tabWidget" title="固定Widget">固定插件</a> </li>
		</ul>
		<div class="tabBox floatWidgetManageLayout nowIsFixed" id="theWidgetSettingBox">
            <div class="G-pieceBox G-left">
                <div class="boxTitle">个性化设定</div>
                <div class="boxContent">
                    <div class="widgetSettingBox" id="theLeftCtrler">
                        名称：
                        <div>
                            <input class="G-textInput" type="text" value="<?=$group_info->title ?>" />
                        </div>
                        颜色：
                        <div>
							<? $skin = isset($group_info->setting['skin']) ? $group_info->setting['skin'] : 'white'; ?>
							<? $isSelected = "isSelected='true'"; ?>
                            <img src="/resources/images/swatch_3d_32.png" <? echo $skin == 'white' ? $isSelected : ''; ?> class="white" alt="" />
                            <img src="/resources/images/swatch_3d_32.png" <? echo $skin == 'black' ? $isSelected : ''; ?> class="black" alt="" />
                            <img src="/resources/images/swatch_3d_32.png" <? echo $skin == 'darkblue' ? $isSelected : ''; ?> class="darkblue" alt="" />
                            <img src="/resources/images/swatch_3d_32.png" <? echo $skin == 'darkgreen' ? $isSelected : ''; ?> class="darkgreen" alt="" />
                            <img src="/resources/images/swatch_3d_32.png" <? echo $skin == 'lightblue' ? $isSelected : ''; ?> class="lightblue" alt="" />
                            <img src="/resources/images/swatch_3d_32.png" <? echo $skin == 'lightred' ? $isSelected : ''; ?> class="lightred" alt="" />
                            <img src="/resources/images/swatch_3d_32.png" <? echo $skin == 'lightyellow' ? $isSelected : ''; ?> class="lightyellow" alt="" />
                            <img src="/resources/images/swatch_3d_32.png" <? echo $skin == 'orange' ? $isSelected : ''; ?> class="orange" alt="" />
                            <img src="/resources/images/swatch_3d_32.png" <? echo $skin == 'red' ? $isSelected : ''; ?> class="red" alt="" />
                            <img src="/resources/images/swatch_3d_32.png" <? echo $skin == 'brown' ? $isSelected : ''; ?> class="brown" alt="" />
                            <img src="/resources/images/swatch_3d_32.png" <? echo $skin == 'gray' ? $isSelected : ''; ?> class="gray" alt="" />
                            <img src="/resources/images/swatch_3d_32.png" <? echo $skin == 'coffee' ? $isSelected : ''; ?> class="coffee" alt="" />
                        </div>
                        <? $width = isset($group_info->setting['width']) ? $group_info->setting['width'] : ''; ?>
                        <? $height = isset($group_info->setting['height']) ? $group_info->setting['height'] : ''; ?>
                        宽度：
                        <div class="theWidgetSetting">
                            <div><em></em></div><input type="text" class="G-textInput" value="<?=$width ?>" />px
                        </div>
                        高度：
                        <div class="theWidgetSetting">
                            <div><em></em></div><input type="text" class="G-textInput" value="<?=$height ?>" />px
                        </div>
                        <div class="settingSubmitBar">
                            <input class="btn" type="button" value="保存" />
                            <input class="btn" type="button" value="取消" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="G-pieceBox G-left">
                <div class="boxTitle">效果演示</div>
                <div class="boxContent">
					<? $bgcolor = isset($group_info->setting['background']) ? $group_info->setting['background'] : ''; ?>
                    <div id="theRightShower" class="theFixedShowerBox" style="background-color:<?=$bgcolor ?>">
                        <!--演示-->
                        <div class="tmpFrame">
                                <table cellspacing="0" cellpadding="2" width="100%" style="border-spacing: 0pt;">
                                    <tbody>
                                        <tr class="th">
                                            <td>
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>
                                                <table cellspacing="0" border="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <th>
                                                                <img align="absmiddle" title="中国 " alt="中国 " src="http://www.clicki.cn/resources/images/icons/geo/cn.png"><img align="absmiddle" title="windows XP" alt="windows XP" src="http://www.clicki.cn/resources/images/icons/os/windows.png"><img align="absmiddle" title="chrome 13.0.782.107" alt="chrome 13.0.782.107" src="http://www.clicki.cn/resources/images/icons/browser/chrome.png"><a title="点击查询IP信息" href="http://ip.clicki.cc/ip/113.240.171.141" target="_blank">中国 </a>
                                                            </th>
                                                            <th width="30%" style="text-align: right; background: none repeat scroll 0% 0% transparent; line-height: 120%;">
                                                                9 分钟 前
                                                            </th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <p style="line-height: 14px; cursor: default;">
                                                    从 <a target="_blank" title="www.emlog.net" href="http://www.emlog.net/widgets/">www.emlog.net</a>
                                                    <br>
                                                    访问了 <a target="_blank" title="专业用户行为统计系统 - Clicki" href="http://www.clicki.cn/">专业用户行为统计系统 - Clicki</a>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>
                                                <table cellspacing="0" border="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <th>
                                                                <img align="absmiddle" title="韩国 Seoul" alt="韩国 Seoul" src="http://www.clicki.cn/resources/images/icons/geo/kr.png"><img align="absmiddle" title="windows XP" alt="windows XP" src="http://www.clicki.cn/resources/images/icons/os/windows.png"><img align="absmiddle" title="ie 6.0" alt="ie 6.0" src="http://www.clicki.cn/resources/images/icons/browser/ie.png"><a title="点击查询IP信息" href="http://ip.clicki.cc/ip/218.38.77.104" target="_blank">韩国 Seoul Seoul</a>
                                                            </th>
                                                            <th width="30%" style="text-align: right; background: none repeat scroll 0% 0% transparent; line-height: 120%;">
                                                                21 分钟 前
                                                            </th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <p style="line-height: 14px; cursor: default;">
                                                    直接 访问了 <a target="_blank" title="强烈要求更换老样式 « Clicki -- 官方论坛" href="http://www.clicki.cn/forums/topic.php?id=900">强烈要求更换老样式 « Clicki -- 官方论坛</a>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>
                                                <table cellspacing="0" border="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <th>
                                                                <img align="absmiddle" title="中国 四川" alt="中国 四川" src="http://www.clicki.cn/resources/images/icons/geo/cn.png"><img align="absmiddle" title="windows 7" alt="windows 7" src="http://www.clicki.cn/resources/images/icons/os/windows.png"><img align="absmiddle" title="ie 7.0" alt="ie 7.0" src="http://www.clicki.cn/resources/images/icons/browser/ie.png"><a title="点击查询IP信息" href="http://ip.clicki.cc/ip/125.70.254.70" target="_blank">中国 四川 Chengdu</a>
                                                            </th>
                                                            <th width="30%" style="text-align: right; background: none repeat scroll 0% 0% transparent; line-height: 120%;">
                                                                30 分钟 前
                                                            </th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <p style="line-height: 14px; cursor: default;">
                                                    从 <a target="_blank" title="www.clicki.cn" href="http://www.clicki.cn/ad/2.html">www.clicki.cn</a>
                                                    <br>
                                                    访问了 <a target="_blank" title="专业用户行为统计系统 - Clicki" href="http://www.clicki.cn/">专业用户行为统计系统 - Clicki</a>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>
                                                <table cellspacing="0" border="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <th>
                                                                <img align="absmiddle" title="中国 江苏" alt="中国 江苏" src="http://www.clicki.cn/resources/images/icons/geo/cn.png"><img align="absmiddle" title="windows 7" alt="windows 7" src="http://www.clicki.cn/resources/images/icons/os/windows.png"><img align="absmiddle" title="chrome 10.0.648.205" alt="chrome 10.0.648.205" src="http://www.clicki.cn/resources/images/icons/browser/chrome.png"><a title="点击查询IP信息" href="http://ip.clicki.cc/ip/218.4.189.4" target="_blank">中国 江苏 Suzhou</a>
                                                            </th>
                                                            <th width="30%" style="text-align: right; background: none repeat scroll 0% 0% transparent; line-height: 120%;">
                                                                31 分钟 前
                                                            </th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <p style="line-height: 14px; cursor: default;">
                                                    从 <a target="_blank" title="www.clicki.cn" href="http://www.clicki.cn/ad/2.html">www.clicki.cn</a>
                                                    <br>
                                                    访问了 <a target="_blank" title="专业用户行为统计系统 - Clicki" href="http://www.clicki.cn/">专业用户行为统计系统 - Clicki</a>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>
                                                <table cellspacing="0" border="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <th>
                                                                <img align="absmiddle" title="中国 北京" alt="中国 北京" src="http://www.clicki.cn/resources/images/icons/geo/cn.png"><img align="absmiddle" title="macos X" alt="macos X" src="http://www.clicki.cn/resources/images/icons/os/macos.png"><img align="absmiddle" title="safari 531.9" alt="safari 531.9" src="http://www.clicki.cn/resources/images/icons/browser/safari.png"><a title="点击查询IP信息" href="http://ip.clicki.cc/ip/114.241.12.22" target="_blank">中国 北京 Dongcheng</a>
                                                            </th>
                                                            <th width="30%" style="text-align: right; background: none repeat scroll 0% 0% transparent; line-height: 120%;">
                                                                43 分钟 前
                                                            </th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <p style="line-height: 14px; cursor: default;">
                                                    直接 访问了 <a target="_blank" title="登 录 - Clicki" href="http://www.clicki.cn/index.php/Account:login">登 录 - Clicki</a>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>
                                                <table cellspacing="0" border="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <th>
                                                                <img align="absmiddle" title="中国 安徽" alt="中国 安徽" src="http://www.clicki.cn/resources/images/icons/geo/cn.png"><img align="absmiddle" title="windows XP" alt="windows XP" src="http://www.clicki.cn/resources/images/icons/os/windows.png"><img align="absmiddle" title="ie 7.0" alt="ie 7.0" src="http://www.clicki.cn/resources/images/icons/browser/ie.png"><a title="点击查询IP信息" href="http://ip.clicki.cc/ip/114.100.179.0" target="_blank">中国 安徽 Hefei</a>
                                                            </th>
                                                            <th width="30%" style="text-align: right; background: none repeat scroll 0% 0% transparent; line-height: 120%;">
                                                                1.0 小时 前
                                                            </th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <p style="line-height: 14px; cursor: default;">
                                                    从 <a target="_blank" title="www.clicki.cn" href="http://www.clicki.cn/ad/2.html">www.clicki.cn</a>
                                                    <br>
                                                    访问了 <a target="_blank" title="专业用户行为统计系统 - Clicki" href="http://www.clicki.cn/">专业用户行为统计系统 - Clicki</a>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>
                                                <table cellspacing="0" border="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <th>
                                                                <img align="absmiddle" title="中国 陕西" alt="中国 陕西" src="http://www.clicki.cn/resources/images/icons/geo/cn.png"><img align="absmiddle" title="windows 7" alt="windows 7" src="http://www.clicki.cn/resources/images/icons/os/windows.png"><img align="absmiddle" title="firefox 6.0" alt="firefox 6.0" src="http://www.clicki.cn/resources/images/icons/browser/firefox.png"><a title="点击查询IP信息" href="http://ip.clicki.cc/ip/219.245.82.180" target="_blank">中国 陕西 Xian</a>
                                                            </th>
                                                            <th width="30%" style="text-align: right; background: none repeat scroll 0% 0% transparent; line-height: 120%;">
                                                                1.2 小时 前
                                                            </th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <p style="line-height: 14px; cursor: default;">
                                                    从 <a target="_blank" title="flymonkey.vicp.net" href="http://flymonkey.vicp.net/">flymonkey.vicp.net</a>
                                                    <br>
                                                    访问了 <a target="_blank" title="今日统计 - Clicki" href="http://www.clicki.cn/index.php/General:today">今日统计 - Clicki</a>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>
                                                <table cellspacing="0" border="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <th>
                                                                <img align="absmiddle" title="中国 江苏" alt="中国 江苏" src="http://www.clicki.cn/resources/images/icons/geo/cn.png"><img align="absmiddle" title="windows XP" alt="windows XP" src="http://www.clicki.cn/resources/images/icons/os/windows.png"><img align="absmiddle" title="ie 8.0" alt="ie 8.0" src="http://www.clicki.cn/resources/images/icons/browser/ie.png"><a title="点击查询IP信息" href="http://ip.clicki.cc/ip/114.228.138.153" target="_blank">中国 江苏 Nanjing</a>
                                                            </th>
                                                            <th width="30%" style="text-align: right; background: none repeat scroll 0% 0% transparent; line-height: 120%;">
                                                                1.3 小时 前
                                                            </th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <p style="line-height: 14px; cursor: default;">
                                                    直接 访问了 <a target="_blank" title="专业用户行为统计系统 - Clicki" href="http://www.clicki.cn/">专业用户行为统计系统 - Clicki</a>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>
                                                <table cellspacing="0" border="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <th>
                                                                <img align="absmiddle" title="中国 浙江" alt="中国 浙江" src="http://www.clicki.cn/resources/images/icons/geo/cn.png"><img align="absmiddle" title="windows 7" alt="windows 7" src="http://www.clicki.cn/resources/images/icons/os/windows.png"><img align="absmiddle" title="ie 7.0" alt="ie 7.0" src="http://www.clicki.cn/resources/images/icons/browser/ie.png"><a title="点击查询IP信息" href="http://ip.clicki.cc/ip/60.176.47.69" target="_blank">中国 浙江 Hangzhou</a>
                                                            </th>
                                                            <th width="30%" style="text-align: right; background: none repeat scroll 0% 0% transparent; line-height: 120%;">
                                                                1.5 小时 前
                                                            </th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <p style="line-height: 14px; cursor: default;">
                                                    直接 访问了 <a target="_blank" title="今日统计 - Clicki" href="http://www.clicki.cn/index.php/General:today/siteID/42838">今日统计 - Clicki</a>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>
                                                <table cellspacing="0" border="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <th>
                                                                <img align="absmiddle" title="中国 广东" alt="中国 广东" src="http://www.clicki.cn/resources/images/icons/geo/cn.png"><img align="absmiddle" title="windows 7" alt="windows 7" src="http://www.clicki.cn/resources/images/icons/os/windows.png"><img align="absmiddle" title="chrome 11.0.696.71" alt="chrome 11.0.696.71" src="http://www.clicki.cn/resources/images/icons/browser/chrome.png"><a title="点击查询IP信息" href="http://ip.clicki.cc/ip/121.33.190.166" target="_blank">中国 广东 Guangzhou</a>
                                                            </th>
                                                            <th width="30%" style="text-align: right; background: none repeat scroll 0% 0% transparent; line-height: 120%;">
                                                                1.6 小时 前
                                                            </th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <p style="line-height: 14px; cursor: default;">
                                                    直接 访问了 <a target="_blank" title="专业用户行为统计系统 - Clicki" href="http://www.clicki.cn/">专业用户行为统计系统 - Clicki</a>
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        <!--演示-->
                    </div>
                </div>
            </div>
		</div>
	</div>
</div>
<script>
$(function(){
    Clicki.widgetManage({
        type:"fixed",
        load:{
            "fixedWidget":{
                pop:{
                    set:"theWidgetSettingBox",
                    get:"theWidgetSettingGetCodeBox"
                },
                urls:"/setwidget/ajaxsetwidget"
            }
        },
        sidEl:$("#siteList")
    });
});
</script>
