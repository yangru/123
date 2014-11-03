define(function(require,exports,module){

    var $ = require("jquery");
    var Backbone = require("backbone");
    var layout = require("layout");
    /*主模块构造函数*/
    function Table(config){
        var tableId = config.id;
    	var privateConfig = {
            /*tableLayout*/
            "tableLayout":{},
            /*最终配置缓存*/
            "config":{
                "layout":{},
                "relation":{}
            },
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
                /*表格设置*/
                this.fn.setTable.call(this);
                /*加载组件*/
                this.fn.loadPlugin.call(this);
                this.ready = true;
            },
            "fn":{
                setTable:function(){
                    this.$el.html(this.tpl);
                    this.tableLayout = new layout();
                },
                /*加载组件*/
                loadPlugin:function(){
                    for(var n in this.pluginConfig){
                        if(_.include(this.plugin, n)){
                            /*合并必要参数*/
                            this.pluginConfig[n].config.table = this;
                            this.pluginConfig[n].config.indicator = this.indicator;
                            this.pluginConfig[n].config.dim = this.dim;
                            this.pluginConfig[n].config.tableBtn = this.tableBtn;
                            this.pluginConfig[n].config.tableCtrl = this.tableCtrl;
                            this.pluginConfig[n].config.params = this.params;
                            if(n == "tableRows"){
                                this.pluginConfig[n].config.collection.datasources.data = this.params;
                                this.pluginConfig[n].config.collection.datasources.url = this.params.url;
                            }

                            this.config.layout[n] = {};
                            this.config.layout[n].type = this.pluginConfig[n].type || null;
                            this.config.layout[n].config = this.pluginConfig[n].config || null;
                            this.config.layout[n].renderTo = this.pluginConfig[n].renderTo || null;
                            this.config.relation[n] = this.pluginConfig[n].relation || null;
                        }
                    }
                    this.tableLayout.add({
                        "layout":this.config.layout,
                        "relation":this.config.relation,
                        onDone:function(){
                            $("#"+tableId+"_gridBody").appendTo($("#"+tableId+"_gridTable"))
                        }
                    });
                }
            },
            /*控制其他模块执行对应操作*/
            controlOthers:function(event, data){
                this.grid.gridLayout.manager.run("table",{
                    event:event,
                    data:data
                });
                this.grid.gridLayout.manager.run("table",{
                    event:"syncParams",
                    data:data
                });
                this.tableLayout.manager.run("tableRows",{
                    event:event,
                    data:data
                });
                this.tableLayout.manager.run("tableTop",{
                    event:event,
                    data:data
                });
            },
            /*显示相应指标*/
            doIndicator:function(data){
                seajs.log("table get it");
                this.controlOthers("doIndicator", data);
            },
            /*过滤相应条件*/
            doFilter:function(data){
                seajs.log("table get it");
                this.controlOthers("doFilter", data);
            },
            /*更新*/
            update:function(data){
                seajs.log("table get it update");
                this.controlOthers("update", data);
            },
            doFillData:function(data){
                this.controlOthers("doFillData", data);
            },
            /*排序*/
            doSort:function(data){
                seajs.log("table get it do sort"+data.params.order);
                this.controlOthers("doSort", data);
            },
            /*跳转*/
            goToPage:function(data){
                seajs.log("go to"+data.params.page);
                this.controlOthers("goToPage", data);
            },
            /*更新时间*/
            changeDate:function(data){
                this.controlOthers("changeDate", data);
            },
            /*修改条目显示条数*/
            doPageSize:function(data){
                this.controlOthers("doPageSize", data);
            },
            /*搜索*/
            doSearch:function(data){
                this.controlOthers("doSearch", data);
            },
            /*在指定位置增加checkbox*/
            doCheckBox:function(data){
                this.controlOthers("doCheckBox",data);
            },
            /*注销*/
	    	destroy:function(){
                this.tableLayout.destroy();
                this.$el.find("*").unbind();
                this.$el.empty();
            }
    	};

    	var viewsConfig = $.extend(true,{
            "tpl":'<table id="'+tableId+'_gridTable" class="gridTable"></table>',
            "pluginConfig":{
                "tableRows":{
                    type:"tableRows",
                    config:{
                        "id":tableId+"_gridBody",
                        "rowView":{
                        },
                        "params":{},
                        "collection":{
                            "datasources":{
                                "url":"",
                                "data":{}
                            },
                            "model":{
                            }
                        }
                    },
                    relation:["tableTop"],
                    renderTo:tableId+"_gridTable"
                },
                "tableTop":{
                    type:"tableTop",
                    config:{
                        "id":tableId+"_gridHead",
                        "params":{},
                        "model":{
                        }
                    },
                    relation:["tableRows"],
                    renderTo:tableId+"_gridTable"
                }
            }
        },config||{},privateConfig);

    	var view = Backbone.View.extend(viewsConfig);

        return new view;
    }

    Table.prototype.constructor = Table;

    return function(config){
        return new Table(config);
    };

});