(function(factory){
    /*简单的模块化*/
    if (typeof define === 'function') {
        define([], factory);
    } else {
        factory();
    }
})(function(){
    /*做了简单的模块化封装，防止重复加载, by Edwin Chen*/
    /*本模块的执行效率非常低，可优化的地方非常之多，日后要找时间重构*/
    /*grid 工厂，返回一个grid对象*/
    function factoryGrid(o, callback){
        this.url = "";
        this.parent = false;
        this.title = "";
        this.captions = [];
        this.datasList = [];
        this.table = "";
        this.pageSize = 10;
        this.counts = 0;
        this.pageAll = 1;
        this.pageIndex = 1;
        this.havePage = false;
        this.callback = function(){};
        this.parm;
        this.popbox;
        this.popboxisShow = false;
        this.icon = {icon:1};
        this.dataProcess;
        /*通过配置 是否显示的page*/
        this.Page = true;
        this.colWidth = "";
        this.buildGrid(o, callback);
    };

    factoryGrid.prototype = {
        buildGrid:function(o, callback){
            this.parent = this.parent?this.parent:$(o.parent);
            if(!this.parent || this.parent.length === 0){
                return false;
            }
            this.title = o.title || "";
            this.captions = o.captions;
            this.url = o.url;
            this.parm = o.parm || {};
            if(o.page){
                this.Page = o.page.show;
            }
            /*定义一个数据的加工过程，然后放回一个数组。 请慎用  */
//            this.icon = o.icon || undefined;
            if(o.icon){
                this.icon.col = o.icon.col || 1;
                this.icon.pos = o.icon.pos || 0;
            }else{
                this.icon = undefined;
            }
            if(o.colWidth){
                this.colWidth = o.colWidth;
            }
            this.dataProcess = o.dataProcess || undefined;
            if( typeof callback == "function"){
                this.callback = callback;
            }
            /*初始化创建popbox*/
            this.popBox = $("<div class='grid-popbox'></div>");
            $("body:first").append(this.popBox);
            this.popBox.css({top:"-99999em",left:"-99999em"});
            
            this._makeGrid();
        },
        /*
        * 翻页功能，跳转到指定的页码
        * */
        gotoPage: function(num){
            if(num == this.pageIndex){
                return;
            }
            if(num < 1){
                num = 1
            }else{
                if(num > this.pageAll){
                    num = this.pageAll;
                }
            }
            this.pageIndex = num;
            this.reflash();
        },
        prePage: function(){
            if(this.pageIndex == 1){
                alert(LANG("已经是第一页"));
                return;
            }
            this.pageIndex --;
            this.reflash();
        },
        nextPage: function(){
            if(this.pageIndex == this.pageAll){
                alert(LANG("已经是最后一页"));
                return;
            }
            this.pageIndex ++;
            this.reflash();
        },
        /*
        * 刷新当前页
        * */
        /*先刷整个table，到后面在优化*/
        reflash: function(){
            var grid = this.parent.find(".grid:first");
            this.popBox.offset(grid.offset());
            this.popBox.css({height:this.parent.height(),width:this.parent.width()});
            this._makeGrid();
        },
        _makeGrid: function(){
            var that = this;
            this.parm.page = this.pageIndex;
            $.ajax({
                type:"GET",
                url:this.url,
                dataType:"json",
                data:this.parm,
                success:function(data){
                    if(data.error !== "+OK"){
                        return false;
                    }
                    if(that.dataProcess && typeof that.dataProcess == "function" ){
                        data = that.dataProcess(data);
                    }
                    that.parent.html("<div>"+LANG("渲染中...")+"</div>");
                    that.datasList = data["result"]["items"] || [];
                    that.head = data["result"]["caption"] ;
                    var result = data["result"];
                    that.counts = result["item_total"] || 0;
                    that.pageSize = result["item_limit"] || that.pageSize;
					that.pageAll = Math.ceil(that.counts/that.pageSize);
                    if(that.pageAll > 1){
                        that.havePage = true;
                        if(!that.Page){
                            that.havePage = false;
                        }
                    }
                    var $grid = $("<div class='grid'></div>");
                    $grid.append(that._makeTable());
                    if(that.havePage){
                        $grid.append(that._makeFoot());
                    }
                    that.parent.html($grid);
                    that.table = that.parent.find("table:first");
                    /*只有当grid放入dom里面之后才好计算每列的宽度*/
                    that._setColWidth();
                    that.popBox.css({height:that.parent.height(),width:that.parent.width()});
                    
                    setTimeout(function(){
                        that.popBox.css({top:"-999999em",left:"-99999em"});
                    },500);


                    that.callback.call();
                    Clicki.Balance();
                },
                error:function(){
                    that.parent.html("<div>"+LANG("数据加载失败 -_-...")+"</div>");
                    Clicki.Balance();
                }
            });
        },
        /*grid  tbody 显示的顺序应该是根据 captions 来确定顺序的，这个后期重构的时候补上*/
        _makeTable: function(){
            var $table = $("<table></table>");
            var that = this;
            if(this.title){
                $table.append("<caption>"+this.title+"</caption>");
            }
                /*var str = "";
                if(this.title){
                    str += this.title;
                }
                *//*str += "<input type='button' value='导出列表' />";*//*

                var $caption = $("<caption>"+str+"</caption>");
                *//*$caption.find("input").click(function(){
                    Clicki.exportList({
                            url:that.url,
                            parm:that.parm
                    });
                });*//*
                $table.append($caption);*/

            var $thead = $("<thead></thead>");
            var $tr = $("<tr></tr>");
            $thead.append($tr);
            /*如果是空就用‘-’显示，待完善*/
            var captionsCol = 0;
            if(!this.captions || this.captions.length == 0){
                
                for(var e in this.head["x_axis"]){
                    var $td = $("<th><div>"+(this.head["x_axis"][e] || '-')+"</div></th>");
                    captionsCol ++;
                    $tr.append($td);
                }
                for(var e in this.head["y_axis"]){
                    var $td = $("<th><div>"+(this.head["y_axis"][e] || '-')+"</div></th>");
                    captionsCol ++;
                    $tr.append($td);
                }
            }else{
                for(var e in  this.captions["x_axis"]){
                    var $td = $("<th><div>" +( this.captions["x_axis"][e] || "-") + "</div></th>");
                    captionsCol ++;
                    $tr.append($td);
                }
                for(var e in this.captions["y_axis"]){
                    var $td = $("<th><div>"+( this.captions["y_axis"][e] || "-")+"</div></th>");
                    captionsCol ++;
                    $tr.append($td);
                }
            }


            $table.append($thead);

            /*设置每一列的宽度，有 px  em  auto % 等字符串表示*/


            var $tbody = $("<tbody></tbody>");
            if(this.datasList.length){
                for(var i = 0 , len = this.datasList.length; i < len ; i ++){
                    var col = 0;
                    var $tr = $("<tr></tr>");
                    for(var e in this.datasList[i]["x_axis"]){
                        $tr.append("<td class='grid-dims'><div>"+this.datasList[i]["x_axis"][e] || "-"+"</div></td>");
                        col ++;
                    }
                    for(var e in this.datasList[i]["y_axis"]){
                        $tr.append("<td><div>"+this.datasList[i]["y_axis"][e] || "-"+"</div></td>");
                        col ++;
                    }
                    if(col < captionsCol){

                        for(var j = col; j < captionsCol; j ++){
                            $tr.append("<td><div>-</div></td>");
                        }
                    }
                    if(this.icon){
                        var ic = this.icon;
                        if(ic){
                            var $te = $tr.children().eq(ic.col-1).find("div");
							var iconUrl = RESBU + "images/icons/" + this.datasList[i]["icon"] ;
                            if(ic.pos == 0){
								$te.html("<img class='icon_front' align='absmiddle' src='"+iconUrl+"' alt=''>" + $te.html());
							}else{
								$te.html($te.html() + "<img class='icon_behind' align='absmiddle' src='"+iconUrl+"' alt=''>");
							}
                        }
                    }
                    $tbody.append($tr);
                }
            }else{
                var tds = $thead.find("th").length;
                var $tr = $("<tr></tr>");
                $tr.append("<td><div>"+LANG("没有数据...")+"</div></td>");
                for(var i = 1; i < tds; i ++){
                    $tr.append("<td><div>&nbsp</div></td>");
                }
                $tbody.append($tr);
            }
            $table.append($tbody);
            return $table;
        },
        _setColWidth: function(){
            var that = this;
            if(that.colWidth == ""){
                return;
            }
            var $trs = that.table.find("tbody tr");
            if(Clicki.isObj(that.colWidth)){
                var o = that.colWidth;
                for(var e in o){
                    if(o[e] == "auto"){
                        continue;
                    }
                    var i = parseInt(e) - 1;
                    var divs = $trs.find("div:eq("+i+")").css("width", 1);
                    var w;
                    if(o[e].charAt(o[e].length-1) == "%"){
                        w = $trs.find("td:eq("+i+")").css("width", o[e]).width();
                    }else{
                        w = o[e];
                    }
                    divs.css("width", w);
                }
                return;
            }
            if(Clicki.isArr(that.colWidth)){
                var arr = that.colWidth;
                for(var i = 0 , len  = arr.length; i < len ; i ++){
                    if(arr[i] == "auto"){
                        continue;
                    }
                    var divs = $trs.find("div:eq("+i+")").css("width", 1);
                    var w;
                    if(arr[i].charAt(arr[i].length-1) == "%"){
                        w = $trs.find("td:eq("+i+")").css("width", arr[i]).width();
                    }else{
                        w = arr[i];
                    }
                    divs.css("width", w);
                }
                return;
            }
        },
        _makeFoot: function(){
            var that = this;
            var girdThat = this;
            var Page = function(hold, pageall, pageindex,size,gotopage){
                this.holder = $(hold);
                this.pageAll = pageall;
                this.pageIndex = pageindex;
                this.size = size;
                this.gotoFunc = gotopage;
                this.minbound = Math.ceil(this.size/2);
                this.maxbound =this.size/2 == this.minbound?this.pageAll - this.minbound:this.pageAll - this.minbound + 1;
            };
            Page.prototype = {
                make:function(){
                    var fp = this.pageIndex == 1?"":"<a href='#' key='first'>"+LANG("首页")+"</a><a href='#' key='previous'>"+LANG("上一页")+"</a>";
                    var nl = this.pageIndex == this.pageAll?"":"<a href='#' key='next' >"+LANG("下一页")+"</a><a href='#'  key='last'>"+LANG("尾页")+"</a>";
                    var begin, end;
                    if(this.pageIndex <= this.minbound){
                        begin = 1;
                        end = Math.min(this.pageAll, this.size);
                    }else{
                        if(this.pageIndex >= this.maxbound){
                            begin = this.pageAll - Math.min(this.size, this.pageAll) + 1;
                            end = this.pageAll;
                        }else{
                            begin = this.pageIndex - this.minbound + 1;
                            end = begin + this.size - 1;
                        }
                    }
                    var alink = "<span>"+LANG("共%1页，共%2条记录", girdThat.pageAll, girdThat.counts)+"</span>";
                    alink += fp;
                    for(var i = begin; i <= end ; i++){
                        if(this.pageIndex == i){
                            alink += "<a href='#' class='act'  key='"+i+"'>"+i+"</a>" ;
                        }else{
                            alink += "<a href='#'  key='"+i+"'>"+i+"</a>" ;
                        }
                    }
                    alink += nl;
                    this.holder.html(alink);
                    this._setClickFunc();
                },
                _setClickFunc: function(){
                    var that = this;
                    this.holder.find("a").each(function(i){
                        $(this).bind("click", function(event){
                            var value = $(event.target).attr("key");
                            switch(value){
                                case "first":
                                    girdThat.gotoPage(1);
                                    break;
                                case "previous":
                                    girdThat.prePage();
                                    break;
                                case "next":
                                    girdThat.nextPage();
                                    break;
                                case "last":
                                    girdThat.gotoPage(girdThat.pageAll);
                                    break;
                                default :
                                    girdThat.gotoPage(value);
                            }
                            return false;
                        });
                    });
                }
            };

            var $foot = $("<div class='grid-page'></div>");
            var p = new Page($foot ,that.pageAll, that.pageIndex, 5);
            p.make();
            return $foot;
        },
        _getPageAll: function(){
            var counts = this.counts;
            var pageSize = this.pageSize;
            if( counts%pageSize == 0){
                return counts/pageSize;
            }else{
                return (counts - (counts%pageSize))/pageSize + 1;
            }
        }
    };

    /*
    *建立一个grid对象，并返回.只有当grider对象成功生成时才会触发回调函数
    * */
    Clicki.expand("grider",function(o,callback){
        if(!o.parent){
            return ;
        }
        var newGird = new factoryGrid(o,callback);
        return newGird;
    });
});
