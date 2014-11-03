(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    var pop_up = require("pop_up");
    /**
     * "rowView":rowView
     * "tableBtn":{
            "def":{
                "area":"os_type_name",
                "className":"subdefIcon",
                "type":"commonGrid",
                "method":"pop"
            },
            "geo":{
                "area":"os_type_name",
                "className":"subgeoIcon",
                "type":"commonGrid",
                "method":"sub"
            }
        }
     */
    function TableBtn(config){
        var privateConfig = {
            btnTpl:'<a class="<%= className+"Close" %>" data-name="<%= name %>" data-type="<%= type %>" data-action="<%= method.type %>" title="<%= title %>"></a>',
            doms:{},
            tr:"",
            areas:{},
            events:{
                "click a[data-action='sub']" : "toggleSub",
                "click a[data-action='pop']" : "togglePop",
                "click a[data-action='fun']" : "toggleFun"
            },
            /*初始化处理函数*/
            initialize: function() {
                this.render();
            },

            refresh:function(config){
                this[config.event] && this[config.event](config.data);
            },

            render:function(){
                /*渲染模板，绑定事件*/
                this.fn.build.call(this);
            },

            fn:{
                build:function(){
                    $.each(this.tableBtn, function(key, value){
                        var status = false;
                        //检测是否有过滤条件
                        if(value.filter){
                            var arr1 = value.filter.split(",");
                            for(var i=0,len=arr1.length;i<len;i++){
                                var arr2 = arr1[i].split("|");
                                $.each(this.tableRow.model.toJSON().keys, function(n,nn){
                                    if(n === arr2[0] && nn === arr2[1]){
                                        status = true;
                                        return false;
                                    }
                                });
                                if(status){
                                    arr2 = null;
                                    break;
                                }
                            }
                            arr1 = null;
                        }else{
                            status = true;
                        }
                        if(!status){
                            return true;
                        }
                        value.name = key;
                        value.title = value.title || "";
                        this.doms[key] = $(_.template(this.btnTpl)(value));
                        this.$el.find("td[data-type='"+value.area+"']").find("span:last").append(this.doms[key]);
                        this._setCtrlBox(this.$el.find("td[data-type='"+value.area+"']").find("span:last"));
                    }.bind(this));
                }
            },
            _setCtrlBox:function(btnDom){
                var changeWidth = (btnDom.children().length)*24;
                btnDom.children().filter(function(index){return index>0}).hide();
                btnDom.addClass("btnCtrl");
                btnDom.css({
                    "width": changeWidth,
                    "right": -((btnDom.children().length-1)*24)
                });
                /*增加隐藏和现实的动画效果*/
                btnDom.lazyhover(function(){
                    $(this).css({
                        "background-color":"rgba(255,255,255,0.8)"
                    });
                    $(this).children().filter(function(index){return index>0}).css("display","inline-block");
                },function(){
                    $(this).css("background", "none");
                    $(this).children().filter(function(index){return index>0}).css("display","none");
                },0,800);
            },
            toggleSub:function(ev){
                /*格式化*/
                var _n = $(ev.target);
                this.tr = this.$el.next();
                $.each(_n.closest("span").find("a[data-action='sub']"), function(key, value){
                    $(value).attr("class", $(value).attr("class").replace("Open","Close"));
                });
                this.tr.find(".subDiv").unbind().empty().hide();
                this.tr.hide();
                /*初始化*/
                if(_n.attr("data-name") != this.nowName || this.tr.attr("data-show") === "no"){
                    this.nowType = _n.attr("data-type");
                    this.nowName = _n.attr("data-name");
                    _n.attr("class", _n.attr("class").replace("Close","Open"));
                    this.tr.show();
                    this.tr.find(".subDiv")
                        .show()
                        /**
                         * 给subgrid内部容器设定宽度以触发滚动条
                         */
                        .width(this.tr.find(".subTd:first").width()-2);
                    require.async([this.nowType],function(module){
                        //合并必要参数
                        //TODO 更新时间
                        var config = $.extend(this.tableBtn[_n.data("name")].config||{},{
                            "id":this.tr.find(".subDiv"),
                            "rowData":this.rowData,
                            "prevCondition":this.tableRow.params.condition
                        });
                        module.init && module.init(config) || new module(config);
                    }.bind(this));
                    this.tr.attr("data-show","yes");
                    if(Clicki.Balance){
                        Clicki.Balance();
                    }
                }else{
                    this.$el.next().attr("data-show","no");
                }
            },

            togglePop:function(ev){
                var _n = $(ev.target);
                var name = _n.data("name");
                var type = _n.attr("data-type");
                var popConfig = $.extend(true,{
                    "type":{
                        "html":'<div id="popCommonGrid"></div>'
                    },
                    "ui":{
                        "innerCls":"Ex_popGuyInner",
                        "width":800,
                        "title":{
                            "show":true,
                            "text":(this.table.grid.title||"")+LANG("访客列表")
                        }
                    },
                    "autoClose":false,
                    "showClose":true,
                    "showMark":true,
                    "once":true
                }, this.tableBtn[name].method.config);

                this.pop = new pop_up(popConfig);
                this.pop.show();
                if(type === "html"){
                    var _par = "";
                    for(var _n in this.rowData["keys"]){
                        _par += _n+"|"+this.rowData["keys"][_n]+",";
                    }
                    if(this.tableRow.params.condition){
                        _par = _par + this.tableRow.params.condition;
                    }else{
                         _par = _par.substr(0,_par.length-1);
                    }
                    this.tableBtn[name].config.params.condition = _par;
                    $.get(this.tableBtn[name].config.url,this.tableBtn[name].config.params,function(re){
                        $("#popCommonGrid").html(re);
                    }.bind(this),"html");
                    _par = null;
                }else{
                    require.async([type],function(module){
                        //合并必要参数
                        var config = $.extend(this.tableBtn[name].config||{},{
                            "id":"popCommonGrid",
                            "rowData":this.rowData,
                            "prevCondition":this.tableRow.params.condition
                        });
                        module.init && module.init(config) || new module(config);
                    }.bind(this));
                }
            },

            toggleFun:function(ev){
                var _n = $(ev.target);
                var name = _n.attr("data-name");
                var mAttributes = {};
                mAttributes.data = this.rowData;
                mAttributes.event = ev;
                this.tableBtn[name].fun.call(this, mAttributes);
            }
        };

        var viewsConfig = $.extend(true,{
            "position":"right",
            "ui":{
                "animate":{
                    "open":"fadeIn",
                    "close":"fadeOut"
                },
                "delay":200
            },
            "tableBtn":{},
            "rowData":{},
            "table":{},
            "tableRow":{}
        },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }
    
    TableBtn.prototype.constructor = TableBtn;

    return function(config){
        return new TableBtn(config);
    };
});