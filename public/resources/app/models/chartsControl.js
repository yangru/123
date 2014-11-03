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
        },

        //根据类型和参数获取该类型的所有维度数据
        setCategory:function(categoryType){
            var data = this.toJSON();
            this.categoryType = data["currentCategory"] = categoryType;
            data["dimensionStatus"] = {};
            data["currentCategory"] = categoryType;
            this.group.params.type = categoryType;
            this.nowStatus = "renderDimension";
            if(data[categoryType]){
                this.set(data);
            }else{
                $.get(this.group.url, this.group.params, function(re){
                    data[categoryType] = re.result;
                    this.set(data);
                }.bind(this), "json");
            }
        },

        //获取当前类型的所有维度的值和索引
        getDimensions:function(categoryType, dimensionType){
            var items = this.attributes[categoryType].items;
            var dimensions = [];
            for(var i=0,len=items.length;i<len;i++){
                var dimension = {};
                dimension.value = items[i].x_axis[dimensionType];
                dimension.index = i;
                dimensions.push(dimension);
                dimension = null;
            }
            return dimensions;
        },

        //获取当前索引的维度数据
        getDimensionByIndex:function(index){
            var currentCategory = this.get("currentCategory");
            return this.get(currentCategory).items[index];
        },

        //获取当前索引的维度的趋势数据，并且存储状态
        setDimTrend:function(index, dimensionValue, status){
            var data = this.toJSON();
            var currentCategory = this.categoryType;
            var dimension = data[currentCategory];
            var dimensionStatus = $.extend(true,{},data["dimensionStatus"]|| {});
            if(dimensionStatus[dimensionValue]){
                dimensionStatus[dimensionValue].act = status;
            }else{
                dimensionStatus[dimensionValue] = {
                    "type":dimensionValue,
                    "act":status,
                    "index":index,
                    "viewtb":this.trend.params.viewtb
                }
            }
            data["dimensionStatus"] = dimensionStatus;
            data["currentCategory"] = categoryType;
            this.nowStatus = "renderTrend";
            if(dimension.items[index].z_axis && (this.trend.params.viewtb === dimensionStatus[dimensionValue].viewtb)){
                this.set(data);
            }else{
                //需要当前类型和当前维度的keys
                this.trend.params.type = currentCategory;
                var _par = "";
                for(var _n in dimension.items[index]["keys"]){
                    _par += _n+"|"+dimension.items[index]["keys"][_n]+",";
                }
                _par = _par.substr(0,_par.length-1);
                this.trend.params.condition = _par;
                $.get(this.trend.url, this.trend.params, function(re){
                    dimension.items[index].z_axis = re.result;
                    data[currentCategory] = dimension;
                    dimensionStatus[dimensionValue].viewtb = this.trend.params.viewtb;
                    this.set(data);
                }.bind(this), "json");
            }
        },

        //获取当前类型的所有维度数据，用于不对比
        setDimGroup:function(categoryType){
            var data = this.toJSON();
            this.categoryType = data["currentCategory"] = categoryType;
            this.nowStatus = "renderGrounp";
            this.group.params.type = categoryType;
            if(data[categoryType]){
                this.set(data);
            }
            $.get(this.group.url, this.group.params, function(re){
                data[categoryType] = re.result;
                this.set(data);
            }.bind(this), "json");
        },
        
        //根据indicators数组，获取标题
        getIndicators:function(indicators){
            var indicatorsData = {};
            var currentCategory = this.get("currentCategory");
            var caption = this.get(currentCategory).caption;
            for(var i=0,len=indicators.length;i<len;i++){
                indicatorsData[indicators[i]] = {
                    "type":indicators[i],
                    "title":caption[indicators[i]].title
                }
            }
            return indicatorsData;
        },

        //根据时间范围更新趋势数据，对比状态下
        doCompareRange:function(data){
            var me = this;
            var viewtb = data.viewtb;
            var data = this.toJSON();
            var currentCategory = this.categoryType;
            var dimension = data[currentCategory];
            var dimensionStatus = $.extend(true,{},data["dimensionStatus"]|| {});
            this.trend.params.viewtb = viewtb;
            //get方法
            var getAsync = function(key, value) {
                return Wind.Async.Task.create(function(t){
                    $.get(me.trend.url, me.trend.params, function(re){
                        value.viewtb = viewtb;
                        console.log(key+" changeTime "+viewtb);
                        dimension.items[value.index].z_axis = re.result;
                        t.complete("success", dimension);
                    }.bind(this), "json");
                });
            }
            //把所有激活而且范围不对的数据进行更新
            var getAllAsync = eval(Wind.compile("async", function (dimensionStatus) {
                for(var n in dimensionStatus){
                    if(dimensionStatus[n].act && (dimensionStatus[n].viewtb !== viewtb)){
                        $await(getAsync(n, dimensionStatus[n]));
                    }
                }
                data[currentCategory] = dimension;
                data["dimensionStatus"] = dimensionStatus;
                me.nowStatus = "renderCompareRange";
                console.log("setData");
                me.set(data);
            }));
            getAllAsync(dimensionStatus).start();
        },

        //非对比状态下更新数据
        doUnCompareRange:function(data){
            var viewtb = data.viewtb;
            var data = this.toJSON();
            var categoryType = this.categoryType;
            data["currentViewtb"] = viewtb;
            data["currentCategory"] = categoryType;
            this.nowStatus = "renderUnCompareRange";
            this.group.params.type = categoryType;
            this.group.params.viewtb = viewtb;
            $.get(this.group.url, this.group.params, function(re){
                data[categoryType] = re.result;
                this.set(data);
            }.bind(this), "json");        
        },

        //根据时间更新趋势数据，对比状态下
        doCompareDate:function(data){
            var begindate = data.begindate;
            var enddate = data.enddate;
            var data = this.toJSON();
            var currentCategory = this.categoryType;
            var dimension = data[currentCategory];
            var dimensionStatus = $.extend(true,{},data["dimensionStatus"]|| {});
            this.trend.params.begindate = begindate;
            this.trend.params.enddate = enddate;
            //get方法
            /*var getAsync = eval(Wind.compile("async", function (key, value) {
                $.get("js/"+key+".json", function(re){
                    dimension.items[value.index].z_axis = re.result;
                }.bind(this), "json");
            }));*/
            //把所有激活而且范围不对的数据进行更新
            /*$.each(dimensionStatus, function(key, value){
                if(value.act){
                    $await(getAsync(key, value));
                }
            });*/
            data[currentCategory] = dimension;
            data["dimensionStatus"] = dimensionStatus;
            data["currentCategory"] = categoryType;
            this.nowStatus = "renderCompareDate";
            this.set(data);
        },

        //非对比状态下更新数据
        doUnCompareDate:function(data){
            $.extend(this.group.params,data.params);
            var data = this.toJSON();
            var categoryType = this.categoryType;
            this.nowStatus = "renderUnCompareDate";
            this.group.params.type = categoryType;
            this.group.params.begindate = begindate;
            this.group.params.enddate = enddate;
            $.get(this.group.url, this.group.params, function(re){
                data[categoryType] = re.result;
                data["currentCategory"] = categoryType;
                this.set(data);
            }.bind(this), "json");
        },

        //获取导出报表的超链接
        getCompareExport:function(index){
            var data = this.toJSON();
            var categoryType = this.categoryType;
            var condition = data[categoryType].items[index].keys;
            var params = this.trend.params;
            var obj = $.extend({},params,{
                "type":categoryType,
                "tmpl":"export",
                "limit":9999,
                "condition":condition
            });
            delete obj.page;
            return this.trend.url+"?"+$.param(obj);
        },

        //获取不对比状态的导出报表的超链接
        getUnCompareExport:function(){
            var data = this.toJSON();
            var categoryType = this.categoryType;
            var params = this.group.params;
            var obj = $.extend({},params,{
                "type":categoryType,
                "tmpl":"export",
                "limit":9999,
            });
            delete obj.page;
            return this.group.url+"?"+$.param(obj);
        }
    }

    return function(config){
        return new (Backbone.Model.extend($.extend(true,{},modelConfig,(config||{}))));
    }

});