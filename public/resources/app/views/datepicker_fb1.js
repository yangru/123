define(function(require,exports,module){

    var $ = window.$ || window.jQuery || require("jquery");
    var Backbone = require("backbone");
    var base = require("calendar");
    var pop_up = require("pop_up");

    function newDate(dateString){
        if (dateString) dateString = dateString.replace(/-/g, '/');
        return new Date(dateString);
    }

    function datepicker_fb1(config){
        /*
            el:$(".Ex_export"),
            params:{url,type,condition,dims,site_id,begindate,enddate},
            "subjet":this
        */
        /*私有设置，这里应该是关键的属性，方法的配置*/
        var privateConfig = {
            "tpl":{
                //"common":'<div class="dateBtns"><span class="G-buttonGroup"><input type="button" id="gotoToday" class="btn" value="'+LANG("wj今天")+'" /><input type="button" id="gotoYesterday" class="btn" value="'+LANG("昨天")+'" /><input type="button" id="gotoBefyesterday" class="btn" value="'+LANG("前天")+'" /><input type="button" id="gotoLastWeek" class="btn" value="'+LANG("上周同期")+'" /><input type="button" id="gotoLastSeven" class="btn" value="'+LANG("最近7天")+'" /><input type="button" id="gotoLastThirty" class="btn" value="'+LANG("最近30天")+'" /><input type="button" id="gotoCurrentMonth" class="btn" value="'+LANG("本月")+'" /></span><span class="G-buttonGroup"><input type="button" id="gotoBeforeDay" class="btn" value="'+LANG("前一天")+'" /><input type="button" id="gotoNextDay" class="btn" value="'+LANG("后一天")+'" /></span><span><input type="text" class="btn dateInput" class="xlarge" id="dateInput" readonly /><input type="button" id="gotoQuery" class="btn primary" value="'+LANG("查询")+'" /></span></div>',
                "common":'<div class="dateBtns"><span class="G-buttonGroup"><input type="text" class="btn dateInput" class="xlarge" id="dateInput" /></span></div>',
                "cal":'<div id="cal">'+LANG("请重试。。。")+'</div>'
            },
            "templates":{},
            "doms":{},
            "theDate":{
                "beginDate":begindate,
                "endDate":enddate
            },
            "choseDate":{
                "beginDate":begindate,
                "endDate":enddate
            },
            "ready":false,
            /*refresh:function(config){
                !this.model && config.model && (this.model = config.model);
                this[config.event] && this[config.event](config.data);
            },*/
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
                this.fn.buildChoseDate.call(this);
                this.fn.bindChoseDate.call(this);
                this.fn.bindCal.call(this);
                this.ready = true;
                this.callback && this.callback();
            },
            "fn":{
                /*getType:function(begin, end){
                    var now = newDate(Clicki.getDateStr()),
                        today = Math.floor(now.getTime() / 1000),
                        d1 = today - 86400,
                        d2 = d1 - 86400,
                        d3 = d2 - 86400,
                        d6 = today - 86400 * 6,
                        d7 = d6 - 86400,
                        d29 = today - 86400 * 29,
                        dc = today - 86400 * (now.getDate() - 1);

                    switch (true){
                        case (begin==today && end==today): return "gotoToday";
                        case (begin==d1 && end==d1): return "gotoYesterday";
                        case (begin==d2 && end==d2): return "gotoBefyesterday";
                        case (begin==d7 && end==d7): return "gotoLastWeek";
                        case (begin==d6 && end==today): return "gotoLastSeven";
                        case (begin==d29 && end==today): return "gotoLastThirty";
                        case (begin==dc && end==today): return "gotoCurrentMonth";
                    }
                    return false;
                },*/
                ///渲染///
                buildChoseDate:function(){
                    var that = this;
                    /*构造内容*/
                    $.each(this.tpl, function(key ,value){
                        this.templates[key] = _.template(value);
                        this.doms[key] = this.templates[key]();
                    }.bind(this));
                    this.$el.html(this.doms["common"]);

                    /*缓存变量*/
                    this.doms.selectBtn = this.$el.find(".dateBtns:first input[type=button]");
                    this.doms.dateInput = this.$el.find(".dateInput");

                    /*初始化*/
                    this.doms.dateInput.val(this.theDate.beginDate+"--"+this.theDate.endDate);
                    window.myToday = this.theDate.beginDate;
                    //console.log(window.myToday);
                },
                /*绑定按钮事件*/
                bindChoseDate:function(){
                    var that = this;

                    // 设定上周同期
                    this.doms.selectBtn.filter("#gotoLastWeek").val(
                        (LANG("上周")+[LANG("日"),LANG("一"),LANG("二"),LANG("三"),LANG("四"),LANG("五"),LANG("六")][newDate(Clicki.getDateStr()).getDay()])
                    );

                    // 获取TimeStamp数值
                    function getTimestamp(date){
                        if (typeof(date) == 'string'){
                            date = newDate(date);
                        }
                        return Math.floor(date.getTime() / 1000);
                    }

                    // 设置日期
                    function setDate(begin, end, type){
                        that.doms.selectBtn.removeClass('selected');
                        if (!type) type = "gotoQuery"//that.fn.getType(begin, end);
                        if (type) that.doms.selectBtn.filter('#' + type).addClass('selected');

                        var param = {date: new Date()};
                        param.date.setTime(begin * 1000);
                        begin = Clicki.getDateStr(param);
                        param.date.setTime(end * 1000);
                        end = Clicki.getDateStr(param);
                            
                        Clicki.manager.changeDate({
                            beginDate:begin,
                            endDate:end
                        });

                        Clicki.layout && Clicki.layout.manager.changeDate({
                            begindate:begin,
                            enddate:end
                        });

                        window.begindate = begin;
                        window.enddate = end;

                        that.theDate.beginDate = begin;
                        that.theDate.endDate = end;

                        that.doms.dateInput.val(begin+"--"+end);
                    }

                    // 选择日期事件
                    this.doms.selectBtn.unbind('click').click(function(e){
                        var now = newDate(Clicki.getDateStr());
                        var today, begin, end, type = false;
                        var appBegin = getTimestamp(that.theDate.beginDate);
                        var appEnd = getTimestamp(that.theDate.endDate);
                        today = begin = end = getTimestamp(now);

                        switch (this.id){
                            /*case "gotoToday":
                                type = "gotoToday";
                                break;
                            case "gotoYesterday":
                                end = begin = today - 86400;
                                type = "gotoYesterday";
                                break;
                            case "gotoBefyesterday":
                                end = begin = today - 86400 * 2;
                                type = "gotoBefyesterday";
                                break;
                            case "gotoLastWeek":
                                end = begin = today - 86400 * 7;
                                type = "gotoLastWeek";
                                break;
                            case "gotoLastSeven":
                                begin = today - 86400 * 6;
                                type = "gotoLastSeven";
                                break;
                            case "gotoLastThirty":
                                begin = today - 86400 * 29;
                                type = "gotoLastThirty";
                                break;
                            case "gotoCurrentMonth":
                                begin = today - 86400 * (now.getDate() - 1);
                                type = "gotoCurrentMonth";
                                break;
                            case "gotoBeforeDay":
                                begin = appBegin - 86400;
                                end = appEnd - 86400;
                                break;
                            case "gotoNextDay":
                                if (appEnd >= today || appBegin >= today) return false;
                                begin = appBegin + 86400;
                                end = appEnd + 86400;
                                break;*/
                            case "gotoQuery":
                                var bd = newDate(that.choseDate.beginDate);
                                var ed = newDate(that.choseDate.endDate);
                                if(bd == "Invalid Date" || ed == "Invalid Date"){
                                    return false;
                                }else{
                                    bd = getTimestamp(bd);
                                    ed = getTimestamp(ed);
                                    begin = Math.min(bd, ed);
                                    end = Math.max(bd, ed);
                                    if (begin > today) begin = today;
                                    if (end > today) end = today;
                                }
                                break;
                            default: return false;
                        }
                        setDate(begin, end, type);

                        var dat = $(e.target).attr("data-dat");
                        var send_custName = $("#kefuname").val();
                        var send_keyword = $("#guanjiankey").val();
                        /*触发渲染函数*/
                        if(that.doneFn){
                            that.doneFn($.extend(
                                (dat && $.parseJSON(dat) || {}),
                                {
                                    begindate: that.theDate.beginDate,
                                    enddate: that.theDate.endDate,
                                    agent_name:send_custName,
                                    content:send_keyword
                                }
                            ));
                        }else{
                            Clicki.layout.manager.run("theDatepicker",{
                                event:"changeDate",
                                "data":{
                                    "params":$.extend(
                                        (dat && $.parseJSON(dat) || {}),
                                        {
                                            begindate: that.theDate.beginDate,
                                            enddate: that.theDate.endDate,
                                            agent_name:send_custName,
                                    		content:send_keyword
                                        }
                                    )
                                }
                            });
                        }
                        var dateController = dateController || Clicki.manager.getApp("date_controller") || Clicki.layout.get("date_controller");
                        if(dateController){
                            dateController.changeDate(null, true);
                        }
                    });

                    var type = "gotoQuery";//this.fn.getType(getTimestamp(this.theDate.beginDate), getTimestamp(this.theDate.endDate));
                    if (type) this.doms.selectBtn.filter('#' + type).addClass('selected');
                },
                /*绑定日历*/
                bindCal:function(){
                    var that = this;
                    this.doms.dateInput.bind("click",function(){
                        /*弹出层有基本样式，可以设置覆盖*/
                        that.calPop = (that.calPop && that.calPop.$el) ? that.calPop.hide() : new pop_up($.extend(true,{
                            "type":{
                                "html":that.doms.cal
                            },
                            "animate":{
                                "config":{
                                    "position": that.doms.dateInput,
                                    "fix":{top:0+5,left: 0-248},
                                    "noSetSize":true
                                },
                                "delay":500
                            },
                            onRender:function(){
                                that.choseDate.beginDate = that.theDate.beginDate;
                                that.choseDate.endDate = that.theDate.endDate;
                                $('#cal').jCal({
                                    day: Clicki.parseISO8601(todaydate),     
                                    beginDate: Clicki.parseISO8601(that.theDate.beginDate),
                                    endDate: Clicki.parseISO8601(that.theDate.endDate),
                                    callback:function(date,info){
                                        date = Clicki.getDateStr({date:date});
                                        that.choseDate[info] = date;
                                        that.doms.dateInput.val(that.choseDate.beginDate+"--"+that.choseDate.endDate);
                                    }
                                });
                            }
                        },that.popConfig)).show();
                        return false;
                    });
                }
            },
            update:function(data){
                seajs.log("export change params");
                $.extend(true,this.params, data.params);
            },
            destroy:function(){
                this.$el.find("*").unbind();
                this.$el.unbind().empty();
            }
        }

        var viewsConfig = $.extend(true,{
            doneFn:$.noop(),
            "popConfig":{
                "once":true,
                "autoClose":true,
                "ui":{
                    "width":700,
                    "height":234,
                    "mainCls":"Ex_popCal",
                    "arrow":{
                        "show":true,
                        "arrowType":"top"
                    }
                },
                "showMark":false,
                "showClose":false
            }
        },config||{},privateConfig);

        var mainView = Backbone.View.extend(viewsConfig);

        return new mainView;
    }

    datepicker_fb1.prototype.constructor = datepicker_fb1;

    return {
        init:function(config){
            return new datepicker_fb1(config);
        }
    };

});