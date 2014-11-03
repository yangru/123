<style type="text/css">
#fancyboxUpdateSite{ padding:2em;}
#fancyboxUpdateSite input[type='text']{width:15em;}
#fancyboxUpdateSite p{margin:1em 0em; }
#update_message{color:red;}
.G-gotoOtherSite {float:left;padding:.4em .5em;min-width:120px;margin:.1em 0 0;}
.G-gotoOtherSite div {color:#7e7e7e;border:1px solid #F2F2F2;padding:0 1.5em 0 .5em;height:32px;line-height:32px;font-size:20px;text-shadow:rgba(255,255,255,1) 1px 1px 0;text-align:center;}
.G-gotoOtherSite div:hover {cursor:pointer;}
.G-gotoOtherSite .theHover {cursor:pointer;border:1px solid #dfdddd;border-radius:6px;background:url(images/siteDownArr.gif) 95% 50% no-repeat,-webkit-gradient(linear,0% 0,0% 100%,from(#f2f1f1),to(#eae8e8));background:url(images/siteDownArr.gif) 95% 50% no-repeat,-moz-linear-gradient(top, #f2f1f1, #eae8e8 85%);}
.urlDomain .theSiteName {padding:10px 0 0 20px!important;}
.urlDomain .theSiteUrl {padding:0 0 9px 20px!important;}
.urlDomain div {text-align:left!important;}
.G-theWidescreen .G-showArea ,.G-theWidescreen .G-showArea .inArea {width:1200px}
.siteCtrlTd {padding:0 7px!important;}
</style>
<h2 id="functionTitle">网站列表</h2>
<div id="showArea" class="theShowArea siteMane">
	<?php if ( -1 !== get_site_id()) : ?>
	<div class="theChart fixChart" id="theFloatChart">
		<div id="the_sitedaycompare_chart" class="theLimitWidthBox" style="height:300px; width:755px;"></div>
	</div>
	<div class="keyWordSearcher" id="theSiteListSearcher"></div>
	<div class="G-outterBox G-tableSet processTable">
		<div id="theSiteList" class="theTableBox"></div>
	</div>
	<?php else: ?>
    <div class="login_lead">
        <a href="/manage/#<?php echo url('admin/addsite'); ?>" title="添加网站"><em></em>添加网站</a>
    </div>
	<?php endif;?>
</div>

<div style="display:none;">
    <div id="fancyboxGetCode" class="widgetSettingGetCode">
        <p class="popBoxTitle">获取代码</p>
        <div class="theCodeTipDiv">请将下面的JavaScript代码插入你的网站代码的head标签里。</div>
        <textarea name="" id="copyCodeText" cols="80" rows="5" readonly></textarea>
        <div id="copied" style="display:none"></div>
        <span id="clicki_js_clipboard"></span>
    </div>
    <div id="fancyboxUpdateSite">
        <p><label for="servername">网站域名：</label><input class=" " id="sitedomain" placeholder="请输入要添加的网站域名" name="servername" type="text"  /></p>
        <p><label for="name">网站名称：</label><input class="" id="sitename" placeholder="请输入网址的名称" name="name" type="text"  /></p>
        <input type="button" class="G-gotoBnt" id="updatesubmit"  value="提交" />
        <p id="update_message"></p>
    </div>
</div>
<?php if ( -1 !== get_site_id()) : ?>
<script type="text/javascript">
(function(){
	setTimeout(function(){
		if(window.Clicki && Clicki.layout){
			var _today = Clicki.getDateStr();
    		var _yestoday = Clicki.getDateStr({day:-1});
			Clicki.layout.add({
                "layout":{
                    "the_SiteList":{
                        "type":"grid",
                        "config":{
                            url:"/site/list",
                            params:{
                            	type:"site",
		                        page:1,
                                limit:20
		                    },
		                    //sort:false,
                            colModel:[
                                {
                                    compare:false,
                                    tdCls:"urlDomain",
                                    data:"sitename",
                                    render:function(key,i,row){
                                    	var _data = this._getCollection().getModelDataAt(row).x_axis;
                                    	return '<div class="theSiteName">'+_data.sitename+'</div><div class="theSiteUrl"><a href="'+_data.url+'" target="_blank" title="'+_data.url+'">'+LANG(_data.url.replace(/(http:\/\/)||(https:\/\/)/g,""))+'</a></div>'
                                    }
                                },
                                {
                                    data:null,
                                    xModule:{
                                        "linkage":{
                                            target:"the_sitedaycompare_chart",
                                            type:"poptip",
                                            addParams: {
                                                site_id :function(model){
                                                	return model.keys.id;
                                                }
                                            },
                                            title:LANG("网站 {sitename} 今日昨日PV对比"),
                                            width:800,
                                            boxType:"center",
                                            height:300,
                                            layout:Clicki.layout
                                        }
                                    },
                                    tpl:'<span class="theCtrlListR"><%= key %><a href="#" class="linageChartIcon" title="'+LANG("图表")+'" data-xtype="linkage">'+LANG("图")+'</a></span>'
                                },
                                {data:"pageviews"},
		                        {data:"sessions"},
		                        {data:"visitors"},
		                        {data:"bounce_rate"},
                                {
                                	text:LANG("操作"),
                                    data:null,
                                    tdCls:"siteCtrlTd",
                                    render:function(key,i,row){
                                    	var _sid = this._getCollection().getModelDataAt(row).keys.id; 
                                    	var _data = this._getCollection().getModelDataAt(row)                                    	
                                    	var _html = '<p class="managOperating" key="'+_sid+'"><a href="/site/'+_sid+'/#/statistic/general" class="node_list_checkIt">'+LANG("查看报表")+'</a>';
                                    	if (_data.siteedit) {
                                    		_html += '<a href="/site/'+_sid+'/#/site/editsite" title="'+LANG("设置")+'">'+LANG("设置")+'</a><a href="#fancyboxGetCode" class="node_list_getCodeIt">'+LANG("获取代码")+'</a>';
                                    	}
                                    	if (_data.sitedelete) {
                                    		_html += '<a href="" class="node_list_delIt">'+LANG("删除")+'</a>';
                                    	}
										_html += '</p>';
										return _html;
                                    }
                                }
                            ],
                            filter:{
		                        type:"the_SiteList_filter",
		                        "build":{
		                            "def":{
		                                text:LANG("默认"),
		                                act:true,
		                                build:["sitename","pageviews","sessions","visitors","bounce_rate"]
		                            },
		                            "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors"]},
		                            "quality":{text:LANG("质量指标"),build:["avg_staytime","avg_loadtime","avg_pageviews", "avg_pagepixels","bounces","bounce_rate"]},
		                            "custom":{text:LANG("自定义")}
		                        },
		                        "options":{
		                            "pageviews":{text:"PV"},
		                            "sessions":{text:LANG("访问次数")},
		                            "visitors":{text:"UV"},
		                            "new_visitors":{text:LANG("新访客数")},
		                            "old_visitors":{text:LANG("回访数量")},
		                            "avg_staytime":{text:LANG("平均停留时间")},
		                            "avg_loadtime":{text:LANG("平均加载时间")},
		                            "avg_pageviews":{text:LANG("平均访问深度")},
		                            "avg_pagepixels":{text:LANG("平均页面像素")},
		                            "bounces":{text:LANG("跳出次数")},
		                            "bounce_rate":{text:LANG("跳出率")}
		                        }
		                    },
                            title: LANG("站点列表"),
                            target: "theSiteList",
                            afterRender:function(mvc){

                            	var gridtable = this.table;

                            	$.each(gridtable.find(".gridContentBody:first tr"),function(i,n){
                            		var _tr = $(this);
                            		var data = mvc.Collection.getModelDataAt(i);
                            		if (!data || !data.keys || !data.keys.id) return;
                            		var _id = data.keys.id;
                            		_tr.children("td[nocompare!='1']").css("cursor","pointer").attr("data-key",_id);
                            	});

                            	
                            },
                            callback:function(){
                            	$("td[nocompare][nocompare!='1']").live("click",function(ev){
                    				window.location='/site/'+$(ev.target).closest("td").attr("data-key")+'/#/statistic/general/';
                    			});
                            	$(".node_list_getCodeIt").live("click", function(e){
							        var $p = $(e.target).parents(":first");
							        var site_id =  $p.attr("key");
							        Clicki.layout.destroy("siteArea").add("siteArea",{
					                    type:"getCode",
					                    config:{
					                        type:"site",
					                        model:{
					                            "datacontent":[
					                                {"site_id":site_id}
					                            ]
					                        }
					                    }
					                });
									return false;
							    });

							    /*删除网站*/
							    $(".node_list_delIt").live("click", function(e){
							        if(confirm(LANG("确认要删除么？")) ){
							            var $p = $(e.target).parents(":first");
							            var siteid =  $p.attr("key");
							            $.ajax({
							                type:"GET",
							                url:"/site/ajaxdelsite?site_id="+ siteid,
							                dataType:"json",
							                data:this.parm,
							                success:function(data){
							                    if(data.error == "+OK"){
							                        /*如果异步删除很麻烦了，有要更新grid ，又要更新左上角的弹出层，所以干脆直接刷页面算了*/
							                        var $tbody = $p.parents("tbody");
													var dt = $(e.target).parent().parent().parent().parent().find('td:first').find('div').html();
													var d_url = dt.split('<br>')[1];
							                        $p.parents("tr:first").remove();
													$('#theClickPopListOutterBox > ol > li').each(function(i, value){
														var poptext = value.innerHTML.split('</strong>')[1];
														if (poptext == d_url) {
															$(this).remove();
														}
													});
													if ($('div#siteList').attr("key") == siteid){
														window.location.reload();
														//window.location.replace(location.href);
													}
							                        if($tbody.find("tr").length == 0){
														window.location.reload();
														//window.location.replace(location.href);
							                        }
							                        grid.refresh({"data":{}})
							                    }else{
							                        alert(data.error);
							                    }
							                },
										   error:function(re){
											   var errorTxt = re.responseText;
											   errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
											   errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));
												errorTxt = errorTxt.replace("<p>","");
											   if (errorTxt) alert(errorTxt);
											   else alert(LANG("服务器正忙，删除失败，请稍后再试"));
										   }
							            });
							        }
							        return false;
							    });

                            	Clicki.layout.add("the_sitedaycompare_chart",{
                            		"type":"charts",
					                "config":{
					                   target:"the_sitedaycompare_chart",
					                   router: {model: "feed", defaultAction: "daycompare", type: null},
					                   params:{
					                        metrics: "pageviews",
					                        site_id:site_id,
					                        date0:_today,
					                        date1:_yestoday
					                   },
					                   sort:false,
					                   formatTo:{
					                        metrics:"pageviews",
					                        caption:{today:LANG("今日"),yesterday:LANG("昨日")},
					                        to:["today","yesterday"]
					                   },
					                   fields:"pageviews",
					                   rootDom:"#theFloatChart",
					                   setting:{
					                       "type":"area",
					                       "options":{
					                            title:{
					                                text:LANG("今日昨日PV对比")
					                            },
					                            color:"#97d0ee"
					                       },
					                       height:300
					                   },
					                   special:{
					                        "today":{
					                            type:"areaspline",
					                            color:"#ff005f",
					                            fillOpacity: 0.1,
					                            zIndex: 2,
					                            lineWidth: 2,
					                            dataLabels: {
					                                enabled: true,
					                                formatter: function() {
					                                    if(this.y>0)return this.y;
					                                }
					                            },
					                            shadow:false
					                        },
					                        "yesterday":{
					                            type:"areaspline",
					                            color:"#0ec900",
					                            fillOpacity: 0.1,
					                            dashStyle: 'longdash',
					                            dataLabels: {
					                                enabled: true
					                            },
					                            shadow:false
					                        }
					                    }
					                }
                            	});
								
                            }
                        }
                    },
                    "the_Sitelist_Search":{
                        "type":"search",
                        "config":{
                            "id":$("#theSiteListSearcher"),
                            "slave":["the_SiteList"]
                        }
                    }
                }
            });
		}else{
			setTimeout(arguments.callee,200);
		}
	},100);
})();
</script>
<?php endif;?>
