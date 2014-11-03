(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var $ = window.$ || require("jquery");

    function Manager(config){

        this.config = $.extend({
            "layout":null
        },config||{});

        /*对应关系*/
        this.relationMap = {};

        /*连接池*/
        this.requestPool = [];

        /*z-index管理*/
        this.ZIndex = {
            "base":1,
            "max":2,
            "setp":10,
            "prev":0
        };

        this.date = {
            begindate:window["begindate"] || (window["begindate"] || Clicki.getDateStr()),
            enddate:window["enddate"] || (window["begindate"] || Clicki.getDateStr())  
        }

        this.init();
    }

    Manager.prototype = {

        init:function(){
            !$.isEmptyObject(this.config.relation) && this.fn._setRelationMap.call(this);
        },
        "fn":{
            /*传递结果至受控模块*/
            _pushData:function(slaves,data,dtd){
                var me = this;
                var cache = (this.config.layout.cache || this.config.layout.appCache);
                /*模块需要有接受操作的接口*/
                for(var i = 0;i<slaves.length;i++){
                    doControl(slaves[i], data);
                }
                function doControl(slave, data){
                    var deadCount = 10;
                    function counter(){
                        if(!deadCount || (cache[slave] && cache[slave].ready)){
                            cache[slave] && cache[slave].refresh && cache[slave].refresh(data);
                            dtd.resolve();
                        }else{
                            --deadCount;
                            me.timer = setTimeout(counter,100);
                        }
                    }
                    me.timer = setTimeout(counter,100);
                }
            },
            /*设定反向关系*/
            _setRelationMap:function(master,slave){
                if(master && slave){
                    this.relationMap[slave] = master;
                }else{
                    for(var name in this.config.relation){
                        for(var i=0;i<this.config.relation[name].length;i++){
                            this.relationMap[this.config.relation[name][i]] = this.relationMap[this.config.relation[name][i]] && (this.relationMap[this.config.relation[name][i]] + "|"+name)
                                                                            || name;
                        }
                    }
                }
            }
        },
        /*执行控制操作或manager本身的某一个操作*/
        run:function(main,data,whenDone){
            if(!data){
                return false;
            }
            var slaves;
            //data = !$.isPlainObject(data) && data || {};
            !data.event && (data.event = "refresh");
            !data.data && (data.data = false);
            
            if((slaves = this.config.relation[main])){
                $.when((function(me){
                    var dtd = $.Deferred();
                    me.fn._pushData.apply(me,[slaves,data,dtd]);
                    return dtd;
                })(this))
                .done(function(){
                    typeof whenDone === "function" && whenDone();
                });
                slaves = null;
            }else if(typeof(this[data.event]) === "function"){
                return this[data.event](data.data);
            }
        },
        /*添加新的受控关系*/
        add:function(main,slaves){
            if(this.config.relation[main] && slaves){
                if(_.isArray(slaves)){
                    this.config.relation[main] = this.config.relation[main].concat(slaves);
                }else if(_.isString(slaves)){
                    this.config.relation[main].push(slaves);
                }else{
                    console.error(LANG("slaves数据类型错误"));
                }
                this.fn._setRelationMap.call(this);
                return this.config.relation[main];
            }else{

                if(_.isArray(slaves)){
                    this.config.relation[main] = slaves;
                }else if(_.isString(slaves)){
                    this.config.relation[main] = [slaves];
                }else{
                    console.error(LANG("slaves数据类型错误"));
                }
                this.fn._setRelationMap.call(this);
                return this.config.relation[main];
            }
        },
        /*获取主控模块实例化名*/
        getMasterName:function(slave,toArray){
            return toArray && this.relationMap[slave] && this.relationMap[slave].split("|") 
                    || this.relationMap[slave] 
                    || null;
        },
        /*删除受控*/
        del:function(main,slaves){
            if(this.config.relation && main && !slaves && (main in this.config.relation)){
                delete this.config.relation[main];
            }else if (this.config.relation && main && slaves && (main in this.config.relation)){
                slaves = $.isArray(slaves) && slaves || typeof(slaves) === "string" && [slaves];
                var _arr = ","+this.config.relation[main]+",";
                for(var i = 0;i<slaves.length;i++){
                    _arr = _arr.replace(new RegExp(","+slaves[i]+"(?![\\w|\\d])",["g"]),"");
                    this.relationMap[slaves[i]] && (delete this.relationMap[slaves[i]]);
                }
                _arr = _arr.substr((_arr.charAt(0) === "," && 1 || 0),_arr.length-1);
                this.config.relation[main] = _arr.length && _arr.split(",") || [];
            }
        },
        /*改变起始/结束时间，date :: Object，成功返回manager，失败则为false*/
        changeDate:function(date){

            if($.isPlainObject(date)){
                $.extend(this.date,date);
                return this;
            }else{
                return false;
            }
        },
        /*获取当前保存的开始与结束时间*/
        getDate:function(ie){
            if(ie){
                return {
                    "begindate":(this.date.begindate).replace(/\-/g,"/"),
                    "enddate":(this.date.enddate).replace(/\-/g,"/")
                };
            }else{
                return this.date;
            }

        },
        getNextZIndex:function(){
            this.ZIndex.prev = 0+this.ZIndex.max;
            this.ZIndex.max = this.ZIndex.max+this.ZIndex.base+this.ZIndex.setp;
            return (this.ZIndex.max+this.ZIndex.setp);
        },
        prevZIndex:function(){
            /*重设最大z-index前一个z-index*/
        }
    }

    Manager.prototype.constructor = Manager;

    return function(config){
        return new Manager(config);
    }

});


