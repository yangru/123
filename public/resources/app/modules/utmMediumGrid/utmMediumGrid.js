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

    function UtmMediumGrid(config){
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
                            "type": "utm_medium",//
                            "order": "pageviews|-1",
                            "site_id": site_id,
                            "begindate":Clicki.manager.getDate().beginDate,
                            "enddate":Clicki.manager.getDate().endDate,
                            "limit":10,
                            "condition":this.condition
                        },
                        "dim":{"utm_spot_website":{}},//
                        /*"indicator":{//
                            "default":["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"],
                            "all":["pageviews","sessions","visitors","new_visitors","old_visitors","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate","reserve0","reserve1","reserve2","reserve3","reserve4","new_pageviews","active_visitors"]
                        },*/
                        "tableBtn":{
                            "page":{
                                "area":"utm_spot_website",
                                "className":"subpageIcon",
                                "type":"pageUrlGrid",
                                "method":{
                                    "type":"sub",
                                    "config":{
                                        
                                    }
                                },
                                "title":LANG("受访页面")
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
    
    UtmMediumGrid.prototype.constructor = UtmMediumGrid;

    return function(config){
        return new UtmMediumGrid(config);
    };

});