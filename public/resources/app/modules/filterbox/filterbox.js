(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var $ = window.$ || window.jQuery || require("jquery");
    var _filterbox;
    //Evan引入underscore
    var _ = require("underscore");

    /*同时只能有一个实例激活*/
    function filterbox(config){
        
        config.el = (config.el.nodeType || config.el.selector) && $(config.el) || $("#"+config.el);

        /*实例id*/
        this.iid = (config.el.attr("id") || config.el.attr("class"))+Math.ceil(Math.random()*1000000);
        /*设置*/
        this.config = $.extend(true,{
            "el":null,
            "url":{
                "pop":null
            },
            "tpl":{
                "fliterCondition":'<span data-do="showfilter" data-ix="{ix}"><em data-do="cancel">close</em><b></b>'+LANG("过滤条件")+'{ix}</span>',
                "filterBox":'<div class="Ex_theAdvFilterBox" id="theAdvFilterPopBox" style="clear:both;"><div class="Ex_theFliterOptions">'+LANG("已选条件")+':<p id="theFilterAlready"></p></div><table><tr><th>'+LANG("在线状态")+'</th><td colspan="5"><input type="radio" name="over" value="" id="allVisitors" /><label for="allVisitors">'+LANG("所有访客")+'</label><input type="radio" name="over" value="0" id="onlineVisitors" /><label for="onlineVisitors">'+LANG("在线访客")+'</label><input type="radio" name="over" value="1" id="offlineVisitors" /><label for="offlineVisitors">'+LANG("离线访客")+'</label></td></tr><tr><th>'+LANG("访客地区")+'</th><td><a href="#" class="Ex_changeOptions" data-do="geo">'+LANG("选择")+'/'+LANG("修改")+'</a></td><th>'+LANG("浏览器")+'</th><td><a href="#" class="Ex_changeOptions" data-do="browser">'+LANG("选择")+'/'+LANG("修改")+'</a></td><th>'+LANG("操作系统")+'</th><td><a href="#" class="Ex_changeOptions" data-do="os">'+LANG("选择")+'/'+LANG("修改")+'</a></td></tr><tr><th>'+LANG("网络接入商")+'</th><td><a href="#" class="Ex_changeOptions" data-do="isp">'+LANG("选择")+'/'+LANG("修改")+'</a></td><th>'+LANG("语言")+'</th><td><a href="#" class="Ex_changeOptions" data-do="language">'+LANG("选择")+'/'+LANG("修改")+'</a></td><th>'+LANG("分辨率")+'</th><td><a href="#" class="Ex_changeOptions" data-do="resolution">'+LANG("选择")+'/'+LANG("修改")+'</a></td></tr><tr><th>'+LANG("访问来源")+'</th><td><a href="#" class="Ex_changeOptions" data-do="referer">'+LANG("选择")+'/'+LANG("修改")+'</a></td><th>'+LANG("访问次数")+'</th><td><a href="#" class="Ex_changeOptions" data-do="reviewslot">'+LANG("选择")+'/'+LANG("修改")+'</a></td><th>'+LANG("访问深度")+'</th><td><a href="#" class="Ex_changeOptions" data-do="depth">'+LANG("选择")+'/'+LANG("修改")+'</a></td></tr><tr><th>'+LANG("停留时间")+'</th><td><a href="#" class="Ex_changeOptions" data-do="stayslot">'+LANG("选择")+'/'+LANG("修改")+'</a></td></tr></table><div class="Ex_theFilterCtrl"><input type="button" class="Ex_filterSubmit" /><a href="#" data-do="cancel" class="Ex_filterCancel" title="'+LANG("取消")+'">'+LANG("取消")+'</a></div></div>',          
                "fliterOption":'<em><span>{name}<b data-type="{type}">x</b></span></em>',
                "filterPopBox":'<div class="Ex_theAdvFilterCondition" id="theAdvFilterConditionPop{type}"><div class="Ex_theAFTitle">'+LANG("请选择")+'{name}<span data-do="cancel">x</span></div><div class="Ex_theAFContent"><div class="Ex_theAFList"><ul {subcls}>{list}</ul><div class="Ex_theAFListCtrler"><div><input type="checkbox" data-type="selectAll" data-sort="{type}" id="{type}SelectAll" /><label for="{type}SelectAll">'+LANG("全选")+'</label><!--<input type="checkbox" data-sort="{type}" data-type="invertSelect" id="{type}InvertSelect" /><label for="{type}InvertSelect">'+LANG("反选")+'</label>--></div><input type="button" data-type="{type}" class="Ex_filterOk" /><a href="#" data-do="cancel" class="Ex_filterCancel" title="'+LANG("取消")+'">'+LANG("取消")+'</a></div></div></div></div>',
                "filterPopLi":'<li><input type="checkbox" data-sub="{sub}" data-subchk="0" name="{type}" id="{key}|{ix}" value="{value}" /><label for="{key}|{ix}">{name}</label></li>',
                /*Evan增加子层弹出层模板*/
                "filterPopLis":'<li><input type="checkbox" data-sub="{sub}" data-subchk="0" name="{type}" id="{key}|{ix}" value="{value}" /><label for="{key}|{ix}">{name}</label><a href="#" data-child="{type}{ix}">--></a></li>',
                "mark":'<div id="theAdvFilterMarker" class="Ex_theAdvFilterMarker"></div>',
                "mainMark":'<div id="theAdvFilterMainMarker" class="Ex_theAdvFilterMarker"></div>',
                "style":null
            },
            "cls":{
               "bar":"Ex_theAdvFilter"
            },
            /*位置*/
            "position":"left",
            /*是否只显示一个*/
            "single":false,
            /*处理完数据后的回调函数*/
            "onSend":null,
            /*当前筛选器所归属的模块实例*/
            "parent":null
        },config);

        /*弹出层结构是否存在*/
        this.domIsReady = false;

        /*dom缓存*/
        this.doms = {
            "bar":this.config.el,
            "main":$("#theAdvFilterPopBox"),
            "pop":{},
            "mark":null,
            "mainMark":null,
            "poplist":$("#theAdvFilterConditionPop .Ex_theAFList:first > ul")
        }

        /*编辑状态*/
        this.editStatus = null;

        if(this.doms.main.length){
            this.domIsReady = true;
            this.doms["poplist"] = $("#theAdvFilterConditionPop .Ex_theAFList:first > ul");
        }

        /*正则*/
        this.regexp = {
            "label":/\{\w+\}/g,
            "labelName":/\w+/g,
            "textType":/(Start|End)$/g
        }

        /*关系表*/
        this.mapping = null;
        /*
        {
            "url":[],
            "visitor":[],
            "geo":[],
            "browser":[],
            "os":[],
            "isp":[],
            "language":[],
            "resolution":[],
            "referer":[],
            "reviewslot":[],
            "depth":[],
            "click":[],
            "enter":[],
            "stayslot":[]
        }
        */
        this.data = {
            /*已选的条件*/
            "beenSelected":[],
            /*正在筛选时的缓存*/
            "onSelecting":null,
            /*已经去除重复的条件*/
            "noRepeat":{}
        }

        /*具体条件弹出层节点设定*/
        this.popSet = null;

        /*全局临时缓存*/
        this.temp = null;

        this.alreadySet = false;

        if(this.domIsReady){
            this.init();
        }else{
            $.get(this.config.url.pop,function(re){
                this.popSet = re;
                this.init();
            }.bind(this),"json");
        }
    }

    filterbox.prototype = {
        init:function(){
            if(!this.doms.main.length){
                this.buildMainPop();
                /*详细弹出层中的列表*/
                this.doms.poplist = $("#theAdvFilterConditionPop .Ex_theAFList:first > ul");
                /*主筛选弹出层*/
                this.doms.main = $("#theAdvFilterPopBox");
                /*当前激活的实例id*/
                this.doms.main.attr("data-now",this.iid);
                /*详细条件弹出层*/
                for(var n in this.popSet){
                    this.doms.pop[n] = $("#theAdvFilterConditionPop"+n);
                }
            }else{
                /*详细条件弹出层*/
                for(var n in this.popSet){
                    this.doms.pop[n] = $("#theAdvFilterConditionPop"+n);
                }
            }
            this.doms.mark = $("#theAdvFilterMarker");
            this.doms.mainMark = $("#theAdvFilterMainMarker");
            this.bindBar();
            if(!this.domIsReady){
                this.bindThePopDom();
            }
        },
        /*模板操作*/
        _repLabel:function(str,exp,restr){
            var labels = str.match(this.regexp.label);
            var newLabels = [];
            for(var i = 0,len = labels.length,tmp;i<len;i++){
                tmp = ""+newLabels;
                if(tmp.indexOf(labels[i]) === -1){
                    newLabels.push(labels[i]);
                }
            }
            labels = newLabels;
            newLabels = null;
            for(var i = 0,len = labels.length,n;i<len;i++){
                n = labels[i].match(this.regexp.labelName);
                n = n && n[0] || "";
                str = str.replace(new RegExp(labels[i],["g"]),restr[n]);
                n = null;
            }
            labels = null;
            return str;
        },
        /*在数组中删除成员*/
        _grep:function(arr,tag,index){
            var newArr = [];
            for(var i = 0;i<arr.length;i++){
                if((tag && arr[i] !== tag) || (!tag && i !== index)){
                    newArr.push(arr[i]);
                }
            }
            return newArr;
        },
        /*往数组中添加成员*/
        _push:function(arr,tag){
            arr.push(tag);
            return arr;
        },
        /*界面事件绑定*/
        bindThePopDom:function(){
            this.bindPop();
            this.bindConditionPop();
        },
        /*解除界面上的事件绑定*/
        unbindThePopDom:function(){
            var table = this.doms.main.find("table");
            /*条件上的X*/
            $("#theFilterAlready").find("em b:first").die("click").remove();
            /*各种标签*/
            table.find("a,input,span").unbind("click");

            table = null;

            $.each(this.doms.pop,function(n,v){
                var parent = $(v);
                parent.find("span,a,:button").unbind("click");
                parent.find(":checkbox").attr("checked",false).unbind("change");
            });

            return this;
        },
        /*重置状态*/
        resetPopStatus:function(){
            this.doms.main.find(":checkbox").attr("checked",false);
            this.doms.main.find(":text").val("");
            $("#theFilterAlready").empty();
            $.each(this.doms.pop,function(n,v){
                $(v).find(":checkbox").attr("checked",false);
            });
        },
        /*重设*/
        setPopStatus:function(data){
            for(var n in data){
                //TODO 根据传进来的数据做初始化，用于显示多个筛选条件，未启用
            }
        },
        /*主筛选层生成*/
        buildMainPop:function(){

            var htm = ""+this.config.tpl.mainMark+this.config.tpl.filterBox+this.config.tpl.mark;
            /*切割标签*/
            var splitMark = "</li>";

            /*条件列表*/
            function _getList(data,child){
                var str = "";
                var type = data.type;
                var sKey;
                if(!child){
                    sKey = data.key;
                    data = data.items;
                }else{
                    sKey = data.child.key;
                    data = data.child.items;
                }
                for(var i =0,len = data.length;i<len;i++){
                    if(data[i].name !== ""){
                        data[i].type = type;
                        data[i].ix = i;
                        data[i].key = sKey;
                        data[i].sub = data[i].child && data[i].child.items.length || 0;
                        if(data[i].child){
                            var liHtm = this._repLabel(""+this.config.tpl.filterPopLis,1,data[i]);
                            liHtm = liHtm.split(splitMark)[0];
                            data[i].child = {"type":type+"_child","child":data[i].child,"key":sKey};
                            //Evan增加子层弹出层id
                            liHtm += '<div id="' + type + i + 'datachild" style="display:none;"><ul>'+_getList.apply(this,[data[i].child,true])+'</ul></div>';
                            liHtm += splitMark;
                        }else{
                            var liHtm = this._repLabel(""+this.config.tpl.filterPopLi,1,data[i]);
                        }
                        str += liHtm;
                        liHtm = null;
                    }
                    
                }
                return str;
            }

            for(var n in this.popSet){
                this.popSet[n].type = n;
                var hasSB = this.popSet[n].items;
                hasSB = hasSB.length>0 && hasSB[0].child && 'class="Ex_theAFlistHasSub"' || "";
                htm += this._repLabel(
                    ""+this.config.tpl.filterPopBox,
                    1,
                    {"list":_getList.call(this,this.popSet[n]),"type":n,"name":this.popSet[n].title,"key":this.popSet[n].key,"subcls":hasSB}
                );
                hasSB = null;
            }
            $("body:first").append(htm);
            this.config.tpl.style && $("head:first").append(this.config.tpl.style);
        },
        /*筛选条件栏事件绑定*/
        bindBar:function(){
            var me = this;

            this.doms.bar.addClass(this.config.cls.bar)
            .append('<a href="#" data-do="addfilter"></a>')
            //添加筛选条件
            .find("a[data-do],span[data-do]").live("click",function(ev){
                if(this.domIsReady && this.doms.main.attr("data-now") !== this.iid){
                    //已有dom且当前激活的实例不是点击的实例的情况下需要解除该Dom的事件
                    this.unbindThePopDom().bindThePopDom();
                    this.doms.main.attr("data-now",this.iid);
                }
                var tag = $(ev.target);
                this[tag.attr("data-do")](tag,tag.attr("data-ix"));
                //this.config.single && (this.editStatus = tag);
                this.doms.mainMark.height($(document).height()).show();
                return false;
            }.bind(this));

            //展开已选的
            this.doms.bar.find("em[data-do]").live("click",function(){
                if(me.editStatus){
                    me.editStatus.removeClass("act");
                    me.editStatus = null;
                    me.doms.mainMark.hide();
                    me.doms.main.hide();
                }
            });

            //删除已选（多个筛选条件时启用）
            this.doms.bar.find("em").live("click",function(){
                var i = parseInt($(this).parent().attr("data-ix"))-1;
                me.data.beenSelected = me._grep(me.data.beenSelected,false,i);
                if(me.editStatus){
                    me.editStatus.removeClass("act");
                    me.editStatus = null;
                    me.doms.mainMark.hide();
                    me.doms.main.hide();
                }
                $(this).parent().remove();
                i = null;
                return false;
            });

        },
        /*条件弹出层绑定*/
        bindPop:function(){

            var me = this;
            var table = this.doms.main.find("table");

            /*关系*/
            var map = {
                "over":{
                    "text":LANG("在线状态")
                },
                "geo":{
                    "text":LANG("访客地区")
                },
                "browser":{
                    "text":LANG("浏览器")
                },
                "os":{
                    "text":LANG("操作系统")
                },
                "isp":{
                    "text":LANG("网络接入商")
                },
                "language":{
                    "text":LANG("语言")
                },
                "resolution":{
                    "text":LANG("分辨率")
                },
                "referer":{
                    "text":LANG("访问来源")
                },
                "reviewslot":{
                    "text":LANG("访问次数")
                },
                "depth":{
                    "text":LANG("访问深度")
                },
                "stayslot":{
                    "text":LANG("停留时间")
                }
            }
            this.mapping = map;
            /*已经添加的条件dom*/
            var hasAdd = {};
            var aOne = table.find("a[data-do]:first");
            /*方法集*/
            var toDo = {
                "already":$("#theFilterAlready"),
                "toAlready":function(arr,type,notime){
                    if(arr.length>0 && !hasAdd[type]){
                        hasAdd[type] = $(me._repLabel(me.config.tpl.fliterOption,1,{"type":type,"name":map[type].text}));
                        if(type !== "remain"){
                            this.already.append(hasAdd[type]);
                        }else{
                            if(!notime){
                                this.already.append(hasAdd[type]);
                            }
                        }
                    }else if(arr.length === 0 || notime){
                        /*非法时间只有时间段部分会处理，如果此项为true则视时间段不合法需要移除时间段部分的显示*/
                        hasAdd[type] && hasAdd[type].remove();
                        hasAdd[type] = null;
                    }
                },
                "a":function(tag){
                    var offset = aOne.offset();
                    var box = me.doms.pop[tag.attr("data-do")];
                    offset = {
                        left:offset.left,
                        "top":offset.top
                    }
                    me.doms.pop[tag.attr("data-do")].css({
                        "top":offset.top+"px",
                        "left":offset.left+"px"
                    }).show();
                    //me.doms.mark.height($(document).height()).show();
                    offset = tag = box = null;
                },
                /*保存*/
                "save":function(){
                    me.setBeenSelected();
                    if(me.editStatus){
                        me.editStatus.removeClass("act");
                        me.editStatus = null;
                    }
                    me.doms.mainMark.hide();
                    me.doms.main.hide();
                },
                /*取消或关闭*/
                "cancel":function(){
                    if(me.editStatus){
                        me.editStatus.removeClass("act");
                        me.editStatus = null;
                    }
                    me.doms.mainMark.hide();
                    me.doms.main.hide();
                },
                /*checkbox*/
                "checking":function(tag){
                    //!me.data.onSelecting.visitor && (me.data.onSelecting.visitor = []);
                    var type=tag.attr("data-type");
                    if(tag.val()!==""){
                        me.data.onSelecting[type] = [{"over":tag.val()}];
                        toDo.toAlready(me.data.onSelecting.over,type);
                    }else{
                        me.data.onSelecting[type] && (delete me.data.onSelecting[type]);
                        toDo.toAlready([],type);
                    }
                    
                },
                /*text*/
                "typingEnd":function(tag){
                    var type = tag.attr("name");
                    var mapType = type.split(type.match(me.regexp.textType)[0])[0];
                    var notime;
                    if(!me.data.onSelecting[mapType]){
                        if(mapType.length>1){
                            me.data.onSelecting[mapType] = [];
                        }else{
                            me.data.onSelecting.remain = [
                                {"h":0,"m":0,"s":0},{"h":0,"m":0,"s":0}
                            ];
                        }
                    }
                    mapType = mapType.length>1 ?mapType:"remain";
                    //TODO 非法数据时的提示（填写文本时启用）
                    /*
                    switch(type){
                        case "urlStart":
                            me.data.onSelecting.url = $.trim(tag.val()) && [$.trim(tag.val())] || [];
                        break;
                        case "vistStart":
                        case "vistEnd":
                        case "lvStart":
                        case "lvEnd":
                        case "clickStart":
                        case "clickEnd":
                        case "enterStart":
                        case "enterEnd":
                            var val1 = $.trim(map[mapType].dom[0].val()),val2 = $.trim(map[mapType].dom[1].val());
                            if(val1 || val2){
                                me.data.onSelecting[mapType] = [val1,val2];
                            }else if(!val1 && !val2){
                                me.data.onSelecting[mapType] = [];
                            }
                        break;
                        case "hStart":
                        case "mStart":
                        case "sStart":
                        case "hEnd":
                        case "mEnd":
                        case "sEnd":
                            //时间段比较特殊
                            var val1,val2;
                            var tType;
                            var tmp = [],_v;
                            notime = true;
                            //{h:,m:,s}
                            for(var i = 0;i<6;i++){

                                _v = $.trim(map.remain.dom[i].val());
                                tType = map.remain.dom[i].attr("name");
                                tType = tType.split(tType.match(me.regexp.textType)[0])[0]
                                //为空则为0
                                _v = _v && parseInt(_v) || 0;
                                me.data.onSelecting.remain[
                                    i<3 && 0 || 1
                                ][tType] = _v;

                                if(i===5){
                                    //只要结束时间任一一项比开始时间大则认为是成功
                                    if(
                                        (me.data.onSelecting.remain[1].h >= me.data.onSelecting.remain[0].h && me.data.onSelecting.remain[1].h)
                                        || (me.data.onSelecting.remain[1].m >= me.data.onSelecting.remain[0].m && me.data.onSelecting.remain[1].m)
                                        || (me.data.onSelecting.remain[1].s >= me.data.onSelecting.remain[0].s && me.data.onSelecting.remain[1].s)
                                    ){
                                        notime = false;
                                    }
                                }
                            }
                        break;
                    }
                    */
                    toDo.toAlready(me.data.onSelecting[mapType],mapType,notime);
                },
                "removeSelected":function(tag){
                    var type = tag.attr("data-type");
                    //me.data.onSelecting[type] = (type === "remain") && [{"h":0,"m":0,"s":0},{"h":0,"m":0,"s":0}] || [];
                    if(map[type].dom){
                        map[type].dom.each(function(){
                            if(this.type==="text"){
                                this.value = "";
                            }else{
                                this.checked = false;
                            }
                        });
                    }else{
                        (me.doms.pop[type] || me.doms.main.find("table:first")).find(":radio,:checkbox").attr("checked",false);
                    }
                    tag.parents("em:first").remove();
                    hasAdd[type] = null;
                    delete me.data.onSelecting[type];
                }
            }

            /*条件上的X*/
            toDo.already.find("em b").live("click",function(){
                toDo.removeSelected($(this));
            });

            /*访客地区~访问来源*/
            table.find("a[data-do]").bind("click",function(ev){
                me.temp = {"toAlready":toDo.toAlready,"already":toDo.already}
                toDo.a($(ev.target));
                return false;
            });

            /*保存的时候*/
            this.doms.main.find("input.Ex_filterSubmit:first").bind("click",function(){
                toDo.save();
            });
            
            /*取消的时候*/
            this.doms.main.find("span[data-do='cancel'],a[data-do='cancel']").bind("click",function(){
                toDo.cancel();
                return false;
            });

            /*在线状态部分的*/
            table.find(":radio").bind("change",function(){
                toDo.checking($(this));
            });

            /*文本框的*/
            table.find(":text").each(function(){
                var type = $(this).attr("name");
                var tagMap = null;
                /*类型*/
                if(type.match(me.regexp.textType)){
                    tagMap = map[type.split(type.match(me.regexp.textType)[0])[0]];
                    tagMap = tagMap || map["remain"];
                }
                /*类型对应DOM缓存*/
                if(tagMap && tagMap.dom){
                    tagMap.dom.push($(this));
                }
                $(this).bind("blur",function(){
                    toDo.typingEnd($(this));
                }); 
            });

            table = null;
        },
        /*详细条件弹出层事件绑定*/
        bindConditionPop:function(){
            var me = this;
            $.each(this.doms.pop,function(n,v){

                var parent = $(v);
                var chks = parent.find("li :checkbox");
                /*子层*/
                parent.find("a[data-child]").bind("click",function(ev){
                    var el = $(ev.target);
                    id = el.attr("data-child");
                    var subTag = $("#"+id+"datachild");
                    subTag.css({
                        "top":el.position().top+"px",
                        "left":(el.position().left+10)+"px"
                    }).show().mouseleave(function(){
                      $(this).hide();
                      subTag.unbind("mouseleave");
                      subTag = null;
                    });
                    return false;
                });

                /*取消或关闭*/
                parent.find("span[data-do='cancel'],a[data-do='cancel']").bind("click",function(){
                    parent.hide();
                    me.doms.mark.hide();
                    return false;
                });

                /*确定的时候*/
                parent.find(":button").bind("click",function(){
                    var type = $(this).attr("data-type");
                    var hasChecked = me.doms.pop[type].find(":checked:not(input[data-type='selectAll'],input[data-type='invertSelect'])");
                    !me.data.onSelecting[type] && (me.data.onSelecting[type] = []);
                    if(hasChecked.length === 0){
                        me.data.onSelecting[type] = [];
                    }else{
                        me.data.onSelecting[type] = [];
                        for(var i = 0,len = hasChecked.length;i<len;i++){
                            var sub = parseInt(hasChecked.eq(i).attr("data-sub"));
                            var data = {};
                            data[hasChecked.eq(i).attr("id").split("|")[0]] = hasChecked.eq(i).val();
                            me.data.onSelecting[type].push(data);
                            if(sub){
                                i += sub;
                            }
                            data = null;
                        }
                    }
                    me.temp.toAlready(me.data.onSelecting[type],type);
                    me.temp = null;
                    type = hasChecked = sub = null;
                    parent.hide();
                    me.doms.mark.hide();
                });

                /*弹出层中的checkbox*/
                chks.bind("change",function(){

                    var tag = $(this);
                    /*状态*/
                    var status = tag[0].checked;
                    /*有多少个子节点，默认为0*/
                    var hasSub = parseInt(tag.attr("data-sub"));
                    /*节点分类*/
                    var trunk = tag.attr("name").split("_child")[0];
                    /*分类数据*/
                    var branches = me.popSet[trunk];

                    if(hasSub){
                        /*有子节点*/
                        tag.attr("data-subchk",(status && hasSub || 0)).parent().children("div").find(":checkbox").attr("checked",status);
                    }else{
                        if(tag.attr("name").match(/_child/)){
                            /*子节点*/
                            var pr = tag.parents("li").eq(1).children(":checkbox");
                            var allSubs = parseInt(pr.attr("data-sub"));
                            var nowChk = parseInt(pr.attr("data-subchk"));
                            pr.attr("data-subchk",(status && (nowChk+=1) || (nowChk-=1)))
                            .attr("checked",(nowChk === allSubs));
                        }
                    }
                });

                var selectAllBnt = parent.find("input[data-type='selectAll']:first"),
                    inverSelectBnt = parent.find("input[data-type='invertSelect']:first")

                /*全选*/
                selectAllBnt.bind("change",function(){
                    var tag = $(this);
                    var status = tag[0].checked;
                    if(status){
                        chks.attr("checked",true);
                    }else{
                        chks.attr("checked",false);
                    }
                });

                /*反选*/
                inverSelectBnt.bind("change",function(){
                    $.each(chks,function(i,n){
                        n = $(this);
                        n.attr("checked",!(n.attr("checked")));
                        n = null;
                    });
                    var hasBeenSelectedNum = me.doms.pop[$(this).attr("data-sort")].find("li :checked").length;
                    if(!hasBeenSelectedNum){
                        selectAllBnt.attr("checked",false);
                    }else if(hasBeenSelectedNum === chks.length){
                        selectAllBnt.attr("checked",true);
                    }
                });


            });
        },
        /*添加新的过滤条件*/
        addfilter:function(tag){
            if(!this.alreadySet){
                this.doms.main.css("top",(tag.offset().top+tag.height()+5)+"px");
                this.alreadySet = true;
            }
            if(!this.data.onSelecting || !this.config.single){
                this.data.onSelecting = {};
            }
            this.doms.main.css(this.config.position,(
                this.config.position === "left" && tag.offset().left
                || $(document).width()-tag.offset().left-tag.outerWidth()
            )+"px").show();
        },
        /*显示已选好的过滤条件（多个过滤条件时启用）*/
        showfilter:function(tag,i){
            return this;
            this.setBeenSelected((parseInt(i)-1));
            this.data.onSelecting = this.data.beenSelected[(parseInt(i)-1)];
            tag.addClass("act");
            this.editStatus = tag;
            this.doms.main.css("left",(tag.offset().left - tag.width()*parseInt(i))+"px").show();
        },
        /*设定已选中的数据*/
        setBeenSelected:function(i){
            
            if(typeof(i)!= "undefined"){
                //TODO 初始化已选项
                this.setPopStatus(this.data.beenSelected[i]);
            }else{
                if(this.config.single){
                    this.data.beenSelected = [];
                }

                this.data.beenSelected.push(this.data.onSelecting);
                if(!this.config.single){
                    /*追加新的过滤条件*/
                    this.doms.bar.append(this._repLabel(""+this.config.tpl.fliterCondition,1,{"ix":this.data.beenSelected.length}));
                    /*清空过滤条件的选择项*/
                    this.resetPopStatus();
                    this.data.onSelecting = null;
                }
                this.sendData();
            }
            
        },
        /*发送筛选*/
        sendData:function(){

            this.data.noRepeat = {};
            var filter = [];

            $.each(this.data.beenSelected,function(key,value){
                for(var m in value){
                    if(this.data.noRepeat[m]){
                        this.data.noRepeat[m] = _.union(this.data.noRepeat[m],value[m]);
                    }else{   
                        this.data.noRepeat[m] = value[m];
                    }
                }
            }.bind(this));

            $.each(this.data.noRepeat,function(key,value){
                if(value.length){
                    filter.push(value);
                }
            });

            if(typeof(this.config.onSend) === "function"){
                this.config.onSend.call(this,filter);
            }

            this.data.noRepeat = null;
            return filter;
        },

        destroy: function(){
            $.each(this.doms, function(key, value){
                if(key === "pop"){
                    $.each(value, function(n, nn){
                        nn.unbind().remove();
                    });
                }else{
                    value.unbind().remove();
                }
            });
        }
    }

    filterbox.prototype.constructor  = filterbox;

    return _filterbox = {
        name:"The Adv Filter",
        init:function(config){
            if(!config || !config.el){
                return false;
            }
            return new filterbox(config);
        }
    }
});


