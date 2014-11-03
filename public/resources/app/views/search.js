define(function(require,exports,module){

    var $ = window.$ || window.jQuery || require("jquery");
    var Backbone = require("backbone");
    var base = require("base");
    var Manager = require("new_manager");
 
    /*主模块构造函数*/
    function Search(config){

        /*追加容器的id或dom或jq对象*/
        var _id = config.id || null;
        delete config.id;

        var privateConfig = {
            "doms":{
                "tag":$(
                    typeof(_id) === "string" && ("#"+_id)
                    || _id && (_id.nodeType || _id.selector) && _id
                    || "body:first"
                ),
                "text":null,
                "submit":null,
                "reset":null,
                "autoComplete":null
            },
            "model":Backbone.Model.extend({
                "defaults":{
                    "keyword":""
                }
            }),
            refresh:function(config){
                !this.model && config.model && (this.model = config.model);
                this[config.event] && this[config.event](config.data);
            },
            initialize:function(){

                this.model = new this.model();
                this.model.bind("change",this.fn._push,this);
                //
                this.manager = !this.readOtherDir && Clicki.layout && Clicki.layout.manager
                            || new Manager({
                                "relation":{},
                                "layout":Clicki.manager
                            });
                //
                this.searchManagerName = "theSearch_"+this.cid;
                //
                if($.isArray(this.slave) && this.slave.length){
                   this.manager.add(this.searchManagerName,this.slave); 
                }
                
                this.fn._build.call(this);
                this.fn._bindEvent.call(this);

                this.ready = true;
            },
            /*重置*/
            reset:function(){
                this.doms.text.val("");
                this.model.set("keyword","");
                this.doms.reset.hide();
            },
            update:function(data){
                $.extend(true,this.params, data.params);
            },
            destroy:function(){
                this.$el.find("*").unbind();
                this.$el.unbind().empty();
            },
            /*搜索*/
            search:function(){
                var val = $.trim(this.doms.text.val());
                this.doms.text.blur();
                this.model.set("keyword",encodeURI(val));
                if(val !== ""){
                    this.doms.reset.show();
                }else if(val ===""){
                    this.doms.reset.hide();
                };
            },
            "fn":{
                /*构造*/
                _build:function(){

                    var htm = base.tpl.repLabel(this.tpl,1,{
                        "button":this.ui.cls.button,
                        "text":this.ui.cls.text,
                        "reset":this.ui.cls.reset,
                        "placeholder":this.placeholder
                    });

                    htm = $(htm);
                    this.$el.append(htm);
                    this.doms.button = this.$el.find("*[data-type='submit']");
                    this.doms.text = this.$el.find("input[data-type='keyword']:first");
                    this.doms.reset = this.$el.find("*[data-type='reset']");
                    this.doms.reset.hide();
                    this.doms.tag.append(this.$el);
                },
                /*将条件追加到受控模块中*/
                _push:function(){
                    var word = {"page":1};
                    word[this.prefix] = this.model.get("keyword");
                    //
                    this.manager.run(this.searchManagerName,{
                        data:word,
                        event:"update"
                    });
                    //commonGrid的控制方法
                    this.grid && this.grid.gridLayout.manager.run("search",{
                        "event":"doSearch",
                        "data":{
                            "params":word
                        }
                    });
                    word = null;
                },
                /*事件绑定*/
                _bindEvent:function(){
                    this.delegateEvents({
                        /*提交*/
                        "click *[data-type='submit']":"search",
                        /*重置*/
                        "click *[data-type='reset']":"reset"
                    });
                    /*按键监听*/
                    this.doms.text.bind("keyup",this.fn._listionKeybord.bind(this));
                },
                _listionKeybord:function(ev){
                    if(ev.keyCode === 13){
                        this.search();
                    }
                },
                /*出错时*/
                _error:function(){},
                /*验证*/
                _validate:function(){}
            }
        };

        var viewsConfig = $.extend(true,{
            "ui":{
                /*样式合集*/
                "cls":{
                    "button":"Ex_button",
                    "text":"Ex_text",
                    "reset":"Ex_reset"
                }
            },
            "placeholder":LANG("请输入搜索内容"),
            /*是否启用智能联想*/
            "autoComplete":false,
            /*发送的关键词前缀*/
            "prefix":"word",
            /*前缀与关键词之间的分隔符*/
            "separator":"|",
            "readOtherDir":false,
            /*模板*/
            "tpl":'<input type="text" class="setSeachInput {text}" placeholder="{placeholder}" data-type="keyword" value="" /><button type="button" class="{button}" data-type="submit" ><span>搜索</span></button><input type="reset" class="{reset}" data-type="reset" value="'+LANG("还原")+'" />'
        },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }

    Search.prototype.constructor = Search;

    return function(config){
        return new Search(config)
    };

});






