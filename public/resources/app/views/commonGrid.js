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
    /*
        现有组件： 
        commonGrid: table,indicator(model),pager,amount(model),export,filter,popCommonGrid
        table: tableTop(model),tableRows(collection),tableRow(model),tableBtn
        组件必要参数：
        params
        ready
    */
    function CommonGrid(config){
        var gridId = "grid"+Math.ceil(Math.random()*10000);
        var privateConfig = {
            /*gridLayout*/
            "gridLayout":{},
            /*模块Id*/
            "gridId":gridId,
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
                /*设置表格*/
                this.fn.setGrid.call(this);
                /*构建表格*/
                this.fn.buildTable.call(this);
                /*构建组件*/
                this.fn.loadPlugin.call(this);
                this.callback && this.callback();
            },

            "fn":{
                setGrid:function(){
                    this.title && this.$el.append('<div class="gridTitle">'+this.title+'</div>');
                    this.$el.append(this.tpl);
                    this.gridLayout = new layout();
                },
                /*建立表格*/
                buildTable:function(){
                    this.tableConfig.config.grid = this;
                    var tableRelation = [];
                    for(var i=0,len=this.plugin.length;i<len;i++){
                        if(_.include(this.tableConfig.relation, this.plugin[i])){
                            tableRelation.push(this.plugin[i]);
                        }
                    }
                    this.gridLayout.add({
                        "layout":{
                            "table":{
                               "type":this.tableConfig.type,
                                "config":$.extend(true,this.table,this.tableConfig.config)
                            }
                        },
                        "relation":{
                            "table":tableRelation
                        }
                    });
                },
                /*加载组件*/
                loadPlugin:function(){
                    this.plugin.push("table");
                    for(var n in this.pluginConfig){
                        if(_.include(this.plugin, n)){
                            /*组合必要参数*/
                            $.extend(true,this.pluginConfig[n].config.params,this.table.params);
                            this.pluginConfig[n].config.grid = this;
                            this.config.layout[n] = {
                                type: this.pluginConfig[n].type,
                                config: this.pluginConfig[n].config
                            };
                            //判断插件是否有加载
                            this.config.relation[n] = [];
                            for(var i=0,len=this.plugin.length;i<len;i++){
                                if(_.include(this.pluginConfig[n].relation, this.plugin[i])){
                                    this.config.relation[n].push(this.plugin[i]);
                                }
                            }
                        }else{
                            $("#"+this.pluginConfig[n].config.id).remove();
                        }
                    }
                    this.gridLayout.add({
                        "layout":this.config.layout,
                        "relation":this.config.relation
                    });
                }
            },

            changeDate:function(data){
                this.gridLayout.get("table").changeDate(data);
            },

            update:function(data){
                this.gridLayout.get("table").update(data);
            },

            destroy:function(){
                this.gridLayout.destroy();
                this.$el.find("*").unbind();
                this.$el.empty();
            }
        };

        var viewsConfig = $.extend(true,{
            /*表格的默认设置*/
            "tableConfig":{
                "type":"table",
                "config":{
                    "id":gridId+"_table",
                    /*tableRows包含tableRow,tbaleRow包含tableBtn*/
                    "plugin":["tableTop","tableRows"]
                },
                "relation":["amount","export","pager","filter","indicator","search","diggGrid"]
            },
            /*各模块的默认设置*/
            "pluginConfig":{
                "indicator":{
                    "type":"indicator",
                    "config":{
                        "id":gridId+"_indicator",
                        "params":{},
                        "model":{}
                    },
                    "relation":["table"]
                },
                "pager":{
                    "type":"pager",
                    "config":{
                        "id":gridId+"_pager",
                        "pageSetting":{
                            "pageIndex":1,/*当前页码*/
                            "size":10/*每次显示页数*/
                        },
                        "params":{}
                    },
                    "relation":["table"]
                },
                "amount":{
                    "type":"amount",
                    "config":{
                        "id":gridId+"_amount",
                        "model":{
                            "nowStatus":"render"
                        }
                    },
                    "relation":[]
                },
                "export":{
                    "type":"export",
                    "config":{
                        "id":gridId+"_export",
                        "params":{}
                    },
                    "relation":[]
                },
                "export_sub":{
                    "type":"views/export_sub",
                    "config":{
                        "id":gridId+"_export_sub",
                        "params":{}
                    },
                    "relation":[]
                },
                "filter":{
                    "type":"filter",
                    "config":{
                        "id":gridId+"_filter",
                        "params":{}
                    },
                    "relation":["table"]
                },
                "search":{
                    "type":"search",
                    "config":{
                        "id":gridId+"_search",
                        "params":{}
                    },
                    "relation":["table"]
                },
                "diggGrid":{
                    "type":"diggGrid",
                    "config":{
                        "id":gridId+"_diggGrid",
                        "params":{}
                    },
                    "relation":["table"]
                }
            },
            /*组件模板，新增组件需要增加该组件id的div*/
            "tpl":'<div id="'+gridId+'_search" class="search"></div><div id="'+gridId+'_export" class="export"></div><div id="'+gridId+'_export_sub" class="export"></div><div id="'+gridId+'_filter" class="filter"></div><div id="'+gridId+'_indicator" class="indicator"></div><div id="'+gridId+'_amount" class="amount"></div><div id="'+gridId+'_table" class="table"></div><div id="'+gridId+'_pager" class="pager gridPage"></div><div id="'+gridId+'_diggGrid" class="diggGrid"></div>'
        },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }
    
    CommonGrid.prototype.constructor = CommonGrid;

    return function(config){
        return new CommonGrid(config);
    };

});