define(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");

    /*
    当前model的默认设定
    包含当前model的属性，事件等
    */
    var modelConfig = {
        /*初始化处理函数*/
        initialize:function(){
        },
        add:function(data){
        },
        del:function(data){
        },
        setEvent:function(config){
        }
    }
    
    return function(config){
        return Backbone.Model.extend($.extend(true,{},modelConfig,config));
    }

    

});