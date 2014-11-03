define(function(require,exports,module){

    var $ = window.$ || require("jquery");
    var base = require("base");
    var Backbone =  require("backbone");
    var pop_up = require("pop_up");
    var scroller = require("scroller");

    function List(config){
        var id = config.id;
        delete config.id;

        var privateConfig = {
            "tagName":"div",
            "doms":{
                "box":null,
                "innerBox":null,
                "tag":$(
                    typeof(id) === "string" && $("#"+id)
                    || id && (id.nodeType || id.selector) && id
                ),
                "list":null,
                "lis":null
            },
            "label":"name",
            initialize:function(){
                this.warning.scope = this;
                this.warning = this.showCtrl && (new pop_up(this.warning));
                this.doms.box = $(this.tpl.inner).addClass(this.ui.loading);
                this.$el.addClass(this.ui.mainCls).append(this.doms.box);
                this.doms.tag.append(this.$el);

                this.callParent("fn");
                this.callParent("status");

                this.model && (this.model = new (this.model.extend({"ui":this})));
            },
            "fn":{
                _buildList:function(data,parent){
                    var splitMark = "</li>";
                    var str = "";
                    for(var i =0,len = data.length;i<len;i++){
                        //data[i].selected = !+i && this.ui.selected || "";
                        data[i].i = parent && (parent.i+"_"+i) || i;
                        data[i].selected = "";
                        data[i].desc = data[i].desc || "";
                        data[i].sub = data[i].childs && data[i].childs.length || 0;
                        data[i].hasSub = data[i].childs?"hasSub":"";
                        if(data[i].childs){
                            var liHtm = base.tpl.repLabel(this.tpl.item,1,data[i]);
                            liHtm = liHtm.split(splitMark)[0];
                            liHtm += '<div id="datachild_'+ data[i].value + '" class="Ex_popInner" style="display:none;"><ul>'+this.fn._buildList.apply(this,[data[i].childs,data[i]])+'</ul></div>';
                            liHtm += splitMark;
                        }else{
                            data[i].selected = (!i) && this.ui.selected || "";
                            data[i].edit = this.showCtrl && base.tpl.repLabel(this.tpl.edit,1,data[i]) || "";
                            var liHtm = "";
                            if(!data[i].hide){
                                liHtm = base.tpl.repLabel(this.tpl.item,1,data[i]);
                            }
                        }
                        str += liHtm;
                        liHtm = null;
                    }
                    return str;
                },
                _buildLi:function(data,i){
                    var data = $.extend({},data),str;
                    data.selected = (data.def || !+i) && this.ui.selected || "";
                    data.i = i;
                    data.edit = this.showCtrl && base.tpl.repLabel(this.tpl.edit,1,data) || "";
                    str = base.tpl.repLabel(this.tpl.item,1,data);
                    data = null;
                    return str;
                },
                _bindEvent:function(last){
                    var me = this;
                    this.doms.list.find(last && "li:last" || "li").filter(function(){
                        return !$(this).hasClass("hasSub") && !$(this).hasClass("desc");
                    }).bind("click",this.onSelect.bind(this))
                        .delegate("*[data-do='edit']","click",this.edit.bind(this))
                        .delegate("*[data-do='del']","click",this.del.bind(this));

                    this.doms.list.find(last && "li:last" || "li").hover(
                        function(){
                            var tag = $(this)
                                ,dh = $(document).height()-50
                                ,bh = 0;
                            tag.addClass(me.ui.hover);
                            tag = $(this).find("div:first");
                            tag.show();
                            tag && tag.offset() && (bh = tag.offset().top+tag.outerHeight());
                            if(bh>dh){
                                tag.css("top",(dh - bh - 20)+"px");
                            }
                        },
                        function(){
                            $(this).removeClass(me.ui.hover);
                            $(this).find("div:first").hide();
                        }
                    );
                }
            },
            load:function(data){
                this.data = data;
                var htm = "";
                htm = this.fn._buildList.apply(this,[this.data.items]);
                this.doms.lis = $(htm);
                this.doms.list = $(this.tpl.listEl).addClass(this.ui.listCls).append(this.doms.lis);
                this.doms.box.removeClass(this.ui.loading)
                    .addClass(this.ui.def)
                    .empty()
                    .append(this.doms.list);
                this.doms.lis = this.doms.list.children("li");
                this.fn._bindEvent();
                if(this.scroller){
                    var _id = "theListScroll_"+this.cid;
                    this.$el.attr("id",_id);
                    this.scroller = scroller.init($.extend(
                        {
                            "id":_id,
                            "ux":{
                                "style":{
                                    "position":"absolute"
                                }
                            },
                            "elSelector":"ul > li"
                        },this.scroller
                    ));
                }
                this.onLoad && this.onLoad(data,this);
            },
            add:function(data){
                var li = $(this.fn._buildLi.apply(this,[data.data,data.i]))
                this.doms.lis = this.doms.lis.add(li);
                this.doms.lis.removeClass(this.ui.selected);
                li.addClass(this.ui.selected);
                this.doms.list.append(li);
                this.fn._bindEvent.call(this,true);
            },
            del:function(ev){
                var tag = $(ev.target);
                var i = +tag.attr("data-i");
                this.warning.data = {"index":i}
                this.warning.show();
                return false;
            },
            edit:function(ev){
                var tag = $(ev.target);
                var i = +tag.attr("data-i");
                this.onEdit(i);
            },
            onSelect:function(ev,i){
                this.onBeforeSelect();
                var tag = $(ev.target);
                if(!tag.closest(".Ex_listEdit").length){
                    tag = tag.closest("li");
                }
                if(tag.attr("data-id")!==undefined || i !== undefined){
                    var data = this.model.setSelected(tag.attr("data-i")||i);
                    this.doms.lis.removeClass(this.ui.selected);
                    (tag || this.doms.lis.eq(i)).addClass(this.ui.selected);
                    typeof(this.onAfterSelect) === "function" && this.onAfterSelect.call(this,data,(tag || this.doms.lis.eq(i)));
                }
                return false;
            },
            refresh:function(config){
                !this.model && config.model && (this.model = config.model);
                this[config.event] && this[config.event](config.data);
            },
            destroy:function(){
                this.$el.unbind().remove();
                this.warning && this.warning.destroy();
            },
            /*更新模块*/
            update:function(data){
                this.status.onLoadStart();
            },
            /*模块取消操作*/
            cancel:function(){}
        };

        var viewsConfig = $.extend(true,{
            "model":null,
            "showCtrl":false,
            "ui":{
                "hover":"hover",
                "loading":"Ex_loading",
                "loadingTxt":LANG("正在加载..."),
                "def":"Ex_popInner",
                "mainCls":"Ex_pop Ex_reportDropdownList",
                "listCls":"Ex_list",
                "selected":"selected"
            },
            "tpl":{
                "listEl":"<ul></ul>",
                "edit":'<p class="Ex_listEdit"><em data-do="edit" data-i={i} class="Ex_iconEdit"></em><em data-do="del" data-i={i} class="Ex_iconDel"></em></p>',
                "item":'<li class="{selected}" data-i={i} data-id="{id}">{edit}{name}</li>',
                "inner":'<div class="Ex_popInner"></div>'
            },
            "availability":true,
            /*view相关交互状态的操作函数*/
            "status":{
                "onLoadStart":function(){},
                "onLoadCancel":function(){},
                "onLoadSuccess":function(){},
                "onHover":function(){},
                "onActive":function(){},
                "onNormal":function(){},
                "onVisited":function(){},
                "onEnabled":function(){},
                "onDisabled":function(){}
            },
            "warning":{
                "type":{
                    "html":'<div class="warnTip">'+LANG("确定要删除该项吗？")+'</div>'
                },
                "ui":{
                    "title":{
                        "show":true,
                        "text":LANG("提示：")
                    }
                },
                "autoClose":false,
                "showMark":true,
                "showClose":true,
                "showCtrl":true,
                onDone:function(){
                    this.scope.model.del(this.data.index);
                    this.scope.doms.lis.eq(this.data.index).remove();
                    this.hide();
                },
                "data":null,
                "ready":false
            },
            scroller:false,
            maxShow:10,
            onBeforeSelect:$.noop,
            onEdit:$.noop,
            /*模块具备的属性操作*/
            setDisabled:$.noop,
            setEnabled:$.noop,
            setActive:$.noop,
            setVisited:$.noop,
            onLoad:$.noop
        },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }

    List.prototype.constructor = List

    return function(config){
        return new List(config)
    };

});