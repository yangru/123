(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var model = require("/resources/app/models/list");
    var view = require("/resources/app/views/list");
    var Backbone =  require("backbone");
    var base = require("base");
    var $ = window.$ || require("jquery");
    var pop_up = require("pop_up");
    
    function dropdownlist(config){

        var _id = config.id || null;
        _id = typeof(_id) === "string" && $("#"+_id)
                    || _id && (_id.nodeType || _id.selector || _id.jquery) && _id;

        delete(config.id);

        var privateConfig = {
            "loaded":false,
            refresh:function(config){
                !this.model && config.model && (this.model = config.model);
                this[config.event] && this[config.event](config.data);
            },
            initialize:function(){

                if(_id){
                    this.$el = $(_id);
                    this.el = this.$el[0];
                }
                this.view.id = this.$el;
                this.view = new view(this.view);
                this.view.parent = this;

                this.selectedShower = $(this.tpl);
                this.selectedShowerContent = this.selectedShower.find("span:first");
                this.$el.append(this.selectedShower).append(this.view.$el.attr("data-show",0));

                this.view.$el.css("top",this.selectedShower.outerHeight()+this.fix.y);

                this.model = new (model(
                    $.extend(true,{
                        "ui":this
                    },this.model||{})
                ))();

                this.delegateEvents({
                    "click .Ex_selectedReport":"showList",
                    "mouseover .hasSub":"showSub"
                });

                this.callback(this);

                this.ready = true;
            },
            "fn":{
                _show:function(){
                    var me = this;
                    this.view.$el[this.ui.animate.open](this.ui.delay,function(){
                        if(me.autoClose){
                            me.autoCloseHandler = base.ux.hideOnDocumentClick(me.$el,me.fn._hide,me);
                        }
                        $(this).attr("data-show",1); 
                    });
                },
                _hide:function(){
                    var me = this;
                    this.view.$el[this.ui.animate.close](this.ui.delay,function(){
                        if(me.autoClose && me.autoCloseHandler){
                            $(document).unbind("click",me.autoCloseHandler);
                            me.autoCloseHandler = null;
                        }
                        $(this).attr("data-show",0);
                    });
                }
            },
            showList:function(ev){
                if(!+this.view.$el.attr("data-show")){
                    this.fn._show.call(this);
                    this.$el.find(".Ex_selectedReport").addClass("active");
                }else{
                    this.fn._hide.call(this);
                    this.$el.find(".Ex_selectedReport").removeClass("active");
                } 
                return this;
            },
            showSub:function(ev){
                _n = $(ev.target);
                _n.find("div")[this.ui.animate.open](this.ui.delay);
            },
            load:function(data){
                this.view.refresh({
                    "event":"load",
                    "data":data,
                    "model":this.model
                });
                var defSelect = this.model.getSelected();
                if(!defSelect){
                    defSelect = this.model.setSelected(0);
                }
                if(defSelect){
                   this.selectedShower.show();
                    this.select(defSelect); 
                }
                this.onLoad();
                this.loaded = true;
            },
            select:function(select,silence,noAnim){
                var beenSelect = select || this.model.getSelected();
                if(beenSelect){
                    this.selectedShowerContent.html(
                        _.isFunction(this.contentRender) && this.contentRender(beenSelect)
                        || beenSelect[this.label]
                    );
                    if(noAnim || !select){
                        this.selectedShower.animate({opacity:"show"},300);
                    }
                    !silence && select && this.loaded && this.onSelect(beenSelect,this);
                    this.prevSelect = beenSelect;
                }
                return this;
            },
            add:function(data){
                this.nowStatus = "add";
                this.model.add(data);
                this.select(this.model.getSelected());
            },
            addList:function(data){
                this.view.add(data);
            },
            del:function(data){
            },
            upadte:function(data){
                this.model.update(data);
            },
            destroy:function(){
                this.view.destroy();
                this.$el.unbind().empty();
            },
            autoCloseHandler:null
        }

        var viewsConfig = $.extend(true,{
            "tagName":"div",
            "view":{
                onAfterSelect:function(data){
                    this.parent.select(data).showList();
                },
                showCtrl:false
            },
            "ui":{
                "animate":{
                    "open":"slideDown",
                    "close":"slideUp"
                },
                "delay":200
            },
            contentRender:null,
            "fix":{"x":0,"y":0},
            "label":"name",
            "model":model,
            //"tpl":'<div class="Ex_selectedReport"><span></span><b></b></div>',
            onSelect:$.noop,
            autoClose:true,
            availability:true,
            callback:$.noop,
            onLoad:$.noop
        },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;

    }

    dropdownlist.prototype.constructor = dropdownlist;

    return function(config){
        return new dropdownlist(config)
    };
});