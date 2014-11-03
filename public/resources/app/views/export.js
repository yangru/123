define(function(require,exports,module){

    var $ = require("jquery");
    var Backbone = require("backbone");

    function Export(config){
        /*
            el:$(".Ex_export"),
            params:{url,type,condition,dims,site_id,begindate,enddate},
            "subjet":this
        */
        /*私有设置，这里应该是关键的属性，方法的配置*/
        var privateConfig = {
            href:null,
            ready:false,
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
                this.fn._bindEvent.call(this);
                this.ready = true;
            },
            "fn":{
                _setExport:function(){
                    var params = this.params
                        ,_date = Clicki.layout.manager.getDate();
                    var obj = $.extend({},params,{
                        "tmpl":"export"
                        ,"limit":9999
                        ,"begindate":_date.begindate
                        ,"enddate":_date.enddate
                    });
                    delete obj.url;
                    delete obj.page;
                    this.href  = params["url"]+"?"+$.param(obj);
                    obj = null;
                },
                _bindEvent:function(){
                    this.$el.addClass("gridExport");
                    this.$el.click(function(){
                        this.subjet && (this.params = $.extend(this.params,this.subjet.config.params));
                        this.fn._setExport.call(this);
                        window.location.href = this.href;
                    }.bind(this));
                }
            },
            update:function(data){
                seajs.log("export change params");
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

    Export.prototype.constructor = Export;

    return {
        init:function(config){
            return new Export(config);
        }
    };

});