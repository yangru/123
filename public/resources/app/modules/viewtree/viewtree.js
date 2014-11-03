(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var $ = require("jquery")
        ,base = require("base")
        ,pop_up = require("pop_up")
        ,Backbone = require("backbone")
        ,treeModel = function(ui){
            return Backbone.Model.extend({
                "ui":ui
                ,"nowStatus":"update"
                ,initialize:function(){
                    this.datasources.context = this;
                    this.bind("change",this.onChange);
                }
                ,"datasources":{
                    "url":"/VisitPath/url",
                    "data":{},
                    dataFilter:function(re,type){
                        re = $.parseJSON(re);
                        if(re.success){
                            var data = re.result;
                            return (re = JSON.stringify(data));
                        }else{
                            var def = $.Deferred(this);
                            def.reject();
                            return false;
                        }
                    },
                    "type":"GET"
                }
                ,onChange:function(data){
                    if(this.ui){
                        this.ui.refresh({
                            "data":data !== this && data || this.attributes,
                            "event":this.nowStatus,
                            "model":this
                        });
                    }
                }
                /**
                 * 获取指定类型指定序号的数据
                 * @param  {Int}    i    序号
                 * @param  {String} type 类型
                 * @return {Object}      对应的数据对象。当找不到时放回Null
                 */
                ,getTypeDataByIndex:function(i,type){
                    return this.attributes[type] && this.attributes[type][i] || null;
                }
                ,read:function(data){
                    this.fn._getData.call(this,data || {});
                }
                ,"fn":{
                    _getData:function(data){
                        if(this.going){
                            //TODO 进入正在加载流程，UE上提示不要重复提交等等操作
                            return false;
                        }
                        this.going = true;

                        data && (this.datasources.data = $.extend(this.datasources.data,data));
                        
                        /*更新数据*/
                        this.fetch(this.datasources)
                        .then(
                            /*成功时执行*/
                            function(def,state){
                                if(this.onLoad){
                                    this.onLoad.call(this);
                                }
                                // this.onChange();
                            },
                            /*失败时执行*/
                            function(def,state){
                                console.log("!");
                            }
                        )
                        /*不管成功或失败的时候都会执行*/
                        .always(function(){
                            this.going = false;
                        });
                    }
                    ,_savePath:function(data){
                        //
                    }
                }
            });
        }

    function Viewtree(config){

        var _id = config.id;
        delete config.id;

        var privateConfig = {
            "tagName":"div"
            ,"doms":{
                "tag":$(
                    typeof(_id) === "string" && $(_id)
                    || _id && (_id.nodeType || _id.jquery) && _id
                )
                ,"stage":{
                    "Prev":{
                        "main":null
                        ,"input":null
                        ,"output":null
                        ,"now":null
                        ,"nowTitle":null
                        ,"nowValue":null
                    }
                    ,"Now":{}
                    ,"Next":{}
                }
            }
            /**
             * now | prev | next
             */
            ,"incoming":"Now"
            ,"cache":{}
            ,"data":{
                "prevMax":0
                ,"nextMax":0
                ,"pageMax":0
                ,"maxHeight":15
                ,"minHeight":2
                ,"lv":0
            }
            ,initialize:function(){
                this.model = treeModel(this);
                this.model = (new this.model);
                this.fn._init.call(this);
            }
            ,"fn":{
                _init:function(){
                    this.fn._buildBase.call(this)
                        .fn._bindEvent.call(this,"Now")
                        .model.read(this.params);
                }
                ,"_constructor":this
                /**
                 * 基本结构构造函数
                 * @return  {Object} Viewtree实例对象
                 * @private
                 */
                ,_buildBase:function(){
                    this.doms.tag.addClass(this.ux.outerBoxCls).append(
                        base.tpl.repLabel(this.tpl.base,1,{
                            "type":"Prev"
                            ,"style":""
                        })
                        +
                        base.tpl.repLabel(this.tpl.base,1,{
                            "type":"Now"
                            ,"style":''
                        })
                        +
                        base.tpl.repLabel(this.tpl.base,1,{
                            "type":"Next"
                            ,"style":""
                        })
                    );

                    for(var n in this.doms.stage){
                        this.doms.stage[n].main = this.doms.tag.find("#theView"+n);
                        if(n === "Now"){
                            this.doms.stage[n].now = this.doms.tag.find("#theTreeNow"+n);
                            this.doms.stage[n].input = this.doms.tag.find("#theTreeInput"+n+" > ul");
                            this.doms.stage[n].output = this.doms.tag.find("#theTreeOutput"+n+" > ul");
                            this.doms.stage[n].nowTitle = this.doms.stage[n].now.find("p:first");
                            this.doms.stage[n].nowValue = this.doms.stage[n].now.find("em:first > strong");
                        }
                    }
                    
                    return this;
                }
                /**
                 * 生成代表路径的线
                 * @return  {Object} Viewtree实例对象
                 * @private
                 */
                ,_buildLine:function(){
                    //
                    return this;
                }
                /**
                 * 生成路径树图
                 * @param   {Object}    data    路径数据
                 * @return  {Object}            Viewtree实例对象
                 * @private
                 */
                ,_buildPath:function(data){

                    data = data || this.model.attributes || {};

                    var me = this
                        ,str = ""
                        ,max = 0
                        ,type;

                    function _firstToLoUpper(str){
                        return (""+str).replace(/(^|\s+)\w/g,function(s){return s.toUpperCase();})
                    }
                    
                    this.data.pageMax = +data.page.amount.metrics[me.dataLabel];

                    for(var n in data){
                        type = _firstToLoUpper(n);
                        if(this.doms.stage[type]){
                            _.each(data[n].items,function(item,index){
                                if(index < 6){
                                    var title = item.dims.source0_name || item.dims.page_url_title
                                        ,url = item.dims.page_url_name||""
                                        ,pre = (item.metrics[me.dataLabel]/me.data.pageMax);

                                    pre = pre>1?1:pre;

                                    str += base.tpl.repLabel(me.tpl.line,1,{
                                        "i":index
                                        ,"ix":index+1
                                        ,"key":item.keys.source0_id || item.keys.page_url_id
                                        ,"type":type
                                        ,"title":title.cutMixStr(0,30,"...")
                                        ,"rtitle":title
                                        ,"rurl":url
                                        ,"url":url.cutMixStr(0,40,"...",false)
                                        ,"value":item.metrics[me.dataLabel].separated()
                                        ,"pre":(pre*100).toFixed(2)
                                        ,"alow":+(!item.keys.source0_id)
                                    });
                                }
                            });
                            this.doms.stage.Now[
                                n === "next" && "output"
                                || "input"
                            ].append(str);
                            
                            str = "";
                        }else if(n === "page" && data[n].items.length){
                            this.doms.stage.Now.nowTitle.attr("title",data[n].items[0].dims.page_url_title).text(data[n].items[0].dims.page_url_title);
                            this.doms.stage.Now.nowValue.text(data[n].amount.metrics[me.dataLabel]);
                        }
                    }
                    //this.doms.stage.Now.main.animate({"opacity":1},400);
                    //TODO 当前页面的数据对应的是page？

                    return this;
                }
                ,_firstToLoUpper:function(str){
                    return (""+str).replace(/(^|\s+)\w/g,function(s){return s.toUpperCase();})
                }
                /**
                 * 设定每条路径的表现
                 * @param   {Object} data 当前舞台对应的数据
                 * @private
                 */
                ,_setPath:function(data){
                    var stage = this.doms.stage.Now
                        ,me = this
                        ,dType = {"input":"prev","output":"next"};

                    function _setter(type){
                        stage[type].find("li").each(function(i,n){
                            //TODO 是否需要把定位也处理下？
                            
                            var pre = +(((data[dType[type]].items[i].metrics[me.dataLabel]/me.data.pageMax)).toFixed(2))
                                ,p;
                            pre = isNaN(pre)?0:pre;
                            pre = pre>1&&1||pre;
                            p = $(n).find(".h:first").height(
                                !pre && me.data.minHeight 
                                    || me.data.maxHeight*pre < me.data.minHeight && me.data.minHeight
                                    || me.data.maxHeight*pre
                            ).find("p");

                            p.css(
                                "left",
                                type === "input" && ("-"+(p.width()+54)+"px")
                                || (120+"px")
                            );

                        });
                    }

                    _setter("input");
                    _setter("output");

                    this.doms.stage.Now.nowTitle.css("top","-"+this.doms.stage.Now.nowTitle.height()+"px");
                    if(this.data.lv){
                        setTimeout(function(){

                            var passType = this.incoming === "Next" && "Prev" || "Next"
                                ,me =this;

                                // this.doms.stage.Now.main
                                //         .css("display","none")
                                //         .removeClass("stage"+passType)
                                //         .addClass("stageNow");

                                // this.doms.stage[this.incoming].main
                                //     .css("display","none")
                                //     .removeClass("stageNow")
                                //     .addClass("stage"+this.incoming);

                                // setTimeout(function(){

                                //     this.doms.stage[this.incoming].main.css({
                                //         "display":"initial"
                                //         ,"opacity":1
                                //     }).animate({"opacity":0},100,function(){
                                //         // this.doms.stage[this.incoming].main.css("opacity","initial");
                                //     }.bind(this));

                                //     this.doms.stage.Now.main.css({
                                //         "display":"initial"
                                //         ,"opacity":0
                                //     }).animate({"opacity":1},100,function(){
                                //         // this.doms.stage.Now.main.css("opacity","initial");
                                //     }.bind(this));
                                // }.bind(this),50);


                        }.bind(this),500);
                    }
                    
                }
                /**
                 * 事件绑定函数
                 * @param   {String}    name   场景名
                 * @param   {Boolean}   unbind 解除事件监听
                 * @return  {Object}           Viewtree实例对象
                 * @private
                 */
                ,_bindEvent:function(name,unbind){

                    function _mouseenterHandler(){
                        $(this).closest("li[data-key]").addClass("lineOver");
                    }

                    function _mouseleaveHandler(){
                        $(this).closest("li[data-key]").removeClass("lineOver");
                    }
                    
                    if(!+this.doms.stage[name].main.attr("data-eventready")){
                        this.doms.stage[name].main.find(".v,.h,.b")
                            //.add(this.doms.stage[name].output.find(".v,.h,.b"))
                                .live("click",this.fn._goToThisPath.bind(this))
                                .live("mouseenter",_mouseenterHandler)
                                .live("mouseleave",_mouseleaveHandler);

                        this.doms.stage[name].main.attr("data-eventready",1);
                    }else if(unbind){
                        this.doms.stage[name].main.find(".v,.h,.b")
                            .die("click mouseenter mouseleave")
                    }

                    return this;
                }
                /**
                 * 跳转到指定的路径
                 * @param   {MouseEvent} ev 鼠标事件
                 * @return  {Bool}     False
                 * @private
                 */
                ,_goToThisPath:function(ev){
                    var eTag = $(ev.target)
                        ,tag = eTag.closest("li[data-key]")
                        ,key
                        ,index
                        ,type
                        ,data
                        ,alow = +tag.attr("data-alow")
                        ,fid = +this.model.attributes.page.items[0].keys.flow_id;

                    if(tag.length && alow){
                        key = tag.attr("data-key");
                        index = +tag.attr("data-index");
                        type = tag.attr("data-type").toLowerCase();

                        this.incoming = this.fn._firstToLoUpper(type);
                        this.model.nowStatus = "update";

                        //根据类型更改相应的舞台样式。利用CSS3实现3D动画切换
                        
                        fid = fid+({"prev":-1,"next":1}[type]);
                       this.data.lv += 1;

                        // var goingType = type === "next" && "Next" || "Prev"
                        //     ,passType = type === "next" && "Prev" || "Next";

                        // this.doms.stage[this.incoming].main
                        //     .empty()
                        //     .append(this.doms.stage.Now.main.html())
                        //     .removeClass("stage"+this.incoming)
                        //     .addClass("stageNow");

                        // this.doms.stage.Now.main
                        //     .removeClass("stageNow")
                        //     .addClass("stage"+passType);

                        this.fn._clearStage.call(this,"Now");

                        this.model.read({
                            "page_url_id":key
                            ,"flow_id":fid
                        });

                    }
                    return false;
                }
                /**
                 * 清除指定舞台的内容。清除上下游列表dom对象，置空名称与数值
                 * @param   {String} type 舞台名称
                 * @return  {Object}      Viewtree实例对象
                 * @private
                 */
                ,_clearStage:function(type){
                    var stage = this.doms.stage[type];
                    if(stage){
                        stage.input.find("li")
                            .add(stage.output.find("li"))
                            .remove();
                        stage.nowValue.text("");
                        stage.nowTitle.text("");
                    }
                    return this;
                }
            }
            /**
             * 销毁函数
             * @return {Undefined} 无返回
             */
            ,destroy:function(){
                if(this.$el){
                    this.$el.find("*").unbind();
                    this.$el.remove();
                }
            }
            /**
             * 对外统一接口
             * @param  {Object} config      参数配置{"event":EventName,"data":Data}
             * @return {Undefiened}         无返回值
             */
            ,refresh:function(config){
                !this.model && config.model && (this.model = config.model);
                this[config.event] && this[config.event](config.data);
            }
            /**
             * 刷新函数
             * @param  {Object} data    刷新模块所需的参数
             * @return {Undefined}      无返回值
             */
            ,update:function(data,toClear){
                if(toClear){
                    this.fn._clearStage.call(this,toClear);
                }
                this.fn._buildPath.call(this,data)
                    .fn._setPath.call(this,data);

            }
            /**
             * 新的日期控件需要用到的日期修改接口
             * @param  {Object}     data    新的日期
             * @return {Undefined}          无返回值
             */
            ,changeDate:function(data){
                if(data){
                    this.params.begindate = data.begindate;
                    this.params.enddate = data.enddate;
                    this.fn._clearStage.call(this,"Now")
                    this.model.read(this.params);
                }
            }
        };

        var viewsConfig = $.extend(true,{
            "id":"body:first"
            ,"tpl":{
                "line":'<li class="l{ix}" data-index="{i}" data-key="{key}" data-type="{type}" data-alow="{alow}"><div class="v"></div><div class="h"><p><strong title="{rtitle}">{title}<a href="{rurl}" title="{rtitle}">{url}</a></strong><span>{value}({pre}%)</span></p><b></b></div><div class="b"></div></li>'
                //TODO 对应数据字段的名称需要在服务端下发
                ,"base":'<div class="Ex_viewpathTree stage{type}" {style} id="theView{type}" data-eventready="0"><div class="pathIn" id="theTreeInput{type}"><ul></ul></div><div class="pathNow" id="theTreeNow{type}"><div><p></p><em><strong></strong><span>'+LANG("会话次数")+'</span></em></div></div><div class="pathOut" id="theTreeOutput{type}"><ul></ul></div></div>'
            }
            ,"params":{
                "site_id":0
                ,"page_url_id":""
                ,"flow_id":1
                ,"begindate":Clicki.layout.manager.date.begindate
                ,"enddate":Clicki.layout.manager.date.enddate
                ,"page":1
                ,"limit":10
            }
            ,"dataLabel":"sessions"
            ,"ux":{
                "outerBoxCls":"Ex_viewpathTreeOuter"
                ,"prev":"stagePrev"
                ,"next":"stageNow"
                ,"now":"stageNext"
            }
        },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;

    }

    Viewtree.prototype.constructor = Viewtree

    return function(config){

        if(config.rowData){
            config.params.page_url_id = config.rowData.keys.page_url_id;
        }

        return new Viewtree(config)
    };

});