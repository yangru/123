define(function(require,exports,module){

    var popTpl = "<div class=\"{class}\" id=\"{rid}\"><ol></ol></div>";
    var hideCss = {top:"-99999em",left:"-99999em"};

    function innerPopList(o){

        /*目标容器id，jq选择符格式*/
        this.id = o.id;
        /*当前站点ID*/
        this.site_id = o.site_id;
        /*目标对象*/
        this.tagEl = $(o.id);
        if(this.tagEl.length === 0){
        	return false;
        }
        this.popClass = o.cls || "G-heSiteList";
        /*弹出层坐标*/
        this.offset = this.tagEl.offset();
        /*坐标修正*/
        this.offset.top += (this.tagEl.outerHeight() -1);
        /*ajax url*/
        this.ajaxUrl = o.url?o.url:false;
        /*数据缓存*/
        this.data = o.data?o.data:false;
        /*回调函数*/
        this.callback = o.callback || function(){};
        this.clickFunc = o.clickFunc || function(){};
        /*弹出层缓存对象*/
        this.popBox = false;
        this.popBoxId = null;
        /*列表缓存对象*/
        this.list = null;
        /*列表是否为空*/
        this.isEmpty = true;
        /*列表显示状态*/
        this.isShow = false;

        this.async = o.async || true;

        if(this.ajaxUrl){
            /*ajax的话优先获取数据*/
            $.ajax({
                url:this.ajaxUrl,
                dataType:"json",
                type:"GET",
                async:this.async,
                success:function(re){
                    this.data = re.datas;
                    this.init();
                }.bind(this)
            });
        }else{
            this.init();
        }
    }

    innerPopList.prototype = {
        /*初始化*/
        init:function(){
            var that = this;

            if(!this.popBox){
                if(!this.creatPopBox()){
                    window.console && console.log("数据异常，请检查数据是否正确获取。");
                    return false;
                }
                this.callback(this.site_id);
            }

            /*目标事件绑定*/
            this.tagEl.bind("click",function(event){
                if(this.isShow){
                    this.hideList(event);
                }else{
                    this.showList(event);
                }
            }.bind(this)).hover(
                function(){
                    $(this).addClass("theHover");
                },
                function(){
                    $(this).removeClass("theHover");
                }
            );

            /*列表事件绑定*/
            this.list.find("li").each(function(i){
                $(this).bind("click",function(e){
                    that.tagEl.html(that.data[i].value +":" + that.data[i].url || "");
                    that.tagEl.attr("key",that.data[i].key);
                    that.hideList();
                    that.clickFunc(that.data[i].key);
                });
            });
        },
        /*创建弹出层*/
        creatPopBox:function(){
            var _rid = "theClickPopListOutterBox"+Math.ceil(Math.random() * 100000);
            var _tpl = ""+popTpl;
            _tpl = _tpl.replace(/\{class\}/,this.popClass).replace(/\{rid\}/,_rid);
            this.popBox = $(_tpl);
            this.popBoxId = _rid;
            $("body:first").append(this.popBox);
            this.list = this.popBox.find("ol:first");
            return this.creatList();
        },
        /*创建列表*/
        creatList:function(){
            var str = "";
            var that = this;
            if(this.data && this.data.length >0){
                var arr = new Array();
                var sitematch = false;
                $.each(this.data,function(i,n){
                     /*初始化的时候设置site_id对应的网站*/
                    if(n.key == that.site_id){
                        sitematch = true;
                        that.tagEl.html(n.value + ":" + n.url || "");
                        that.tagEl.attr("key",n.key);
                    }
                    arr.push("<li><strong>"+n.value+"</strong>" + n.url || "" + "</li>");
                });
                if(!sitematch){
                    that.tagEl.html(that.data[0].value + ":" + that.data[0].url || "");
                    that.tagEl.attr("value", that.data[0].key);
                }

                this.list.append(arr.join(""));
                this.isEmpty = false;
            }else{
                return false;
            }
            return true;
        },
        /*显示当前site_id对应的站点*/
        showMatch:function(){
            $.each(this.data,function(i,n){
                if(n.key == site_id){
                    this.tagEl.html(n.value + ":" + n.url);
                    this.tagEl.attr("key",n.key).attr("sitename",n.value).attr("siteurl",n.url);
                    return false;
                }
            }.bind(this));
        },
        /*显示列表*/
        showList:function(event){
            var that = this;
            if(this.isShow || this.isEmpty){
                return;
            }
            //this.popBox.offset({top:this.offset.top,left:this.offset.left});
            this.popBox.css({
                "top":this.offset.top+"px",
                "left":this.offset.left+"px"
            });
            this.isShow = true;
            try{
                event.stopPropagation();
            }finally{
                $(document).bind('click', function(event){
                    if(event.target != that.popBox[0] && that.isShow){
                        that.hideList();
                    }
                });
            }
        },
        /*隐藏列表*/
        hideList:function(){
            this.popBox.css(hideCss);
            this.isShow = false;
        },
        /*跳转*/
        jump:function(){}
    }

    return {
        name:"Pop List",
        init:function(o){
            if(!o || !o.id){
                return false;
            }
            return new innerPopList(o);
        }
    }

});