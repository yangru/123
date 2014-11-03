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

    function Referer_typeGrid(config){
        var privateConfig = {
            "ready":false,
            "plugin":["indicator","pager","amount","export","diggGrid"],
            "title":LANG("来源类型数据表"),
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
                $.get("/custom/tabs?type=utm&site_id="+site_id,function(re){
                    this.render(re);
                }.bind(this),"json");
            },

            refresh:function(config){
                this[config.event] && this[config.event](config.data);
            },

            render:function(re){
                this.condition = this.currentCondition || (this.rowData?this._getCondition(this.rowData, this.prevCondition):"");
                this.plugin = this.rowData?["indicator","pager","export"]:this.plugin;
                this.title = this.rowData?null:this.title;
                var spot = {};
                if(re.result.items[0] && (re.result.items[0].type == "googleutm")){
                    spot = {
                        "area":"source0_name",
                        "className":"subspotIcon",
                        "type":"tabpanel",
                        "method":{
                            "type":"sub",
                            "config":{
                            }
                        },
                        "config":{
                            "items":[
                                {
                                    text:LANG("广告"),
                                    scope:true,
                                    html:'<div class="theList_utm_spot"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {layout:{}};
                                        set.layout["theList_utm_spot"+this.parent.cid] = {
                                            "type":"utmSpotGrid",
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
                                    text:LANG("广告活动"),
                                    scope:true,
                                    html:'<div class="theList_utm_campaign"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {layout:{}};
                                        set.layout["theList_utm_campaign"+this.parent.cid] = {
                                            "type":"utmCampaignGrid",
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
                                    text:LANG("关键词"),
                                    scope:true,
                                    html:'<div class="theList_utm_keyword"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {layout:{}};
                                        set.layout["theList_utm_keyword"+this.parent.cid] = {
                                            "type":"utmKeywordGrid",
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
                        "filter":"source0_id|5",
                        "title":LANG("广告")
                    };
                }else{
                    spot = {
                        "area":"source0_name",
                        "className":"subspotIcon",
                        "type":"tabpanel",
                        "method":{
                            "type":"sub",
                            "config":{
                            }
                        },
                        "config":{
                            "items":[
                                {
                                    text:LANG("广告"),
                                    scope:true,
                                    html:'<div class="theList_gutm_campaign"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {layout:{}};
                                        set.layout["theList_gutm_campaign"+this.parent.cid] = {
                                            "type":"gutmCampaignGrid",
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
                                    text:LANG("广告内容"),
                                    scope:true,
                                    html:'<div class="theList_gutm_content"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {layout:{}};
                                        set.layout["theList_gutm_content"+this.parent.cid] = {
                                            "type":"gutmContentGrid",
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
                                    text:LANG("关键词"),
                                    scope:true,
                                    html:'<div class="theList_gutm_term"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {layout:{}};
                                        set.layout["theList_gutm_term"+this.parent.cid] = {
                                            "type":"gutmTermGrid",
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
                                    text:LANG("媒体"),
                                    scope:true,
                                    html:'<div class="theList_gutm_medium"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {layout:{}};
                                        set.layout["theList_gutm_medium"+this.parent.cid] = {
                                            "type":"gutmMediumGrid",
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
                                    text:LANG("广告来源"),
                                    scope:true,
                                    html:'<div class="theList_gutm_source"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {layout:{}};
                                        set.layout["theList_gutm_source"+this.parent.cid] = {
                                            "type":"gutmSourceGrid",
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
                        "filter":"source0_id|5",
                        "title":LANG("广告")
                    };                
                }
                this.commonGrid = new commonGrid({
                    "id":this.$el,
                    "title":this.title,
                    "table":{
                        /*表格数据参数*/
                        "params":{
                            "url":"/feed/group",
                            "type": "referer_type",
                            "order": "pageviews|-1",
                            "site_id": site_id,
                            "begindate":Clicki.manager.getDate().beginDate,
                            "enddate":Clicki.manager.getDate().endDate,
                            "limit":10,
                            "condition":this.condition
                        },
                        /*第一维度*/
                        "dim":{
                            "source0_name":{}
                        },
                        /*默认显示指标和所有指标*/
                        /*"indicator":{
                            "default":["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate"],
                            "all":["pageviews","sessions","visitors","new_visitors","old_visitors","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate","reserve0","reserve1","reserve2","reserve3","reserve4","new_pageviews","active_visitors"]
                        },*/
                        /*按钮*/
                        "tableBtn":{
                            "referer":{
                                "area":"source0_name",
                                "className":"subrefererIcon",
                                "type":"tabpanel",
                                "method":{
                                    "type":"sub",
                                    "config":{
                                    }
                                },
                                "config":{
                                    items:[
                                        {
                                            text:LANG("来源域名"),
                                            scope:true,
                                            html:'<div class="theList_referer_domain"></div>',
                                            afterRender:function(mAttributes){
                                                var set = {layout:{}};
                                                set.layout["theList_referer_domain"+this.parent.cid] = {
                                                    "type":"referer_domainGrid",
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
                                            text:LANG("来源列表"),
                                            scope:true,
                                            html:'<div class="theList_referer_url"></div>',
                                            afterRender:function(mAttributes){
                                                var set = {layout:{}};
                                                set.layout["theList_referer_url"+this.parent.cid] = {
                                                    "type":"referer_urlGrid",
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
                                "filter":"source0_id|1,source0_id|3,source0_id|4",
                                "title":LANG("来源列表")
                            },                            
                            "se":{
                                "area":"source0_name",
                                "className":"subseIcon",
                                "type":"seGrid",
                                "method":{
                                    "type":"sub",
                                    "config":{
                                        
                                    }
                                },
                                "filter":"source0_id|2",
                                "title":LANG("搜索引擎")
                            },
                            "spot":spot,
                            "landing":{
                                "area":"source0_name",
                                "className":"sublandingIcon",
                                "type":"landingGrid",
                                "method":{
                                    "type":"sub",
                                    "config":{

                                    }
                                },
                                "title":LANG("入口页")
                            },
                            "geo":{
                                "area":"source0_name",
                                "className":"subgeoIcon",
                                "type":"tabpanel",
                                "method":{
                                    "type":"sub",
                                    "config":{
                                    }
                                },
                                "config":{
                                    items:[
                                        {
                                            text:LANG("省份"),
                                            scope:true,
                                            html:'<div class="theList_region"></div>',
                                            afterRender:function(mAttributes){
                                                var set = {layout:{}};
                                                set.layout["theList_region"+this.parent.cid] = {
                                                    "type":"regionGrid",
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
                                            text:LANG("城市"),
                                            scope:true,
                                            html:'<div class="theList_city"></div>',
                                            afterRender:function(mAttributes){
                                                var set = {layout:{}};
                                                set.layout["theList_city"+this.parent.cid] = {
                                                    "type":"cityGrid",
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
                                "title":LANG("访客地区")
                            },
                            "client":{
                                "area":"source0_name",
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
                                "area":"source0_name",
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
                                "area":"source0_name",
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
                                "area":"source0_name",
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
                                                {"name":"","type":"referer_domain"}//
                                            ]
                                        },
                                        //类型的维度字段
                                        "dimension":{
                                            "referer_domain":"referer_domain_name"//
                                        },
                                        //可选择的指标
                                        "indicator":{
                                            "default":["pageviews","sessions","visitors"]//
                                        },
                                        "model":{
                                            //从group接口拉取数据
                                            "group":{
                                                "url":"/feed/trend"
                                            },
                                            //从trend接口拉取数据
                                            "trend":{
                                                "url":"/feed/trend"
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
                    "plugin":this.plugin   /*要显示的模块*/
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
    
    Referer_typeGrid.prototype.constructor = Referer_typeGrid;

    return function(config){
        return new Referer_typeGrid(config);
    };

});