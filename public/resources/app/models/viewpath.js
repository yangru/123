(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");

    /*
    当前model的默认设定
    包含当前model的属性，事件等
    */
    var modelConfig = {
        /*model字段相关设定*/
        "fields":{
            "rows":{},
            "columns":{},
            "total":{}
        },
        "nowStatus":"load",
        /*接口相关设定
        "datasources":{
            "url":"/resources/temp/viewpath_report.json",
            "data":{},
            dataFilter:function(re,type){
                re = $.parseJSON(re);
                if(re.success){
                    var data = re.result.items;
                    data.total = this.context.necessary.pv.value;
                    return (re = JSON.stringify(data));
                }else{
                    var def = $.Deferred(this);
                    def.reject();
                    return false;
                }
            },
            "type":"GET"
        },*/
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
        "necessary":{
            "pv":{
                "url":"/feed/trend",
                "data":{
                    "type":"site",
                    "hourly":0,
                    "site_id":site_id,
                    "begindate":Clicki.manager.getDate().beginDate,
                    "enddate":Clicki.manager.getDate().endDate,
                    "page":1
                },
                "value":0
            },
            "source0_id":{
                "url":"/resources/temp/viewpath_source0_id.json",
                "data":{},
                "value":0
            },
            "sourcelist":{
                "url":"/VisitPath/dimfilters",
                "data":{"site_id":site_id},
                "value":0
            }
        },
        "ports":{
            "trend":"/feed/group",
            "childlist":"/VisitPath/childlist?site_id="+site_id
        },
        "ready":false,
        "incomingData":null,
        /*初始化处理函数*/
        initialize:function(){
            /*绑定change事件*/
            this.bind("change",this.onChange);

            /*作用域*/
            //this.datasources.context = this; 

            this.fn._getNecessary.call(this);
        },
        fn:{
            /*获取必要数据*/
            _getNecessary:function(){
                $.when(
                    $.getJSON(this.necessary.pv.url,this.necessary.pv.data),
                    $.getJSON(this.necessary.source0_id.url,this.necessary.source0_id.data),
                    $.getJSON(this.necessary.sourcelist.url,this.necessary.sourcelist.data)
                ).done(function(pv,source0_id,sourcelist){
                    this.necessary.pv.value = +(pv[0].result.amount.y_axis.sessions);
                    this.necessary.source0_id.value = +(source0_id[0].result.source0_id);
                    this.necessary.sourcelist.value = sourcelist[0].result.items;

                    if(this.incomingData){
                        this.incomingData.total = this.necessary.pv.value
                        this.set(this.incomingData);
                        this.getRows({},true,this.onChange);
                    }
                    this.ready = true;
                }.bind(this));
            },
            _getRowData:function(query,all,onDone){
                $.when.apply($,(function(me){
                    var args = [];
                    var paths = [];
                    var date = Clicki.manager.getDate();
                    var rids = me.fn._getParams.call(me,"rid");
                    var L1;
                    paths = me.fn._getParams.call(me,"url");
                    query.paths = paths;
                    L1 = me.attributes.columns.length;
                    for(var i =0;i<L1;i++){
                        args.push(
                            $.get(me.ports.trend,{
                                "type":"visitpath",
                                "begindate":date.beginDate,
                                "enddate": date.endDate,
                                "condition":"type_id|"+paths[i]+",label0_id|"+(rids[i]&&rids[i]||0),
                                "page":1,
                                "limit":10,
                                "site_id":site_id
                            })
                        );
                    }
                    paths = null;
                    return args;
                })(this))
                .done(function(){
                    var _data = [];
                    if(!_.isArray(arguments[0])){
                        var _arguments = [];
                        for(var j=0;j<arguments.length;j++){
                            _arguments.push(arguments[j]);
                        }
                        arguments = _arguments.length && [_arguments] || [];
                    }
                    var _items = [];
                    var col = this.attributes.columns;
                    for(var i=0;i<arguments.length;i++){
                        _items[i] = {};
                        _items[i].text = col[i].text;
                        _items[i].sessions = arguments[i][0].result.amount.y_axis.sessions;
                    }
                    _data.push(_items);
                    _items = null;
                    onDone.call(this,_data);
                    _data = null;
                }.bind(this));
            },
            _getParams:function(name){
                var paths = [];
                var L1 = this.attributes.columns.length;
                for(var j = 0;j<L1;j++){
                    paths.push(this.attributes.columns[j][name]);
                }
                return paths;
            }
        },
        getRows:function(query,all,onDone){
            this.nowStatus = "getRows";
            this.fn._getRowData.apply(this,[query,all,onDone]);
        },
        /*删除子项*/
        delColumn:function(config){
            console.log("delColumn")
        },
        addColumn:function(data){
            this.nowStatus = "addColumn";
            this.set(data,{silent:true});
            this.fn._getRowData.apply(this,[{},true,this.onChange]);
        },
        /*添加行*/
        addRow:function(data){
            this.nowStatus = "addRow";
            var query = {
                "dim_type":data.dim_type,
                "dim_value":data.dim_value
            };
            this.set(data,{silent: true});
            this.fn._getRowData.apply(this,[query,false,this.onChange]);
        },
        delRow:function(){
            console.log("delRow")
        },
        destroy:function(){
        },
        /*添加新报告*/
        addNewReport:function(data){
            this.nowStatus= "addNewReport";
            if(!this.ready){
                return false;
            }
            this.incomingData = $.extend(
                (this.incomingData || {}),
                data
            );
            this.set(this.incomingData);
            this.incomingData = null;
        },
        /*更改报告*/
        changReport:function(data){
            this.nowStatus= "changReport";
            if(!this.ready){
                return false;
            }
            this.incomingData = $.extend(
                (this.incomingData || {}),
                data
            );
            this.set(this.incomingData);
            this.incomingData = null;
            this.getRows({},true,this.onChange);
        },
        update:function(config){
            this.incomingData = config.data || {};
            this.incomingData.total = this.necessary.pv.value
            this.set(this.incomingData);
            this.getRows({},true,this.onChange);
        },
        /*
        [
            {text:null,num:this.attributes.total},
            {text:"首页",num:123},
            {text:"注册",num:12}
        ],
        [
            {text:"直接访问",num:null},
            {text:null,num:123},
            {text:null,num:323},
        ]
        */
        /*model对应的ui模块*/
        "ui":null
    }
    
    return function(config){
        return Backbone.Model.extend($.extend(true,{},modelConfig,(config||{})));
    }

});