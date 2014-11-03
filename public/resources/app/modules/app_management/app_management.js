define(["event","jquery"],function(require,exports,module){
    this.$ = this.$?this.$:(this.jQuery?this.jQuery:require("jquery"));
    var event = require("event");
    var toString = Object.prototype.toString,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    _today = window["begindate"] || Clicki.getDateStr(),
    _default = {/*默认设置*/
        delay:300,                                                          /*队列延迟执行时间300ms*/
        today:_today,                                                   /*今天*/
        defBegindate:window["begindate"] || _today,
        defEnddate:window["enddate"] || _today,
        beginDate:window["begindate"] || _today,        /*开始时间*/
        endDate:window["enddate"] || _today,            /*结束时间*/
        site_id:window["site_id"]||-1,                          /*站点ID，-1表示无站点*/
        defload:[
            {
                type:"dropdownlist",
                setting:{
                    "model":{
                        "datasources":{
                            "url":"/site/ajaxgetsites?ajax=1",
                            "data":{
                                "ajax":1
                            }
                        }
                    },
                    "view":{
                        "tpl":{
                            "item":'<li class="{selected}" data-i={i} data-id="{key}">{edit}<strong>{value}</strong><span>{url}</span></li>'
                        },
                        "scroller":{
                            "showScroller":true
                        }
                    },
                    "ui":{
                        "animate":{
                            "open":"fadeIn",
                            "close":"fadeOut"
                        },
                        "delay":400
                    },
                    "fix":{
                        "y":9
                    },
                    "label":"value",
                    "id":$("#siteList"),
                    contentRender:function(beenselected){
                        return beenselected["value"]+"："+beenselected["url"];
                    },
                    onSelect:function(beenselected){

                        var url = BU + "site/ajaxsetsite";
                        var _oldSid = Clicki.manager.site_id;
                        $.get(url,{"ajax":1,"sid":beenselected.key}, function(data){
                            if (data.error == "+OK"){
                                location.href = '/site/' + beenselected.key + location.hash;
                            }
                        },'json');
                        
                    },
                    showMatch:function(key){
                        var data = this.model.toJSON().items;
                        for(var i=0;i<data.length;i++){
                            if(data[i].key == key){
                                this.view.doms.lis.removeClass(this.view.ui.selected);
                                this.view.doms.lis.eq(i).addClass(this.view.ui.selected);
                                this.model.setSelected(i);
                                this.select(data[i],true);
                                break;
                            }
                        }
                    },
                    onLoad:function(){
                        this.showMatch(site_id);
                    },
                    callback:function(){
                        var me = this;
                        this.selectedShower.hover(
                            function(){
                                $(this).addClass("theHover");
                            },
                            function(){
                                if(!+(me.view.$el.attr("data-show"))){
                                    $(this).removeClass("theHover");
                                }
                            }
                        );
                    }
                }
            }
        ]
    };

    /*供内部调用*/
    var shadowManager;

    /*空白对象判断*/
    function isEmptyObject(obj){
        var Boolean = true;
        for(var n in obj){
            Boolean = false;
            break;
        }
        return Boolean;
    }

    /*纯对象判断*/
    function isPlainObject(obj){
        if(obj&&toString.call(obj)==="[object Object]"&&obj.constructor===Object &&!hasOwnProperty.call(obj, "constructor")){
            var key;
            for ( key in obj ) {}
            return key === undefined || hasOwnProperty.call( obj, key );
        }
        return false;
    }

    function appManagement(config){

        /*配置*/
        this.config = config;

        /*用以存放应用实例，扁平化，无层级关系*/
        this.appCache = {};

        /*用以存放全局类的应用实例。这种实例为_default.defload中指定的，只加载一次且不会被appManagement的destroy方法销毁*/
        this.globalCache = {};

        /*默认加载的全局应用实例*/
        this.defload = _default.defload;

        /*是否必须等全局应用加载完成*/
        this.holdOnDefload = config.holdOnDefload||false;

        /*用以存放层级关系，层级化，无实例*/
        this.tree = {};

        /*应用队列*/
        this._appQueueList = [];

        /*日期*/
        this.date = {
            beginDate:_default.beginDate,
            endDate:_default.endDate
        }
        /*站点ID*/
        this.site_id = _default.site_id;

        /*Event*/
        this.Event = window.__Event__ = require("event").init();

        this.ready = false;

        this.init();

    }

    appManagement.prototype = {
        /*
        初始化生成groups中的对象
        */
        init:function(){
            if(this.ready){return this}
            var self = this,
                    _type = this.defload[0]?this.defload[0].type:null,
                    _setting = this.defload[0]?this.defload[0].setting:null;
            
            if(this.holdOnDefload){
                this._create(_type,_type,function(){
                   self.defload = self.defload.slice(1);
                    if(self.defload.length == 0){
                        self.ready = true;
                        self.add(self.config);
                    }else{
                        self.init();
                    }
                },"globalCache",_setting);
            }else{

                for(var i = 0 ,len = this.defload.length;i<len;i++){
                    this._create(this.defload[i].type,this.defload[i].type,null,"globalCache",this.defload[i].setting);
                }
                this.ready = true;
                this.add(this.config);
            }
        },
        /*
        获取模块并缓存实例化对象
        module :: String                   模块名称
        objectName ::  String           实例化对象名称
        callback :: Function              回调函数
        cacheName :: String            缓存字段名称
        moduleSetting :: Object       该模块的配置
        */
        _create:function(module,objectName,callback,cacheName,moduleSetting){
            /*
            require.async 即可异步调用模块也可加载页面定义的模块
            */
            if(module === null && objectName === null){
                (typeof(callback) === "function") && callback();
                return;
            }
            cacheName = cacheName || "appCache";
            require.async([""+module],function(app){
                this[cacheName][objectName] = app.init && app.init(moduleSetting || this.config.groups[objectName].setting||{})
                                            || new app(moduleSetting || this.config.groups[objectName].setting||{});
                this[cacheName][objectName].appType = module;
                this._bindEvn(this[cacheName][objectName]);
                (typeof(callback) === "function") && callback();
            }.bind(this));
        },
        /*执行队列，此方法也可用于函数依赖关系的处理？*/
        _startAppQueue:function(){
            var sleep = this.config.queue.delay;
            $.each(this._appQueueList,function(i,n){
                var delay = sleep * i;
                setTimeout(n,delay);
            });
            this._appQueueList = null;
            this.config.queue = null;
            this._appQueueList = [];
            delete this.config.queue;
            window.CollectGarbage && CollectGarbage();
        },
        /*添加对象函数*/
        _doAdd:function(groups,n,exclude){
            /*
            未指定目标直接调用模块的情况
            */
            var _name =groups[n].type||n;
            if((""+exclude).indexOf(_name) !== -1 || (groups[n].exclude && this.appCache[n]) ){
                return;
            }

            if(groups[n].setting.addParams){
                this._doAddParams(groups[n].setting.addParams,groups[n].setting.params);
            }
            
            if(!this.appCache[n]){
                /*不存在同名对象时*/
                this._create(_name,n);
            }else{
                /*
                存在同名对象时尝试调用对象的update方法，如对象无此方法则销毁原有的对象并重新创建另一个同名对象
                因此，*** 同名的对象只能有一个 ***
                */
                if(this.appCache[n].update){
                    groups[n].setting.params && (groups[n].setting.params.page = 1);
                    if(this.appCache[n].appType === "charts"){
                        var title = false;
                        if((","+groups[n].setting.target+",").match(new RegExp("[,]"+n+"[,]"+",","g"))){
                            title = groups[n].setting.title;
                        }
                        this.appCache[n].update(groups[n].setting.params,title);
                    }else{
                        this.appCache[n].update(groups[n].setting.params,true,groups[n].setting.callback);
                    }
                }else{
                    this.destroy(n);
                    this._create(_name,n);
                }
            }
        },
        /*为对象追加getApp,carry等方法*/
        _bindEvn:function(app){
            if(!app.getApp){
                app.get = this.getApp.bind(this);
            }
            if(!app.carry){
                app.carry = this.carry.bind(this);
            }
            app.Event = this.Event;
        },
        /*页面卸载时销毁全局应用，当前缓存的应用，解除页面上制定类型，id绑定的事件。GG思密达~*/
        _GGSimida:function(){
            this.globalCache = null;
            this.destroy();
            $("img,input,td,li,#siteList,#user_email").unbind();
            $(window).unbind();
            $(document).unbind();
        },
        _doAddParams:function(addParams,params,_model){
            var _addParams = addParams;
            for(var n in _addParams){
                var value;
                if(typeof _addParams[n] ==="string" &&_model){
                    value = _addParams[n];
                    var Label = value.match(/\{.*\}/);
                    if(Label !== null){
                        Label = Label[0];
                        var name = Label.match(/([a-z]+)?(_)?([a-z]+)?(_)?([a-z]+)/g);
                        name = _model[name] || _model["x_axis"][name] || _model["y_axis"][name];
                        value = value.replace(Label,name);
                    }
                }

                if(typeof _addParams[n] ==="function"){
                    value = _addParams[n]();
                }

                value && (params[n] = value);
            }
        },
        /*
        获取指定的app实例化对象
        path指定实例化对象的路径
        parent为true则返回改实例化对象的父层
        cache指定要搜寻的缓存。不指定的话会自动到全局缓存中寻找。
        */
        getApp:function(path,parent,cache){

            var self = this[cache] || this.appCache;
            var name = path.split(".");
            var _parent = null;

            for(var i = 0,len = name.length;i<len;i++){
                if(name[i] in self){
                    if(len>1 && i >0){
                        _parent = self;
                    }
                    return parent?_parent:self[name[i]];
                    break;
                }else{
                    self = self[name[i]];
                }
            }
            if(!cache){
                return this.getApp(path,parent,"globalCache");
            }
            return false;
        },
        /*销毁指定的对象或销毁所有的实例化对象(不带参数时)*/
        destroy:function(name){
            if(name){
                try{
                    (this.appCache[name] && this.appCache[name].destroy) && this.appCache[name].destroy();
                }catch(e){}
                this.appCache[name] = null;
                delete this.appCache[name];
                window.CollectGarbage && CollectGarbage();
                return this;
            }else{
                for(var n in this.appCache){
                    try{
                        this.appCache[n].destroy && this.appCache[n].destroy();
                    }catch(e){}
                    this.appCache[n] = null;
                    delete this.appCache[n];
                }
                this.appCache = null;
                delete this.appCache;
                this.config = null;
                delete this.config;
                window.CollectGarbage && CollectGarbage();
                this.appCache = {};
                this.config = {};

                return this;
            }
        },
        /*
        carry为最基础的执行单位，event必须为obj:event_name的形式
        event :: "obj:show"         指定的实例化对象::要执行的方法,String
        arg :: ["test"]                 事件参数,Array
        fn :: Function                 重置或追加的方法，你必须知道你在做什么，Function
        */
        carry:function(event,arg,fn){
            var _ = event.split(":");
            var tag = this.getApp(_[0]),
                    evn = _[1];
            var arg = arg?arg:[];
            if(tag && tag.hasOwnProperty(evn) && typeof tag[evn] == "function"){
                if(fn){
                    tag[evn] = fn;
                }
                tag[evn].apply(tag,arg);
            }
            return this;
        },
        /*
        往appCache中追加实例化对象,re为true时为重置除指定的对象外的所有应用
        exclude :: String ,当启用重置模式时，exclude指定不要重置的模块类型，例如 “tabpanel ”或 “tabpanel,grid”
        */
        add:function(config,re,exclude){
            
            if(re){
                /*重置*/
            }else if(re === -1){
                this._doAdd(config.groups,n);
                return;
            }else{
                config.groups = config.groups || {};
                this.config.groups = $.extend(this.config.groups,config.groups);
            }

            /*有队列设定时,config.queue可直接为true或根据需求设定delay的数值，默认队列执行间隔为300ms*/
            if(config.queue){
                this.config.queue = config.queue;
                if(isPlainObject(this.config.queue)){
                    !this.config.queue.delay && (this.config.queue.delay = _default.delay);
                }else{
                    this.config.queue = {
                        delay:_default.delay
                    }
                }
            }

            for(var n in config.groups){
                if(this.config.queue){
                    
                    /*开启了队列*/
                    (function(n){
                        this._appQueueList.push(function(){
                            this._doAdd(config.groups,n,exclude);
                        }.bind(this));
                    }.bind(this))(n);

                }else{
                    this._doAdd(config.groups,n,exclude);
                }
            }
            
            /*有队列设定的话则按队列执行*/
            this.config.queue && this._startAppQueue();

            return this;
        },
        /*获取所有实例化对象*/
        getAllCache:function(){
            return this.appCache;
        },
        /*重渲染*/
        reRenderAll:function(config,exclude,queue,callback){
            var _setting;
            if(config && isPlainObject(config)){

                var date = {
                    "begindate":config.beginDate ||this.date.begindate,
                    "enddate":config.endDate || this.date.endDate
                };
                this.changeDate(date);
                config.site_id && this.changeSiteId(config.site_id);
            }
            for(var n in this.config.groups){
                _setting = this.config.groups[n].setting;
                if(_setting.params){

                    for(var name in _setting.params){
                        if(config[name] !== undefined){
                            _setting.params[name] = config[name];
                        }
                    }

                }
                config.title && (_setting.title = config.title);
            }
            this.config.queue = queue === true?true:false;
            this.add(this.config,1,exclude);
            typeof(callback) === "function" && callback();
            
            return this;
        },
        /*改变当前站点id，成功返回manager，失败则为false*/
        changeSiteId:function(sid){
            sid = parseInt(sid);
            if(!isNaN(parseInt(sid))){
                window.site_id = sid;
                this.site_id = sid;
                return this;
            }else{
                return false;
            }
        },
        /*改变起始/结束时间，date :: Object，成功返回manager，失败则为false*/
        changeDate:function(date){

            if(isPlainObject(date)){
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
                    beginDate:(this.date.beginDate).replace(/\-/g,"/"),
                    endDate:(this.date.endDate).replace(/\-/g,"/")
                };
            }else{
                return this.date;
            }

        },
        addToCache:function(name,appObj){
            !this.appCache[name] && (this.appCache[name] = appObj);
        }
    }

    return {
        name:"App Management",
        init:function (config){
            if(!shadowManager){
                shadowManager = new appManagement(config);
                $(window).unload(function(){
                    shadowManager._GGSimida();
                });
            }
            return shadowManager;
        }
    }

});
