(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var $ = window.$ || require("jquery")
        ,base = require("base")
        ,model = require("/resources/app/models/viewpath")
        ,view = require("/resources/app/views/viewpath")
        ,pop_up = require("pop_up")
        ,Backbone = require("backbone")
        ,scroller = require("scroller")
        ,reportDropdownlist = require("dropdownlist")
        ,listModel = require("/resources/app/models/list")
        ,listView = require("/resources/app/views/list");

    function Viewpath(config){
        
        var dropdownlist = $.extend({})

        var innerViewConfig = $.extend({},config.view);

        delete config.view;

        var viewsConfig = $.extend(true,{
            id:"body:first",
            "tagName":"div",
            reportView:innerViewConfig,
            reportModel:model,
            ready:false,
            dropdownlist:null,
            ports:{
                "del":{
                    "url":"/custom/tab_delete"
                },
                "edit":{
                    "url":"/custom/tab_edit"
                }
            },
            addReportPop:{
                /*
                添加报告弹出层模块设定
                */
                "type":{
                    "html":'<div class="addReportInner">'+LANG("报告名称：")+'<input type="text" class="" />'+LANG("描述说明：")+'<textarea name=""></textarea></div>'
                },
                "ui":{
                    "arrow":{
                        "show":true,
                        "arrowType":"top"
                    },
                    "width":230
                },
                "animate":{
                    "fix":{
                        "top":(0-10),
                        "left":0
                    }
                },
                "showCtrl":true,
                "showClose":false,
                /*点击确定按钮时的操作*/
                onDone:function(){
                    if(!this.doms.tmp){
                        this.doms.tmp = {
                            title:this.doms.inner.find(":text:first"),
                            sub_title:this.doms.inner.find("textarea:first")
                        };
                    }
                    var title = this.doms.tmp.title.val(),
                        sub_title = this.doms.tmp.sub_title.val();

                    if(!!title){
                        Clicki.layout.get("dropdownlist").doAddList({
                            "title":title,
                            "sub_title":sub_title,
                            "def":true,
                            "rows":[],
                            "columns":[]
                        });
                        this.hide();
                        this.doms.tmp.title.val("");
                        this.doms.tmp.sub_title.val("");
                    }else{
                        alert(LANG("请填写报告标题。"));
                    }
                },
                onCancel:function(){
                    if(!this.doms.tmp){
                        this.doms.tmp = {
                            title:this.doms.inner.find(":text:first"),
                            sub_title:this.doms.inner.find("textarea:first")
                        };
                    }
                    this.doms.tmp.title.val("");
                    this.doms.tmp.sub_title.val("");
                },
                callback:function(){
                    /*构造完毕向manager添加受控关系*/
                    Clicki.layout.manager.add("addReportPop","dropdownlist");
                }
            },
            addReportUrl:{
                "type":{
                    "html":'<div class="Ex_latsetReportSelector"></div>'
                },
                "tpl":{
                    "box":'{arrow}<div class="Ex_thePopBoxInner">{close}{title}<div class="{innerCls} {hasTitle}"><div id="thePopSelectedArea" class="whenThePopChildSelected"></div>{ctrlbar}<div class="whenReportEmpty"><a href="#" tile="'+LANG("请先添加“自定义行为统计”")+'">'+LANG("请先添加“自定义行为统计”")+'</a></div></div></div>',
                },
                "showClose":false,
                "showCtrl":true,
                "ui":{
                    // "height":240,
                    "arrow":{   
                        "show":true
                        ,"arrowType":"right"
                    },
                    "title":{
                        "show":false,
                        "text":LANG("添加页面")
                    }
                },
                onRender:function(){

                    var me = this;
                    var lModel = new (listModel(
                            {
                                "datasources":{
                                    "url":"/custom/tabs",
                                    "data":{
                                        "type":"report",
                                        "site_id":site_id
                                    },
                                    dataFilter:function(re,type){
                                        re = $.parseJSON(re);
                                        if(re.success){
                                            $.each(re.result.items, function(key, value){
                                                value.childs = null;
                                            });
                                            return (re = JSON.stringify(re.result));
                                        }else{
                                            /*失败*/
                                            var def = $.Deferred(this);
                                            def.reject();
                                            return false;
                                        }
                                    }.bind(this)
                                },
                                "ui":(new listView({
                                    "id":$(".Ex_latsetReportSelector:first"),
                                    "ui":{
                                        "mainCls":"Ex_reportDropdownList Ex_reportAddUrlPopList",
                                    },
                                    "scroller":{
                                        "ux":{
                                            "style":{
                                                "position":"relative"
                                            }
                                        },
                                        "autoLayout":true,
                                        "width":215,
                                        "showNum":5,
                                        "showScroller":true
                                    },
                                    onLoad:function(data){
                                        if(!data.items.length || data.items[0].value == -1){
                                            me.doms.inner.find(".Ex_latsetReportSelector:first,.Ex_popGuyCtrl:first").hide();
                                            me.doms.inner.find(".whenReportEmpty:first").show()
                                                .find("a").bind("click",function(){
                                                    me.hide();
                                                    window.location.href='/site/'+site_id+'/#/statistic/customs/getReport';
                                                    return false
                                                });
                                        }
                                        me.doms.inner
                                            .delegate("li","click",this.showChild.bind(this))
                                            .delegate(".Ex_reportAddUrlChildPopList li","click",this.setLabel0id.bind(this));
                                    },
                                    "childOnGround":null,
                                    showChild:function(ev){
                                        $(ev).find("div").length && this.childOnGround && this.childOnGround.show();
                                    },
                                    setLabel0id:function(ev){
                                        var tag = $(ev.target);
                                        tag = tag.attr("data-id") && tag || tag.closest("li[data-id]");
                                        me.reportRid = tag.attr("data-id");
                                        me.reportName = tag.find("em").text();
                                        me.reportId = me.beenSelect.id;
                                        tag.parent().find("li").removeClass("selected");
                                        tag.addClass("selected");
                                        me.doms.selectedArea.show().html("<strong>"+LANG("当前选择：")+"</strong>"+me.beenSelect.title+" > "+me.reportName);
                                    },
                                    onBeforeSelect:function(){
                                        if(this.childOnGround){
                                            this.childOnGround.hide();
                                            this.childOnGround.remove();
                                        }
                                    },
                                    onAfterSelect:function(data,el){
                                        var beenSelect = lModel.getSelected()
                                            ,me = this
                                            ,date = Clicki.layout.manager.getDate();

                                        this.beenSelect = beenSelect;

                                        $.get("/feed/group",{
                                            "type":"custom"
                                            ,"site_id":site_id
                                            ,"begindate":date.begindate
                                            ,"enddate":date.enddate
                                            ,"ctype":11000
                                            ,"csubtype":0
                                            ,"order":"sessions|-1"
                                            ,"condition":"type_id|"+beenSelect.id
                                            ,"tabid":beenSelect.id
                                            ,"page":1
                                            ,"limit":9999
                                        },function(re){
                                            if(re.success){
                                                var _items = re.result.items
                                                    ,htm = '<div class="Ex_popInner Ex_reportAddUrlChildPopList"><ul class="Ex_list">';
                                                for(var i = 0;i<_items.length;i++){
                                                    htm += base.tpl.repLabel('<li class="{selected}" data-i={i} data-id="{id}"><em>{title}</em><span>{sessions}</span></li>',1,{
                                                        "i":i
                                                        ,"id":_items[i].keys.label0_id
                                                        ,"title":_items[i].x_axis.label0_name
                                                        ,"sessions":_items[i].y_axis.sessions
                                                        ,"selected":_items[i].keys.label0_id == me.reportRid && "selected" || ""
                                                    });
                                                }
                                                htm += '</ul></div>';
                                                if(_items.length){
                                                    lModel.ui.childOnGround = $(htm);
                                                    lModel.ui.childOnGround.bind("mouseleave",function(){
                                                        lModel.ui.onBeforeSelect();
                                                    });
                                                    me.doms.inner.append(lModel.ui.childOnGround);
                                                    lModel.ui.childOnGround.css("top",el.position().top+el.outerHeight()+"px").show();
                                                }else{
                                                    lModel.ui.childOnGround = null;
                                                    me.reportRid= null;
                                                }
                                            }
                                        },"json");
                                        me.doms.selectedArea
                                            .show().html("<strong>"+LANG("当前选择：")+"</strong>"+beenSelect.title+" > "+LANG("请选择统计项")+"");
                                    }.bind(this),
                                    "showCtrl":false,
                                    "tpl":{
                                        "item":'<li class="{selected}" data-i={i} data-id="{id}">{title}</li>'
                                    }
                                }))
                            }
                        ))();

                    this.doms.selectedArea = $("#thePopSelectedArea");
                    this.doms.inner.find(".Ex_popGuyCtrl").before(this.doms.selectedArea);
                    this.$el.find(".right").css("top","230px");
                },
                onDone:function(){
                    var text = this.reportName,
                        typeId = this.reportId,
                        rId = this.reportRid;
                    if(typeId>=0 && rId){
                        Clicki.layout.manager.run("addReportUrl",{
                            event:"addUrl",
                            data:{
                                "text":text,
                                "url":typeId,
                                "rid":rId
                            }
                        });
                        this.hide();
                        this.doms.selectedArea.hide().empty();
                    }else{
                        alert(LANG("请选择报告中的子项目"));
                    }
                },
                onCancel:function(){
                    if(!this.doms.tmp){
                        this.doms.tmp = {
                            text:this.doms.inner.find("input[name='name']"),
                            url:this.doms.inner.find("input[name='url']")
                        };
                    }
                    
                    this.doms.tmp.text.val("");
                    this.doms.tmp.url.val("");
                },
                onClose:function(){
                    this.doms.selectedArea.hide().empty();
                },
                callback:function(){
                    Clicki.layout.manager.add("addReportUrl","viewpath");
                }
            },
            addReportType:{
                "type":{
                    "html":''
                },
                "tpl":{
                    "box":'<div class="{innerCls}"></div>'
                },
                "ui":{
                    "mainCls":"Ex_popTreeList",
                    "innerCls":"Ex_popTreeListInner",
                    "width":115
                },
                "ready":false,
                callback:function(){
                    Clicki.layout.manager.add("addReportType","viewpath");
                },
                bindEvent:function(){
                    var me = this;
                    this.doms.inner.children("ul").each(function(){
                        $(this).find("li").bind("click",function(){
                            var tag = $(this);
                            
                            Clicki.layout.manager.run("addReportType",{
                                event:"addType",
                                data:{
                                    "text":tag.text(),
                                    "dim_type":tag.attr("data-dim"),
                                    "dim_value":tag.attr("data-value")
                                }
                            });
                            me.hide();
                            return false;
                        })
                        .hover(
                            function(){

                            },
                            function(){

                            }
                        );
                    });
                    this.buildReady = true;
                }
            },
            "addTypeTip":{
                "type":{
                    "html":'<div class="warnTip">'+LANG("点击此处添加路径。")+'</div>'
                }
                ,"ui":{
                    "width":200
                    ,"arrow":{
                        "show":true,
                        "arrowType":"right"
                    }
                }
                ,"showClose":false
                ,"animate":{}
                ,"ready":false
            },
            tpl:'<div class="Ex_reportCtrler"><div class="Ex_reportSelector"></div><span>'+LANG("您的网站还没有添加报告，请先添加报告。")+'</span><input type="button" class="Ex_addReport" value="" /><h2></h2><p></p></div><div class="Ex_reportChartOuterBox"><div class="Ex_reportChartY"></div><div class="Ex_reportChart"></div></div><div class="Ex_reportTable"><dl data-type="overview" class="Ex_reportOverview"><dt><span>'+LANG("路径")+'</span><b></b></dt><dd class="Ex_reportOverviewContent"><div class="Ex_reportOverviewContentInner"><ul class="Ex_reportOverviewLiUl"></ul></div></dd><dd data-type="add" class="addDD"><input type="button" class="Ex_repAddColsBnt" data-type="addCols" value="" /></dd></dl><dl data-type="footer" class="Ex_reportFooter"><dt><input type="button" class="Ex_repAddRowBnt" data-type="addRows" value="" /></dt></dl></div>',
            doms:{
                addBnt:null,
                addUrl:null,
                addType:null
            },
            initialize:function(){

                this.$el = $(this.id);
                this.el = this.$el[0];

                this.$el.append(this.tpl);

                this.doms.addBnt = this.$el.find(".Ex_addReport:first");
                this.doms.addUrl = this.$el.find(".Ex_repAddColsBnt:first");
                this.doms.addType = this.$el.find(".Ex_repAddRowBnt:first");

                this.fn._buildAndBind.call(this);
                var me = this;
                /*往layout追加下拉菜单*/
                Clicki.layout.add("dropdownlist",{
                    "type":"dropdownlist",
                    "config":{
                        "model":{
                            onLoad:function(){
                                Clicki.layout.manager.run("dropdownlist",{
                                    "event":(this.attributes.items.length && "update" || "showAddTip"),
                                    "data":this.attributes.items.length && this.getSelected() || false
                                });
                            },
                            "datasources":{
                                "url":"/custom/tabs",
                                "data":{
                                    "type":"viewpath",
                                    "site_id":site_id
                                }
                            },
                            "ports":{
                                "del":{
                                    "url":this.ports.del.url,
                                    params:function(data){
                                        return {
                                            "type":this.attributes.type,
                                            "site_id":site_id,
                                            "data":JSON.stringify({"id":data.id})
                                        }
                                    },
                                    onDone:function(data){
                                        var _vp = Clicki.layout.get("viewpath");
                                        var dpl = Clicki.layout.get("dropdownlist");
                                        if(_vp.reportModel.attributes.id === data.id){
                                            dpl.select(dpl.model.getSelected(0));
                                            dpl.view.onSelect(undefined,0);
                                        }
                                        Clicki.layout.get("dropdownlist").refresh({
                                            "event":"showList"
                                        });
                                    }
                                },
                                "edit":{
                                    "url":this.ports.edit.url
                                },
                                "add":{
                                    "url":this.ports.edit.url
                                }
                            }
                        },
                        "view":{
                            "id":$(".Ex_reportSelector:first"),
                            "tpl":{
                                "item":'<li class="{selected}" data-i={i} data-id="{id}">{edit}<span>{title}</span></li>'
                            },
                            onEdit:function(i){
                                var me = this;
                                if(!this.editPop){
                                    this.editPop = {};
                                    this.editPop.scope = this;
                                    
                                    this.editPop = new pop_up({
                                        "type":{
                                            "html":'<div class="addReportInner">'+LANG("报告名称：")+'<input type="text" class="" />'+LANG("描述说明：")+'<textarea name=""></textarea></div>'
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
                                            if(!this.doms.tmp){
                                                this.doms.tmp = {
                                                    title:this.doms.inner.find(":text:first"),
                                                    sub_title:this.doms.inner.find("textarea:first")
                                                };
                                            }
                                            var title = this.doms.tmp.title.val(),
                                                sub_title = this.doms.tmp.sub_title.val();

                                            if(!!title){
                                                Clicki.layout.get("dropdownlist").doEditList({
                                                    "title":title,
                                                    "sub_title":sub_title,
                                                    "index":this.data.index
                                                },function(){
                                                    var _vp = Clicki.layout.get("viewpath");
                                                    var tag = me.model.getSelected(this.data.index);
                                                    me.model.edit(this.data.index,{"title":title,"sub_title":sub_title});
                                                    me.doms.lis.eq(this.data.index).find("span:first").text(title);
                                                    if(_vp.reportModel.attributes.id === tag.id){
                                                        me.parent.selectedShowerContent.text(title);
                                                        _vp.reportView.doms.other.reportTitle.text(title);
                                                        _vp.reportView.doms.other.reportSubTitle.text(sub_title);
                                                    }
                                                    this.hide();
                                                    this.doms.tmp.title.val("");
                                                    this.doms.tmp.sub_title.val("");
                                                }.bind(this));
                                            }else{
                                                alert(LANG("请填写报告标题。"));
                                            }
                                        },
                                        setPopContent:function(msg,pop){
                                            var oldData = me.model.getSelected(this.data.index);
                                            this.doms.inner.find(":text:first").val(oldData.title);
                                            this.doms.inner.find("textarea:first").val(oldData.sub_title);
                                        },
                                        "data":null,
                                        "ready":false
                                    });
                                }
                                this.editPop.data = {"index":i};
                                this.editPop.show();
                                this.editPop.setPopContent();
                            },
                            "showCtrl":true
                        },
                        "label":"title",
                        "id":this.$el.find(".Ex_reportSelector:first"),
                        "dropdownlistMark":null,
                        "showArea":$("#showArea"),
                        callback:function(){
                            if(!this.dropdownlistMark){
                                this.dropdownlistMark = $('<div class="theMarker"></div>');
                                this.dropdownlistMark.css({
                                    display:"none"
                                });
                                this.showArea.append(this.dropdownlistMark);
                                this.showArea = this.showArea.parent();
                            }
                        },
                        onSelect:function(beenSelect,dpl){
                            this.dropdownlistMark.css("height",this.showArea.innerHeight()+"px").show();
                            Clicki.layout.manager.run("dropdownlist",{
                                data:beenSelect,
                                event:dpl.nowStatus === "add" && "addNewReport" || "changReport"
                            });
                        },
                        doEditList:function(data,cb){
                            //this.dropdownlistMark.css("height",this.showArea.innerHeight()+"px").show();
                            var _i = data.index;
                            delete(data.index);
                            var _data = $.extend(this.model.getSelected(_i),data);
                            
                            data = {};
                            data.columns = _data.columns;
                            data.def = _data.def;
                            data.id = _data.id;
                            data.last_time = _data.last_time;
                            data.rows = _data.rows;
                            data.sub_title = _data.sub_title;
                            data.title = _data.title;
                            _data = null;
                            var params = {
                                "data":JSON.stringify(data),
                                "site_id":site_id,
                                "type":this.model.attributes.type
                            }
                            var me = this;
                            $.get(this.model.ports.add.url,params,function(re){
                                cb();
                            },"json");
                        },
                        doAddList:function(data){
                            this.dropdownlistMark.css("height",this.showArea.innerHeight()+"px").show();
                            var params = {
                                "data":JSON.stringify(data),
                                "site_id":site_id,
                                "type":this.model.attributes.type
                            }
                            var me = this;
                            $.get(this.model.ports.add.url,params,function(re){
                                data.id = re.result.items.max_id;
                                me.add(data);
                                me.select();
                            },"json");
                        },
                        changeDate:function(data){
                            Clicki.layout.manager.run("theDatepicker",{event:"upadte","data":data});
                            // Clicki.Balance();
                        }
                    }
                });
                
                this.ready = true;
            },
            "fn":{
                _init:function(data){
                    this.reportView = new view(this.reportView);
                    this.reportView.parent = this;
                    this.reportModel = new (this.reportModel({"ui":this.reportView,"incomingData":data}));
                    this.buildReady = true;
                    if(!data.columns.length){
                        this.showTypeTip();
                    }
                },
                _change:function(data){
                    this.reportModel.changReport(data);
                },
                _add:function(data){
                    if(this.buildReady){
                        this.reportModel.addNewReport(data);
                    }else{
                        this.fn._init.call(this,data);
                    }
                },
                _addUrl:function(data){
                    data = JSON.parse(data.data.data);
                    this.reportModel.addColumn();
                },
                _addType:function(data){
                    data = JSON.parse(data.data.data);
                    this.reportModel.addRow(data.rows[data.rows.length-1]);
                },
                _delColumn:function(data,prevData){
                    this.reportView.delColumn(data.index,prevData);
                },
                _delRow:function(data){
                    this.reportView.delRow(data.index);
                },
                _save:function(data){
                    $.get(this.ports.edit.url,data.data).done(function(re){
                        var _data = JSON.parse(data.data.data);
                        this.reportModel.set(_data,{silent:true});
                        this.fn[data.event].apply(this,[data,this.reportModel.previousAttributes()]);
                    }.bind(this));
                },
                _buildAndBind:function(){

                    /*添加报告*/
                    this.addReportPop.animate={
                        "config":{
                            "position":this.doms.addBnt,
                            "fix":{top:8}
                        }
                    };

                    this.doms.addBnt.attr("data-isReady",0).bind("click",function(){
                        if(!+this.doms.addBnt.attr("data-isReady")){
                            /*如果还未构造好*/
                            this.addReportPop = Clicki.layout.add("addReportPop",{
                                "type":"pop_up",
                                "config":this.addReportPop
                            });
                            this.doms.addBnt.attr("data-isReady",1);
                        }
                        this.addReportPop.show();
                        return false;
                    }.bind(this));

                    /*添加路径*/
                    this.addReportUrl.animate={
                        "config":{
                            "position":this.doms.addUrl,
                            "fix":{left:0-(215+this.doms.addUrl.outerWidth()+20),top:(0-250)}
                        }
                    };

                    this.doms.addUrl.attr("data-isReady",0).bind("click",function(){
                        this.fn._showAddReportUrlPop.call(this);
                        return false;
                    }.bind(this));

                    /*增加类型*/
                    this.addReportType.animate={
                        "config":{
                            "position":this.doms.addType,
                            "fix":{left:30,top:(0-this.doms.addType.outerWidth()+10)},
                            "noSetSize":true
                        }
                    };

                    this.doms.addType.attr("data-isReady",0).bind("click",function(){
                        if(!+this.doms.addType.attr("data-isReady")){
                            /*如果还未构造好*/
                            this.addReportType = Clicki.layout.add("addReportType",{
                                "type":"pop_up",
                                "config":this.addReportType
                            });
                            this.doms.addType.attr("data-isReady",1);
                        }
                        this.addReportType.show();
                        !this.addReportType.ready && this.addReportType.bindEvent();
                        return false;
                    }.bind(this));
                },
                _grepByIndex:function(arr,i,type){
                    i = +i;
                    var tmp = [];
                    for(var j = 0;j<arr.length;j++){
                        if(type){
                            if(j < i){
                                tmp.push(arr[j]);
                            }
                        }else{
                            if(j !== i){
                                tmp.push(arr[j]);
                            }
                        }
                    }
                    return tmp;
                }
                ,_showAddReportUrlPop:function(out){
                    if(!+this.doms.addUrl.attr("data-isReady")){
                        /*如果还未构造好*/
                        this.addReportUrl = Clicki.layout.add("addReportUrl",{
                            "type":"pop_up",
                            "config":this.addReportUrl
                        });
                        this.doms.addUrl.attr("data-isReady",1);
                    }
                    if(out){
                        return this.addReportUrl;
                    }else{
                        this.addReportUrl.show();
                    }
                }
            },
            showTypeTip:function(){

                if(!this.addTypeTip.ready){
                    this.addTypeTip.animate={
                        "config":{
                            "position":this.doms.addUrl,
                            "fix":{left:0-(190+this.doms.addUrl.outerWidth()),top:(0-this.doms.addUrl.outerHeight()-5)}
                        }
                    };
                    this.addTypeTip = new pop_up(this.addTypeTip);
                    this.addTypeTip.ready = true;
                }
                this.addTypeTip.show();
            },
            addNewReport:function(data){
                if(!this.dropdownlist){
                    this.dropdownlist = Clicki.layout.get("dropdownlist");
                }
                this.dropdownlist.dropdownlistMark.hide();
                this.showAddTip(true);
                this.fn._add.call(this,data);
            },
            changReport:function(data){
                if(!this.dropdownlist){
                    this.dropdownlist = Clicki.layout.get("dropdownlist");
                }
                this.dropdownlist.dropdownlistMark.hide();
                this.fn._change.call(this,data);
            },
            refresh:function(config){
                !this.model && config.model && (this.model = config.model);
                this[config.event] && this[config.event](config.data);
            },
            showAddTip:function(remove){
                this.$el.find(".Ex_reportCtrler")[
                    !remove && "addClass"
                    || "removeClass"
                ]("Ex_showAddReportTip");
            },
            addUrl:function(data){
                if(!this.dropdownlist){
                    this.dropdownlist = Clicki.layout.get("dropdownlist");
                }
                for(var i=0;i<this.dropdownlist.model.getSelected().columns.length;i++){
                    if(this.dropdownlist.model.getSelected().columns[i].text == data.text && this.dropdownlist.model.getSelected().columns[i].rid == data.rid){
                        alert(LANG("已添加"));
                        return;
                    }
                }
                this.dropdownlist.model.getSelected().columns.push(data);
                this.fn._save.call(this,{
                    "event":"_addUrl",
                    "data":{
                        "type":this.dropdownlist.model.attributes.type,
                        "site_id":site_id,
                        "data":JSON.stringify(this.dropdownlist.model.getSelected())
                    }
                });
            },
            addType:function(data){
                if(!this.dropdownlist){
                    this.dropdownlist = Clicki.layout.get("dropdownlist");
                }
                this.dropdownlist.model.getSelected().rows.push(data);
                this.fn._save.call(this,{
                    "event":"_addType",
                    "data":{
                        "type":this.dropdownlist.model.attributes.type,
                        "site_id":site_id,
                        "data":JSON.stringify(this.dropdownlist.model.getSelected())
                    }
                });
            },
            delColumn:function(data,callback){
                if(!this.dropdownlist){
                    this.dropdownlist = Clicki.layout.get("dropdownlist");
                }
                var dat = this.dropdownlist.model.getSelected()[data.type];
                this.dropdownlist.model.getSelected()[data.type] = this.fn._grepByIndex(dat,data.index,false);
                this.fn._save.call(this,{
                    "event":"_delColumn",
                    "data":{
                        "type":this.dropdownlist.model.attributes.type,
                        "site_id":site_id,
                        "data":JSON.stringify(this.dropdownlist.model.getSelected())
                    },
                    "index":data.index
                });
            },
            delRow:function(data){
                if(!this.dropdownlist){
                    this.dropdownlist = Clicki.layout.get("dropdownlist");
                }
                var dat = this.dropdownlist.model.getSelected()[data.type];
                this.dropdownlist.model.getSelected()[data.type] = this.fn._grepByIndex(dat,data.index);
                this.fn._save.call(this,{
                    "event":"_delRow",
                    "data":{
                        "type":this.dropdownlist.model.attributes.type,
                        "site_id":site_id,
                        "data":JSON.stringify(this.dropdownlist.model.getSelected())
                    },
                    "index":data.index
                });
            },
            update:function(data){
                if(!this.buildReady){
                    this.fn._init.call(this,data);
                }else{
                    this.reportView.reset();
                    this.reportModel.update({
                        "data":data
                    });
                }
            },
            destroy:function(){

                this.addReportPop["destroy"] && this.addReportPop.destroy();
                this.addReportUrl["destroy"] && this.addReportUrl.destroy();
                this.addReportType["destroy"] && this.addReportType.destroy();

                this.reportModel = null;

                this.reportView && this.reportView.destroy && this.reportView.destroy();

                this.$el.find("*").unbind();
                this.$el.empty();
            }
        },config||{});

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;

    }

    Viewpath.prototype.constructor = Viewpath

    return function(config){
        return new Viewpath(config)
    };

});