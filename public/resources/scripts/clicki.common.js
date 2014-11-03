(function(factory){
    /*简单的模块化*/
    if (typeof define === 'function') {
        define([], factory);
    } else {
        factory();
    }
})(function common(){
    /* 提供 页面 window 下的一个全局变量 入口*/
    var global = {
        site_id:window["site_id"],
        defBegindate:window["begindate"],
        defEnddate:window["enddate"],
        begindate:window["begindate"],
        enddate:window["enddate"],
        dirty:false
    };
    /*本模块的全局命名空间，有站点的id，开始时间，结束时间*/
    var APP = {
        /*默认没-1 代表没有站点*/
        siteID: -1,
        /*初始化为今天时间*/
        beginDate: Clicki.getDateStr(),
        /*初始化为今天时间*/
        endDate:Clicki.getDateStr(),
        /*{keyword:{},node_list:{}}*/
		oConf:{},
        grids:{},
        charts:{},
        popList:false,
        syncGoing:false
    };
    /*独立一个命名空间，管理公用的方法*/
    var publicFunction = {
        /*渲染页面。循环 APP.oConf 里的配置文件，根据每个配置生成各自的表格,并且填充日期输入框的*/
        gotoRenderDate: function(re){
            try{
                /*first 渲染各个 grid*/
                var app = APP;
                var config = app.oConf;
                for(var e in config){
                    (function(e){
                        setTimeout(function(){
                            var obj = config[e];
                            if(!re && APP.grids[obj.target]){
                                return;
                            }
                            var url = null;
                            if (obj.router.type){
                                url = BU + obj.router.model + "/" + obj.router.defaultAction + "/" + obj.router.type ;
                            } else {
                                url = BU + obj.router.model + "/" + obj.router.defaultAction ;
                            }
                            /*默认为theList，一般都是需要给的，如果页面只有一个表格，那就用theList 方便*/
                            var target = "theList";
                            if (obj.target){
                                target = obj.target;
                            }
                            var callbackFunc = function(){};
                            if(obj.callback || typeof obj.callback == "function"){
                                callbackFunc = obj.callback;
                            }

                            var params = obj.params;
                            params.begindate = APP.beginDate;
                            params.enddate  = APP.endDate;
                            params.site_id = app.siteID;

                            if(window.site_id){
                                params.site_id = site_id;
                            }else{
                                params.site_id = app.siteID;
                            }



                            /*调用grid控件*/
                            /*如果要对grid控件进行相关的操作，请在回调函数里进行*/
                            /*url = "/resources/temp/keyword.json";*/
                            var con = {
                                target:target,
                                url: url,
                                params: params,
                                title:obj.title
                            }
                            
                            if(obj.sub){
                                con.sub = obj.sub;
                            }
                            
                            if(obj.colModel){
                                con.colModel = obj.colModel;
                            }
                            
                            if(obj.captions){
                                con.captions = obj.captions;
                            }
                            if(obj.icon){
                                con.icon = obj.icon;
                            }
                            if(obj.page){
                                con.page = obj.page.show;
                            }
                            if(obj.colWidth){
                                con.colWidth = obj.colWidth;
                            }

                            if(obj.minChart){
                                con.minChart = obj.minChart;
                            }

                            if(obj.showTotal){
                                con.showTotal = obj.showTotal;
                            }



                            obj.url  = con.url;
                            con.exportFunc = function(){
                                Clicki.exportList({
                                    url:con.url,
                                    params:con.parm
                                });
                            }
                            if(APP.grids[obj.target]){
                                APP.grids[obj.target].reflash(callbackFunc,true,con.params);
                            }else{
                                APP.grids[obj.target] = Clicki.grider(con, callbackFunc);
                            }


                        },100);
                    })(e);

                }

                /*second 填充date 的输入框*/
                this.fillDataInput();
            }catch(err){
                window.console && console.log(err.message);
            }
        },
        reDrawChart:function(){
            for(var n in APP.charts){
                APP.charts[n].reDraw({begindate:APP.beginDate,enddate:APP.endDate,site_id:site_id});
            }
        },
        fillDataInput:function(){
            var dataInput = $(".inputDate");
            var app = APP;

            dataInput.eq(0).attr("value", app.beginDate);
            dataInput.eq(1).attr("value", app.endDate);
        },
        /*绑定日期狂的 按下enter 按钮，设置相关的变量，然后触发查询按钮的点击事件*/
        bindInputDate:function(){
            $(".inputDate").live("keydown", function(e){
                var event = e;
                if(event.keyCode != 13 ){
                    return;
                }
                $("#gotoQuery").click();
            });
        },
        /*绑定时间选择按钮，设置相关的变量，然后触发渲染函数gotoRenderDate*/
        bindChoseDate:function(){
            var that = this;
            var selectBtn = $(".choseDate:first input[type=button]");
            selectBtn.live("click", function(e) {
            	var id = e.target.id;
            	selectBtn.each(function(k, v){            		
            		if (id !== "gotoQuery") {
            			$("#" + id).addClass("selected");
            		}
            		if ($(v).attr("id") !== id) {
            			$(v).removeClass("selected");
            		}
            	});
            });
            $(".choseDate:first input").die().live("click",function(e){
                    var id = e.target.id;
                    var begin = Clicki.getDateStr();
                    var end = Clicki.getDateStr();
                    var inAppBeginDate = APP.beginDate.replace(/\-/g,"/");
                    var inAppEndDate = APP.endDate.replace(/\-/g,"/");                    
                    switch(id){						
                    	case "gotoToday":
                            end = begin = Clicki.getDateStr();
                            break;
                        case "gotoYesterday":
                            end = begin = Clicki.getDateStr({day:-1});
                            break;
                        case "gotoLastSeven":
                            begin = Clicki.getDateStr({day:-7});
                            end = Clicki.getDateStr();
                            break;
                        case "gotoLastThirty":
                            begin = Clicki.getDateStr({day:-30});
                            end = Clicki.getDateStr();
                            break;
                        case "gotoCurrentMonth":
                            begin = Clicki.getDateStr({day:1-(new Date).getDate()});
                            end = Clicki.getDateStr();
                            break;
                        case "gotoBeforeDay":
                            begin = Clicki.getDateStr({day:-1,date:inAppBeginDate});
                            end = Clicki.getDateStr({day:-1,date:inAppEndDate});
                            break;
                        case "gotoNextDay":
                            if(Date.parse(inAppEndDate) < Date.parse(Clicki.getDateStr().replace(/\-/g,"/"))){
                                end = Clicki.getDateStr({day:1, date:inAppEndDate});
                            } else{
                                end = APP.endDate;
                            }
                            if(Date.parse(inAppBeginDate) <= Date.parse(inAppEndDate) && Date.parse(inAppEndDate) != Date.parse(Clicki.getDateStr().replace(/\-/g,"/"))){
                                begin = Clicki.getDateStr({day:1, date:inAppBeginDate});
                            }else{
                                begin = APP.beginDate;
                            }
                            break;
                        case "gotoQuery":
                            var inputdate = $(".inputDate");
                            var bd = inputdate.eq(0).attr("value").replace(/\-/g,"/");
                            var ed = inputdate.eq(1).attr("value").replace(/\-/g,"/");
                            if(new Date(bd) == "Invalid Date" ||  new Date(ed) == "Invalid Date"){
                                begin = APP.beginDate;
                                end = APP.endDate;
                            }else{
                                if(Date.parse(bd) <= Date.parse(ed) && Date.parse(ed) <= Date.parse(Clicki.getDateStr().replace(/\-/g,"/"))){
                                    begin = Clicki.getDateStr({date:bd});
                                    end = Clicki.getDateStr({date:ed});
                                }else{
                                    begin = APP.beginDate.replace(/\-/g,"/");
                                    end = APP.endDate.replace(/\-/g,"/");
                                }
                            }
                            break;
                        default:
                            return;
                    }

                    window["begindate"] = begin;
                    window["enddate"] = end;

                    global.begindate = begin
                    global.enddate = end;
                    /*设置相关的变量*/
                    APP.beginDate = begin;
                    APP.endDate = end;

                    /*触发渲染函数*/
                    that.gotoRenderDate(true);
                    that.reDrawChart();
                    e.stopPropagation();
                });

        },
        /*绑定到处列表按钮*/
        /*bindExportDate:function(){
            $(".exportBtn").live("click", function(){
                var app = APP;
                var config = app.oConf;
                for(var e in config){
                    var obj = config[e];
                    var url = null;
                    if (obj.router.type){
                        url = BU + obj.router.model + "/" + obj.router.defaultAction + "/" + obj.router.type ;
                    } else {
                        url = BU + obj.router.model + "/" + obj.router.defaultAction ;
                    }
                    var params = obj.params;
                    params.begindate = APP.beginDate;
                    params.enddate  = APP.endDate;
                    params.site_id = app.siteID;
					Clicki.exportList({
						url: url,
						parm:params
					});
				}
            });
        },*/
        /*请求站点信息，并且有一个回调函数去渲染页面，成功请求和切换站点都可以触发回调，或者说不只是一个回调*/
        requestWebSite:function(){
             if($("#theClickPopListOutterBox").length == 0 && site_id !== -1){
                 var that = this;
                var id = "#siteList";
                var url = "/site/ajaxgetsites?ajax=1";
                APP.popList = Clicki.popList({"id":id,"url":url,"site_id":global["site_id"],async:false,callback:function(key){
                    APP.siteID = key;
                    that.gotoRenderDate();
                },clickFunc:function(key){
                    var url = BU + "site/ajaxsetsite";
                    $.get(url, {ajax:1, sid:key}, function(data){
                        if (data.error == "+OK"){
                            window.location.reload();
                            return;
                        }
                    },'json');
                }
                });
             }else{
                APP.siteID = global.site_id;
                APP.popList && APP.popList.showMatch();
                this.gotoRenderDate();
             }
        },
        /*添加配置。每个页面都有不同的表格，每个表格都有不同的配置，这些配置要保留到 APP.oConf 里面*/
        addConfig:function(o){
            var config = APP.oConf;
            if(!config[o.target]){
                config[o.target] = o;
            }
        },
        /*模拟日期的查询按钮*/
        clickQueryBtn:function(){
            $("#gotoQuery").click();
        },
        /*初始化本模块的全局变量，如果数据有误就用默认的 siteID= -1，beginDate=endDate = 今天*/
        initAPP: function(){
            APP.siteID = global.site_id || -1;
            APP.beginDate = global["begindate"] || Clicki.getDateStr();
            APP.endDate = global["enddate"] || Clicki.getDateStr();
        },
        /*页面加载初始化函数.初始化时间选择和日期输入框和页面卸载事件监听。初始化本模块的全局变量。初始化站点请求*/
        configReady:function(){
                this.bindChoseDate();
                this.bindInputDate();
                /*this.bindExportDate();*/
                this.initAPP();
                this.requestWebSite();
        },
		syncRender:function(){
            if($("#theClickPopListOutterBox").length == 0 && !APP.syncGoing && site_id !== -1){
                APP.syncGoing = true;
                var id = "#siteList";
                var url = "/site/ajaxgetsites?ajax=1";
                APP.popList = Clicki.popList({"id":id,"url":url,"site_id":global["site_id"],async:false,callback:function(key){
                },clickFunc:function(key){
                    var url = BU + "site/ajaxsetsite";
                    $.get(url, {ajax:1, sid:key}, function(data){
                        if (data.error == "+OK"){
                            window.location.reload();
                            return;
                        }
                    },'json');
                }
                });
            }else{
                APP.popList && APP.popList.showMatch();
            }


        },
		/*复制*/
		clipboardRender:function(obj){
			if($("#copied_tips")) $("#copied_tips").remove();
            window.copySuccess = function(){
				if($("#copied_tips")) $("#copied_tips").remove();
				$("#"+obj.targetEl).before("<div id='copied_tips' style='color:red;text-align:center;display:none;'>"+LANG("复制成功! 请把代码粘贴在你的网站！")+"</div>");
				$("#copied_tips").show();
            };
			var copy_text = $("#" + obj.textEl).val();
			var flashvars = {
				content: encodeURIComponent(copy_text),
				uri: RESBU + 'images/flash_copy_btn.png'
			};
			var params = {
				wmode: "transparent",
				allowScriptAccess: "always"
			};
			var width = obj.width ? obj.width : 130;
			var height = obj.height ? obj.height : 30;
			var exp = RESBU + "flash_chart/expressInstall.swf";
			swfobject.embedSWF(RESBU + "flash/clipboard.swf", obj.targetEl, width, height, "10.0.0", exp, flashvars, params);
			if ($("#clickiCopyCode")){
				$("#clickiCopyCode").bind("click", function(){
					if ( window.clipboardData){
						window.clipboardData.clearData();
						window.clipboardData.setData('Text', copy_text);
                        copySuccess();
					} else {
						$('#' + copied_tips).css({width:'38em',margin:'0 auto',color:'red','text-align':'center',padding:'5px'}).html(LANG('你当前使用的浏览器不支持，请升级你的flash player或者使用 Ctrl + C 手动复制！<br/>升级地址 <a href="http://get.adobe.com/cn/flashplayer/">http://get.adobe.com/cn/flashplayer</a>')).show(500);
					}
				});
			}
		}
    }
    /*扩展Clicki, 提供一个方法让Clicki访问里面的额函数*/

    Clicki.expand("common",function(){
        var oo = {
            "addConfig": function(oConfig){
                publicFunction.addConfig(oConfig);
            },
            "configReady": function(){
                publicFunction.configReady();
            },
			"syncRender": function(){
                publicFunction.syncRender();
            },
			"clipboardRender": function(obj){
                publicFunction.clipboardRender(obj);
            },
            getConfig:function(index){
                return APP.oConf[index];
            },
            getGrid:function(index){
                return APP.grids[index];
            },
            showMatch:function(){
                APP.popList && APP.popList.showMatch();
            },
            getDate:function(){
                
            },
            addModuleObj:function(type,name,obj){
                APP[type] && (APP[type][name] = obj);
            },
            getModuleObj:function(type,name){
                return APP[type]?APP[type][name]:false;
            },
            killAll:function(){
                delete APP.grids;
                delete APP.oConf;
                delete APP.charts;
                APP.grids = {};
                APP.oConf = {};
                APP.charts = {};
            }
        };
        return oo;
     });

});

