
define(function(require,exports,module){
    var $ = window.$ = require('jquery');
    require('easing')($);
    var cookie = require('cookie');
    var pop = require('pop_up');
    var pop_box = null;

    //判断屏幕尺寸
    if(screen.width < 1280){
        //$('head').append('<link type="text/css" rel="stylesheet" href="/resources/styles/layoutForLess1200px.css?V=">');
        $("#forLess1200px").attr("href","/resources/styles/layoutForLess1200px.css");
    }
    
    window.myToday = null;
    
    // 绑定ajax统一处理权限提示函数
    $.ajaxSetup({
        dataFilter: function(data, type){
            //console.log(type);
            if (type == 'json'){
                var err = data;
            }else {
                var err = null;
                if (data.indexOf('AUTH_FAILURE') != -1){
                    err = JSON.parse(data);
                }
            }
            if (err && !err.success && err.code == 'AUTH_FAILURE'){
                if (!pop_box){
                    pop_box = new pop({
                        type: {'html': '<div>'+LANG("很抱歉, 你没有权限进行对应的操作.")+'</div>'},
                        "ui":{
                            "title":{
                                "show":true,
                                "text":LANG("缺少权限")
                            },
                            "width": 300
                        },
                        "autoClose":false,
                        "showMark":true,
                        "showClose":false,
                        "showCtrl":true,
                        onDone:function(){
                            this.hide();
                            this.showed = false;
                            window.history.go(-1);
                        },
                        onRender: function(){
                            this.content = this.doms.inner.find('div:first').css('padding', '10px 10px 20px');
                            this.doms.cancelBnt.hide();
                        },
                        beforeShow: function(){
                            this.showed = true;
                        },
                        "data":null,
                        "ready":false
                    });
                    pop_box.showed = false;

                }
                if (!pop_box.showed){
                    Clicki.Balance();
                    pop_box.show();
                }
                if (err.message){
                    pop_box.content.text(err.message);
                }
                return false;
            }
            return data;
        }
    })

    // 多语言处理函数
    var lang_default = 'zh_CN';
    var lang_reg = /\%(\d+)/g;
    var lang_param = null;
    var lang_name = cookie.get('lang') || lang_default;
    var lang_translate = null;
    var lang_param_replace = function(match){
        if (match[1] > 0 && lang_param[match[1]] !== undefined){
            return lang_param[match[1]];
        }else {
            return match[0];
        }
    }
    var LANG = window.LANG = function(text){
        if (lang_translate && lang_translate.hasOwnProperty(text)){
            text = lang_translate[text];
        }
       //alert(text.valueOf())
        if (arguments.length > 1){
            lang_param = arguments;
            return text.replace(lang_reg, lang_param_replace);
        }
        return text;
    }
	
    window.setLang = function(name){
        if (!name || name == lang_name) return lang_name;
        lang_name = name;
        cookie.set('lang', name, {expires: 9999, path:'/'});
        alert(1);
        location.reload();
    }
    
    //页面文本转换
    var pageTextTranslate = window.pageTextTranslate = function (selector){
		$(selector).each(function(i){
			var in_text = LANG($(this).html());
			if($(this).is("input")){
				if(typeof($(this).attr("value"))!="undefined"){
					var in_val = LANG($(this).val());
					$(this).attr("value",in_val);
				}
				if(typeof($(this).attr("placeholder"))!="undefined"){
					var in_placeholder = LANG($(this).attr("placeholder"));
					$(this).attr("placeholder",in_placeholder);
				}
			}else{
				$(this).attr("title",in_text);
				$(this).html(in_text);
			}
		});
	}
    
    
    // 先加载语言包文件
    if (lang_name == lang_default){
        init.call(this);
    }else {
        		$.ajax(_addVerToUrl('/resources/lang/'+lang_name+'/lang','json'), {
            	context: this,
            	dataType: 'json',
            	complete: function(){
                init.call(this);
            },
            success: function(data){
                if (data) lang_translate = data;
                // 添加类名
                $('body').addClass('lang_'+lang_name);
                // 引入CSS文件
                $('head').append('<link type="text/css" rel="stylesheet" href="'+ _addVerToUrl('/resources/lang/'+lang_name+'/style','css')+'">');
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
            	//alert(textStatus);
            }
        });
    }
    
    setLang('zh_CN');
    // 添加语言选择ICON
    /*
    var tb = $('.usertoolbar:first');
    var box = $('<div></div>');
    box.css({
        'float': 'right',
        'padding-top': '12px',
        'height': '16px',
        'width': '120px'
    });
    box.append('<img src="/resources/images/icons/geo/us.png" style="cursor:pointer;float:right;" onclick="setLang(\'en_US\')" title="English">');
    box.append('<img src="/resources/images/icons/geo/cn.png" style="cursor:pointer;float:right;" onclick="setLang(\'zh_CN\')" title="中文">');
    //box.append('<img src="/resources/images/icons/geo/fr.png" style="cursor:pointer" onclick="setLang(\'fr\')" title="Franch">');
    tb.after(box);
    */
    //pageTextTranslate(".needTrans");
    //alert($(".needTrans").html())
    /*$(".needTrans").click(function(){ 
    	var in_text = LANG($(this).html());
		if($(this).is("input")){
			var in_val = LANG($(this).val());
			$(this).attr("value",in_val);
		}else{
			$(this).attr("title",in_text);
			$(this).html(in_text);
		}
	});*/
    /*$(".needTrans").on("click", function(){
		var in_text = LANG($(this).html());
		if($(this).is("input")){
			var in_val = LANG($(this).val());
			$(this).attr("value",in_val);
		}else{
			$(this).attr("title",in_text);
			$(this).html(in_text);
		}
		alert(55555555)
	});*/

    //     if (name = 'zhCN'){
    //         lang_translate = null;
    //         return;
    //     }else {
    //         $.getJSON('/resources/lang/'+name+'.json', function(dat){
    //             if (dat)
    //             lang_translate = dat;
    //         }
    //     }
    //     return name;
    // }

    // SetLang('enUS');
    ////////////////////////上部导航条鼠标hover动作//////////////////////////
    /*$(document).on(
    	{
    		mouseenter:function(){
				$(this).stop()
				.css({
					left:0,
					paddingLeft:20			
				})
				.animate({
					left:20,
					paddingLeft:0
				}, 1000,'easeOutElastic');
			}
    	},
    	"#theBigFrameHead .nav ul li:not(li.main) a"
	);*/
	
function init(){
	/*实例化manager*/
    var manager = Clicki.manager = require("manager").init({});
    var layout = Clicki.layout = new (require("layout"))({});
    /*Backbone*/
    var Backbone = require("backbone");
    
    /*后台common*/
    //require("common");
    /*路由配置模块*/
    var routerSetting = require("router");

    //require("setsite");   
    
    /*用户右上角信息*/
	require('usertoolbar');
    
    
    /*$(function(){
		$(".needTrans").each(function(i){
			var in_text = LANG($(this).html());
			if($(this).is("input")){
				var in_val = LANG($(this).val());
				$(this).attr("value",in_val);
			}else{
				$(this).attr("title",in_text);
				$(this).html(in_text);
			}
		});
    });*/
    
    var $_$ = {};
    /**/
    $_$.Model = Backbone.Model.extend({});
    /**/
    $_$.Collection = Backbone.Collection.extend({
        getModuleObj:function(index,module,name){
            return this.models[index].attributes.modules[module][name];
        }
    });
    /*路由*/
    $_$.Router = Backbone.Router.extend(routerSetting);
    /*后台整体view*/
    $_$.AppView = Backbone.View.extend({
        el:"body",
        crumbs:$("#theCrumbs"),
        tmpParams:{},
        initialize:function(){
            Clicki.sideNav();
            if(this.crumbs.length === 0){
                $(function(){
                    if($("#theCrumbs").length !== 0){
                        this.crumbs = $("#theCrumbs");
                    }
                }.bind(this));
            }
            var balanceSetting = ["#imNav","#imOutterArea"],bNow = false,nowH = 0,timer,selector;
            $(window).bind("resize",function(){
                if(!bNow){
                    bNow = true;
                    nowH = $(document).height();
                    timer = setInterval(function(){
                       nowH = nowH === $(document).height()?false:$(document).height();
                        if(!nowH){
                            clearInterval(timer);
                            if(!selector){
                                selector ="" + balanceSetting;
                                selector = $(selector);
                            }
                            nowH = 0;
                            Clicki.Queue(function(){},100);
                            bNow = false;
                        }
                    },50);
                }
             });
        },
        bindChoseDate:function(fn){
            var that = this;
            var selectBtn = $(".choseDate:first input[type=button]");
            var dateInput = $(".inputDate");
            var theDate = Clicki.manager.getDate();
            var doneFn = Clicki.isFn(fn) && fn || false;

            !dateInput.eq(0).val() && dateInput.eq(0).val(theDate.beginDate);
            !dateInput.eq(1).val() && dateInput.eq(1).val(theDate.endDate);

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


            $(".choseDate:first input").removeClass("selected").die().live("click",function(e){
                    var nowInAppDate = Clicki.manager.getDate(true);
                    var id = e.target.id;
                    var begin = Clicki.getDateStr();
                    var end = Clicki.getDateStr();
                    var inAppBeginDate = nowInAppDate.beginDate;
                    var inAppEndDate = nowInAppDate.endDate;
                    switch(id){
                    	case "gotoToday":
                            end = begin = Clicki.getDateStr();
                            that.nowDateType = "gotoToday";
                            break;
                        case "gotoYesterday":
                            end = begin = Clicki.getDateStr({day:-1});
                            that.nowDateType = "gotoYesterday";
                            break;
                        case "gotoLastSeven":
                            begin = Clicki.getDateStr({day:-6});
                            end = Clicki.getDateStr();
                            that.nowDateType = "gotoLastSeven";
                            break;
                        case "gotoLastThirty":
                            begin = Clicki.getDateStr({day:-29});
                            end = Clicki.getDateStr();
                            that.nowDateType = "gotoLastThirty";
                            break;
                        case "gotoCurrentMonth":
                            begin = Clicki.getDateStr({day:1-(new Date).getDate()});
                            end = Clicki.getDateStr();
                            that.nowDateType = "gotoCurrentMonth";
                            break;
                        case "gotoBeforeDay":
                            begin = Clicki.getDateStr({day:-1,date:inAppBeginDate});
                            end = Clicki.getDateStr({day:-1,date:inAppEndDate});
                            that.nowDateType = "gotoBeforeDay";
                            break;
                        case "gotoNextDay":
                            if(Date.parse(inAppEndDate) < Date.parse(Clicki.getDateStr().replace(/\-/g,"/"))){
                                end = Clicki.getDateStr({day:1, date:inAppEndDate});
                            } else{
                                end = nowInAppDate.endDate;
                            }
                            if(Date.parse(inAppBeginDate) <= Date.parse(inAppEndDate) && Date.parse(inAppEndDate) != Date.parse(Clicki.getDateStr().replace(/\-/g,"/"))){
                                begin = Clicki.getDateStr({day:1, date:inAppBeginDate});
                            }else{
                                begin = nowInAppDate.beginDate;
                            }
                            that.nowDateType = "gotoNextDay";
                            break;
                        case "gotoQuery":
                            var inputdate = $(".inputDate");
                            var bd = inputdate.eq(0).attr("value").replace(/\-/g,"/");
                            var ed = inputdate.eq(1).attr("value").replace(/\-/g,"/");
                            if(new Date(bd) == "Invalid Date" ||  new Date(ed) == "Invalid Date"){
                                begin = nowInAppDate.beginDate;
                                end = nowInAppDate.endDate;
                            }else{
                                if(Date.parse(bd) <= Date.parse(ed) && Date.parse(ed) <= Date.parse(Clicki.getDateStr().replace(/\-/g,"/"))){
                                    begin = Clicki.getDateStr({date:bd});
                                    end = Clicki.getDateStr({date:ed});
                                }else{
                                    begin = nowInAppDate.beginDate;
                                    end = nowInAppDate.endDate;
                                }
                            }
                            that.nowDateType = "customDate";
                            break;
                        default:
                            return;
                    }

                    begin = begin.replace(/\//g,"-");
                    end = end.replace(/\//g,"-");

                    Clicki.manager.changeDate({
                        beginDate:begin,
                        endDate:end
                    });

                    Clicki.layout && Clicki.layout.manager.changeDate({
                        "begindate":begin,
                        "enddate":end
                    });

                    window["begindate"] = begin;
                    window["enddate"] = end;

                    dateInput.eq(0).val(begin);
                    dateInput.eq(1).val(end);

                    var dat = $(e.target).attr("data-dat");
                    /*触发渲染函数*/
                    if(doneFn){
                        doneFn($.extend(
                            (dat && $.parseJSON(dat) || {}),
                            {
                                begindate:begin,
                                enddate:end
                            }
                        ))
                    }else{
                        Clicki.manager.reRenderAll(
                            $.extend(
                                (dat && $.parseJSON(dat) || {}),
                                {
                                    begindate:begin,
                                    enddate:end
                                }
                            ),
                            "tabpanel,date_controller,search",
                            false,
                            function(){
                                setTimeout(function(){
                                    Clicki.Balance();
                                },300);
                            }
                        );
                    }
                    var dateController =dateController || Clicki.manager.getApp("date_controller");
                    if(dateController && that.nowDateType == "customDate"){
                        dateController.changeDate();
                    }
                    
                    e.stopPropagation();
                
            });
            this.nowDateType = this.nowDateType||false;
            if(this.nowDateType && this.nowDateType !== "customDate"){
                $("#"+this.nowDateType).addClass("selected");
            }
            /*
            else{
                this.nowDateType = "gotoToday";
                $("#gotoToday").addClass("selected");
            }
            */
        },
        saveToCollection:function(index,module,name,obj){
            Clicki.Collection.models[index].attributes.modules[module][name] = obj;
        }
    });
    /*导航view*/
    $_$.NavView = Backbone.View.extend({
        el:"#imNav",
        tagName:"a",
        activeUrl:null,
        params:false,
        els:null,
        clickiHash:"",
        killList:[],
        contentBox:$("#imOutterArea .inArea:first"),
        events:{
            "click a":"setActive"
        },
        initialize:function(){
            this.setSiteEls = $("#theNavSetSite");
            this.getReportEls = $("#theNavMain");
            this.adminSetEls = $("#theNavAdmin");
            this.algorithmSetEls = $("theNavAlgorithm")
            this.els = $(this.el).find("li");
            $(function(){

                var theNavMain = this.getReportEls
                    ,theNavSetSite = this.setSiteEls
                    ,theNavAdmin = this.adminSetEls
                    ,getReport = $("#getReport")
                    ,setSite = $("#setSite")
                    ,setupURL = theNavSetSite.find('a:first').attr('href') || "#/site/editsite"
                    ,reportURL = theNavMain.find('a:first').attr('href') || "#/statistic/general";

                $("#theAddSiteBnt").bind("click",this.setActive.bind(this));
                setSite.bind("click", function(){
                    $(this).addClass("G-setSited");
                    getReport.removeClass("G-getReported");
                    theNavMain.hide();
                    theNavAdmin.hide();
                    theNavSetSite.show();
                    Clicki.NavView.setDefaultActive(16, setupURL.replace(/^([#\/]+)/, ''));
                    return false;
                });
                $("#theAddSiteBnt").bind("click",this.setActive.bind(this));
                setSite.bind("click", function(){
                    $(this).addClass("G-setSited");
                    getReport.removeClass("G-getReported");
                    theNavMain.hide();
                    theNavAdmin.hide();
                    theNavSetSite.show();
                    Clicki.NavView.setDefaultActive(16, setupURL.replace(/^([#\/]+)/, ''));
                    return false;
                });
                getReport.bind("click", function(){
                    $(this).addClass("G-getReported");
                    setSite.removeClass("G-setSited");
                    theNavMain.show();
                    theNavSetSite.hide();
                    theNavAdmin.hide();
                    Clicki.NavView.setDefaultActive(0, reportURL.replace(/^([#\/]+)/, ''));
                    return false;
                });
            }.bind(this));
        },
        setActive:function(e){
            if(e.target.href !== "#"){
                if(this.killList.length > 0){
                    $(""+this.killList).unbind().remove();
                }
                var tag = $(e.target);
                var href=  e.target.hash;
                var parn = tag.parent();
                href = href.substr(href.indexOf("/"),href.length-1);
                this.clickiHash = href.substr(1);
                href +="?out=html";
                this.activeUrl = href;
                this.els.removeClass("act");
                tag.closest("li").addClass("act");
                e.target.blur();
            }
        },
        setActBtn:function(id){
            this.els.removeClass("act").each(function(index,item){
                if(item.id === id){
                    var _tag = $(this)
                        ,_parent = _tag.closest("div[id]")
                        ,_other = _parent.parent().children("div:not([id="+_parent.attr("id")+"])");
                    
                    _tag.addClass("act");
                    _other.hide();
                    _parent.show();
                    return false;
                }
            });
            
        },
        setKillList:function(arr){
            this.killList = this.killList.concat(arr);
        },
        setDefaultActive:function(i,href){
            if(i>-1){
                this.els.removeClass("act").eq(i).addClass("act");
            }else{
                this.els.removeClass("act");
            }
            this.activeUrl = href.substr(href.indexOf("/"),href.length-1);
            this.activeUrl = this.activeUrl.indexOf("?") !== -1?this.activeUrl+"&out=html":this.activeUrl+"?out=html";
            Clicki.Router.navigate(href,true);
        }
    });

    
    this.Clicki = this.Clicki || {};
    this.Clicki.Collection = new $_$.Collection([{
        "modules":{
            "grids":{},
            "charts":{},
            "tabpanels":{}
        }
    }]);
    this.Clicki.NavView = new $_$.NavView;
    this.Clicki.App = new $_$.AppView;

    this.Clicki.Router = new $_$.Router;

    Backbone.history.start({root:"/"});
    
    //上部导航栏点击链接
    $.ajax({
        url:'/admin/visitauth',
        type: 'GET',
        dataType: 'json',
        success: function(rdata){
            var currPlant =  $("#theNavList li.main");
            var navSysObj = $('#theNavList li a[title="系统管理"]');
            if(rdata.sys.length > 0){
                var _hrefArr = rdata.sys[0].split("/");
                var _str = _hrefArr[2];
                navSysObj.attr("href","/manage/#/admin/"+_str);
            }else{
                navSysObj.attr("href","/manage/#/admin/error");
            }
            if(currPlant.find('a').attr("title") == "系统管理"){
                if(rdata.sys.length > 0){
                    //左边默认导航
                    if(window.location.hash === "" && window.location.pathname.indexOf(rdata.algo[0]) === -1){
                        Clicki.NavView.setDefaultActive(-1,"#/admin/"+_str);
                    }
                    $(window).error(function(){
                        return true;
                    })
                }else{
                    if(window.location.hash !== '#/user/setpassword'){
                        Clicki.NavView.setDefaultActive(-1,'#/admin/error');
                    }
                }             
            }
            //console.log(window.location.hash)
            var navAgloObj = $('#theNavList li a[title="算法平台"]');
            if(rdata.algo.length > 0){
                var _hrefArr = rdata.algo[0].split("/");
                var _str = _hrefArr[2];
                navAgloObj.attr("href","/algorithm/#/algorithm/"+_str);
            }else{
                navAgloObj.attr("href","/algorithm/#/algorithm/error");
            }
            if (currPlant.find('a').attr("title") == "算法平台") {
                if (rdata.algo.length > 0) {
                    //左边默认导航
                    if (window.location.hash === "" && window.location.pathname.indexOf(rdata.algo[0]) === -1) {
                        Clicki.NavView.setDefaultActive(-1, "#/algorithm/" + _str);
                    }
                    $(window).error(function() {
                        return true;
                    });
                } else {
                    if(window.location.hash !== '#/user/setpassword'){
                        Clicki.NavView.setDefaultActive(-1, '#/algorithm/error');
                    }
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            // 服务器连接解析错误
            //alert("服务器连接解析错误");
        }
    });
    
   //语言转换
   //pageTextTranslate(".needTrans");
}

});