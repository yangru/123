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
        /*格式化服务端数据*/
        format:function(data){
            var amountData = {};
            //根据y轴顺序显示总计
            $.each(data.amount.y_axis, function(key, value){
                var temp = {};
                temp.value = value;
                temp.text = data.caption[key].title;
                temp.explain = data.caption[key].desc;
                temp.hidden = true;
                var def = this.ui.selected || ["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate"];
                $.each(def, function(n, nn){
                    if(key === nn){
                        temp.hidden = false;
                    }
                }.bind(this));
                def = null;
                amountData[key] = temp;
                temp = null;
            }.bind(this));
            return this.formatData(amountData);
        },
        /*初始化处理函数*/
        initialize:function(){
            /*绑定change事件*/
            this.bind("change",this.onChange);

            this.ui && (this.ui.model = this);

            if(this.datacontent){
                this.set(this.format(this.datacontent));
            }else if(this.datasources){
                this.datasources.context = this;
                this.fn.getData.call(this);
            }else{
                this.ui.render();
            }
        },
        /*更新*/
        update:function(data){
            if(data.datacontent){
                this.ui.selected = this.ui.selected || data.indicator;
                this.set(this.format(data.datacontent));
            }else if(this.datasources){
                this.datasources && $.extend(true,this.datasources.data,data.params);
                this.datasources.context = this;
                this.fn.getData.call(this);
            }
        },
        /*格式化数据，使适应模板*/
        formatData:function(amountData){
            $.each(amountData,function(key,value){
                var _val;
                if(key && value.value !== undefined){
                    _val = value.value===null?"0":""+value.value;
                    if(key === "bounce_rate"){
                        _val = Math.round(parseFloat(_val)*10000)/100 +"%";
                    }else if(key === "avg_loadtime"){
                        (parseInt(_val)) && (_val = (_val/1000)+LANG("秒"));
                    }else if(key === "avg_staytime"){
                        (parseInt(_val)) && (_val = (new Date(_val*1000).timemark([":",":",""],true)));
                    }else {
                        (parseInt(_val)) && (_val = parseInt(_val).separated());
                    }
                    amountData[key].value = _val;
                }
            });
            return amountData;
        },
        /*设置数据隐藏*/
        setData:function(showLis){
            $.each(this.toJSON(), function(key, value){
                value.hidden = true;
                $.each(showLis, function(n,nn){
                    if(key == nn){
                         value.hidden = false;
                    }
                });
            });
            this.ui.refresh({event:"render"});
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
        }
    }

    return function(config){
        return new (Backbone.Model.extend($.extend(true,{},modelConfig,(config||{}))));
    }

});