(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    var commonGrid = require("commonGrid");

    function LandingGrid(config){
        var privateConfig = {
            "ready":false,
            "plugin":["indicator","pager","amount","export","diggGrid"],
            "title":LANG("入口页数据表"),//
            "refreshConfig": {},

            /*初始化处理函数*/
            initialize: function(){
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
                this.condition = this.currentCondition || (this.rowData?this._getCondition(this.rowData, this.prevCondition):"");
                this.plugin = this.rowData?["indicator","pager","export"]:this.plugin;
                this.title = this.rowData?null:this.title;
                this.commonGrid = new commonGrid({
                    "id":this.$el,
                    "title":this.title,
                    "table":{
                        "params":{
                            "url":"/feed/group",
                            "type": "page_entrance",//
                            "order": "pageviews|-1",
                            "site_id": site_id,
                            "begindate":Clicki.manager.getDate().beginDate,
                            "enddate":Clicki.manager.getDate().endDate,
                            "limit":10,
                            "condition":this.condition
                        },
                        "dim":{"entrance_url_name":{
                            render:function(me, val, href, colNum){
                                var data = me.model.toJSON();
                                return '<em title="'+ data.x_axis.entrance_url_title + '">'+data.x_axis.entrance_url_title.cutMixStr(0,30,"...")+'</em><br /><a href="'+data.x_axis.entrance_url_name+'" target="_blank" title="'+LANG("在新页面打开")+'--'+data.x_axis.entrance_url_name+'">'+data.x_axis.entrance_url_name.cutMixStr(0,40,"...")+'</a>';
                            }
                        }},//
                        /*
                        "indicator":{//
                            "default":["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate"],
                            "all":["pageviews","sessions","visitors","new_visitors","old_visitors","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]
                        },
                        */
                        "tableBtn":{
                            "visit":{
                                "area":"entrance_url_name",
                                "className":"subvisitIcon",
                                "type":"html",
                                "method":{
                                    "type":"pop",
                                    "config":{
                                        "ui":{
                                            "innerCls":"Ex_popVisitChart",
                                            "title":{
                                                "show":true
                                            }
                                        }
                                    }
                                },
                                "config":{
                                    "url": "/statistic/visitordetail",
                                    "params": {
                                        "site_id":site_id,
                                        "out": 'html'
                                    },
                                },
                                "title":LANG("访客列表")
                            },
                            "trend":{
                                "area":"entrance_url_name",
                                "className":"subtrendIcon",//
                                "type":"commonChart",
                                "method":{
                                    "type":"pop",
                                    "config":{
                                        "ui":{
                                            "innerCls":"Ex_popTrendChart",
                                            "title":{
                                                "show":false
                                            }
                                        }
                                    }
                                },
                                "config":{
                                    //必要组件,负责charts的数据
                                    "chartsControl":{
                                        //能否比较
                                        "compare":false,
                                        "exportExcel":true,
                                        //可比较类型
                                        "category":{
                                            "items":[
                                                {"name":"","type":"page_entrance"}//
                                            ]
                                        },
                                        //类型的维度字段
                                        "dimension":{
                                            "os_type":"entrance_url_name"//
                                        },
                                        //可选择的指标
                                        "indicator":{
                                            "default":["pageviews","sessions","visitors"]//
                                        },
                                        "model":{
                                            //从group接口拉取数据
                                            "group":{
                                                "url":"/feed/trend",
                                                "params":{
                                                    "begindate":Clicki.manager.getDate().beginDate,
                                                    "enddate":Clicki.manager.getDate().endDate,
                                                    "site_id":site_id
                                                }
                                            },
                                            //从trend接口拉取数据
                                            "trend":{
                                                "url":"/feed/trend",
                                                "params":{
                                                    "begindate":Clicki.manager.getDate().beginDate,
                                                    "enddate":Clicki.manager.getDate().endDate,
                                                    "site_id":site_id
                                                }
                                            }
                                        }
                                    },
                                    //必要组件，负责charts的绘制
                                    "chartsPaint":{
                                        "model":{
                                            "config":{
                                                //图表类型
                                                "type":"area",
                                                //图标显示的维度字段
                                                "chartDimension":{
                                                    "date":{}
                                                },
                                                //重写图表的显示参数
                                                "setting":{
                                                },
                                                "special":{
                                                    "pageviews":{
                                                        type:"areaspline",
                                                        fillOpacity: 0.1,
                                                        lineWidth: 2,
                                                        shadow:false,
                                                        dataLabels: {
                                                            enabled: true,
                                                            formatter: function() {
                                                                if(this.y>0)return this.y;
                                                            }
                                                        }
                                                    },
                                                    "sessions":{
                                                        type:"spline",
                                                        shadow:false
                                                    },
                                                    "visitors":{
                                                        type:"spline",
                                                        shadow:false
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    //启用的组件
                                    "plugin":["chartsRange"]
                                },
                                "title":LANG("趋势图")
                            }
                        }
                    },
                    "plugin":this.plugin
                });
                this.ready = true;
            },

            _getCondition:function(rowData, prevCondition){
                var _par = "";
                for(var _n in rowData["keys"]){
                    _par += _n+"|"+rowData["keys"][_n]+",";
                }
                if(prevCondition){
                    _par = _par + prevCondition;
                }else{
                     _par = _par.substr(0,_par.length-1);
                }
                return _par;
            },
            update:function(data){
                this.commonGrid.update(data);
            },
            changeDate:function(data){
                this.commonGrid.changeDate(data);
            },
            destroy:function(){
                this.commonGrid && this.commonGrid.destroy();
                this.$el.find("*").unbind();
                this.$el.unbind().empty();
            }
        };

        var viewsConfig = $.extend(true,{
            "condition":"",
            "id":""
        },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }
    
    LandingGrid.prototype.constructor = LandingGrid;

    return function(config){
        return new LandingGrid(config);
    };

});