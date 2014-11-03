(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){
    /**
     * 需要传入
     * custom_model
     * type
     * subtype
     * site_id
     */
    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    var modelConfig = {
        "ready":false,
        "ui":null,
        "ports":{
            "del":{
                "url":"/custom/tab_delete"
            },
            "edit":{
                "url":"/custom/tab_edit"
            }
        },
        onChange:function(data){
            if(this.ui){
                this.ui.refresh({
                    "data":data !== this && data || this.attributes,
                    "event":this.nowStatus,
                    "model":this
                });
            }
        },
        save:function(title,diggQueue){
            this.attributes.title = title;
            var report = $.extend(true,{},this.attributes);
            var data = report;
            while(!_.isEmpty(data.childs.childs)){
                data = data.childs;
            }
            data.childs = null;
            var param={"type":this.type,"subtype":this.subtype,"site_id":this.site_id};
            $.post(this.ports.edit.url+"?"+$.param(param),{"data":JSON.stringify(report)},function(re){
                if(re.success){
                    this.attributes.id = this.attributes.id || re.result.items.max_id;
                    this.ui.afterSave && this.ui.afterSave(this.attributes);
                }else{
                    console.log("error");
                }
            }.bind(this),"json");
        },
        del: function(){
            var data ={};
            data.id = this.toJSON() && this.toJSON().id;
            $.get(this.ports.del.url,{"type":this.type,"subtype":this.subtype,"site_id":this.site_id,"data":JSON.stringify(data)},function(re){
                if(re.success){
                    this.ui.afterDel && this.ui.afterDel();
                    this.ui.delPop.hide();
                }else{
                    console.log("error");
                }
            }.bind(this),"json");
        },
        /*初始化处理函数*/
        initialize:function(){
            /*绑定change事件*/
            this.bind("change",this.onChange);

            this.ui && (this.ui.model = this);

            if(this.datacontent){
                this.set(this.datacontent);
            }else{
                this.datasources.context = this;
                this.fn.getData.call(this);
            }
        },
        fn:{
            getData:function(){
                this.ui.showMarker();
                if(this.going){
                    return false;
                }
                this.going = true;
                /*更新数据*/
                this.fetch(this.datasources)
                .then(
                    /*成功时执行*/
                    function(def,state){
                        if(this.onLoad){
                            this.onLoad.call(this);
                        }
                    },
                    /*失败时执行*/
                    function(def,state){
                        console.log("!");
                    }
                )
                /*不管成功或失败的时候都会执行*/
                .always(function(){
                    this.going = false;
                    this.ui.hideMarker();
                });
            }
        }
    }

    return function(config){
        return new (Backbone.Model.extend($.extend(true,{},modelConfig,(config||{}))));
    }

});






