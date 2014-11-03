(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    var base = require("base");
    var model = require("/resources/app/models/indicator");
    var pop_up = require("pop_up");
    /*
            el:$(".theGridTotalBox"),
            datasources,
            nowStatus
    */
    function Indicator(config){
        var privateConfig = {
            //////////////////////////翻译------表头上头和自定义////////////////////////////////
            mainFilterTpl:'<ul><% _.each(build, function(value,key) { %> <li class="<%= value.act?"act":"" %>" data-index="<%= key %>"><% if(key == "custom"){ %><span><%= LANG(value.text) %></span><img src="/resources/images/blank.gif" class="customSetIcon" data-index="popFilter" data-sub="close"><% }else{ %><span><%= LANG(value.text) %></span><% } %></li> <% }); %></ul>',
            popFilterTpl:'<div id="<%= type %>_filter" class="theGridPopFilter"><ul><% _.each(build, function(value,key) { if(key != "def" && key !=="custom"){ %> <li><strong><%= LANG(value.text) %></strong><% _.each(value.build, function(value) { %> <span><input type="checkbox" name="<%= value %>" id="<%= type %>_<%= value %>" value="<%= value %>" <%= options[value].selected?"checked=\'checked\'":"" %>"><label for="<%= type %>_<%= value %>"><%= LANG(options[value].text) %></label></span> <% }); %></li> <% }}); %></ul><div class="Ex_theAFListCtrler"><div><input type="checkbox" data-type="allSelect" id="allSelect"><label for="allSelect">'+LANG("全选")+'</label> <input type="checkbox" data-type="inverSelect" id="inverSelect"><label for="inverSelect">'+LANG("反选")+'</label></div><input type="button" class="doGridFilter" value=""><input type="button" class="cancleGridFilter" value="" /></div></div>',
            /*接口相关设定*/
            ready:false,
            events: {
                "click li":"bindLi",
                "click .customSetIcon":"_showPopFiter"
            },
            /*初始化处理函数*/
            initialize: function() {
                var _id = this.id || null;
                _id = typeof(_id) === "string" && $("#"+_id)
                            || _id && (_id.nodeType || _id.selector) && _id;

                delete(this.id);
                if(_id){
                    this.$el = $(_id);
                    this.el = this.$el[0];
                }
                /*从服务端拉数据，绑定change到render(refresh)*/
                this.customSetIcon = null;
                this.model.ui = this;
                this.model.params = this.model.params || this.params;
                this.model = new model(this.model);
                this.ready = true;
            },
            
            render:function(){
                /*建立dom*/
                this.mainFilterTemplate = _.template(this.mainFilterTpl);
                this.popFilterTemplate = _.template(this.popFilterTpl);
                $(this.el).html(this.mainFilterTemplate(this.model.toJSON())+this.popFilterTemplate(this.model.toJSON()));
                /*缓存dom*/
                this._setFilter();
                this.onLoad && this.onLoad();
                this.buildReady = true;
                return this;
            },

            _setFilter:function(){
                /*缓存dom*/
                this.box = $(this.el);
                this.tags = this.box.find("ul:first>li");
                this.prevF = this.tags.filter(function(){return $(this).hasClass("act")});

                this.popFilter = this.$el.find(".theGridPopFilter:first");
                this.popBtns = this.popFilter.find(".cancleGridFilter:first,.doGridFilter:first");
                this.popChks = this.popFilter.find("li :checkbox");
                this.allSelectBnt = this.popFilter.find("input[data-type='allSelect']:first");
                this.inverSelectBnt = this.popFilter.find("input[data-type='inverSelect']:first");
                if(this.grid){
                    this.grid.$el.append(this.popFilter);
                }else{
                    this.box.parent().append(this.popFilter);
                }
                this.popBtns.eq(1).bind("click",this._hidePopFiter.bind(this));
                this.popBtns.eq(0).bind("click",this._doPopFiter.bind(this));
                this.allSelectBnt.bind("change",this.allSelect.bind(this));
                this.inverSelectBnt.bind("change",this.inverSelect.bind(this));

                this.model.getCustomBuild();
                var type = this.prevF.data("index");
                var _set = this.model.getFilterBuild(type);
                if(this.model.attributes.always.length){
                        _set = _set.reverse();
                        _set = _set.concat(this.model.attributes.always).reverse();
                }
                this.hasBeenSelected= _set;
                this.grid && this.grid.gridLayout.manager.run("indicator",{
                    event:"doIndicator",
                    data:{
                        "hasBeenSelected":_set
                    }
                });                
            },

            _hidePopFiter:function(ev){
                this.autoCloseHandler && $(document).unbind("click",this.autoCloseHandler);
                /*隐藏弹出层*/
                var tag = $(ev.target);
                this.popFilter.animate({
                    opacity:"hide"
                });
                this.tags.removeClass("act");
                this.prevF.addClass("act");
                if(this.prevF.attr("data-index") !== "custom"){
                    this.customSetIcon.removeClass("actIcon");
                }
            },

            _showPopFiter:function(setLen){
                /*点击下拉后弹出自定义选择*/
                var bpos = this.box.position();
                if(!setLen){
                    var def_set = this.model.getFilterBuild("def");
                    for(var i = 0;i<def_set.length;i++){
                        var now = def_set[i];
                        for(var k = 0;k<this.popChks.length;k++){
                            var tag = this.popChks.eq(k);
                            if(tag.val() === now){
                                tag.attr("checked","checked"); 
                            }
                        }
                    }
                    def_set = tag = now = null;
                }
                this.popFilter.css({
                    "left":bpos.left + this.box.outerWidth() - this.popFilter.outerWidth() + 5,
                    "top":bpos.top+this.box.outerHeight()+1
                }).animate({
                    opacity:"show"
                },"fast",function(){
                    this.autoCloseHandler = base.ux.hideOnDocumentClick(this.popFilter,function(){
                        this.popFilter.animate({
                            opacity:"hide"
                        });
                        this.tags.removeClass("act");
                        this.prevF.addClass("act");
                        if(this.prevF.attr("data-index") !== "custom"){
                            this.customSetIcon.removeClass("actIcon");
                        }
                    },this);
                }.bind(this));
                return false;
            },

            _doPopFiter:function(){
                this.autoCloseHandler && $(document).unbind("click",this.autoCloseHandler);
                /*点击确定后，隐藏弹出，得到勾选的值的数组，返回数据到服务端*/
                var beChecked = this.popFilter.find("input:checked");
                this.popFilter.animate({
                    opacity:"hide"
                });
                if(beChecked.length === 0){
                    this.prevF.addClass("act");
                    return;
                }
                var hasBeenSelected = [];
                this.popFilter.find("input:checked").each(function(ii,nn){
                    hasBeenSelected.push($(nn).val());
                });
                this.tags.removeClass("act");
                this.prevF = this.tags.last();
                this.prevF.addClass("act");
                $(".customSetIcon").addClass("actIcon");
                if(this.model.attributes.always.length){
                    hasBeenSelected = hasBeenSelected.reverse();
                    hasBeenSelected = hasBeenSelected.concat(this.model.attributes.always).reverse();
                }
                this.hasBeenSelected = hasBeenSelected;
                this.afterSelect && this.afterSelect(this.hasBeenSelected);
                this.model.setSelected(hasBeenSelected);
                /*managment*/
                this.grid && this.grid.gridLayout.manager.run("indicator",{
                    event:"doIndicator",
                    data:{
                        "hasBeenSelected":hasBeenSelected
                    }
                });
            },

            allSelect:function(ev){
                /*全选*/
                var tag = $(ev.target);
                var status = tag[0].checked;
                if(status){
                    this.popChks.attr("checked",true);
                }else{
                    this.popChks.attr("checked",false);
                }
            },

            inverSelect:function(){
                /*反选*/
                $.each(this.popChks,function(i,n){
                    n = $(this);
                    n.attr("checked",!(n.attr("checked")));
                    n = null;
                });
                var hasBeenSelectedNum = this.popFilter.find("li :checked").length;
                if(!hasBeenSelectedNum){
                    this.allSelectBnt.attr("checked",false);
                }else if(hasBeenSelectedNum === this.popChks.length){
                    this.allSelectBnt.attr("checked",true);
                }
            },

            bindLi:function(ev){
                /*点击指标后切换标签*/
                var _n = $(ev.target);
                var rType = _n.attr("data-index");
                _n = _n.closest("li[data-index]");
                var type = _n.attr("data-index");
                if((_n[0].className === "act" || !type) && rType !== "popFilter"){
                    if(type !== this.prevF.attr("data-index")){
                        this.tags.removeClass("act");
                        this.prevF.addClass("act");
                        if(type === "custom"){
                            this.customSetIcon.removeClass("actIcon");
                        }
                    }
                    return;
                }
                !this.customSetIcon && (this.customSetIcon = $(".customSetIcon"))
                var _set = this.model.getFilterBuild(type);
                this.tags.removeClass("act");
                _n.addClass("act");
                if(_set.length === 0 && type === "custom" || rType === "popFilter"){
                    this.customSetIcon.addClass("actIcon");
                    this._showPopFiter(_set.length);
                }else{
                    this.customSetIcon[
                        type === "custom" && "addClass"
                        || "removeClass"
                    ]("actIcon");
                    this.popFilter.hide();
                    this.prevF = _n;
                    if(this.model.attributes.always.length){
                        _set = _set.reverse();
                        _set = _set.concat(this.model.attributes.always).reverse();
                    }
                    this.model.setStatus(type);
                    this.hasBeenSelected= _set;
                    this.grid && this.grid.gridLayout.manager.run("indicator",{
                        event:"doIndicator",
                        data:{
                            "hasBeenSelected":_set
                        }
                    });
                    this.afterSelect && this.afterSelect(this.hasBeenSelected);
                }
            },

            doFillData:function(data){
                this.buildReady || this.update(data);
            },

            update:function(data){
                this.destroy();
                this.delegateEvents();
                data && data.view && $.extend(this,data.view);
                data && data.model && $.extend(this.model,data.model);
                if(data && (data.filterData||data.datacontent)){
                    this.model.bind('change', this.render, this);
                    this.model.update(data);
                }else{
                    this.render();
                }
            },
            
            destroy:function(){
                this.popFilter && this.popFilter.find("*").unbind();
                this.popFilter && this.popFilter.remove();
                this.$el.find("*").unbind();
                this.$el.unbind().empty();
            },

            refresh:function(config){
                this[config.event] && this[config.event](config.data);
            }

        };

        var viewsConfig = $.extend(true,{

        },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }
    
    Indicator.prototype.constructor = Indicator;
    return function(config){
        return new Indicator(config);
    };
});