define(function(require){
    
    var _F = require("format");

    function link(config){

        config.params = config.params || {};
         /*原始设定*/
        this.originalConfig = (function(){
            var innerOriginalConfig = $.extend({},config);
            return innerOriginalConfig;
        })();
        
        /*处理完的设定*/
        this.config = _F.interfaceSettingFormat(config,config.data);
        /*扁平化原始数据*/
        this.flatData = {};
        this.ready = false;
        this.dirty = true;

        this.beforeUpdate = config.beforeUpdate || false;

        this.afterUpdate = config.afterUpdate || false;

        this.charts = [];
        var chartsName = this.config.target.split(","),chObj;
        for(var i = 0,len = chartsName.length;i<len;i++){
            chObj = Clicki.manager.getApp(chartsName[i]);
            if(chObj){
                this.charts.push(chObj);
            }
        }
        if(this.charts.length > 0){
            this.init();
        }
    }

    link.prototype = {
        init:function(){
            if(this.config.data){
                this.config.params = this.config.params || {};
                this.getFlatData();
            }
            this.update();
        },
        getFlatData:function(){
            function getData(data,cache){
                cache = cache||{};
                function shell(obj){
                    for(var n in obj){
                        if(n.match(/[A-Z]/)===null && n.toLowerCase().indexOf("dom") === -1 && n !== "sub"){
                            if(!(n in cache) && $.isPlainObject(obj[n])){
                                arguments.callee(obj[n]);
                            }else{
                                cache[n] = obj[n]
                            }
                        }
                    }
                }
                shell(data,cache);
                return cache;
            }
            this.flatData = getData.call(this,this.config.data);
        },
        formatData:function(){
            var data = {};
            for(var n in this.config.data){
                if(n.match(/[A-Z]/)===null && n.toLowerCase().indexOf("dom") === -1 && n !== "sub"){
                    data[n] = this.config.data[n];
                }
            }
            this.config.params.data = data;

            this.getFlatData();

        },
        update:function(upConfig){
            this.beforeUpdate && this.beforeUpdate.call(this);
            if(upConfig){
                this.config = null;
                this.config = {};
                this.config.params = this.config.params || {};
                this.config = _F.interfaceSettingFormat(upConfig,upConfig.data);
                this.config.params = $.extend(this.config.params,this.originalConfig.params);
                this.getFlatData();
                this.upToChart();
            }else{
                this.upToChart();
            }

            this.afterUpdate && this.afterUpdate();

        },
        upToChart:function(data){
            var title = this.originalConfig.title + "";
            title = _F.formatStr({title:title},"title",this.config.data,true);
            $.each(this.charts,function(i,n){
                n.reDraw(this.config.params,title);
            }.bind(this));
        }
    }

    return {
        name:"Linkage",
        init:function(config){
            return new link(config);
        }
    }
});