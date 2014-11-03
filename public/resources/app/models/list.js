define(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");

    /*
    当前model的默认设定
    包含当前model的属性，事件等
    */
    var modelConfig = {
        /*接口相关设定*/
        "datasources":{
            "url":"/",
            "data":{"test":1},
            /*对服务器返回的数据做预处理*/
            dataFilter:function(re,type){
                re = $.parseJSON(re);
                if(re.success){
                    var data = re.result;
                    if(_.isFunction(this.context.format)){
                        data = this.context.format(data);
                    }
                    return (re = JSON.stringify(data));
                }else{
                    /*失败*/
                    var def = $.Deferred(this);
                    def.reject();
                    return false;
                }
            }
        },
        "going":false,
        "ports":null,
        "nowStatus":"load",
        /*change的时候*/
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

            if(this.datacontent){
                this.set(this.datacontent);
            }else{
                this.datasources.context = this;
                this.fn.getData.call(this);
            }
        },
        fn:{
            getData:function(){
                if(this.going){
                    //TODO 进入正在加载流程，UE上提示不要重复提交等等操作
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
                        //console.log("!");
                    }
                )
                /*不管成功或失败的时候都会执行*/
                .always(function(){
                    this.going = false;
                });
            },
            delData:function(data,index){
                if($.isPlainObject(this.ports) && this.ports.del && !this.going){
                    this.going = true;
                    var me = this;
                    $.get(
                        this.ports.del.url,
                        _.isFunction(this.ports.del.params) && this.ports.del.params.call(this,data) || {}
                    )
                    .then(
                        function(def,state){
                            //TODO 删除attributes中的相应数据
                            //console.log(data);
                            //me.unset(data);
                            var tmp = [];
                            for(var i = 0;i<me.attributes.items.length;i++){
                                if(i !== index){
                                    tmp.push(me.attributes.items[i]);
                                }
                            }
                            me.attributes.items = tmp;
                            _.isFunction(me.ports.del.onDone) && me.ports.del.onDone.call(me,data);
                            tmp = null;
                            me.change();
                        },
                        /*失败时执行*/
                        function(def,state){
                            _.isFunction(me.ports.del.onFail) && me.ports.del.onFail.call(me,data);
                        }
                    )
                    .always(function(){
                        me.going = false;
                    });
                }
            }
        },
        getSelected:function(index){
            if(index === undefined){
                var data = this.attributes.items;
                var result;
                var setDef = function(data){
                    if(result){
                        return;
                    }
                    for(var i =0,len = data.length;i<len;i++){
                        if(data[i].childs){
                            setDef.apply(this,[data[i].childs]);
                        }else{
                            if(data[i].def){
                                result = data[i];
                                break;
                            }
                        }
                    }
                };
                setDef(data);
                return result;
            }else{
                if((index.toString().indexOf("_") !== -1)){
                    dataIndex = index.split("_");
                }else{
                    dataIndex = [];
                    dataIndex.push((+index));
                }
                var data = this.attributes.items[dataIndex.shift()];
                $.each(dataIndex, function(key, value){
                    data = data.childs[value];
                });
                return data;
            }
        },
        setSelected:function(index){
            var dataIndex, indexMode = 0, selected = undefined;
            if((index.toString().indexOf("_") !== -1)){
                dataIndex = index.split("_");
            }else{
                dataIndex = parseInt(index);
                indexMode = 1;
            }
            var data = this.attributes.items;
            var setDef = function(data){
                for(var i =0,len = data.length;i<len;i++){
                    if(data[i].childs){
                        setDef.apply(this,[data[i].childs]);
                    }else{
                        if (indexMode) {
                            if (dataIndex == 0){
                                data[i].def = true;
                                selected = data[i];
                            }else {
                                data[i].def = false;
                            }
                            dataIndex--;
                        }else {
                            data[i].def = false;
                        }
                    }
                }
            };
            setDef(data);
            if (indexMode == 0){
                while (dataIndex.length > 0){
                    indexMode = dataIndex.shift();
                    selected = data[indexMode];
                    if (!selected) break;
                    data = data[indexMode].childs;
                }
                if (selected) selected.def = true;
            }
            return selected;
        },
        add:function(data){
            this.nowStatus = "add";
            $.each(this.attributes.items,function(i,n){
                n.def = false;
            });
            this.nowStatus = "addList";
            var tmp = {"data":data,"i":this.attributes.items.push(data)}
            this.onChange(tmp);
            tmp = null;
        },
        del:function(data){
            this.nowStatus = "del";
            this.fn.delData.apply(this,[this.getSelected(data),data]);
        },
        edit:function(i,data){
            this.attributes.items[i] = $.extend(this.attributes.items[i],data);
        },
        update:function(data){
            data && (this.datasources.data = $.extend(true,this.datasources.data,data));
            this.nowStatus = "load";
            this.fn.getData.call(this);
        },
        format:false,
        /*model对应的ui模块*/
        ui:null
    }
    
    return function(config){
        return Backbone.Model.extend($.extend(true,{},modelConfig,config));
    }

    

});