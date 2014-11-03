define(function(require,exports,module){
    var $ = require("jquery");
    var _F = require("format");
    var drag = require("/resources/app/modules/drag/drag");

    /*默认参数*/
    var defSetting = {
        /*默认弹出层类型（有箭头）*/
        boxType:"normal",
        marker:true,
        width:600,
        fix:5,
        screenHeight:window.screen.availHeight,
        screenWidth:window.screen.availWidth
    }

    //var $ = require("jquery");

    function tip(config){

        this.tipBoxId = config.random && ("clickiTipBox"+Math.ceil(Math.random()*10000)) || "clickiTipBox";
        /*模板*/
        this.tipTpl = "<div id=\""+this.tipBoxId+"\" class=\"G-thePopTip\"><b class=\"theTipBoxArrow\"></b><div class=\"thePopBoxInner\"><div class=\'tipTitle\'></div><em class=\"closeTip\"></em><div class=\'tipContent popTipIsLoading\'></div></div><div id=\"tipHideBox\" style=\"display:none\"></div></div>";
        this.markerTpl = "<div id=\"tipMarker\" class=\"theMarker\" style=\"display:none;height:966px;\"></div>";
        /*原始设定*/
        this.originalConfig = (function(){
            var innerOriginalConfig = $.extend({},config);
            return innerOriginalConfig;
        })();

        this.layout = config.layout && config.layout || Clicki.manager;

        /*处理完的设定*/
        this.config = _F.interfaceSettingFormat(config,config.data);
        /*扁平化原始数据*/
        this.flatData = {};

        /*主容器*/
        this.tipBox = $("#"+this.tipBoxId);
        if(this.tipBox.length === 0){
            this.tipBox = $(this.tipTpl);
            $("body").append(this.tipBox);
        }
        this.config.drag = typeof(config.drag) === "boolean" && config.drag || true;
        /*隐藏用的box*/
        this.tipHideBox = this.tipBox.find("#tipHideBox:first");
        /*标题dom*/
        this.tipTitle = this.tipBox.find(".tipTitle:first");
        /*内容dom*/
        this.tipContent = this.tipBox.find(".tipContent:first");
        /*关闭按钮dom*/
        this.closeBnt = this.tipBox.find(".closeTip:first");
        /*箭头*/
        this.arrow = this.tipBox.find(".theTipBoxArrow:first");
        this.arrow.addClass("arrowLeft");

        /*遮罩dom*/
        /*是否显示遮罩*/
        this.marker = this.config.marker||defSetting.marker;
        this.tipMarker = this.marker ? $('#tipMarker') : "";
        this.tipMarker && this.tipMarker.length === 0 && (this.tipMarker = $(this.markerTpl)) && ($("body").append(this.tipMarker));
        
        this.setOptions();
        this.ready = false;
        /*模块列表(暂时只支持charts）*/
        this.apps = [];
        this.init();
    }

    tip.prototype = {
        /*初始化函数*/
        init:function(){
            if(this.config.data){
                this.formatData();
                this.config.params = this.config.params || {};
            }
            this.render();
            this.bindEvent();
        },
        /*发送数据处理*/
        formatData:function(){
            var data = {};
            for(var n in this.config.data){
                if(n.match(/[A-Z]/)===null && n.toLowerCase().indexOf("dom") === -1 && n !== "sub"){
                    data[n] = this.config.data[n];
                }
            }
            //this.config.params.data = data;
            this.flatData = data;
            this.getFlatData();

        },
        /*扁平化数据处理*/
        getFlatData:function(){
            function getData(data,cache){
                cache = cache||{};
                function shell(obj){
                    for(var n in obj){
                        if(!(n in cache) && $.isPlainObject(obj[n])){
                            arguments.callee(obj[n]);
                        }else{
                            cache[n] = obj[n]
                        }
                    }
                }
                shell(data,cache);
                return cache;
            }
            this.flatData = getData.call(this,this.flatData);
        },
        /*显示*/
        show:function(pos){
            if(this.boxType === "normal"){
                var boxH = this.tipBox.outerHeight();
                var tooTop = (pos.top + boxH) > $(document).height();
                /*显示在上面*/
                if(tooTop){
                    _rTop = pos.top - boxH+60;
                    this.arrow.css("top",boxH-56);
                /*显示在下面*/
                }else{
                    _rTop = pos.top;
                    this.arrow.css("top","1em");
                }
                /*设置top*/
                this.tipBox.css("top",_rTop);
                this.tipBox.css("z-index","9");
                /*任意点击关闭poptip*/
                var closPopTip = function(event){
                    if($(event.target).closest("#"+this.tipBox.attr("id")).length === 0){
                        this.hide();
                        $(document).unbind("click","closPopTip");
                    }
                }
                $(document).bind("click",closPopTip.bind(this));
            }
            if(this.boxType === "center"){
                /*设置高度居中*/
                var _rTop = $(document).scrollTop() + 140;
                this.tipBox.css("top",_rTop);
                this.tipBox.css("z-index","9");

            }
            /*遮罩*/
            this.tipMarker && this.tipMarker.height($(document).height()).show();
        },
        /*隐藏*/
        hide:function(){
            this.tipBox.css({
                top:"-99999em",
                left:"-99999em",
                "z-index":0
            });
            if(this.apps.length){
                $.each(this.apps,function(i,n){
                    this.tipHideBox.append(n.target);
                }.bind(this));
            }
            this.config.drag.config.el.unbind();
            this.apps = [];
            this.tipMarker && this.tipMarker.hide();
            this.config.afterClose&&this.config.afterClose.call(this);
        },
        /*更新*/
        update:function(upConfig){
            this.config = $.extend(this.config,upConfig);
            //this.config = upConfig;
            if(upConfig.data){
                this.formatData()
                this.config.params = this.config.params || {};
                this.config = _F.interfaceSettingFormat(this.config,upConfig.data);
            }
            this.setOptions();
            this.getFlatData();
            this.render();
        },
        /*渲染*/
        render:function(){
            if(this.config.drag && !this.config.drag.ready){
                this.config.drag = drag.init({
                    "sIndex":1000005,
                    "tag":this.tipBox,
                    "parent":this,
                    "refer":this.tipBox,
                    "el":this.tipTitle
                });
                this.config.drag.ready = true;
                this.config.drag.bindToEl = "title";
            }
            /*有target不需要显示title(但需要格式化)*/
            if(this.config.title){
                if(this.config.dirty){
                    this.config.title = this.originalConfig.title;
                }
                this.config.title = _F.formatStr(this.config,"title",this.flatData,true);
                this.tipTitle.html(this.config.title);
                this.tipContent.removeClass("popTipNoTitle");
                this.tipTitle.show();
                if(this.config.drag && this.config.drag.ready){
                    this.config.drag.changeEl(this.tipTitle);
                    this.config.drag.bindToEl = "title";
                }
            }else{
                this.tipContent.addClass("popTipNoTitle");
                this.tipTitle.hide();
            }
            this.tipContent.addClass("popTipIsLoading");
            this.show(this.nowPos);
            if(this.ready){
                this.tipContent.find("*").unbind().empty();
                this.tipContent.addClass("popTipIsLoading");
            }
            if(this.config.url){
                $.get(this.config.url,this.config.params,function(re){
                        this.tipContent.removeClass("popTipIsLoading").html(re);
                        if(!this.ready){
                            this.ready = true;
                        }
                }.bind(this),"html");
                
            }else if(this.config.html){
                this.tipContent.removeClass("popTipIsLoading").html(this.config.html);
                if(!this.ready){
                    this.ready = true;
                }
            }else if(this.config.target){
                /*获取各个模块的名字*/
                var appsName = this.config.target.split(","),chObj;
                for(var i = 0,len = appsName.length;i<len;i++){
                    /*获取模块实例*/
                    chObj = this.layout[
                        this.layout.getApp && "getApp"
                        || "get"
                    ](appsName[i]);
                    if(chObj){
                        this.apps.push(chObj);
                    }
                }
                /*循环实例，根据参数更新模块*/
                if(this.apps.length > 0){
                    $.each(this.apps,function(i,n){
                        n.reDraw && n.reDraw(this.config.params,this.config.title);
                        this.tipContent.empty().removeClass("popTipIsLoading").append(n.target);
                    }.bind(this));
                }
                this.tipTitle.hide();
                this.tipContent.addClass("popTipNoTitle");

                if(!this.ready){
                    this.ready = true;
                }
                /*if(this.config.drag && this.config.drag.ready && this.config.drag.bindToEl == "title"){
                    this.config.drag.changeEl(this.tipBox);
                    this.config.drag.bindToEl = "box";
                }*/
            }
        },
        /*参数设定*/
        setOptions:function(){
            /*主容器设定*/
            this.width = this.config.width||defSetting.width;
            this.tipBox.css("width",this.width);
            /*高度为可选，不推荐强行设定*/
            this.config.height && this.tipContent.css("height",this.config.height);
            /*有样式的话*/
            this.config.cls && this.tipBox.addClass(this.config.cls);

            /*是否有设定类型*/
            this.boxType = this.config.boxType||defSetting.boxType;

            /*当前鼠标点击的对象*/
            this.el = this.config.event && $(this.config.event.target) || $("body");
            /*位置修正参数*/
            this.fix = this.config.fix||defSetting.fix;

            /*相关尺寸*/
            this.sizeOptions = {
                elWidth:this.el.outerWidth(true),
                elHeight:this.el.outerHeight(true),
                boxWidth:this.tipBox.outerWidth(true),
                boxHeight:this.tipBox.outerHeight(true),
                docWidth:$(document).width(),
                docHeight:$(document).height(),
                arrWidth:this.arrow.outerWidth(true),
                arrHeight:this.arrow.outerHeight(true)
            }

            /*位置*/
            this.nowPos = this.el.offset();
            this.nowPos.left = this.nowPos.left + this.sizeOptions.elWidth;
            this.nowPos.top = this.nowPos.top - this.fix;
            /*设置left*/
            if(this.boxType === "normal"){
                if(this.nowPos.left+this.sizeOptions.boxWidth > this.sizeOptions.docWidth){
                    this.nowPos.left = this.nowPos.left - this.sizeOptions.elWidth - this.sizeOptions.boxWidth-this.sizeOptions.arrWidth;
                    this.arrow.removeClass("arrowLeft").addClass("arrowRight");
                }else{
                    this.arrow.removeClass("arrowRight").addClass("arrowLeft");
                }
                this.tipBox.css("left",this.nowPos.left + 5);
            }
            if(this.boxType === "center"){
                if(this.config.drag){
                    this.tipBox.css("left",((this.sizeOptions.docWidth/2)-(this.width/2)).toFixed(0)+"px");
                }else{
                    this.tipBox.css("margin-left",-(this.width/2));
                    this.tipBox.css("left","50%");
                }
                this.arrow.hide();
            }
        },
        /*事件绑定*/
        bindEvent:function(){
            $(window).keydown(function(event){
                if (event.keyCode == 27){
                    this.hide();
                }
            }.bind(this));
            this.closeBnt.bind("click",this.hide.bind(this));
        }

    }

    return {
        name:"Pop Tip",
        init:function(config,callback){

            var _config = $.extend({},config);
            return new tip(_config,callback);
        }
    }

});