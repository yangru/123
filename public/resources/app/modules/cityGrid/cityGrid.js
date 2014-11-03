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

    function CityGrid(config){
        var privateConfig = {
            "ready":false,
            "plugin":["indicator","pager","amount","export","diggGrid"],
            "title":LANG("访客城市数据表"),//
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
                            "type": "city",//
                            "order": "pageviews|-1",
                            "site_id": site_id,
                            "begindate":Clicki.manager.getDate().beginDate,
                            "enddate":Clicki.manager.getDate().endDate,
                            "limit":10,
                            "condition":this.condition
                        },
                        "dim":{"city_name":{}},//
                        /*"indicator":{//
                            "default":["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"],
                            "all":["pageviews","sessions","visitors","new_visitors","old_visitors","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate","reserve0","reserve1","reserve2","reserve3","reserve4","new_pageviews","active_visitors"]
                        },*/
                        "tableBtn":{
                            "client":{
                                "area":"city_name",
                                "className":"subclientIcon",
                                "type":"tabpanel",
                                "method":{
                                    "type":"sub",
                                    "config":{
                                    }
                                },
                                "config":{
                                    items:[
                                        {
                                            text:LANG("操作系统"),
                                            scope:true,
                                            html:'<div class="theList_os"></div>',
                                            afterRender:function(mAttributes){
                                                var set = {layout:{}};
                                                set.layout["theList_os"+this.parent.cid] = {
                                                    "type":"osGrid",
                                                    "config":{
                                                        "id": mAttributes.dom.find("div:first"),
                                                        "rowData": this.parent.rowData,
                                                        "prevCondition": this.parent.prevCondition
                                                    }
                                                };
                                                Clicki.layout.add(set);
                                                set = null;
                                            }
                                        },
                                        {
                                            text:LANG("浏览器"),
                                            scope:true,
                                            html:'<div class="theList_browser"></div>',
                                            afterRender:function(mAttributes){
                                                var set = {layout:{}};
                                                set.layout["theList_browser"+this.parent.cid] = {
                                                    "type":"browserGrid",
                                                    "config":{
                                                        "id": mAttributes.dom.find("div:first"),
                                                        "rowData": this.parent.rowData,
                                                        "prevCondition": this.parent.prevCondition
                                                    }
                                                };
                                                Clicki.layout.add(set);
                                                set = null;
                                            }
                                        },
                                        {
                                            text:LANG("语言"),
                                            scope:true,
                                            html:'<div class="theList_language"></div>',
                                            afterRender:function(mAttributes){
                                                var set = {layout:{}};
                                                set.layout["theList_language"+this.parent.cid] = {
                                                    "type":"languageGrid",
                                                    "config":{
                                                        "id": mAttributes.dom.find("div:first"),
                                                        "rowData": this.parent.rowData,
                                                        "prevCondition": this.parent.prevCondition
                                                    }
                                                };
                                                Clicki.layout.add(set);
                                                set = null;
                                            }
                                        },
                                        {
                                            text:LANG("分辨率"),
                                            scope:true,
                                            html:'<div class="theList_resolution"></div>',
                                            afterRender:function(mAttributes){
                                                var set = {layout:{}};
                                                set.layout["theList_resolution"+this.parent.cid] = {
                                                    "type":"resolutionGrid",
                                                    "config":{
                                                        "id": mAttributes.dom.find("div:first"),
                                                        "rowData": this.parent.rowData,
                                                        "prevCondition": this.parent.prevCondition
                                                    }
                                                };
                                                Clicki.layout.add(set);
                                                set = null;
                                            }
                                        }
                                    ]
                                },
                                "title":LANG("客户端")
                            },
                            "loyalty":{
                                "area":"city_name",
                                "className":"subloyaltyIcon",
                                "type":"tabpanel",
                                "method":{
                                    "type":"sub",
                                    "config":{
                                    }
                                },
                                "config":{
                                    items:[
                                        {
                                            text:LANG("停留时间"),
                                            scope:true,
                                            html:'<div class="theList_stayslot"></div>',
                                            afterRender:function(mAttributes){
                                                var set = {layout:{}};
                                                set.layout["theList_stayslot"+this.parent.cid] = {
                                                    "type":"stayslotGrid",
                                                    "config":{
                                                        "id": mAttributes.dom.find("div:first"),
                                                        "rowData": this.parent.rowData,
                                                        "prevCondition": this.parent.prevCondition
                                                    }
                                                };
                                                Clicki.layout.add(set);
                                                set = null;
                                            }
                                        },
                                        {
                                            text:LANG("访问深度"),
                                            scope:true,
                                            html:'<div class="theList_depth"></div>',
                                            afterRender:function(mAttributes){
                                                var set = {layout:{}};
                                                set.layout["theList_depth"+this.parent.cid] = {
                                                    "type":"depthGrid",
                                                    "config":{
                                                        "id": mAttributes.dom.find("div:first"),
                                                        "rowData": this.parent.rowData,
                                                        "prevCondition": this.parent.prevCondition
                                                    }
                                                };
                                                Clicki.layout.add(set);
                                                set = null;
                                            }
                                        },
                                        {
                                            text:LANG("访问次数"),
                                            scope:true,
                                            html:'<div class="theList_reviewslot"></div>',
                                            afterRender:function(mAttributes){
                                                var set = {layout:{}};
                                                set.layout["theList_reviewslot"+this.parent.cid] = {
                                                    "type":"reviewslotGrid",
                                                    "config":{
                                                        "id": mAttributes.dom.find("div:first"),
                                                        "rowData": this.parent.rowData,
                                                        "prevCondition": this.parent.prevCondition
                                                    }
                                                };
                                                Clicki.layout.add(set);
                                                set = null;
                                            }
                                        }
                                    ]
                                },
                                "title":LANG("访问质量")
                            },
                            "visit":{
                                "area":"city_name",
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
                                "area":"city_name",
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
                                                {"name":"","type":"city"}//
                                            ]
                                        },
                                        //类型的维度字段
                                        "dimension":{
                                            "city":"city_name"//
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
            changeDate:function(data){
                this.commonGrid.changeDate(data);
            },

            update:function(data){
                this.commonGrid.update(data);
            },
            destroy:function(){
                this.commonGrid.destroy();
            }
        };

        var viewsConfig = $.extend(true,{
            "condition":"",
            "id":""
        },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }
    
    CityGrid.prototype.constructor = CityGrid;

    return function(config){
        return new CityGrid(config);
    };

});