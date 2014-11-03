define(function(require,exports,module){

    var $ = window.$ || window.jQuery || require("jquery");
    var Backbone = require("backbone");

    function Filter(config){
        /*私有设置，这里应该是关键的属性，方法的配置*/
        var privateConfig = {
            href:null,
            ready:false,
            tpl:'<input type="checkbox" id="filterAdsAndSe"><label>'+LANG("过滤广告与搜索引擎")+'</label>',
            refresh:function(config){
                !this.model && config.model && (this.model = config.model);
                this[config.event] && this[config.event](config.data);
            },
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
                this.$el.append(this.tpl);
                this.fn._bindEvent.call(this);
                this.ready = true;
            },
            "fn":{
                _bindEvent:function(){
                    var me = this;
                    this.$el.find("#filterAdsAndSe").bind("change",function(){
                        var hasChk = $(this).attr("checked")?true:false;
                        var old = me.params.condition && me.params.condition.indexOf("source0_id|1") === -1 && me.params.condition || false;
                        if(hasChk){
                            me.params.condition = old?old+",source0_id|1":"source0_id|1";
                        }else{
                            if(old){
                                me.params.condition= old.replace(/,source0_id\|1/ig,"");
                            }else{
                                me.params.condition = "";
                            }
                        }
                        me.params.page = 1;
                        me.grid && me.grid.gridLayout.manager.run("filter",{
                            "event":"doFilter",
                            "data":{
                                "params":me.params
                            }
                        });
                    });
                }
            },
            syncParams:function(data){
                seajs.log("pager doFilter");
                $.extend(true,this.params, data.params);
            },
            update:function(data){
                seajs.log("filter change params");
                $.extend(true,this.params, data.params);
            },
            destroy:function(){
                this.$el.find("*").unbind();
                this.$el.unbind().empty();
            }
        }

        var viewsConfig = $.extend(true,{

        },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }

    Filter.prototype.constructor = Filter;

    return {
        init:function(config){
            return new Filter(config);
        }
    };

});