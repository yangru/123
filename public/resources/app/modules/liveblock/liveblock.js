(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){
    
    var $ = window.$ || window.jQuery || require("jquery");
    var _Liveblock;

    function liveblock(config){

        this.config = $.extend(true,{
            /*模板*/
            tpl:{
                "box":'<div class="Ex_theSourcesBox"><p class="Ex_sbTitle">{name}</p><div class="Ex_bigNum"><strong data-num="{onum}">{num}</strong><span>'+LANG("次")+'</span></div>{bigbar}<ul>{smallbarlist}</ul></div>',
                "bar":{
                    "big":'<div class="Ex_sbBigBar" data-num="{onum}" data-type="{type}"><div></div><b></b></div>',
                    "small":'<li data-type="{type}" data-num="{onum}"><em>{num}</em><span>{name}</span><div class="Ex_sbSmallBar"><div></div><b></b></div></li>'
                }
            },
            /*接口*/
            port:{
                url:"/feed/group",
                /*参数*/
                params:{
                    "type":"referer_type",
                    "order":"sessions|-1"
                }
            },
            /*数据获取间隔*/
            delay:3000,
            /*UI相关设定*/
            ux:{
                /*样式*/
                cls:{
                    "hover":"Ex_sbBoxHover",
                    "update":"Ex_sbBoxUpdate"
                },
                /*动画*/
                anim:{
                    speed:300
                }
            },
            /*每一块的设置*/
            members:[
                /////////////////////////翻译-----页面直接访问模块/////////////////////////////////
                {"name":"direct","mapping":"source0_id|0","text":LANG("直接访问"),"big":"sessions","small":[
                    {"name":"avg_staytime","text":LANG("停留时间"),"avg":"avg_staytime_all",format:function(num){
                        return (new Date(num*1000).timemark([":",":",""],true));
                    }},
                    {"name":"avg_pageviews","text":LANG("访问深度"),"avg":"avg_pageviews_all"}
                ]},
                {"name":"search","mapping":"source0_id|2","text":LANG("搜索来源"),"big":"sessions","small":[
                    {"name":"avg_staytime","text":LANG("停留时间"),"avg":"avg_staytime_all",format:function(num){
                        return (new Date(num*1000).timemark([":",":",""],true));
                    }},
                    {"name":"avg_pageviews","text":LANG("访问深度"),"avg":"avg_pageviews_all"}
                ]},
                {"name":"ads","mapping":"source0_id|5","text":LANG("广告来源"),"big":"sessions","small":[
                        {"name":"avg_staytime","text":LANG("停留时间"),"avg":"avg_staytime_all",format:function(num){
                            return (new Date(num*1000).timemark([":",":",""],true));
                        }},
                        {"name":"avg_pageviews","text":LANG("访问深度"),"avg":"avg_pageviews_all"}
                ]},
                {"name":"media","mapping":"source0_id|3","text":LANG("社会化媒体"),"big":"sessions","small":[
                    {"name":"avg_staytime","text":LANG("停留时间"),"avg":"avg_staytime_all",format:function(num){
                        return (new Date(num*1000).timemark([":",":",""],true));
                    }},
                    {"name":"avg_pageviews","text":LANG("访问深度"),"avg":"avg_pageviews_all"}
                ]},
                {"name":"other","mapping":"source0_id|1","text":LANG("其他"),"big":"sessions","small":[
                    {"name":"avg_staytime","text":LANG("停留时间"),"avg":"avg_staytime_all",format:function(num){
                        return (new Date(num*1000).timemark([":",":",""],true));
                    }},
                    {"name":"avg_pageviews","text":LANG("访问深度"),"avg":"avg_pageviews_all"}
                ]}
            ],
            /*数据格转化函数。用于将外部接口返回的数据转化为内部可使用的数据*/
            formater:null
        },config);

        this.membersMapping = {};
        /*dom缓存*/
        this.doms = {
            /*主容器*/
            main:$("#"+this.config.id),
            /*当前成员*/
            members:null
        };

        /*数据缓存*/
        this.data = null;

        /*ajax回调函数*/
        this.ajaxCallback = null;

        this.timer = null;

        if(typeof(this.config.formater) === "function"){
            this.fn.setData = this.config.formater;
        }

        this.init();
    }

    liveblock.prototype = {
        init:function(){
            this.getData(function(re){
                if(re.success){
                    this.fn.setData.call(this,re.result);
                    this.fn.build.call(this);
                    this.fn.updateBlocks.call(this);
                }else{
                    window.console.log && window.console.log("Fear the fearsome fury of the forest fawn!!");
                }
                if(this.ajaxCallback){
                    this.ajaxCallback.call(this,re);
                    this.ajaxCallback = null;
                }
            },function(re){
                this.fn.setEvent.call(this);
                this.timer = setTimeout(function(){
                    var timer = arguments.callee;
                    this.getData(null,function(re){
                        this.timer = setTimeout(timer.bind(this),this.config.delay);
                    });
                }.bind(this),this.config.delay);
            });
            $(window).bind("unload",function(){
                this.destroy();
            }.bind(this));
        },
        /*方法集*/
        "fn":{
            
            /*HTML 构造函数*/
            build:function(){
                var str;
                var members = this.config.members;
                this.doms.members = {};
                this.doms.main.html("");

                for(var i =0;i<members.length;i++){

                    str = ""+this.config.tpl.box;
                    /*dom缓存对象*/
                    this.doms.members[members[i].name] = {"main":null};

                    /*每块的html*/
                    str = this.fn.repLabel.apply(this,[
                        str,1,{
                            "name":members[i].text,
                            "onum":this.data[members[i].name][members[i].big],
                            "num":(this.data[members[i].name][members[i].big]).separated(),
                            "bigbar":this.fn.repLabel.apply(this,[(""+this.config.tpl.bar.big),1,{"type":members[i].name,"onum":this.data[members[i].name][members[i].big]}]),
                            "smallbarlist":(function(me,mbs,data){
                                /*每块的维度*/
                                var _str = "";
                                for(var j=0;j<mbs.length;j++){
                                    _str+= me.fn.repLabel.apply(this,[
                                        (""+me.config.tpl.bar.small),1,{
                                            "name":mbs[j].text,
                                            "onum":data[mbs[j].name],
                                            "num":mbs[j].format && mbs[j].format.call(me,data[mbs[j].name]) || (data[mbs[j].name]).separated(),
                                            "avg":data[mbs[j].avg],
                                            "type":mbs[j].name
                                        }
                                    ]);
                                }

                                return _str;
                            })(this,members[i].small,this.data[members[i].name])
                        }
                    ]);

                    /*dom缓存*/
                    this.doms.members[members[i].name].main = $(str);
                    this.doms.members[members[i].name][members[i].big] = this.doms.members[members[i].name].main.find("div[data-type='"+members[i].name+"']:first");
                    this.doms.members[members[i].name][members[i].big].type = "big";
                    for(var k =0;k<members[i].small.length;k++){
                        this.doms.members[members[i].name][members[i].small[k].name] = this.doms.members[members[i].name].main.find("li[data-type='"+members[i].small[k].name+"']:first");
                        this.doms.members[members[i].name][members[i].small[k].name].type = "small";
                    }
                    this.doms.members[members[i].name].data = this.data[members[i].name];
                    /*追加*/
                    this.doms.main.append(this.doms.members[members[i].name].main);
                    this.membersMapping[members[i].name] = i;

                }

                str = members = null;
            },
            /*替换模板中的指定标签*/
            repLabel:function(str,exp,restr){
                var labels = str.match(/\{\w+\}/g);
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
                    n = labels[i].match(/[^\{\}]+/g);
                    n = n && n[0] || "";
                    str = str.replace(new RegExp(labels[i],["g"]),restr[n]);
                    n = null;
                }
                labels = null;
                return str;
            },
            /*时间戳转换*/
            timemark:function(ms){
                var _Date = new Date(ms),str,mark=["h","m","s"],r = [];
                _Date = [_Date.getUTCHours(),_Date.getUTCMinutes(),_Date.getUTCSeconds()];
                for(var i=0;i<3;i++){
                    if(_Date[i] || i){
                        if(_Date[i]){
                            r.push((_Date[i]+mark[i]));
                        }else if(!_Date[i] && r[i-1]){
                            r.push((_Date[i]+mark[i]));
                        }
                    }
                }
                str = r.join("");
                _Date = mark = r = null;
                return str;
            },
            /*数据设置*/
            setData:function(original){
                //TODO 将外部数据转化为内部可识别的数据
                var o_o = original;
                this.data = this.data || {};
                var mbs = this.config.members;
                var data = this.data || {};

                /*指定字段的数值集合数组*/
                var pd = {};

                /*获取对应的数据*/
                function _getData(id){
                    for(var j = 0;j<o_o.items.length;j++){
                        if(o_o.items[j].keys["source0_id"] === id){
                            return o_o.items[j].y_axis;
                        }
                    }
                    return false;
                }
                /*数组求和*/
                function _getTotal(arr){

                    var num = 0;
                    for(var i = 0;i<arr.length;i++){
                        num += arr[i];
                    }
                    return num;
                }

                for(var i = 0;i<mbs.length;i++){
                    /*当前块对应的keys名及id*/
                    var id = mbs[i].mapping.split("|")[1];
                    /*当前块是否为空*/
                    var emptyBlock = false;
                    /*获取对应数据*/
                    data[mbs[i].name] = _getData(id);
                    /*为空则构造一个*/
                    if(!data[mbs[i].name]){
                        data[mbs[i].name] = {};
                        data[mbs[i].name][mbs[i].big]=0;
                        emptyBlock = true;
                    }
                    /*附属指标*/
                    for(var l = 0;l<mbs[i].small.length;l++){
                        if(emptyBlock){
                            data[mbs[i].name][mbs[i].small[l].name]=0;
                        }
                        /*指标平均值字段赋值*/
                        data[mbs[i].name][mbs[i].small[l].avg] = o_o.amount.y_axis[mbs[i].small[l].name];

                        /*存储当前附属指标值*/
                        pd[mbs[i].small[l].name] = pd[mbs[i].small[l].name]||[];
                        pd[mbs[i].small[l].name].push(data[mbs[i].name][mbs[i].small[l].name]);
                    }

                    /*存储指标值*/
                    pd[mbs[i].big] = pd[mbs[i].big]||[];
                    pd[mbs[i].big].push(data[mbs[i].name][mbs[i].big]);

                }

                /*计算相关指标的总数*/
                for(var i = 0;i<mbs.length;i++){
                    data[mbs[i].name][mbs[i].big+"_all"] = _getTotal(pd[mbs[i].big]);

                    for(var j =0;j<mbs[i].small.length;j++){
                        data[mbs[i].name]["all_"+mbs[i].small[j].name] = _getTotal(pd[mbs[i].small[j].name]);
                    }

                }

                this.data = data;
                original = data = o_o = mbs = pd = bigAll = null;
            },
            /*事件设定*/
            setEvent:function(){
                var me = this;
                for(var n in this.doms.members){
                    this.doms.members[n].main.hover(
                        function(){
                            if(!$(this).hasClass(me.config.ux.cls.update)){
                                $(this).addClass(me.config.ux.cls.hover);
                            }
                        },
                        function(){
                            if(!$(this).hasClass(me.config.ux.cls.update)){
                                $(this).removeClass(me.config.ux.cls.hover);
                            }
                        }
                    );
                }
            },
            updateSingle:function(name){

                var dom = this.doms.members[name];
                var data = this.data[name];
                var tars = this.config.members[this.membersMapping[name]];
                var strong = dom.main.find("strong:first");
                var hasChanged;
                var me = this;
                /*对应数据字段的处理函数*/
                var action = {
                    /*主要指标*/
                    "doBig":function(dat,el){
                        var num = ((dat/data[tars.big+"_all"])*100);
                        num = num > 0 && num < 1?1:num;
                        strong.text(dat);
                        el.find("div:first").stop().animate({
                            width:num+"%"
                        },me.config.ux.anim.speed);
                    },
                    /*附属指标*/
                    "doSmall":function(dat,el,i){
                        var num = (dat/data["all_"+tars.small[i].name])*100;
                        var num2 = (data[tars.small[i].name+"_all"]/data["all_"+tars.small[i].name])*100
                        num = num > 0 && num < 1?1:num;
                        num2 =num2 > 0 && num2 < 1?1:num2;
                        /*平均值游标*/
                        el.find(".Ex_sbSmallBar:first > b:first").stop().animate({
                            left:num2+"%"
                        },me.config.ux.anim.speed);
                        /*柱状*/
                        el.find(".Ex_sbSmallBar:first > div:first").stop().animate({
                            width:num+"%"
                        },me.config.ux.anim.speed);
                    }
                }

                /*主要指标与附属指标对应的操作*/
                if(dom.data[tars.big] !== data[tars.big]){
                    !hasChanged && (hasChanged = true);
                    action.doBig(data[tars.big],dom[tars.big]);
                    dom.data[tars.big] = data[tars.big];
                }else if(!dom[tars.big].attr("data-inited")){
                    action.doBig(data[tars.big],dom[tars.big]);
                    dom[tars.big].attr("data-inited",1);
                }

                if(tars.small){
                    for(var i = 0;i<tars.small.length;i++){
                        if(dom.data[tars.small[i].name] !== data[tars.small[i].name]){
                            !hasChanged && (hasChanged = true);
                            action.doSmall(data[tars.small[i].name],dom[tars.small[i].name],i);
                            dom.data[tars.small[i].name] = data[tars.small[i].name];
                        }else if(!dom[tars.small[i].name].attr("data-inited")){

                            action.doSmall(data[tars.small[i].name],dom[tars.small[i].name],i);

                            dom[tars.small[i].name].attr("data-inited",1);
                        }
                    }
                }

                /*如果有变则添加变化样式*/
                if(hasChanged){
                    dom.main.addClass(this.config.ux.cls.update);
                    setTimeout(function(m){
                        dom.main.removeClass(this.config.ux.cls.update);
                    }.bind(this),500);
                }
                data = tars = strong = hasChanged = action = null;
            },
            updateBlocks:function(){
                for(var n in this.data){
                    this.fn.updateSingle.call(this,n);
                }
            }
        },
        /*获取数据*/
        getData:function(fn,cb){
            /*回调函数*/
            typeof(cb)==="function" && (this.ajaxCallback = cb);

            $.ajax({
                type:"GET",
                url:this.config.port.url,
                data:this.config.port.params || {},
                dataType:"json",
                context:this,
                success:typeof(fn) === "function" && fn || function(re){
                    /*默认的ajax执行事件*/
                    if(re.success){
                        this.fn.setData.call(this,re.result);
                        this.fn.updateBlocks.call(this);
                    }else{
                        window.console.log && window.console.log("Fear the fearsome fury of the forest fawn!!");
                    }
                    if(this.ajaxCallback){
                        this.ajaxCallback.call(this,re);
                        this.ajaxCallback = null;
                    }
                }
            });
        },
        destroy:function(){
            this.data = null;
            $.each(this.doms,function(n,v){
                if(n !== "members"){
                    v && v.unbind().find("*").unbind();
                }else{
                    $.each(v,function(){
                        this.main.unbind().find("*").unbind();
                    });
                }
            });
            this.doms = null;
            this.timer && clearTimeout(this.timer);
            this.timer = null;
        },
        /*外部更新接口*/
        update:function(){}
    }

    liveblock.prototype.constructor = liveblock;

    return _Liveblock = {
        name:"the live box",
        init:function(config){
            return new liveblock(config);
        }
    }
});