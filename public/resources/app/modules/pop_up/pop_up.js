define(function(require,exports,module){

    var $ = window.$ || window.jQuery || require("jquery");
    var base = require("base");
    var anim = require("animate");
    var Backbone = require("backbone");

    function PopGuy(config){
        
        /*追加容器的id或dom或jq对象*/
        var _id = config.id || null;
        delete config.id;

        /*私有设置，这里应该是关键的属性，方法的配置*/
        var privateConfig = {
            "doms":{
                /*追加容器，默认是追加到Body*/
                "tag":$(
                    typeof(_id) === "string" && ("#"+_id)
                    || _id && (_id.nodeType || _id.selector || _id.jquery) && _id
                    || "body:first"
                ),
                /*弹出层内部dom*/
                "inner":null,
                /*关闭*/
                "closeBnt":null,
                /*完成*/
                "doneBnt":null,
                /*取消*/
                "cancelBnt":null,
                "tmp":null,
                "marker":null,
                /*用于特殊操作的层*/
                "shadow":"<div data-type='shadow' class='Ex_shadowBox' style='position:absolute;top:-999999em;left:-999999em;'></div>"
            },
            "exp":{
                "htmlLabel":/<[^<(*)^>]+>(.|\n)*<\/[^(<\/)(*)^>]+>/g
            },
            autoCloseHandler:null,
            refresh:function(config){
                !this.model && config.model && (this.model = config.model);
                this[config.event] && this[config.event](config.data);
            },
            /*初始化处理函数*/
            initialize:function(){
                this.fn.buildPop.call(this);
                this.fn.bindEvent.call(this);
                this.callParent("status");
                this.callback && this.callback();
            },
            /*更新模块*/
            update:function(data){
                this.model.update();
            },
            /*内部私有方法*/
            "fn":{
                /*构造*/
                buildPop:function(){
                    if(this.ui.width || this.ui.height){
                        var _set = {
                        	//"z-index":50
                        };
                        _set.width = this.ui.width;
                       this.$el.css(_set);
                       _set = null;
                    }
                    //console.log(this.$el.css("z-index"))
                    this.doms.inner = this.inner && (
                            typeof(this.inner) === "string" && this.inner.match(this.exp).length && this.inner
                            || typeof(this.inner) === "string" && $("#"+this.inner).length && $("#"+this.inner)
                            || (this.inner.nodeType || this.inner.selector) && $(this.inner)
                        )
                        || $('<div>♪(´ε｀)</div>');
                    var htm = base.tpl.repLabel(this.tpl.box,1,{
                        "arrow":this.ui.arrow.show && base.tpl.repLabel(this.tpl.arrow,1,{"arrowType":this.ui.arrow.arrowType}) ||"",
                        "title":this.ui.title.show && base.tpl.repLabel(this.tpl.title,1,{"title":this.ui.title.text}) || "",
                        "ctrlbar":this.showCtrl && base.tpl.repLabel(
                                this.tpl.ctrlBar,
                                1,
                                {
                                    "ctrlBarCls":this.ui.ctrlBarCls,
                                    "ok":this.ui.text.ok,
                                    "cancel":this.ui.text.cancel,
                                    "hide":this.ui.text.hide
                                }
                            ) || "",
                        "close":this.showClose && this.tpl.close || "",
                        "innerCls":this.ui.innerCls,
                        "hasTitle":this.ui.title.show && "thereHasTitle" || ""
                    });
                    
                    this.$el.addClass(this.ui.mainCls).append(htm);

                    this.doms.inner = this.$el.find("."+this.ui.innerCls+":first");
                    this.doms.closeBnt = this.$el.find("*[data-do='hide']");
                    this.doms.doneBnt = this.$el.find("*[data-do='ok']");
                    this.doms.cancelBnt = this.$el.find("*[data-do='cancel']");

                    this.doms.tag.append(this.$el);
                    this.$el.attr('data-hasShowed',0);
                    if($(".Ex_shadowBox").length){
                        this.shadow = $(".Ex_shadowBox:first");
                    }else{
                        this.shadow = $(this.shadow);
                        $("body:first").append(this.shadow);
                    }

                    this.doms.inner.css("height", this.ui.height);
                },
                /*事件绑定*/
                bindEvent:function(){
                    this.delegateEvents({
                        /*关闭*/
                        "click *[data-do='hide']":"hide",
                        /*完成*/
                        "click *[data-do='ok']":"done",
                        /*取消*/
                        "click *[data-do='cancel']":"cancel",
                        /*自定义事件*/
                        "click *[data-do='custom']":"onCustom"
                    });
                },
                /*动画执行对象*/
                animateShower:null,
                /*获取显示内容*/
                getContent:function(msg,out){
                    $.when((function(me){
                        var dtd = $.Deferred();
                        var key = null;
                        /*获取内容加载类型*/
                        for(var n in config.type){
                            key = n;
                            break;
                        }
                        /*执行相应操作*/
                        return key === "ajax" && me.methods.ajax.call(me,dtd)
                                || me.methods[key].call(me,dtd) && dtd;
                    })(this)).done(function(){

                        /*操作完成时*/
                        this.fn.animateShower = new anim({
                            "id":this.$el,
                            "animate":this.animate
                        });
                        this.beforeShow(msg,this);
                        !out && this.fn.animateShower.run("show");
                        this.$el.attr('data-hasShowed',1);
                        this.onRender && this.onRender();
                    }.bind(this));
                },
                /*TODO 构造遮罩*/
                buildMarker:function(){},
                /*TODO 设置遮罩*/
                setMarker:function(){},
                /*插入显示内容*/
                _insertContent:function(content){
                    if(this.showCtrl){
                        $(content).insertBefore(this.doms.doneBnt.parent());
                    }else{
                        this.doms.inner.append(content);
                    }
                }
            },
            /*模块支持显示的加载类型*/
            "methods":{
                ajax:function(dtd){
                    /*返回该ajax的Deferred对象*/
                    return $.get(config.type.ajax.url,config.type.ajax.data||{},function(re){

                        this.fn._insertContent.call(this,re);
                        dtd.resolve();

                    }.bind(this)).promise();
                },
                iframe:function(){
                    td.resolve();
                },
                html:function(dtd){
                    this.fn._insertContent.call(this,this.type.html);
                    dtd.resolve();
                },
                dom:function(){
                    dtd.resolve();
                }
            },
            /*完成时*/
            done:function(){
                this.onDone.call(this);
            },
            /*显示*/
            show:function(msg,out){
                /*如果弹出层出来未显示过*/
                if(!+this.$el.attr("data-hasShowed")){
                    this.fn.getContent.apply(this,[msg,out]); 
                }else{
                    this.beforeShow(msg,this);
                    !out && this.fn.animateShower.run("show");
                }
                if(this.showMark){
                    this.doms.marker = $(this.tpl.marker);
                    //TODO 到manager获取新的z-index
                    var z_index = this.ui.zIndex;
                    var theMarker = $(".theMarker");
                    var z_arr = [];
                    if(theMarker.length>0){
                        theMarker.each(function(i){
                            z_arr.push($(this).css("z-index"));
                        });
                        z_arr.sort(function(a,b){return a-b;});
                        z_index = parseInt(z_arr[z_arr.length-1])+2;
                    }
                    
                    var z = z_index+1;
                    this.$el.css("z-index",z);
                    $("body").append(this.doms.marker);
                    this.doms.marker.css({
                        "width":"100%",
                        "height":$(document).height(),
                        "z-index":z_index
                    }).show();
                }else{
                	this.$el.css("z-index",200);
                }
                if(this.autoClose){
                    this.autoCloseHandler = base.ux.hideOnDocumentClick(this.$el,this.hide,this);
                }
                var _left = parseFloat(this.$el.css("left"));
                var _right = parseFloat(this.$el.css("right"));
                if(_left < 0){
                    this.$el.css("left","10px");
                }
                if(_right < 0){
                    var L = _left + _right -10
                    this.$el.css("left",L+"px");
                }
                return this;
            },
            /*隐藏*/
            hide:function(){
                this.autoClose && $(document).unbind("click",this.autoCloseHandler);
                this.fn.animateShower.run("hide",(this.once && this.destroy.bind(this) || null));
                this.onClose.call(this);
                if(this.showMark){
                    this.doms.marker && this.doms.marker.hide(0,function(){
                        this.doms.marker.remove();
                        this.doms.marker = null;
                    }.bind(this));
                }
            },
            /*取消*/
            cancel:function(){
                this.hide();
                this.onCancel.call(this);
                return false;
            },
            /*改变模块状态*/
            changeStatus:function(enabled){

                this.availability =  !!enabled;
            },
            /*销毁*/
            destroy:function(){
                if(this.$el){
                    this.$el.find("*").unbind();
                    this.$el.remove();
                    this.$el = this.doms.inner = this.plugin = null;
                    if(this.doms.marker){
                    	this.doms.marker.remove();
                    }
                }
                
            }
        }

        var viewsConfig = $.extend(true,{
                "tagName":"div",
                /*模板*/
                "tpl":{
                    /*标题*/
                    "title":'<div class="Ex_tipTitle">{title}</div>',
                    "arrow":'<b class="Ex_theTipBoxArrow {arrowType}"></b>',
                    /*弹出层主体*/
                    "box":'{arrow}<div class="Ex_thePopBoxInner">{close}{title}<div class="{innerCls} {hasTitle}">{ctrlbar}</div></div>',
                    /*关闭按钮*/
                    "close":'<em class="Ex_closeTip" data-do="hide"></em>',
                    /*控制栏*/
                    "ctrlBar":'<div class="{ctrlBarCls}"><input type="button" class="Ex_BntIsOk" data-do="ok" value="{ok}" /><input type="button" class="Ex_BntIsFail" data-do="cancel" value="{cancel}" /></div>',
                    "marker":'<div class="theMarker"></div>'
                },
                "ui":{
                    /*主样式*/
                    "mainCls":"Ex_popGuy",
                    /*内部加载容器样式*/
                    "innerCls":"Ex_popGuyInner",
                    /*控制栏样式*/
                    "ctrlBarCls":"Ex_popGuyCtrl",
                    /*按钮上显示的文字*/
                    "text":{
                        "cancel":LANG("取消"),
                        "ok":LANG("确定"),
                        "hide":LANG("关闭")
                    },
                    /*箭头设定*/
                    "arrow":{
                        "show":false,
                        "arrowType":"left"
                    },
                    /*标题设定*/
                    "title":{
                        "show":false,
                        "text":""
                    },
                    /*宽度设定*/
                    "width":260,
                    /*高度设定(不建议设定)*/
                    "height":null,
                    /*marker的z-index*/
                    "zIndex":100
                },
                /*动画设定*/
                "animate":{
                    type:"pop",
                    delay:300,
                    callback:$.noop,
                    config:{
                        "position":"center",
                        "fix":null
                    }
                },
                "type":{
                    /*弹出层内部显示的内容。可以是字符串，也可以是某Dom*/
                    /*弹出层类型具体设定*/
                    //"html":'<div>测试用</div>'
                },
                /*是否显示遮罩*/
                showMark:false,
                /*是否为一次性弹出层*/
                "once":false,
                /*是否显示关闭按钮*/
                showClose:true,
                /*是否显示控制栏*/
                showCtrl:false,
                /*插件*/
                plugin:null,
                /*自动关闭*/
                autoClose:true,
                /*回调函数*/
                callback:null,
                /*加载完成后执行函数*/
                onRender:null,
                /*data-do="ok"标签时的执行函数*/
                onDone:$.noop,
                /*data-do="hide"标签时的执行函数*/
                onClose:$.noop,
                /*data-do="cancel"标签时的执行函数*/
                onCancel:$.noop,
                /*data-do="custom"标签时的执行函数*/
                onCustom:$.noop,
                /*debug模式*/
                debug:false,
                beforeShow:$.noop,
                /*view相关交互状态的操作函数*/
                "status":{
                    "onLoadStart":function(){},
                    "onLoadCancel":function(){},
                    "onLoadSuccess":function(){},
                    "onLoadFail":function(){},
                    "onHover":function(){},
                    "onActive":function(){},
                    "onNormal":function(){},
                    "onVisited":function(){},
                    "onEnabled":function(){},
                    "onDisabled":function(){}
                },
                /*状态*/
                availability:true
            },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }

    PopGuy.prototype.constructor = PopGuy;

    return function(config){
        return new PopGuy(config);
    }
});