define(["jquery1.5","jqueryui"],function(require){
    var $ = require("jquery1.5");
    var ui = require("jqueryui");
    var datepickerfactory = function(){
        this.depend = "";
    };
    datepickerfactory.prototype = {
        _build: function(o){
            if(!o.depend){
                return;
            }
            this.depend = $(o.depend);
            var defaultOptions = {
                dateFormat:"yy-mm-dd",
                showMonthAfterYear: true,
                dayNamesMin:['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
                nextText:'',
                prevText:''
            }
            this.depend.datepicker($.extend(defaultOptions,o.options));

            $(".ui-datepicker").css({
                "font-size":14
            });
        },
        options: function(option, value){
            if(typeof option == "object"){
                this.depend.datepicker("option",option );
            }else{
                if(typeof option == "string"){
                    if(value){
                        this.depend.datepicker("option",option,value)
                    }else{
                        return this.depend.datepicker("option",option);
                    }
                }
            }
        },
        size: function(fontsize){
            if(fontsize){
                $(".ui-datepicker").css("font-size",fontsize);
            }else{
                return $(".ui-datepicker").css("font-size");
            }
        },
        date: function(date){
            if(date){
                return this.depend.datepicker("setDate",date);
            }else{
                return this.depend.datepicker("getDate");
            }
        },
        show: function(){
            this.depend.datepicker("show");
        },
        hide: function(){
            this.depend.datepicker("hide");
        },
        destroy: function(){
            this.depend.datepicker("destroy");
        },
        reflesh: function(){
            this.depend.datepicker("refresh");
        },
        firstDay: function(num){
            if(num){
                this.depend.datepicker("option", "firstDay", num);
            }else{
                return this.options("firstDay");
            }
        },
        minDate:function(date){
            if(!date){
                return this.options("minDate");
            }else{
                if(typeof date  == "object" || typeof date == "number" || typeof date == "string"){
                    this.options({"minDate": date});
                }
            }
        },
        maxDate:function(date){
            if(!date){
                return this.options("maxDate");
            }else{
                if(typeof date  == "object" || typeof date == "number" || typeof date == "string"){
                    this.options({"maxDate":date});
                }
            }
        },
        onSelect:function(callback){
            typeof callback == "function" && this.options({"onSelect":callback});
        },
        onClose:function(callback){
            typeof callback == "function" && this.options({"onClose":callback});
        },
        dateFormat:function(str){
            this.options({"dateFormat":str});
        }
    };
    Clicki.expand("datePick", function(o , callback){
        if(typeof o != "object"){
            return;
        }
        //Clicki.jsFilesLoader(["jQuery.ui","jQuery.datepicker"]);
        var dp = new datepickerfactory();
        dp._build(o);
        typeof callback == "function" && callback.call();
        return dp;
     });
    /*轮询时间空间的DOM是否生成，如果生成了就不里了*/
    var ready = setInterval(function(){
        if($(".datepicker").length >= 2){
            clearInterval(ready);
           return Clicki.datePick({
                depend: $(".datepicker"),
                options:{
                    maxDate:0,
                    minDate:"-3M"
                }
            });
        }
    },100);

})




