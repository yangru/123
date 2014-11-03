(function(sid){

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
					if(!$Clicki[a[0]]){
						$Clicki[a[0]] = a[1];
                        !!Clicki && (Clicki[a[0]] = a[1]);
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
        Balance:function(o){
            /*默认值，采用默认值则是控制导航与主显示区域的高度*/
            var Default = {"tagArr":["#imNav","#imOutterArea"],"footer":"#theFooter"};
            var o = o||Default;
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
                    num.push(tmpArr[i].height());
                }
                /*获取最大高度*/
                bigger = num.Max();
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
            delete(o);
        },
        Queue:function(fn,delay){
            var delay = delay?delay:300;
            setTimeout(fn,delay);
        },
        /*必要js文件加载*/
        jsFilesLoader:function(arr,fn,scope){
            //TODO 增加强制同步加载选项

            /*选择性加载脚本地址*/
            var jsUrl = {
                "swfobject":"/resources/scripts/swfobject.js",
                "swfobject_modified":"/resources/scripts/swfobject_modified.js",
                "JSON":"/resources/scripts/json2.js",
                "jQuery":"/resources/scripts/jquery-1.5.1.min.js",
                "ui":"/resources/scripts/jquery-ui-1.8.14.custom.min.js",
                "datepicker":"/resources/scripts/clicki.datepicker.js",
                "fancybox":"/resources/scripts/fancybox/jquery.fancybox_1.3.4.pack.js",
                "userWidget":"/resources/scripts/clicki.boot.js"
            }

            var load = arr.length,need = 0,loaded = 0,timer;
            var _fn = fn,_s = scope;
            
            for(var i =0;i<load;i++){
                var name = arr[i],n,root = window;
                name = name.split(".");
                n = name.length;
                for(var k = 0;k<n;k++){
                    if(root[name[k]] === undefined && jsUrl[name[k]]){
                        need +=1;
                        $.getScript(jsUrl[name[k]],function(){
                            loaded+=1;
                            if(loaded === need && _fn && _s){
                                _fn.call(_s);
                            }
                        });
                    }
                    if(root[name[k]]){
                        root = root[name[k]];
                    }
                }
            }

            /*页面已经存在的话则直接执行*/
            if(need === 0 && loaded ===0 && fn && scope){
                fn.call(scope);
                return true;
            }

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
                year:0,mouth:0,day:0,format:"yy-mm-dd",date:""
            }
            if(object){
                object.year && (o.year = object.year);
                object.mouth && (o.mouth = object.mouth);
                object.day && (o.day = object.day);
                object.format && (o.format = object.format);
                object.date && (o.date = object.date);
            }
            var dd = new Date();
            function StringToDate(DateStr) {
                var converted = Date.parse(DateStr);
                var myDate = new Date(converted);
                if (isNaN(myDate)) {
                    var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';
                    var arys = DateStr.split(delimCahar);
                    myDate = new Date(arys[0], --arys[1], arys[2]);
                }
                return myDate;
            }
            /*这种处理方式不能在ie上，原因不详*/
            /*o.date && (dd = new Date(o.date));*/
            o.date && (dd = StringToDate(o.date));
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
       /* exportList:function (o){
            var url,site,parm;
            if(!o.url || !o.parm){
                return;
            }
            var url = o.url;
            var parm = o.parm;
            parm.limit = 10000;
            parm["export"] = 1;
            *//*if(url && url.charAt( url.length-1) != "/"){
                url += "/";
            }*//*
            window.open( url + "?" + $.param(parm));
        },*/
        cookie:function() {
            var d = new Date(),
            a = arguments,l = a.length;
            if (l > 1) {
                var e = a[2] || 0, p = a[3] || '/', dm = a[4] || 0, se = a[5] || 0;
                if (e) d.setTime(d.getTime() + (e * 1000));
                var tmp = a[0] + "=" + escape(a[1]) + (e ? ("; expires=" + d.toGMTString()) : "") + ("; path=" + p) + (dm ? ("; domain=" + dm) : "") + (se ? "; secure" : "");
                document.cookie = tmp;
                return a[1];
            } else {
                var v = document.cookie.match('(?:^|;)\\s*' + a[0] + '=([^;]*)');
                return v ? unescape(v[1]) : 0
            }
        }
	};
	/*追加*/
	$Clicki.expand($Clicki,Fn);
	$Clicki.Method.Instantiated.prototype = $Clicki.Method;
	$Clicki.ready = true;

    if(window.Clicki !== undefined){
        window.console && console.warn("命名空间已存在，请确认是否有重复加载。");
        if($){
            $.extend(true,window.Clicki,$Clicki);
        }
        /*
        $Clicki.expand(window.Clicki,$Clicki);
        */
    }else{
        window.Clicki = $Clicki;
    }

})();

/*暂且在这里用个全局变量， 在整合的时候需要去掉。*/
/*
(function(){
    window.site_id = 11410,
    window.begindate = "2011-08-25",
    window.enddate = "2011-08-27";
})();*/
