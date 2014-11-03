(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    /*chart 默认设置*/
    var defaultSetting = require("chartsDefault");
    /*各种格式化方法*/
    var base = require("base");
    var modelConfig = {
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
        /*初始化处理函数*/
        initialize:function(){
            /*绑定change事件*/
            this.bind("change",this.onChange);
            this.ui && (this.ui.model = this);
            if(this.datacontent){
                this.set(this.format(this.datacontent));
            }
        },
        //修改要显示的指标
        doIndicator:function(data){
            this.currentIndicator = data.indicator;
            var chartData = this.toJSON();
            var allSeries = chartData.allSeries;
            var newSeries = [];
            for(var i=0,len=allSeries.length;i<len;i++){
                if(_.include(data.indicator, allSeries[i].indicatorType)){
                    newSeries.push(allSeries[i]);
                }
            }
            chartData.series = newSeries;
            this.set(chartData);
        },
        //对比状态下绘制charts
        doCompareChart:function(data){
            this.nowStatus = "render";
            //没用数据就初始化
            if(!this.data){
                this.set(this.format(data.datacontent, data.dimensionType, data.indicators));
            }else{
                //如果是激活状态，合并数据显示
                if(data.status){
                    var formated = this.format(data.datacontent, data.dimensionType, data.indicators);
                    var chartData = this.toJSON();
                    chartData.series = chartData.series.concat(formated.series);
                    chartData.allSeries = chartData.allSeries.concat(formated.allSeries);
                    this.set(chartData);
                //如果是非激活状态，去掉相关数据
                }else{
                    var chartData = this.toJSON();
                    var newSeries = [];
                    var newAllSeries = [];
                    for(var i=0,len=chartData.series.length;i<len;i++){
                        if(chartData.series[i].dimensionType !== data.dimensionType){
                            newSeries.push(chartData.series[i]);
                        }
                    }
                    for(var i=0,len=chartData.allSeries.length;i<len;i++){
                        if(chartData.allSeries[i].dimensionType !== data.dimensionType){
                            newAllSeries.push(chartData.allSeries[i]);
                        }
                    }
                    chartData.series = newSeries;
                    chartData.allSeries =newAllSeries
                    this.set(chartData);
                }
            }
        },
        //非对比状态下绘制charts
        doUnCompareChart:function(data){
            this.nowStatus = "render";
            var formated = this.format(data.datacontent, data.dimensionType, data.indicators);
            this.set(formated);
        },
        //对比状态下控制时间范围
        doCompareRange:function(data){
            var series = [];
            var allSeries = [];
            for(var i=0,len=data.dataitems.length;i<len;i++){
                var formated = this.format(data.dataitems[i], data.dimensionTypes[i], data.indicators);
                series = series.concat(formated.series);
                allSeries = allSeries.concat(formated.allSeries);
                console.log(data.dimensionTypes[i]+" doRange");
            }
            var chartData = this.toJSON();
            chartData.series = series;
            chartData.allSeries = allSeries;
            this.set(chartData);
        },
        //非对比状态下控制时间范围
        doUnCompareRange:function(data){
            this.nowStatus = "render";
            var formated = this.format(data.datacontent, data.dimensionType, data.indicators);
            this.set(formated);
        },
        //清空charts的数据
        doClearChart:function(data){
            var chartData = this.toJSON();
            chartData.series = [];
            chartData.allSeries = [];
            this.set(chartData);
        },

        format:function(data, dimensionType, indicators){
            this.data = data;
            return this.doFormat(data, this.config, dimensionType, indicators);
        },

        doFormat:function(data, config, dimensionType, indicators){
            /*初始化配置*/
            var indicators = indicators || ["pageviews"];
            var dimensionType = dimensionType || "";
            var setting  =$.extend(true,{},defaultSetting[config.type]);
            var isPie = config.type === "pie"?true:false;
            var amount = data.amount?parseInt(data.amount.y_axis[indicators[0]]):false;
            var xAxisCategories = [],series = [],allSeries = [];
            var chartDimension = _.keys(config.chartDimension) || false;
            var items = data.items;
            var caption = data.caption;
            var tmpData = {};
            var special = config.special||false;
            var self = this;
            var subtitle = config.subtitle || false;

            this.currentIndicator = indicators;

            function change(str){
                var dd = new Date(str);
                var tmp = ""+str;
                if(($.browser.msie && tmp.split("-").length>2) || (!isNaN(dd.getFullYear()) && tmp.split("-").length>2)){
                    tmp = tmp.substr(tmp.indexOf("-")+1);
                }
                return tmp;
            }
            var _i = 0;

            /*修改副标题*/
            //setting.subtitle.text = subtitle || setting.subtitle.text;

            /*格式化数据*/
            $.each(items,function(n,v){
                /*每条数据的x轴*/
                /*TODO 指标自定义渲染*/
                $.each(v["x_axis"],function(nn,vv){
                    if(chartDimension  && _.include(chartDimension , nn)){
                        xAxisCategories.push(change(vv));
                    }else if(!chartDimension ){
                        xAxisCategories.push(change(vv));
                    }     
                });
                /*每条数据的y轴*/
                $.each(v["y_axis"],function(nn,vv){
                    if(_.include(indicators, nn)){
                        tmpData[nn] = tmpData[nn] || {};
                        /*说明数据指标*/
                        tmpData[nn].indicatorType = nn;
                        tmpData[nn].dimensionType = dimensionType;
                        /*TODO 获得数据维度*/
                        //////////////////////翻译//////////////////////
                        tmpData[nn].name = LANG(tmpData[nn].name) || (dimensionType + " " + LANG(caption[nn].title));
                        //alert(tmpData[nn].name);
                        tmpData[nn].data = tmpData[nn].data||[];
                        if(special[nn] && !tmpData[nn].spAdd){
                            tmpData[nn].spAdd = true;
                            tmpData[nn] = $.extend(special[nn],tmpData[nn]);
                        }
                        var _v = parseFloat(vv);
                        if(isPie && amount){
                            _v = [];
                            _v.push(xAxisCategories[_i]);
                            _v.push(base.format.n3n4((parseFloat(vv)/amount)*100));
                        }
                        _i+=1;
                        tmpData[nn].data.push(_v);
                    }
                });
            });
            /*对象转为数组*/
            $.each(tmpData,function(n,v){
                if(n === "bounce_rate"){
                    v.yAxis = 1;
                }
                //TODO 自定义初始化指标
                if(_.include(this.currentIndicator||["pageviews"], n)){
                    series.push(v);
                }
                allSeries.push(v);
            }.bind(this));
            /*填充数据*/
            setting.series = series;
            setting.allSeries = allSeries;
            if(setting.xAxis){
                setting.xAxis.categories = xAxisCategories;
            }
            /*修改颜色显示
            var hsl = {"h":0,"s":50,"l":60};
            setting.colors = [];
            for(var i=0,len=setting.series.length;i<len;i++){
                setting.colors.push(base.format.hsl2rgb(hsl.h,hsl.s,hsl.l));
                hsl.l += 15;
            }*/
            /*修改步长如果两个值之间的间隔小于20px，则修改步长*/
            if(setting.xAxis){
                var chartLen = this.ui.$el.width()/setting.xAxis.categories.length;
                if(chartLen < 20){
                    setting.xAxis.labels.step = Math.ceil(20/chartLen);
                }
            }
            return setting;
        }
    }

    return function(config){
        return new (Backbone.Model.extend($.extend(true,{},modelConfig,(config||{}))));
    }
});