define(["swfobject","fancybox"],function(require){
    require("swfobject");
    var $ = require("jquery");
    require("fancybox");
    var settingSite = function(site_id,value,url){
        var publicFunc = {
            /*生成一个弹出层的DOM，并 append 到 body 中 */
            createDOM:function(){
                var arr = new Array();
                arr.push("<div style='display:none;'>");
                arr.push("<form action='' class='G_setting_site_form' id='G_setting_site'>");
                arr.push("<div class='titleset'>"+LANG("设置网站")+"</div><div class='containerset'>");
                arr.push("<p><label for='servername'>"+LANG("网站域名：")+"</label><input disabled='disabled' class='xlarge' id='sitedomain' name='servername' type='text'  /></p>");
                arr.push("<p><label for='name'>"+LANG("网站名称：")+"</label><input class='xlarge' id='sitename' placeholder='"+LANG("请输入网址的名称")+"' name='name' type='text' maxlength='32' /></p>");
                /*arr.push("<p><input type='button' class='btn' id='update_site'  value='修改' />");*/
                /*arr.push("<input type='button' class='btn' id='delete_site'  value='删除' />");*/
                arr.push("<input type='button' class='btn' id='get_code_site'  value='"+LANG("获取代码")+"' />");
                arr.push("</p></div></form>");
                arr.push("<div id='set_fancyboxGetCode' class='widgetSettingGetCode'><p class='popBoxTitle'>"+LANG("获取代码")+"</p><div class='theCodeTipDiv'>"+LANG("请将下面的JavaScript代码插入你的网站代码的head标签里。")+"</div>");
                arr.push("<textarea name='' id='set_fancyboxcopyCodeText' class='xxlarge'  readonly='readonly'></textarea><span id='set_fancyboxclicki_js_clipboard'></span></div>");
                var ddom = $(arr.join(""));
                $("body").append(ddom);
                return ddom.find("form");
            },

            /*弹出弹出层*/
            showBox:function(){
                Clicki.popLayout({id:"#G_setting_site"});
                publicFunc.init();
            },
            /*初始化输入框，把网址域名和网站名称填上去*/
            init:function(){
                setDOM.find("#sitedomain").attr("value",url);
                setDOM.find("#sitename").attr("value", value);
            },
            /*绑定 修改网站、删除、获取代码、管理widget 按钮的点击事件*/
            bindBtn:function(){
                setDOM.find("#update_site").click(function(){
                    publicFunc.updateSite();
                });
                setDOM.find("#delete_site").click(function(){
                    publicFunc.deleteSite();
                });
                setDOM.find("#get_code_site").click(function(){
                    publicFunc.getCode();
                });
                setDOM.find("#manage_widget").click(function(){
                    publicFunc.managewidget();
                });
            },
            /*这个 updateSite 需要后台参与 修正*/
            updateSite:function(){
                var that = this;
                var mess = setDOM.find("#message");
                var sitedomain = setDOM.find("#sitedomain").attr("value");
                var sitename = setDOM.find("#sitename").attr("value");
                if(sitedomain.length > 0 && sitename.length > 0){
                    $.ajax({
                        url:"/site/ajaxeditsite?&site_id="+ site_id+"&sitename="+encodeURIComponent(sitename),
                        dataType:"json",
                        type:"GET",
                        success:function(data){
                            if(data["error"] == "+OK"){
                                alert(LANG("修改成功"));
                                that.closeFancyBox();
                                window.location.reload();
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
                    alert(LANG("请出入网站域名或名称"));
                }
                return false;
            },
            deleteSite:function(){
                var that = this;
                if(confirm(LANG("确认要删除么？")) ){
                    var siteid =  site_id;
                    $.ajax({
                        type:"GET",
                        url:"/site/ajaxdelsite?site_id="+ siteid,
                        dataType:"json",
                        data:this.parm,
                        success:function(data){
                            if(data.error == "+OK"){
                                alert(LANG("删除成功"));
                                that.closeFancyBox();
                                window.location.reload();
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
                return false;
            },
            getCode:function(){
                Clicki.popLayout({id:"#set_fancyboxGetCode"});
				var code = '<scr' + 'ipt type="text/javascript">';
				code += "(function() {";
				code += "var c = document.createElement('script'); c.type = 'text/javascript'; c.async = true;";
				code += "c.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + '"+ document.domain +"/boot/" +window.site_id+ "';";
				code += "var h = document.getElementsByTagName('script')[0]; h.parentNode.insertBefore(c, h);";
				code += "})();";
				code += "</sc" + "ript>";
                $("#set_fancyboxcopyCodeText").attr("value", code);
                $("#set_fancyboxGetCode .getCodeHelp").bind("click", function(){
                    window.open("http://www.clicki.cn/wp/index.php/help/?clicki_code");
                });
                Clicki.clipboardRender({targetEl:"set_fancyboxclicki_js_clipboard", textEl:"set_fancyboxcopyCodeText"});
                return false;
            },
            managewidget:function(){
                window.location = "#/setwidget";
                $.fancybox.close();
                return false;
            },
            closeFancyBox: function(){
                $("#fancybox-close").click();
            }
        }
        var setDOM = publicFunc.createDOM();
        publicFunc.bindBtn();
        publicFunc.showBox();
    };
})
