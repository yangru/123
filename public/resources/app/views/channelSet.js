(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    var cookie = require("cookie");
    var model = require("/resources/app/models/channelSet");
    /*
    "model":{
        "data":data,
        "type":14000,
        "subtype":0,
        "site_id":site_id
    },
    "view":{
        "status":"edit",
        "el":$(".channelAdd"),
        afterSave:function(){
        },
        afterCancle:function(){
        }
    }
    */
    function ChannelSet(config){
        var viewConfig = {
            /*接口相关设定*/
            tpl:{
                common:{
                    nameTpl:'<div class="channelName"><h3>'+LANG("频道名称")+'</h3><div><input type="text" name="channelName" /></div></div>',
                    statsTpl:'<div class="channelStats"><h3>'+LANG("统计页面")+'/'+LANG("目录")+'</h3><ul></ul></div><div class="statsAdd"></div>',
                    filterTpl:'<div class="channelFilter"><h3>'+LANG("过滤页面")+'/'+LANG("目录")+'</h3><ul></ul></div><div class="filterAdd"></div>',
                    saveTpl: '<div class="ChannelSave"><input type="button" class="saveChannel saveSet" value=""><a class="cancleChannel cancleSet">'+LANG("取消")+'</a></div>',
                    errorTpl:'<div class="error"></div>'
                },
                add:{
                    filterAddTpl:'<li data-ftype="{filter}"><input type="text" name="{filter}" /><em class="filterDel" action-del="{filter}"></em></li>',
                    statsAddTpl:'<li data-stype="{stats}"><input type="text" name="{stats}" /><em class="statsDel" action-del="{stats}"></em></li></li>',
                    explainTpl:'<div class="channelExplain">'+LANG("可以直接输入URL，也可以通过使用 * 符号来设置。* 即通配符，可以放在URL中的任何位置，代替任何字符。<br />比如：<br />url.com/a.html，即表示对该页面单独分析；<br />url.com/*.html ，即表示对本网站域名下、以.html结尾的网页单独分析；<br />url.com/*，即表示对本网站域名下、全部页面单独分析；<br />url.com/a/* ，即表示对本网站域名下、对子目录a下的全部页面单独分析。")+'</div>'
                },
                edit:{
                    filterEditTpl:'<% _.each(filter_page, function(value,key) { %><li><input class="readonly" readonly="readonly" type="text" value="<%= value %>" name="filter_<%= key %>"/></li><% }); %>',
                    statsEditTpl:'<% _.each(stats_page, function(value,key) { %><li><input class="readonly" readonly="readonly" type="text" value="<%= value %>" name="stats_<%= key %>"/></li><% }); %>'
                }
            },
            regexp:{
                "label":/\{\w+\}/g,
                "labelName":/\w+/g
            },
            ui:{
                "hover":"hover",
                "loading":"Ex_loading",
                "loadingTxt":LANG("正在加载..."),
                "def":"Ex_filterInner"
            },
            doms:{},
            tagName: "div",
            className: "channelSet",
            events: {
                "click .statsAdd":"statsAdd",
                "click .filterAdd":"filterAdd",
                "click .saveChannel":"save",
                "click .cancleChannel":"cancle",
                "click .filterDel":"filterDel",
                "click .statsDel":"statsDel"
            },
            errorTip:{
                noName:LANG('频道名称不能为空'),
                noURL:LANG('统计页面/目录不能为空'),
                sameURL:LANG('URL重复'),
                unknownstats:LANG('统计页面/目录格式错误'),
                unknownfilter:LANG('过滤页面/目录格式错误')
            },
            refreshConfig: {},
            statsCount: 0,
            filterCount: 0,
            
            /*初始化处理函数*/
            initialize: function() {
                /*生成名称、统计、目录模板*/
                $.each(this.tpl.common,function(key,value){
                    var str = key.replace(/Tpl/,"");
                    this[str+"Template"] = _.template(value);
                    this.doms[str] = $(this[str+"Template"]());
                    str = null;
                }.bind(this));
                require.async("pop_up",function(popup){
                    this.tip = new popup({
                        "id":this.$el,
                        "type":{
                            "html":this.doms.error
                        },
                        "showClose":false,
                        "animate":{
                            "config":{
                                "position":this.doms.save.eq(0),
                                "fix":{top:0-19,left:150},
                                "noSetSize":true
                            },
                            "delay":500
                        },
                        "tpl":{
                            "box":'<div class="{innerCls}"></div><div class="Ex_popTipShadow"> </div>'
                        },
                        "ui":{
                            "mainCls":"Ex_popTip",
                            "innerCls":"Ex_popTipInner_error",
                            "width":"auto"
                        }
                    });
                }.bind(this));
                this.model.ui = this;
                this.chooseMethod();
            },

            chooseMethod: function(){
                if(this.status == "create"){
                    this.renderCreate();
                }
                if(this.status == "edit"){
                    this.renderEdit();
                }
                if(this.status == "del"){
                    this.del();
                }
            },

            renderCreate: function(){
                /*生成单条输入模板*/
                $.each(this.tpl.add,function(key,value){
                    var str = key.replace(/Tpl/,"");
                    this[str+"Template"] = _.template(value);
                    if(str === "explain"){
                        this.doms[str] = $(this[str+"Template"]());
                    }
                    str = null;
                }.bind(this));

                this.statsAdd();
                this.filterAdd();

                this.$el.append(this.doms.name).append(this.doms.stats).append(this.doms.filter).append(this.doms.save).append(this.doms.explain);
            },

            renderEdit: function(id){
                if(id){
                    this.id = id;
                    this.$el.empty();
                    this.doms.save.find(".saveChannel").attr("disabled",false);
                }

                $.each(this.tpl.edit,function(key,value){
                    var str = key.replace(/Tpl/,"");
                    this[str+"Template"] = _.template(value);
                    this.doms[str] = $(this[str+"Template"](this.model.toJSON()));
                    str = null;
                }.bind(this));

                this.doms.name.find("input").val(this.model.toJSON().title);

                this.doms.stats.last().hide();
                this.doms.filter.last().hide();
                this.doms.filterEdit.length || this.doms.filter.hide();

                this.doms.stats.find("ul").empty().append(this.doms.statsEdit);
                this.doms.filter.find("ul").empty().append(this.doms.filterEdit);
                this.$el.append(this.doms.name).append(this.doms.stats).append(this.doms.filter).append(this.doms.save);
            },

            statsAdd: function(){
                var tpl_clone = this.statsAddTemplate();
                var labels = this.statsAddTemplate().match(this.regexp.label);
                for(var i = 0,len = labels.length,n;i<len;i++){
                    n = labels[i].match(this.regexp.labelName);
                    n = n && n[0] || "";
                    tpl_clone = tpl_clone.replace(new RegExp(labels[i],["g"]),n + "_" + this.statsCount);
                    n = null;
                }
                this.statsCount++;
                this.doms.stats.find("ul").append(tpl_clone);
            },

            filterAdd: function(){
                var tpl_clone = this.filterAddTemplate();
                var labels = this.filterAddTemplate().match(this.regexp.label);
                for(var i = 0,len = labels.length,n;i<len;i++){
                    n = labels[i].match(this.regexp.labelName);
                    n = n && n[0] || "";
                    tpl_clone = tpl_clone.replace(new RegExp(labels[i],["g"]),n + "_" + this.filterCount);
                    n = null;
                }
                this.filterCount++;
                this.doms.filter.find("ul").append(tpl_clone);
            },

            statsDel:function(ev){
                if(this.doms.stats.find("li").length>1){
                    var _n = $(ev.target);
                    var inputName = _n.attr("action-del");
                    this.doms.stats.find("li[data-stype='"+inputName+"']").remove();
                }
            },

            filterDel:function(ev){
                if(this.doms.filter.find("li").length>1){
                    var _n = $(ev.target);
                    var inputName = _n.attr("action-del");
                    this.doms.filter.find("li[data-ftype='"+inputName+"']").remove();
                }
            },

            save:function(){
                if(!this.doms.name.find("input").val()){
                    this.doms.error.html(this.errorTip.noName);
                    this.tip.show();
                    return false;
                }
                var data = {};
                this.id && (data.id = this.id);
                data.title = this.doms.name.find("input").val();

                data.stats_page = [];
                $.each(this.doms.stats.find("ul li input"), function(key, value){
                    $(value).val() && data.stats_page.push($(value).val());
                });
                if(!data.stats_page.length){
                    this.doms.error.html(this.errorTip.noURL);
                    this.tip.show();
                    return false;
                }

                data.filter_page = [];
                $.each(this.doms.filter.find("ul li input"), function(key, value){
                    $(value).val() && data.filter_page.push($(value).val());
                });

                var errorStatus = false;
                $.each(data.stats_page, function(key, value){
                    if(!value.match(/(\.[w]*)+/gi)){
                        this.doms.error.html(this.errorTip.unknownstats);
                        this.tip.show();
                        errorStatus = true;
                        return false;
                    } 
                    if(data.filter_page.length){
                        $.each(data.filter_page, function(n,nn){
                            if(nn ===  value){
                                this.doms.error.html(this.errorTip.sameURL);
                                this.tip.show();
                                errorStatus = true;
                                return false;
                            }
                            if(!nn.match(/(\.[w]*)+/gi)){
                                this.doms.error.html(this.errorTip.unknownfilter);
                                this.tip.show();
                                errorStatus = true;
                                return false;
                            }                         
                        }.bind(this));
                        if(errorStatus){
                            return  false;
                        }
                    }
                }.bind(this));
                if(errorStatus){
                    return  false;
                }

                this.doms.save.find(".saveChannel").attr("disabled","disabled");
                this.model.set(data, {silent: true});
                this.model.save();
            },

            del:function(){
                this.model.del(this.id);
            },

            cancle:function(){
                this.afterCancle && this.afterCancle();
            },

            destroy:function(){
                this.$el.find("*").unbind();
                this.$el.unbind().empty();
            }

        };

        var refreshConfig= {
            refresh:function(config){
                !this.model && config.model && (this.model = config.model);
                this[config.event] && this[config.event](config.data);
            }
        };

        this.config = config;
        this.channelSetModelConstructor =  model;
        this.channelSetViewConstructor = Backbone.View.extend(viewConfig);
        this.channelSetmodel = new (this.channelSetModelConstructor.extend(this.config.model));
        this.config.view.model = this.channelSetmodel;
        return new (this.channelSetViewConstructor.extend($.extend(true, this.config.view, refreshConfig||{})));
    }
    
    ChannelSet.prototype.constructor = ChannelSet;

    return {
        init:function(config){
            var newChannelSet =  new ChannelSet(config);
            return newChannelSet;
        }
    };

});