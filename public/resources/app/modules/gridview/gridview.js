define(function(require,exports,module){
    
    var Backbone =  require("backbone");
    var cookie = require("cookie");
    require("momentjs");
    var previousJQuery = this.jQuery;
    this.jQuery = require('jquery');
    this.jQuery = previousJQuery?previousJQuery:this.jQuery;
    var $ = this.jQuery;
    var indicator = require("indicator");
    var pop_up = require("pop_up");
    var defSet = {
        showPage:true,
        showMark:true,
        pagerNum:10,
        sendCondition:true
    };
    var cache = {
        alert_pop:null
    }
    
    var defModel = {
        defaults:{
            "x_axis":{},/*key in params.dims*/
            "y_axis":{},/*key in params.metrics*/
            dom:false,
            sub:false,
            trDom:false,
            colData:[]
        },
        format:false
    }

    var _cellCompareDiv = null,_doing = false;
    ////****弹出窗口的弹出函数
    function private_alert(msg, callback, confirm){
        //if (!cache.alert_pop){
            cache.alert_pop = new pop_up({
                type: {'html': '<div></div>'},
                "ui":{
                    "title":{
                        "show":true,
                        "text":LANG("系统消息")
                    },
                    "width": 300
                },
                "autoClose":false,
                "showMark":true,
                "showClose":true,
                "showCtrl":true,
                onDone:function(){
                    if (this.msg_queue[0] && this.msg_queue[0][1]) this.msg_queue[0][1]();
                    this.msg_queue.shift();
                    if (this.msg_queue.length > 0){
                        this.content.text(this.msg_queue[0][0]);
                        //this.doms.cancelBnt.toggle(this.msg_queue[0][2]);
                        return;
                    }
                    /*this.hide();
                    this.showed = false;*/
                    //this.hide();
                    this.destroy();
                    cache.alert_pop = null;
                },
                onCancel: function(){
                    /*this.msg_queue.shift();
                    this.showed = false;
                    if (this.msg_queue.length > 0) this.show();*/
                    //this.hide();
                    this.destroy();
                    cache.alert_pop = null;
                },
                onClose:function(){
                    //this.hide();
                    this.destroy();
                    cache.alert_pop = null;
                },
                onRender: function(){
                    this.content = this.doms.inner.find('div:first').css('padding', '10px 10px 20px');
                    this.content.text(this.msg_queue[0][0]);
                    //this.doms.cancelBnt.toggle(this.msg_queue[0][2]);
                },
                beforeShow: function(){
                    this.showed = true;
                    if (this.content){
                        this.content.text(this.msg_queue[0][0]);
                        this.doms.cancelBnt.toggle(this.msg_queue[0][2]);
                    }
                },
                "data":null,
                "ready":false
            });
            cache.alert_pop.showed = false;
            cache.alert_pop.msg_queue = [];
        //}

        cache.alert_pop.msg_queue.push([msg, callback, confirm || false]);
        if (!cache.alert_pop.showed){
            cache.alert_pop.show();
        }
    }

    function grid(config,callback){

        /*config设置*/
        this.config = config || {};
        // this.config = $.extend(defSet,this.config);
        
        this.config.showPage = this.config.showPage !== undefined?this.config.showPage:defSet.showPage;
        this.config.showMark =  this.config.showMark !== undefined?this.config.showMark:defSet.showMark;
        this.config.sendCondition = this.config.sendCondition !== undefined?this.config.condition:defSet.sendCondition;

        /*初始排序状态*/
        this.config.defOrder = this.config.params && this.config.params.order && this.config.params.order.substring(0,this.config.params.order.indexOf("|"));
        /*grid表现文字性数据*/
        this.gridTxtData = {};
        /*有配置router的时候*/
        if(this.config.router){
            routerTransform.call(this);
        }
        this.config.params = config.params||{};
        this.config.params.page = this.config.params.page?this.config.params.page:1;
        this.config.params.limit = this.config.params.limit?this.config.params.limit:10;
        this.pageIndex = this.config.params.page;
        this.jsonData = null;

        this.callback = callback && typeof callback == "function"?callback:(typeof(config.callback) == "function"?config.callback:false);
        this.onDestroy = config.onDestroy || $.noop;
        /*初始化状态*/
        this.mark = false;
        if(this.config.showMark){
            this.mark = $("<div class=\"theGridMarkLayout\"><div></div></div>");
            var target = (this.config.target.nodeType || this.config.target.selector) && $(this.config.target) || $("#"+this.config.target);
            target.css({
                //"position":"relative",
                "z-index":0
            }).append(this.mark);
            target = null;
        }
        /*全局的排序开关*/
        this.config.sort = config.sort!==undefined?config.sort:true;
        /*如果非数据列在第二列，隐藏操作图标*/
        this.ctrlBoxhide = false;
        if(this.config.colModel[1].data === null){
            this.ctrlBoxhide = true;
        }

        /*对比用的浮动层*/
        if(this.config.cellCompare){
            if(!_cellCompareDiv){
                _cellCompareDiv = $("<div></div>");
                $("body:first").append(_cellCompareDiv);
                _cellCompareDiv.addClass("theCellCompareFloatBox");
            }
        }
        /*非数据列均不可对比*/
        var _start,_end,sArr,eArr;
        for(var i = 0,len = this.config.colModel.length;i<len;i++){
            if(this.config.colModel[i].data === null){
                _start = _start || i;
                _end = i;
                this.config.colModel[i].compare = false;
            }
        }
        //console.log(_end);
        /*有自定义的时候以自定义的配置为准。度cookie：_c_gridfilter_build。"filterType1|filterBiild1||filterType2|filterBiild2"*/
        if(this.config.filter){

            var _tmpObj = {},tmpStr = [];
            _tmpObj.colModel = this.config.colModel;
            for(var i =0;i<_tmpObj.colModel.length;i++){
                tmpStr.push(_tmpObj.colModel[i].data);
            }
            _tmpObj = null;
            tmpStr = ""+tmpStr;
            _start = _start || this.config.colModel.length;

            if(this.ctrlBoxhide){
                if(_end <= this.config.colModel.length-1 && _end !== _start){
                    eArr = this.config.colModel.slice(_end);
                }
                sArr = this.config.colModel.slice(0,_start+1);
            }else{
                sArr = this.config.colModel.slice(0,1);
                eArr = this.config.colModel.slice(_start);
            }

            function _getArr(name){
                for(var i =0;i<this.config.colModel.length;i++){
                    if(this.config.colModel[i].data == name){
                        return this.config.colModel[i];
                    }
                }
                return {};
            }

            /*补齐colModel*/
            $.each(this.config.filter.options,function(n,v){
                var _test = tmpStr.match(new RegExp("(_)?("+n+")",["g"]));
                if((_test && $.inArray(n,_test) === -1) || !_test){
                    sArr.push($.extend(
                        _getArr.call(this,n),{
                            data:n,
                            hidden:true
                        }
                    ));
                }else{
                    sArr.push($.extend(
                        _getArr.call(this,n),{
                            data:n,
                            hidden:false
                        }
                    ));
                }
            }.bind(this));
            this.config.colModel = null;
            eArr && eArr.length && (sArr = sArr.concat(eArr));
            this.config.colModel = sArr;

            /*获取所有的表格自定义设置*/
            var customFilter = cookie.get("_c_gridfilter_build");

            /*获取指定类型的表格自定义设置*/
            function _getCustom(customFilter,type){
                var _re;
                for(var i=0;i<customFilter.length;i++){
                    if(customFilter[i].indexOf(type) !== -1){
                        _re = customFilter[i].split("|");
                        break;
                    }
                }
                return _re;
            }

            /*检测是否有自定义设置，如有则尝试获取自定义设置*/
            if(
                customFilter 
                && customFilter.indexOf(config.filter.type) !== -1 
                && (customFilter = _getCustom(decodeURIComponent(customFilter).split("||"),config.filter.type))
            ){
                /*有自定义设置，非数据列不能隐藏*/
                this.config.filter.build.custom.build = customFilter[1].split(",");
                var _b = this.config.filter.build.custom.build;
                $.each(this.config.colModel,function(i,n){
                    
                    if($.inArray(n.data,_b) === -1 && n.data !== null){
                        n.hidden = true;
                    }else{
                        n.hidden = false;
                    }

                }.bind(this));

                $.each(this.config.filter.build,function(n,v){
                    v.act = (n === "custom"?true:false);
                });
                
                customFilter = null;
            }

        }
        

        /*内部用变量*/
        var MVC = {};

        var thisGrid = this;
        
        var getInfo = {};

        /*model设定*/
        defModel.format = false;
        var newModel = $.extend(true,{},defModel,(this.config.model||{}));
        var innnerModel = Backbone.Model.extend(newModel);
        /*Collection设定*/
        /*to save data*/
        var innerCollection = Backbone.Collection.extend({
            model:innnerModel,
            initialize:function(){},
            mainEl:(this.config.target.nodeType || this.config.target.selector) && $(this.config.target) || $("#"+this.config.target),
            mark:this.mark,
            debug:this.config.debug||false,
            params:this.config.params,
            colModel:config.colModel,
            amount:null,
            colsNames:false,
            hasSub:this.config.sub || false,
            minChart:this.config.minChart||false,
            length:null,

            url:this.config.url,
            onSuccess:this.config.onSuccess || $.noop,
            /*获取数据*/
            getData:function(i,cbFn,resetPage,scope){
                scope = scope || this;
                var me = this;
                if(this.mark){
                    this.mainEl.height()||this.mainEl.css({
                        "height":"30px",
                        "overflow":"initial"
                    });
                    
                    var box = this.mainEl.parents().filter(function(index){
                        return $(this).css("position") == "relative";
                    });
                    var H = "100%";
                    if(box.eq(0).scrollTop() > 0){
                        H = box.eq(0).height() + box.eq(0).scrollTop() + "px";
                    }
                    this.mark.css({
                        "height":H
                    }).delay(200).show();
                }
                if(i && i !== null){
                    this.params.page = parseInt(i);
                }
                $.ajax({
                    url:this.url,
                    data:this.params,
                    dataType:"json",
                    cache:false,
                    success:function(re){
                        if(re.success === true){
                            if(MVC.Model.format){
                                var re = MVC.Model.format(re);
                            }
                            this.jsonData = re;
                            this.amount = re.result.amount || null;
                            var pageSetting = MVC.View.mainView.pageInfo = {
                                total: parseInt(re.result.total) || 0,
                                page:  parseInt(this.params.page) || 1,
                                size: parseInt(this.params.limit) || 10
                            }
                            $.extend(getInfo,pageSetting);
                            //$.extend(this.info,pageSetting);
                            this.total = pageSetting.total;
                            
                            if(MVC.View.mainView.ready){
                                this.mainEl.css({
                                    "height":"100%",
                                    "overflow":"initial"
                                });
                                this.reset(re.result.items);
                                this.setColData();
                                MVC.View.mainView.updateGrid(true,resetPage);

                                if(MVC.View.mainView.colModel){
                                    MVC.View.mainView._setColModel();
                                }
                            }else{
                                this.onSuccess();
                                this.mainEl.css({
                                    "height": (Math.min(pageSetting.size, pageSetting.total) * 30)+"px",
                                    "overflow":"initial"
                                });

                                re.result.caption = re.result.caption ? re.result.caption : (thisGrid.config.caption || {});

                                this.gridCaption = re.result.caption;
                                this.gridTxtData = {};
                                this.gridDescData = {};
                                $.each(re.result.caption, function(key, value){
                                    this.gridTxtData[key] = LANG(value.title);
                                    ////////////翻译------描述///////////////
                                    this.gridDescData[key] = LANG(value.desc);
                                }.bind(this));
                                this.add(re.result.items);
                                this.setColData();
                                MVC.View.mainView.render();
                            }
                            (this.debug && window.console) &&(console.log(thisGrid));
                            if(cbFn){
                                cbFn.call(scope);
                            }
                        }else{
                            window.console && console.error(LANG("出错了啊兄弟~"));
                            //private_alert("日期格式不正确");
                            this.mark && this.mark.hide();
                        }
                    }.bind(this)
                });
                
            },
            /*根据colModel生成标题*/
            getGridTitle:function(){
                var gT = {};
                for(var n in this.colModel){
                    gT[n] = this.colModel[n].title || "";
                }
                return gT;
            },
            /*设定参数*/
            setParams:function(params){
                if(params && $.isPlainObject(params)){
                    this.params = $.extend(this.params,params);
                    return this.params;
                }
                return false;
            },
            getParams:function(){
                return this.params;
            },
            /*获取json数据*/
            getJsonData:function(i){
                return this.jsonData;
            },
            /*获取指定索引的数据*/
            getModelDataAt:function(i){
                if(this.models[i] && this.models[i].attributes){
                    return this.models[i].attributes;
                }
                return false;
            },
            /*获取所有的数据*/
            getAllModelData:function(){
                var data = [];
                for(var i = 0,len = this.length;i<len;i++){
                    data.push(this.getModelDataAt(i));
                }
                return data;
            },
            goFormatData:function(data){},
            /*修改数据请求接口*/
            changURL:function(url){
                this.url = url;
            },
            /*原始数据扁平化处理*/
            setColData:function(){

                var tmp,tObjArr=[],valueArr=[],colNum = [],_i,_minChart = this.minChart;

                tmp = [];

                function _setTmpArr(n,v){
                    var obj = {};
                    obj[n] = v;
                    valueArr.push(v);
                    tmp.push(obj);
                }

                function __(data,nn,i,re){
                    if(data[nn.data] !== undefined){
                        if(re){return data[nn.data]}
                        _data = data[nn.data]
                    }else if( data["x_axis"][nn.data] !== undefined){
                        if(re){return data["x_axis"][nn.data]}
                        _data = data["x_axis"][nn.data];
                    }else if( data["y_axis"][nn.data] !== undefined){
                        if(re){return data["y_axis"][nn.data]}
                        _data = data["y_axis"][nn.data]
                    }else if (this.hasSub && (nn.tpl || nn.render) || nn.data ===null){
                        if(this.hasSub && (nn.tpl || nn.render) && (nn.data === null || !_minChart)){
                            if(this.hasSub.xtype){
                                _data = "<img src=\"/resources/images/blank.gif\" data-stype=\""+this.hasSub.xtype+"\" class=\"subCtrlIcon close\" data-sub=\"close\" />";
                            }else{
                                _data = "";
                                /*如果有一个以上的子层按钮，需要自定义按钮样式*/
                                for(var n in this.hasSub){
                                    var subTitle = this.hasSub[n].subTitle?this.hasSub[n].subTitle:"";
                                    _data += "<img src=\"/resources/images/blank.gif\" data-stype=\""+n+"\" class=\"sub" +n+ "IconClose close\" data-sub=\"close\" alt=\"" + subTitle + "\" title=\"" + subTitle + "\"/>";
                                    subTitle = null;
                                }
                            }
                            
                        }else if(_minChart){
                            //_data = "";
                            _data = _.template(_minChart.tpl, {"key":__(data,{data:_minChart["key"]},i,true)});
                        }else{
                            _data = "";
                        }
                        
                    }else if(nn.combination){
                        if(data[nn.combination.field]){
                            var _d = data[nn.combination.field];
                            _data =_data || "";
                            for(var n in _d){
                                _data += _d[n];
                                nn.combination.symbol && (_data+=nn.combination.symbol);
                            }
                            nn.combination.symbol && (_data = _data.substr(0,_data.length-1));
                            _d = null;
                        }
                    }
                }

                var _data;
                this.colsNames = [];
                $.each(this.models,function(i,n){
                    tmp = [];
                    valueArr = [];
                    
                    $.each(this.colModel,function(ii,nn){
                        
                        __.apply(this,[this.models[i].attributes,nn,i]);
                        

                        (nn.data || (this.hasSub || nn.data ===null && (nn.tpl || nn.render))) && valueArr.push(
                            _data
                        );

                        tmp.push(({}[nn.data] = _data));



                    }.bind(this));

                    n.attributes.colData = tmp;
                    colNum.push(tmp.length);
                    tObjArr.push(valueArr);
                    tmp = null;
                    _data = null;
                }.bind(this));

                for(var i = 0,len = this.colModel.length;i<len;i++){
                    this.colsNames.push(this.colModel[i].data);
                }

                this.colDatas = tObjArr;

                this.colNum  = this.colModel.length+1;

                tObjArr= colNum = null;
            },
            /*获取实际列数*/
            getColNum:function(){
                return this.colNum;
            },
            /*获取处理后的数据*/
            getAllColDatas:function(){
                return this.colDatas;
            },
            /*获取结构字段名*/
            getColName:function(i){
                return i !==undefined?this.colsNames[i]:this.colsNames;
            },
            /*获取指定字段合计*/
            getValueTotal:function(name){
                var name = this.minChart.key || name || "pageviews";
                return parseFloat(this.amount["y_axis"][name]);
            },
            /*获取合计*/
            getAmount:function(){
                return this.amount && this.amount["y_axis"] || 0;
            }
        });
        /*grid主视图*/
        var mainView = Backbone.View.extend({
            el:(this.config.target.nodeType || this.config.target.selector) && $(this.config.target) || $("#"+this.config.target),
            tagName:"div",
            colNum:false,
            colWidth:this.config.colWidth?this.config.colWidth:false,
            colModel:this.config.colModel?this.config.colModel:false,
            rowModel:this.config.rowModel?this.config.rowModel:false,
            hasSub:this.config.sub?this.config.sub:false,                                                    /*是否有sub grid*/
            subIsShow:false,                                                                                            /*sub grid是否已经显示*/
            showPage:this.config.showPage,                                                                       /*是否有分页*/
            sendCondition:this.config.sendCondition?this.config.sendCondition:false,                                     /*是否*/
            nowPage:this.pageIndex,                                                                               /*当前显示的页面*/
            allPage:null,                                                                                                   /*总页数*/
            showTotal:this.config.showTotal || false,
            showCaption:this.config.showCaption?this.config.showCaption:true,              /*是否显示caption(标题)*/
            table:false,
            icon:this.config.icon||false,
            resbu:(window.RESBU||""),
            mark:this.mark,                                                                                             /*是否显示遮罩*/
            ready:false,
            ellipsis:this.config.ellipsis || 30,
            defCellWidth:"auto",                                                                                            /*渲染状态*/
            title:(this.config.title && this.config.title !=="")?this.config.title:false,
            xModule:{},
            afterRender:config.afterRender||$.noop,
            //cellCompare:this.config.cellCompare || false,
            cellCompare:false,
            readyModule:{},
            filter:this.config.filter || false,
            url:this.config.url,
            ctrlBoxhide:this.ctrlBoxhide,
            /*如果不导出excel，则为true，默认是false*/
            ExportExcel:this.config.ExportExcel || false,
            /*渲染*/
            render:function(){
                $(this.el).addClass("grid").css("width","100%");

                /*结构构建*/
                this.build();

                /*表格缓存*/
                this.table = $(this.el).find("table:first");
                $(this.el).height(this.table.outerHeight(true));
                //this.table.width($(this.el).width());
                this.table.css("width","100%");
                this.afterRender.call(this,MVC);
                /*相关附加设置*/
                this.gridSetting();

                /*渲染其他视图*/
                MVC.View.headView.setView();
                if (MVC.View.pageView){
                    MVC.View.pageView.render(this.pageInfo);
                    this.nowPage = MVC.View.pageView.info.page;
                }

                /*遮罩层操作与其他*/
                setTimeout(function(){
                    this.mark && this.mark.hide();
                    $(this.el).css({height:"100%"});
                    this.ready = true;
                    if(Clicki.Balance){
                        Clicki.Balance();
                    }
                }.bind(this),200);
                
            },
            _getCollection:function(){
                return MVC.Collection;
            },
            /*生成单元格内容*/
            _getCellHtml:function(i,val,ico,pos,row){
                /*列，值，图标，图标位置，行*/
                /*当前列model*/
                var nowColModel = this.colModel[i];
                val = (val === null?0:val);
                //val = ""+val;
                if(nowColModel.data === "bounce_rate"){
                    val = Math.round(parseFloat(val)*10000)/100 +"%";
                }

                if(nowColModel.data === "avg_loadtime"){
                    val = (val/1000)+LANG("秒");
                }

                if(nowColModel.data === "avg_staytime"){
                    val = (new Date(val*1000).timemark([":",":",""],true));
                }

                /*千分位截断*/
                (typeof val === "number") && (val = val.separated());

                /*if(!isNaN(parseFloat(val)) && val.indexOf(".") !== -1 && val.split(".")[1].length >2){
                    val = Math.round(parseFloat(val)*100) +"%";
                }*/
                /*链接地址*/
                var href = false;
                /*val带链接标签则title为空*/
                var titleStr = /<(.*) [^>]*>/.test(val)?"":val;
                
                //var html = "<td nocompare=\""+(nowColModel.compare === false?1:0)+"\" "+(nowColModel.hidden?"style=\"display:none\"":"")+"><div title=\""+titleStr+"\">"+(this.hasSub && i===0?"<img src=\"/resources/images/blank.gif\" class=\"subCtrlIcon close\" data-sub=\"close\" />":"");
                var html = "<td class=\""+(nowColModel.tdCls?nowColModel.tdCls:"")+"\" "+(nowColModel.data === null?"data-ctype = \"ctrl\"":"")+ "nocompare=\""+(nowColModel.compare === false?1:0)+"\" "+(nowColModel.hidden?"style=\"display:none\"":"")+">";
                
                if(/[http]||[www.]||[:?(.)]/.test(val)){
                    href = val;
                }
                /*字符串截取*/
                if( typeof(val) === "string" && val.length > this.ellipsis && nowColModel.data !== null){
                    
                    val = val.substr(0,this.ellipsis)+"...";
                }
                /*是否带图标*/
                var _str = (ico && i === pos && (pos?val+ico:ico+val)) || val;

                /*内容生成 render > tpl > _str */
                /*TODO MinChart生成时会带多一个div，进而影响到溢出处理*/
                if(nowColModel.data === null){
                    html += (nowColModel.render && "<div class=\""+(nowColModel.cls?nowColModel.cls:"")+"\">"+nowColModel.render.apply(this,[_str,i,row,href])+"</div>")
                            ||"<div class=\""+(nowColModel.cls?nowColModel.cls:"")+"\" title=\""+titleStr+"\">"+_.template(nowColModel.tpl, {"key":_str})+"</div>";
                }else{
                    /////////////////////翻译------表格内容///////////////////////
                    html += (nowColModel.render && "<div class=\""+(nowColModel.cls?nowColModel.cls:"")+"\">"+nowColModel.render.apply(this,[_str,i,row,href])+"</div>")
                            || (nowColModel.tpl && "<div class=\""+(nowColModel.cls?nowColModel.cls:"")+"\" title=\""+LANG(titleStr)+"\">"+LANG(_.template(nowColModel.tpl, {"key":_str}))+"</div>")
                            || "<div class=\""+(nowColModel.cls?nowColModel.cls:"")+"\" title=\""+LANG(titleStr)+"\">"+LANG(_str)+"</div>";
                }
                html += "</td>";

                return html;
            },
            /*生成总计*/
            _getTotalHtml:function(headArea,girdText){
                var data = MVC.Collection.getAmount();

                headArea.push('<div class="theGridTotalBox"><ul>');

                $.each(this.colModel,function(i,n){
                    var _val;
                    if(i>0 && n.data && data[n.data] !== undefined){
                        _val = data[n.data]===null?"0":""+data[n.data];
                        if(n.data === "bounce_rate"){
                            _val = Math.round(parseFloat(_val)*10000)/100 +"%";
                        }else if(n.data === "avg_loadtime"){
                            (parseInt(_val)) && (_val = (_val/1000)+LANG("秒"));
                        }else if(n.data === "avg_staytime"){
                            (parseInt(_val)) && (_val = (new Date(_val*1000).timemark([":",":",""],true)));
                        }else {
                            if((""+_val).split(".").length>1){
                                (parseFloat(_val)) && (_val = parseFloat(_val).separated());
                            }else{
                                (parseInt(_val)) && (_val = parseInt(_val).separated());
                            }
                            
                        }
                        ////////////翻译------/////////////////////
                        headArea.push("<li data-ttype=\""+n.data+"\" "+(n.hidden?"style=\"display:none\"":"")+"><span>"+LANG(girdText[n.data])+"</span>"+_val+"<em data-desc=\""+n.data+"\"></em></li>");
                    }
                    
                });
                headArea.push("</ul></div>");
            },
            /*生成筛选*/
            _getFilterHtml:function(headArea,filterObj){
                var str = '<div class="theGridFilterCtrl"></div>';
                headArea.push(str);
            },

            /*生成导出*/
            _getExportHtml:function(headArea,url){
                headArea.push("<div class=\"export\"></div>");
            },


            /*构建grid*/
            build:function(){
                /*表格结构数组*/
                var _table = ["<div class=\"theGridTableBox\"><table class=\"gridViewTableContent\">"],
                    /*数据缓存变量*/ 
                    data,                       
                    self = this,
                    /*头部结构数组*/
                    headArea = [],
                    girdText = MVC.Collection.gridTxtData,
                    minChart = MVC.Collection.minChart;

                if(this.colNum !== MVC.Collection.getColNum()){
                    this.colNum = MVC.Collection.getColNum();
                }
                /*有标题时*/
                if(this.title){
                    headArea.push("<div class=\"theGridTitleBox\">"+this.title+"</div>");
                }

                if(this.filter){
                    this._getFilterHtml(headArea,this.filter);
                }
                
                if(this.ExportExcel){
                    this._getExportHtml(headArea,this.url);
                }
                
                if(this.showTotal){
                    this._getTotalHtml(headArea,girdText);
                }

                /*表头*/
                if(this.showCaption){
                    data = MVC.Collection.gridTxtData;
                    var _i = 0,head= [],headY = [];
                    if(!data){
                        return false;
                    }
                    _table.push("<tbody class=\"gridHeadContent\">");
                    var les = 100,aNum = 0;
                    $.each(this.colModel,function(i,n){
                        (n.data === true || n.data !==null) && head.push(
                             n.data === true && n.text || (data[n.data] || data["x_axis"][n.data] || data["y_axis"][n.data])
                        ) ||(n.data ===null && (n.tpl || n.render)) & head.push(
                            n.text||""
                        )

                    }.bind(this));

                    data = head;
                    head = null;

                    if(minChart){
                        data.push(minChart.title?minChart.title:"");
                    }

                    /*加入序号th*/
                    _table.push('<th class="serial" ><div><div>'+ LANG("序号") + '</div></div></th>');

                    $.each(this.colModel,function(i,n){
                        var colWidthArr = self.colWidth;
                        var cW = (n.hidden && n.width &&"style=\"width:"+(n.width||"auto")+";display:none\"")
                                || (n.hidden && "style=\"width:auto;display:none;\"" )
                                || (n.width && "style=\"width:"+(n.width || "auto")+"\"")
                                || "style=\"width:"+self.defCellWidth+"\"";

                        ///////////////////////////////翻译------表格头部////////////////////////////////
                        _table.push("<th "+cW+" "+(i === 0 && "class=\"theTextLeft\"" || n.data === null && "class=\"theTextCenter\"" )+"><div><div class=\""+(n.cls?n.cls:"")+"\">"+LANG(data[i])+"</div></div></th>");
                    });

                    _table.push("</tbody>");
                }

                /*表身*/
                _table.push("<tbody class=\"gridContentBody\">");
                data = MVC.Collection.getAllModelData();
                //var _total = MVC.Collection.total;
                var colDatas = MVC.Collection.getAllColDatas(),minChartStr;
                var iconUrl = self.icon.url || "/resources/images/icons/";
                if(data.length === 0){
                    _table.push("<tr ><td class=\"theGridNoData\" colspan=\""+self.colNum+"\"><div>"+LANG("没有数据...")+"</div></td></tr>");
                }else{
                    $.each(data,function(i){
                        _table.push("<tr "+(self.cellCompare ? "row="+i:"")+">");
                        var IC = false,pos = false,cols = colDatas[i] ,str,imgSrc;
                        minChartStr = "";
                        if(self.icon){
                            pos= self.icon.col -1;
                            imgSrc = iconUrl+self.icon.type+"/"+(data[i]["x_axis"][self.icon.name]?data[i]["x_axis"][self.icon.name]:"unknown")+".png";
                            IC = "<img src=\""+imgSrc+"\" alt=\"\" align=\"absmiddle\" title=\""+(data[i]["x_axis"][self.icon.title]?data[i]["x_axis"][self.icon.title]:"")+"\" class=\""+(self.icon.pos?"icon_behind":"icon_front")+"\" />";
                        }
                        /*加入每行的序号*/
                        _table.push("<td  class=\"theTextCenter\"><div style=\"text-align: center;\">" + (i+1) + "</div></td>");
                        $.each(colDatas[i],function(ix,iv){
                            _table.push(
                                self._getCellHtml(ix,iv,IC,pos,i)
                            );
                            if(minChart && ix === minChart.v){
                                minChartStr = colDatas[i][ix];
                            }
                        });

                        if(self.hasSub){
                            if(self.hasSub.xtype){
                                _table.push("<tr style=\"display:none;\"><td colspan=\""+self.colNum+"\"><div id=\""+self.cid+"_"+i+"\"></div></td></tr>");
                                inner= null;
                            }else{
                                var inner = "<tr style=\"display:none;\"><td colspan=\""+self.colNum+"\">";
                                for(var nn in self.hasSub){
                                    inner+="<div id=\""+self.cid+"_"+i+"_"+nn+"\"></div>";
                                }
                                inner +="</td></tr>";
                                _table.push(inner);
                                inner= null;
                            }
                        }
                    });
                }

                _table.push("</tbody></table></div>");
                _table = headArea.concat(_table);
                _table = _table.join("");
                $(this.el).append('<div class="theGridMainContentBox">'+_table+'</div>');
                if(this.showPage){
                    var pageCon = $('<div class="theGridFooter"></div>');
                    $(this.el).append(pageCon);
                    MVC.View.pageView = new pageView({target:pageCon});
                }
                thisGrid.ready = true;
                _table = null;
                headArea = null;
                
            },
            /*更新grid*/
            updateGrid:function(re,resetPage){

                var tbody  =this.table.find("tbody.gridContentBody:first");
                //console.dir(tbody)
                var totalBox = $(this.el).find(".theGridTotalBox:first");
                var totalArr = [];
                var chipBox = $("<div></div>")//document.createDocumentFragment();
                var data = MVC.Collection.getAllModelData();
                var colDatas = MVC.Collection.getAllColDatas();
                var hasSub = this.hasSub,colNum = this.colNum,cid = this.cid;
                var num = 0,IC = false,pos = this.icon?this.icon.col -1:false;
                var self = this,minChart = MVC.Collection.minChart;
                var headBox,headChipBox;

                if(re){
                    this._getTotalHtml(totalArr,MVC.Collection.gridTxtData);
                    totalBox.replaceWith(totalArr.join(""));
                    totalArr = null; 
                }

                /*生成函数*/
                function inRow(data,i){
                    //var row = document.createElement("tr");
                    var tds = "",hasIcon = data.icon?true:false,minChartStr = "";
                    /*根据页码更新序号*/
                    tds +=("<td class=\"theTextCenter\"><div style=\"text-align: center;\">"+((self.pageInfo.page-1)*self.pageInfo.size+i+1)+"<div></td>");
                    $.each(colDatas[i],function(ix,iv){

                        tds+= self._getCellHtml(ix,iv,IC,pos,i);

                        if(minChart && ix === minChart.v){
                            minChartStr = colDatas[i][ix];
                        }

                        num++;
                    });
                    var row = $("<tr "+(self.cellCompare ? "row="+i:"")+">"+tds+"</tr>");
                    //console.dir(row[0])
                    chipBox.append(row[0]);
                    /*有sub grid的时候*/
                    if(hasSub){
                        if(hasSub.xtype){
                            var inner = "<tr style=\"display:none;\"><td colspan=\""+colNum+"\"><div id=\""+self.hasSub.cid+"_"+i+"\"></div></td></tr>";
                        }else{
                            var inner = "<tr style=\"display:none;\"><td colspan=\""+colNum+"\">";
                            for(var nn in self.hasSub){
                                inner+="<div id=\""+self.cid+"_"+i+"_"+nn+"\"></div>";
                            }
                            inner +="</td></tr>";
                        }
                        row = $(inner);
                        chipBox.append(row[0]);
                        inner= null;
                    }
                    num = 0;
                }

                /*跳板......*/
                function jump(ret){
                    if(typeof ret == "function"){
                        return ret();
                    }
                    return false;
                }
                
                if(data.length === 0){
                    //console.log(chipBox)
                    //var _row = document.createElement("tr");
                    _row = '<tr><td class="theGridNoData" colspan="'+colNum+'"><div>'+LANG("没有数据...")+'</div></td></tr>';
                    chipBox.append(_row);
                }else{
                    $.each(data,function(i){
                        var that =this;
                        if(self.icon){
                            var iconUrl = self.icon.url || "/resources/images/icons/";
                            pos= self.icon.col -1;
                            imgSrc = iconUrl+self.icon.type+"/"+(data[i]["x_axis"][self.icon.name]?data[i]["x_axis"][self.icon.name]:"unknown")+".png";
                            IC = "<img src=\""+imgSrc+"\" alt=\"\" align=\"absmiddle\" title=\""+(data[i]["x_axis"][self.icon.title]?data[i]["x_axis"][self.icon.title]:"")+"\" class=\""+(self.icon.pos?"icon_behind":"icon_front")+"\" />";

                        }
                        
                        jump(function(){
                            return inRow(that,i);
                        });
                    });
                }

                tbody.find("*").unbind();
                tbody.find("tr").remove();
                tbody.append(chipBox.html());

                this.gridSetting(resetPage);

                this.afterRender.call(this,MVC);
                /*遮罩层操作与其他*/
                /*强制200ms间隔*/
                setTimeout(function(){
                    this.mark && this.mark.css("display","none");
                    if(Clicki.Balance){
                        Clicki.Balance();
                    }
                }.bind(this),200);
            },
            /*相关附加设置*/
            gridSetting:function(reset){
                /*斑马线样式调整*/
                this._setZebraLine();

                /*colModel*/
                this._setColModel();

                /*隐藏操作按钮*/
                this.ctrlBoxhide && this._setCtrlBox();

                this.filter && this._setFilter();

                this.ExportExcel && this._setExport(this.url);

                this.showTotal && this._setTotalRow(reset);

                /*rowModel*/
                this.rowModel && this._setRowModel();
                
                /*次级列表设定*/
                this.hasSub && this.bindSub();

                /*有重置*/
                reset && this.showPage && this.resetPage();

                /*單元格拖拽比较*/
                this.cellCompare && this._setCellCompare();

                /*文字溢出设定*/
                this._setEllipsis();
                
                /*小图表设定MVC.Collection.minChart && this._setMinChart();*/
                 
            },


            /*斑马线样式调整*/
            _setZebraLine:function(){
                if(this.hasSub){
                    this.table.find("tbody.gridContentBody").addClass("zebraLine");
                }else{
                    this.table.find("tbody.gridContentBody").addClass("NoSubZebraLine");
                }
            },


            _setFilter:function(){
                if(!this.indicator){
                    var gridTxt = MVC.Collection.gridTxtData;
                    $.each(this.filter.options,function(key, value){
                        value.text = gridTxt[key];
                    })
                    this.indicator = indicator({
                        model:{
                            datacontent:$.extend(true,{},this.filter),
                            params:MVC.Collection.params
                        },
                        id:$(this.el).find(".theGridFilterCtrl:first"),
                        afterSelect:function(hasBeenSelected){
                           MVC.View.mainView._doFilter(hasBeenSelected);
                        }
                    });
                }
            },

            _doFilter:function(selected,custom){
                var hasbeenselected = selected.slice(0);

                hasbeenselected.unshift(this.colModel[0].data);

                var cL= this.colLen;

                $.each(this.colModel,function(i,n){
                    if($.inArray(n.data,hasbeenselected) === -1 && n.data !== null){
                        n.hidden = true;
                    }else{
                        n.hidden = false;
                    }
                });

                $.each(this.thDivs,function(i,n){
                    i > 0 && this.thDivs.eq(i).parent().css("display",this.colModel[i].hidden?"none":"table-cell");
                }.bind(this));

                this.totalRow && $.each(this.totalRow.li,function(i,n){
                    if($.inArray($(n).attr("data-ttype"),hasbeenselected) !== -1){
                        $(n).css("display","block");
                    }else{
                        $(n).css("display","none");
                    }
                }.bind(this));

                $.each(this.tdDivs,function(i,n){

                    var _i = i % cL;
                    
                    $(n).closest("td").css("display",this.colModel[_i].hidden?"none":"table-cell");
                }.bind(this));

                this._setTotalRow(true);

            },

            _setExport:function(url){

                var params = this._getCollection().getParams();
                var obj = $.extend({},params,{
                    "tmpl":"export",
                    "limit":9999
                });
                delete obj.page;
                delete obj.url;
                var href  = this.url+"?"+$.param(obj);
                obj = null;

                $(this.el).find(".export:first").click(function(){
                    window.location.href = href;
                });
            },

            _setTotalRow:function(reset){

                this.totalRow = {main:$(this.el).find(".theGridTotalBox:first")};
                this.totalRow.mainWidth = this.totalRow.main.width();
                this.totalRow.ul = this.totalRow.main.find("ul:first");

                this.totalRow.li = this.totalRow.main.find("li");

                this.totalRow.em = this.totalRow.li.find("em");

                $.each(this.totalRow.em, function(key, value){
                    var desc = $(value).attr("data-desc");
                    var text = MVC.Collection.gridDescData[desc];
                    if (!text || $.trim(text) == ''){
                        $(value).remove();
                    }
                });

                this.totalRow.em.unbind().hover(
                    function(ev){
                        this.explainPop && this.explainPop.hide && this.explainPop.hide();
                        var _n = $(ev.target);
                        var expPop;
                        var popSet = {
                            "type":{
                                "html":MVC.Collection.gridDescData[_n.attr("data-desc")]
                            },
                            "showClose":false,
                            "animate":{
                                "config":{
                                    "position":_n[0],
                                    "fix":{top:0-25,left:23},
                                    "noSetSize":true
                                },
                                "delay":500
                            },
                            "ui":{
                                "innerCls":"gridDesc",
                                "width":315,
                                "title":{
                                    "show":false,
                                    "text":MVC.Collection.gridTxtData[_n.attr("data-desc")]
                                },
                                "arrow":{
                                    "show":true,
                                    "arrowType":"left"
                                }
                            },
                            "onClose":function(){this.explainPop = null;}.bind(this),
                            "once":true
                        }
                        if(_n.offset().left + popSet.ui.width + 12 > $(document).width() ){
                            popSet.animate.config.fix = {top:0-25, left:0-3-popSet.ui.width};
                            popSet.ui.arrow.arrowType = "right";
                        }else{
                            popSet.ui.arrow.arrowType = "left";
                        }
                        this.explainPop = new pop_up(popSet);
                        this.explainPop.show();
                        popSet = null;
                    }.bind(this),
                    function(){
                        this.explainPop && this.explainPop.hide();
                        this.explainPop = null;
                    }.bind(this)
                );

                var noHiddenLi = this.totalRow.li.filter(function(){
                    return $(this).css("display")!=="none";
                });

                noHiddenLi.css("width","98px");

                var mWidth = this.totalRow.mainWidth,
                    allWidth = noHiddenLi.eq(0).outerWidth()*noHiddenLi.length,
                    sWidth;
                
                if(mWidth <= allWidth){
                    this.totalRow.ul.width(allWidth);
                }else{
                    this.totalRow.ul.width("auto");
                    sWidth = (mWidth/noHiddenLi.length)-21;

                    $.each(noHiddenLi,function(){
                        $(this).width(sWidth);
                    });

                }

                noHiddenLi = null;


            },
            /*單元格拖拽比较*/
            _setCellCompare:function(){

                var tBody = this.table.find("tbody.gridContentBody:first");
                var cells = this.table.find("tbody.gridContentBody td[nocompare='0']");


                var fX = 0,
                    fY = 0,
                    dX = 0,
                    dY = 0,
                    cellsH = false,
                    cellW = false,
                    oTag,
                    self = this;
                
                /*设定浮动层相关内容*/
                function _setTag(tag){
                    tag = $(tag);
                    cellW = tag.outerWidth()+4;
                    var o = _getCompareData(dX,dY,true);
                    _cellCompareDiv.html("<strong>"+o.yKey+"</strong><p>"+o[o.yKey]+"</p>");
                    tBody.css("cursor","help");
                }

                /*
                开始拖动
                */
                function _starDrag(ev){
                    if(!_doing){
                        return false
                    }

                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); 


                    if(cellW < _cellCompareDiv.outerWidth()){
                        cellW = _cellCompareDiv.outerWidth()+4;
                    }

                    fX = ev.pageX && ev.pageX - cellW || event.clientX - cellW;
                    fY = ev.pageY && ev.pageY - _cellCompareDiv.outerHeight() || event.clientY - _cellCompareDiv.outerHeight();
                    
                    
                    (function(ev){

                        var tX = ev && ev.pageX || event.clientX,
                            tY = ev && ev.pageY || event.clientY;
                        tY -= $(document).scrollTop();

                        setTimeout(function(){
                            var tag = $(document.elementFromPoint(tX,tY));
                            tag = tag[0].tagName !== "TD"?tag.closest("td"):tag;
                            if(tag.attr("nocompare")!= 1 ){
                                oTag = tag;
                                cells.removeClass("cellBeSelected").removeAttr("over");
                                tag.addClass("cellBeSelected");
                            }
                        },100);

                    })(ev)
                    
                    

                    return _cellCompareDiv.css({
                        left:fX+"px",
                        top:fY+"px"
                    });

                }

                /*停止拖动*/
                function _stopDrag(ev){
                    if(!_doing){
                        return false
                    }


                    $(document).unbind("mousemove,onmouseup");

                    _cellCompareDiv.css({
                        top:"-9999em",
                        left:"-9999em"
                    });

                    tBody.css("cursor","default");

                    fX = ev.pageX && ev.pageX || event.clientX;
                    fY = ev.pageY && ev.pageY - $(document).scrollTop() || event.clientY - $(document).scrollTop();

                    /*对象获取与赋值*/
                    var tmpObj = document.elementFromPoint(fX,fY),X,Y;
                    if(!tmpObj){_doing = false;return}
                    tmpObj = tmpObj.tagName.toLowerCase() === "td" ?tmpObj:$(tmpObj).closest("td")[0];
                    X = tmpObj && tmpObj.cellIndex;
                    Y = tmpObj && parseInt($(tmpObj.parentNode).attr("row"));

                    if(tmpObj && (X !== dX || Y !== dY)){

                        

                        var outObj = {"target":{},"original":{}};

                        outObj.target = _getCompareData(X,Y);
                        outObj.original = _getCompareData(dX,dY);
                        self.cellCompare.onrelease && self.cellCompare.onrelease.apply(self,[outObj,fX,fY]);
                        setTimeout(function(){
                            $(tmpObj).removeClass("cellBeSelected").removeAttr("over");
                        },800);
                        
                    }
                    _doing = false;

                }

                /*获取对比的数据*/
                function _getCompareData(x,y,r){
                    
                    var _out = {},_name = MVC.Collection.colModel[x].data;

                    if(!MVC.Collection.models[y]){
                        return false;
                    }

                    _out[_name] = MVC.Collection.models[y].attributes && MVC.Collection.models[y].attributes["y_axis"][_name] || {};
                    _out = $.extend(_out,MVC.Collection.models[y].attributes && MVC.Collection.models[y].attributes["x_axis"] || {});
                    
                    r && (_out.yKey = _name);

                    return _out;
                }

                /*单元格拖动事件绑定*/
                $.each(cells,function(i,n){
                    
                    $(n).bind("mousedown",function(ev){

                        var _dTag = ev.target,_dTagName = _dTag.tagName.toLowerCase();

                        if(_dTagName !== "a"){
                            _doing = true;
                            
                            /*原始数据*/
                            dX = this.cellIndex;
                            dY = parseInt($(this.parentNode).attr("row"));

                            _setTag(this);

                            $(document).bind("mousemove",_starDrag).bind("mouseup",_stopDrag);
                        }
                        ev.stopPropagation();

                    });

                });

            },
            _setAddParams:function(_model){
                function _getParams(addPar,par,_model){
                    for(var n in addPar){
                        var value;
                        if(typeof addPar[n] ==="string"){
                            value = addPar[n];
                            var Label = value.match(/\{.*\}/);
                            if(Label !== null){
                                Label = Label[0];
                                var name = Label.match(/([a-z]+)(_)?([a-z]+)/g);
                                var _par = "";
                                for(var _n in _model["keys"]){
                                    if(value.indexOf("|{") === -1){
                                        _par += _n+"|"+_model["keys"][_n]+",";
                                    }else{
                                         _par += _model["keys"][_n]+",";
                                    }
                                }
                                if(this.sendCondition){
                                    var _befCondition = MVC.Collection.getParams().condition;
                                    if(_befCondition){
                                        _par = _par + _befCondition;
                                    }else{
                                         _par = _par.substr(0,_par.length-1);
                                    }
                                }
                                //name = _model["keys"][name] || _model["x_axis"][name] || _model["y_axis"][name];
                                value = value.replace(Label,_par);
                            }
                        }

                        if(typeof addPar[n] ==="function"){
                            value = addPar[n]();
                        }
                        par[n] = value;
                    }
                }
                if(this.hasSub.xtype){
                    this.hasSub.params = this.hasSub.addParams && _getParams.apply(this,[this.hasSub.addParams,this.hasSub.params,_model]) || this.hasSub.params;
                }else{
                    this.hasSub[_model.nowType].params = this.hasSub[_model.nowType].addParams && _getParams.apply(this,[this.hasSub[_model.nowType].addParams,this.hasSub[_model.nowType].params,_model]) || this.hasSub[_model.nowType].params;
                }
                return this.hasSub.xtype && this.hasSub.params || this.hasSub[_model.nowType].params;
            },
            /*显示sub grid*/
            toggleSub:function(tr,i,el){
                var _model = MVC.Collection.getModelDataAt(i);
                var subS;
                var now;
                var me = this;
                if(!_model){return false};
                /*配置按钮样式*/
                var subOpen = function(){
                    _model.nowType = el.attr("data-stype");
                    this.nowRow = i;
                    if(!this.hasSub.xtype){
                        $.each(_model.dom, function(k,v){
                            $(v).removeClass("sub" + $(v).attr("data-stype") + "IconOpen").addClass("sub" + $(v).attr("data-stype") + "IconClose");
                        });
                        el.removeClass("sub" + _model.nowType + "IconClose").addClass("sub" + _model.nowType + "IconOpen");
                    }
                    _model.dom.removeClass("open").addClass("close");
                    el.removeClass("close").addClass("open");
                    _model.dom.attr("data-sub","close");
                    el.attr("data-sub","open");
                    _model.dom.addClass("subIsShow");
                    _model.trDom.addClass("subIsShow").show();
                    _model.sub.subIsShow = true;
                    if(Clicki.Balance){
                        Clicki.Balance();
                    }

                };
                var subClose = function(){
                    if(!this.hasSub.xtype){
                        $.each(_model.dom, function(k,v){
                            $(v).removeClass("sub" + $(v).attr("data-stype") + "IconOpen").addClass("sub" + $(v).attr("data-stype") + "IconClose");
                        });
                    }
                    _model.dom.removeClass("open").addClass("close");
                    _model.dom.attr("data-sub","close");
                    _model.dom.removeClass("subIsShow");
                    _model.trDom.removeClass("subIsShow").hide();
                    _model.sub.subIsShow = false;
                };
                /*初始化子模块*/
                var subInit = function(){
                    _model.nowType= el.attr("data-stype");
                    subS = this.hasSub.xtype && _model.sub || _model.sub[_model.nowType];
                    /*有缓存，直接update*/
                    if(subS){
                        if(this.hasSub.xtype){
                            _model.sub.config.alwaysRefresh && _model.sub.reflash(false,true,this._setAddParams(_model));
                        }else{
                            _model.sub[el.attr("data-stype")].config && _model.sub[el.attr("data-stype")].config.alwaysRefresh && _model.sub[el.attr("data-stype")].reflash(false,true,this._setAddParams(_model));
                        }
                    }
                    /*没有，格式化，实例化*/
                    if(!subS){
                        var subSet;
                        if(this.hasSub.xtype){
                            subSet = this.hasSub;
                            subSet.target = subSet.id = tr.find("div:first").attr("id");
                        }else{
                            _model.nowType = el.attr("data-stype");
                            subSet = $.extend({},this.hasSub[_model.nowType]);
                            _model.sub = _model.sub || {};
                            var _id = tr.find("div:first").attr("id");
                            subSet.target = subSet.id = _id.substr(0,_id.lastIndexOf("_"))+"_"+_model.nowType;
                        }

                        this._setAddParams(_model);

                        subSet.params = (function(that){
                            var params = subSet.params?subSet.params:MVC.Collection.params;
                            return $.extend({},params);
                        })(this);

                        subSet.url = (function(that){
                            var url = subSet.url?subSet.url:MVC.Collection.url;
                            return url;
                        })(this);

                        subSet.originalConfig = (function(that){
                            var params = subSet.params?subSet.params:MVC.Collection.params;
                            return $.extend({},params);
                        })(this);

                        require.async([subSet.xtype],function(sub){
                            if(_model.sub){
                                _model.sub[_model.nowType] = sub.init(subSet);
                                subSet = null;
                            }else{
                                _model.sub = sub.init(this.hasSub);
                            }
                        }.bind(this));
                    }
                };
                /*检查缓存以及隐藏和显示模块*/
                var subCache = function(){
                    if(_model.sub[_model.nowType]){
                        /*隐藏现有模块*/
                        now = _model.sub[_model.nowType];
                        now = now.config && now.config.id || now.el;
                        now = (now.nodeType || now.selector) && $(now) || $("#"+now);
                        now.hide();
                        now = _model.sub[el.attr("data-stype")];
                        /*如果有缓存，显示模块*/
                        if(now){
                            now = now.config && now.config.id || now.el;
                            now = (now.nodeType || now.selector) && $(now) || $("#"+now);
                            now.show();
                            return;
                        }
                        now = null;
                    }
                    /*没有模块*/
                    subInit.call(me);
                };
                /*判断是否点击同一按钮*/
                if(this.nowRow !== i && el.attr("data-sub") !== "open"){
                    subCache.call(me);
                }else if(_model.nowType !== el.attr("data-stype") && el.attr("data-sub") !== "open"){
                    subCache.call(me);
                }else{
                    if(_model.sub.subIsShow){
                        subClose.call(me);
                        return this;
                    }
                }
                subOpen.call(me);
                
                
            },
            /*sub 相关设定*/
            bindSub:function(){
                this.table.find("tbody.gridContentBody:first > tr:nth-child(odd)").each(function(i,n){
                   var data = MVC.Collection.getModelDataAt(i);
                   data.dom = $(n).find("img[data-sub]");
                   data.trDom = $(n).next();
                   data.dom && data.dom.each(function(_i,_n){
                       $(_n).bind("click",function(event){
                            var target = $(event.target);
                           this.toggleSub(data.trDom,i,target);
                           event.stopPropagation();
                           return false;
                       }.bind(this));
                   }.bind(this));

               }.bind(this));
            },
            /*跳转*/
            gotoPage:function(i,msg){
                if(i === this.nowPage){
                    return false;
                }
                MVC.Collection.getData(i, null, true);
            },
            /*上一页*/
            prevPage:function(){
                if(this.nowPage === 1){
                    alert(LANG("已经是第一页"))
                }else{
                    this.gotoPage(this.nowPage-1);
                }
            },
            /*下一页*/
            nextPage:function(){
                if(this.nowPage === this.allPage){
                    alert(LANG("已经是最后一页"))
                }else{
                    this.gotoPage(this.nowPage+1);
                }
            },
            /*文本溢出处理*/
            _setEllipsis:function(re){

                if(re || !this.realColWidth){
                    /*首次生成后即不再获取单元格宽度。如果需要做自适应则每次在window.resize后都要重新去获取宽度并重新赋值。*/
                    var _thDivs = this.table.find("tbody.gridHeadContent:first div:gt(0)").filter(function(){return $("div", this).length == 1;});
                    this.colLen = this.colModel.length;
                    this.colLen = this.colLen;
                    /*单元格实际宽度*/
                    this.realColWidth = {};
                    /*获取单元格实际宽度*/

                    $.each(this.colModel,function(i,n){
                        if(n.width){
                            this.realColWidth[i] = n.width; //_thDivs.eq(i).outerWidth();
                        }else{
                            
                        }
                    }.bind(this));

                    $.each(_thDivs,function(i,n){
                        $(n).css("position","relative");
                    }.bind(this));
                }
                
                var _tdDivs = this._getTheDivs();

                this.tdDivs = _tdDivs;
                this.thDivs = this.thDivs || _thDivs;
                
                return;
                /*赋值*/
                $.each(_tdDivs,function(i,n){
                    var _i = i % this.colLen;
                    $(n).width(this.realColWidth[_i] || this.defCellWidth);
                }.bind(this));

                
            },
            _getTheDivs:function(){
                var _tdDivs;
                if(this.hasSub){
                    _tdDivs = this.table.find("tbody.gridContentBody:first > tr td:not(:first-child)>div:not(:empty)");
                }else{
                    _tdDivs = this.table.find("tbody.gridContentBody:first tr > td:not(:first-child)>div:not(:empty)");

                }

                return _tdDivs;
            },
            /*重置分页*/
            resetPage:function(){
                if (MVC.View.pageView){
                    MVC.View.pageView.render(this.pageInfo);
                    this.nowPage = MVC.View.pageView.info.page;
                }
            },
            /*colModel相关处理*/
            _setColModel:function(){
                var bds = this.table.find("tbody.gridContentBody:first"),
                    self = this,
                    allTd = bds.find("td"),
                    allCtrlBox = bds.find("td span[class]"),
                    xModuleDiv = allCtrlBox.parent(),
                    trs = bds.find("tr").filter(function(i){
                        return $("td",this).length > 1;
                    }),
                    tds;

                $.each(trs,function(i,n){
                    var _tr = $(n);
                    tds = _tr.find("td:gt(0)");
                    var rowColModel = self.rowModel && self.rowModel[i] || null;
                    $.each(tds,function(j,k){
                        if(self.colModel[j].xModule){
                            /*
                            TODO 增加listener字段存储事件类型与相关函数
                            */
                            var _rcModel = rowColModel && rowColModel.colModel && rowColModel.colModel[j] && rowColModel.colModel[j].xModule;
                            var fnType = _rcModel && _rcModel.fnType 
                                        || self.colModel[j].xModule.fnType 
                                        || "click",
                                _xModule = _rcModel || self.colModel[j].xModule,
                                ctrlBox = $(k).find("span[class]"),
                                theTd = $(k),
                                fn = _xModule.fn && _xModule.fn.bind(self) 
                                    || function(event){


                                        trs.attr("isSelected",false);/*.removeClass("hasBeenSelected")*/
                                        /*
                                        allCtrlBox.hide();
                                        ctrlBox.show();
                                        */


                                        var xtype = $(event.target).attr("data-xtype"),realType;

                                        _xModule[xtype].event = event;
                                        _xModule[xtype].data = MVC.Collection.getModelDataAt(i);
                                        _xModule[xtype].afterClose = function(){
                                            _tr.attr("isSelected",false);/*.removeClass("hasBeenSelected");ctrlBox.hide();*/
                                            
                                        }
                                        realType = _xModule[xtype].type || xtype;
                                        _xModule[xtype].beforeUpdate = function(){
                                            $.each(self.readyModule,function(n,v){
                                                v.hide && v.hide();
                                            });
                                        }
                                        if(!this.xModule[realType]||!this.readyModule[xtype]){
                                            require.async([realType],function(xModule){
                                                this.xModule[realType] = xModule;
                                                this.readyModule[xtype] = xModule.init(_xModule[xtype]);
                                            }.bind(this));
                                        }else{
                                            if(this.readyModule[xtype] && this.readyModule[xtype].update){
                                                this.readyModule[xtype].update(_xModule[xtype]);
                                            }else{
                                                this.xModule[realType].init(_xModule[xtype]);
                                            }
                                        }
                                        _tr.attr("isSelected",true);/*.addClass("hasBeenSelected")*/
                                        event.stopPropagation();

                                        return false;

                                    }.bind(self);
                            /*
                            _tr.hover(
                                function(){
                                    _tr.attr("isSelected") != "true" && ctrlBox.show();
                                },
                                function(){
                                    _tr.attr("isSelected") != "true" && ctrlBox.hide();
                                }
                            );
                            */
                            theTd.find("*[data-xtype]").unbind().bind(fnType,fn);
                        }
                        
                    });
                    
                });

            },

            /*操作列隐藏处理*/
            _setCtrlBox:function(){
                var bds = this.table.find("tbody.gridContentBody:first"),
                    self = this,
                    trs = bds.find("tr").filter(function(i){
                        return $("td",this).length > 1;
                    }),
                    xModuleTd = bds.find("td[data-ctype]"),
                    xModuleDiv = xModuleTd.children(),
                    allCtrlBox = xModuleDiv.children();

                /*把每行第一列单元格右边框去掉*/
                $.each(trs,function(i,n){
                    var _tr = $(n);
                    firstTd = _tr.find("td:eq(1)");
                    firstTd.css("border-right","none");

                });
                /*操作单元格样式修改*/
                var width = (allCtrlBox[0]?allCtrlBox[0].children.length:0)*26;
                xModuleTd.css({
                    "padding":"0 7px 0 0",
                    "width": width,
                    "border-left":"none"
                });

                if(allCtrlBox[0] && allCtrlBox[0].children.length > 3){
                    xModuleTd.css({
                        "width": "25px"
                    });
                    xModuleDiv.addClass("xModule");
                    allCtrlBox.addClass("theCtrlListF");
                    /*增加隐藏和现实的动画效果*/
                    $(".theCtrlListF").hover(function(){
                        var changeWidth = ($(this).children().length)*26;
                        clearTimeout(parseInt($(this).attr("time")));
                        $(this).attr("time","");
                        $(this).css({
                            "background-color":"rgba(255,255,255,0.8)"
                        });
                        $(this).stop().animate({"width": changeWidth},100);
                    },function(){
                        $(this).attr("time",setTimeout(function(){
                            $(this).css("background", "none");
                            $(this).stop().animate({"width": "23px"},100);
                        }.bind(this),500));
                    });
                }
            },

            /*rowModel相关处理*/
            _setRowModel:function(){
                var trs = this.table.find("tbody.gridContentBody:first").find("tr").filter(function(i){
                    return $("td",this).length > 1;
                }),self = this;
                var data = this._getCollection().getAllModelData(),
                    rowModel = this.rowModel;
                if(!rowModel[0].key){
                    $.each(this.rowModel,function(i,n){
                        if(n && n !== null){
                            var tag = trs.eq(i);
                            n.cls && tag.addClass(n.cls);
                            if(n.cols){
                                var els = tag.find(n.cols.els);
                                $.each(els,n.cols.evn);
                            }
                        }
                    });
                }else{
                    $.each(trs,function(i,n){
                        var tr = $(n);
                        var match = 0;
                        for(var n in data[i].keys){
                            for(var j=0;j<rowModel.length;j++){
                                if(rowModel[j] && rowModel[j].key.name === n && rowModel[j].key.value == data[i].keys[n]){
                                    rowModel[j].cls && tr.addClass(n.cls);
                                    if(rowModel[j].cols){
                                        var els = tr.find(rowModel[j].cols.els);
                                        $.each(els,rowModel[j].cols.evn);
                                    }
                                }
                            }
                        }
                    });
                }
            },
            /*设定min chart*/
            _setMinChart:function(){
                this.minChartEls = this.table.find("div.minChartH");
                var total = MVC.Collection.getValueTotal();
                var setp = 400;
                $.each(this.minChartEls,function(i,n){
                    var tag = $(n);
                    setTimeout(function(){
                        var em = tag.find("em:first");
                        em.animate({
                            "width":((parseFloat(em.text())/total)*100)+"%"
                        },500);
                    },setp*i);
                });
            }
        });

        /*表头视图*/
        var headView = Backbone.View.extend({
            el:null,
            tagName:"th",
            doms:null,
            sort:this.config.sort,
            defOrder:config.defOrder,
            colModel:config.colModel,
            setView:function(){
                var _el = $(MVC.View.mainView.el).find("tbody.gridHeadContent:first");
                this.el = _el;
                if(this.colModel && this.sort){
                    this.doms = _el.find("th:gt(0)");
                    this.bindTh();
                }
            },
            /*表头事件绑定*/
            bindTh:function(){
                $.each(this.doms,function(i,n){
                    var _th = $(n);
                    if(this.colModel[i] && this.colModel[i].data !== null){
                        var thModel = this.colModel[i];
                        /*显示默认排序状态*/
                        if(thModel.data == this.defOrder){
                            _th.addClass("showGridState");
                        }
                        /*默认启用排序，如果列头和返回的数据的y轴匹配，进行排序*/
                        var thData = MVC.Collection.getModelDataAt(0).y_axis;
                        var _thSort = thData && _.keys(thData);
                        /*排序*/
                        if(/undefined/.test(thModel.sort) || thModel.sort){
                            if(_.include(_thSort,thModel.data) || thModel.sort){
                                //默认降序
                                var type = (!thModel.sort || thModel.sort.type === "asc")?false:true;
                                thModel.sort = {"type":type};
                                var btn = $("<em class=\"gridSortType"+(type?"Asc":"Des")+"\">"+(type?"↓":"↑")+"</em>");
                                _th.css({"cursor":"pointer"}).find("div:first").append(btn);

                                _th.bind("click",function(ev){
                                    this.doSort(i,thModel.sort.type,btn,thModel);
                                    $(this.doms).removeClass("showGridState");
                                    _th.addClass("showGridState");
                                }.bind(this));
                                _th.hover(
                                    function(){
                                        _th.addClass("showGridFnIcon");
                                    },
                                    function(){
                                        _th.removeClass("showGridFnIcon");
                                    }
                                );
                            }
                        }
                    }
                }.bind(this))
            },
            doSort:function(i,type,btn,thModel){
                var _type =type?-1:1,inner = type?"↑":"↓";
                //sort=pageviews:-1

                var sort = MVC.Collection.getColName(i)+"|"+_type;

                MVC.Collection.setParams({page:1,order:sort});
                MVC.Collection.getData(null,function(){
                    btn.removeClass().addClass("gridSortType"+(type?"Asc":"Des")).html(inner);
                    thModel.sort.type = !thModel.sort.type;
                },true); 
            }
        });

        /*分页视图*/
        var pageView = Backbone.View.extend({
            tagName:"div",
            className: 'grid-page',
            buttons: null,
            buttonCon: null,
            info:getInfo,

            initialize: function(){
                this.$el.appendTo(this.options.target);
            },
            build: function(){
                var i = 0, info = this.info;
                var html = "<span>"+LANG("共")+info.pages+LANG("页")+"，"+LANG("共")+info.total+LANG("条记录")+"</span>";
                if (info.showButton) html += "<a href='#' key='first'>"+LANG("首页")+"</a><a href='#' key='previous'>"+LANG("上一页")+"</a>";
                html += '<em>';
                while (i++ < info.pageNums){
                    html += '<a href="#"" key="page"></a>';
                }
                html += '</em>';
                if (info.showButton) html += "<a href='#' key='next'>"+LANG("下一页")+"</a><a href='#' key='last'>"+LANG("尾页")+"</a>"+'<input class="jumpto" type="text" maxlength="'+(info.pages.toString()).length+'" /><a href="#" key="go">跳转</a>';
                this.$el.append(html);
                this.buttons = this.$el.find('a');
                this.buttonCon = this.$el.find('em');
                var me = this;

                this.buttons.click(this.onClick);
            },

            render:function(pageInfo){
                var start, end, maxPage = 20, info = this.info;
                info.total = pageInfo.total || info.total;
                info.size  = pageInfo.size || info.size;
                info.pages = Math.ceil(info.total / info.size);
                info.page  = Math.min(info.pages, Math.max(1, pageInfo.page));
                
                switch (true){
                    case (info.pages > 1000): maxPage = 5; break;
                    case (info.pages > 100): maxPage = 10; break;
                    case (info.pages > 10): maxPage = 10; break;
                }
                maxPage = Math.min(info.size, maxPage);
                var halfPage = Math.floor(maxPage/2);
                start = info.page - halfPage;
                if (start < 1){
                    start = 1;
                    end = start + maxPage - 1;
                }else {
                    end = info.page + (maxPage - halfPage - 1);
                }
                if (end > info.pages){
                    end = info.pages;
                    start = Math.max(1, end - maxPage + 1);
                }
                if(pageInfo.page>end){
                    end = pageInfo.page;
                    info.page = pageInfo.page;
                }
                
                info.pageNums = maxPage;
                info.start = start;
                info.end   = end;
                info.showButton = (start > 1 || end < info.pages);

                if (!this.buttons) this.build();
                this.update();
            },

            // 更新分页状态
            update: function(){
                var info = this.info;
                var btns = this.buttons.filter('[key="first"],[key="previous"]');
                if (info.page <= 1){
                    btns.css({cursor:'default', color:'#aaa'});
                }else {
                    btns.attr('style', '');
                }
                btns = this.buttons.filter('[key="next"],[key="last"]');
                if (info.page >= info.pages){
                    btns.css({cursor:'default', color:'#aaa'});
                }else {
                    btns.attr('style', '');
                }
                btns = this.buttons.filter('[key="page"]').hide();
                var idx = 0, btn;
                for (var i=info.start; i<=info.end; i++){
                    btn = btns.length > idx ? btns.eq(idx++) : $('<a href="#"" key="page"></a>').appendTo(this.buttonCon);
                    btn.text(i).attr('page', i).css('display', 'inline').toggleClass('act', i == info.page);
                }
                if (idx > btns.length){
                    this.buttons = this.$el.find('a');
                }
                var _html = LANG("共")+info.pages+LANG("页")+"，"+LANG("共")+info.total+LANG("条记录");
                //console.log(this.el.find("span"))
                this.$el.find("span").html(_html);
                //$('.G-tableSet .theTableBox .theGridFooter .grid-page span').html(_html);
            },

            // 分页点击事件
            onClick: function(evt){
                var me = MVC.View.pageView;
                var info = me.info;
                var page = 0;
                var error = null;
                switch ($(this).attr('key')){
                    case 'first':
                        if (info.page <= 1){
                            error = LANG("已经是第一页");
                        }else {
                            page = 1;
                        }
                    break;
                    case 'previous':
                        if (info.page <= 1){
                            error = LANG("已经是第一页");
                        }else {
                            page = info.page - 1;
                        }
                    break;
                    case 'next':
                        if (info.page >= info.pages){
                            error = LANG("已经是最后一页");
                        }else {
                            page = info.page + 1;
                        }
                    break;
                    case 'last':
                        if (info.page >= info.pages){
                            error = LANG("已经是最后一页");
                        }else {
                            page = info.pages;
                        }
                    break;
                    case 'page':
                        page = parseInt($(this).attr('page'));
                    break;
                    case 'go':
                        var goToPage = me.$el.find("input.jumpto").val();
                        if(goToPage.match(/^[1-9]+[0-9]*$/g)){
                            if(goToPage> info.pages){
                                error = "输入不正确";
                            }else if(goToPage< 1){
                                error = "输入不正确";
                            }else{
                                page = goToPage;
                            }
                        }else{
                            error = "输入不正确";
                        }
                    break;
                }
                if (error){
                    alert(error);
                }else if (page > 0){
                    if(page !== info.page){
                    	info.page = page;
                    	MVC.View.mainView.gotoPage(page);
                    }
                    // me.update();
                    me.$el.find("input.jumpto").val("");
                }
                $("#selAll").prop("checked", false);
                return false;
            }
        });

        /*生成*/
        this.Model = MVC.Model = new innnerModel;
        this.Collection = MVC.Collection = new innerCollection;
        this.View = MVC.View = {
            headView:new headView,
            pageView:null,
            mainView:new mainView
        }

        /*数据获取与初始化开始*/
        this.Collection.getData(null,this.callback);

    }

    grid.prototype = grid.prototype.fn = {
        /*刷新
            cbFn,刷新后的回调函数;
            resetPage,是否重置分页
        */
        reflash:function(cbFn,resetPage,params){
            params && this.Collection.setParams(params);
            this.Collection.getData(null,cbFn,resetPage);
        },
        refresh:function(config,callback){
            this.update(config.data,true,callback);
        },
        update:function(params,resetPage,cbFn){
            this.reflash(cbFn,resetPage,params);
        },
        /*下一页*/
        nextPage:function(){
            this.View.mainView.nextPage();
        },
        /*前一页*/
        prevPage:function(){
            this.View.mainView.prevPage();
        },
        /*第一页*/
        firstPage:function(){
            this.View.mainView.gotoPage(1);
        },
        /*最后页*/
        finalPage:function(){},
        /*跳至指定页*/
        toPage:function(i){
            this.View.mainView.gotoPage(i);
        },
        /*显示SUB*/
        showSub:function(i){
        },
        /*隐藏SUB*/
        hideSub:function(){
            this.Collection.models[i].attributes.dom.hide();
        },
        /*显示遮罩*/
        showMark:function(){},
        /*隐藏遮罩*/
        hideMark:function(){},
        hide:function(){},
        show:function(){},
        destroy:function(){
            this.onDestroy();
            this.View.mainView.indicator && this.View.mainView.indicator.destroy();
            $(this.View.mainView.el).find("*").unbind();
            this.mark && this.mark.remove();
            $(this.View.mainView.el).empty();
            $.each(this,function(n,v){
                this[n] = null;
                delete this[n];
            }.bind(this));
            window.CollectGarbage && CollectGarbage();
        }
    }

    /*路由转化*/
    function routerTransform(){
        /*
        router: {
            model: "feed",
            defaultAction: "group",
            type: null
        }
        */
        var BU = window["BU"] || "";
        var type = this.config.router["type"] === null?false:this.config.router["type"];
        var _url = BU+this.config.router["model"]+"/"+this.config.router["defaultAction"]+(type?("/"+type):"");
        this.config.url = _url;
    }


    return {
        name:"Grid View",
        init:function(config,callback){
            /*现在，colModel为必要条件了*/
            if(!config.colModel){return false;}
            config.target = config.target?config.target:config.parent;
            if(!config.target){
                window.console && console.error(LANG("未指定关键参数。"));
                window.console && console.log(config);
                return false;
            }
            config = $.extend({},config);
            var newGridView =  new grid(config,callback);
            return newGridView;
        }
    }
});