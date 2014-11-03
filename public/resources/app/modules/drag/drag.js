(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var $ = window.$ || window.jQuery || require("jquery");
    var _drag;

    function drag(config){
        
        this.config = $.extend({
            /*绑定至*/
            "el":$(document),
            /*是否允许多个浮动层*/
            "plural":false,
            /*起始zIndex*/
            "sIndex":1,
            "tag":null,
            "refer":null,
            /*浮动层模板*/
            "tpl":'<div id="popArea{rid}" data-index="{ix}"></div>',
            "keepMove":true,
            /*拖动时的附加操作*/
            "onStar":null,
            /*停止拖动时的附加操作*/
            "onStop":null,
            /*鼠标按下时的附加操作*/
            "onDo":null,
            /*归属*/
            "parent":null,
            "disabled":false
        },config);

        this.config.refer && (this.config.refer = $(this.config.refer));
        
        /*结束坐标*/
        this.fX = 0;
        this.fY = 0;
        /*起始坐标*/
        this.oX = 0;
        this.oY = 0;
        /*是否正在拖动*/
        this.doing = false;
        /*序号*/
        this.index = 0;
        /*当前激活的层*/
        this.nowPop = null;
        /*浮动层缓存*/
        this.pops = {};

        this.init();
    }
    
    drag.prototype = {
        init:function(re){
            if(this.config.disabled){
                return this;
            }
            this.doBind();
        },
        changeEl:function(el){

            this.config.el.unbind();

            this.config.el = el;

            /*结束坐标*/
            this.fX = 0;
            this.fY = 0;
            /*起始坐标*/
            this.oX = 0;
            this.oY = 0;

            this.doBind();
        },
        /*绑定*/
        doBind:function(){
            this.config.el.bind("mousedown",(function(s){
                var me = s;
                return function(ev){
                    me.doDrag.apply(me,[ev,this]);
                }
            })(this));
        },
        /*随机id*/
        getRid:function(){
            return Math.ceil(Math.random()*10000)+998;
        },
        /*开始拖动*/
        starDrag:function(ev){

            if(!this.doing){
                return false;
            };

            /*取消选中文章状态*/
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); 
            
            /*坐标获取*/
            var _x = (ev.pageX || event.clientX),
                _y = (ev.pageY || event.clientY);

            this.fX = Math.max(
                0,
                Math.min(
                    _x + (this.config.refer && this.rX || 0),
                    $(document).width()-this.nowPop.outerWidth()
                )
            );

            this.fY = Math.max(
                0,
                Math.min(
                    _y + (this.config.refer && this.rY || 0),
                    $(document).height()-this.nowPop.outerHeight()
                )
            );

            this.config.onStar && this.config.onStar.call(this);

            if(this.config.keepMove){
                this.nowPop.css({
                    left:this.fX,
                    top:this.fY
                })
            }
            
            return false;
        },
        /*停止拖动*/
        stopDrag:function(ev){
            if(this.doing == false){
                return false
            };
            this.config.onStop && this.config.onStop.call(this);
            this.doing = false;
        },
        /*开搞*/
        doDrag:function(ev,el){

            this.doing = true;
            
            this.config.onDo && this.config.onDo.call(this);

            if(this.config.plural){
                this.nowPop = $(this.buildPop());
                this.pops[this.nowPop.attr("id")] = this.nowPop;
                $("body:first").append(this.nowPop);
                this.index += 1;
            }else if(!this.nowPop){
                this.nowPop = $(this.config.tag || this.buildPop());
                $("body:first").append(this.nowPop);
            }

            /*原始数据*/
            this.oX = (ev.pageX || event.clientX);
            this.oY = (ev.pageY ||event.clientY);

            this.rY = this.config.refer && this.config.refer.offset().top - this.oY;
            this.rX = this.config.refer && this.config.refer.offset().left - this.oX;

            this.nowPop.css({
                "top":(this.config.refer && this.config.refer.offset().top || this.oY)+"px",
                "left":(this.config.refer && this.config.refer.offset().left || this.oX)+"px",
                "z-index":this.config.sIndex
            });


            this.config.plural && (this.config.sIndex++);

            $(document).bind("mousemove",(function(s){
                var me = s;
                return function(ev){
                    me.starDrag.call(me,ev);
                }
            })(this)).bind("mouseup",(function(s){
                var me = s;
                return function(ev){
                    /*解除事件绑定*/
                    $(document).unbind("mousemove").unbind("mouseup");
                    me.stopDrag.call(me,ev)
                }
            })(this));

            ev.stopPropagation();
        },
        /*生成结构*/
        buildPop:function(restr){
            restr = restr || {};
            restr.ix = this.index+1;
            restr.rid = this.getRid()+1;
            var str = ""+this.config.tpl;
            var labels = str.match(/\{\w+\}/g);
            var newLabels = [];
            for(var i = 0,len = labels.length,tmp;i<len;i++){
                tmp = ""+newLabels;
                if(tmp.indexOf(labels[i]) === -1){
                    newLabels.push(labels[i]);
                }
            }
            labels = newLabels;
            newLabels = null;
            for(var i = 0,len = labels.length,n;i<len;i++){
                n = labels[i].match(/\w+/g);
                n = n && n[0] || "";
                str = str.replace(new RegExp(labels[i],["g"]),restr[n]);
                n = null;
            }
            labels = null;
            return str;
        },
        destroy:function(){
            this.el && this.el.unbind("mousedown");
            this.nowPop = null;
            $.each(this.pops,function(n,v){
                v.find("*").unbind();
            })
            this.pops = null;
        }
    }

    return _drag = {
        name:"Drag",
        init:function(config){
            return new drag(config);
        }
    }
});


