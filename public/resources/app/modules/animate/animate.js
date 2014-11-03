(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){
    
    var $ = require("jquery");

    function Anim(config){

        this.config = $.extend({
            /*主控制对象Id或dom*/
            id:null,
            /*动画设定*/
            animate:{
                /*动画类型*/
                type:"pop",
                /*动画持续时间*/
                delay:300,
                /*回调函数*/
                callback:$.noop,
                /*动画配置*/
                config:{
                },
                /*回调函数作用域*/
                scope:null
            }
        },config || {});

        /*操作对象*/
        this.tag = this.config.id && $(
                    typeof(this.config.id) === "string" && ("#"+this.config.id)
                    || this.config.id
                ) || null;
                
        /*受控对象*/
        this.childs = null;

        /*受控对象相关数据缓存*/
        this.childsInfo = null;

        /*操作对象相关数据缓存*/
        this.tagInfo = {
            "width":null,
            "height":null
        };

        /*动画是否正在执行*/
        this.running = false;

        this.body = $("body:first");
        this.document = $(document);
        this.window = $(window);

        /*用于特殊操作的层*/
        this.shadow = "<div data-type='shadow' class='Ex_shadowBox' style='position:absolute;top:-999999em;left:-999999em;'></div>";

        this.init();
    }

    Anim.prototype = {
        init:function(){
            if($(".Ex_shadowBox").length){
                this.shadow = $(".Ex_shadowBox:first");
            }else{
                this.shadow = $(this.shadow);
                this.body.append(this.shadow);
            }
            this.tag && this.fn._getTagInfo.call(this);
            this.config.animate.config && this.fn._setAnimConfig.call(this);
        },
        "fn":{
            /*获取对象*/
            _getTheTag:function(id){
                var tag = $(
                    typeof(this.config.id) === "string" && ("#"+this.config.id)
                    || this.config.id
                );
                if(tag.length){
                    this.config.id = id;
                    this.tag.unbind();
                    this.tag = tag;
                }
            },
            /*获取受控对象及其相应的数值*/
            _getTagChild:function(){
                if(!this.tag || !this.tag.length){
                    return false;
                }
                var config = this.config.animate.config;
                var childs = typeof(config.childs) === "string" && this.tag.find(config.childs)
                            || config.childs.nodeType && $(config.childs)
                            || config.childs.selector && config.childs;

                if(childs.length){
                    this.childsInfo = {};
                    this.childs = childs;

                    $.each(childs,function(i,n){
                        var tag = $(n);
                        tag.attr("data-index",i);
                        !tag.html() && tag.html("&nbsp;");
                        this.fn._getTagInfo.apply(this,[tag,(this.childsInfo[i] = {}),false]);
                    }.bind(this));

                   this.shadow.empty();
                }
            },
            /*获取受控对象相关数据*/
            _getTagInfo:function(tag,saveTo,remove){
                remove = typeof(remove) === "boolean" ?remove : true;
                var tmp = (tag || this.tag).clone();
                this.shadow.append(tmp);
                if(saveTo){
                    saveTo.width = tmp.outerWidth();
                    saveTo.height = tmp.outerHeight();
                }else{
                    this.tagInfo.width = tmp.outerWidth();
                    this.tagInfo.height = tmp.outerHeight();
                }
                remove && tmp.remove();
                tmp = null;
            },
            /*设定动画*/
            _setAnimConfig:function(){
                this.config.animate.config.childs && this.fn._getTagChild.call(this);
                this.fn.animateSetting[this.config.animate.type] && this.fn.animateSetting[this.config.animate.type].call(this);
            },
            /*动画类型*/
            "animateTypes":{
                "pop":{
                    show:function(afterShow,def){
                        this.fn.animateMethods.pop.setPosition.call(this);
                        /*弹出层显示*/
                        if(this.config.animate.config.position === "center"){
                            var offsetFix = this.tag.parent().offset();
                            this.tag.css({top:(function(){
                                //var n = Math.ceil(document.documentElement.clientHeight/2)+ (($.browser.msie||$.browser.mozilla) && document.documentElement || document.body).scrollTop - offsetFix.top;
                                var n = $(window).height()/2+$(window).scrollTop()-150;
                                return n;
                            })(),left:(function(){
                                var n = Math.ceil(document.documentElement.clientWidth/2) - offsetFix.left;
                                return n;
                            })()}).animate({
                                width:this.tagInfo.width+"px",
                                height:this.tagInfo.height+"px",
                                opacity:"show",
                                //marginTop:"-"+Math.ceil(this.tagInfo.height*.5)+"px",
                                marginLeft:"-"+Math.ceil(this.tagInfo.width*.5)+"px"
                            },this.config.animate.delay,function(){
                                $(this).css("height","auto");
                                _.isFunction(afterShow) && afterShow();
                            })
                        }else{
                            this.tag.animate(
                                (
                                    this.config.animate.config.noSetSize && {opacity:"show"}
                                    || {
                                        width:this.tagInfo.width+"px",
                                        height:this.tagInfo.height+"px",
                                        opacity:"show"
                                    }
                                )
                                ,this.config.animate.delay,
                                function(){
                                    $(this).css("height","auto");
                                    _.isFunction(afterShow) && afterShow();
                                }
                            );
                        }

                        if(def){
                            setTimeout(function(){
                                def.resolve();
                            },this.config.animate.delay+50)
                        }
                    },
                    hide:function(afterHide,def){
                        /*弹出层隐藏*/
                        if(this.config.animate.config.position === "center"){
                            this.tag.animate({
                                width:Math.ceil(this.tagInfo.width*.9)+"px",
                                height:Math.ceil(this.tagInfo.height*.9)+"px",
                                opacity:"hide",
                                marginTop:"-"+Math.ceil(this.tagInfo.height*.5)+"px",
                                marginLeft:"-"+Math.ceil(this.tagInfo.width*.5)+"px"
                            },
                            this.config.animate.delay,
                            function(){
                                    _.isFunction(afterHide) && afterHide();
                                }
                            );
                        }else{
                            this.tag.animate(
                                (
                                    this.config.animate.config.noSetSize && {opacity:"hide"}
                                    || {
                                        width:Math.ceil(this.tagInfo.width*.9)+"px",
                                        height:Math.ceil(this.tagInfo.height*.9)+"px",
                                        opacity:"hide"
                                    }
                                ),
                                this.config.animate.delay,
                                function(){
                                    _.isFunction(afterHide) && afterHide();
                                }
                            );
                        }
                        if(def){
                            setTimeout(function(){
                                def.resolve();
                            },this.config.animate.delay+50)
                        }
                    }
                },
                "silde":{
                    left:function(i,def){
                        this.fn.animateMethods.silde.leftAndRight.apply(this,[i,"left",def]);
                    },
                    right:function(i,def){
                        this.fn.animateMethods.silde.leftAndRight.apply(this,[i,"right",def]);
                    },
                    top:function(){

                        /*预留*/
                    },
                    bottom:function(){

                        /*预留*/
                    }
                }
            },
            "animateSetting":{
                "silde":function(){
                     /*
                    受控对象
                    childs:"div[class*='test']",
                    初始显示的受控对象索引，默认为0
                    show:1,
                    运动方向
                    dir:"left"
                    */
                    this.tag.css({
                        "position":"relative",
                        "overflow":"hidden"
                    });
                    this.childsInfo.maxZIndex = this.childs && this.childs.length || 2;
                    if(this.childs){

                        var me = this;

                        this.config.animate.config.show = this.config.animate.config.show || 0;
                        this.config.animate.config.dir = this.config.animate.config.dir || "left";

                        $.each(this.childs,function(i,n){
                            var _ainSet = {};
                            _ainSet[me.config.animate.config.dir] = (
                                (
                                    (i === me.config.animate.config.show && "0")
                                    || (me.tagInfo.width * (i-me.config.animate.config.show))
                                )
                                +"px"
                            );
                            $(n).css({
                                "position":"absolute",
                                "top":0
                            })
                            .animate(
                                _ainSet
                                ,me.config.delay
                            );

                            _ainSet = null;
                        });
                    }
                },
                "pop":function(){

                    /*
                    位置
                    position:"center",
                    位置修正参数
                    fix:{top:20,left:30}
                    */
                    this.fn._getTagInfo.call(this);
                    if(this.config.animate.config.noSetSize){
                        this.tag.css({
                            "display":"none"
                        });
                    }else{
                        this.tag.css({
                            "display":"none",
                            "width":Math.ceil(this.tagInfo.width*.9)+"px",
                            "height":Math.ceil(this.tagInfo.height*.9)+"px"
                        });
                    }
                    

                    this.fn.animateMethods.pop.setPosition.call(this);
                }
            },
            "animateMethods":{
                "pop":{
                    setPosition:function(){
                        var config = this.config.animate.config;
                        function _getTheFix(type){
                            return typeof(config.fix[type]) ==="function" && config.fix[type].call(this) || config.fix[type] || 0;
                        }
                        /*弹出层设置*/
                        if(!config.position || config.position === "center"){
                            /*居中，默认*/
                            this.tag.css({
                                "marginTop":"-"+Math.ceil(this.tagInfo.height*.5)+"px",
                                "marginLeft":"-"+Math.ceil(this.tagInfo.width*.5)+"px"
                            })
                        }else if(typeof(config.position) ==="string" && /^custom\|/.test(config.position)){
                            /*指定位置弹出，custom|{top:100px,left:100px}*/
                            var position = $.parseJSON(config.position.split("|")[1]);
                            this.tag.css({
                                "left":position && position.left+(config.fix && _getTheFix.call(this,"left") || 0),
                                "top":position && position.top+(config.fix && _getTheFix.call(this,"top") || 0)
                            });
                            position = null;
                        }else if(config.position.nodeType || config.position.selector){
                            /*以dom节点为原点*/
                            var tag = $(config.position);

                            var position = this.tag.parent()[0] === this.body[0] && tag.offset() || tag.position();
                            position.top = position.top+tag.outerHeight();
                            
                            this.tag.css({
                                "left":position.left+(config.fix &&  _getTheFix.call(this,"left") || 0),
                                "top":position.top+(config.fix && _getTheFix.call(this,"top")|| 0)
                            });
                            tag = position = null;
                        }
                        this.tag.css({zIndex:11});
                    }
                },
                "silde":{
                    leftAndRight:function(i,type,def){
                        var nowIx = !isNaN(i)?i:this.config.animate.config.show;
                        this.config.animate.config.show = nowIx+1 == this.childs.length ? 0: (nowIx+1);
                        var me = this;
                        //this.config.animate.config.dir = /^(left|right)$/.test(type)?type:"left";
                        $.each(this.childs,function(i,n){
                            var _ainSet = {};
                            _ainSet[me.config.animate.config.dir] = (
                                (
                                    (i === me.config.animate.config.show && "0")
                                    || (me.tagInfo.width * (i-me.config.animate.config.show))
                                )
                                +"px"
                            );
                            $(n).animate(_ainSet,me.config.delay);
                        });
                        if(def){
                            setTimeout(function(){
                                def.resolve();
                            },this.config.animate.delay+50)
                        }
                    }

                }
            },
            "animateStatus":{

            }
        },
        /*执行动画*/
        run:function(action,data){
            if(this.running){
                this.tag.stop();
                this.childs && this.childs.stop && this.childs.stop();
            }
            this.fn.animateTypes[this.config.animate.type] && this.fn.animateTypes[this.config.animate.type][action]
            && $.when((function(me){
                    var def = $.Deferred();
                    me.fn.animateTypes[me.config.animate.type][action].apply(me,[data,def]);
                    return def;
                })(this)).done(
                    typeof(this.config.animate.callback) === "function" && this.config.animate.callback.bind(this.config.animate.scope || this)
                );

            return this;
        },
        /*更改操作对象*/
        setTag:function(id){
            this.fn._getTheTag.call(this,id);
            return this;
        },
        /*更改动画设置*/
        setAnimConfig:function(config){
            this.config.animate = $.extend(this.config.animate,config || {});
            return this;
        }
    }

    Anim.prototype.constructor = Anim;

    return function(config){
        return new Anim(config)
    };
});


