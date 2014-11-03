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
        /*数据接口*/
        "ports":{
            "del":"/custom/tab_delete",
            "edit":"/custom/tab_edit"
        },
        /*view模块*/
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

            if(this.datacontent){
                this.defSet(this.datacontent);
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
                        this.getCustomBuild();
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
            },
            _setBuild:function(data){
                if(!data){
                    return;
                }
                var _data = {};
                for(var n in data){
                    if(n !=="custom" && data[n].build.length){
                        _data[n] = data[n];
                    }
                }
                _data.custom = data.custom;
                return _data;
            }
        },
        defSet:function(data){
            var _params = {"type":"status","subtype":this.params.type};
            this.params.site_id && (_params.site_id = this.params.site_id);
            $.get("/custom/tabs",_params,function(re){
                if(re.success){
                    this.type = re.result.type;
                    this.subtype = re.result.subtype;
                    //如果服务器没有对象，需要新建
                    if(re.result.items.length == 0){
                        this.status = "create";
                    }else{
                        $.each(re.result.items[0], function(key, value){
                            //把服务端的对象设置已选属性
                            if(data.options[key]){
                                data.options[key].selected = true;
                            }
                        });
                        this.status = "edit";
                    }
                    //set进model
                    this.set({"type": data.type},{silent: true});
                    this.set({"build": this.fn._setBuild(data.build)},{silent: true});
                    this.set({"always": data.always || []},{silent: true});
                    this.set({"options": data.options});
                    this.getCustomBuild();
                }
            }.bind(this),"json");
        },
        update:function(data){
            var caption = data.datacontent && data.datacontent.caption || {};
            var data = data.datacontent && data.datacontent.filter || data;
            if(!data.options){
                data.options = {};
                var arr = data.build.quality.build.concat(data.build.traffic.build).concat(data.build.reserve && data.build.reserve.build || []);
                for(var i=0,len=arr.length;i<len;i++){
                    data.options[arr[i]] = {};
                    data.options[arr[i]].text = caption[arr[i]].title;
                }
            }
            data.build["def"].act = true;
            /*获取服务端存储的数据*/
            $.get("/custom/tabs",{"type":"status","site_id":this.params.site_id,"subtype":this.params.type},function(re){
                if(re.success){
                    this.type = re.result.type;
                    this.subtype = re.result.subtype;
                    /*如果服务器没有对象，需要新建*/
                    if(re.result.items.length == 0){
                        this.status = "create";
                    }else{
                        $.each(re.result.items[0], function(key, value){
                            /*把服务端的对象设置已选属性*/
                            if(data.options[key]){
                                data.options[key].selected = true;
                            }
                            if(key === "type"){
                                data.build["def"].act = false;
                                data.build[value].act = true;
                            }
                        });
                        this.status = "edit";
                    }
                    /*set进model*/
                    this.set({"type": data.type}, {silent: true});
                    this.set({"build": this.fn._setBuild(data.build)}, {silent: true});
                    this.set({"always": data.always || []},{silent: true});
                    this.set({"options": data.options});
                }
            }.bind(this),"json");
        },
        /*每次选好自定义指标都会把数据存进服务器端*/
        setSelected:function(beenSelected){
            var data = this.toJSON();
            this.statusData = {};
            data.build["custom"].build=beenSelected;
            $.each(data.options, function(key,value){
                data.options[key].selected = false;
            });
            $.each(beenSelected, function(key,value){
                if(data.options[value]){
                    data.options[value].selected = true;
                    this.statusData[value] = " ";
                }
            }.bind(this));
            this.statusData["type"] = "custom";
            (this.status == "edit") && (this.statusData["id"]=1);
            $.get(this.ports.edit,{"type":this.type,"subtype":this.subtype,"site_id":this.params.site_id,"data":JSON.stringify(this.statusData)},function(){
                this.status = "edit";
            }.bind(this),"json");
            data = null;
        },
        /*获取某个类型的指标包含的指标*/
        getFilterBuild:function(type){
            var data = this.toJSON();
            var FilterBuild = data.build[type].build? data.build[type].build:[];
            data = null;
            return FilterBuild;
        },
        /*获取自定义指标包含的指标*/
        getCustomBuild:function(){
            var data = this.toJSON();
            /*少判断了个类型,Edwin fixed*/
            if(!data.build["custom"]){
                return;
            }
            data.build["custom"].build = [];
            $.each(data.options, function(key,value){
                if(value.selected){
                    data.build["custom"].build.push(key);
                }
            });
        },
        /*保存状态到服务端*/
        setStatus:function(type){
            var data = this.toJSON();
            this.statusData = {};
            var beenSelected =  data.build["custom"].build;
            $.each(beenSelected, function(key,value){
                if(data.options[value]){
                    this.statusData[value] = " ";
                }
            }.bind(this));
            this.statusData["type"] = type;
            (this.status == "edit") && (this.statusData["id"]=1);
            $.get(this.ports.edit,{"type":this.type,"subtype":this.subtype,"site_id":this.params.site_id,"data":JSON.stringify(this.statusData)},function(){
                this.status = "edit";
            }.bind(this),"json");
        }
    }

    return function(config){
        return new (Backbone.Model.extend($.extend(true,{},modelConfig,(config||{}))));
    }

});