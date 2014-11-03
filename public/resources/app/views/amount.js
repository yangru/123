(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    var model = require("/resources/app/models/amount");
    var pop_up = require("pop_up");
    var scroller = require("scroller");
    /*
            el:$(".theGridTotalBox"),
            datasources,
            nowStatus
    */
    function Amount(config){
        var privateConfig = {
            //////////////////////////////翻译-----box汇总///////////////////////////////
            amountTpl:'<ul><% _.each(data, function(value,key) { if(!value.hidden){ %><li data-ttype="<%= key %>"><span><%= LANG(value.text) %></span><%= value.value %><em data-desc="<%= key %>"></em></li><% } }); %></ul>',
            tagName: "div",
            refreshConfig: {},
            ready:false,

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
                this.model.ui = this;
                this.model = new model(this.model);
            },

            refresh:function(config){
                this[config.event] && this[config.event](config.data);
            },

            render:function(){
                this.destroy();
                this.amountTemplate = _.template(this.amountTpl);
                var data = this.model.toJSON();
                if($.isEmptyObject(data)){
                    data = {
                        "active_visitors": {
                            "explain": "Loading",
                            "text": "Loading",
                            "value": "0"
                        }
                    }
                }
                this.$el.html(this.amountTemplate({data:data}));
                this._setTotalRow();
                this.scroller = scroller.init($.extend(
                    {
                        "id":this.$el,
                        "type":"left",
                        "showScroller":true,
                        "width":this.$el.outerWidth()
                    },this.scroller
                ));
                this.ready = true;
            },
            
            _setTotalRow:function(){
                this.totalRow = {main:$(this.el)};
                this.totalRow.mainWidth = this.totalRow.main.width();
                this.totalRow.ul = this.totalRow.main.find("ul:first");
                this.totalRow.li = this.totalRow.main.find("li");
                this.totalRow.em = this.totalRow.li.find("em");

                var descDefine = this.model.toJSON();
                $.each(this.totalRow.em, function(key, value){
                    var desc = $(value).attr("data-desc");
                    var text = descDefine[desc] && descDefine[desc].explain;
                    if (!text || $.trim(text) == ''){
                        $(value).remove();
                    }
                });
                this.totalRow.em.unbind().hover(
                    function(ev){
                        var _n = $(ev.target);
                        var data = descDefine;
                        var popSet = {
                            "type":{
                                //////////////////////翻译------展示的描述//////////////////////////
                                "html":data[_n.attr("data-desc")] && LANG(data[_n.attr("data-desc")].explain) || ""
                            },
                            "showClose":false,
                            "autoClose":true,
                            "animate":{
                                "config":{
                                    "position":_n[0],
                                    "fix":{top:0-23,left:21},
                                    "noSetSize":true
                                },
                                "delay":500
                            },
                            "ui":{
                                "innerCls":"gridDesc",
                                "width":315,
                                "title":{
                                    "show":false,
                                    /////////////////////////////////////////////////////////
                                    "text":data[_n.attr("data-desc")].text
                                },
                                "arrow":{
                                    "show":true,
                                    "arrowType":"left"
                                }
                            },
                            "once":true
                        }
                        if(_n.offset().left + popSet.ui.width + 12 > $(document).width() ){
                            popSet.animate.config.fix = {top:0-23, left:0-3-popSet.ui.width};
                            popSet.ui.arrow.arrowType = "right";
                        }else{
                            popSet.ui.arrow.arrowType = "left";
                        }
                        this.explainPop = new pop_up(popSet);
                        this.explainPop.show();
                        popSet = null;
                        data = null;
                        /**/
                    }.bind(this),
                    function(){
                        this.explainPop && this.explainPop.hide();
                        this.explainPop= null;
                    }.bind(this)
                );

                var noHiddenLi = this.totalRow.li.filter(function(){
                    return $(this).css("display")!=="none";
                });
                noHiddenLi.css("width","89px");

                var mWidth = this.totalRow.mainWidth,
                    allWidth = noHiddenLi.eq(0).outerWidth()*noHiddenLi.length,
                    sWidth;
                /*调整宽度*/
                if(mWidth <= allWidth){
                    this.totalRow.ul.width(allWidth);
                }else{
                    this.totalRow.ul.width("auto");
                    sWidth = (mWidth/noHiddenLi.length)-24

                    $.each(noHiddenLi,function(){
                        $(this).width(sWidth);
                    });

                }

                noHiddenLi = null;
            },
            doFillData:function(data){
                this.update(data);
            },
            update:function(data){
                this.delegateEvents();
                data && data.view && $.extend(this,data.view);
                data && data.model && $.extend(this.model,data.model);
                if(data && (data.params || data.datacontent)){
                    this.model.update(data);
                }
            },

            doIndicator:function(data){
                this.selected = data.hasBeenSelected;
                data.hasBeenSelected && this.model.setData(data.hasBeenSelected);
            },

            destroy:function(){
                this.$el.find("*").unbind();
                this.$el.empty();
            }
        };

        var viewsConfig = $.extend(true,{
        },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }
    
    Amount.prototype.constructor = Amount;

    return {
        init:function(config){
            return new Amount(config);
        }
    };

});