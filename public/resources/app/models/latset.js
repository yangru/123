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
        "ports":{
            /*删除接口*/
            "del":"/custom/tab_delete",
            /*读取，修改，创建操作的接口*/
            "edit":"/custom/tab_edit"
        },
        "ready":false,
        "ui":null,
        onChange:function(data){
            if(this.ui){
                this.ui.refresh({
                    "data":data !== this && data || this.attributes,
                    "event":this.nowStatus,
                    "model":this
                });
            }
        },
        getLatData: function(){
            var data = this.attributes;
            var latData={
                label:[],
                value:[]
            };
            if(!data){
                return latData;
            }
            for(var i=0; i<4; i++){
                if(data["label"+i+"_name"]){
                    latData.label.push(data["label"+i+"_name"]);
                }
                if(data["value"+i+"_name"]){
                    latData.value.push(data["value"+i+"_name"]);
                }
            }
            data = null;
            return latData;
        },

        formatLatData: function(latData){
            this.attributes || (this.attributes = {});
            latData.id && (this.attributes.id = latData.id);
            latData.title && (this.attributes.title = latData.title);
            latData.template && (this.attributes.template = latData.template);
            $.each(latData.label,function(key,value){
                this.attributes["label"+key+"_name"] = value;
            }.bind(this));
            $.each(latData.value,function(key,value){
                this.attributes["value"+key+"_name"] = value;
            }.bind(this));
        },

        getLatTitle:function(id){
            var data = this.attributes;
            return data.title
        },

        saveLatData:function(latData){
            this.formatLatData(latData);
            $.get("/custom/tab_edit",{"type":this.type,"subtype":this.subtype,"site_id":this.site_id,"data":JSON.stringify(this.attributes)},function(re){
                if(re.success){
                    this.ui.doms.save.find(".saveLatSet").attr("disabled",false);
                    this.attributes.id = this.attributes.id || re.result.items.max_id;
                    this.id = this.attributes.id;
                    this.ui.showCodeArea({keyCode:1});
                    this.ui.afterSave && this.ui.afterSave(this.attributes);
                }else{
                    console.log("error");
                }
            }.bind(this),"json");
        },

        delLatSet: function(){
            var data = {};
            data.id = this.attributes.id;
            $.get("/custom/tab_delete",{"type":this.type,"subtype":this.subtype,"site_id":this.site_id,"data":JSON.stringify(data)},function(re){
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

            /*作用域*/
            this.datasources.context = this;

            this.fn.getData.call(this);
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
        },
    }

    return function(config){
        return new (Backbone.Model.extend($.extend(true,{},modelConfig,(config||{}))));
    }

});






