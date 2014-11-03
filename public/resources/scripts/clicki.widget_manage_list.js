define(function(require){
    require("swfobject");
    function innerwidgetManageList(o,cb){

        /*弹出层控件检测*/
        var cache = {};
        cache.dom = {};
        /*原始参数缓存*/
        cache.param = o;
        cache.sidEl = o.sidEl;
        /*列表主标签*/
        cache.dom.main = $("#"+o.id);
        /*行数dom缓存*/
        cache.dom.trs = $("#"+o.id+" li");
        /*设定按钮缓存*/
        cache.dom.set = cache.dom.main.find("."+o.mark.set);
        /*获取代码按钮缓存*/
        cache.dom.get = cache.dom.main.find("."+o.mark.get);
        /*删除按钮缓存*/
        cache.dom.del = cache.dom.main.find("."+o.mark.del);
        /*当前正在设置的widget序号*/
        cache.nowActive = null;
        /*临时数据缓存*/
        cache.tempData = {};

        cache.dom.del.each(function(i){
            $(this).bind("click",function(){

                var tr = cache.dom.trs.eq(i);
                var wid = tr.attr("id").split("_")[2];

                $.get(cache.param.urls.del,{"wid":wid},function(re){
                    
                    if(re.success){
                        console && console.log("应用删除成功。wid："+wid);
                        tr.remove();

                    }else{
                        alert(re.errormsg);
                    }

                },"json");


            });
        });


        /*设定*/
        cache.dom.set.each(function(i){
            $(this).bind("click",function(){

				var href = cache.param.urls.setting;
                var wid = cache.dom.trs.eq(i).attr("id").split("_")[2];
				Clicki.NavView.params = {"wid":wid}
				Clicki.NavView.activeUrl = href+"?out=html";
				href =  "#"+ href;
				Clicki.Router.navigate(href+"/"+wid,true);

            });
        });

        /*获取代码*/
       cache.dom.get.each(function(i){
           $(this).bind("click",function(){
                //cache.nowActive.i = i;
                var id = parseInt(cache.dom.trs.eq(i).attr("id").split("_")[2]);
                var title = $.trim(cache.dom.trs.eq(i).find("td:first").text());
                var code = '<div id="clicki_widget_' +id+ '" title="' +title+ '"></div>';
                $("#" + cache.param.pop.get).find("textarea").text(code);
                Clicki.popLayout({id:"#"+cache.param.pop.get});
                $("#theWidgetSettingGetCodeBox .getCodeHelp").bind("click", function(){
                    window.open("http://www.clicki.cn/wp/index.php/help/?widget_set");
                });
                Clicki.clipboardRender({targetEl:"clicki_js_clipboard", textEl:"copyCodeText"});
            });
       });

        /*禁用*/
        cache.dom.main.find("."+o.mark.disabl).each(function(i){
            var el = $(this);

            if(el.attr("isDisabl") == undefined){
                el.val(LANG("禁用")).attr("isDisabl",false);
            }else{
                if(el.attr("isDisabl") == "true"){
                    el.val(LANG("启用")).attr("isDisabl",true);
                    cache.dom.set.eq(i).attr("disabled",true).addClass("G-disablBnt");
                    cache.dom.get.eq(i).attr("disabled",true).addClass("G-disablBnt");
                    cache.dom.trs.eq(i).attr("class","thisIsDisabl");
                }else{
                    el.val(LANG("禁用")).attr("isDisabl",false);
                }
            }

            el.bind("click",function(){
                var sid = cache.sidEl.attr("key");
                var id = parseInt(cache.dom.trs.eq(i).attr("id").split("_")[2]);
                if(el.attr("isDisabl") == "false"){
                    cache.dom.set.eq(i).attr("disabled",true).addClass("G-disablBnt");
                    cache.dom.get.eq(i).attr("disabled",true).addClass("G-disablBnt");
                    $.ajax({
                        url:cache.param.urls.change,
						data: {wid:id,status:0},
                        dataType:"json",
                        type:"GET",
                        success:function(data){
                            if(data.success){
								el.val(LANG("启用")).attr("isDisabl",true);
								cache.dom.trs.eq(i).attr("class","thisIsDisabl");
                            }else{
                                alert(data.error);
                            }
                        },
					   error:function(re){
						   var errorTxt = re.responseText;
						   errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
						   errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));
							errorTxt = errorTxt.replace("<p>","");
						   if (errorTxt) alert(LANG("当前是演示网站,不能进行编辑操作.请先登录!"));
						   else alert(LANG("服务器正忙，删除失败，请稍后再试"));
					   }
                    });
                }else{
                    cache.dom.set.eq(i).attr("disabled",false).removeClass("G-disablBnt");
                    cache.dom.get.eq(i).attr("disabled",false).removeClass("G-disablBnt");
                    $.ajax({
                        url:cache.param.urls.change,
						data: {wid:id,status:1},
                        dataType:"json",
                        type:"GET",
                        success:function(data){
                            if(data.success){
								el.val(LANG("禁用")).attr("isDisabl",false);
								cache.dom.trs.eq(i).removeAttr("class");
                            }else{
                                alert(data.error);
                            }
                        },
					   error:function(re){
						   var errorTxt = re.responseText;
						   errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
						   errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));
							errorTxt = errorTxt.replace("<p>","");
						   if (errorTxt) alert(LANG("当前是演示网站,不能进行编辑操作.请先登录!"));
						   else alert(LANG("服务器正忙，删除失败，请稍后再试"));
					   }
                    });
                }
            });
        });

    }
    Clicki.expand("widgetManageList",function(o,cb){
        return new innerwidgetManageList(o,cb);
    });
});
