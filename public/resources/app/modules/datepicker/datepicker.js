define(function(require){
    var $ = require("jquery1.5");
    var ui = require("jqueryui");

    function datepickerfactory(config){
        this.depend = "";
        if(!config.depend){
            return;
        }

        this.dpConfig = $.extend({
            dateFormat:"yy-mm-dd",
            showMonthAfterYear: true,
            dayNamesMin:['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
            nextText:'',
            prevText:''
        },config.options);

        this.depend = $(config.depend);
        this.id = config.depend;
        if(this.depend.length){
            this._build();
        }
    };
    datepickerfactory.prototype = {
        _build: function(o){
            this.depend.datepicker(this.dpConfig);
            $(".ui-datepicker").css({
                "font-size":14,
                "display":"none"
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
    datepickerfactory.prototype.constructor = datepickerfactory;

    !Clicki.datePick && Clicki.expand("datePick", function(o,callback){
        if(typeof o != "object"){
            return;
        }
        //Clicki.jsFilesLoader(["jQuery.ui","jQuery.datepicker"]);
        var dp = new datepickerfactory(o,callback);
        typeof callback == "function" && callback.call();
        return dp;
    });

    return {
        "name":"The Date Picker",
        init:function(config,callback){
            return new datepickerfactory(config,callback);
        }
    }

})




