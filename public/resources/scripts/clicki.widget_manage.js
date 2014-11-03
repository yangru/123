(function(factory){
    /*简单的模块化*/
    if (typeof define === 'function') {
        define(["staticBoot"], factory);
    } else {
        factory();
    }
})(function(require){

    /*默认widget小图标图片地址*/
    var thumbSrc = "/resources/images/thumbnail/small_widget/";
    /*默认widget图标位置样式前缀*/
    var widgetPositionClassTmp ="widgetP";

    var allType = {
        "white":"/resources/styles/skin/theme_white.css",
        "black":"/resources/styles/skin/theme_black.css",
        "darkblue":"/resources/styles/skin/theme_darkblue.css",
        "darkgreen":"/resources/styles/skin/theme_darkgreen.css",
        "lightblue":"/resources/styles/skin/theme_lightblue.css",
        "lightred":"/resources/styles/skin/theme_lightred.css",
        "lightyellow":"/resources/styles/skin/theme_lightyellow.css",
        "orange":"/resources/styles/skin/theme_orange.css",
        "red":"/resources/styles/skin/theme_red.css",
        "coffee":"/resources/styles/skin/theme_coffee.css",
        "gray":"/resources/styles/skin/theme_gray.css",
        "brown":"/resources/styles/skin/theme_brown.css"
    }
	var colors = {
		white:{
			background:"#F2F2F2",
			color:"#878787"
		},
		black:{
			background:"#141414",
			color:"#808080"
		},
		darkblue:{
			background:"#4F5B78",
			color:"#889DCE"
		},
		darkgreen:{
			background:"#0C643B",
			color:"#18CD79"
		},
		lightblue:{
			background:"#E0FAFF",
			color:"#879497"
		},
		lightred:{
			background:"#FFF0F0",
			color:"#867E7E"
		},
		lightyellow:{
			background:"#F5F7CF",
			color:"#8A8A75"
		},
		orange:{
			background:"#FF711A",
			color:"#8D3E0C"
		},
		red:{
			background:"#B61616",
			color:"#D6A9A9"
		},
		brown:{
			background:"#7C2D38",
			color:"#E09EA8"
		},
		gray:{
			background:"#444446",
			color:"#BEBEC1"
		},
		coffee:{
			background:"#520000",
			color:"#D6A9A9"
		}
	};

    var arrSrc = {"l":"/resources/styles/images/arr_left.gif","b":"/resources/styles/images/arr_down.gif","r":"/resources/styles/images/arr_right.gif"};

    function widgetManage(o,cb){
        /*widget类型*/
        this.type = o.type;
        /*已经执行的函数数*/
        this.loadNum = 0;
        /*加载函数设定*/
        this.load = o.load;
        /*缓存*/
        this.cache = {};
        this.sidEl = o.sidEl;
        this.hasChangData = {group_id:0,setting:{position:"",skin:"",color:"",background:"",width:300,height:300},selected:[],type:0}
        if(this.type === "float"){
			/* type : 0 浮动 1 固定*/
            this.floatData = {group_id:0,setting:{position:"",skin:"",color:"",background:"",width:300,height:300},selected:[],type:0};
            this.submitUrl = o.urls;
        }
        this.submitBnt = o.submitBnt?o.submitBnt:false;
        /*高度平衡*/
        this.balance = o.balance?o.balance:false;
        /*加载*/
        this.manageLoader();

        this.tempWidget = {};
        this.tempWidgetImg = {};

        /*回调*/
        this.callback = cb||false
        this.callback&&(this.callback.call(this));

    }

    widgetManage.prototype = {
        /*加载*/
        manageLoader:function(){
            var that = this;
            for(var n in this.load){
                if(Clicki.isFn(this[n])){
                    this.cache[n] = {};
                    this.cache[n]["dom"] = {};
                    this[n](this.load[n]);
                    this.loadNum +=1;
                }
            }
            if(this.type === "float"){
                if(typeof require == "function"){
                    require.async("staticBoot",function(){
                        this.setWidgetDom();
                        if(this.submitBnt){
                            this.submitBnt.bind("click",function(){
                                //that.floatData.site_id = that.sidEl.attr("key");
                                //that.floatData.selected = ""+that.floatData.selected;
                                that.hasChangData.group_id = Clicki.NavView.params.group_id;
                                that.hasChangData.selected = ""+that.floatData.selected;
                                
                                that.sendData(that.submitUrl,function(re){
                                    if(re.error === "+OK"){
										var current = $("div#siteList").html();
                                        alert(current + "\n"+LANG("保存成功")+"");
                                        Clicki.userWidget.hideWidget();
                                        //Clicki.userWidget.destroy();
                                        Clicki.Router.navigate("#/setwidget",true);
                                    }else{
                                        alert(re.error);
                                        Clicki.userWidget.hideWidget();
                                       // Clicki.userWidget.destroy();
                                        Clicki.Router.navigate("#/setwidget",true);
                                    }
                                });
                                /*
                                $.get(that.submitUrl,that.floatData,function(re){
                                    if(re.error === "+OK"){
                                        alert("保存成功");
                                        Clicki.userWidget.hideWidget();
                                        Clicki.userWidget.destroy();
                                        Clicki.Router.navigate("#/setwidget",true);
                                    }else{
                                        alert(re.error);
                                        Clicki.userWidget.hideWidget();
                                        Clicki.userWidget.destroy();
                                        Clicki.Router.navigate("#/setwidget",true);
                                    }
                                },'json');
                                */

                            });
                        }
                    }.bind(this));
                }

            }
            /*高度平衡*/
            if(this.balance){
                var balanceSetting = this.balance,bNow = false,nowH = 0,timer,that = this;
                $(window).bind("resize",function(){
                    if(!bNow){
                        bNow = true;
                        nowH = $(document).height();
                        timer = setInterval(function(){
                           nowH = nowH === $(document).height()?false:$(document).height();
                            if(!nowH){

                                clearInterval(timer);
                                if(!that.selector){
                                    that.selector ="" + (balanceSetting.tagArr[0].concat(balanceSetting.tagArr[1]));
                                    that.selector = $(that.selector);
                                }

                                $.each(that.selector,function(){
                                    $(this).css("height","inherit");
                                });
                                nowH = 0;
                                Clicki.Balance(balanceSetting);
                                Clicki.Balance();
                                bNow = false;
                            }
                        },50);
                        //Clicki.Balance(balanceSetting);
                    }
                 });
                setTimeout(function(){
                    Clicki.Balance(balanceSetting);
                },300);
            }

        },
        /*widget选择*/
        widgetSelect:function(o){

            /*弹出层控件检测*/
            //Clicki.jsFilesLoader(["jQuery.fancybox"]);

            var cache = this.cache["widgetSelect"],that = this;
            /*原始参数缓存*/
            cache.param = o;
            /*待选widget列表容器*/
            cache.dom.tobe = $("#"+cache.param.ids.tobe);
            /*已选widget列表容器*/
            cache.dom.already = $("#"+cache.param.ids.already);
            /*widget详细设定弹出层*/
            cache.dom.settingBox = $("#"+cache.param.settingId);
            /*widget详细设定弹出层预览标签*/
            cache.dom.shower = null;
            /*待选widget*/
            cache.dom.toBeLis = cache.dom.tobe.find("li");
            /*已选widget*/
            cache.dom.alreadyLis = {};
            /*当前正在设置的widget*/
            cache.nowActive = {}
            cache.nowActive.dom = {}
            cache.nowActive.i = null;

            function addToSelected(tag,i){
                var cloneEl = cache.dom.toBeLis.eq(i).clone(),first;
                tag.attr("class",cache.param.selectedCls);
                cache.dom.already.append(cloneEl);
                first = cloneEl.find("input").val(LANG("设置")).hide();
                first.before("<input type=\"button\" i=\""+i+"\" class=\""+cache.param.cancelCls+"\" value=\""+LANG("取消")+"\" />");
                cache.dom.alreadyLis[i] = cloneEl;
            }

            /*选择*/
            $.each(cache.dom.toBeLis,function(i,n){

                var Input = $(this).find("input:first");

                Input.bind("click",function(){
                    if(this.className !== cache.param.selectedCls){
                        addToSelected($(this),i);
                        that.floatData.selected.push(parseInt(cache.dom.toBeLis.eq(i).attr("id").split("_")[2]));
                    }
                });

                if(Input.attr("class") === cache.param.selectedCls){
                    addToSelected(Input,i);
                    that.floatData.selected.push(parseInt(cache.dom.toBeLis.eq(i).attr("id").split("_")[2]));
                }

            });

            /*已选择的widget缓存与序号属性添加*/
            cache.dom.already.find("li").each(function(i){
                $(this).attr("i",i);
                cache.dom.alreadyLis[i] = $(this);
            });

            /*取消已选widget*/
            cache.dom.already.find("."+cache.param.cancelCls).live("click",function(){
                var i = $(this).attr("i"),id = parseInt(cache.dom.toBeLis.eq(i).attr("id").split("_")[2]);
                cache.dom.alreadyLis[i].remove();
                cache.dom.toBeLis.eq(i).find("input:first")[0].className = cache.param.noSelectCls;
                that.floatData.selected = $.grep(that.floatData.selected,function(n){
                    return n !== id;
                });
            });

            /*设置已选widget*/
            cache.dom.already.find("."+cache.param.noSelectCls).live("click",function(){
                return false;
                var i = $(this).attr("i");
                cache.nowActive.dom = cache.dom.alreadyLis[i];
                cache.nowActive.i = parseInt(i);
                Clicki.popLayout({id:"#"+cache.param.settingId});
            });

            /*widget详细设置*/
            cache.dom.settingBox.find("div[id]").each(function(i){
                
                if(i == 0){
                    var ctrlBox = $(this),
                        colors = ctrlBox.find("img"),
                        inputs  =ctrlBox.find("input");

                    /*颜色选择*/
                    $.each(colors,function(){
                        $(this).bind("click",function(){
                            var newColor = "#"+(this.className).split("bg")[1];
                            cache.dom.shower.css("background",newColor);
                        });
                    });

                    $.each(inputs,function(i){
                        
                        if(i ==0){
                            /*确定*/
                            $(this).bind("click",function(){
                                $.fancybox.close();
                            });
                        }else{
                            /*取消*/
                            $(this).bind("click",function(){
                                cache.dom.shower.removeAttr("style");
                                $.fancybox.close();
                            });
                        }
                    });
                    
                }else{
                    cache.dom.shower = $(this);
                }
            });

            return true;
        },
        /*widget位置选择*/
        positionSelect:function(o){

            //!this.tempWidget && (this.bulidWidget());

            var cache = this.cache["positionSelect"],that = this;
            cache.doms = $("#"+o.id+" span");
            /*可选位置缓存数组*/
            cache.types = [];

            /*当前widget小图标位置缓存*/
            this.selectedWidgetPos = "";
            
            $.each(cache.doms,function(i,n){
                var el = $(n).find("input:first");
                
                cache.types.push(n.className.split("_")[1]);

                el.bind("click",function(){
                    //that.cache["userWidget"].minimize();
                    var type = "_"+cache.types[i],reImg = type.substr(0,1);
                    if(type === that.selectedWidgetPos){
                        return false;
                    }
                    that.selectedWidgetPos = type;
                    that.floatData.setting.position = cache.types[i];
                    that.hasChangData.setting.position = cache.types[i];
                    that.setClass();
                    that.cache["userWidget"].reset(cache.types[i]);
                    /*新样式*/
                    that.tempWidget
                    .css({"display":"block","opacity":0})
                    .animate({
                         opacity:1
                     },300);
                    that.setArr();
                    that.showArr();
                    //this.tempWidgetOutter

                });

                if(el.attr("checked")){
                    that.selectedWidgetPos ="_"+n.className.split("_")[1];
                    that.floatData.setting.position =n.className.split("_")[1];
                    that.hasChangData.setting.position =n.className.split("_")[1];
                }
            });

            return true;
        },
        /*widget小图标类型选择*/
        typeSelect:function(o){

            var cache = this.cache["typeSelect"],that = this;
            cache.doms = $("#"+o.id+" li");

            /*可选类型缓存数组*/
            cache.types = [];
            /*当前选择类型缓存*/
            this.selectedType = "";
            
            $.each(cache.doms,function(i,n){
                var el = $(n).find("input:first");
                cache.types.push(el.attr("id").split("_")[0]);

                $(n).bind("click",function(){
                    el.attr("checked",function(){
                        return this.checked?true:!this.checked;
                    });
                    
                    that.selectedType = cache.types[i];

                    that.floatData.setting.skin = cache.types[i];
					that.floatData.setting.background = colors[cache.types[i]].background;
					that.floatData.setting.color = colors[cache.types[i]].color;

                    that.hasChangData.setting.skin = cache.types[i];
					that.hasChangData.setting.background = colors[cache.types[i]].background;
					that.hasChangData.setting.color = colors[cache.types[i]].color;

                    that.setSkin();

                    that.tempWidget.css({"display":"block","opacity":0})
                    .animate({
                         opacity:1
                     },300,function(){
                        that.tempWidgetBox.css("height","272px");
                    });
                    that.showArr();
                    
                    return false;
                });

                el.bind("click",function(event){
                    event.stopPropagation();
                    $(n).click();

                });

                if(el.attr("checked")){
                    that.selectedType = cache.types[i];
                    that.floatData.setting.skin = cache.types[i];
                    that.hasChangData.setting.skin = cache.types[i];
                    that.hasChangData.setting.background = colors[cache.types[i]].background;
					that.hasChangData.setting.color = colors[cache.types[i]].color;
                }

            });

            return true;
        },
        /*创建展示用widget*/
        bulidWidget:function(){
            //$("body:first").append("<div class=\"tmpWidgetBox\"><img src=\"\" alt=\"\" /></div>");
            var dom = this.cache["userWidget"].getWidgetDom();
            this.tempWidget = dom.smallWidget;
            this.tempWidgetOutter = dom.widgetOutterBox;
            this.tempWidgetBox = dom.widgetBox;
            this.tempWidgetImg = this.tempWidget.find("img:first");
            this.tempWidgetStyle = $("#style_"+this.cache["userWidget"].id);
            this.tempImgArr = $("<img src='' style='position:absolute;left:-9999em;top:-9999em;' alt='' />");
            $("body:first").append(this.tempImgArr);
        },
        /*设定样式*/
        setClass:function(){
            var clsTmp = widgetPositionClassTmp+this.selectedWidgetPos,
                    nowClass = this.tempWidgetOutter.attr("class").split(" ");

            for(var i=0,len = nowClass.length;i<len;i++){
                if(nowClass[i].indexOf(widgetPositionClassTmp) !== -1){
                    nowClass[i] = clsTmp;
                    break;
                }
            }
            this.tempWidgetOutter.attr("class",nowClass.join(" "));
        },
        /*设定皮肤*/
        setSkin:function(){
            var href= allType[this.selectedType];
            this.tempWidgetStyle.attr("href",href);
        },
        /*提示箭头设定*/
        setArr:function(){
            var pos = this.selectedWidgetPos.substr(1,1);
            pos = arrSrc[pos];
            this.tempImgArr.attr("src",pos);
        },
        /*显示提示箭头*/
        showArr:function(){

            if(this.timer){
                clearTimeout(this.timer);
            }
            var box = this.tempWidgetOutter,
                tagOf = box.offset(),
                _Img = this.tempImgArr,
                _T = tagOf.top,_L = tagOf.left;
            
            var pos = this.selectedWidgetPos.substr(1);

            switch(pos){
                case "lt":case "lm":
                    _T = tagOf.top - _Img.height()/4;
                    _L = 30;
                break;

                case "bl":case "bm":case "br":
                    _T = tagOf.top - _Img.height() - 10;
                    _L = tagOf.left +40;
                break;

                case "rt":case "rm":
                    _T = tagOf.top - _Img.height()/4;
                    _L = tagOf.left - _Img.width() - 30;
                break;
                case "rb":
                     _T = tagOf.top + 40;
                    _L = tagOf.left - _Img.width() - 30;
                break;
                case "lb":
                    _T = tagOf.top + 40;
                    _L = 30;
                break;
            }

            _Img.css({top:_T+"px",left:_L+"px"});
            this.timer = setTimeout(function(){
                _Img.animate({opacity:"hide"},500,function(){
                    _Img.css({left:"-9999em",top:"-9999em"}).show();
                })
            },2222);
        },
        /*设定widget dom对象*/
        setWidgetDom:function(){
            var that = this,timer,dom = Clicki.userWidget.getWidgetDom();
            timer = setInterval(function(){
                if(dom.smallWidget){
                    clearInterval(timer);
                    /*缓存页面widget对象*/
                    that.cache["userWidget"] = Clicki.userWidget;
                    that.bulidWidget();
                    that.setSkin();
                    that.setClass();
                    that.cache["userWidget"].reset(that.floatData.setting.position);
                    that.setArr();
                }
            },200);
        },
        /*固定类型弹出层*/
        fixedWidget:function(o){
            
            /*弹出层控件检测*/
            var cache = this.cache["fixedWidget"],that = this;
            /*原始参数缓存*/
            cache.param = o;
            cache.sidEl = this.sidEl;
            /*widget设定弹出层*/
            cache.dom.settingBox  = $("#"+cache.param.pop.set);
            /*名称标签*/
            cache.dom.nameInput = null;
            /*宽度标签*/
            cache.dom.widthInput = null;
            /*高度标签*/
            cache.dom.heightInput = null;
            /*当前正在设置的widget序号*/
            cache.nowActive = null;
            /*已经修改的数据*/
            cache.changeData = {};
            /*临时数据缓存*/
            cache.tempData = {};

            /*拖动。可考虑抽出作为一个独立控件*/
            function scrollPic(o){
                /*滑标的初始参数*/
                this.dX = 0;
                this.oX = 0;
                this.fX = 0;
                this.getOp.call(this,o);
                this.innt.call(this);
            }

            scrollPic.prototype = {
                /*初始化*/
                innt:function(){

                    var that = this;
                    this.ctrlBnt.bind("mousedown",function(e){
                        var ev = window.event?window.event:e;
                        that.dX = that.ctrlBnt.position().left;
                        that.oX = !window.event?ev.pageX - this.offsetLeft:ev.clientX - this.offsetLeft;;
                        $(document).bind("mousemove",function(e){
                            that.starDrag(e);
                        })

                        $(document).bind("mouseup",function(e){
                            that.stopDrag(e);
                        })
                    });

                },
                /*拖动开始*/
                starDrag:function(e){
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                    this.fX = !window.event?e.pageX- this.oX:event.clientX - this.oX;
                    this.fX = (this.fX < 0)?this.Min:this.fX;
                    this.fX = (this.fX > this.Max)?this.Max:this.fX;
                    this.ctrlBnt.css("left",this.fX+"px");
                    var final = this.setp*this.fX;
                    final = (this.fX == this.Max)?this.limit.Max:final;
                    this.output && (this.output.val(final));
                },
                /*拖动结束*/
                stopDrag:function(e){
                    $(document).unbind();
                },
                getOp:function(o){
                    /*最大值与最小值设置*/
                    this.limit = {
                        Max:1000,
                        Min:0
                    }
                    /*当前值*/
                    this.value  = parseInt(o.val);
                    this.value = this.value  > this.limit.Max?this.limit.Max:this.value;
                    /*数值输出标签*/
                    this.output = o.output?o.output:false;
                    /*滚动条容器*/
                    this.ctrlBar = o.ctrlBar;
                    /*滚动滑标*/
                    this.ctrlBnt = this.ctrlBar.find("em:first");
                    /*滑标宽度*/
                    this.ctrlWidth = this.ctrlBar.width();
                    /*滑标滚动的最大位置*/
                    this.Max = this.ctrlWidth - this.ctrlBnt.width();
                    /*滑标滚动的最小位置*/
                    this.Min = 0;
                    /*步长*/
                    this.setp =Math.round(this.limit.Max/this.ctrlWidth);
                    /*比例*/
                    this.bi = this.value/this.limit.Max;
                    /*设定位置*/
                    this.ctrlBnt.css("left",((this.value/this.setp)*this.bi)+"px");
                }

            }

            /*设定
            cache.dom.set.each(function(i){
                $(this).bind("click",function(){

                    var type = parseInt($(this).attr("wi"));
                    if(type){
                        /*0,固定
                        cache.nowActive = i;
                        cache.changeData.name = cache.dom.trs.eq(i).find("td:first").text();
                        var size = cache.dom.trs.eq(i).find("td").eq(3).text();
                        var color = cache.dom.trs.eq(i).find("td").eq(3).attr("gcolor");
                        cache.changeData.setting = {};
                        cache.changeData.setting.width = $.trim(size.split('X')[0].split(':')[1]);
                        cache.changeData.setting.height = $.trim(size.split('X')[1]);
                        cache.changeData.color = $.trim(color);
                        cache.dom.nameInput.val(cache.changeData.name);
                        cache.dom.widthInput.val(parseInt(cache.changeData.setting.width));
                        cache.dom.heightInput.val(parseInt(cache.changeData.setting.height));
                        color = color === ""?"#e1faff":color;
                        cache.dom.shower.css("background",color);
                        Clicki.popLayout({id:"#"+cache.param.pop.set});
                        var href = cache.param.urls.jump.fixed;
                        Clicki.NavView.params = {"group_id":cache.dom.trs.eq(i).attr("id").split("_")[2]}
                        Clicki.NavView.activeUrl = href+"?out=html";
                        href =  "#"+ href;
                        Clicki.Router.navigate(href,true);
                    }else{
                        var href = cache.param.urls.jump.float;
                        Clicki.NavView.params = {"group_id":cache.dom.trs.eq(i).attr("id").split("_")[2]}
                        Clicki.NavView.activeUrl = href+"?out=html";
                        href =  "#"+ href;
                        Clicki.Router.navigate(href,true);
                    }

                });
            });*/

            function theColorSet(type){
                var cN = colors[type];
                var newBgColor = cN.background,newColor = cN.color;
                cache.dom.shower.css({"background-color":newBgColor,color:newColor});
                /*reflow*/
                cache.dom.shower[0].className = cache.dom.shower[0].className;
                cache.tempData.bgcolor = newBgColor;
                cache.tempData.color =newColor;
                cache.tempData.skin = type;
            }

            cache.dom.settingBox.find("div[id]").each(function(i){

                if(i == 0){
                    var ctrlBox = $(this),
                        colors = ctrlBox.find("img"),
                        inputs  =ctrlBox.find("input");

                    $.each(inputs,function(i){

                        switch(""+i){
                            case "0":
                                    cache.dom.nameInput = $(this);
                            break;

                            case "1":
                                    cache.dom.widthInput = $(this);
                                    new scrollPic({"ctrlBar":$(this).prev(),"val":cache.dom.widthInput.val(),"output":cache.dom.widthInput});
                            break;

                            case "2":
                                    cache.dom.heightInput = $(this);
                                    new scrollPic({"ctrlBar":$(this).prev(),"val":cache.dom.heightInput.val(),"output":cache.dom.heightInput});
                            break;

                            case "3":
                                /*确定*/
                                $(this).bind("click",function(){
                                    //cache.tempData.ajax = 1;
                                    cache.tempData.name = cache.dom.nameInput.val();
                                    cache.tempData.setting = {
                                        "width":cache.dom.widthInput.val(),
                                        "height":cache.dom.heightInput.val(),
                                        "color":cache.tempData.color,
                                        "background":cache.tempData.bgcolor,
                                        "skin":cache.tempData.skin
                                    }
                                    delete(cache.tempData.bgcolor);
                                    delete(cache.tempData.color);
                                    cache.tempData.group_id = Clicki.NavView.params.group_id;
									/* type 0 浮动 1 固定*/
                                    cache.tempData.type = 1;
                                    //cache.changeData[cache.nowActive] = cache.tempData;
                                    that.hasChangData= cache.tempData;
                                    cache.tempData = {};
                                    cache.dom.nameInput.val("");
                                    that.sendData(cache.param.urls,function(re){
                                        if(re.error === "+OK"){
											var current = $("div#siteList").html();
                                            alert(current + "\n"+LANG("保存成功")+"");
                                            Clicki.Router.navigate("#/setwidget",true);
                                        }else{
                                            alert(re.error);
                                            Clicki.Router.navigate("#/setwidget",true);
                                        }
                                    });
                                });
                            break;

                            case "4":
                                 /*取消*/
                                $(this).bind("click",function(){
                                    cache.dom.shower.removeAttr("style");
                                    Clicki.Router.navigate("#/setwidget",true);
                                });
                            break;
                        }

                    });

                    /*颜色选择*/
                    $.each(colors,function(){
                        $(this).bind("click",function(){
                            theColorSet(this.className);
                        });
                        if($(this).attr("isSelected")){
                            cache.isSelected = this.className;
                        }
                    });

                }else{
                    cache.dom.shower = $(this);
                    theColorSet(cache.isSelected);
                }
            });
        },
        sendData:function(url,fn){
            //this.hasChangData = {group_id:0,setting:{position:"",skin:"",color:color,width:0,height:0},selected:[],type:0}
            //{group_id:0,setting:{position:"",skin:"",color:color,width:0,height:0},selected:[],type:0};
			$.ajax({
				url:url,
				data:this.hasChangData,
				dataType:"json",
				success:fn,
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
    }

    Clicki.expand("widgetManage",function(o,cb){
        return new widgetManage(o,cb);
    });
});
