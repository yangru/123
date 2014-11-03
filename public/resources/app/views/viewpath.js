(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var $ = window.$ || require("jquery")
        ,base = require("base")
        ,scroller = require("scroller")
        ,pop_up = require("pop_up");

    function xPATH(config){

        this.config = $.extend({
            tpl:{
                "reportLi":'<li data-id="{id}">{text}</li>',
                "chartBar":'<div class="column the{i}"><div><p><strong>{num}</strong><span>{pre}%</span></p><div></div></div></div>',
                //<em class="col_add" data-type="columns" data-do="add" data-index="{index}">+</em>
                "overviewDD":'<li><em class="col_del" data-type="columns" data-do="del" data-index="{index}"></em><label>{text}</label><span>{num}({pre}%)</span></li>',
                "overviewDT":'<dt><em data-type="rows" data-do="del"></em><span>{text}</span><b></b></dt>',
                "detailDD":'<li><span>{num}</span><em>{pre}%</em></li>',
                "detailDL":'<dl class="Ex_reportDetail"></dl>',
                "chartArow":'<div style="left:{pos}px;" class="betweenColumn"><div>{pre}<sup>%</sup></div><ul><li data-dat="{data}"></li><li></li><li></li><li></li></ul></div>',
                "chart":'<div class="column" style="left:{ipx}px" data-index="{ix}"><div><p><strong>{num}</strong><span>{pre}%</span></p><div style="height:{cHeight}" data-num="{num}" data-to="{to}"></div></div></div>'
            },
            /*接口*/
            port:{
                get:{
                    params:{},
                    url:"/sources/temp/lb_v.json"
                },
                save:{
                    params:{},
                    url:"/"
                }
            },
            showChartTotal:false,
            /*当前报告名 ?*/
            report:"report00001",
            /*当前报告id ?*/
            reportId:10086
        },config);

        /*dom缓存*/
        this.doms = {
            main:$("#"+this.config.id),
            ctrler:null,
            chart:null,
            table:null,
            other:{

                reportListBar:null,

                dropdownList:null,

                reportTitle:null,
                reportSubTitle:null,

                addReport:null,
                addCol:null,
                addRow:null
            }
        }

        this.scroller = null;
        
        /*数据缓存*/
        this.data = null;

        this.warningPop = {
            "type":{
                "html":'<div class="warnTip"></div>'
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
            "scope":this,
            onDone:function(){
                var type = this.data.type === "columns" && "delColumn" || "delRow";
                this.scope.parent[type](this.data);
            },
            beforeShow:function(msg){
                !this.doms.wTip && (this.doms.wTip = this.doms.inner.find(".warnTip"));
                this.doms.wTip.html(msg);
            },
            "data":null,
            "ready":false
        };

        this.loadingCache = {};
        this.realData = {};
        this.ready = false;

        if(this.doms.main.length){
            this.init();
        }else{
            this.fn.fail();
        }
    }

    xPATH.prototype = {
        /**
         * 构造基本结构等
         * @return {Undefined} 无返回
         */
        init:function(){
            this.fn.buildBase.call(this);
            this.fn.bindEvent.call(this);
        },
        /**
         * 内部方法集,不直接对外
         */
        "fn":{
            /**
             * 数据存储
             */
            setGrid:function(){

                this.fn.showReport.call(this);
                this.config.showChartTotal && this.doms.chart.append(base.tpl.repLabel(this.config.tpl.chart,1,{
                    "ipx":0,
                    "pre":100,
                    "num":this.data.total,
                    "cHeight":0,
                    "to":286
                }));
            },
            animate:{
                chart:function(tag,btColumn){
                    $.each((tag || this.doms.chart.find("div[data-to]")),function(){
                        $(this).animate({
                            "height":+($(this).attr("data-to"))
                        },400);
                    });

                    (btColumn || this.doms.chart.find(".betweenColumn")).show(400);
                }
            },
            /*隐藏报告*/
            hideReport:function(){
                this.doms.other.reportTitle.text(this.data.title).hide();
                this.doms.other.reportSubTitle.text(this.data.sub_title).hide();
                this.doms.table.hide();
                this.doms.chart.hide();
            },
            /*显示报告*/
            showReport:function(){
                var animSet = [{opacity:"show"},300]
                this.doms.other.reportTitle.text(this.data.title).animate(animSet[0],animSet[1]);
                this.doms.other.reportSubTitle.text(this.data.sub_title).animate(animSet[0],animSet[1]);
                this.doms.table.animate(animSet[0],animSet[1]);
                this.doms.chartOutBox.animate(animSet[0],animSet[1]);
            },
            /*基本构造*/
            buildBase:function(){
                this.doms.ctrler = this.doms.main.find(".Ex_reportCtrler:first");
                this.doms.chartOutBox = this.doms.main.find(".Ex_reportChartOuterBox:first");
                this.doms.chart = this.doms.main.find(".Ex_reportChart:first");
                this.doms.chartY = this.doms.chartOutBox.find(".Ex_reportChartY");
                this.doms.table = this.doms.main.find(".Ex_reportTable:first");
                this.doms.tableOverview = this.doms.table.find(".Ex_reportOverview:first");
                this.doms.tableOverviewContent = this.doms.tableOverview.find("ul");
                this.doms.tableFooter  =this.doms.table.find(".Ex_reportFooter:first");
                this.doms.other.addCol = this.doms.tableOverview.find(".Ex_repAddColsBnt:first");
                this.doms.other.addRow = this.doms.tableFooter.find(".Ex_repAddRowBnt:first");

                //TODO 如果没报告则不显示chart,table,title,subTitle,reportListBar
                this.doms.other.reportTitle = this.doms.ctrler.children("h2:first");
                this.doms.other.reportSubTitle = this.doms.ctrler.children("p:first");
                this.doms.other.reportListBar = this.doms.ctrler.find(".Ex_reportSelector:first");
            },
            addNewReport:function(){
            },
            /*事件绑定*/
            bindEvent:function(){

                this.doms.table.find("em[data-do]").die("click").live("click",function(ev){
                    var tag = $(ev.target);
                    var type = tag.attr("data-type"),
                        action = tag.attr("data-do"),
                        index = +(tag.attr("data-index"));

                    switch(action){
                        case "del":
                            if(!this.warningPop.ready){
                                this.warningPop = new pop_up(this.warningPop);
                                this.warningPop.ready = true;
                            }
                            this.warningPop.data = {"type":type,"index":index};
                            this.warningPop.show(
                                LANG("确定要删除吗？")
                            );
                        break;

                        case "add":
                            var addPop = this.parent.fn._showAddReportUrlPop.call(this.parent,1)
                                ,offset = tag.offset();
                            addPop.show(null,0);
                            addPop.$el.css({
                                "top":offset.top+tag.outerHeight()-23
                                ,"left":offset.left+21
                                ,"display":"none"
                            }).show(400);
                        break;
                    }
                }.bind(this));

                this.doms.chart.find(".column").live(
                    "mouseenter"
                    ,function(){
                        $(this).addClass("columnOver");
                    }
                )
                .live(
                    "mouseleave"
                    ,function(){
                        $(this).removeClass("columnOver");
                    }
                );

                this.doms.chart.find(".betweenColumn")
                .live(
                    "mouseenter"
                    ,function(){
                        $(this).addClass("betweenColumnOver");
                    }
                )
                .live(
                    "mouseleave"
                    ,function(){
                        $(this).removeClass("betweenColumnOver");
                    }
                );
            },
            warning:function(){},
            addCell:function(config){},
            /*添加行*/
            buildRow:function(i,data){

                function loop(i,arr,addTag,tpl,type,chart){
                    var html = '';
                    for(var k=i;k<arr.length;k++){
                        var _pre = ((arr[k].sessions/this.data.max)*100).toFixed(2),
                            //((arr[k].sessions/this.model.necessary.pv.value)*100).toFixed(2)
                            showPre = ((arr[k].sessions/maxPv)*100).toFixed(2);
                        _pre = isNaN(_pre)?0:_pre;
                        _pre = _pre == "100.00" ? 100 : _pre;
                        html += base.tpl.repLabel(
                            tpl?tpl:(!k && this.config.tpl.overviewDT || this.config.tpl.detailDD),
                            1,
                            {
                                "text":arr[k].text,
                                "num":arr[k].sessions,
                                "index":k,
                                "pre":_pre
                            }
                        )
                        if(chart && !this.doms.chart.find(".column[data-index='"+(k+1)+"']").length){
                            this.doms.chart.append(base.tpl.repLabel(this.config.tpl.chart,1,{
                                "ix":k+1,
                                "ipx":60+160*k,
                                "pre":_pre,
                                "num":arr[k].sessions,
                                "cHeight":0,
                                "to":Math.ceil((showPre*286)/100)
                            }));

                            if(arr.length>1 && k !== arr.length-1){
                                //_pre = ((arr[k+1].sessions/this.model.necessary.pv.value)*100).toFixed(2);
                                _pre = ((arr[k+1].sessions/this.data.max)*100).toFixed(2);
                                _pre = isNaN(_pre)?0:_pre;
                                _pre = _pre == "100.00" ? 100 : _pre;
                                this.doms.chart.append(
                                    base.tpl.repLabel(
                                        this.config.tpl.chartArow,1
                                        ,{
                                            "pre":_pre
                                            ,"pos":133+160*k
                                            ,"data":JSON.stringify(arr[k])
                                        }
                                    )
                                );
                            }
                        }
                    }
                    addTag[type || "before"](html);
                }

                function fixFooter(){
                    var now = this.doms.tableFooter.find("dd[data-type='empty']").length;
                    var L1 = this.data.columns.length-now;
                    for(var i = 0;i<L1;i++){
                        this.doms.tableFooter.append('<dd data-type="empty"></dd>');
                    }
                }
                var newDl
                    ,maxPv = 0;
                if(i===-1){

                    this.doms.other.reportDetails = {};
                    // if(this.model.attributes.columns.length === 5){
                    //     this.parent.doms.addUrl.parent().hide();
                    // }
                    for(var j = 0;j<data.length;j++){
                        if(!data[j].length){
                            break;
                        }

                        if(!j){
                            newDl = this.doms.other.addCol.parent();
                            maxPv = _.max(data[j],function(data){return data.sessions}).sessions;

                            for(var l=0;l<data[j].length;l++){
                                this.realData[l] = data[j][l];
                            }

                            this.data.max = maxPv;

                            loop.apply(this,[0,data[j],this.doms.tableOverviewContent,this.config.tpl.overviewDD,"append",true]);

                            var nowWidth = 161*data[j].length;

                            this.data.contentWidth = nowWidth>805?805:nowWidth;

                            this.doms.tableOverviewContent.parent().parent().css(
                                "width"
                                ,this.data.contentWidth+"px"
                            );

                            this.doms.tableOverviewContent.width(nowWidth);

                            !this.scroller && this.fn.buildScroller.call(this,data[j].length);
                            this.ready && this.scroller.doLayout(1);
                            // this.doms.tableOverviewContent.find("em").each(function(j,n){
                            //     $(this).attr("data-index",j);
                            // });
                        }else{
                            newDl = $(this.config.tpl.detailDL);
                            this.doms.other.reportDetails[(j-1)] = newDl;
                            loop.apply(this,[0,data[j],newDl,false,"append"]);
                            newDl.find("dt > em").attr("data-index",j-1);
                            this.doms.tableFooter.before(newDl);
                        }
                    }
                    
                    this.fn.setY.call(this,true);
                    yNumStr = prvN = null;

                    //fixFooter.call(this);
                    this.fn.animate.chart.call(this);
                }else{
                    newDl = $(this.config.tpl.detailDL);
                    loop.apply(this,[0,data[0],newDl,false,"append",false]);
                    newDl.find("dt > em").attr("data-index",this.data.rows.length-1);
                    this.doms.tableFooter.before(newDl);
                    this.doms.other.reportDetails[this.data.rows.length-1] = newDl;
                }
                //Clicki.Balance();
            },
            fail:function(){
                window.console && console.log("//(ㄒoㄒ)//你妹~！");
            },
            buildRPT:function(){
                var data = this.model.necessary.sourcelist.value,
                    str="";

                function loop(str,data){
                    var L1 = data.length;
                    for(var i=0;i<L1;i++){
                        var hasChild = +(!!data[i].hasChild || data[i].items && data[i].items.length || 0),
                        data2 = data[i].items && data[i].items.length && data[i].items,
                        str2 = "",
                        isFirst = i === 0,
                        isLast = (i === L1-1);
                        if(hasChild){
                            str2 = loop('<ul>',data2);
                            str2 += "</ul>";
                        }
                        str += '<li data-dim="'+data[i].dim_type+'" data-value="'+data[i].value+'" '+(hasChild && ('class="hasChild'+(isLast && " last" || isFirst && " first")+'"') || (isLast && 'class="last"' || isFirst && 'class="first"' ||''))+' data-hasChild="'+hasChild+'" data-index="'+i+'">'+data[i].name+str2+'</li>'
                    }
                    hasChild = data2 = str2 = null;
                    return str;
                }

                str = loop('<ul>',data);
                str += '</ul>';

                data = loop = null;

                return str;
            }
            ,setY:function(build){
                //span
                this.data.max = isNaN(this.data.max)?0:this.data.max;
                var yNumStr = ''
                    ,prvN = 0
                    ,numsDom = this.doms.chartY.find("span");
                /**
                 * 表格4分坐标段生成
                 */
                for(var p = 4;p>0;p--){
                    var _n = +((this.data.max*(p/4)).toFixed(1))
                        ,_p = ((p/4)*286)-1;
                    
                    if(build){
                        yNumStr += '<em style="bottom:'+_p+'px;" data-num="'+_n+'"><span>'+(_n !== prvN && _n.separated() || '')+'</span><b></b></em>';
                    }else{
                        numsDom.eq(Math.abs(p-4)).text((_n !== prvN && _n.separated() || ''));
                    }
                    
                    prvN = _n;
                }
                if(build){
                    this.doms.chartY.append(yNumStr);
                }
                
                yNumStr = numsDom = prvN = null;
            }
            ,setChartTo:function(){
                var me = this;
                $.each(this.doms.chart.find(".column div[data-to]"),function(i){
                    $(this)
                        .attr("data-to",Math.ceil(286*((((+$(this).attr("data-num"))/me.data.max)*100).toFixed(2))/100))
                        .animate({
                            "height":+($(this).attr("data-to"))
                        },400);
                });
            }
            ,buildScroller:function(len){
                !this.scroller && (this.scroller = scroller.init({
                    "id":this.doms.tableOverview.find(".Ex_reportOverviewContent:first .Ex_reportOverviewContentInner"),
                    "type":"left",
                    "height":56,
                    // "width":nowWidth,
                    "autoLayout":true,
                    "showNum":5,
                    "itemHeight":56,
                    "itemWidth":161,
                    "scrollrate":161,
                    "showScroller":true,
                    "itemsNum":len,
                    "onScroll":function(type,aniSet,aniSet2){
                        aniSet[type] = 93 + parseFloat(aniSet[type])+"px";
                        this.doms.chart.stop().animate(aniSet,100);
                    }.bind(this),
                    "onStarDrag":function(type,rr){
                        var set = {};
                        set[type] = 93+parseFloat(rr)+"px";
                        this.doms.chart.css(set);
                    }.bind(this)
                }));
                this.scroller.doLayout();
            }
        },
        /*添加新报告*/
        addNewReport:function(data){
            this.reset({
                "title":data.title,
                "sub_title":data.sub_title
            });
        },
        /*更改报告*/
        changReport:function(data){

            this.reset({
                "title":data.title,
                "sub_title":data.sub_title
            });

            if(!data.columns.length){
                this.parent.showTypeTip();
            }
            this.scroller.doLayout(true);

        },
        load:function(data){
            this.data = data;
            this.parent.addReportType.type.html = this.fn.buildRPT.call(this);
            this.fn.setGrid.call(this);
            this.ready = true;
        },
        add:function(){
            for(var n in this.data){
                if(config.data[n].length){
                    for(var i = 0;i<config.data[n].length;i++){
                        this.data[n].push(config.data[n][i]);
                    }
                }
            }
        },
        addColumn:function(data){
            if(this.data.contentWidth === undefined){
                this.data.contentWidth = 0;
            }
            var nowCW = this.data.contentWidth;

            function buildColumn(data,i,addTag,tpl,type,chart){

                newMax = _.max(dataI,function(data){return data.sessions}).sessions;
                // var _pre = ((data.sessions/this.model.necessary.pv.value)*100).toFixed(2);
                var _pre = ((data.sessions/newMax)*100).toFixed(2);
                _pre = isNaN(_pre)?0:_pre;
                _pre = _pre == "100.00" ? 100 : _pre;
                var html = base.tpl.repLabel(
                    tpl,
                    1,
                    {
                        "text":data.text,
                        "num":data.sessions,
                        "index":i,
                        "pre":_pre
                    }
                )

                addTag[type](html);

                if(this.data.contentWidth < 805){
                    this.data.contentWidth = 161*addTag.find("li").length;
                }

                if(chart){

                    var showPre = ((data.sessions/newMax)*100).toFixed(2)
                        ,__i = i-1;

                    __i = __i < 0?0:__i;

                    this.doms.chart.append(base.tpl.repLabel(this.config.tpl.chart,1,{
                        "ix":i+1,
                        "ipx":60+160*i,
                        "pre":_pre,
                        "num":data.sessions,
                        "cHeight":0,
                        "to":Math.ceil((showPre*286)/100)
                    }));

                    _pre = ((this.realData[i].sessions/newMax)*100).toFixed(2);
                    _pre = _pre == "100.00" ? 100 : _pre;
                    index && this.doms.chart.find(".column:last").before(
                        base.tpl.repLabel(
                            this.config.tpl.chartArow,1
                            ,{
                                "pre":_pre
                                ,"data":JSON.stringify(data)
                                ,"pos":133+160*(__i)
                            }
                        )
                    );
                    
                }
            }

            var addTag,newMax,dataI;
            for(var i = 0;i<data.length;i++){
                var index=data[i].length-1;
                if(!i){
                    !this.scroller && this.fn.buildScroller.call(this,data[i].length);
                    addTag = this.doms.other.addCol.parent();
                    for(var l=0;l<data[i].length;l++){
                        this.realData[l] = data[i][l];
                    }
                    dataI = data[i];
                    buildColumn.apply(this,[data[i][index],index,this.doms.tableOverviewContent,this.config.tpl.overviewDD,"append",true]);
                    this.doms.tableFooter.append('<dd data-type="empty"></dd>');
                    if(this.doms.tableOverviewContent.find("li").length > 5){
                        this.scroller.scroll(this.doms.tableOverviewContent.find("li").length);
                    }
                }else{
                    addTag = this.doms.other.reportDetails[i-1];
                    if(this.model.attributes.columns.length === 5){
                        this.parent.doms.addUrl.parent().hide();
                    }
                    buildColumn.apply(this,[data[i][index],index,addTag,this.config.tpl.detailDD,"append"]);
                }
            }

            if(newMax > this.data.max){
                this.data.max = newMax;
                this.fn.setY.call(this,0);
                this.fn.setChartTo.call(this);
                this.doms.chart.find(".betweenColumn:last").show(400);
            }else{
                this.fn.animate.chart(
                    this.doms.chart.find(".column:last div[data-to]")
                    ,this.doms.chart.find(".betweenColumn:last")
                );
            }
            this.doms.tableOverviewContent.width(161*this.doms.tableOverviewContent.find("li").length);

            if(this.data.contentWidth < 805 || nowCW < this.data.contentWidth){
                this.doms.tableOverviewContent.parent().parent().animate({
                    "width":this.data.contentWidth+"px"
                });
            }
            // if(this.model.attributes.columns.length > 5){
            //     this.parent.doms.addUrl.parent().hide();
            // }
        },
        delColumn:function(i,prevData){
            var removeObjs,nextObj;
            /*
            for(var j = 0;j<this.data.rows.length;j++){
                removeObjs = !removeObjs && this.doms.other.reportDetails[j].find("dd:eq("+i+"),dd:gt("+i+")")
                            || removeObjs.add(this.doms.other.reportDetails[j].find("dd:eq("+i+"),dd:gt("+i+")"));
            }
            removeObjs = removeObjs.add(this.doms.tableFooter.find("dd:eq("+i+"),dd:gt("+i+")"));*/
            removeObjs = this.doms.tableOverviewContent.find("li:eq("+i+")");
            removeObjs.remove();
            removeObjs = null;

            removeObjs = this.doms.chart.children(".column:eq("+(i)+")");

            nextObj = removeObjs.nextAll();

            removeObjs[
                !i && "next" || "prev"
            ]().andSelf().remove();

            var lli = this.doms.tableOverviewContent.find("li").length;
            if(lli <5){
                this.data.contentWidth = 161*lli;
                this.doms.tableOverviewContent.parent().parent().animate({
                    "width":this.data.contentWidth+"px"
                });
            }

            if(nextObj.length){
                
                $.each(nextObj,function(){
                    var tag = $(this);
                    tag.animate({
                        "left":parseInt(tag.css("left"))-160+"px"
                    });
                });

            }
            var nowWidth = 0;
            this.doms.tableOverviewContent.find("li").each(function(j,n){
                $(this).find("em").attr("data-index",j);
                nowWidth += 161;
            });
            var _max = 0
                ,_i = 0
                ,tagSessions = this.realData[i].sessions
                ,_realData = {};

            for(var n in this.realData){
                if(n == i){
                    continue;
                }
                _realData[_i] = this.realData[n];
                _max = _max < this.realData[n].sessions?this.realData[n].sessions:_max;
                _i+= 1;
            }
            
            this.realData = _realData;

            if(tagSessions === this.data.max){

                this.data.max = _max;

                this.fn.setY.call(this,0);
                this.fn.setChartTo.call(this);
            }
            this.doms.tableOverviewContent.width(nowWidth);
            this.warningPop.hide();
            // if(this.model.attributes.columns.length < 5){
            //     this.parent.doms.addUrl.parent().show();
            // }

            removeObjs = nextObj = null;
        },
        delRow:function(i){
            this.doms.other.reportDetails[i] && this.doms.other.reportDetails[i].remove();
            this.warningPop.hide();
        },
        getRows:function(data){
            this.fn.buildRow.apply(this,[-1,data]);
        },
        addRow:function(data){
            this.fn.buildRow.apply(this,[1,data]);
        },
        reset:function(data){

            this.doms.chart.children("div")
                .add(this.doms.tableOverviewContent.find("li"))
                .add(this.doms.tableFooter.find("dd"))
                .add(this.doms.table.find(".Ex_reportDetail"))
                .add(this.doms.chartY.find("em"))
                .remove();

            data && this.doms.other.reportTitle.text(data.title);
            data && this.doms.other.reportSubTitle.text(data.sub_title);

        },
        refresh:function(config){
            var me = this;
            !this.model && (this.model = config.model);
            this[config.event] && this[config.event](config.data);
        },
        destroy:function(){
            this.warningPop["destroy"] && this.warningPop.destroy();
            this.doms.main.find("*").unbind();
            this.doms.main.remove();
            this.loadingCache = this.realData = this.scroller = this.doms = this.data = null;
        }
    }

    xPATH.prototype.constructor = xPATH;

    return function(config){
        return new xPATH(config);
    };

});