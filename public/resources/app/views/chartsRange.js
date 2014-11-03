//charts组件，用于选择类型和维度
(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");

    function ChartsRange(config){
        var privateConfig = {
            "tagName": "div",
            "timeTypesSet":{
                "14":"weekMode",
                "60":"monthMode",
                "180":"quarterMode",
                "720":"yearMode"
            },
            /*参数设定表*/
            "paramsMap":{
                "hourlyMode":{
                    "viewtb":0
                },
                "dailyMode":{
                    "viewtb":1
                },
                "weekMode":{
                    "viewtb":2
                },
                "monthMode":{
                    "viewtb":3
                },
                "quarterMode":{
                    "viewtb":4
                },
                "yearMode":{
                    "viewtb":5
                }
            },
            /*当前时间类型*/
            "type":"hourlyMode",
            "doms":{},
            "events":{
            },
            "refreshConfig":{},

            /*初始化处理函数*/
            initialize:function(){
                 var _id = this.id || null;
                _id = typeof(_id) === "string" && $("#"+_id)
                            || _id && (_id.nodeType || _id.selector) && _id;

                delete(this.id);
                if(_id){
                    this.$el = $(_id);
                    this.el = this.$el[0];
                }
                this.render();
            },

            render:function(){
                //渲染
                this.doms["modeSelector"] = $(_.template(this.tpl.modeSelector)({
                    "cls":this.cls,
                    "types":this.types,
                    "typesTitle":this.typesTitle
                }));
                this.$el.append(this.doms["modeSelector"]);
                //缓存每个按钮
                this.viewModeGroup = this.doms["modeSelector"].find("input");
                //对按钮进行绑定事件
                this.setViewModeGroup();
                //根据时间控件激活相应的按钮
                this.changeDate();
                //控制compare
                this.chartLayout.manager.run("chartsRange", {
                    "event":"doRange",
                    "data":this.paramsMap[this.type]
                });
            },

            setViewModeGroup:function(){
                var me = this;
                $.each(me.viewModeGroup,function(i,n){
                    var _n = $(n);
                    _n.bind("click",function(){
                        var _n = $(this);
                        var _date = Clicki.manager.getDate();
                        me.singel = _date.beginDate == _date.endDate;

                        if(_n.hasClass("selected")){return;}

                        me.type = _n.attr("data-type");
                        me.viewModeGroup.removeClass("selected");
                        me.viewModeGroup.filter("input[data-type='"+me.type+"']").addClass("selected");
                        //控制compare
                        me.chartLayout.manager.run("chartsRange", {
                            "event":"doRange",
                            "data":me.paramsMap[me.type]
                        });
                    });

                    if(me.singel && !i && !me.seted){
                        _n.addClass("selected");
                        me.viewModeGroup.filter("input[data-type!='hourlyMode']").attr("disabled",true);
                    }
                });
                this.seted = true;
            },

            changeDate:function(){
                this.days = this.getDays();
                this.singel = !this.days;

                this.type = this.singel && "hourlyMode" || "dailyMode";//this.type
                this.viewModeGroup.removeClass("selected");
                this.viewModeGroup.filter("input[data-type='"+this.type+"']").addClass("selected");
                if(this.singel){
                    this.viewModeGroup.filter("input[data-type!='hourlyMode']").attr("disabled",true);
                }else{
                    var rArr=[]
                        ,rArr2=[]
                        ,_tmpArr= [14,60,180,720];
                        // _R = 0,
                    for(var i =0;i<4;i++){
                        // _R = Math.max(_tmpArr[i],this.days);
                        if(_tmpArr[i]<=this.days){
                            rArr.push(
                                "input[data-type='"+this.timeTypesSet[_tmpArr[i]]+"']"
                            );
                        }else{
                            rArr2.push(
                                "input[data-type='"+this.timeTypesSet[_tmpArr[i]]+"']"
                            );
                        }
                    }
                    _R = _tmpArr = null;
                    this.viewModeGroup.filter("input[data-type='hourlyMode'],"+(rArr+(rArr.length?",":""))+"input[data-type='dailyMode']").attr("disabled",false);
                    this.viewModeGroup.filter(""+rArr2).attr("disabled",true);
                }
            },

            getDays:function(){
                var _date = Clicki.manager.getDate(true);
                return (new Date(_date.endDate) - new Date(_date.beginDate))/86400000;
            },

            update:function(data){
                this.changeDate();
            },


            refresh:function(config){
                this[config.event] && this[config.event](config.data);
            },

            destroy:function(){
                this.$el.find("*").unbind();
                this.$el.unbind().empty();
            }
        };

        var viewsConfig = $.extend(true,{
            /*类型选择对象*/
            "viewModeGroup":null,
            /*日期段对象*/
            "buttonGroup":$(".G-buttonGroup:first input"),
            /*模板*/
            "tpl":{
                "modeSelector":'<div class=" <%= cls %>"><span class="G-buttonGroup"><% _.each(types, function(value, key){ %><input type="button" data-type="<%= value %>" class="btn <%if(key===0){%>selected<%}%>" value="<%= typesTitle[value] %>" /><% }); %></span></div>'
            },
            "seted":false,
            /*查看模式附加样式*/
            "cls":"",
            /*启用的查看类型，这决定能使用的时间类型*/
            "types":["hourlyMode","dailyMode","weekMode","monthMode","quarterMode","yearMode"],
            /*时间类型显示的文字*/
            "typesTitle":{
                "hourlyMode":LANG("小时"),
                "dailyMode":LANG("日"),
                "weekMode":LANG("周"),
                "monthMode":LANG("月"),
                "quarterMode":LANG("季"),
                "yearMode":LANG("年")
            },
            /*标题*/
            "modelTitle":{
                "hourlyMode":LANG("每小时访问趋势"),
                "dailyMode":LANG("访问趋势"),
                "weekMode":LANG("每周访问趋势"),
                "monthMode":LANG("每月访问趋势"),
                "quarterMode":LANG("每季访问趋势"),
                "yearMode":LANG("每年访问趋势")
            }
        },config||{},privateConfig);

        var mainView = Backbone.View.extend(viewsConfig);

        return new mainView;
    }
    
    ChartsRange.prototype.constructor = ChartsRange;

    return function(config){
        return new ChartsRange(config);
    };

});