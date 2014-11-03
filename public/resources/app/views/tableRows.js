define(function(require,exports,module){

    var $ = window.$ || window.jQuery || require("jquery");
    var Backbone = require("backbone");
    var base = require("base");
    var collection = require("/resources/app/collections/tableRows");
    var rowView = require("tableRow");

    /*主模块构造函数*/
    function TableRows(config){

        var privateConfig = {
            "rowNum":1,
            "doms":{},
            "views":[],
            "trTpl":'<tr style="display:none;" class="subIsShow"><td class="subTd" style="text-align:left;" colspan="<%= colNum %>"><div><b class="flowsArrow"></b><div id="<%= cid %>_<%= rowNum %>" class="subDiv"></div></div></td></tr>',
            "markerTpl":"<div id=\"gridMarker\" class=\"theGridMarkLayout\" style=\"display:none;\"></div>",
            "tagName":"tbody",
            "className":"gridBody",
            initialize:function(){
                this.trTemplate = _.template(this.trTpl);
                this.collection.ui = this;
                this.collection = new collection(this.collection);
                this.ready = true;
            },
            refresh:function(config){
                this[config.event] && this[config.event](config.data);
            },
            render:function(){
                this.destroy();
                this.fn.setRows.call(this);
                this.fn.buildRows.call(this);
                this.ready = true;
            },
            "fn":{
                setRows:function(){
                    if(!this.indicator){
                        var data = this.data && this.data.datacontent && this.data.datacontent.filter && this.data.datacontent.filter.build || this.collection.allData.filter.build;
                        this.indicator = {};
                        this.indicator["default"] = data.def.build;
                        this.indicator["all"] = data.traffic.build.concat(data.quality.build).concat(data.reserve && data.reserve.build || []);
                        this.indicator["all"] = !this.indicator["all"].length?this.indicator["default"]:this.indicator["all"];
                    }
                },
                buildRows:function(){
                    if(this.collection.models.length){
                        this.collection.each(this.fn.buildRow.bind(this));
                        this.fn._setRows.call(this);
                        this.fn._setZebraLine.call(this);
                        this.fn._controlMod.call(this);
                    }else{
                        this.$el.append('<tr><td style="text-align:center" colspan="'+(this.indicator["default"].length+2)+'">'+LANG("没有数据。。。")+'</td></tr>');
                        this.fn._controlMod.call(this);
                        return;
                    }
                },
                buildRow:function(row){
                    /*合并必要参数*/
                    this.rowView.model = row;
                    this.rowView.params = this.params;
                    this.rowView.indicator = this.indicator;
                    this.rowView.dim = this.dim;
                    this.rowView.tableBtn = this.tableBtn;
                    this.rowView.tableCtrl = this.tableCtrl;
                    this.rowView.table = this.table;
                    this.rowView.rowNum = this.rowNum;
                    this.rowView.selected = this.selected;
                    /*渲染*/
                    var view = new rowView(this.rowView);
                    this.$el.append(view.render().el);
                    this.$el.append(this.trTemplate({
                        "colNum":view.colNum,
                        "cid":this.cid,
                        "rowNum":this.rowNum
                    }));
                    /*缓存*/
                    this.rowNum++;
                    this.colNum = view.colNum;
                    this.views.push(view);
                },
                _setRows:function(){
                    /*TODO 对每行进行处理(按需隐藏不同行按钮)*/
                },
                _setZebraLine:function(){
                    this.$el.addClass("zebraLine");
                },
                _controlMod:function(){
                    this.table.doFillData({
                        "pageSetting":{
                            "counts":this.collection.counts
                        },
                        "datacontent":this.collection.allData,
                        "indicator":this.indicator["default"],
                        "params":this.params
                    });
                    setTimeout(function(){
                        if(Clicki.Balance){
                            Clicki.Balance();
                        }
                    },100);
                }
            },
            doIndicator:function(data){
                seajs.log("tableRows doIndicator");
                this.selected = data.hasBeenSelected;
                $.each(this.views, function(key, value){
                    value.doIndicator(data);
                });
            },
            goToPage:function(data){
                this.rowNum = data.size*(data.params.page-1)+1;
                this.update(data);
            },
            doSort:function(data){
                this.rowNum = 1;
                this.update(data);
            },
            doFilter:function(data){
                this.rowNum = 1;
                this.update(data);
            },
            changeDate:function(data){
                this.rowNum = 1;
                data.params.page = 1;
                this.update(data);
            },
            doPageSize:function(data){
                this.collection.doPageSize(data);
            },
            doCheckBox:function(data){
                $.each(this.views, function(key, value){
                    value.doCheckBox(data);
                });
            },
            doSearch:function(data){
                this.rowNum = 1;
                data.params.page = 1;
                this.update(data);
            },
            update:function(data){
                this.delegateEvents();
                data && data.view && $.extend(this,data.view);
                data && data.collection && $.extend(true,this.collection,data.collection);
                if(data && data.params){
                    seajs.log("tableRows update");
                    $.extend(true,this.params,data.params)
                    this.collection.update(data);
                }
            },
            destroy:function(){
                this.$el.find("*").unbind();
                this.$el.empty();
            },
            showMarker:function(){
                this.gridMarker =  this.marker ? $('#gridMarker') : "";
                this.gridMarker && this.gridMarker.length === 0 && (this.gridMarker = $(this.markerTpl));
                this.$el.append(this.gridMarker);
                this.gridMarker && this.gridMarker.height(this.$el.height())[this.ui.animate.open](this.ui.delay);
            },
            hideMarker:function(){
                this.gridMarker && this.gridMarker[this.ui.animate.close](this.ui.delay);
            }
        };

        var viewsConfig = $.extend(true,{
            "marker":true,
            "ui":{
                "animate":{
                    "open":"show",
                    "close":"hide"
                },
                "delay":200
            }
        },config||{},privateConfig);

        var view = Backbone.View.extend(viewsConfig);

        return new view;
    }

    TableRows.prototype.constructor = TableRows;

    return function(config){
        return new TableRows(config);
    };

});