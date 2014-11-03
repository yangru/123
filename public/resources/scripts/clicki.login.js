(function(){
    /*登录页脚本文件*/

    var theForm = $("#leftForm");
    var theArea = $("#loginBox")
    var inputs = theArea.find("input:not(:button,:submit)");
    var tipBoxs = theArea.find("span");

    /*IE placeholder*/
    if(Clicki.isIE){
        function setInputType(_t){
            var _type = _t.attr("type");
            if(_type !=="text"){
                _t.attr("realType",_t.attr("type"));
            }
        };

        function setPwsHolder(_t){
            _t.hide();
            _t.before("<input type=\"text\" class=\"placeholderClass\" placeholder=\'"+_t.attr("placeholder")+"\' value=\""+_t.attr("placeholder")+"\" />");
            (function(t){
                var real = t,notReal = t.prev();
                notReal.bind("focus",function(){
                    notReal.hide().blur();
                    real.show().focus();
                });
                real.bind("blur",function(){
                    var __t = $(this);
                    if($.trim(__t.val()) === ""){
                        real.hide();
                        notReal.show();
                    }
                });
            })(_t);
        }

        $.each(inputs,function(i,n){
            var _t = $(n);
            var ph = _t.attr("placeholder");

            if(_t.attr("type") === "password"){
                setPwsHolder(_t);
            }
            if(ph !=undefined && _t.attr("type") !== "password"){
                setInputType(_t);
                
                _t.bind("focus",function(){
                    var __t = $(this);
                    if(__t.attr("realType") !=undefined){
                        __t.attr("type",__t.attr("realType"));
                    }
                    __t.removeClass("placeholderClass");
                    if($.trim(__t.val()) === ph){
                        __t.val("");
                    }
                })
                .bind("blur",function(){
                    var __t = $(this);
                    if($.trim(__t.val()) === ""){
                        setInputType(__t);
                        __t.addClass("placeholderClass").val(__t.attr("placeholder"));
                    }
                });

                if($.trim(_t.val()) === ""){
                    _t.val(ph)
                    .addClass("placeholderClass")
                }

                

            }

        });
    };

    /*重新获取验证码*/
    theArea.find("a:first").bind("click",function(){
        return true;
    });

    function removeTip(tip,_t,timer,f){
        (timer)&&clearTimeout(timer);
        tip.css("display","none");
        tip.parent().removeAttr("style");
        _t.unbind("keyup");
        (f)&&_t.focus();
    }

    $.each(inputs,function(i,n){
        var _t = $(n);
        var tip = tipBoxs.eq(i);
        _t.bind("keyup",function(){removeTip(tip,_t)});
    });

    /*表单提交*/
    theForm.submit(function(){
        var _r = true;

        $.each(inputs,function(i,n){
            var _t = $(n);
            var _v = _t.val();
            var holder = _t.attr("placeholder");
            var tip = tipBoxs.eq(i),
                timer = false;
            if($.trim(_v) === "" || $.trim(_v) === holder){
                _r = false;
                _t.addClass("G-Anim-leftRight");
                _t.focus();
                _t.bind("blur",function(){
                    _t.removeClass("G-Anim-leftRight");
                }).bind("keyup",function(){removeTip(tip,_t,timer)});
                timer = setTimeout(function(){
                    removeTip(tip,_t,timer,true);
                },3000);
                tip.parent().css("position","relative");
                tip.css("display","block");
                return _r;
            }
        });

        return _r;
    });


})();