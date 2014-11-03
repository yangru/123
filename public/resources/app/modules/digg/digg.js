define(function(require,exports,module){

    var gridSetting = require("diggGridSet");
    var $ = window.$ || window.jQuery || require("jquery");
    var Backbone = require("backbone");
    var base = require("base");
    var digg_model = require("/resources/app/models/digg");
    var dropdownlist = require("dropdownlist");
    var pop_up = require("pop_up");
    var poptip = require("poptip");

    /*子模块view*/
    var digg_filter_view = function(config){
        return new (Backbone.View.extend($.extend(true,{
            "gridSetting":gridSetting,
            "tagName":"div",
            "tpl":{
                "ctrlTpl":'<div class="theDiggCtrl" id="theDiggCtrl_<%= index %>"></div>',
                "lineTpl":'<div class="theDiggLine" id="theDiggLine_<%= index %>"></div>',
                "dropdownlistTpl":'<div class="theDiggAn">'+LANG("按")+'</div><div class="theDiggSelector" id="theDiggSelector_<%= index %>"></div>',
                "gridViewTpl":'<div style="display:none;" class="theDiggIndex clearfix"><em><%= index+1 %></em><div class="theDiggIndexLine"></div></div><div class="G-tableSet processTable clearfix"><div class="theDiggGrid theTableBox" id="theDiggGrid_<%= index %>"></div></div>',
                "diggBtnTpl":'<input type="button" disabled="disabled" class="diggBtn" id="diggBtn_<%= index %>" value="'+LANG("钻取")+'" />',
                "saveTpl":'<input type="button" class="saveBtn" id="saveBtn_<%= index %>" value="'+LANG("保存")+'" />',
                "visitorTpl":'<input type="button" class="subvisitIconOpen" id="visitorBtn_<%= index %>" />',
                "cancelTpl":'<a class="cancelBtn" id="cancelBtn_<%= index %>">'+LANG("撤销")+'</a>',
                "savePopTpl":'<div class="addReportInner"><label>'+LANG("报告名称")+'</label><input type="text" class="" /></div>',
                "cancelPopTpl":'<div class="cancelLayer"><p><b></b>'+LANG("撤销后，下面所有的表格数据都将清空！")+'</p><p>'+LANG("是否继续撤销？")+'</p></div>',
                "reDiggPopTpl":'<div class="reDiggInner"><p><b></b>'+LANG("如果重新钻取，下面所有的表格数据都将清空！")+'</p><p>'+LANG("是否重新钻取？")+'</p></div>'
            },
            "doms":{},
            "events":{
                "click .diggBtn":"digg",
                "click .cancelBtn":"cancel",
                "click .saveBtn":"save",
                "change input[name='lat']":"setFilter"
            },
            "digging":false,
            initialize:function(){
                /*渲染界面*/
                $.each(this.tpl,function(key,value){
                    var str = key.replace(/Tpl/,"");
                    this[str+"Template"] = _.template(value);
                    this.doms[str] = $(this[str+"Template"]({"index":this.index}));
                    str = null;
                }.bind(this));
                this.doms.ctrl.append(this.doms.diggBtn);
                this.$el.append(this.doms.dropdownlist).append(this.doms.ctrl).append(this.doms.gridView).append(this.doms.line);
                this.index && this.doms.ctrl.append(this.doms.save);
                /*实例化弹出层*/
                this.savePop = new pop_up({
                    "id":$("#showArea"),
                    "type":{
                        "html":this.doms.savePop
                    },
                    "ui":{
                        "width":230,
                        "ctrlBarCls":"diggPopCtrl"
                    },
                    "autoClose":false,
                    "showClose":false,
                    "showCtrl":true,
                    "showMark":true,
                    onDone:function(){
                        var title = this.doms.inner.find(":text:first");
                        title && Clicki.layout.get("diggSet").save(title.val());
                        this.hide();
                    },
                    onRender:function(){
                        this.doms.inner.find(":text:first").val(Clicki.layout.get("diggSet").model.toJSON().title);
                    }
                });
                this.cancelPop = new pop_up({
                    "id":$("#showArea"),
                    "type":{
                        "html":this.doms.cancelPop
                    },
                    "ui":{
                        "width":290,
                        "ctrlBarCls":"diggPopCtrl"
                    },
                    "autoClose":false,
                    "showClose":false,
                    "showCtrl":true,
                    "showMark":true,
                    onDone:function(){
                        this.reset();
                        this.doms.cancel.remove();
                        this.index && this.doms.ctrl.append(this.doms.save);
                        this.cancelPop.hide();
                    }.bind(this)
                });
                this.reDiggPop = new pop_up({
                    "id":$("#showArea"),
                    "type":{
                        "html":this.doms.reDiggPop
                    },
                    "ui":{
                        "width":320,
                        "ctrlBarCls":"diggPopCtrl"
                    },
                    "autoClose":false,
                    "showClose":false,
                    "showCtrl":true,
                    "showMark":true,
                    onDone:function(){
                        this.reset();
                        if(this.index && (!this.model.toJSON().filter || !this.model.toJSON().filter.length)){
                            return false;
                        }
                        this.type && this.model.setType(this.index,this.type);
                        this.reDiggPop.hide();
                    }.bind(this)
                });
                /*实例化model*/
                this.model = this.model || {};
                this.model.ui = this;
                this.model = new digg_filter_model(this.model);
                this.render();
            },
            render:function(){
                /*如果是查看报告，把条件存进子模块*/
                !_.isEmpty(this.data) && this.model.setCondition(this.data.condition);
                /*格式化custom_model*/
                var data = {};
                /*保护custom_model*/
                data.items = $.parseJSON(JSON.stringify(this.mainDigg.model.custom_model));
                /*如果有条件，把下拉列表默认选项设为条件的类型*/
                var type = this.model.toJSON().type || false;
                var beforeTypes = this.mainDigg.getBeforeTypeAt(this.index);
                var items = data.items;
                var setDef = function(items){
                    for(var i =0,len = items.length;i<len;i++){
                        var item = items[i];
                        if(item.childs){
                            setDef.apply(this,[item.childs]);
                        }else{
                            item.def = false;
                            if(type && item.type && item.type === type.type){
                                item.def = true;
                            }
                        }
                    }
                };
                setDef(items);
                if(!type){
                    data.items.push({
                        "name":LANG("请选择"),
                        "hide":true,
                        "def":true
                    });
                }
                /*TODO LayOut实例化下拉列表*/
                this.dropdownlist = new dropdownlist({
                    "view":{
                        "tpl":{
                            "item":'<li class="{hasSub} {desc}" data-i={i} data-id="{value}">{name}</li>'
                        },
                        "ui":{
                            "selected":""
                        }
                    },
                    "model":{
                        "datacontent":data
                    },
                    "id":"theDiggSelector_"+this.index,
                    onSelect:function(beenSelect,dpl){
                        this.type = beenSelect;
                    }.bind(this),
                    callback:function(me){
                        this.doms.diggBtn.attr("disabled",false);
                        if(Clicki.Balance){
                            Clicki.Balance();
                        }
                    }.bind(this)
                });
            },
            digg:function(){
                if(!this.digging){
                    /*如果有表格，代表要重新钻取，把表格清掉*/
                    if(this.gridView){
                        this.reDiggPop.show();
                    }else{
                        /*如果没有过滤条件无法钻取*/
                        if(this.index && (!this.model.toJSON().filter || !this.model.toJSON().filter.length)){
                            new pop_up({
                                "type":{
                                    "html":'<div style="padding:1em 0 1em 1em;"><p>'+LANG("请先选择过滤条件。")+'</p><p>'+LANG("请先在上层表格中勾选数据。")+'</p></div>'
                                },
                                "ui":{
                                    "title":{
                                        "show":1,
                                        "text":LANG("提示")
                                    }
                                },
                                "showMark":1,
                                "once":1
                            }).show();
                            return false;
                        }

                        this.digging = true;
                        this.doms.diggBtn.attr("disabled","disabled");
                        
                        new pop_up({
                            "type":{
                                "html":'<span>'+LANG("正在获取数据。")+'</span>'
                            },
                            "showClose":0,
                            "animate":{
                                "config":{
                                    "position":this.doms.diggBtn,
                                    "fix":{top:0-this.doms.diggBtn.outerHeight()-10,left:this.doms.diggBtn.outerWidth()-20},
                                    "noSetSize":1
                                },
                                "delay":500
                            },
                            "tpl":{
                                "box":'<div class="{innerCls}"></div><div class="Ex_popTipShadow"> </div>'
                            },
                            "ui":{
                                "mainCls":"Ex_popTip",
                                "innerCls":"Ex_popTipInner",
                                "width":"auto"
                            },
                            "once":1
                        }).show();

                        if(!this.type){
                            this.dropdownlist.selectedShower.addClass("notDigg");
                            setTimeout(function(){
                                this.dropdownlist.selectedShower.removeClass("notDigg");
                            }.bind(this),200);
                        }
                        this.type && this.model.setType(this.index,this.type);
                    }
                }
                
            },
            changeType:function(){
                
                this.doms.save.remove();
                this.doms.ctrl.append(this.doms.cancel);
                this.doms.gridView.first().show();
                /*条件具备后渲染表格*/
                this.buildGrid();
                /*生成表格后实例化下一子模块*/
                setTimeout(function(){
                    this.mainDigg.addLayer(this.index+1,(this.data && this.data.childs || null));
                }.bind(this),500);
                this.digging = false;
                this.doms.diggBtn.removeAttr("disabled");
            },
            changeFilter:function(filters, types){
                /*修改维度链的内容*/
                var filters = filters || this.mainDigg.getBeforeFilterAt(this.index+1);
                var types = types || this.mainDigg.getBeforeTypeAt(this.index+1);
                var uls = '';
                var lis = '';
                $.each(filters, function(key,value){
                    (key === 0) && (uls += LANG('从'))
                    uls += '<em>'+(key+1)+'</em>'+'<a data-action="'+(key)+'" href="javascript:void(0)">'+types[key].name+'(';
                    $.each(value, function(n,nn){
                        var name = $.isEmptyObject(nn.name) ? nn.colData[0] : nn.name;
                        lis += name+',';
                        name = null;
                    });
                    lis = lis.substr(0,lis.length-1);
                    uls += lis;
                    lis = '';
                    uls += ')</a>>';
                }.bind(this));
                uls = uls.substr(0,uls.length-1);
                this.doms.line.html(uls);
                this.doms.line.find("a").bind("click",function(){
                    var toTopId = $(this).attr("data-action")+"_theDigg";
                    scrollTo(0,$("#"+toTopId).offset().top);
                });
            },
            setFilter:function(ev){
                var _n = $(ev.target);
                /*通过主模块设置过滤条件到下一子模块的model*/
                this.model.setNextFilter(this.index, this.gridView.Collection.getModelDataAt(_n.val()), _n.attr("checked"));
                this.changeFilter();
            },
            buildGrid:function(){
                var scope = this;
                var typeParam = this.model.getCondition().type.type;
                var gridCondition = "";
                /*转为gridview的condition*/
                var allFilters = this.mainDigg.getAllFilters();
                for(var i=0;i<this.index;i++){
                    $.each(allFilters[i], function(key, value){
                        $.each(value.keys, function(n, nn){
                            gridCondition += n + "|" + nn + ",";
                        });
                    });
                }
                gridCondition = gridCondition.substr(0,gridCondition.length-1);
                var nowParams = {
                    "site_id":site_id,
                    "begindate":Clicki.manager.getDate().beginDate,
                    "enddate":Clicki.manager.getDate().endDate,
                    "type":typeParam,
                    "order":"sessions|-1",
                    "condition":gridCondition
                };
                var set = {groups:{}};
                set.groups["theDiggGrid_"+this.index] = {
                    type:"grid",
                    setting:_.clone(this.gridSetting[typeParam])
                };
                var gridSet = set.groups["theDiggGrid_"+this.index].setting;
                if(gridSet.colModel[1].xModule){
                    $.each(gridSet.colModel[1].xModule, function(key, value){
                        gridSet.colModel[1].xModule[key].addParams.condition += (","+gridCondition);
                    });
                }
                if(gridSet.sub){
                    gridSet.sub.addParams && (gridSet.sub.addParams.condition += (","+gridCondition));
                    $.each(gridSet.sub, function(key, value){
                        if($.isPlainObject(gridSet.sub[key])){
                            gridSet.sub[key].addParams.condition += (","+gridCondition);
                        }else{
                            return false;
                        }
                    });
                }
                gridSet.target = this.doms.gridView.find(".theDiggGrid").attr("id");
                gridSet.callback=function(){
                    setTimeout(function(){
                        var oldChart = Clicki.manager.getApp("theList_digg_chart");
                        if(oldChart){return;}
                        if(this.length === 0){return;}
                        Clicki.manager.add({
                            groups:{
                                "theList_digg_chart":{
                                    type:"charts",
                                    setting:{
                                        target:"theList_digg_chart",
                                        url:"/feed/trend",
                                        model:this.models[0].attributes,
                                        params:{
                                            type: "os_type",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            viewtb:1
                                        },
                                        "export":true,
                                        setting:{
                                            "type":"area",
                                            "options":{
                                                title:{
                                                    text: LANG("趋势图")
                                                }
                                            },
                                            height:300
                                        },
                                        rootDom:"#theFloatChart",
                                        fields:"pageviews,sessions,visitors",
                                        special:{
                                            "pageviews":{
                                                type:"areaspline",
                                                fillOpacity: 0.1,
                                                lineWidth: 2,
                                                shadow:false,
                                                dataLabels: {
                                                    enabled: true,
                                                    formatter: function() {
                                                        if(this.y>0)return this.y;
                                                    }
                                                }
                                            },
                                            "sessions":{
                                                type:"spline",
                                                shadow:false
                                            },
                                            "visitors":{
                                                type:"spline",
                                                shadow:false
                                            }
                                        }
                                   }
                                }
                            }
                        });
                        Clicki.manager.add({
                            "groups":{
                                "date_controller":{
                                    "type":"date_controller",
                                    "setting":{
                                        "theChart":"theList_digg_chart",
                                        "renderTo":{
                                            "theList_digg_chart":{
                                                "type":"before",
                                                "el":"theList_digg_chart div[id*='highcharts-']"
                                            }
                                        },
                                        "cls":"fixPos",
                                        "types":["hourlyMode","dailyMode"]
                                    }
                                }
                            }
                        });
                    }.bind(this),200);
                    setTimeout(function(){
                        var oldChart = Clicki.manager.getApp("theList_page_url_chart");
                        if(oldChart){return;}
                        if(this.length === 0){return;}
                        Clicki.manager.add({
                            groups:{
                                "theList_page_url_chart":{
                                    type:"charts",
                                    setting:{
                                        target:"theList_page_url_chart",
                                        url:"/feed/trend",
                                        model:this.models[0].attributes,
                                        params:{
                                            type: "page_url",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            viewtb:1
                                        },
                                        rootDom:"#theFloatChart",
                                        setting:{
                                            "type":"area",
                                            "options":{
                                                title:{
                                                    text: LANG("最近趋势图")
                                                }
                                            },
                                            height:300
                                        },
                                        fields:"pageviews,sessions,visitors",
                                        special:{
                                            "pageviews":{
                                                type:"areaspline",
                                                fillOpacity: 0.1,
                                                lineWidth: 2,
                                                shadow:false,
                                                dataLabels: {
                                                    enabled: true,
                                                    formatter: function() {
                                                        if(this.y>0)return this.y;
                                                    }
                                                }
                                            },
                                            "sessions":{
                                                type:"spline",
                                                shadow:false
                                            },
                                            "visitors":{
                                                type:"spline",
                                                shadow:false
                                            }
                                        }
                                   }
                                }
                            }
                        });
                    }.bind(this),300);

                    var filter = scope.mainDigg.getNextFilter(scope.index);
                    var filters = filter && scope.mainDigg.getAllFilters().slice(0,scope.index+1);
                    var types = filter && scope.mainDigg.getAllTypes().slice(0,scope.index+1);
                    if(filter){
                        $.each(this.colDatas, function(key, value){
                            $.each(filter, function(n, nn){
                                var name = $.isEmptyObject(nn.name) ? nn.colData[0] : nn.name;
                                if(name === value[0]){
                                    this.mainEl.find("input[name='lat']").eq(key).attr("checked","checked");
                                }
                                name = null;
                            }.bind(this));
                        }.bind(this));
                        scope.changeFilter(filters, types);
                    }else{
                        scope.mainDigg.hideMarker();
                    }
                    filter = null;
                    filters = null;
                    //增加多维度访客列表显示功能
                    this.mainEl.find(".theGridTotalBox li[data-ttype='visitors']").append($("<b></b>").append(scope.doms.visitor));
                    scope.doms.visitor.unbind().bind("click", function(){
                        /*转为gridview的condition*/
                        var allFilters = scope.mainDigg.getAllFilters();
                        if(allFilters[scope.index] && allFilters[scope.index].length){
                            var visitorCondition = "";
                            for(var i=0;i<=scope.index;i++){
                                $.each(allFilters[i], function(key, value){
                                    $.each(value.keys, function(n, nn){
                                        visitorCondition += n + "|" + nn + ",";
                                    });
                                });
                            }
                            visitorCondition = visitorCondition.substr(0,visitorCondition.length-1);
                            new poptip.init({
                                url: "/statistic/visitordetail",
                                params: {
                                    "site_id":site_id,
                                    condition : visitorCondition,
                                    out: 'html'
                                },
                                width:850,
                                height:460,
                                title:LANG("访客列表"),
                                boxType:"center"
                            });
                        }
                    });
                    scope.gridView = scope.gridView || Clicki.manager.getApp("theDiggGrid_"+scope.index);
                    scope.doms.diggBtn.attr("disabled",false);
                };
                gridSet.router={
                    model: "feed",
                    defaultAction: "group",
                    type: null
                };
                gridSet.params = nowParams;
                Clicki.manager.destroy("theDiggGrid_"+this.index).add(set);
                set = null;
            },
            cancel:function(){
                this.cancelPop.show();
            },
            save:function(){
                this.doms.save.attr("disabled","disabled");
                this.savePop.show();
                this.doms.save.attr("disabled",false);
            },
            reset:function(){
                this.data = null;
                this.mainDigg.cancelLayer(this.index);
                this.doms.gridView.find(".theDiggGrid").empty();
                this.doms.gridView.first().hide();
                Clicki.manager.destroy("theDiggGrid_"+this.index);
                this.gridView = null;
                this.doms.line.empty();
            },
            update:function(data){
                this.gridView && this.gridView.refresh && this.gridView.refresh({
                    "event":"update"
                    ,"data":data
                });
            },
            refresh:function(config){
                var me = this;
                !this.model && (this.model = config.model);
                this[config.event] && this[config.event](config.data);
            },
            destroy:function(){
                this.reDiggPop.destroy();
                this.savePop.destroy();
                this.cancelPop.destroy();
                Clicki.manager.destroy("theDiggGrid_"+this.index);
                this.$el.unbind().remove();
            }
        },config||{})));
    };

    /*子模块model*/
    var digg_filter_model = function(config){
        return new (Backbone.Model.extend($.extend(true,{
            "ui":null,
            initialize:function(){
                this.bind("change",this.onChange);
            },
            setCondition:function(condition){
                this.nowStatus = "digg";
                this.ui.type = condition.type;
                this.set({"filter":condition.filter});
            },
            getCondition:function(){
                var condition = {};
                condition.type = this.toJSON().type;
                condition.filter = [];
                if(this.toJSON().filter){
                    $.each(this.toJSON().filter, function(key, value){
                        if(value.keys){
                            condition.filter.push(value.keys);
                        }else{
                            var temp = {};
                            temp[value.name] = value.value;
                            condition.filter.push(temp);
                            temp = null;
                        }
                    });
                }
                return condition;
            },
            setType:function(index,type){
                var diggType = {
                    "name":type.name,
                    "type":type.type
                }
                this.nowStatus = "changeType";
                this.ui.mainDigg.setType(index,diggType);
                this.set({"type": diggType}, {silent: true});
                this.onChange();
            },
            setNextFilter:function(index,filter,checked){
                this.ui.mainDigg.setNextFilter(index,filter,checked);
            },
            onChange:function(data){
                if(this.ui){
                    this.ui.refresh({
                        "data":data !== this && data || this.attributes,
                        "event":this.nowStatus,
                        "model":this
                    });
                }
            }
        },config||{})));
    };

    /*主模块构造函数*/
    function Digg(config){

    	var _id = config.id || null;
        _id = typeof(_id) === "string" && $("#"+_id)
                    || _id && (_id.nodeType || _id.selector || _id.jquery) && _id;

    	var privateConfig = {
    		"tagName":"div",
    		"doms":{
    			"tag":$(
    				typeof(_id) === "string" && ("#"+_id)
                    || _id && (_id.nodeType || _id.selector || _id.jquery) && _id
                ),
    		},
            "tpl":{
                "list":{
                    "addReportTpl":'<div class="addReport">'+LANG("添加报告")+'</div>'
                },
                "add":{
                    "dimensionsTpl":'<div class="dimensionsSelector"></div>'
                }
            },
            "markerTpl":"<div id=\"diggMarker\" class=\"theMarker\" style=\"display:none;height:966px;\"></div>",
    		"model":{
    		},
            "diggQueue":[
            ],
            "events":{
            },
            "marker":true,
	    	initialize:function(){
	    		if(_id){
                    this.$el = $(_id);
                    this.el = this.$el[0];
                }
	    		this.model.ui = this;
	    		this.model = new digg_model(this.model);
	    	},
	    	refresh:function(config){
                this[config.event] && this[config.event](config.data);
	    	},
	    	render:function(){

            },
            addReport:function(){
                this.model.clear({silent:true});
                $.each(this.tpl.add,function(key,value){
                    var str = key.replace(/Tpl/,"");
                    this[str+"Template"] = _.template(value);
                    this.doms[str] = $(this[str+"Template"]());
                    str = null;
                }.bind(this));
                this.$el.empty();
                this.addLayer(0);
            },
            watchReport:function(){
                this.showMarker();
                this.filters = this.getAllFilters();
                this.addLayer(0, this.model.toJSON());
                this.diggQueue.reverse();
            },
            delReport:function(){
                this.delPop = new pop_up({
                    "id":$("#showArea"),
                    "type":{
                        "html":'<div class="cancelLayer"><p><b></b>'+LANG("确定要删除该报告吗？")+'</p></div>'
                    },
                    "ui":{
                        "width":200,
                        "ctrlBarCls":"diggPopCtrl",
                    },
                    "once":true,
                    "autoClose":false,
                    "showClose":false,
                    "showCtrl":true,
                    "showMark":true,
                    onDone:function(){
                        Clicki.layout.get("diggSet").del();
                    },
                    onCancel:function(){
                    }
                });
                this.delPop.show();
            },
            isFilterAt:function(index){
                return !!(this.diggQueue[index].model.toJSON().filter);
            },
            getAllFilters:function(){
                var filters = [];
                var data = this.model.toJSON().childs;
                while(!_.isEmpty(data)){
                    data.condition.filter && filters.push(data.condition.filter);
                    data = data.childs;
                }
                return filters;
            },
            getAllTypes:function(){
                var types = [];
                var data = this.model.toJSON();
                while(!_.isEmpty(data)){
                    data.condition.type && types.push(data.condition.type);
                    data = data.childs;
                }
                return types;
            },
            setNextFilter:function(index, filter, checked){
                var data = this.model.attributes;
                for(var i=0;i<index+1;i++){
                    data = data.childs;
                }
                diggFilter = {};
                diggFilter.name = filter.colData[0];
                diggFilter.keys = filter.keys
                data.condition || (data.condition = {});
                var nextDigg = this.diggQueue[index+1].model;
                var temp;
                if(checked){
                    temp = nextDigg.get("filter") || [];
                    temp.push(diggFilter);
                }else{
                    temp = $.grep(nextDigg.get("filter"), function(n,nn){
                        var name = $.isEmptyObject(n.name) ? n.colData[0] : n.name;
                        return name != filter.colData[0];
                    });
                }
                nextDigg.set({"filter":temp}, {silent: true});
                nextDigg = null;
                data.condition.filter = temp;
                data = null;
                return temp;
            },
            getNextFilter:function(index){
                var data = this.model.toJSON();
                for(var i=0;i<index+1;i++){
                    data = data.childs;
                }
                data || (data = {});
                data.condition || (data.condition = {});
                if(data.condition.filter){
                    return data.condition.filter;
                }else{
                    return false;
                }
            },
            setType:function(index, type){
                var data = this.model.attributes;
                for(var i=0;i<index;i++){
                    data = data.childs;
                }
                data.condition || (data.condition = {});
                data.condition.type = type;
            },
            getBeforeFilterAt:function(index){
                var filters = [];
                $.each(this.diggQueue, function(key, value){
                    (key != 0) && (key <= index) && value.model.toJSON().filter && filters.push(value.model.toJSON().filter);
                });
                return filters;
            },
            getBeforeTypeAt:function(index){
                var types = [];
                $.each(this.diggQueue, function(key, value){
                    (key < index) && value.model.toJSON().type && types.push(value.model.toJSON().type);
                });
                return types;
            },
            addLayer:function(index,data){
                this.index = index || 0;
                if(!data){
                    var _data = this.model.attributes;
                    for(var i=0;i<index;i++){
                        _data.childs || (_data.childs = {});
                        _data = _data.childs;
                    }
                    _data.childs={};
                    _data.index = index;
                    _data.condition = {};
                }
                this.$el.append('<div  id="' + this.index + '_theDigg" class="theDigg"></div>');
                this.digg_filter_view = new digg_filter_view({
                    "el":$('#'+this.index + '_theDigg'),
                    "mainDigg": this,
                    "index": this.index,
                    "data": data
                });
                this.diggQueue.push(this.digg_filter_view);
                this.digg_filter_view = null;
            },
            cancelLayer:function(index){
                var data = this.model.attributes;
                for(var i=0;i<index;i++){
                    data = data.childs;
                }
                data.childs = {};
                for(var i = index+1; i<this.diggQueue.length; i++){
                    this.diggQueue[i].destroy();
                    this.diggQueue[i] = null;
                }
                this.diggQueue = _.compact(this.diggQueue);
            },
            showMarker:function(){
                this.diggMarker =  this.marker ? $('#diggMarker') : "";
                this.diggMarker && this.diggMarker.length === 0 && (this.diggMarker = $(this.markerTpl)) && ($("body").append(this.diggMarker));
                this.diggMarker && this.diggMarker.height($(document).height()).show();
            },
            hideMarker:function(){
                this.diggMarker && this.diggMarker.hide();
            },
            save:function(title){
                this.model.save(title,this.diggQueue);
            },
            del:function(){
                this.model.del();
            },
            changeDate:function(data){
                this.update(data);
            },
	    	update:function(data){
                if(!data){
                    return false;
                }
                for(var i = 0; i<this.diggQueue.length; i++){
                    this.diggQueue[i].refresh({
                        "event":"update"
                        ,"data":{
                            "begindate":data.begindate
                            ,"enddate":data.enddate
                        }
                    });
                }
            },
	    	destroy:function(){
                for(var i = 0; i<this.diggQueue.length; i++){
                    this.diggQueue[i].destroy();
                    this.diggQueue[i] = null;
                }
                this.$el.unbind().empty();
            }
    	};

    	var viewsConfig = $.extend(true,{

    	},config||{},privateConfig);

    	var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }

    Digg.prototype.constructor = Digg;

    return function(config){
        return new Digg(config)
    };
});
