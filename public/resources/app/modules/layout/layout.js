(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Manager = require("new_manager");

    /*布局解析*/
    function Layout(config){

        config = config || {};
        this.layoutConfig = config.layout && $.extend({},config.layout) || {};
        delete(config.layout);
        this.config = $.extend({
            slave:null,
            onDone:$.noop
        },config||{});
        config = null;

        this.el = $((this.config.el || "body")+":first");

        /*实例缓存*/
        this.cache = {};
        /*界面关键dom缓存*/
        this.doms = {
            "platform":null,
            "content":null,
            "nav":null
        }
        
        /*控制模块*/
        this.manager = null;

        this.init();
    }
    Layout.prototype = {
        /*初始化函数*/
        init:function(){
            this.config.tpl && this.fn._buildMainLayout.call(this);
            this.fn._setLayout.call(this);
            /*控制模块始终会存在*/
            this.manager = new Manager({
                "relation":(this.config.relation || {}),
                "layout":this
            });
        },
        /*工具*/
        "util":{
            /*返回一个新的延迟对象(操作流程)*/
            deferred:function(){
                return $.Deferred();
            },
            /*返回一个或多个对象或事件的共用*/
            when:function(deferreds){
                return $.when(deferreds);
            },
            /*返回一个绑定到对象上的Promise对象，用于实现事件流或类似操作*/
            promise:function(obj){
                return $(obj).promise();
            }
        },
        /*内部函数*/
        "fn":{
            /*构造*/
            _create:function(name,contents){

                var config = contents.config;
                var name = name;
                var appType = contents.type;
                var _renderTo = contents.renderTo || false;
                var callback = contents.callback || false;
                if(config && appType){
                    this.util.when(
                        (function(me){
                            var dtd = $.Deferred();
                            require.async([appType],function(app){
                                config.appType = appType;
                                me.cache[name] = app.init && app.init(config) || new app(config);
                                dtd.resolve();
                            }.bind(this));
                            return dtd;
                        })(this)
                    )
                    .then(
                        function(){
                            _renderTo && this.fn._renderTo.apply(this,[_renderTo,name]);
                            this.config.onDone();
                            callback && callback();
                        }.bind(this),
                        function(){
                            this.fn._fail();
                        }.bind(this)
                    )
                    .always(function(){
                        config = name = appType = _renderTo = null;
                    });
                }
            },
            _renderTo:function(rto,name){
                $.when(
                    (function(me){
                            var dtd = $.Deferred();
                            me.doms[rto] && me.doms[rto].append(me.cache[name].el) || $("#"+rto).append(me.cache[name].el);
                            if(Clicki.Balance){
                                Clicki.Balance();
                            }
                            return dtd;
                        })(this)
                    ).done(function(){
                });
            },
            _setLayout:function(layoutConfig){
                layoutConfig = layoutConfig || this.layoutConfig;
                for(var n in layoutConfig){
                    this.fn._create.apply(this,[n,layoutConfig[n]]);
                }
                if(layoutConfig){
                    this.layoutConfig = $.extend(this.layoutConfig,layoutConfig);
                }
            },
            _fail:function(){
                /*失败的时候的统一处理*/
            },
            _buildMainLayout:function(){
                this.doms.platform = $(this.config.tpl);
                this.doms.content = this.doms.platform.find("*[data-layout='content']:first");
                this.doms.nav = this.doms.platform.find("*[data-layout='nav']:first");
                this.el.append(this.doms.platform);
            }
        },
        /*外部追加新模块对象接口*/
        add:function(name,contents,noInit){
            noInit= typeof(noInit) === "boolean"?noInit:false;
            if(typeof(name) === "object" &&  "layout" in name){

                /*如果传入的是一个带有layout key的对象*/
                this.config.onDone = name.onDone || this.config.onDone;
                if("relation" in name){
                    for(var n in name.relation){
                        //所有加载完，返回状态
                        this.manager.add(n,name.relation[n]);
                    }
                }
                this.fn._setLayout.call(this,name.layout);
                /*传入object的情况返回的是整个cache*/
                return this.cache;
            }else if(name in this.cache){
                /*如果模块已存在则只返回已生成的实例化对象*/
                return this.cache[name];
            }else if(name !== null && $.isPlainObject(contents) && !noInit){
                /*无同名对象存在且传入的contents为纯配置对象的情况下新建相应模块*/
                this.fn._create.apply(this,[name,contents]);
                return this.cache[name];
            }else if(noInit && contents && !(name in this.cache)){
                /*无同名对象存在且有contents且noInit为true时*/
                return (this.cache[name] = contents);
            }
        },
        /*获取实例化对象，parent为true时返回该实例的主控实例*/
        get:function(name,parent){
            if(parent){
                var master = this.manager.getMasterName(name,true);
                var parents = [];
                for(var i = 0;i<master.length;i++){
                    parents.push(this.get(master[i]));
                }
                return parents;
            }else if(name in this.cache){
                return this.cache[name];
            }
            return null;
        },
        /*销毁指定的对象或销毁所有的实例化对象(不带参数时)*/
        destroy:function(names){
            if(names){

                function _D(name){
                    (this.cache[name] && this.cache[name].destroy) && this.cache[name].destroy();
                    this.cache[name] = null;
                    delete this.cache[name];
                    this.manager.del(name);
                    window.CollectGarbage && CollectGarbage();
                }

                if(_.isArray(names)){
                    for(var i = 0;i<names.length;i++){
                        _D.call(this,names[i]);
                    }
                }else{
                    _D.call(this,names);
                }

                return this;
            }else{
                for(var n in this.cache){
                    this.cache[n].destroy && this.cache[n].destroy();
                    this.cache[n] = null;
                    delete this.cache[n];
                    this.manager.del(n);
                }
                this.cache = null;
                delete this.cache;
                this.cache = {};
                this.layoutConfig = {};
                this.config.layout = {};
                this.config.relation = {};
                window.CollectGarbage && CollectGarbage();
                return this;
            }
        }
    }
    Layout.prototype.constructor = Layout;

    return function(config){
        return new Layout(config);
    }

});


