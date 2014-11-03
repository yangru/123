(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    var privateConfig = {
        "ui":null,
        "ready":false,
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
        }
    };

    return function(config){
        var modelConfig = $.extend(true,{},privateConfig,(config||{}));
        return Backbone.Model.extend(modelConfig);
    }

});