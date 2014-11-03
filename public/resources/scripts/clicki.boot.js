define([],function(require){
    /*命名空间*/
    var Clicki = window.Clicki||{};

    function userWidgeti(){
        var that = this,cssName,idName;
        /*全局设定*/
        this.global = {
            date:new Date(),
            time:(new Date()).getDate(),
            domain:"www.clicki.cn",
            idPrefix:"theClickiWidget_",
            site_id:10004,
            position:"br",
            width:300,
            height:300,
            style:"white"
        };
        this.global.idName=this.global.idPrefix+this.global.site_id+"_"+Math.round(Math.random()*1000000);
        idName = this.global.idPrefix+this.global.site_id;
        cssName = "#"+this.global.idName;

        /*cookie字段名设定*/
        this.cookieStr = {
            visit:"__c_visit",
            visitor:"__c_visitor",
            today:"__c_today"
        };

        /*缓存对象*/
        this.cache = {
            userDom:{
                head:$("head:first"),
                smallWidget:false,
                widgetBox:false,
                widgetFrame:false
            },
            widgetDom:{
                widgetShower:false
            },
            data:{"referer":null,"client":null,"page":null,"visitor":null,"visit":{"get_load_time" : function(){
                    var time = new Date().getTime(),load_time = time - that.global.date.getTime();
                    this.load_tme =  load_time;
                    delete(this.get_load_time);
            }},"live":null},
            fixClass:{"lt":false,"lm":"","lb":"","bl":"","bm":"","br":"","rt":"","rm":"","rb":""},
            xTpl:"<div id=\""+this.global.idName+"\" class=\"theClickiWidget_skin_setting widgetP_"+this.global.position+"\"><div class=\"smallWidget\"><div></div></div><div class=\"widgetBox\"><div><iframe id=\"iframe_"+this.global.idName+"\" src=\"/resources/temp/widgetTable.html\" allowtransparency=\"true\"></iframe></div><p>Powered By <a href=\"http://"+this.global.domain+"/\" target=\"_blank\">Clicki.cn</a></p></div></div>"
        };



        /*初始化*/
        this.init();
    }

    userWidgeti.prototype = {
        /*初始化*/
        init:function(){
            var that = this;
            $(function(){

                var Css = document.createElement("link");
                Css.id="style_"+that.global.idName;
                Css.type="text/css";
                Css.rel = "stylesheet";
                Css.href= "/resources/styles/skin/theme_"+that.global.style+".css";
                that.cache.userDom.head[0].appendChild(Css);
                that.model.init.call(that);
            });
            $(window).bind("load",function(){
                if(that.cache.data.visit.get_load_time){
                    that.cache.data.visit.get_load_time();
                }
            });

        },
        /*外部用户调用接口*/
        interface:function(){
            var _data = this.cache.data,that = this,
                    domCache= this.cache.userDom,
                    domId = this.global.idName;
            var show = this.control.maximize,hide = this.control.minimize,reSet = this.control.reSetWidget;

            return {
                id:domId,
                getData:function(){return _data;},
                setWidgetStyle:function(){},
                getWidgetDom:function(){return domCache;},
                maximize:function(){show.call(that)},
                minimize:function(){hide.call(that)},
                reset:function(re){reSet.call(that,re)},
                hideWidget:function(){
                    domCache.widgetOutterBox.hide();
                },
                showWidget:function(){
                    domCache.widgetOutterBox.show();
                },
                destroy:function(){
                    delete Clicki.userWidget;
                }
            }
        },
        /*cookie操作*/
        cookie:function(){
            var d = new Date(),
			a = arguments,l=a.length;
			if (l > 1) {
				var e = a[2] || 0, p = a[3] || '/', dm = a[4] || 0, se = a[5] || 0;
				if (e) d.setTime(d.getTime() + (e * 1000));
				document.cookie = a[0] + "=" + escape(a[1]) + (e ? ("; expires=" + d.toGMTString()) : "") + ("; path=" + p) + (dm ? ("; domain=" + dm) : "") + (se ? "; secure" : "");
				return a[1];
			}else{
				var v = document.cookie.match('(?:^|;)\\s*' + a[0] + '=([^;]*)');
				return v ? unescape(v[1]) : 0
			}
        },
        /*鼠标坐标*/
        mouseXY:function(){
            if(e.pageX || e.pageY){
				return {x:e.pageX, y:e.pageY};
			}
			return {
				x:e.clientX + $(document).scrollLeft() - document.body.clientLeft,
				y:e.clientY + $(document).scrollTop() - document.body.clientTop
			};
        },
        /*尺寸*/
        pageSize:function(){
            var xScroll,yScroll,dBody = document.body,ddElenet = document.documentElement,pageHeight,pageWidth,windowWidth,windowHeight;
            if(window.innerHeight&&(window.scrollMaxY||window.scrollMaxY)){
                xScroll=window.innerWidth+window.scrollMaxX-17;
                yScroll=window.innerHeight+window.scrollMaxY-17
            }else if(dBody.scrollHeight>dBody.offsetHeight){
                xScroll=dBody.scrollWidth;
                yScroll=dBody.scrollHeight
            }else{
                xScroll=dBody.offsetWidth;
                yScroll=dBody.offsetHeight
            }
            if(self.innerHeight){
                if(ddElenet.clientWidth){
                    windowWidth=ddElenet.clientWidth
                }else{
                    windowWidth=self.innerWidth
                }
                windowHeight=self.innerHeight
            }else if(ddElenet&&ddElenet.clientHeight){
                windowWidth=ddElenet.clientWidth;
                windowHeight=ddElenet.clientHeight
            }else if(dBody){
                windowWidth=dBody.clientWidth;
                windowHeight=dBody.clientHeight
            }
            if(yScroll<windowHeight){
                pageHeight=windowHeight
            }else{
                pageHeight=yScroll
            }
            if(xScroll>windowWidth){
                pageWidth=xScroll
            }else{
                pageWidth=windowWidth
            }
            return [pageWidth,pageHeight,windowWidth,windowHeight]
        },
        randIframe:function(b,c){//b:iframe_id, c:html
			var e=0, a=window;
            try {
                var f;
                try {
                    f = !!a.document.getElementById(b).contentWindow.document
                } catch(ta) {
                    f = !1
                }
                if (f) {
                    var r = a.document.getElementById(b).contentWindow,
                    l = r.document;
                    if (!l.body || !l.body.firstChild) l.open();
                    l.write(c);
                } else {
                    var y = a.document.getElementById(b).contentWindow,
                    o;
                    f = c;
                    f = String(f);
                    if (f.quote) o = f.quote();
                    else {
                        r = ['"'];
                        for (l = 0; l < f.length; l++) {
                            var m = f.charAt(l),
                            Ga = m.charCodeAt(0),
                            nb = r,
                            ob = l + 1,
                            ha;
                            if (! (ha = k[m])) {
                                var C;
                                if (Ga > 31 && Ga < 127) C = m;
                                else {
                                    var p = m;
                                    if (p in n) C = n[p];
                                    else if (p in k) C = n[p] = k[p];
                                    else {
                                        var v = p,
                                        w = p.charCodeAt(0);
                                        if (w > 31 && w < 127) v = p;
                                        else {
                                            if (w < 256) {
                                                if (v = "\\x", w < 16 || w > 256) v += "0"
                                            } else v = "\\u",
                                            w < 4096 && (v += "0");
                                            v += w.toString(16).toUpperCase()
                                        }
                                        C = n[p] = v
                                    }
                                }
                                ha = C
                            }
                            nb[ob] = ha
                        }
                        r.push('"');
                        o = r.join("")
                    }
                    y.location.replace("javascript:" + o)
                }
                e = !0
            } catch(ub) {
				//
            }
		},
        /*UA*/
        UA:function(){
            var ua = navigator.userAgent.toLowerCase(),tmp;
            return {
                "ie":(tmp = ua.match(/msie ([\d.]+)/))?tmp[1]:false,
                "ff":(tmp = ua.match(/firefox\/([\d.]+)/))?tmp[1]:false,
                "chrome":(tmp = ua.match(/chrome\/([\d.]+)/))?tmp[1]:false,
                "opera":(tmp = ua.match(/opera.([\d.]+)/))?tmp[1]:false,
                "safari":(tmp = ua.match(/version\/([\d.]+).*safari/))?tmp[1]:false
            };
        }(),
        /*JSON操作*/
        JSON:function(){
            if(window.JSON !== undefined){return JSON;}
            function f(n) {
				return n < 10 ? '0' + n: n
			}

			var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g,
                gap,
                indent,
                meta = {
                    '\b': '\\b',
                    '\t': '\\t',
                    '\n': '\\n',
                    '\f': '\\f',
                    '\r': '\\r',
                    '"': '\\"',
                    '\\': '\\\\'
                },
                rep;

            function quote(string) {
                return escapeable.test(string) ? '"' + string.replace(escapeable,
                function(a) {
                    var c = meta[a];
                    if (typeof c === 'string') {
                        return c
                    }
                    c = a.charCodeAt();
                    return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16)
                }) + '"': '"' + string + '"'
            }

            function str(key, holder) {
                var i,
                k,
                v,
                length,
                mind = gap,
                partial,
                value = holder[key];
                if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
                    value = value.toJSON(key)
                }
                if (typeof rep === 'function') {
                    value = rep.call(holder, key, value)
                }
                switch (typeof value) {
                case 'string':
                    return quote(value);
                case 'number':
                    return isFinite(value) ? String(value) : 'null';
                case 'boolean':
                case 'null':
                    return String(value);
                case 'object':
                    if (!value) {
                        return 'null'
                    }
                    gap += indent;
                    partial = [];
                    if (typeof value.length === 'number' && !(value.propertyIsEnumerable('length'))) {
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null'
                        }
                        v = partial.length === 0 ? '[]': gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']': '[' + partial.join(',') + ']';
                        gap = mind;
                        return v
                    }
                    if (typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            k = rep[i];
                            if (typeof k === 'string') {
                                v = str(k, value, rep);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ': ':') + v)
                                }
                            }
                        }
                    } else {
                        for (k in value) {
                            v = str(k, value, rep);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ': ':') + v)
                            }
                        }
                    }
                    v = partial.length === 0 ? '{}': gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}': '{' + partial.join(',') + '}';
                    gap = mind;
                    return v
                }
            }

            return {
                stringify: function(value, replacer, space) {
                    var i;
                    gap = '';
                    indent = '';
                    if (space) {
                        if (typeof space === 'number') {
                            for (i = 0; i < space; i += 1) {
                                indent += ' '
                            }
                        } else if (typeof space === 'string') {
                            indent = space
                        }
                    }
                    if (!replacer) {
                        rep = function(key, value) {
                            if (!Object.hasOwnProperty.call(this, key)) {
                                return undefined
                            }
                            return value
                        }
                    } else if (typeof replacer === 'function' || (typeof replacer === 'object' && typeof replacer.length === 'number')) {
                        rep = replacer
                    } else {
                        throw new Error('JSON.stringify')
                    }
                    return str('', {
                        '': value
                    })
                },
                quote: quote
            }

        }(),
        model:{
            init:function(){
                this.model.setData.call(this);
                this.model.sendData.call(this);
                this.view.showLive.call(this);
            },
            /*数据获取*/
            setData:function(){
                for(var n in this.cache.data){
                    innerModel[n].call(this);
                }
            },
            /*发送数据*/
            sendData:function(){
                var str = encodeURIComponent(this.JSON.stringify(this.cache.data.visit));
				/*this.cache.userDom.head.append('<img src="http://'+this.global.domain+'/refer/track.php?data='+str+'"/>');*/
            },
            /*设定行为数据*/
            setAction:function(){},
            /*获取行为数据*/
            getAction:function(){},
            /*发送行为数据*/
            sendAction:function(){}
        },
        view:{
            showLive:function(){
                var model = this.cache.data.live,that = this;
				$('body').append(this.cache.xTpl);

                this.cache.userDom.widgetOutterBox = $("#"+this.global.idName);
                this.cache.userDom.smallWidget = this.cache.userDom.widgetOutterBox.find(".smallWidget:first div:first");
                this.cache.userDom.widgetBox = this.cache.userDom.widgetOutterBox.find(".widgetBox:first");
                this.cache.userDom.widgetFrame = this.cache.userDom.widgetBox.find("iframe:first");

                this.view.setPosition.call(this);

				this.cache.userDom.smallWidget.hover(
					function() {
						var _state =that.cache.userDom.smallWidget.attr('state');
                        _state = _state=="on"?true:false;
                        if(_state){return;}
                        switch(that.global.position){
                            case "bl":case "bm":case "br":
                                that.cache.userDom.widgetOutterBox.animate({
                                    bottom:"-"+(that.global.height-28)+"px"
                                },140);
                            break;

                            case "lt":case "lm":case "lb":
                                that.cache.userDom.widgetOutterBox.animate({
                                    left:"-"+(that.global.width-8)+"px"
                                },140);
                            break;

                            case "rt":case "rm":case "rb":
                                that.cache.userDom.widgetOutterBox.animate({
                                    right:"-"+(that.global.width-8)+"px"
                                },140);
                            break;
                        }
					},function() {
						var _state = that.cache.userDom.smallWidget.attr('state');
                        _state = _state=="on"?true:false;
                        if(_state){return false;}
                        switch(that.global.position){
                            case "bl":case "bm":case "br":
                                that.cache.userDom.widgetOutterBox.animate({
                                    bottom:"-"+(that.global.height-24)+"px"
                                },140);
                            break;

                            case "lt":case "lm":case "lb":
                                that.cache.userDom.widgetOutterBox.animate({
                                    left:"-"+(that.global.width-4)+"px"
                                },140);
                            break;

                            case "rt":case "rm":case "rb":
                                that.cache.userDom.widgetOutterBox.animate({
                                    right:"-"+(that.global.width-4)+"px"
                                },140);
                            break;
                        }
					}
				).click(function() {
                   that.cache.userDom.widgetOutterBox.stop();
                   var _tbs = that.cache.userDom.smallWidget.attr("state");
                    if (_tbs == "on") {
                        that.cache.userDom.smallWidget.removeClass();
                        that.control.minimize.call(that);
                    }else{
                        that.cache.userDom.smallWidget.removeClass().addClass("maximized");
                        that.control.maximize.call(that);
                    }

				});

                if(this.UA.ie == "6.0"){

                    that.cache.userDom.widgetOutterBox.css("position","absolute");
                    var tmp = false,newTmp = 0,that= this,defOt = that.cache.userDom.widgetOutterBox.offset().top;
                    $(window).bind("scroll",function(){
                        newTmp = 0;
                        tmp = false;
                        var newTop,ddeS = document.documentElement.scrollTop;
                        newTop = defOt+ddeS;
                        that.cache.userDom.widgetOutterBox.stop(true);
                        that.cache.userDom.widgetOutterBox.animate({top:newTop},300);
                    });

                }

            },
            setPosition:function(re){

                if(re && typeof(re) === "string"){
                    this.global.position = re;
                    this.cache.userDom.widgetOutterBox.attr("style","");
                }

                if(!this.cache.fixClass.lt){
                    var tmpArr = ["<style>"],tmpStr = "";
                    for(var n in this.cache.fixClass){
                        this.cache.fixClass[n] = this.global.idName+"_"+n;
                        switch(n){
                            case "bl":case "bm":case "br":
                                this.global.height = this.global.height?this.global.height:this.cache.userDom.widgetBox.outerHeight();
                                tmpStr = "."+this.cache.fixClass[n] +"{width:"+this.global.width+"px;_height:auto;}";
                            break;

                            case "lt":case "lm":case "lb":
                                this.global.height = this.global.height?this.global.height:this.cache.userDom.widgetBox.outerHeight();
                                tmpStr = "."+this.cache.fixClass[n] +"{width:"+(this.global.width-8)+"px;left:-"+(this.global.width-4)+"px;height:"+this.global.height+"px}";
                            break;

                            case "rt":case "rm":case "rb":
                                this.global.height = this.global.height?this.global.height:this.cache.userDom.widgetBox.outerHeight();
                                tmpStr = "."+this.cache.fixClass[n] +"{width:"+(this.global.width-8)+"px;right:-"+(this.global.width-4)+"px;height:"+this.global.height+"px}";
                            break;
                        }
                        tmpArr.push(tmpStr);
                    }
                    tmpArr.push("</style>");
                    tmpArr = tmpArr.join("");
                    this.cache.userDom.head.append(tmpArr);
                    tmpArr = null;
                }

                var nowPosCls = this.cache.fixClass[this.global.position];

                this.cache.userDom.widgetOutterBox.attr("class",function(){
                    var oldCls = this.className.split(" "),len;
                    len = re?oldCls.length-1:oldCls.length;
                    oldCls = oldCls.slice(0,len);
                    oldCls.push(nowPosCls);
                    return ""+oldCls.join(" ");
                });
            }
        },
        control:{
            maximize:function(){
                var widgetFrame = this.cache.userDom.widgetFrame;
                if(!widgetFrame.attr("state")){
                    widgetFrame.attr("state", "on");
                    /*widgetFrame[0].contentWindow.init();*/
                }
                this.cache.userDom.smallWidget.attr("state", "on");

                switch(this.global.position){
                    case "bl":case "bm":case "br":

                        //this.cache.userDom.widgetBox.show();

                        if(this.UA.ie == "6.0"){
                            var dh = $("body:first").height(),wh = $(window).height(),ddeS = document.documentElement.scrollTop,newTop;
                            newTop = wh-308+ddeS;
                            newTop = newTop > dh -308?( dh -308): newTop;
                            this.cache.userDom.widgetOutterBox.animate({
                                top:newTop
                            },300);
                        }else{
                            this.cache.userDom.widgetOutterBox.animate({
                                bottom:0
                            },300);
                        }

                        this.cache.userDom.widgetBox.animate({
                            height:272
                        },300);
                    break;

                    case "lt":case "lm":case "lb":
                        this.cache.userDom.widgetBox.height(272);
                        this.cache.userDom.widgetOutterBox.animate({
                            left:0
                        },300);
                    break;

                    case "rt":case "rm":case "rb":
                        this.cache.userDom.widgetBox.height(272);
                        this.cache.userDom.widgetOutterBox.animate({
                            right:0
                        },300);
                    break;
                }

            },
            minimize:function(){
                this.cache.userDom.smallWidget.attr("state", "off");
                switch(this.global.position){
                    case "bl":case "bm":case "br":

                        if(this.UA.ie == "6.0"){
                            var dh = $("body:first").height(),wh = $(window).height(),ddeS = document.documentElement.scrollTop,newTop,that = this;
                            newTop = wh-28+ddeS;
                            newTop = newTop > dh -28?( dh -28): newTop;
                            this.cache.userDom.widgetOutterBox.animate({
                                top:newTop
                            },300);
                        }else{
                            this.cache.userDom.widgetOutterBox.animate({
                                bottom:"-"+(this.global.height-24)+"px"
                            },300,function(){
                                $(this).removeAttr("style");
                            });
                        }
                        this.cache.userDom.widgetBox.animate({
                            height:0
                        },300);
                    break;

                    case "lt":case "lm":case "lb":
                        this.cache.userDom.widgetOutterBox.animate({
                            left:"-"+(this.global.width-4)+"px"
                        },300,function(){
                            $(this).removeAttr("style");
                        });
                    break;

                    case "rt":case "rm":case "rb":
                        this.cache.userDom.widgetOutterBox.animate({
                            right:"-"+(this.global.width-4)+"px"
                        },300,function(){
                            $(this).removeAttr("style");
                        });
                    break;
                }
            },
            reSetWidget:function(re){
                this.view.setPosition.call(this,re);
            }
        }
    };

    var innerModel = {
        visit:function(){
            var visit_id = 0,
                new_visit=0,
                referer = '',
                type=0,
                pv = 0,
                review = 0,
                that = this;

            visit_id = this.cookie(this.cookieStr.visit);
            if(!visit_id){
                /*visit_id = '{{millisecond}}';*/
                /*模拟*/
                visit_id = this.global.date.getTime()*1000 +  this.global.date.getMilliseconds();
                new_visit = 1;
            }

            if(new_visit){
                if(this.cache.data.visitor.is_new){
                    /*新访问*/
                    type = 1;
                }else{
                    /*回访*/
                    type = 2;
                    review = 1;
                }
            }

            this.cookie(this.cookieStr.visit, visit_id);

            this.cache.data.visit = {
                 id : visit_id,
                new_visit:new_visit,
                review:review,
                site_id : this.global.site_id,
                time : this.global.time,
                visitor: this.cache.data.visitor,
                referer:  this.cache.data.referer,
                client:  this.cache.data.client,
                page:  this.cache.data.page,
                type : type
            }
        },
        live:function (){
            this.cache.data.live =  {
                id:this.global.site_id,
                static:'http://'+this.global.domain+'/static/widget/live/',
                url:'http://'+this.global.domain+'/widget/live/'+this.global.site_id+'/'+document.domain,
                template:'http://'+this.global.domain+'/widget/live/'+this.global.site_id,
                interval:10000,
                width:300,
                height:300,
                show:false,
                position:'bottom-right',
                get:function(){
                    $('head').append('<script src="'+this.url+'"></script>');
                    this.load(__clicki_live_data);
                },
                load:function(data){
                    this.data = data;
                }
            }
        },
        visitor:function (){
            var is_new=0, visitor_id = 0, enp = '';
            var is_new_visitor,is_new_ip,
            get_user_id = function(){
                //TODO:get user id
            },
            get_username = function(){
                //TODO:get username
            },
            get_gender = function(){
                //TODO:get gender
            };

            /*访问者id相关设定*/
            visitor_id = this.cookie(this.cookieStr.visitor);
            if(!visitor_id){
                /*visitor_id = '{{visitor_id}}';*/
                visitor_id = this.global.date.getTime()*1000 + this.global.date.getMilliseconds();
                is_new = 1;
            }
            this.cookie(this.cookieStr.visitor, visitor_id, 360000000);

            /*访问者IP？*/
            if(this.cookie(this.cookieStr.today)){
                is_new_ip = false;
            }else{
                this.cookie(this.cookieStr.today, 1, 86400);
                is_new_ip = true;
            }

            this.cache.data.visitor = {
                id : visitor_id,
                is_new: is_new,
                new_ip : is_new_ip
            }
        },
        client:function (){
            this.cache.data.client = {
                agent:navigator.userAgent,
                platform:'',
                browser:'',
                os:'',
                screen:{width:screen.width, height:screen.height}
            };
        },
        page:function (){
            this.cache.data.page = {
                url:location.href,
                domain:document.domain,
                title:document.title,
                size:this.pageSize()
            };
        },
        referer:function (r){
            r = r?r:document.referrer;
            this.cache.data.referer = {
                url:r
            };
        }
    };

    Clicki.userWidget = function(){
        var widget = new userWidgeti();
        return widget.interface();
    }();

    window.Clicki = Clicki;
});
