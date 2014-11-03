(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = require("jquery");
    var commonGrid = require("commonGrid");

    function PageUrlGrid(config){
        
        var privateConfig = {
            "ready":false,
            "plugin":["indicator","pager","amount","export","search"],
            // "title":"搜索引擎数据表",//
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
                // this.title = this.rowData?null:this.title;
                this.commonGrid = new commonGrid({
                    "id":this.$el,
                    // "title":this.title,
                    "table":{
                        "params":{
                            "url":"/feed/group",
                            "type": "page_url",
                            "order": "pageviews|-1",
                            "site_id": site_id,
                            "begindate":Clicki.manager.getDate().beginDate,
                            "enddate":Clicki.manager.getDate().endDate,
                            "limit":10,
                            "condition":this.condition
                        },
                        "dim":{"page_url_name":{
                            render:function(me, val, href, colNum){
                                var data = me.model.toJSON();
                                data.x_axis.page_url_title || (data.x_axis.page_url_title = '');
                                return data.x_axis.page_url_title.cutMixStr(0,30,"...")+"<br/>"+'<a href="'+href+'" target="_blank">'+data.x_axis.page_url_name.cutMixStr(0,30,"...")+'</a>';
                            }
                        }},//
                        /*"indicator":{//
                            "default":["pageviews","entrances","exits","click","input","avg_staytime","avg_loadtime","visitors","sessions"],
                            "all":["pageviews","sessions","visitors","new_visitors","old_visitors","avg_staytime","avg_loadtime","exits","entrances","click","input"]
                        },*/
                        "tableBtn":{
                            "referer":{
                                "area":"page_url_name",
                                "className":"subrefererIcon",
                                "type":"referer_urlGrid",
                                "method":{
                                    "type":"sub",
                                    "config":{
                                        
                                    }
                                },
                                "config":{
                                    // "noPrevCondition":1
                                },
                                "title":LANG("来源页面")
                            },
                            "viewtree":{
                                "area":"page_url_name"
                                ,"className":"subflowIcon"
                                ,"type":"viewpathGrid"
                                ,"title":LANG("路径分析")
                                ,"method":{
                                    "type":"sub",
                                    "config":{}
                                }
                            },
                            "trend":{
                                "area":"page_url_name",
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
                                                {"name":"","type":"page_url"}//
                                            ]
                                        },
                                        //类型的维度字段
                                        "dimension":{
                                            "page_url":"page_url_name"//
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
                                                    "site_id":site_id,
                                                    "viewtb":1
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
                            },
                            "heatmap":{
                                "area":"page_url_name",
                                "className":"subheatmapIcon",
                                "type":"fun",
                                "method":{
                                    "type":"fun",
                                    "config":{
                                    }
                                },
                                fun:function(mAttributes){
                                    var href = mAttributes.data.x_axis.page_url_name + "#/clicki/heatmap";
                                    window.open(href, "_blank");
                                },
                                "title":LANG("热图")
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
            //更新时间
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
    
    PageUrlGrid.prototype.constructor = PageUrlGrid;

    return function(config){
        return new PageUrlGrid(config);
    };

});