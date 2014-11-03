(function(factory){
    if(typeof(define) === "function"){
        define([],factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var $ = window.$ || window.jQuery || require("jquery");
    var _scroller;

    function scroller(config){

        this.config = $.extend(true,{
            "ux":{
                /*滚动条样式*/
                "cls":{
                    "top":{
                        "block":"Ex_topScrollerBlock",
                        "bar":"Ex_topScrollerBar"
                    },
                    "left":{
                        "block":"Ex_leftScrollerBlock",
                        "bar":"Ex_leftScrollerBar"  
                    }
                },
                /*滚动外部容器样式*/
                "style":{
                    "overflow":"hidden",
                    "position":"relative"
                }
            },
            /*滚动条模板*/
            "tpl":'<div class="{bar}"><div class="{block}"></div></div>',
            /*滚动容器子标签名*/
            "el":"li",
            /*滚动容器子标签选择器，默认是跟指定的子容器标签名一致。如果有多次嵌套则需要重新指定*/
            "elSelector":null,
            /*滚动形式*/
            "type":"top",
            /*容器紧邻的前一个标签*/
            "prev":null,
            /*容器父层标签*/
            "parentNode":null,
            /*容器紧邻的下一个标签*/
            "nextNode":null,
            /*容器高度*/
            "height":null,
            /*容器宽度*/
            "width":null,
            /*元素高*/
            "itemHeight":null,
            /*元素宽*/
            "itemWidth":null,
            /*元素数量*/
            "itemsNum":0,
            /*每次显示的子标签数量*/
            "showNum":10,
            /*自动重置相关设置*/
            "autoLayout":false,
            /*滚动步长*/
            "scrollrate":100,
            /*是否一直显示滚动条*/
            "showScroller":false,
            /*滚动时的回调函数*/
            "onScroll":$.noop,
            /*拖动开始的回调函数*/
            "onStarDrag":$.noop,
            /*拖动结束的回调函数*/
            "onStopDrag":$.noop
        },config || {});

        !this.config.elSelector && (
            this.config.elSelector = ">"+this.config.el
        );

        /*获取数值用的隐藏层*/
        this.shadowBox = null;
        if($(".Ex_shadowBox:first").length){
            this.shadowBox = $(".Ex_shadowBox:first");
        }else{
            this.shadowBox = $('<div class="Ex_shadowBox"></div>');
            this.shadowBox.css({
                "position":"absolute",
                "left":"-999999em",
                "top":"-999999em",
                "display":"block"
            });
            $("body").append(this.shadowBox);
        }
        /**
         * 0为单个模式，1为多重模式
         * @type {Number}
         */
        this.sType = 1;

        var _id;

        /**
         * 获取指定的dom
         * @param   {Mix} id 
         * @return  {jQuery Object}    jq对象
         * @private
         */
        function _getTag(id){
            return typeof(id) === "string" && $("#"+id)
                    || (id.nodeType || id.selector || id.jquery) && $(id);
        }

        /**如果id是数组的话则开启多重控制模式*/
        if($.isArray(this.config.id)){
            _id = [];
            for(var i = 0;i<this.config.id.length;i++){
                var _dom = _getTag(this.config.id[i]);
                if(!_dom.attr("id")){
                    _dom.attr("id","scroller_tmpView"+i);
                }
                _id.push(_dom);
            }
            this.sType = 0;
        }else{
            _id = _getTag(this.config.id);
        }

        delete(this.config.id);

        /*dom缓存*/
        this.dom = {
            "main":_id,
            "block":null,
            "bar":null,
            "box":null
        }

        /*容器紧邻的前一个标签*/
        this.dom.box = this.dom.main.children(":first");
        var elLen = this.dom.box.find(this.config.el).length;

        (elLen<=10 && !config.showNum) && (this.config.showNum = elLen);

        /*数值缓存*/
        this.cache = null
        /*滚动条移动比例*/
        this.setp = null;

        this.fn._setCache.call(this);

        this.dom.main.height(this.cache.mainHeight);

        /*拖拽需要的数值缓存*/
        this.data = {
            dX:0,
            oX:0,
            fX:0,
            dY:0,
            oY:0,
            fY:0,
            min:0,
            vMax:null,
            hMax:null
        }

        /*事件处理程序*/
        this.eventHandler = {
            "mousemove":null,
            "mouseup":null,
            "mousescroll":null
        };

        /*是否正在滚动*/
        this.scrolling = false; 

        /*滚动条自动隐藏计时器*/
        this.fadeTimer = null;

        this.ready = false;

        this.init();

        elLen = mT = null;
    }
    
    scroller.prototype = {
        init:function(){
            this.fn._build.call(this);
            this.fn._bindEvent.call(this);
            this.ready = true;
        },
        /**
         * 拖动开始
         * @param  {Object} ev    鼠标事件对象
         * @return {Undefined}    无返回值
         */
        starDrag:function(ev){
            this.scrolling = true;
            if (document.selection) {
                if (document.selection.empty){
                    document.selection.empty();
                }else{
                    document.selection = null;
                }
            }else if(window.getSelection) {
                window.getSelection().removeAllRanges();
            }

            this.fn._rolling.call(this,ev);
        },
        /**
         * 拖动结束处理函数
         * @param  {Object} ev    鼠标事件对象
         * @return {Undefined}    无返回值
         */
        stopDrag:function(ev){
            $(document)
            .unbind("mousemove",this.eventHandler.mousemove)
            .unbind("mouseup",this.eventHandler.mousemove);
            this.eventHandler = {
                "mousemove":null,
                "mouseup":null
            };
            this.scrolling = false;
            this.config.onStopDrag();
        },
        /**
         * 重置缓存并重新设定滚动条
         *     如autoLayout不为真，则需要在改变成员数量后需要调用该方法
         * @param  {Boolean}    reset 是否重置滚动条位置
         * @return {Undefined}  无返回值
         */
        doLayout:function(reset){
            this.config.autoLayout && clearTimeout(this.timer);
            this.fn._setCache.call(this);
            this.fn._setScroll.call(this,reset);
            this.config.autoLayout && this.fn._doAutoLayout.call(this);
        },
        /**
         * 外部滚动接口
         * @param  {Boolean|Number} direction   滚动方向或滚动次数
         * @return {Object}                     scroller实例对象
         */
        scroll:function(direction){
            this.doLayout();
            this.fn._mouseScroll.call(this,+direction);
        },
        "fn":{
            /**
             * 滚动条构造及设定函数
             * @return  {Undefined} 无返回
             * @private
             */
            _build:function(){
                var tpl = ""+this.config.tpl;
                tpl = tpl.replace(/\{bar\}/,this.config.ux.cls[this.config.type].bar).replace(/\{block\}/,this.config.ux.cls[this.config.type].block);
                tpl = $(tpl);
                this.dom.main.css(this.config.ux.style).append(tpl);
                this.dom.box.css({
                    "position":"absolute",
                    "top":0,
                    "left":0
                    // ,"width":this.cache.mainWidth
                })
                /*鼠标向下滚动的次数*/
                .attr("data-mscroll",0);

                this.dom.bar = tpl;
                this.dom.block = tpl.children("div:first");

                this.fn._setScroll.call(this);
                // this.dom.main.css("display",this.config.displayState);
                this.dom.main.append(this.dom.bar);
            },
            /**
             * 事件绑定
             * @return  {Undefined} 无返回值
             * @private
             */
            _bindEvent:function(){
                var me = this;
                /*滚动条显示/隐藏*/
                if(
                    this.config.showScroller 
                ){
                    if(this.cache.itemsNum > this.config.showNum){
                        this.dom.bar.show();
                    }
                }else{
                    this.dom.main.hover(
                        function(){
                            if(!me.config.showScroller){
                                return false;
                            }
                            if(me.fadeTimer !== null){
                                clearTimeout(me.fadeTimer);
                                me.fadeTimer = null;
                            }else{
                                me.fn._chkRealSize.call(me) && me.dom.bar.stop(true,true).fadeIn(600);
                            }
                        },
                        function(){
                            if(!me.config.showScroller){
                                return false;
                            }
                            if(!me.fadeTimer){
                                me.fadeTimer = setTimeout(function(){
                                    me.fadeTimer = null;
                                    !me.scrolling && me.dom.bar.stop(true,true).fadeOut(600);
                                },500);
                            }
                        }
                    );
                }
                
                /*滚轮事件绑定*/
                this.eventHandler.mousescroll = function(ev){
                    this.fn._mouseScroll.call(this,!Math.max(0,Math.min(1,ev.wheelDelta || ev.detail&& -(ev.detail))));
                    return false;
                }.bind(this);
                this.dom.main
                    .bind("DOMMouseScroll",this.eventHandler.mousescroll)
                    .bind("mousewheel",this.eventHandler.mousescroll);

                /*滚动快拖拽事件*/
                this.dom.block.bind("mousedown",function(ev){

                    me.data.dX = me.dom.block.position().left;
                    me.data.oX = ev.pageX - this.offsetLeft;

                    me.data.dY = me.dom.block.position().top;
                    me.data.oY = ev.pageY - this.offsetTop;

                    me.eventHandler.mousemove = function(ev){
                        this.starDrag(ev);
                    }.bind(me);

                    me.eventHandler.mouseup = function(ev){
                        this.stopDrag(ev);
                    }.bind(me);

                    $(document).bind("mousemove",me.eventHandler.mousemove);
                    $(document).bind("mouseup",me.eventHandler.mouseup);
                });

                if(this.config.autoLayout){
                    this.fn._doAutoLayout.call(this);
                }
            },
            /**
             * 自动渲染滚动条
             * @return  {Undefined} 无返回值
             * @private
             */
            _doAutoLayout:function(){
                var me = this;
                this.timer = setTimeout(function(){
                    var _type = me.config.type=="top" && "height" || "width";
                    if(
                        me.ready && (
                            me.dom.box.find(me.config.elSelector).length !== me.cache.itemsNum 
                                || me.cache.itemsNum > me.config.showNum && (me.dom.bar[_type]() <= me.dom.block[_type]())
                        )
                    ){
                        me.doLayout();
                    }
                    me.timer = setTimeout(arguments.callee,500);
                },500);
            },
            /**
             * 拖拽处理函数
             * @param   {Object} ev    鼠标事件对象
             * @return  {Undefined}    无返回
             * @private
             */
            _rolling:function(ev){
                var type = this.config.type;
                var data = this.data;
                var diff, max, moveSize, item;
                if (type == 'top'){
                    diff = ev.pageY - data.oY;
                    max  = data.vMax;
                    moveSize = data.moveVMax;
                    item = -this.cache.itemHeight;
                }else {
                    diff = ev.pageX - data.oX;
                    max  = data.hMax;
                    moveSize = data.moveHMax;
                    item = -this.cache.itemWidth;
                }
                if (diff <= data.min){
                    diff = data.min;
                }else if (diff > max){
                    diff = max;
                }

                if (type == 'top'){
                    data.fX = diff;
                }else {
                    data.fY = diff;
                }

                moveSize = -Math.max(0, Math.round(diff / max * moveSize));
                this.dom.block.css(type, diff);
                this.dom.box.css(type, moveSize).attr("data-mscroll", Math.round(moveSize/item));
                this.config.onStarDrag(type, moveSize + 'px');

                // var RR = R[this.config.type]/this.setp;
                
                // RR = RR <= 0?0:Math.round(
                //     (R[this.config.type]/this.setp)
                // );
                // this.dom.box.css(this.config.type,("-"+RR+"px"));
                // this.config.onStarDrag(this.config.type,("-"+RR+"px"));
            },
            /**
             * 鼠标滚轮事件处理函数
             * @param   {Boolean|Number}  direction 滚动方向
             * @param   {Boolean}         reset     是否重置
             * @return  {Undefined}                 无返回值
             * @private
             */
            _mouseScroll:function(direction,reset){
                var current;
                var aniSet = {},aniSet2={};
                if(this.config.type == "top"){
                    var sTime = 0
                        ,offset = 0;
                    if(reset){
                        this.dom.box.stop().attr("data-mscroll",0);
                    }else{
                        /*direction为true或1时鼠标下滚，data-mscroll +1，反之-1*/
                        sTime = +(this.dom.box.attr("data-mscroll"))+(
                            (direction >1 || direction < 0) && direction 
                            || direction && 1 || -1
                        );

                        sTime = sTime<0?0:sTime>(this.cache.itemsNum-this.config.showNum)?this.cache.itemsNum-this.config.showNum:sTime;

                        this.dom.box.stop().attr("data-mscroll",sTime);

                        offset = this.cache[
                            this.config.type === "top" && "itemHeight"
                                || "itemWidth"
                        ]*(+this.dom.box.attr("data-mscroll"));
                    }
                     
                    aniSet[this.config.type] = 0-offset+"px";
                    aniSet2[this.config.type] = offset*this.setp+"px"; 
                }else{
                    var limit,sTime = 0;
                    if(reset){
                        current = 0;
                        this.dom.box.stop().attr("data-mscroll",sTime);
                    }else{
                        var limit = this.cache.mainWidth - this.cache.boxWidth;
                        var sTime = +(this.dom.box.attr("data-mscroll"))+(
                                (direction >1 || direction < 0) && direction 
                                || direction && 1 || -1
                            );

                        sTime = sTime<0?0:sTime>(this.cache.itemsNum-this.config.showNum)?this.cache.itemsNum-this.config.showNum:sTime;

                        this.dom.box.stop().attr("data-mscroll",sTime);

                        if(!this.dom.box.position().left && limit>0){
                            return false;
                        }
                        var left = this.dom.box.position().left;
                        if(direction){
                            current = Math.abs(left - limit) < this.config.scrollrate?limit:left - this.config.scrollrate;
                        }else{
                            current = Math.abs(left - 0) < this.config.scrollrate?0:left + this.config.scrollrate;
                        }
                    }
                    
                    aniSet[this.config.type] = current+"px";
                    aniSet2[this.config.type] = current*(-this.setp)+"px"; 
                }

                this.dom.block.stop().animate(aniSet2,100);
                this.dom.box.stop().animate(aniSet,100);
                this.config.onScroll(this.config.type,aniSet,aniSet2);
            },
            /**
             * 重置缓存
             * @private
             */
            _setCache:function(){
                var fels = this.dom.box.find(this.config.elSelector).eq(0)
                    ,oldCache = $.extend({},this.cache || {})
                    ,typeTop = (this.config.type == 'top');

                this.oldCache = oldCache;

                var state = this.dom.main.css("display");
                if (state == 'none') this.dom.main.css('display', 'block');

                var num = !fels.length?0:fels.parent().children(this.config.el).length || this.config.itemsNum;
                var boxH = this.dom.box.outerHeight(true);
                var boxW = this.dom.box.outerWidth(true);
                var itemH = this.config.itemHeight || Math.round(boxH / num);
                var itemW = this.config.itemWidth || Math.round(boxW / num);

                if (state == 'none') this.dom.main.css('display', state);

                this.cache = {
                    "elHeight":oldCache.elHeight || null,
                    "elWidth":oldCache.elWidth || null,
                    "boxHeight":boxH,
                    "boxWidth":boxW,
                    "itemHeight":itemH,
                    "itemWidth":itemW,
                    "itemsNum":num,
                    "mainHeight":this.config.height || (typeTop && this.config.showNum && itemH * this.config.showNum) || this.dom.main.height(),
                    "mainWidth":this.config.width || (!typeTop && this.config.showNum && itemW * this.config.showNum) || this.dom.main.width()
                }

                var mT = parseFloat(this.dom.box.find(this.config.el+":first").css("margin-top"));
                this.cache.mainHeight = !isNaN(mT)&& this.cache.mainHeight+mT || this.cache.mainHeight;

                this.setp = typeTop ? (this.cache.mainHeight / this.cache.boxHeight) : (this.cache.mainWidth / this.cache.boxWidth);
            },
            /**
             * 重新设定滚动条
             * @param {Boolean} reset 是否重置滚动条位置
             * @private
             */
            _setScroll:function(reset){
                var cache = this.cache;

                if(this.config.type=="top"){
                    this.dom.bar.height(cache.mainHeight);
                    this.dom.block.height(Math.max(15, Math.floor(cache.mainHeight * this.setp)));
                }else{
                    this.dom.bar.width(cache.mainWidth);
                    this.dom.block.width(Math.max(15, Math.floor(cache.mainWidth*this.setp)));
                }

                cache.elHeight = this.dom.block.outerHeight();
                cache.elWidth = this.dom.block.outerWidth();
                
                this.data.vMax = Math.floor(cache.mainHeight - cache.elHeight);
                this.data.hMax = Math.floor(cache.mainWidth - cache.elWidth);

                this.data.moveVMax = cache.boxHeight - cache.mainHeight;
                this.data.moveHMax = cache.boxWidth - cache.mainWidth;

                if(this.ready){
                    if(cache.itemsNum > this.config.showNum){
                        this.dom.bar.show();
                    }else{
                        this.dom.bar.hide();
                    }
                    if(reset){
                        this.fn._mouseScroll.apply(this,[0,1]);
                    }else{
                        this.fn._mouseScroll.call(this, this.oldCache.itemsNum > cache.itemsNum ? 0 : 1);
                    }
                }
                
            },
            /**
             * 检测是否需要显示滚动条
             * @return  {Boolean} 当返回true时则需要显示滚动条
             * @private
             */
            _chkRealSize:function(){
                return this.config.type === "top" && this.dom.box.children(this.config.el).length * this.cache.itemHeight > this.cache.mainHeight
                        || this.dom.box.children(this.config.el).length * this.cache.itemWidth > this.cache.mainWidth;
            }
        }
    }

    scroller.prototype.constructor = scroller;

    return _scroller = {
        name:"Scroller",
        init:function(config){
            return new scroller(config);
        }
    }
});


