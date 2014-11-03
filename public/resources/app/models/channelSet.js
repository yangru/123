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
            this.datasources && (this.url = this.datasources.url);
            this.data && this.set(this.data);
        },
        save:function(){
            var data = this.toJSON();
            $.get("/custom/tab_edit",{"type":this.type,"subtype":this.subtype,"site_id":this.site_id,"data":JSON.stringify(data)},function(re){
                if(re.success){
                    this.ui.afterSave && this.ui.afterSave();
                }else{
                    console.log("error");
                }
                /*this.ui.refresh({"event":"renderEdit","data":data.id,"status":"edit"});*/
            }.bind(this),"json");
        },
        del: function(){
            var data = this.toJSON();
            $.get("/custom/tab_delete",{"type":this.type,"subtype":this.subtype,"site_id":this.site_id,"data":JSON.stringify(data)},function(re){
                if(re.success){
                    this.ui.afterSave && this.ui.afterSave();
                }else{
                    console.log("error");
                }
            }.bind(this),"json");
        }
    }
    return Backbone.Model.extend(modelConfig);

});