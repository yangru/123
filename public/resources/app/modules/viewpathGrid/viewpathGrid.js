define(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = require("jquery");
    var commonGrid = require("commonGrid");

    function ViewpathGrid(config){
        var privateConfig = {
            "ready":false,
            "plugin":["pager","amount","export"],
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
                this.plugin = this.rowData?["pager","export"]:this.plugin;

                var _datacontent = {
                    "caption":{
                        "exits":{
                            "desc":LANG("出口页次数是指某个页面作为一次会话的最后一个被访问页面的次数。")
                            ,"title":LANG("出口页次数")
                        }
                        ,"sessions":{
                            "desc":LANG("会话次数（Sessions），指网站产生的会话过程次数，从用户进入网站到用户离开（关闭浏览器或离开网站）算一个会话过程。")
                            ,"title":LANG("会话次数")
                        }
                        ,"page_url_name":{
                            "desc":""
                            ,"title":LANG("受访页面")
                        }
                    }
                    ,"filter":{
                        "build":{
                            "def":{
                                "text":LANG("默认")
                                ,"build":[
                                    "sessions"
                                    ,"exits"
                                ]
                            }
                            ,"quality":{
                                "text":LANG("质量指标")
                                ,"build":[]
                            }
                            ,"traffic":{
                                "text":LANG("流量指标")
                                ,"build":[]
                            }
                            ,"reserve":[]
                        }
                    }
                }

                this.commonGrid = new commonGrid({
                    "id":this.$el,
                    "table":{
                        "params":{
                            "url":"/VisitPath/urlconvertion"
                            ,"from_url_id":this.rowData.keys.page_url_id
                            ,"site_id":site_id
                            ,"begindate":Clicki.manager.getDate().beginDate
                            ,"enddate":Clicki.manager.getDate().endDate
                            ,"limit":10
                            ,"page":1
                            ,"order":"sessions|-1",
                        },
                        "dim":{"page_url_name":{
                            render:function(me, val, href, colNum){
                                var data = me.model.toJSON();
                                return data.x_axis.page_url_title+"<br/>"+'<a href="'+href+'">'+data.x_axis.page_url_name.cutMixStr(0,30,"...")+'</a>';
                            }
                        }},
                        "tableBtn":{
                            "viewtree":{
                                "area":"page_url_name"
                                ,"className":"subflowIcon"
                                ,"type":"viewpathGrid"
                                ,"title":LANG("路径分析")
                                ,"method":{
                                    "type":"sub",
                                    "config":{}
                                }
                            }
                        },
                        "pluginConfig":{
                            "tableRows":{
                                "config":{
                                    "data":{
                                        "datacontent":_datacontent
                                    }
                                }
                            }
                            ,"tableTop":{
                                "config":{
                                    "data":{
                                        "datacontent":_datacontent
                                    }
                                }
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
    
    ViewpathGrid.prototype.constructor = ViewpathGrid;

    return function(config){
        return new ViewpathGrid(config);
    };

});