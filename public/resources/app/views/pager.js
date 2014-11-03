(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    /*
            el:$(".theGridTotalBox"),
            showPage:
            var pageSetting = {
                "counts":counts,
                "pageIndex":this.params.page,
                "size":this.params.limit
            }
    */
    function Pager(config){
        var privateConfig = {
            tagName: "div",
            html:"",
            events: {
            },
            "ports":{
                "edit":"/custom/tab_edit"
            },
            buildReady:false,
            ready:false,
            refreshConfig: {},

            /*初始化处理函数*/
            initialize: function() {
                var _id = this.id || null;
                _id = typeof(_id) === "string" && $("#"+_id)
                            || _id && (_id.nodeType || _id.selector || _id.jquery) && _id;

                delete(this.id);
                if(_id){
                    this.$el = $(_id);
                    this.el = this.$el[0];
                }
                var _params = {"type":"page","subtype":this.params.type};
                this.params.site_id && (_params.site_id = this.params.site_id);
                $.get("/custom/tabs",_params,function(re){
                    if(re.success){
                        /*如果服务器没有对象，需要新建*/
                        if(re.result.items.length == 0){
                            this.status = "create";
                            this.size = 10;
                        }else{
                            this.status = "edit";
                            this.size = re.result.items[0].size;
                        }
                        this.grid && this.grid.gridLayout.manager.run("pager", {
                            "event": "doPageSize",
                            "data": {
                                "params":{
                                    "size":this.size
                                }
                            }
                        });
                        this.type = re.result.type;
                        this.subtype = re.result.subtype;
                        this.render();
                    }
                }.bind(this),"json");            },

            refresh:function(config){
                this[config.event] && this[config.event](config.data);
            },

            render:function(){
                this.setPager();
                if(this.buildReady){
                    this.rebuild();
                }else{
                    this.build();
                    this.bindA();
                }
                this.ready = true;
            },

            setPager:function(){
                this.pageNums = this.pageSetting.pageNums || 9;
                this.counts = this.pageSetting.counts || 0;
                this.size = this.size || this.pageSetting.size || 10;
                this.pageAll = Math.ceil(this.counts / this.size);
                this.pageIndex = +this.params.page || 1;
                this.bigPage = this.pageAll>this.pageNums?true:false;
                this.now = this.pageIndex;
                this.minbound = Math.ceil(this.pageNums/2);
                this.maxbound = this.pageNums/2 == this.minbound?this.pageAll - this.minbound:this.pageAll - this.minbound;
            },

            /*分页事件绑定*/
            bindA:function(){
                this.As = this.$el.find("a");
                /*if(this.now == 1){
                    this.As.filter("a[key='first']").hide();
                    this.As.filter("a[key='previous']").hide();
                }
                if(this.now == this.pageAll){
                    this.As.filter("a[key='next']").hide();
                    this.As.filter("a[key='last']").hide();
                }*/
                this.As.bind("click",function(event){
                    var el = $(event.target);
                    if(el.hasClass("act")){
                        return false;
                    }
                    var value = el.attr("key");
                    switch(value){
                        case "size":
                            this.size = +(el.html());
                            this.begin = 1;
                            this.end = this.pageNums;
                            this.now = 1;
                            var data = {
                                size:this.size
                            };
                            (this.status == "edit") && (data["id"]=1);
                            $.get(this.ports.edit,{"type":this.type,"subtype":this.subtype,"site_id":this.params.site_id,"data":JSON.stringify(data)},function(){
                                this.status == "edit";
                            },"json");
                            this.$el.find("a[key='size']").removeClass("act");
                            el.addClass("act");
                            break;
                        case "first":
                            this.begin = 1;
                            this.end = this.pageNums;
                            this.now = 1;
                            break;
                        case "previous":
                            if((this.now<this.minbound && this.now>1)){
                                if(this.begin!=1){
                                    this.begin--;
                                    this.end--;
                                }
                                this.now--;
                            }else if(this.now>this.maxbound && this.now <= this.pageAll){
                                this.now--;
                            }else if(this.now!=1){
                                if(this.begin>1 && this.end<=this.pageAll){
                                    this.begin--;
                                    this.end--;
                                }
                                this.now--;
                            }
                            break;
                        case "next":
                            if((this.now<this.minbound && this.now>=1)){
                                this.now++;
                            }else if(this.now>this.maxbound && this.now < this.pageAll){
                                if(this.end!=this.pageAll){
                                    this.begin++;
                                    this.end++;
                                }
                                this.now++;
                            }else if(this.now!=this.pageAll){
                                if(this.begin>=1 && this.end<this.pageAll){
                                    this.begin++;
                                    this.end++;
                                }
                                this.now++;
                            }
                            break;
                        case "last":
                            this.begin = this.pageAll - this.pageNums + 1;
                            this.end = this.pageAll;
                            this.now = this.pageAll;
                            break;
                        case "jump":
                            var jumpNum = this.$el.find("input").val() || 0;
                            this.now = (jumpNum<this.pageAll && jumpNum>0)?jumpNum:this.now;
                            if((this.now + this.pageNums - 1)>this.pageAll){
                                this.begin = this.pageAll - this.pageNums + 1;
                                this.end = this.pageAll;
                            }else {
                                this.begin = this.now;
                                this.end = this.begin + this.pageNums - 1;
                            }
                            break;
                        default :
                            this.now = value;
                    }
                    /*if(this.now == 1){
                        this.As.filter("a[key='first']").hide();
                        this.As.filter("a[key='previous']").hide();
                    }
                    if(this.now == this.pageAll){
                        this.As.filter("a[key='next']").hide();
                        this.As.filter("a[key='last']").hide();
                    }*/
                    //this.rebuild();
                    this.params.limit = this.size;
                    this.params.page = this.now;
                    this.grid && this.grid.gridLayout.manager.run("pager",{
                        "event":"goToPage",
                        "data":{
                            "params":this.params,
                            "size":this.size
                        }
                    });
                    this.afterSelect && this.afterSelect();
                    return false;
                }.bind(this));
            },

            build:function(){
                var me = this;
                if(!this.counts){
                    return;
                }
                var pHtml = '<span>'+LANG("每页显示")+'<a href="#" key="size">10</a><a href="#" key="size">20</a><a href="#" key="size">50</a><a href="#" key="size">100</a>'+LANG("条")+'</span>';
                pHtml += "<span>"+LANG("共%1页，共%2条记录", this.pageAll, this.counts)+"</span>";
                //总页数比设置的少，不出现首页和上一页
                var hHtml = "<a href='#' key='first'>"+LANG("首页")+"</a><a href='#' key='previous'>"+LANG("上一页")+"</a>";
                //总页数比设置的少或总页数为0，或当前页是最后一页，不出现下一页
                var fHtml = "<a href='#' key='next' >"+LANG("下一页")+"</a><a href='#'  key='last'>"+LANG("尾页")+"</a>";
                var jHtml = '<input type="text" name="num" key="num" /><a href="#" key="jump">'+LANG("跳转")+'</a>';
                this.begin = this.now;
                this.end = this.begin + this.pageNums - 1;
                var mHtml = "";
                for(var i = this.begin; i <= this.end; i++){
                    if(this.pageIndex == i){
                        mHtml += "<a href='#' class='act'  key='"+i+"'>"+i+"</a>" ;
                    }else{
                        mHtml += "<a href='#'  key='"+i+"'>"+i+"</a>" ;
                    }
                }
                /*渲染*/
                this.html = $(mHtml);
                this.pHtml = $(pHtml);
                this.hHtml = $(hHtml);
                this.fHtml = $(fHtml);
                this.jHtml = $(jHtml);
                !this.bigPage && this.hHtml.hide();
                (!this.bigPage || this.pageAll === 0 || this.pageIndex == this.pageAll) && this.fHtml.hide();
                !this.bigPage && this.jHtml.hide();
                !this.bigPage && this.html.filter(function(){
                    return +($(this).attr("key")) > me.pageAll;
                }).hide();
                this.$el.append(pHtml).append(this.hHtml).append(this.html).append(this.fHtml).append(this.jHtml);
                this.$el.find("a[key='size']").filter(function(){
                    return $(this).html() == me.size;
                }).addClass("act");
                this.buildReady = true;
            },

            rebuild:function(){
                if(this.now<this.begin || this.now>this.end){
                    this.buildReady = false;
                    this.destroy();
                    this.render();
                }else{
                    !this.bigPage && this.hHtml.hide() || this.hHtml.css('display', 'inline');
                    (!this.bigPage || this.pageAll === 0 || this.pageIndex == this.pageAll) && this.fHtml.hide() || this.fHtml.css('display', 'inline');
                    !this.bigPage && this.jHtml.hide() || this.jHtml.css('display', 'inline');
                    this.$el.find("span").eq(1).html(LANG("共%1页，共%2条记录", this.pageAll, this.counts));
                    if(this.end-this.begin+1>=this.pageAll){
                        this.end = this.begin+this.pageAll-1;
                    }else{
                        this.end = this.begin+this.pageNums-1;
                    }
                    var b = this.begin;
                    var e = this.end;
                    $.each(this.html,function(i,n){
                        if(b<=e){
                            $(n).css('display', 'inline');
                            $(n).html(b);
                            $(n).attr("key",b);
                            b++;
                        }else{
                            $(n).hide();
                        }
                    });
                    this.html.removeClass("act");
                    this.html.filter("a[key='"+this.now+"']").addClass("act");
                    b = null;
                    e = null; 
                }
                
            },

            syncParams:function(data){
                seajs.log("pager doFilter");
                $.extend(true,this.params, data.params);
            },

            doFillData:function(data){
                this.update(data);
            },

            update:function(data){
                seajs.log("pager update");
                $.extend(true,this.pageSetting, data.pageSetting);
                if(data && data.params){
                    $.extend(true,this.params,data.params)
                }
                this.render();
            },

            destroy:function(){
                this.$el.find("*").unbind();
                this.$el.unbind().empty();
            }
        };

        var viewsConfig = $.extend(true,{
        },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }
    
    Pager.prototype.constructor = Pager;

    return function(config){
        return new Pager(config);
    }

});