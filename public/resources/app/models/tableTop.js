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
        "ui":null,
        onChange:function(data){
            if(this.ui){
                this.ui.refresh({
                    "data":data !== this && data || this.models,
                    "event":this.nowStatus,
                    "model":this
                });
            }
        },
        /*初始化处理函数*/
        initialize:function(){
            this.nowStatus = "render";
            this.bind('change', this.onChange, this);
            this.ui && (this.ui.model = this);
            if(this.datacontent){
                this.set(this.format(this.datacontent));
            }else if(this.datasources){
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
        },
        format:function(datacontent){
            this.y_axis = (datacontent.items[0] && datacontent.items[0].y_axis) || (datacontent.amount && datacontent.amount.y_axis) || null;
            return datacontent.caption;
        },
        update:function(data){
            if(data.datacontent){
                this.set(this.format(data.datacontent));
            }else if(this.datasources){
                this.datasources && $.extend(true,this.datasources.data,data.params);
                this.datasources.context = this;
                this.fn.getData.call(this);
            }
        }
    };

    return function(config){
         return new (Backbone.Model.extend($.extend(true,{},modelConfig,(config||{}))));
    }

});