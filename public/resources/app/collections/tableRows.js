(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    var model = require("/resources/app/models/tableRow");
    var privateConfig = {
        "ready":false,
        "ui":null,
        "datasources":{
            "url":"",
            "data":{},
            /*对服务器返回的数据做预处理*/
            dataFilter:function(re,type){
                re = $.parseJSON(re);
                if(re.success){
                    var data = re.result.items;
                    this.context.counts = re.result.total;
                    this.context.amount = re.result.amount;
                    this.context.allData = re.result;
                    return (re = JSON.stringify(data));
                }else{
                    /*失败*/
                    var def = $.Deferred(this);
                    def.reject();
                    return false;
                }
            }
        },
        onChange:function(data){
            if(this.ui){
                this.ui.refresh({
                    "data":data !== this && data || this.models,
                    "event":this.nowStatus,
                    "collection":this
                });
            }
        },
        /*初始化处理函数*/
        initialize:function(){
            this.nowStatus = "render";
            this.bind('add', this.onChange, this);
            this.bind('reset', this.onChange, this);
            delete this.datasources.data.url;
            /*作用域*/
            this.datasources.context = this;
        },
        /*获取要显示的条目数*/
        doPageSize:function(data){
            this.datasources.data.limit = data.params.size;
            this.fn.getData.call(this);
        },
        fn:{
            getData:function(){
                if(this.going){
                    return false;
                }
                this.going = true;
                this.ui.showMarker();
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
        },
        update:function(data){
            this.datasources && $.extend(true,this.datasources.data,data.params);
            this.bind('change', this.onChange, this);
            this.datasources.context = this;
            this.fn.getData.call(this);
        }
    };

    return function(config){
        var collectionConfig = $.extend(true,{},privateConfig,(config||{}));
        collectionConfig.model = model(config.model);
        var collection = Backbone.Collection.extend(collectionConfig);
        return new collection;
    }

});