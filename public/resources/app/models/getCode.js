(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    var modelConfig = {
        "datasources":{
            "url":"/custom/tabs",
            "data":{},
            /*对服务器返回的数据做预处理*/
            dataFilter:function(re,type){
                re = $.parseJSON(re);
                if(re.success){
                    return  JSON.stringify({items:re.result.items});
                }else{
                    /*失败*/
                    var def = $.Deferred(this);
                    def.reject();
                    return false;
                }
            }
        },
        "ready":false,
        "ui":null,
        "nowStatus":"render",

        onChange:function(data){
            if(this.ui){
                this.ui.refresh({
                    "data":data !== this && data || this.attributes,
                    "event":this.nowStatus,
                    "model":this
                });
            }
        },
        
        /*初始化处理函数*/
        initialize:function(){
            /*绑定change事件*/
            this.bind("change",this.onChange);

            this.ui && (this.ui.model = this);
            /*如果有数据则不去服务端拉取*/
            if(this.datacontent){
                this.set({items:this.datacontent});
            }else{
                this.datasources.context = this;
                this.fn.getData.call(this);
            }
        },

        fn:{
            getData:function(){
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
                        this.ready = true;
                    },
                    /*失败时执行*/
                    function(def,state){
                        console.log("!");
                    }
                )
                /*不管成功或失败的时候都会执行*/
                .always(function(){
                    this.going = false;
                });
            }
        }
    }

    return function(config){
        return new (Backbone.Model.extend($.extend(true,{},modelConfig,(config||{}))));
    }

});