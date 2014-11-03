(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var $ = window.$ || window.jQuery || require("jquery");
    var Backbone = require("backbone");
    var base = require("base");
    var model = require("/resources/app/models/tableTop");

    /*主模块构造函数*/
    function TableTop(config){
        var privateConfig = {
            "ths":[],
            "tpl":{
                "thTpl":'<th nocompare="<%= nocompare %>" style="<% if(hidden){ %>display:none;<% } %>"><div style="<% if(colNum === 1){ %>text-align:left;<% } %>"><span></span><span><%= LANG(value) %></span><span></span></div></th>'
            },
            "doms":{},
            /*当前列数，从1开始*/
            "colNum":1,
            "tagName":"thead",
            "className":"gridHead",
            "dimArray":[],
            initialize:function(){
                this.thTemplate = _.template(this.tpl.thTpl);
                this.model.ui = this;
                this.model = new model(this.model);
                this.ready = true;
            },
            refresh:function(config){
                this[config.event] && this[config.event](config.data);
            },
            render:function(){
                this.destroy();
                this.fn.buildTh.call(this);
                this.fn.bindTh.call(this);
                this.tableCtrl && this.fn.setTableCtrl.call(this);
                return this;
            },
            "fn":{
                buildTh:function(){
                    this.dimArray = _.keys(this.dim);
                    var data = this.model.toJSON();
                    this.doms.ths = {};
                    this.$el.append("<tr><th><div style=\"text-align:center\"><span>"+LANG("序号")+"</span></div></th></tr>");
                    /*循环维度加上所有指标*/
                    $.each(this.dimArray.concat(this.indicator.all), function(v, vv){
                        var th = {};
                        th.type = vv;
                        /*如果不是默认指标，设为隐藏*/
                        if(!_.include(this.dimArray.concat(this.indicator["default"]), vv)){
                            th.hidden = true;
                        }
                        /*渲染表头*/
                        this.doms.ths["th"+this.colNum] = $(this.thTemplate({
                            "nocompare":th.compare || 0,
                            "hidden":th.hidden,
                            "value":data[th.type] && data[th.type].title || "Loading",
                            "colNum":this.colNum
                        }));
                        this.$el.find("tr").append(this.doms.ths["th"+this.colNum]);
                        this.ths.push(th);
                        this.colNum++;
                    }.bind(this));
                    this.ready = true;
                },

                bindTh:function(){
                    $.each(this.$el.find("th:gt(0)"),function(i,n){
                        var _th = $(n);
                        var thModel = this.ths[i];
                        /*显示默认排序状态*/
                        if(this.params && thModel.type == this.params.order.substring(0,this.params.order.indexOf("|"))){
                            _th.addClass("showGridState");
                            _th.addClass("showGridFnIconed");
                        }
                        /*默认启用排序，如果列头和返回的数据的y轴匹配，进行排序*/
                        var thData = this.model.y_axis;
                        var _thSort = thData && _.keys(thData);
                        /*排序*/
                        if(/undefined/.test(thModel.sort) || thModel.sort){
                            if(_.include(_thSort,thModel.type) || thModel.sort){
                                //默认降序
                                var type = (!thModel.sort || thModel.sort.type === "asc")?false:true;
                                thModel.sort = {"type":type};
                                var btn = $("<em class=\"gridSortType"+(type?"Asc":"Des")+"\">"+(type?"↓":"↑")+"</em>");
                                _th.css({"cursor":"pointer"}).find("span").eq(1).css("position","relative").append(btn);
                                _th.bind("click",function(ev){
                                    this.$el.find("th:gt(0)").removeClass("showGridFnIconed");
                                    _th.addClass("showGridFnIconed");
                                    var _type = thModel.sort.type?-1:1,inner = thModel.sort.type?"↑":"↓";
                                    btn.removeClass().addClass("gridSortType"+(thModel.sort.type?"Asc":"Des")).html(inner);
                                    thModel.sort.type = !thModel.sort.type;
                                    this.$el.find("th").removeClass("showGridState");
                                    _th.addClass("showGridState");
                                    /*控制表格更新*/
                                    var sort = thModel.type+"|"+_type;
                                    this.params.page = 1;
                                    this.params.order = sort;
                                    this.table.doSort({params:this.params});
                                }.bind(this));
                                _th.hover(
                                    function(){
                                        _th.addClass("showGridFnIcon");
                                    },
                                    function(){
                                        _th.removeClass("showGridFnIcon");
                                    }
                                );
                            }
                        }
                    }.bind(this))
                },

                setTableCtrl:function(){
                    this.$el.find("tr").append("<th><div style=\"text-align:center\"><span>"+LANG("操作")+"</span></div></th>");
                }
            },

            doIndicator:function(data){
                seajs.log("tableTop doIndicator");
                var selected = this.dimArray.concat(data.hasBeenSelected);

                $.each(this.ths,function(i,n){
                    if($.inArray(n.type, selected) === -1){
                        n.hidden = true;
                    }else{
                        n.hidden = false;
                    }
                });

                for(var i=0,len=_.size(this.doms.ths);i<len;i++){
                    this.doms.ths["th"+(i+1)].css("display",this.ths[i].hidden?"none":"table-cell");
                }
            },
            doFillData:function(data){
                if(!this.indicator){
                    var filterData = this.data && this.data.datacontent && this.data.datacontent.filter && this.data.datacontent.filter.build || data.datacontent.filter.build;
                    this.indicator = {};
                    this.indicator["default"] = filterData.def.build;
                    this.indicator["all"] = filterData.traffic.build.concat(filterData.quality.build).concat(filterData.reserve && filterData.reserve.build || []);
                    this.indicator["all"] = !this.indicator["all"].length?this.indicator["default"]:this.indicator["all"];
                }           
                if((!data.datacontent.filter || !data.datacontent.caption) && (this.data.datacontent.filter || this.data.datacontent.caption)){
                    data.datacontent.filter = !data.datacontent.filter && this.data.datacontent.filter || data.datacontent.filter;
                    data.datacontent.caption = !data.datacontent.caption && this.data.datacontent.caption || data.datacontent.caption;
                }
                this.update(data);
            },
            update:function(data){
                this.delegateEvents();
                data && data.view && $.extend(this,data.view);
                data && data.model && $.extend(this.model,data.model);
                if(data && (data.params || data.datacontent)){
                    $.extend(true,this.params,data.params);
                    this.model.update(data);
                    seajs.log("tableTop update");
                }
            },
            destroy:function(){
                this.colNum = 1;
                this.$el.find("*").unbind();
                this.$el.empty();
            }
        };

        var viewsConfig = $.extend(true,{},config||{},privateConfig);

        var view = Backbone.View.extend(viewsConfig);

        return new view;
    }

    TableTop.prototype.constructor = TableTop;

    return function(config){
        return new TableTop(config);
    };

});