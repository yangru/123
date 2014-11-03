define(function(require,exports,module){

    var base = require("base");

    function dateController(config){

        var _date = Clicki.manager.getDate();


        var days = this.getDays();

        /*参数*/
        this.config = $.extend(true,{
            /*类型选择对象*/
            "viewModeGroup":null,
            /*日期段对象*/
            "buttonGroup":null,
            "selector":"#datepicker .G-buttonGroup:first input",
            /*模板*/
            "tpl":{
                "modeSelector":'<div class="biggerButtonGroup {cls}"><span class="G-buttonGroup">{types}</span></div>'
            },
            /*日期*/
            "date":Clicki.manager.getDate(),
            /*是否为一天*/
            "singel":!days,
            "days":days,
            /*是否已设定完成*/
            "seted":false,
            /*页面chart实例名集合*/
            "theChart":null,
            /*页面grid实例名集合*/
            "theGrid":null,
            /*查看模式附加样式*/
            "cls":"",
            /*启用的查看类型，这决定能使用的时间类型
            "types":["hourlyMode","dailyMode","weekMode","monthMode","quarterMode","yearMode"],*/
            /*时间类型显示的文字*/
            "typesTitle":{
                "hourlyMode":LANG("小时"),
                "dailyMode":LANG("日"),
                "weekMode":LANG("周"),
                "monthMode":LANG("月"),
                "quarterMode":LANG("季"),
                "yearMode":LANG("年")
            },
            /*标题*/
            "modelTitle":{
                "hourlyMode":LANG("每小时访问趋势"),
                "dailyMode":LANG("访问趋势"),
                "weekMode":LANG("每周访问趋势"),
                "monthMode":LANG("每月访问趋势"),
                "quarterMode":LANG("每季访问趋势"),
                "yearMode":LANG("每年访问趋势")
            },
            /*
                类型选择按钮组渲染的位置
                "theList_os_chart":{//对应的实例名
                    "type":"before",//添加到el的相对位置
                    "el":"theList_os_chart div[id*='highcharts-']"//要追加的位置
                }
            */
            "renderTo":null
        },config|| {});

        this.config.buttonGroup = $(this.config.selector);

        this.types = this.config.types;

        /*渲染模板*/
        this.config.tpl.modeSelector = base.tpl.repLabel(this.config.tpl.modeSelector,1,{
            "cls":this.config.cls,
            "types":(function(types,titles){
                var htm = '';
                for(var i = 0;i<types.length;i++){
                    htm += '<input type="button" data-type="'+types[i]+'" class="btn'+(!i && ' selected' || '')+'" value="'+titles[types[i]]+'">';
                }
                return htm;
            })(this.types,this.config.typesTitle)
        });

        this.timeTypesSet = {
            "14":"weekMode",
            "60":"monthMode",
            "180":"quarterMode",
            "720":"yearMode"
        }

        /*参数设定表*/
        this.paramsMap = {
            "hourlyMode":{
                "viewtb":0
            },
            "dailyMode":{
                "viewtb":1
            },
            "weekMode":{
                "viewtb":2
            },
            "monthMode":{
                "viewtb":3
            },
            "quarterMode":{
                "viewtb":4
            },
            "yearMode":{
                "viewtb":5
            }
        }
        /*计时器*/
        this.timer = {};
        /*当前时间类型*/
        this.type = "hourlyMode";
        /*获取失败的实例*/
        this.fail = [];
        /*图标实例合集*/
        this.charts = [];
        /*表格实例合集*/
        this.grids = [];
        /*实例是否获取完毕*/
        this.appsReady = false;

        this.init();
    }
    
    /*两个日期间差多少天*/
    dateController.prototype.getDays = function(){
        var _date = Clicki.manager.getDate(true);
        return (new Date(_date.endDate) - new Date(_date.beginDate))/86400000;
    }

    /*初始化*/
    dateController.prototype.init = function(){
        var me = this;

        if(!this.config.viewModeGroup){
            this.renderViewModeGroup(true);
        }else{
            this.setButtonGroup(true);
            this.setViewModeGroup();
        }
    }

    /**
     * 设定时间段选择按钮
     *     因存在异步加载的问题，所以需要用deferred来做处理
     * @param {Boolean} doBind 是否执行事件绑定
     */
    dateController.prototype.setButtonGroup = function(doBind){
        var me = this
            _doBind = doBind;
        if(this.config.buttonGroup.length){
            this._setButtonGroup(_doBind);
        }else{
            $.when((function(){
                var dtd = $.Deferred();
                me.config.buttonGroup = $(me.config.selector);
                if(!me.config.buttonGroup.length){
                    setTimeout(function(){
                        me.config.buttonGroup = $(me.config.selector);
                        if(!me.config.buttonGroup.length){
                            setTimeout(arguments.callee,50);
                        }else{
                            dtd.resolve();
                        }
                    },50);
                }
                return dtd;
            })()).done(function(){
                me._setButtonGroup(_doBind);
            }.bind(this));
        }
    }

    dateController.prototype._setButtonGroup = function(doBind){
        var me = this;
        var tmpArr = [1,1,1,7,7,30,30];
        this.config.buttonGroup.each(function(i,n){
            var dat,n = $(this);
            if(i<4){
                dat = '{"viewtb":0,"title":"'+(n.val()+me.config.modelTitle[me.type])+'","target":"'+((me.config.theChart || "") + (me.config.theGrid || ""))+'"}';
                doBind && n.bind("click",function(){
                    me.type = "hourlyMode";
                    me.setButtonGroup(false);
                    me.config.viewModeGroup.removeClass("selected");
                    me.config.viewModeGroup.filter("input[data-type='hourlyMode']").addClass("selected");
                    me.config.viewModeGroup.filter("input[data-type!='hourlyMode']").attr("disabled",true);
                });
            }else{
                dat = '{"viewtb":1,"title":"'+(n.val()+me.config.modelTitle[me.types[i]])+'","target":"'+((me.config.theChart || "") + (me.config.theGrid || ""))+'"}';
                doBind && n.bind("click",function(){
                    var days = +n.attr("data-days");
                    me.config.viewModeGroup.removeClass("selected");
                    me.config.viewModeGroup.filter("input[data-type='dailyMode']").addClass("selected");
                    me.config.viewModeGroup
                    .filter((
                        "input[data-type='hourlyMode'],input[data-type='dailyMode']"+(days === 30 && ",input[data-type='weekMode']" || "")
                    ))
                    .attr("disabled",false);
                });
            }
            n.attr("data-dat",dat)
                .attr("data-days",tmpArr[i]);
        });
        tmpArr = null;
    }

    /*设置时间类型按钮*/
    dateController.prototype.setViewModeGroup = function(){
        var me = this;
        $.each(me.config.viewModeGroup,function(i,n){
            var _n = $(n);
            _n.bind("click",function(){
                var _n = $(this);
                var _date = Clicki.manager.getDate();
                me.config.singel = _date.beginDate == _date.endDate;

                if(!me.appsReady){
                    me.getApps();
                }

                if(_n.hasClass("selected")){return;}

                me.type = _n.attr("data-type");
                me.config.viewModeGroup.removeClass("selected");
                me.config.viewModeGroup.filter("input[data-type='"+me.type+"']").addClass("selected");
                me.setButtonGroup(false);
                me.updateApps({
                    "chart":[me.paramsMap[me.type],(Clicki.App.nowDateType && $("#"+Clicki.App.nowDateType).val() || "") +me.config.modelTitle[me.type]],
                    "grid":[me.paramsMap[me.type],true,null]
                });

            });

            if(me.config.singel && !i && !me.config.seted){
                _n.addClass("selected");
                me.config.viewModeGroup.filter("input[data-type!='hourlyMode']").attr("disabled",true);
            }else if(!i && !me.config.seted){
                me.changeDate(Clicki.manager.getDate(),1);
            }
        });
        this.config.seted = true;
    }

    /*延迟对象中获取必要对象函数，成功后更新延迟对象状态*/
    dateController.prototype._getEl = function(dtd,rd){
        if(rd.el.nodeType || rd.el.selector){
            rd.el =  $(rd.el);
        }else if(typeof(rd.el) === "string"){

            $("#"+rd.el).length && (rd.el = $("#"+rd.el));
        }
        if(rd.el.length && rd.el.selector){
            dtd.resolve();
        }
    };

    /*渲染时间类型按钮至指定位置*/
    dateController.prototype.renderViewModeGroup = function(doBind,doneFn){

        if(this.config.renderTo){

            this.config.viewModeGroup = $(this.config.tpl.modeSelector);
            this.config.viewModeGroup = this.config.viewModeGroup.find("input[data-type]");
            this.setButtonGroup(true);
            this.setViewModeGroup(); 
            this.viewModeGroupCopy = this.config.viewModeGroup.parent().parent().clone(true ,true);
            $.each(this.config.renderTo,function(name,val){

                if(val.el){
                    $.when((function(me){
                        var dtd = $.Deferred();
                        me._getEl.apply(me,[dtd,val]);
                        if(typeof(val.el) === "string" && !val.el.selector){
                            /*模块存在延时加载的情况，需要做检查*/
                            me.timer[name] = setTimeout(function(){
                                clearTimeout(me.timer[name]);
                                me._getEl.apply(me,[dtd,val]);
                                if(typeof(val.el) === "string" && !val.el.selector){
                                    me.timer[name] = setTimeout(arguments.callee,50);
                                }
                            },50);
                        }
                        return dtd;
                    })(this)).done(function(){
                        var _copy = this.viewModeGroupCopy.clone(true ,true);
                        val.el[val.type](_copy);
                        this.config.viewModeGroup = this.config.viewModeGroup.add(_copy.find("input[data-type]"));
                        _.isFunction(doneFn) && doneFn.call(this);
                    }.bind(this));
                }

            }.bind(this));
            
        }else{
            return false;
        }
    }

    /*获取应用实例*/
    dateController.prototype.getApps = function(){
        if(this.config.theChart){
            var chartList = typeof this.config.theChart === "string" && this.config.theChart.split(",") || $.isArray(this.config.theChart) && this.config.theChart;
            for(var i = 0;i<chartList.length;i++){
                var app = Clicki.manager.getApp(chartList[i]) || Clicki.layout.get(chartList[i]);
                this.charts.push(app && app || chartList[i]);
                !app && this.fail.push(chartList[i]);
            }
        }
        
        if(this.config.theGrid){
            var gridList = typeof this.config.theGrid === "string" && this.config.theGrid.split(",") || $.isArray(this.config.theGrid) && this.config.theGrid;
            for(var i = 0;i<gridList.length;i++){
                var app = Clicki.manager.getApp(gridList[i]) ||  Clicki.layout.get(gridList[i]);
                this.grids.push(app && app || gridList[i]);
                !app && this.fail.push(gridList[i]);
            }
        }
        chartList = gridList = null;
        this.appsReady = true;
    }

    /*更新*/
    dateController.prototype.updateApps = function(data){
        for(var i = 0;i<this.charts.length;i++){
            if(typeof(this.charts[i]) === "string"){
                var _name = this.charts[i];
                this.charts[i] = Clicki.manager.getApp(this.charts[i]) || Clicki.layout.get(this.charts[i]);
                !this.charts[i] && (this.charts[i] = _name);
            }

            typeof(this.charts[i]) ==="object" && this.charts[i].update(data.chart[0],data.chart[1]);
        }
        for(var i = 0;i<this.grids.length;i++){
            if(typeof(this.grids[i]) === "string"){
                var _name = this.grids[i];
                this.grids[i] = Clicki.manager.getApp(this.grids[i]) || Clicki.layout.get(this.grids[i]);
                !this.grids[i] && (this.grids[i] = _name);
            }
            typeof(this.grids[i]) ==="object" && this.grids[i].update(data.grid[0],data.grid[1],data.grid[2]);
        }
    }

    /*工具*/
    dateController.prototype.uitl = {
        getType:function(type){
            type = ""+type;
            var _f = type.charAt(0).toUpperCase();
            type = type.substr(1,type.length-2);
            type = "the"+_f+type;
            _f = null;
            return type;
        }
    };

    /*添加受控的实例*/
    dateController.prototype.add = function(type,name,config){
        var _type = this.uitl.getType(type);
        if(this[type] && !(","+this.config[_type]+",").match(new RegExp("[,]"+name+"[,]"+",","g")) && (Clicki.manager.getApp(name) || Clicki.layout.get(name))){
            
            this[type].push((Clicki.manager.getApp(name) || Clicki.layout.get(name)));

            if(typeof(this.config[_type]) === "string"){
                this.config[_type] += (","+name);
            }else if(this.config[_type].push){
                this.config[_type].push(name);
            }
        }
        $.when((function(me){
                var dtd = $.Deferred();
                me._getEl.apply(me,[dtd,config]);
                if(typeof(config.el) === "string" && !config.el.selector){
                    me.timer[name] = setTimeout(function(){
                        clearTimeout(me.timer[name]);
                        me._getEl.apply(me,[dtd,config]);
                        if(typeof(config.el) === "string" && !config.el.selector){
                            me.timer[name] = setTimeout(arguments.callee,50);
                        }
                    },50);
                }
                return dtd;
        })(this)).done(function(){
            var _copy = this.viewModeGroupCopy.clone(true ,true);
            config.el[config.type](_copy);
            this.config.viewModeGroup = this.config.viewModeGroup.add(_copy.find("input[data-type]"));
        }.bind(this));
    }

    /*改变日期*/
    dateController.prototype.changeDate = function(date,justSet){
        this.config.days = this.getDays();
        this.config.singel = !this.config.days;

        if(!this.appsReady){
            this.getApps();
        }

        this.type = this.config.singel && "hourlyMode" || "dailyMode";//this.type
        this.config.viewModeGroup.removeClass("selected");
        this.config.viewModeGroup.filter("input[data-type='"+this.type+"']").addClass("selected");
        if(this.config.singel){
            this.config.viewModeGroup.filter("input[data-type!='hourlyMode']").attr("disabled",true);
        }else{
            var rArr=[]
                ,rArr2=[]
                ,_tmpArr= [14,60,180,720];
                // _R = 0,
            for(var i =0;i<4;i++){
                // _R = Math.max(_tmpArr[i],this.config.days);
                if(_tmpArr[i]<=this.config.days){
                    rArr.push(
                        "input[data-type='"+this.timeTypesSet[_tmpArr[i]]+"']"
                    );
                }else{
                    rArr2.push(
                        "input[data-type='"+this.timeTypesSet[_tmpArr[i]]+"']"
                    );
                }
            }
            _R = _tmpArr = null;
            this.config.viewModeGroup.filter("input[data-type='hourlyMode'],"+(rArr+(rArr.length?",":""))+"input[data-type='dailyMode']").attr("disabled",false);
            this.config.viewModeGroup.filter(""+rArr2).attr("disabled",true);
        }
        this.setButtonGroup(false);
        !justSet && this.updateApps({
            "chart":[this.paramsMap[this.type],(Clicki.App.nowDateType && $("#"+Clicki.App.nowDateType).val() || "") +this.config.modelTitle[this.type]],
            "grid":[this.paramsMap[this.type],true,null]
        });
    }


    return {
        "name":"Date Controller",
        "init":function(config){
            return new dateController(config);
        }
    }

});