define(function(require, exports, module) {
        if(window.Clicki !== undefined){
            window.console &&console.warn("命名空间已存在，请确认是否有重复加载。");
        };
        var $Clicki = function(tag,manner){},
        RA,
        toStr = Object.prototype.toString,
        author = "EdwinChen",
        Nv = "0.1";
        $Clicki.Browser = document.all?"IE":"FF";
        $Clicki.isIE = document.all?true:false;
        $Clicki.isFF = (window.XMLHttpRequest && navigator.appName === "Netscape")?true:false;
        /*当前激活模块。*/
        $Clicki.active = {};
        /*框架加载状态*/
        $Clicki.ready = false;
        /*模板*/
        $Clicki.Template = {};
        /*缓存对象*/
        $Clicki.cache = {};
        /**/
        $Clicki.doing = [];
        $Clicki.going = false;

        /*
        数组相关操作。作为Array类的派生类。外部也可以直接调用
        最大
        */
        Array.prototype.Max = function() {
            return Math.max.apply({},this);
        };
        /*最小*/
        Array.prototype.Min = function() {
            return Math.min.apply({},this);
        };
        /*数据类型判断*/
        function chker(o,type){
            return toStr.call(o) === "[object "+type+"]";
        };

        function getEl(id, el) {
            if (!id) {
                return false;
            }

            var tag, type = typeof (id), nt = id.nodeType;

            if (id && !el) {
                /*返回指定的html对象;*/
                tag = type === "string" ? document.getElementById(id) : (nt !== undefined) ? id : false;
                return tag;

            } else if (id && el && typeof (el) === "string") {
                /*返回某个id或html标签中包含的制定类型的标签集合*/
                tag = type === "string" ? document.getElementById(id).getElementsByTagName(el) : (nt !== undefined) ? id.getElementsByTagName(el) : false;
                return tag;

            }
        };

        /*这个主要为对象操作的方法集，不在此方法集中的方法为直接引用型的。如MY.expand是直接调用的。*/
        $Clicki.Method = $Clicki.prototype  = {
            Instantiated: function(tags,manner){
                var tag = tags;
            }
        };
        $Clicki.expand  = function(){

            var a = arguments,len = a.length,s = this,ss = $Clicki.expand;
            if(len === 0){
                    return false;
                }else{

                    if(len === 1 &&chker(a[0],"Object")){
                        for(var i in a[0]){
                            /*只能扩展方法,不能覆盖已有的对象,参数类型必须为function*/
                            if(chker(a[0][i],"Function") && s[i] === undefined){
                                s[i] = a[0][i];
                            }
                        }
                    }else if(len === 2 && chker(a[1],"Object")){
                        for(var i in a[1]){
                            if(a[0] === $Clicki){
                                $Clicki[i] = a[1][i];
                            }else if(!chker(a[0],"Function")){
                                a[0][i] = a[1][i];
                            }
                        }
                    }else{
                        if(!s[a[0]]){
                            s[a[0]] = a[1];
                        }
                    }
                }
        };
        /*外部可直接调用的函数集*/
        var Fn = {
            NSregister:function(n){
                /*命名空间不允许存在空格*/
                var White = n.match(trimExp)===null?0:n.match(trimExp);
                if(!n || White.length > 0){
                    return false;
                }

                var nsList = n.split("."),i,root = $Clicki.Method;
                if(nsList.length === 1){
                    root[nsList[0]] = root[nsList[0]] || {};
                    return root[nsList[0]];
                }else{
                    for(i = 0;i<nsList.length;i++){
                        root[nsList[i]] = root[nsList[i]] || {};
                        root = root[nsList[i]];
                        if(i = nsList.length-1){
                            return root[nsList[i]];
                        }
                    }
                }
                nsList = null;
                root = null;
            },
            /*
                模板操作方法
                Clicki.XTpl("test","<div>{0}{1}{2}{3}{4}{5}</div>");
                Clicki.Template.test
            */
            XTpl:function(Xname,tpl){
                if((Xname && tpl) && (typeof(Xname) === "string" && typeof(tpl) === "string")){
                    this.Template[Xname] = tpl;
                }else{
                    alert(LANG("缺少参数或传入数据类型错误，第一个参数必须是String类型，第二个参数必须是String类型。"))
                }
            },
            test:function(){
                console.log(this);
                this.expand("doTest",function(){
                    console.log(this);
                });
                this.doTest();
            },
            /*获取html对象的方法外部接口*/
            getEl:function(id,el){
                return getEl(id,el);
            },
            /*
            格式化字符串
            var strr = Clicki.formatStr("<div>{0}{1}{2}{3}{4}</div>",["a","b","c","d","e"]);alert(strr);
            */
            formatStr:function(strTpl,dataArr){
                /*strTpl必须是string类型，dataArr必须是Array类型*/
                if(strTpl && typeof(strTpl) === "string" && dataArr && chker(dataArr,"Array")){
                    var str = strTpl,
                        aNum = str.match(/\{[0-9]*\}/g);
                    for(var i = 0;i < aNum.length;i++){
                        var tStr = "",
                            _i = aNum[i].match(/\d+/);
                        _i = parseInt(_i[0]);
                        tStr = str.replace(/\{[0-9]*\}/,dataArr[_i]);
                        str = tStr;
                    }
                    try{
                        return str;
                    }finally{
                        str = null;
                        //arr = null;
                    }
                }else{
                    alert(LANG("缺少参数或传入数据类型错误，第一个参数必须是String类型，第二个参数必须是Array类型。"))
                }
            },
            /* var arr = []; Clicki.isArr(arr);//true */
            isArr:function(o){
                return chker(o,"Array");
            },
            /* function a(){};Clicki.isFn(a);//true */
            isFn:function(o){
                return chker(o,"Function");
            },
            /* var s = 123; Clicki.isNum(s);//true */
            isNum:function(o){
                return chker(o,"Number");
            },
            /* var o = {}; Clicki.isObj(o);//true */
            isObj:function(o){
                return chker(o,"Object");
            },
            /* Clicki.arrMax([1,2,3]);//3 */
            arrMax:function(arr){
                var Max = isNaN(arr.Max())?LANG("数组内存在非数字类型的数据"):arr.Max();
                return Max;
            },
            /*Clicki.arrMax([1,2,3]);//1*/
            arrMin:function(arr){
                var Min = isNaN(arr.Min())?LANG("数组内存在非数字类型的数据"):arr.Min();
                return Min;
            },
            /*返回文档body。不能在初始化的时候做。加载的时候document.body为nll。执行一次后document.body被缓存。下面的jq检测同理*/
            xBody:function(){
                if(xBody === undefined || xBody === null){
                    xBody = document.body;
                }
                return xBody;
            },
            /*检查是否已经加载jq框架*/
            chkJQPack:function (){
                if(jQ === undefined){
                    jQ = (window.$ === undefined || window.jQuery === undefined)?false:true;
                    if(!jQ){
                        alert(LANG("查询不到jq框架，请检查页面"));
                    }
                    return jQ;
                }
                return jQ;

            },
            sideNav:function(o){
                var Default = {"id":"#imNav","titleEl":"strong","cls":"act",hoverCls:"liHover",hoverEl:"li","listEl":"Ul"};
                var o = o || Default,
                    tEl = o.titleEl,
                    actCls = o.cls,
                    overCls = o.hoverCls,
                   lEl = o.listEl,
                    hoverEls = $(o.id +" " + o.hoverEl),
                    isAct = null,
                    titles = $(o.id+" "+tEl),
                    lists = $(o.id+" "+lEl);
                $.each(hoverEls,function(){
                    $(this).bind("mouseover",function(event){
                        var el = $(this);
                        if(el.attr("class") === actCls){
                            return false;
                        }
                        el.addClass(overCls);
                         event.stopPropagation();
                    }).bind("mouseout",function(event){
                        $(this).removeClass(overCls);
                        event.stopPropagation();
                    });
                });
                $.each(titles,function(i,n){
                });
            },
            /*容器高度平衡*/
            Balance:function(o,more){
                /*默认值，采用默认值则是控制导航与主显示区域的高度*/
                var Default = {"tagArr":["#imNav","#imOutterArea"],"footer":"#theFooter"};
                var o = o||Default;
                var more = more || 0;
                /*最大值*/
                var bigger;
                /*临时缓存数组*/
                var tmpArr = [];
                /*页脚*/
                o.footer = o.footer?$(o.footer):false;
                var _sTop = $(document).scrollTop();
                /*设置函数*/
                function setting(){
                    var num = [0];
                    for(var i =0,len = tmpArr.length;i<len;i++){
                        tmpArr[i].attr("style","height:;")
                        num.push(tmpArr[i].height()+20);
                    }
                    /*获取最大高度*/
                    bigger = num.Max()+more;
                    /*赋值*/
                    for(var i =0,len = tmpArr.length;i<len;i++){
                        tmpArr[i].height(bigger);
                    }
                    window.scrollTo(0,_sTop);
                }
                /*循环*/
                for(var i = 0,len = o.tagArr.length;i<len;i++){
                    if(typeof(o.tagArr[i]) ==="string"){
                        tmpArr.push($(o.tagArr[i]));
                        if(i === len -1){
                            setting();
                        }
                    }else{
                        tmpArr = [];
                        for(var k = 0,ln = o.tagArr[i].length;k<ln;k++){
                            tmpArr.push($(o.tagArr[i][k]));
                            if(k === ln -1){
                                setting();
                            }
                        }
                    }
                }
                tmpArr = [];
                tmpArr = null;
                delete(o);
                /*console.log(arguments.callee);*/
            },
            Queue:function(fn,delay){
                var delay = delay?delay:300;
                setTimeout(fn,delay);
            },
        /*弹出层，Clicki.popLayout({id:"#test"})*/
        popLayout:function(o){

            if(o.id && $(o.id).length >0){
                var config = {href:o.id,scrolling:"no"};
                if(o.title){
                    config.title = o.title;
                }
                $.fancybox(config);
            }
        },
        getDateStr:function(object){
            var o = {
                year:0,mouth:0,day:0,format:"yy-mm-dd",date:false
            }
            if(object){
                object.year && (o.year = object.year);
                object.mouth && (o.mouth = object.mouth);
                object.day && (o.day = object.day);
                object.format && (o.format = object.format);
                object.date && (o.date = object.date);
            }
            var dd = window.todaydate?(Clicki.parseISO8601(window.todaydate)):(new Date());
            o.date && (dd = _.isDate(o.date)?new Date(o.date):Clicki.parseISO8601(o.date));
            dd.setYear(dd.getFullYear() + o.year);
            dd.setDate(dd.getDate() + o.day);
            dd.setMonth(dd.getMonth() + o.mouth);
            var y = dd.getFullYear();
            var m = dd.getMonth()+1;
            var d = dd.getDate();
            function checkTime(i){
                if (i<10){
                    i="0" + i;
                }
                return i;
            }
            return o.format.replace(/yy/g,y).replace(/mm/g,checkTime(m)).replace(/dd/g,checkTime(d));
        },
        parseISO8601:function(dateStringInRange) {
            var isoExp1 = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
                isoExp2 = /^\s*(\d{4})\/(\d\d)\/(\d\d)\s*$/,
                date = new Date(NaN), month, 
                parts = isoExp1.exec(dateStringInRange) || isoExp2.exec(dateStringInRange); 
         
            if(parts) { 
              month = +parts[2]; 
              date.setFullYear(parts[1], month - 1, parts[3]); 
              if(month != date.getMonth() + 1) { 
                date.setTime(NaN); 
              } 
            } 
            return date; 
        },
        clone:function(o){
            (function() {
                var toString = Object.prototype.toString,gObj = {},cloneHelper = function(cache, item) {
                    /// <summary>helper for Utils.clone</summary>
                    if ('object' == typeof item || Utils.isFunction(item)) {
                        for (var i = cache.length - 2; i >= 0; i -= 2) {
                            if (cache[i] == item)
                                return cache[i + 1]
                        }
                        cache.push(item, item = Utils.clone(item, cache))
                    }
                    return item
                };
                Utils = {
                    isFunction:function(it) {
                        /// <summary>判断参数是否为Function</summary>
                        /// <param name="it" type="Object">待判断的参数</param>
                        /// <returns type="Boolean" />
                        return toString.call(it) == '[object Function]';
                    },
                    clone:function(obj, cache) {
                        /// <summary>克隆一个对象</summary>
                        /// <param name="o" type="Object">要克隆的目标对象</param>
                        /// <returns type="Object" />
                        cache || (cache = []);
                        var clone,temp;
                        if (!obj || (!Utils.isFunction(obj) && typeof obj != 'object')) return o;
                        else if (obj.cloneNode) return o.cloneNode(true);//克隆DOM节点，绑定事件的有问题，暂不处理
                        else if (Utils.isFunction(obj)) clone = new Function('return ' + obj)(); //克隆function eval在当前作用域，Funtion在全局
                        else clone = (temp = obj.constructor,clone = new temp(obj.valueOf()),obj == clone) ? new temp() : clone; //克隆其它对象，通过识别复制后的对象与原对象是否相同来决定传不传参数，像数组是不能传参数的
                        cache.push(obj, clone);
                        for (temp in obj) if (gObj.hasOwnProperty.call(obj, temp)) clone[temp] = cloneHelper(cache, obj[temp]);//使用gObj.hasOwnProperty 防止对象obj重写了hasOwnProperty方法
                        return clone
                    }
                }
            })();
            return Utils.clone(o);
        },
        /*btnID 点击某个按钮就copy code
        * codestring 初始化时需要复制的code
        * getCodeFunc 如果需要及时更新要复制的 code， 需要指定一个获取code的函数，并返回该code
        * */
        copyCodeToClipboard:function(btnID,codestring,getCodeFunc){
            ZeroClipboard.setMoviePath( "/resources/flash_clipboard/ZeroClipboard.swf" );
            var clip = new ZeroClipboard.Client();
            clip.setHandCursor( true );
            clip.setText(codestring);
            clip.glue(btnID);
            clip.addEventListener( "complete", function(){
                $("#" + btnID).click();
            });
            if (getCodeFunc && typeof getCodeFunc == "function") {
                clip.addEventListener("mouseOver", function(client) {
                    var text = getCodeFunc.call();
                    client.setText(text);
                });
            }
        },
        exportList:function (o){
            if(!o.url || !o.site || !o.parm){
                return;
            }
            var url = o.url;
             var site = o.site;
            var parm = o.parm;
            if(url && url.charAt( url.length-1) != "/"){
                url += "/";
            }
            window.open( url + site + "?" + $.param(parm));
        },
        cookie:function() {
            var d = new Date(),
            a = arguments,l = a.length;
            if (l > 1) {
                var e = a[2] || 0, p = a[3] || '/', dm = a[4] || 0, se = a[5] || 0;
                if (e) d.setTime(d.getTime() + (e * 1000));
                //console.log();
                var tmp = a[0] + "=" + escape(a[1]) + (e ? ("; expires=" + d.toGMTString()) : "") + ("; path=" + p) + (dm ? ("; domain=" + dm) : "") + (se ? "; secure" : "");
                document.cookie = tmp;
                return a[1];
            } else {
                var v = document.cookie.match('(?:^|;)\\s*' + a[0] + '=([^;]*)');
                return v ? unescape(v[1]) : 0
            }
        },
         /*复制*/
		clipboardRender:function(obj,callback){

            if(window.swfobject === undefined && Clicki.isFn(require)){
                require("swfobject");
            }else{
                if(window.swfobject === undefined){
                    console && console.log(LANG("缺少 swfobject。"));
                    return false;
                }
            }
            obj.tipEl = obj.tipEl || "copied_tips";
			if($("#"+obj.tipEl)) $("#"+obj.tipEl).empty().hide();
            window.copySuccess = function(){
				if($("#"+obj.tipEl).length){
                    $("#"+obj.tipEl).empty().text(LANG("复制成功! 请把代码粘贴在你的网站！")).show();
                }else{
                    $("#"+obj.tipEl) = "<div id='copied_tips' style='color:red;text-align:center;display:none;'></div>";
                    $("#"+obj.targetEl).parent().before($("#"+obj.tipEl));
                    $("#"+obj.tipEl).show();
                };
            };
			var copy_text = $("#" + obj.textEl).val();
			var flashvars = {
				content: encodeURIComponent(copy_text),
				uri: RESBU + 'images/flash_copy_btn.png'
			};
			var params = {
				wmode: "transparent",
				allowScriptAccess: "always"
			};
			var width = obj.width ? obj.width : 130;
			var height = obj.height ? obj.height : 30;
			var exp = RESBU + "flash_chart/expressInstall.swf";
			swfobject.embedSWF(RESBU + "flash/clipboard.swf", obj.targetEl, width, height, "10.0.0", exp, flashvars, params);
			if ($("#clickiCopyCode")){
				$("#clickiCopyCode").bind("click", function(){
					if ( window.clipboardData){
						window.clipboardData.clearData();
						window.clipboardData.setData('Text', copy_text);
                        copySuccess();
					} else {
						$("#"+obj.tipEl).css({width:'38em',margin:'0 auto',color:'red','text-align':'center',padding:'5px'}).html(LANG('你当前使用的浏览器不支持，请升级你的flash player或者使用 Ctrl + C 手动复制！<br/>升级地址 <a href="http://get.adobe.com/cn/flashplayer/">http://get.adobe.com/cn/flashplayer</a>')).show(500);
					}
				});
			}
		},
        getTemplate: function(module, tpl){
            if (!module) return false;
            tpl || (tpl = arguments.callee.caller.toString());

            var tag = '** MODULE_TEMPLATE **';
            var pos = tpl.indexOf('/' + tag + '\\');
            if (pos == -1) return false;
            tpl = tpl.substr(pos + tag.length + 2);
            pos = tpl.indexOf('\\' + tag + '/');
            if (pos == -1) return false;
            tpl = tpl.substr(0, pos);

            tag = /<!--\[\[ ([a-z0-9_]+) \]\]-->(?:\r\n|\n)?/ig;
            var lang = /\{\% (.+?) \%\}/g;

            function lang_replace(full, text){
                return LANG(text);
            }

            var list = {};

            while ((m = tag.exec(tpl)) != null){
                var pos = tpl.lastIndexOf('<!--[[ /' + m[1] + ' ]]-->');
                if (pos <= tag.lastIndex) continue;

                if (tpl.charAt(pos-1)== '\n'){
                    if (tpl.charAt(--pos-1)== '\r') pos--;
                }
                var name = m[1];
                var code = tpl.substring(tag.lastIndex, pos).replace(lang, lang_replace);

                // 插入样式
                if (name == 'STYLE_CSS'){
                    name = 'MODULE_STYLE_' + module.toUpperCase();
                    if (!document.getElementById(name)){
                        var style = document.createElement('style');
                        style.type = 'text/css';
                        style.media = 'screen';
                        style.type = 'text/css';
                        style.id = name;
                        if (style.styleSheet) {
                            style.styleSheet.cssText = code;
                        } else {
                            style.innerHTML = code;
                        }
                        document.getElementsByTagName('head')[0].appendChild(style);
                    }
                }else {
                    list[name] = code;
                }
                tpl.lastIndex = pos + 13;
            }
            return list;
        }
	};
        /*追加*/
    $Clicki.expand($Clicki,Fn);
    $Clicki.Method.Instantiated.prototype = $Clicki.Method;
    $Clicki.ready = true;
    if(window.Clicki){
        for(var n in $Clicki){
            window.Clicki[n] = $Clicki[n];
        }
        window.Clicki = window.Clicki;
    }else{
        window.Clicki = $Clicki;
    }

})




/*暂且在这里用个全局变量， 在整合的时候需要去掉。*/
/*
(function(){
    window.site_id = 11410,
    window.begindate = "2011-08-25",
    window.enddate = "2011-08-27";
})();*/
