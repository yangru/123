(function(factory){
    /*简单的模块化*/
    if (typeof define === 'function') {
        define([], factory);
    } else {
        factory();
    }
})(function(){

     /*默认参数*/
    var _D = {
        height:"300px",
        width:"100%",
        swfUrl:"/resources/flash_chart/open-flash-chart.swf",
        id:"",
        ver:"9.0.0",
        exp:"/resources/flash_chart/expressInstall.swf",
        flashvars:{"data-file":"/resources/scripts/empty.json"}
    };

    /*chart默认设置*/
    var defaultChartSetting = {

        "global":{
            "bg_colour": "#FFFFFF",
            "y_axis": { "min": 0,"colour": "#D6D7D4", "tick-length": 2,"steps":10, "stroke": 1, "grid-colour": "#EBEBEB" },
            "x_axis": {
                "colour": "#D6D7D4",
                "grid-colour": "#EBEBEB",
                "stroke": 1,
                "tick-height":5
            },
            "elements":null
        },
        "area":{
            "type": "area",
            "dot-style": {
                "type": "solid-dot",
                "dot-size": 4,
                "halo-size": 1,
                "colour": "#0C73C2"
            },
            "width": 2,
            "font-size": 12,
            "colour": "#0C73C2",
            "fill": "#BFE7FF",
            "fill-alpha": 0.4
        },
        "line":{
            "type": "line",
            "dot-style": {
                "type": "solid-dot",
                "dot-size": 3,
                "halo-size": 1,
                "colour": "#89BB24"
            },
            "width": 2,
            "font-size": 12,
            "colour": "#89BB24"
        },
        "tags":{
            "type": "tags",
            "font": "Verdana",
            "font-size": 12,
            "colour": "#5170D0",
            "align-x": "center",
            "text": "#y#"
        },
        "bar":{
          "type":"bar",
          "alpha":0.8,
          "colour":"#336699",
          "font-size": 12
        },
        "pie":{
          "type":"pie",
          "start-angle": 180,
          "colours": ["#d01f3c","#356aa0","#C79810","#73880A","#D15600","#6BBA70"],
          "alpha":0.6,
          "stroke":2,
          "animate":1
         }
    }

    function theInnerChar(o){
        /*缓存原始参数*/
        this.params = o;

        _D.flashvars.id = o.target;
        _D.id = o.target;

        /*
        chart参数设定
        [Swfurl,Id,Width,Height,Version,ExpressInstall Url,Flashvars]
        */
        this.config = {}
        for(var key in _D){
            this.config[key] = o[key] || _D[key];
        }

        this.contentBox = $("#"+o.target);

        this.settings = o.settings;

        this.date = o.date?o.date:{"begin":$("#inputBeginDate"),"end":$("#inputEndDate")};

        /*默认页面已经加载了所需的js文件或浏览器已经具备必须的类*/
        this.need = 0;
        this.loaded = 0;

        /*
        如果flashvars没传或等于默认值且params.url或params.router有值，则采用ajax形式加载
        router优先于url
        */
        this.ajax = (this.config["flashvars"] === _D.flashvars && (this.params.url || this.params.router))?true:false;

        if(this.ajax){
            if(this.params.router){
                var _url = BU;
                for(var n in this.params.router){
                    var _r = this.params.router[n];
                    if(_r !== null){
                        _url += this.params.router[n]+"/";
                    }
                }
                _url = _url.substr(0,_url.length-1);
                this.params.url = _url;
            }
        }
        if(this.date.begin.length >0 && this.date.end.length > 0){
            this.params.params.begindate = this.date.begin.val();
            this.params.params.enddate = this.date.end.val();
            this.params.params.begindate = (this.params.params.begindate ==="" && window.begindate)?window.begindate:this.params.params.begindate;
            this.params.params.enddate = (this.params.params.enddate ==="" && window.enddate)?window.enddate:this.params.params.enddate;
        }else{
            if(!this.params.params.begindate){
                this.params.params.begindate = this.params.params.enddate = Clicki.getDateStr();
            }
        }

        if($("#siteList").length){
            this.siteList = $("#siteList");
            var that = this,timer;
            timer = setInterval(function(){
                if(Clicki.siteList){
                    clearInterval(timer);
                    Clicki.siteList.addClickiFn(function(sid){
                        that.init(sid);
                    });
                }
            },50);
        }else{
            this.siteList = false;
        }

        if($("#gotoQuery").length >0){
            var that = this;
            $(".choseDate:first input[type='button']").bind("click",function(){
                setTimeout(function(){
                    that.params.params.enddate = that.date.end.val();
                    that.params.params.begindate =  that.date.begin.val();
                    that.init();
                },200);
            });
        }

        this.timer = false;

        /*chart 的flash dom对象。生成后缓存。*/
        this.swf = null;

        /*必须类检测*/
        this.chkNeed();
    }

    theInnerChar.prototype = {
        init:function(sid){
            this.swf = this.createSwf();
            this.swf = this.getSWF(this.params.target);
            var self = this;
            var theTimer = setInterval(function(){
                this.swf = this.getSWF(this.params.target);
                if(this.swf && this.swf.load !== undefined){
                    clearInterval(theTimer);
                    if(this.ajax){
                        /*ajax的情况*/
                        var config = this.config;
                        this.contentBox.html("<div>"+LANG("正在加载数据，请稍候。")+"</div>");
                        if(sid){
                            this.params.params.site_id = sid;
                        }else{
                            this.params.params.site_id = window.site_id?window.site_id:(this.siteList?this.siteList.attr("key"):-1);
                        }
                        $.ajax({
                            type: "GET",
                            url:this.params.url,
                            data:this.params.params,
                            dataType:"json",
                            success:function(re){
                                if(re.error !== "+OK"){
                                    self.contentBox.addClass("failToLoadData").html("<div>"+LANG("Opsss~~服务器开小差了。请尝试刷新页面。")+"</div>");
                                    window.console && console.log("Server Error~");
                                    setTimeout(function(){
                                        Clicki.Balance();
                                    },500);
                                    return false;
                                }
                                if(re.result.items.length === 0){
                                    self.contentBox.addClass("failToLoadData").html("<div>"+LANG("Opsss~~发生了一个未知错误。请尝试刷新页面。")+"</div>");
                                    window.console && console.log("Item number 0");
                                    setTimeout(function(){
                                        Clicki.Balance();
                                    },500);
                                    return false;
                                }

                                self.contentBox.removeClass("failToLoadData");
                                self.dataProcessing(re.result.items,re.result.caption);
                                config = null;
                                setTimeout(function(){
                                    Clicki.Balance();
                                },1000);
                            }
                        });
                    }else{
                        /*非ajax的情况*/
                        this.swf = this.getSWF(this.params.target);
                    }
                }
            }.bind(this),200);
        },
        /*数据处理与数据加载*/
        dataProcessing:function(items,caption){
            var tmpData = {},tmpArr=[],len,that = this,
                    Els = {},Xlabel = [],rItems = [];

            /*生成chart适用的数据格式*/
            $.each(items,function(i,n){
                var yItem = n["y_axis"],xItem = n["x_axis"].date,_v;
                for(var m in yItem){
                    if(!Els[m]){
                        Els[m] = {};
                        Els[m].text = caption.y_axis[m];
                        Els[m].values = [];
                    }
                    if((""+yItem[m]).indexOf("%") !== -1){
                        _v = yItem[m];
                    }else{
                        if(isNaN(parseFloat(yItem[m]))){
                            _v = 0;
                        }else{
                            _v = parseFloat(yItem[m]);
                        }
                    }

                    Els[m].values.push(_v);
                }
                Xlabel.push(xItem);
            });

            for(var n in Els){
                rItems.push(Els[n]);
            }

            /*生成基本数据结构*/
            $.extend(tmpData,defaultChartSetting.global);
            /*标题*/
            tmpData.title = this.settings.title;
            /*成员数组赋值*/
            tmpData.elements = rItems;
            /*x轴基本设定*/
            $.extend(tmpData["x_axis"],this.settings.x);
            /*x轴设定*/
            tmpData["x_axis"].labels.steps = this.settings.x.labels.steps;
            tmpData["x_axis"].labels.labels = Xlabel;

            function getChartSetting(type){
                return $.extend({},defaultChartSetting[type]);
            }

            len = tmpData.elements.length;
            for(var i = 0 ;i<len;i++){
                /*成员具体数据设定*/
                var tmp = this.settings.elements[i];
                var tmp2 = getChartSetting(tmp.type);
                $.extend(tmpData.elements[i],defaultChartSetting[tmp.type],tmp);
                if(tmpData.elements[i]["dot-style"]){
                    if(!tmpData.elements[i]["dot-style"].type){
                        $.extend(tmpData.elements[i]["dot-style"],defaultChartSetting[tmp.type]["dot-style"]);
                    }
                    tmpData.elements[i]["dot-style"].colour = tmpData.elements[i].colour;
                    tmpData.elements[i]["dot-style"].tip = tmpData.elements[i].text +":#val#\n\n#x_label#";
                }else{
                    tmpData.elements[i].tip = tmpData.elements[i].text +":#val#\n\n#x_label#";
                }

                if(!isNaN(tmpData.elements[i].values[i])){
                    /*数字型数据缓存数组*/
                    tmpArr = tmpArr.concat(tmpData.elements[i].values);

                }
            }

            /*y轴最大值设定*/
            var theMax = tmpArr.Max();
            tmpData["y_axis"].max = theMax === 0?10:(theMax+theMax/10);

            /*y轴步长设定*/
            tmpData["y_axis"].steps = this.settings.y.steps || defaultChartSetting.global.y_axis.steps;
            /*y轴刻度多于10个的时候*/
            if(Math.round(theMax/tmpData["y_axis"].steps) > 10){
                tmpData["y_axis"].steps = Math.round(theMax/8);
            }

            /*数据加载*/
            this.swf.load(JSON.stringify(tmpData));

            /*回收*/
            tmpData = tmp = tmp2 = tmpArr = null;

            setTimeout(function(){
                Clicki.Balance();
            },500);
        },
        /*获取chart的dom对象*/
        getSWF:function(id) {
            if (/Microsoft/i.test(navigator.appName)) {
              return window[id];
            } else {
              return document[id];
            }
        },
        /*创建chart*/
        createSwf:function(){
            /*+"?_r="+(Math.round((Math.random() * 10000000))))*/
           return new swfobject.embedSWF(this.config["swfUrl"],this.config["id"],this.config["width"],this.config["height"],this.config["ver"],this.config["exp"],this.config["flashvars"],{},{"wmode":"transparent",id:this.config["id"]});
        },
        /*必须类检测*/
        chkNeed:function(){
            var timer,that = this;

            if((/Microsoft/i.test(navigator.appName) &&window.swfobject === undefined && window.JSON === undefined) || window.swfobject === undefined || window.JSON === undefined){
                timer = setInterval(function(){
                    if( window.swfobject !== undefined && window.JSON !== undefined){
                        clearInterval(timer);
                        that.init();
                    }
                },800);
            }else{
                this.init();
            }
        }
    }

    Clicki.expand("createChart",function(o){
        if(!o.target || window.BU === undefined){
            window.console && console.log("缺少关键变量！")
            return false;
        }
        var newChart = new theInnerChar(o);
        return newChart;
    });

});
