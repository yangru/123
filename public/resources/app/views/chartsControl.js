//charts组件，用于选择类型和维度
(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    var dropdownlist = require("dropdownlist");
    var model = require("/resources/app/models/chartsControl");

    function ChartsControl(config){
        var privateConfig = {
            "tagName": "div",
            "tpl":{
                "compareTpl":{
                    "categoryTpl":'<div id="'+this.chartId+'_cinategory"></div>',
                    "dimensionTpl":'<div id="'+this.chartId+'_dimension"><ul><% _.each(dimensions, function(value, key){ %><li data-index="<%= key %>" data-dtype="<%= value.value %>"><%= value.value %></li><% }); %></ul></div>',
                    "indicatorTpl":'<div id="'+this.chartId+'_indicator"><ol><% _.each(indicators, function(value, key){ %><li data-itype="<%= value.type %>" class="<% if(key == "pageviews"){ %>act<% } %>"><%= value.title %></li><% }); %></ol></div>'
                },
                "uncompareTpl":{
                    "categoryTpl":'<div id="'+this.chartId+'_cinategory" data-ctype="<%= category[0].type %>"><%= category[0].name %></div>',
                    "dimensionTpl":'<div id="'+this.chartId+'_indicator"><%= dimensionName %></div>'
                }
            },
            "doms":{},
            "events":{
            },
            "refreshConfig":{},

            /*初始化处理函数*/
            initialize:function(){
                 var _id = this.id || null;
                _id = typeof(_id) === "string" && $("#"+_id)
                            || _id && (_id.nodeType || _id.selector) && _id;

                delete(this.id);
                if(_id){
                    this.$el = $(_id);
                    this.el = this.$el[0];
                }
                this.model.ui = this;
                this.model = new model(this.model);
                this.setCondition();
                this.buildChoseType();
                this.rendered = false;
            },

            //设置condition参数
            setCondition:function(){
                //根据rowdata做处理，如果有preCondition则拼起来
                if(!this.rowData){
                    return false;
                }
                var _par = "";
                for(var _n in this.rowData["keys"]){
                    _par += _n+"|"+this.rowData["keys"][_n]+",";
                }
                if(this.prevCondition){
                    _par = _par + this.prevCondition;
                }else{
                     _par = _par.substr(0,_par.length-1);
                }
                this.model.group && (this.model.group.params.condition = _par);
                this.model.trend && (this.model.trend.params.condition = _par);
            },

            /*渲染出选择类型的按钮*/
            buildChoseType:function(){
                var me = this;
                //判断条件，如果不可对比，则渲染类型显示框，维度显示框，指标多选框
                //如果可以对比，则渲染类型下拉列表，维度选择框，指标单选框
                if(this. compare){
                    //渲染类型下拉列表，维度多选框，指标单选框
                    this.doms["category"] = $(_.template(this.tpl.compareTpl.categoryTpl)());
                    this.$el.append(this.doms.category);
                    //渲染列表的下拉列表
                    this.dropdownlist = new dropdownlist({
                        "view":{
                            "tpl":{
                                "item":'<li class="{selected}" data-i={i} data-id="{id}" data-ctype="{type}">{name}</li>'
                            }
                        },
                        "model":{
                            "datacontent":this.category
                        },
                        "id":this.doms["category"],
                        onSelect:function(beenSelect,dpl){
                            //要做一个销毁操作
                            me.chartLayout.manager.run("chartsControl", {
                                "event":"doClearChart",
                                "data":{}
                            });
                            me.currentCategory = beenSelect.type;
                            //获取当前选择类型的维度数据
                            me.model.setCategory(me.currentCategory);
                        },
                        callback:function(){
                            //TODO 显示自定义位置
                            //默认显示第一个类型的维度
                            me.currentCategory = this.$el.find(".selected").data("ctype");
                            me.model.setCategory(me.currentCategory);
                        }
                    });
                }else{
                    this.doms["category"] = $(_.template(this.tpl.uncompareTpl.categoryTpl)({category:this.category.items}));
                    this.doms["dimension"] = $(_.template(this.tpl.uncompareTpl.dimensionTpl)({dimensionName:this.rowData&&this.rowData.x_axis[this.dimension[this.category.items[0].type]]||""}));
                    //暂时隐藏
                    this.doms.dimension.hide();
                    this.$el.append(this.doms.category).append(this.doms.dimension);
                    this.currentCategory = this.doms["category"].data("ctype");
                    //根据condition可以获得标题
                    //从group获取数据

                    // 疼! 二次拉取数据的问题
                    if (this.plugin && this.plugin[0] == 'chartsRange'){
                        this.model.categoryType = this.currentCategory
                        return;
                    }
                    this.model.setDimGroup(this.currentCategory);
                }
            },

            //对比状态下根据类型渲染出维度
            renderDimension:function(){
                if (!this.rendered) this.renderGrounp();
                //渲染出维度
                var data = this.model.getDimensions(this.currentCategory, this.dimension[this.currentCategory]);
                this.doms["dimension"] && this.doms["dimension"].unbind().empty();
                this.doms["dimension"] = $(_.template(this.tpl.compareTpl.dimensionTpl)({dimensions:data}));
                this.$el.append(this.doms["dimension"]);
                //绑定维度事件
                this.bindDimension();
                //绑定导出事件
                this.setExport();
                //渲染出指标
                var indicatorData = this.model.getIndicators(this.indicator["default"]);
                this.doms["indicator"] && this.doms["indicator"].unbind().empty();
                this.doms["indicator"] = $(_.template(this.tpl.compareTpl.indicatorTpl)({indicators:indicatorData}));
                this.$el.append(this.doms["indicator"]);
                //绑定指标事件
                this.bindIndicator();
                //默认显示第一个维度的趋势数据
                this.doms["dimension"].find("li:first").addClass("act");
                this.currentDimension = this.doms["dimension"].find("li:first").data("dtype");
                this.model.setDimTrend(0, this.currentDimension, true);
            },

            //对比状态下选择维度，获取该维度趋势,并设定状态
            bindDimension:function(){
                var me = this;
                this.doms["dimension"].find("li").bind("click", function(ev){
                    me.currentDimension = $(this).data("dtype");
                    //状态判断
                    var act = false;
                    if($(this).hasClass("act")){
                        act = false;
                        $(this).removeClass("act");
                    }else{
                        act = true;
                        $(this).addClass("act");
                    }
                    var index = $(this).data("index");
                    //根据维度获取趋势
                    me.model.setDimTrend(index, me.currentDimension, act);
                });
            },

            //选择指标，根据指标格式化数据，控制charts更新
            bindIndicator:function(){
                var me = this;
                this.doms["indicator"].find("li").bind("click", function(){
                    //对比则单选，不对比则多选
                    var indicatorType = [];
                    if(me.compare){
                        indicatorType.push($(this).data("itype"));
                        me.doms["indicator"].find("li").removeClass("act");
                        $(this).addClass("act");
                    }else{
                        $(this).hasClass("act") && $(this).removeClass("act") || $(this).addClass("act");
                        $.each(me.doms["indicator"].find(".act"), function(key, value){
                            indicatorType.push($(value).data("itype"));
                        });
                    }
                    me.chartLayout.manager.run("chartsControl", {
                        "event":"doIndicator",
                        "data":{
                            "indicator":indicatorType
                        }
                    });
                });
            },

            //获得维度趋势数据和状态后，控制charts更新
            renderTrend:function(){
                if (!this.rendered) this.renderGrounp();
                //根据指标选择器调整传给charts的数据
                var data = this.model.changedAttributes().dimensionStatus[this.currentDimension];
                console.log(data.type + " is " + data.act + " " +data.viewtb);
                this.chartLayout.manager.run("chartsControl", {
                    "event":"doCompareChart",
                    "data":{
                        "status":data.act,
                        "dimensionType":data.type,
                        "datacontent":this.model.toJSON()[this.currentCategory].items[data.index].z_axis,
                        "indicators":this.indicator["default"]
                    }
                });
                this.ready = true;    
            },

            //获得维度数据，渲染出多选指标，控制charts更新
            renderGrounp:function(){
                this.rendered = true;
                //绑定导出事件
                this.exportExcel && this.setExport();
                //渲染出指标
                var indicatorData = this.model.getIndicators(this.indicator["default"]);
                this.doms["indicator"] && this.doms["indicator"].unbind().empty();
                this.doms["indicator"] = $(_.template(this.tpl.compareTpl.indicatorTpl)({indicators:indicatorData}));
                //暂时隐藏
                this.doms["indicator"].hide();
                this.$el.append(this.doms["indicator"]);
                //绑定指标事件
                this.bindIndicator();
                //控制charts
                this.chartLayout.manager.run("chartsControl", {
                    "event":"doUnCompareChart",
                    "data":{
                        "datacontent":this.model.toJSON()[this.currentCategory],
                        "indicators":this.indicator["default"]
                    }
                });
                this.ready = true;
            },

            //根据时间范围，对维度的趋势数据进行更新，并且重新绘制charts
            //如果缓存的维度状态是激活的而且时间范围和现在的不一样，则进行更新
            doRange:function(data){
                if(this.compare){
                    data && this.model.doCompareRange(data);
                }else{
                    data && this.model.doUnCompareRange(data);
                }
            },

            //修改时间范围后，控制change更新，对比状态
            renderCompareRange:function(){
                if (!this.rendered) this.renderGrounp();
                var data = this.model.toJSON();
                var dataitems = [];
                var dimensionTypes = [];
                $.each(data["dimensionStatus"], function(key, value){
                    if(value.act){
                        dataitems.push(data[this.currentCategory].items[value.index].z_axis);
                        dimensionTypes.push(key);
                    }
                }.bind(this));
                this.chartLayout.manager.run("chartsControl", {
                    "event":"doRange",
                    "data":{
                        "dataitems":dataitems,
                        "dimensionTypes":dimensionTypes,
                        "indicators":this.indicator["default"]
                    }
                });
            },

            //非对比状态下修改时间范围后，控制change更新
            renderUnCompareRange:function(){
                if (!this.rendered) this.renderGrounp();
                this.chartLayout.manager.run("chartsControl", {
                    "event":"doUnCompareRange",
                    "data":{
                        "datacontent":this.model.toJSON()[this.currentCategory],
                        "indicators":this.indicator["default"]
                    }
                });
            },

            //对比状态下修改时间
            renderCompareDate:function(){
                if (!this.rendered) this.renderGrounp();
                var data = this.model.toJSON();
                var dataitems = [];
                var dimensionTypes = [];
                $.each(data["dimensionStatus"], function(key, value){
                    if(value.act){
                        dataitems.push(data[this.currentCategory].items[value.index].z_axis);
                        dimensionTypes.push(key);
                    }
                }.bind(this));
                this.chartLayout.manager.run("chartsControl", {
                    "event":"doDate",
                    "data":{
                        "dataitems":dataitems,
                        "dimensionTypes":dimensionTypes,
                        "indicators":this.indicator["default"]
                    }
                });
            },

            //非对比状态下修改时间后，控制change更新
            renderUnCompareDate:function(){
                if (!this.rendered) this.renderGrounp();
                this.chartLayout.manager.run("chartsControl", {
                    "event":"doUnCompareDate",
                    "data":{
                        "datacontent":this.model.toJSON()[this.currentCategory],
                        "indicators":this.indicator["default"]
                    }
                });
            },

            //导出excel报表
            setExport:function(){
                var me = this;
                if(this.compare){
                    $.each(this.doms["dimension"].find("li"), function(key, value){
                        $(value).append('<b data-index="'+ $(value).data("index") +'"> D</b>');
                        $(value).find("b").bind("click", function(){
                            window.location.href = me.model.getCompareExport($(this).data("index"));
                            return false;
                        });
                    });
                }else{
                    this.doms["category"].append('<b class="gridExport"></b>');
                    this.doms["category"].find("b").bind("click", function(){
                        window.location.href = me.model.getUnCompareExport();
                        return false;
                    });
                }
            },

            // 根据时间控件更新数据
            doChangeTime:function(data){
                if(this.compare){
                    data && this.model.doCompareDate(data);
                }else{
                    data && this.model.doUnCompareDate(data);
                }
            },

            update:function(data){
                //把配置的所有参数update，把所有激活的数据进行更新
                this.doChangeTime(data);
            },

            refresh:function(config){
                this[config.event] && this[config.event](config.data);
            },

            destroy:function(){
                this.$el.find("*").unbind();
                this.$el.unbind().empty();
            }
        };

        var viewsConfig = $.extend(true,{

        },config||{},privateConfig);

        var mainView = Backbone.View.extend(viewsConfig);

        return new mainView;
    }
    
    ChartsControl.prototype.constructor = ChartsControl;

    return function(config){
        return new ChartsControl(config);
    };

});