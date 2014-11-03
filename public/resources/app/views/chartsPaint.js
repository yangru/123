(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    var model = require("/resources/app/models/chartsPaint");
     /*chart 核心模块*/
    var hChart = require("chart_core");
    var _export = require("export");
    
    function ChartsPaint(config){
        var privateConfig = {
            "chart":null,
            "tagName": "div",
            "markerTpl":"<div id=\"marker\" class=\"theMarker\" style=\"display:none;height:966px;\"></div>",
            "doms":{},
            "events": {
            },
            "refreshConfig": {},

            /*初始化处理函数*/
            initialize: function() {
                 var _id = this.id || null;
                _id = typeof(_id) === "string" && $("#"+_id)
                            || _id && (_id.nodeType || _id.selector || _id.jquery) && _id;

                delete(this.id);
                if(_id){
                    this.$el = $(_id);
                    this.el = this.$el[0];
                }
                /*不要一开始就拉数据，根据设定的维度或者类型去拉取数据*/
                this.model.ui = this;
                this.model = new model(this.model);
                this.ready = true;
            },

            render:function(){
                this.fn.drawChart.call(this);
                this.callback && this.callback();
            },

            fn:{
                /*绘制chart*/
                drawChart:function(){
                    /*解决步长问题，解决百分比问题*/
                    this.destroy();
                    this.chart = null;
                    this.$el.append('<div id="'+this.chartId+'_chartContent" class="chartContent"></div>');
                    this.model.attributes.chart.renderTo = this.chartId+'_chartContent';
                    this.beforeDraw && $.each(this.beforeDraw,function(n,v){
                        hChart[n] && hChart[n](v);
                    }.bind(this));
                    this.chart = new hChart.Chart(this.model.attributes);
                    if(window.Clicki !==undefined && Clicki.Balance){
                        setTimeout(function(){
                            Clicki.Balance();
                        },500);
                    }
                    (this.afterRender && typeof this.afterRender ==="function")&&this.afterRender();
                }
            },

            /*重绘*/
            reDrawChart:function(){
                this.chart.redraw();
            },

            showMarker:function(){
                this.marker =  this.marker ? $('#marker') : "";
                this.marker && this.marker.length === 0 && (this.marker = $(this.markerTpl)) && ($("body").append(this.marker));
                this.marker && this.marker.height($(document).height()).show();
            },

            hideMarker:function(){
                this.marker && this.marker.hide();
            },

            update:function(data){
                //data && (data.config || data.params || data.datacontent) && this.model.update(data);
            },

            doIndicator:function(data){
                data && data.indicator && this.model.doIndicator(data);
            },

            doCompareChart:function(data){
                data && data.datacontent && this.model.doCompareChart(data);
            },

            doUnCompareChart:function(data){
                data && data.datacontent && this.model.doUnCompareChart(data);
            },

            doClearChart:function(data){
                data && this.model.doClearChart(data);
            },

            doCompareRange:function(data){
                data && this.model.doCompareRange(data);
            },

            doUnCompareRange:function(data){
                data && this.model.doUnCompareRange(data)
            },

            doCompareDate:function(data){
                data && this.model.doCompareRange(data);
            },

            doUnCompareDate:function(data){
                data && this.model.doUnCompareRange(data)
            },

            refresh:function(config){
                this[config.event] && this[config.event](config.data);
            },

            destroy:function(){
                this.$el.find("*").unbind();
                this.$el.unbind().empty();
            }
        };

        var viewsConfig = $.extend(true,{

        },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }
    
    ChartsPaint.prototype.constructor = ChartsPaint;

    return function(config){
        return new ChartsPaint(config);
    };

});