(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    var layout = require("layout");

    function CommonChart(config){
        var chartId = "chart"+Math.ceil(Math.random()*10000);
        var privateConfig = {
            /*chartLayout*/
            "chartLayout":{},
            /*模块Id*/
            "chartId":chartId,
            /*最终配置缓存*/
            "config":{
                "layout":{},
                "relation":{}
            },
            /*初始化处理函数*/
            initialize:function(){
                var _id = this.id || null;
                _id = typeof(_id) === "string" && $("#"+_id)
                            || _id && (_id.nodeType || _id.selector || _id.jquery) && _id;
                delete(this.id);
                if(_id){
                    this.$el = $(_id);
                    this.el = this.$el[0];
                }
                this.render();
            },

            refresh:function(config){
                this[config.event] && this[config.event](config.data);
            },

            render:function(){
                this.destroy();
                /*设置表格*/
                this.fn.setChart.call(this);
                this.fn.buildChartsControl.call(this);
                this.fn.buildChartsPaint.call(this);
                /*构建组件*/
                this.fn.loadPlugin.call(this);
                this.callback && this.callback();
                this.ready = true;
            },

            "fn":{
                setChart:function(){
                    this.title && this.$el.append('<div class="chartTitle">'+this.title+'</div>');
                    this.$el.append(this.tpl);
                    this.chartLayout = new layout();
                },
                /*建立charts控制*/
                buildChartsControl:function(){
                    this.chartsControlConfig.config.chartLayout = this.chartLayout;
                    this.chartsControlConfig.config.rowData = this.rowData;
                    this.chartsControlConfig.config.prevCondition = this.prevCondition;
                    this.chartLayout.add({
                        "layout":{
                            "chartsControl":{
                               "type":this.chartsControlConfig.type,
                                "config":$.extend(true,this.chartsControl,this.chartsControlConfig.config)
                            }
                        },
                        "relation":{
                            "chartsControl":this.chartsControlConfig.relation
                        }
                    });
                },
                /*建立charts绘图*/
                buildChartsPaint:function(){
                    this.chartsPaintConfig.config.chartLayout = this.chartLayout;
                    this.chartLayout.add({
                        "layout":{
                            "chartsPaint":{
                               "type":this.chartsPaintConfig.type,
                                "config":$.extend(true,this.chartsPaint,this.chartsPaintConfig.config)
                            }
                        },
                        "relation":{
                            "chartsPaint":this.chartsPaintConfig.relation
                        }
                    });
                },
                /*加载组件*/
                loadPlugin:function(){
                    for(var n in this.pluginConfig){
                        if(_.include(this.plugin, n)){
                            /*组合必要参数*/
                            this.pluginConfig[n].config.chart = this;
                            
                            this.pluginConfig[n].config.chartLayout = this.chartLayout;
                            this.pluginConfig[n].view && (this.pluginConfig[n].view.chartLayout = this.chartLayout);

                            this.config.layout[n] = {};
                            this.config.layout[n].type = this.pluginConfig[n].type;
                            this.config.layout[n].config = this.pluginConfig[n].config;
                            
                            this.config.relation[n] = this.pluginConfig[n].relation;
                        }else{
                            $("#"+this.pluginConfig[n].config.id).remove();
                        }
                    }
                    this.chartLayout.add({
                        "layout":this.config.layout,
                        "relation":this.config.relation
                    });
                }
            },
            changeDate:function(data){
                this.update(data);
            },
            update:function(data){
                $.each(this.chartLayout.cache, function(key, value){
                    value.update && value.update(data);
                });
            },

            destroy:function(){
                this.$el.find("*").unbind();
                this.$el.unbind().empty();
            }
        };

        var viewsConfig = $.extend(true,{
            /*图表控制的默认设置*/
            "chartsControlConfig":{
                "type":"chartsControl",
                "config":{
                    "id":chartId+"_chartsControl",
                    "chartId":chartId,
                    "model":{
                        "group":{
                            "params":{
                                "begindate":Clicki.manager.getDate().beginDate,
                                "enddate":Clicki.manager.getDate().endDate,
                                "site_id":site_id
                            }
                        },
                        "trend":{
                            "params":{
                                "begindate":Clicki.manager.getDate().beginDate,
                                "enddate":Clicki.manager.getDate().endDate,
                                "site_id":site_id
                            }
                        }
                    },
                    plugin: config.plugin
                },
                "relation":["chartsPaint"]
            },
            /*图表绘制的默认设置*/
            "chartsPaintConfig":{
                "type":"chartsPaint",
                "config":{
                    "id":chartId+"_chartsPaint",
                    "chartId":chartId
                },
                "relation":[]
            },
            /*各模块的默认设置*/
            "pluginConfig":{
                "chartsRange":{
                    "type":"chartsRange",
                    "config":{
                        "id":chartId+"_chartsRange",
                        "chartId":chartId
                    },
                    "relation":["chartsControl"]
                }
            },
            "plugin":[],
            /*组件模板，新增组件需要增加该组件id的div*/
            "tpl":'<div id="'+chartId+'_chartsRange" class="chartsRange"></div><div id="'+chartId+'_chartsControl" class="chartsControl"></div><div id="'+chartId+'_chartsPaint" class="chartsPaint"></div>'
        },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }
    
    CommonChart.prototype.constructor = CommonChart;

    return function(config){
        return new CommonChart(config);
    };

});