define(function(require,exports,module){

    var Backbone =  require("backbone");
    var $ = window.$ || require('jquery');
    var base = require("base");

    var defaultClassName= {main:"G-tabBox",tab:"tabBnt",box:"tabBox",act:"act"}

    function innerTabPanel(config){

        config = $.extend({
            "items":[]
            ,"asyncItem":false
        },config||{});
        this.className = $.extend({},defaultClassName,(config.className || {}));

        function _setItemsSync(items){
            for(var i =0;i<items.length;i++){
                if(typeof(items[i].sync) !=="boolean"){
                    items[i].sync = false;
                }
            }
            return items;
        }

        function _getViewConfig(config){
            /*显示容器的设置*/
            var boxConfig = {
                    tagName:"div",
                    contents:null,
                    items:config.items,
                    innerBox:null,
                    showTab:typeof(config.showTab) === "boolean"?config.showTab:true,
                    spuer:null,
                    boxTpl:{
                        outer:'<div class="innerTabBox"></div>',
                        inner:'<div {isActive} data-type="content"><div class="G-tabpanelLoadding"><img src="/resources/images/loading2.gif" alt="" valign="absmiddle" />'+LANG("正在加载，请稍候")+'</div></div>'
                    },
                    initialize:function(){
                        this.innerBox = $(this.boxTpl.outer);
                        this.$el.addClass(self.className.box+(!this.showTab && " noTabBnt" || "")).append(this.innerBox);
                    },
                    doRender:function(aI){
                        var me = this;
                        me.innerBox.html("");
                        $.each(this.items,function(i){
                            me.innerBox.append(
                                base.tpl.repLabel(me.boxTpl.inner,1,{
                                    "isActive":(i!==aI && 'style="display:none"'||"")
                                })
                            );
                        });
                        this.contents = this.innerBox.find(this.tagName+"[data-type='content']");
                    },
                    /*添加选项卡内容*/
                    add:function(model){
                        var newContent = $(
                            base.tpl.repLabel(this.boxTpl.inner,1,{
                                "isActive":'style="display:none"'
                            })
                        );
                        this.contents.push(newContent[0]);
                        this.innerBox.append(newContent);
                    },
                    /*删除选项卡内容*/
                    del:function(i){
                        this.contents.eq(i).unbind().remove();
                        this.contents = this.contents.not(this.contents.eq(i));
                        this.parent.tabBnts.contentBoxes = this.contents;
                    }
                };

            /*选项卡标签的设置*/
            var tabConfig = {
                    el:config.tid,
                    tagName:"ul",
                    active:config.active?config.active:0,
                    cls:this.className.tab,
                    prevActive:0,
                    actEl:null,
                    contentBoxes:null,
                    parent:null,
                    showTab:typeof(config.showTab) === "boolean"?config.showTab:true,
                    allowAdd:config.allowAdd||false,
                    allowDel:config.allowDel||false,
                    bntTemplate:"<% _.each(items, function(n,i) { %><li ><a href=\"#\" title=\"<%= n.text %>\" data-node='text'><%= n.text %></a></li><% }); %>",
                    addTemplate:"<a class=\"addTab\"></a>",
                    delTemplate:"<em data-action='del' class='delTab'>x</em>",
                    initialize:function(){
                        !this.showTab && this.$el.hide();
                        this.bnts = $(_.template(this.bntTemplate, {"items":config.items}));
                        this.allowAdd && (this.addTabBnt = $(_.template(this.addTemplate)()));
                        this.allowDel && this.bnts.append(this.delTemplate);
                        $.each(this.bnts,function(k){
                            $(this).attr("data-index",k).children().attr("data-index",k);
                        });
                        this.$el.addClass(self.className.tab).append(this.bnts);
                        this.addTabBnt && this.$el.append(this.addTabBnt);
                        this.actEl = this.bnts.eq(this.active);
                        this.actEl.addClass(self.className.act);
                        this.active = this.active;
                        this.delegateEvents({
                            "click li":"changeTab",
                            "click .addTab":"addTab",
                            "click li em":"delTab"
                        });
                    },
                    doRender:function(){
                        var model = this.parent.Collection.models[this.active];
                        var mAttributes = model.attributes;
                        if(mAttributes.sync && !mAttributes.dom){
                            /*异步且还未加载*/
                            this.getContent(mAttributes);
                        }else{
                            if(!mAttributes.dom){
                                /*非异步但未渲染*/
                                (function(mAttributes,me){
                                    mAttributes.dom = me.contentBoxes.eq(me.active);
                                    mAttributes.dom.html((mAttributes.html || ""));
                                    if(me.parent.Collection.models[me.active].attributes.afterRender){
                                        if(mAttributes.scope){
                                            me.parent.Collection.models[me.active].attributes.afterRender.call(me,mAttributes);
                                        }else{
                                            me.parent.Collection.models[me.active].attributes.afterRender(mAttributes);
                                        }
                                    }
                                })(mAttributes,this);
                            }
                            /*非异步或异步但已经加载*/
                            this.setTabBnt();
                            this.showContent();
                        }
                    },
                    /*加了新建标签*/
                    addTab: function(){
                        if(this.bnts.last().children().html() == this.parent.addConfig.text || this.bnts.length>6){
                            return;
                        }
                    },
                    /*加了删除标签*/
                    delTab: function(ev){
                        if(!confirm(LANG('确定要删除吗？'))){     
                           return false;     
                        }
                        return false;
                    },
                    /*切换时*/
                    changeTab:function(e){
                        var tag = $(e.target);
                        var eName = e.target.tagName || e.target.nodeName;
                        this.prevActive = this.active;
                        this.active = tag.attr("data-index");
                        this.doRender();
                        try{
                            if(eName.toLowerCase() === "a"){
                                return false;
                            };
                            return false;
                        }finally{
                            $(document).click();
                        }
                        if(Clicki.Balance){
                            Clicki.Balance();
                        }
                        
                    },
                    /*激活指定标签*/
                    toChangeTab:function(i){
                        this.prevActive = this.active;
                        this.active = i;
                        this.doRender();
                    },
                    /*选项卡标签设定*/
                    setTabBnt:function(){
                        this.actEl.removeClass(self.className.act);
                        this.actEl = this.bnts.eq(this.active);
                        this.actEl.addClass(self.className.act);
                    },
                    /*显示内容*/
                    showContent:function(){
                        this.contentBoxes.hide();
                        this.contentBoxes.eq(this.active).show();
                    },
                    /*异步获取选项卡容器内容*/
                    getContent:function(mAttr){
                        (function(me){
                            var nowActive = me.active;
                            var scope = false;
                            if(mAttr.scope){
                                if(mAttr.scope === true){
                                    scope = me;
                                }else{
                                    scope = mAttr.scope;
                                }
                            }
                            $.get(mAttr.url,mAttr.params,function(re){
                                mAttr.dom = me.contentBoxes.eq(nowActive);
                                mAttr.dom.html(re);
                                if(config.items[nowActive].afterRender){
                                    if(scope){
                                        config.items[nowActive].afterRender.call(scope,mAttr);
                                    }else{
                                        config.items[nowActive].afterRender(mAttr);
                                    }
                                }
                            }.bind(me));
                            me.setTabBnt();
                            me.showContent();
                            if(Clicki.Balance){
                                Clicki.Balance();
                            }
                        })(this);
                    },
                    /*添加标签*/
                    add:function(model){
                        var newTab = $(_.template(this.bntTemplate, {"items":[model.attributes]}));
                        this.allowDel && newTab.append(this.delTemplate);
                        newTab.attr("data-index",(this.parent.Collection.length-1)).children().attr("data-index",(this.parent.Collection.length-1));
                        this.bnts.push(newTab[0]);
                        this.$el.append(newTab);
                        this.addTabBnt && this.$el.append(this.addTabBnt);
                    },
                    /*删除标签*/
                    del:function(i){
                        this.bnts.eq(i).undelegate("click").remove();
                        this.bnts = this.bnts.not(this.bnts.eq(i));
                        for(var i=0; i<this.parent.Collection.length; i++){
                            this.bnts.eq(i).attr("data-index",i).children().attr("data-index",i);
                        }
                    }
                };

            /*主视图私有属性/方法设置*/
            var privateConfig = {
                    /*Collection*/
                    Collection:Backbone.Collection.extend(),
                    /*标签模块*/
                    tabBnts:Backbone.View.extend(tabConfig),
                    /*内容显示模块*/
                    tabBox:Backbone.View.extend(boxConfig),
                    allowAdd:config.allowAdd||false,
                    allowDel:config.allowDel||false,
                    initialize:function(){

                        /*当设定有Id存在的情况下以页面的id为准*/
                        if(this.id){
                            this.$el = $(this.id);
                            this.el = this.$el[0];
                        }

                        this.Collection = new this.Collection(config.items);
                        this.tabBnts = new this.tabBnts;
                        this.tabBox = new this.tabBox;
                        this.Collection.bind("add",this.fn._add,this)
                        .bind("remove",this.fn._del,this);

                        this.Collection.parent = this.tabBnts.parent = this.tabBox.parent = this;

                        this.$el.addClass(self.className.main).append(this.tabBnts.el);
                        this.$el.append(this.tabBox.el);

                        /*渲染至*/
                        if(
                            this.renderTo && (this.renderTo = $(this.renderTo)) && this.renderTo.length
                        ){
                            this.renderTo.append(this.$el);
                        }

                        /*分别渲染*/
                        this.tabBox.doRender(this.showTab && this.tabBnts.active || 0);
                        this.tabBnts.contentBoxes = this.tabBox.contents
                        this.changToIndex = this.changToIndex;

                        this.tabBnts.doRender();
                    },
                    "fn":{
                        _add:function(model){
                            this.tabBnts.add(model);
                            this.tabBox.add(model);
                            this.changToIndex(model.collection.length-1);
                            return this;
                        },
                        _del:function(delted,collection,i){
                            this.tabBnts.del(i.index);
                            this.tabBox.del(i.index);
                            this.tabBnts.prevActive = 0;
                            this.changToIndex(this.tabBnts.prevActive);
                            return this;
                        }
                    },
                    refresh:function(config){
                        !this.model && config.model && (this.model = config.model);
                        this[config.event] && this[config.event](config.data);
                    },
                    /*激活指定标签*/
                    changToIndex:function(i){
                        this.tabBnts.toChangeTab(i);
                    },
                    /*添加一个新的选项卡*/
                    add:function(config){

                        this.allowAdd && this.Collection.add([
                            $.extend({
                                "text":LANG("新建标签"),
                                "html":'<div>'+LANG("新建内容")+'</div>',
                                afterRender:function(){},
                                "sync":false,
                                "url":null,
                                "params":null,
                                "active":true
                            },(config||{}))
                        ]);

                        config = null;
                    },
                    /*删除一个新的选项卡*/
                    del:function(i,fn,success,fail){

                        if(this.allowDel){
                            i= (+i);
                            if(_.isFunction(fn)){
                                var mAttributes = this.Collection.at(i).attributes;
                                $.when((function(){
                                    var dtd = $.Deferred();
                                    (function(dtd){
                                        fn(mAttributes);
                                        dtd.resolve();
                                    })(dtd);
                                    return dtd;
                                })()).then(
                                    function(){
                                        this.Collection.remove(
                                            this.Collection.at(i)
                                        );
                                        _.isFunction(success) && success();
                                    }.bind(this),
                                    function() {
                                        _.isFunction(fail) && fail();
                                    }
                                );
                            }else{
                                this.Collection.remove(
                                    this.Collection.at(i)
                                );
                            }
                        }
                    },
                    changeTabText:function(i,txt){
                        this.tabBnts.bnts.eq(i) && this.tabBnts.bnts.eq(i).find("[data-node='text']").text(txt);
                    },
                    changeTabStatus:function(type,config){
                        /*
                        type:"allowAdd"|"allowDel"
                        */
                        this[type] && (this[type] = typeof(config) ==="boolean"?config:!this.allowAdd);
                    },
                    destroy:function(){
                        this.tabBnts.$el.unbind();
                        this.tabBox.$el.unbind();
                        this.$el.unbind().empty();
                    }
                };

            /*某些默认参数*/
            var defConfig = {
                    "el":null,
                    "id":null,
                    "tagName":"div",
                    /*渲染至*/
                    "renderTo":null,
                    "showTab":true,
                    "tabName":""
                };

            return $.extend(
                defConfig,
                (config || {}),
                privateConfig
            );
        }

        this.mainView = {};
        var self = this;
        /**
         * 当启用异步获取选项卡时，asyncItem必须为可执行函数并接收唯一的一个回调函数在数据获取完后执行。
         */
        if(config.asyncItem && _.isFunction(config.asyncItem)){
            this.mainView.ready = false;
            config.asyncItem(function(items){
                config.items = _setItemsSync(items);
                this.mainView = new (Backbone.View.extend(_getViewConfig.call(this,config)));
                this.mainView.ready = true;
            }.bind(this));
        }else{
            config.items = _setItemsSync(config.items);
            this.mainView = new (Backbone.View.extend(_getViewConfig.call(this,config)));
            this.mainView.ready = true;
        }

        /*主视图*/
        return this.mainView;
    }

    return {
        name:"Tab Panel",
        init:function(config){
            config.id = typeof(config.id) === "string"?(config.id.indexOf("#") !== -1 ?config.id:"#"+config.id):config.id;
            var newTabPane =  new innerTabPanel(config);
            return newTabPane;
        }
    }

});