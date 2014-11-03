(function(method){
    if(typeof(define) === "function"){
        define(method);
    }else{
        method();
    }
})(function(require,exports,module){

	/*千分位？*/
	!Number.prototype.separated && (Number.prototype.separated = function(symbol,setp){
        symbol = symbol || ",";
        setp = setp || 3;
        var strArr = [];
        var str = (""+this).split(".");
        var floor = (str[1] && "."+str[1]) || "";
        if(floor){
            return this;
        }
        str = ""+str[0];
        var len = str.length;
        function loop(){
            if(len > setp){
                len-=setp;
                strArr.push(str.substr(len,setp));
                if(len > setp){
                    loop();
                }else{
                    if(len !== 0){
                        strArr.push(str.substring(0,len));
                    }
                    strArr = strArr.reverse();
                    str = strArr.join(symbol);
                    strArr = len = null;
                }
            }
        }
        loop();
        loop = null;
        str = str+floor;
        return str;
    });

    /*混合字符数*/
    !String.prototype.theLength && (String.prototype.theLength = function(en){
        return en && this.length || Math.round(this.replace(/[^\x00-\xff]/g,"oo").length/(2));
    });

    /*砍,star 开始，end 结束，flow 截字后显示的文本,mix 是否混合模式*/
    !String.prototype.cutMixStr && (String.prototype.cutMixStr = function(star,end,flow,mix){
        mix = mix?true:false;
        var str = "";
        var len = this.length;
        var zh = this.match(/[^\x00-\xff]/g);
        var cut = false;
        if(mix){
            if(zh){
                /*中文*/
                str = this.substr(star,end);
                var _len  =str.theLength();
                if(!/[^\x00-\xff]g/.test(str) && _len < end){
                    /*截完没中文*/
                    str = this.substr(star,(end*2 -_len));
                }else if(_len < end){
                    /*截完有中文*/
                    var num = str.match(/\w{1,2}/g);
                    str = this.substr(star,(num && (end + num.length*2) || end));
                }
                cut = len > end ?true:false;
            }else{
                str = this.substr(star,(end*2));
                cut = len > end*2?true:false;
            }
        }else{
            str = this.substr(star,end);
            cut = len > end?true:false;
        }
        return (typeof(flow) === "string" && cut && (str+flow)) || str;
    });
    
    /*时间标识*/
    !Date.prototype.timemark && (Date.prototype.timemark = function(mark,full){
        var _Date,str,mark = mark || ["h","m","s"],r = [];
        _Date = [this.getUTCHours(),this.getUTCMinutes(),this.getUTCSeconds()];
        for(var i=0;i<3;i++){
            if(full){
                r.push(
                    !_Date[i] && ("00"+mark[i])
                    || ((""+_Date[i]).length === 1 && ("0"+_Date[i]+mark[i])
                        || (_Date[i]+mark[i]))
                );
            }else{
                if(_Date[i] || i){
                    if(_Date[i]){
                        r.push((_Date[i]+mark[i]));
                    }else if(!_Date[i] && r[i-1]){
                        r.push((_Date[i]+mark[i]));
                    }
                }
            }
            
        }
        str = (!r.length && "0"+(mark[2] && mark[2] || "s")) || r.join("");
        _Date = mark = r = null;
        return str;
    });

    /*毫秒格式化成小时*/
    !Number.prototype.formatDuring && (Number.prototype.formatDuring = function(mark){
        var mss = +this;
        var mark = mark || ["h","m","s","ms"];
        var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((mss % (1000 * 60)) / 1000);
        var millisecond = parseInt(mss % 1000);
        var time = (hours?hours+mark[0]:"")+(minutes?minutes+mark[1]:"")+(seconds?seconds+mark[2]:"")+(millisecond?millisecond+mark[3]:"");
        var str = (!time.length && "0"+(mark[3] && mark[3] || "ms")) || time;
        mss = mark = hours = minutes = seconds = millisecond = time = null;
        return str;
    });

    /*鼠标离开后还会等一下才执行函数*/
    $.fn.lazyhover = function(fuc_on, fuc_out, de_on, de_out) {
        var self = $(this);
        var flag = 1;
        var h;
        var handle = function(elm){
            clearTimeout(h);
            if(!flag) self.removeData('timer');
            return flag ? fuc_on.apply(elm) : fuc_out.apply(elm);
        };
        var time_on  = de_on  || 0;
        var time_out = de_out || 500;
        var timer = function(elm){
            h && clearTimeout(h);
            h = setTimeout(function(){handle(elm);}, flag ? time_on : time_out);
            self.data('timer', h);
        }
        self.hover(
            function(){
                flag = 1 ;
                timer(this);
            },
            function(){
                flag = 0 ;
                timer(this);
            }
        );
    }

    return {
    	"format":{
    		"int":function(data){
                return !isNaN(parseInt(data)) && parseInt(data) || 0;
            },
            "string":function(data){
                return ""+data;
            },
            "floor":function(data){
                return !isNaN(Math.floor(data)) && Math.floor(data) || 0;
            },
            "n3n4":function(num,n){
                /*四舍五入*/
                if(isNaN(num)){return -1;}else if((""+num).indexOf(".") === -1){return num;}
                n = n || 2;
                var str = ""+num;
                var _numArr = str.split(".");
                var _int = parseInt(_numArr[0]),
                    _float = parseInt(_numArr[1].substring(0,n)),
                    _float2 = parseInt(_numArr[1].substr(n,n+1));

                if(_float2 >=5){
                    _float+=1;
                    if((""+_float).length >=3){
                        _int+=1;
                        _float = "00";
                    }
                }

                return parseFloat(_int+"."+_float);
            },
            "hsl2rgb":function(h, s, l) {
                var HueToRgb = function(m1, m2, hue) {
                    var v;
                    if (hue < 0)
                        hue += 1;
                    else if (hue > 1)
                        hue -= 1;

                    if (6 * hue < 1)
                        v = m1 + (m2 - m1) * hue * 6;
                    else if (2 * hue < 1)
                        v = m2;
                    else if (3 * hue < 2)
                        v = m1 + (m2 - m1) * (2/3 - hue) * 6;
                    else
                        v = m1;

                    return 255 * v;
                }
                var m1, m2, hue;
                var r, g, b
                s /=100;
                l /= 100;
                if (s == 0)
                    r = g = b = (l * 255);
                else {
                    if (l <= 0.5)
                        m2 = l * (s + 1);
                    else
                        m2 = l + s - l * s;
                    m1 = l * 2 - m2;
                    hue = h / 360;
                    r = HueToRgb(m1, m2, hue + 1/3);
                    g = HueToRgb(m1, m2, hue);
                    b = HueToRgb(m1, m2, hue - 1/3);
                }
                return "#"+Math.ceil(r).toString(16)+Math.ceil(g).toString(16)+Math.ceil(b).toString(16);
            }
    	},
    	"tpl":{
    		"repLabel":function(str,exp,restr){
                var labels = str.match(/\{\w+\}/g);
                var newLabels = [];
                for(var i = 0,len = labels.length,tmp;i<len;i++){
                    tmp = ""+newLabels;
                    if(tmp.indexOf(labels[i]) === -1){
                        newLabels.push(labels[i]);
                    }
                }
                labels = newLabels;
                newLabels = null;
                for(var i = 0,len = labels.length,n;i<len;i++){
                    n = labels[i].match(/[^\{\}]+/g);
                    n = n && n[0] || "";
                    ////////////////////////////翻译------下拉框的值////////////////////////////////////////
                    str = str.replace(new RegExp(labels[i],["g"]),LANG(restr[n]));
                    n = null;
                }
                labels = null;
                return str;
            }
    	},
        "ux":{
            /*点击界面上任意非指定对象区域时自动执行特定函数*/
            "hideOnDocumentClick":function(el,fn,scope){
                
                var closPopTip = function(event){
                    if($(event.target).closest(el).length === 0){
                        fn.call((scope || this));
                        el.find(".Ex_selectedReport").removeClass("active");
                        $(document).unbind("click",closPopTip);
                    }
                }
                $(document).bind("click",closPopTip);
                return closPopTip;
            }
        }
    }

});