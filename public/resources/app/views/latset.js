define(function(require,exports,module){

    var $ = window.$ || window.jQuery || require("jquery");
    var Backbone = require("backbone");
    var base = require("base");
    var model = require("/resources/app/models/latset");
    var dropdownlist = require("dropdownlist");
    var pop_up = require("pop_up");
    var getCode = require("getCode");

    /*主模块构造函数*/
    function Latset(config){

        var privateConfig = {
            "tpl":{
                common:{
                    stepOneTpl:'<div class="stepOne popTipIsLoading"></div>',
                    nameTpl: '<div class="latName"><label>'+LANG("报告名称：")+'</label><input type="text" name="title" /><label class="error"></label></div>'
                },
                add:{
                    stepTwoTpl:'<div class="stepTwo" style="display:none"></div>',
                    navTpl:'<div class="latNav"></div>',
                    navOneTpl: '<div class="latNavOneIcon NavOne"></div><div class="latNavOne NavOne">'+LANG("选择统计内容")+'</div>',
                    navLinkTpl: '<div class="latNavLinkF"></div>',
                    navTwoTpl: '<div class="latNavTwoIconF NavTwo"></div><div class="latNavTwo NavTwo">'+LANG("选择统计内容并获取代码")+'</div>',
                    chooseTpl: '<div class="chooseTpl"><div class="error"></div><ul class="latTemplate"><% _.each(latTemplate, function(value,key) { %><li class="<%= value.act?"act":"" %>"><div data-mtype="<%= key %>"><%= value.text %><b></b></div></li><% }); %></ul><% _.each(latTemplate, function(value,key) { %><ul class="subTpl <%= key %>" data-stype="<%= key %>" style="display:none;"><% _.each(value.child, function(value,key) { %><li class="<%= value.act?"act":"" %>"><div data-stype="<%= key %>"><%= value.text %></div></li><% }); %></ul><% }); %><div class="previewTpl"><h3>'+LANG("预览")+':</h3><div class="preview"></div></div></div>',
                    previewTpl:'<table class="previewTable"><tr><% _.each(label, function(value,key) { %><th><%= value %></th><% }); %><% _.each(value, function(value,key) { %><th><%= value %></th><% }); %><% for(var i=0;i<4;i++) { %><tr><% for(var j=0;j<(label.length+value.length);j++) { %><td>&nbsp;</td><% } %></tr><% } %></table>',
                    setTpl: '<div class="setLat"><div class="setLabel"><h3>'+LANG("统计的对象(最多4项)")+'</h3><ul class="labelList"><li><label>1</label><input type="text" value="" name="label0"/></li><li><label>2</label><input type="text" value="" name="label1"/></li><li><label>3</label><input type="text" value="" name="label2"/></li><li><label>4</label><input type="text" value="" name="label3"/></li></ul></div><div class="setValue"><h3>'+LANG("统计值(最多4项)")+'</h3><ul class="valueList"><li><label>1</label><input type="text" value="" name="value0"/></li><li><label>2</label><input type="text" value="" name="value1"/></li><li><label>3</label><input type="text" value="" name="value2"/></li><li><label>4</label><input type="text" value="" name="value3"/></li></ul></div></div>',
                    nextTpl: '<div class="nextLat"><div class="nextLine"></div><input type="button" class="nextLatSet" value=""></div>',
                    saveTpl: '<div class="saveLat"><div class="error"></div><div class="saveLine"></div><input type="button" class="saveLatSet saveSet" value="" /></div>'     
                },
                edit:{
                    editTpl: '<div class="setLat"><div class="setLabel"><h3>'+LANG("统计的对象")+'</h3><ul class="labelList"><% _.each(label, function(value,key) { %><li><label><%= key+1 %></label><input type="text" value="<%= value %>" name="label<%= key %>"/></li><% }); %></ul></div><div class="setValue"><h3>'+LANG("统计值")+'</h3><ul class="valueList"><% _.each(value, function(value,key) { %><li><label><%= key+1 %></label><input type="text" value="<%= value %>" name="value<%= key %>"/></li><% }); %></ul></div></div>',
                    codeTpl: '<div class="codeTpl"></div>',
                    saveTpl: '<div class="saveLat"><div class="error"></div><div class="saveLine"></div><input type="button" class="saveLatSet saveSet" value="" /><input type="button" class="showCode btn" value="'+LANG("获取代码")+'" style="margin-left:10px;" /></div>'
                }
            },
            "latTemplate":{
                "common":{
                    text:LANG("常用模板"),
                    child:{
                        "signup":{
                            text:LANG("注册"),
                            label:[LANG("注册")],
                            value:[LANG("数量")]
                        },
                        "signin":{
                            text:LANG("登录"),
                            label:[LANG("登录")],
                            value:[LANG("数量")]
                        },
                        "book":{
                            text:LANG("订阅"),
                            label:[LANG("订阅")],
                            value:[LANG("数量")]
                        },
                        "click":{
                            text:LANG("按钮点击"),
                            label:[LANG("按钮名称")],
                            value:[LANG("数量")]
                        }
                    }
                },
                "business":{
                    text:LANG("电商模板"),
                    child:{
                        "buy":{
                            text:LANG("购买"),
                            label:[LANG("商品类型"),LANG("商品名称"),LANG("单价")],
                            value:[LANG("数量"),LANG("总价")]
                        }
                    }
                },
                "other":{
                    text:LANG("其他"),
                    child:{
                        "other":{
                            text:LANG("其他"),
                            label:["","","",""],
                            value:["","","",""]
                        }
                    }
                }
            },
            /*接口相关设定*/
            "ui":{
                "hover":"hover",
                "loading":"Ex_loading",
                "loadingTxt":LANG("正在加载..."),
                "def":"Ex_filterInner"
            },
            "doms":{},
            "latData":{},
            "tagName": "div",
            "events": {
                "click .NavOne":"preLatSet",
                "click .NavTwo":"nextLatSet",
                "blur .latName input":"setTitle",
                "click .latTemplate div":"showSubTpl",
                "click .subTpl div":"showPreview",
                "click .nextLatSet":"nextLatSet",
                "blur .setValue input":"setLatValue",
                "blur .setLabel input":"setLatLabel",
                "click .saveLatSet":"saveLatData",
                "click .saveLat .cancleLatSet":"preLatSet",
                "click .showCode":"showCodeArea"
            },
            "codePop":pop_up,
            "markerTpl":"<div id=\"latsetMarker\" class=\"theMarker\" style=\"display:none;height:966px;\"></div>",
            "marker":true,
            
            /*初始化处理函数*/
            initialize: function() {
                this.model.ui = this;
                this.model = new model(this.model);
            },

            refresh:function(config){
                this[config.event] && this[config.event](config.data);
            },

            add:function(){
                this.model.clear({silent:true});

                /*获取相应的模板*/
                $.each(this.tpl.common,function(key,value){
                    var str = key.replace(/Tpl/,"");
                    this[str+"Template"] = _.template(value);
                    this.doms[str] = $(this[str+"Template"]());
                    str = null;
                }.bind(this));
                $.each(this.tpl.add,function(key,value){
                    var str = key.replace(/Tpl/,"");
                    if(str === "choose"){
                        this[str+"Template"] = _.template(value);
                        this.doms[str] = $(this[str+"Template"]({"latTemplate":this.latTemplate}));
                    }else{
                        this[str+"Template"] = _.template(value);
                        if(_.indexOf(["preview", "js"], str) == -1){
                            this.doms[str] = $(this[str+"Template"]());
                        }
                    }
                    str = null;
                }.bind(this));

                /*渲染*/
                this.doms.nav.append(this.doms.navOne).append(this.doms.navLink).append(this.doms.navTwo);
                this.doms.stepOne.removeClass("popTipIsLoading").append(this.doms.name).append(this.doms.choose).append(this.doms.next);
                this.doms.stepTwo.append(this.doms.set).append(this.doms.save);
                this.$el.append(this.doms.nav).append(this.doms.stepOne).append(this.doms.stepTwo);

                /*默认选择第一个模板*/
                this.doms.choose.find("li>div[data-mtype]:first").addClass("act");
                this.mtype = this.doms.choose.find("li>div[data-mtype]:first").attr("data-mtype");
                this.doms.choose.find("ul[data-stype]:first").show();

                this.doms.choose.find("li>div[data-stype]:first").addClass("act");
                this.stype = this.doms.choose.find("li>div[data-stype]:first").attr("data-stype");
                this.latData = this.latTemplate[this.mtype].child[this.stype];

                if((this.latData.label) && (this.latData.value)){
                    this.buildPreview();
                }

                this.setTplValue();
            },

            edit:function(){
                /*从model获取数据*/
                this.latData = this.model.getLatData();

                $.each(this.tpl.common,function(key,value){
                    var str = key.replace(/Tpl/,"");
                    this[str+"Template"] = _.template(value);
                    this.doms[str] = $(this[str+"Template"]());
                    str = null;
                }.bind(this));

                $.each(this.tpl.edit,function(key,value){
                    var str = key.replace(/Tpl/,"");
                    if(str === "edit"){
                        this[str+"Template"] = _.template(value);
                        this.doms[str] = $(this[str+"Template"](this.latData));
                    }else{
                        this[str+"Template"] = _.template(value);
                        if(_.indexOf(["js"], str) == -1){
                            this.doms[str] = $(this[str+"Template"]());
                        }
                        
                    }
                }.bind(this));

                /*渲染模板*/
                this.doms.stepOne
                .removeClass("popTipIsLoading")
                .append(this.doms.name)
                .append(this.doms.edit)
                .append(this.doms.save);

                this.$el.append(this.doms.stepOne);

                /*获取标题*/
                this.title || (this.title = this.model.getLatTitle(this.id));
                /*获取label和value的行数*/
                this.labelNum = this.latData.label.length;
                this.valueNum = this.latData.value.length;
                this.doms.name.find("input").val(this.title); 
            },
            del:function(){
                this.delPop = new pop_up({
                    "id":$("#showArea"),
                    "type":{
                        "html":'<div class="cancelLayer"><p><b></b>'+LANG("确定要删除该报告吗？")+'</p></div>'
                    },
                    "ui":{
                        "width":200,
                        "ctrlBarCls":"latsetPopCtrl",
                    },
                    "once":true,
                    "autoClose":false,
                    "showClose":false,
                    "showCtrl":true,
                    "showMark":true,
                    onDone:function(){
                        Clicki.layout.get("latsetSet").delLatSet();
                    },
                    onCancel:function(){
                    }
                });
                this.delPop.show();
            },

            getCode:function(){
                this.latData = this.model.getLatData();
                /*从model获取数据*/
                this.latData = this.model.getLatData();

                $.each(this.tpl.common,function(key,value){
                    var str = key.replace(/Tpl/,"");
                    this[str+"Template"] = _.template(value);
                    this.doms[str] = $(this[str+"Template"]());
                    str = null;
                }.bind(this));

                $.each(this.tpl.edit,function(key,value){
                    var str = key.replace(/Tpl/,"");
                    if(str === "edit"){
                        this[str+"Template"] = _.template(value);
                        this.doms[str] = $(this[str+"Template"](this.latData));
                    }else{
                        this[str+"Template"] = _.template(value);
                        if(_.indexOf(["js"], str) == -1){
                            this.doms[str] = $(this[str+"Template"]());
                        }
                        
                    }
                }.bind(this));

                this.showCodeArea(this.latData);
            },

            setTitle:function(){
                this.title = this.doms.name.find("input").val();
                this.doms.name.find(".error").html("");
            },

            /*显示2级模板*/
            showSubTpl: function(ev){
                this.stype = null;
                this.doms.choose.find("ul[data-stype]").hide();
                this.doms.choose.find(".latTemplate li div").removeClass("act");
                this.doms.choose.find("ul[data-stype] li div").removeClass("act");
                this.doms.choose.find(".preview").empty();
                var _n = $(ev.target);
                this.mtype = _n.attr("data-mtype");
                _n.addClass("act");
                this.doms.choose.find("ul[data-stype='"+ this.mtype +"']").show();
                this.doms.choose.find("ul[data-stype='"+ this.mtype +"'] li>div[data-stype]:first").addClass("act");
                this.stype = this.doms.choose.find("ul[data-stype='"+ this.mtype +"'] li>div[data-stype]:first").attr("data-stype");
                this.latData = this.latTemplate[this.mtype].child[this.stype];

                if((this.latData.label) && (this.latData.value)){
                    this.buildPreview();
                }

                this.setTplValue();
            },

            /*显示预览*/
            showPreview: function(ev){
                this.doms.choose.find(".error").html("");
                this.doms.choose.find("ul[data-stype] li div").removeClass("act");
                var _n = $(ev.target);
                this.stype = _n.attr("data-stype");
                _n.addClass("act");
                this.latData = this.latTemplate[this.mtype].child[this.stype];
                if((this.latData.label) && (this.latData.value)){
                    this.buildPreview();
                }
                this.setTplValue();
            },

            /*构造预览的表格*/
            buildPreview: function(){
                this.doms.priview = this.previewTemplate(this.latData);
                this.doms.choose.find(".preview").empty().html(this.doms.priview);
            },

            /*把模板数据存到设置的输入框*/
            setTplValue: function(){
                this.doms.set.find(".labelList li").find("input").val("");
                this.doms.set.find(".valueList li").find("input").val("");
                if(this.latData.label.length){
                    for(var i=0,length=this.latData.label.length; i<length; i++){
                        this.doms.set.find(".labelList li").eq(i).find("input").val(this.latData.label[i]);
                    }
                }
                if(this.latData.value.length){
                    for(var i=0,length=this.latData.value.length; i<length; i++){
                        this.doms.set.find(".valueList li").eq(i).find("input").val(this.latData.value[i]);
                    }
                }
            },

            /*下一步*/
            nextLatSet: function(){
                if(!this.stype){
                    this.doms.choose.find(".error").html(LANG("请选择模板"));
                }else if(!this.title){
                    this.doms.name.find(".error").html(LANG("报告名称不能为空"));
                }else if(this.title.length>8){
                    this.doms.name.find(".error").html(LANG("报告名称不能超过8个字"));
                }else{
                    this.doms.stepOne.hide();
                    this.doms.navLink.removeClass("latNavLinkF").addClass("latNavLinkT");
                    this.doms.navTwo.eq(0).removeClass("latNavTwoIconF").addClass("latNavTwoIconT");
                    this.doms.stepTwo.show();
                }
            },

            /*上一步*/
            preLatSet: function(){
                this.doms.stepTwo.hide();
                this.doms.stepOne.show();
            },

            /*设置统计名称*/
            setLatLabel: function(ev){
                var _n = $(ev.target);
                var name = $(ev.target).attr("name");
                this.latData["label"][name.substring(5,name.length)] = _n.val();
                this.doms.save.find(".error").html("");
            },

            /*设置统计值*/
            setLatValue: function(ev){
                var _n = $(ev.target);
                var name = $(ev.target).attr("name");
                this.latData["value"][name.substring(5,name.length)] = _n.val();
                this.doms.save.find(".error").html("");
            },

            /*保存数据*/
            saveLatData: function(){
                /*异常处理*/
                if((this.latData.label.length == 0) || (this.latData.value.length == 0)){
                    this.doms.save.find(".error").html(LANG("值不能为空"));
                    return;
                }
                if(this.labelNum && (this.labelNum != _.without(this.latData.label, "").length)){
                    this.doms.save.find(".error").html(LANG("值不能为空"));
                    return;
                }
                if(this.valueNum && (this.valueNum != _.without(this.latData.value, "").length)){
                    this.doms.save.find(".error").html(LANG("值不能为空"));
                    return;
                }
                if(!this.title){
                    this.doms.name.find(".error").html(LANG("报告名称不能为空"));
                    return;
                }
                if(this.title.length>8){
                    this.doms.name.find(".error").html(LANG("报告名称不能超过8个字"));
                    return;
                }
                this.latData.label = _.without(this.latData.label, "");
                this.latData.value = _.without(this.latData.value, "");
                this.doms.save.find(".saveLatSet").attr("disabled","disabled");
                this.model.ui = this;
                ((typeof this.id) === "number") && (this.latData.id = this.id);
                this.latData.title = this.title;
                this.stype && (this.latData.template = this.mtype + "_" + this.stype);
                this.model.saveLatData(this.latData);
            },

            /*删除数据*/
            delLatSet:function(){
                this.model.delLatSet();
            },

            showCodeArea:function(latData){
                latData = !("keyCode" in latData) && latData || this.latData;
                var getCodePop = new getCode({
                    format:false,
                    type:"customs",
                    model:{
                        "datacontent":[
                            {
                                type_id:this.model.id,
                                label:latData.label,
                                value:latData.value
                            }
                        ]
                    }
                });
            },
            showMarker:function(){
                this.latsetMarker =  this.marker ? $('#latsetMarker') : "";
                this.latsetMarker && this.latsetMarker.length === 0 && (this.latsetMarker = $(this.markerTpl)) && ($("body").append(this.latsetMarker));
                this.latsetMarker && this.latsetMarker.height($(document).height()).show();
            },
            hideMarker:function(){
                this.latsetMarker && this.latsetMarker.hide();
            },
            destroy: function(){
                this.$el.unbind().empty();
            }
        };

    	var viewsConfig = $.extend(true,{
    	},config||{},privateConfig);

    	var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }

    Latset.prototype.constructor = Latset;

    return function(config){
        return new Latset(config)
    };

});