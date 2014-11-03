(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    var cookie = require("cookie");
    var model = require("/resources/app/models/getCode");
    var tabpanel = require("tabpanel");
    var pop_up = require("pop_up");
    /*
            id:"getCode",
            type:"site/customs/conversionMetrics",
            format:true,
            popConfig:{
                once:true
            }
            model:{
                "datasources":{
                    "data":{
                        "type":"report/reserve",
                        "site_id":site_id
                    }
                }
                or
                "datacontent":[
                    {"site_id":site_id}
                ]
            }
    */
    function GetCode(config){
        var privateConfig = {
            tpl:{
                "codeTpl":{
                    /*网站代码*/
                    "site":{
                        "js":"<script type='text/javascript'>\n(function() {\n    var c = document.createElement('script'); \n    c.type = 'text/javascript';\n    c.async = true;\n    c.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + '"+ document.domain +"/boot/<%= site_id %>';\n    var h = document.getElementsByTagName('script')[0];\n    h.parentNode.insertBefore(c, h);\n})();\n</sc"+"ript>",
                        "flash":"ExternalInterface.call(new XML(\"<script><![CDATA[ function(){\n    function start_boot(){\n        var c = document.createElement('script');\n        c.type = 'text/javascript';\n        c.async = true;\n        c.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + '"+ document.domain +"/boot/<%= site_id %>';\n        var h = document.getElementsByTagName('script')[0];\n        h.parentNode.insertBefore(c, h);\n    }\n    start_boot();\n}]]></sc"+"ript>\"));"
                    },
                    /*自定义行为统计代码*/
                    "customs":{
                        "js":'CClicki._trackEvent({\n    type: <%= type_id %>,\n    labels: [\n        {"<%= label[0] %>":" "}    /*'+LANG("填入")+'<%= label[0] %>*/<% var labelmark=["b","c","d"]; for(var i=0;i<label.length-1;i++) { %>,\n        {"<%= label[i+1] %>":" "}    /*'+LANG("填入")+'<%= label[i+1] %>*/<% } %>\n    ],\n    values: [\n        {"<%= value[0] %>":1}    <% var valuemark=["2","3","4"]; for(var i=0;i<value.length-1;i++) { %>, \n        {"<%= value[i+1] %>":1}    <% } %>\n    ]\n});',
                        "flash":'ExternalInterface.call("CClicki._trackEvent", {\n    type: <%= type_id %>,\n    labels: [\n        {"<%= label[0] %>":" "}    /*'+LANG("填入")+'<%= label[0] %>*/<% var labelmark=["b","c","d"]; for(var i=0;i<label.length-1;i++) { %>,\n        {"<%= label[i+1] %>":" "}    /*'+LANG("填入")+'<%= label[i+1] %>*/<% } %>\n    ],\n    values: [\n        {"<%= value[0] %>":1}    <% var valuemark=["2","3","4"]; for(var i=0;i<value.length-1;i++) { %>, \n        {"<%= value[i+1] %>":1}    <% } %>\n    ]\n});'
                    },
                    /*自定义指标代码*/
                    "conversionMetrics":{
                        "js":'CClicki._trackMetrics([\n    0    /*<%= value.reserve0.name %>  '+LANG("完成时，将该值变为")+'<% if(value.reserve0.type === "1"){ %> 1 <% }else{ %><%= value.reserve0.name %><% } %>，'+LANG("否则为0")+'*/<% for(var i=0;i<_.size(value)-1;i++) { %>, \n    0    /*<%= value["reserve"+(i+1)].name %>  '+LANG("完成时，将该值变为")+'<% if(value["reserve"+(i+1)].type === "1"){ %> 1 <% }else{ %><%= value["reserve"+(i+1)].name %><% } %>，'+LANG("否则为0")+'*/<% } %>\n]);',
                        "flash":'ExternalInterface.call("CClicki._trackMetrics", [\n    0    /*<%= value.reserve0.name %>  '+LANG("完成时，将该值变为")+'<% if(value.reserve0.type === "1"){ %> 1 <% }else{ %><%= value.reserve0.name %><% } %>，'+LANG("否则为0")+'*/<% for(var i=0;i<_.size(value)-1;i++) { %>, \n    0    /*<%= value["reserve"+(i+1)].name %>  '+LANG("完成时，将该值变为")+'<% if(value["reserve"+(i+1)].type === "1"){ %> 1 <% }else{ %><%= value["reserve"+(i+1)].name %><% } %>，'+LANG("否则为0")+'*/<% } %>\n]);'
                    }
                },
                /*代码layout*/
                "jsPanelTpl": '<div class="jsCode codeTpl"><h3>'+LANG("请将下面的代码插入您的网站里")+'</h3><textarea cols="80" rows="5" readonly id="copyJsText_<%= type %><%= index %>"></textarea><div class="latJs"><div id="copied" style="display:none"></div><div id="copied_jstips_<%= type %><%= index %>" style="color:red;text-align:center;display:none;"></div><span class="fBntMar"><span id="clicki_js_clipboard_<%= type %><%= index %>"></span></span></div></div>',
                "flashPanelTpl": '<div class="flashCode codeTpl"><h3>'+LANG("请将下面的代码插入您的网站里")+'</h3><textarea cols="80" rows="5" readonly id="copyFlashText_<%= type %><%= index %>"></textarea><div class="latJs"><div id="copied" style="display:none"></div><div id="copied_flashtips_<%= type %><%= index %>" style="color:red;text-align:center;display:none;"></div><span class="fBntMar"><span id="clicki_flash_clipboard_<%= type %><%= index %>"></span></span></div></div>'
            },
            doms:{
                jsCode:[],
                jsPanel:[],
                flashCode:[],
                flashPanel:[]
            },
            tagName: "div",
            events: {
            },
            refreshConfig: {},
            tabpanels:{},

            /*初始化处理函数*/
            initialize: function() {
                var _id = this.id || null;
                _id = typeof(_id) === "string" && $("#"+_id)
                            || _id && (_id.nodeType || _id.selector || _id.jquery) && _id;
                /*如果有id，就会渲染到该标签内，没有就会新建弹出层*/
                if(_id){
                    this.$el = $(_id);
                    this.el = this.$el[0];
                }else{
                    /*弹出层有基本样式，可以设置覆盖*/
                    this.pop = new pop_up($.extend(true,{
                        "type":{
                            "html":this.$el
                        }
                    },this.popConfig));
                }
                delete(this.id);
                this.model.ui = this;
                this.model = new model(this.model);
            },

            refresh:function(config){
                this[config.event] && this[config.event](config.data);
            },

            render:function(){
                /*渲染模版*/
                this.jsCodeTemplate = _.template(this.tpl.codeTpl[this.type].js);
                this.flashCodeTemplate = _.template(this.tpl.codeTpl[this.type].flash);
                this.jsPanelTemplate = _.template(this.tpl.jsPanelTpl);
                this.flashPanelTemplate = _.template(this.tpl.flashPanelTpl);
                this.fn.build.call(this);
            },

            fn:{
                build:function(){
                    /*获取代码模板需要的数据*/
                    var data = this.model.toJSON().items;
                    for(var i=0,len=data.length;i<len;i++){
                        /*默认对数据进行格式化，可以设置取消*/
                        var item = this.format ? this.fn[this.type+"Format"].call(this, data[i]) : data[i];
                        /*js代码，layout渲染*/
                        this.doms.jsCode[i] = this.jsCodeTemplate(item);
                        this.doms.jsPanel[i] = $(this.jsPanelTemplate({type:this.type,index:i}));
                        this.doms.jsPanel[i].find("textarea").attr("value",this.doms.jsCode[i]);
                        /*flash代码，layout渲染*/
                        this.doms.flashCode[i] = this.flashCodeTemplate(item);
                        this.doms.flashPanel[i] = $(this.flashPanelTemplate({type:this.type,index:i}));
                        this.doms.flashPanel[i].find("textarea").attr("value",this.doms.flashCode[i]);
                        /*把layout放进视图*/
                        this.$el.append('<div id="showCode_'+this.type+i+'" class="showCode" ></div>');
                        /*如果有弹出层，就会立刻显示*/
                        this.pop && this.pop.show() || this.$el.append('<hr />');
                        /*把两段代码用标签页形式进行展示*/
                        this.tabpanels[i] = new tabpanel.init({
                            id:this.$el.find("#showCode_"+this.type+i),
                            tabName:"page",
                            items:[
                                {
                                    codeIndex:i,
                                    codeType:this.type,
                                    text:LANG("JS调用方式"),
                                    html:this.doms.jsPanel[i],
                                    afterRender:function(){
                                        /*绑定粘贴和全选事件*/
                                        Clicki && Clicki.clipboardRender({targetEl:"clicki_js_clipboard_"+this.codeType+this.codeIndex, textEl:"copyJsText_"+this.codeType+this.codeIndex, tipEl:"copied_jstips_"+this.codeType+this.codeIndex});
                                        this.dom.find("textarea").bind("click", function(){
                                            this.select();
                                        });
                                    }
                                },
                                {
                                    codeIndex:i,
                                    codeType:this.type,
                                    text:LANG("Flash内部调用方式"),
                                    html:this.doms.flashPanel[i],
                                    afterRender:function(){
                                         Clicki && Clicki.clipboardRender({targetEl:"clicki_flash_clipboard_"+this.codeType+this.codeIndex, textEl:"copyFlashText_"+this.codeType+this.codeIndex ,tipEl:"copied_flashtips_"+this.codeType+this.codeIndex});
                                         this.dom.find("textarea").bind("click", function(){
                                            this.select();
                                        });
                                    }
                                }
                            ]
                        });
                    }
                    if(Clicki.Balance){
                        Clicki.Balance();
                    }
                },
                /*自定义指标格式化函数*/
                conversionMetricsFormat:function(value){
                    return {value:value["0"]};
                },
                /*自定义行为统计格式化函数*/
                customsFormat:function(value){
                    var data = value;
                    var latData={
                        label:[],
                        value:[]
                    };
                    if(!data){
                        return latData;
                    }
                    latData.type_id = data.id;
                    data.title && this.$el.append("<h3>"+LANG("报告名称：")+""+data.title+"</h3>");
                    for(var i=0; i<4; i++){
                        if(data["label"+i+"_name"]){
                            latData.label.push(data["label"+i+"_name"]);
                        }
                        if(data["value"+i+"_name"]){
                            latData.value.push(data["value"+i+"_name"]);
                        }
                    }
                    data = null;
                    return latData;
                },
                /*网站代码格式化函数*/
                siteFormat:function(value){
                    return {"site_id":value.site_id};
                }
            },

            show:function(){
                this.pop && this.pop.show();
            },

            hide:function(){
                this.pop && this.pop.show();
            },

            destroy:function(){
                /*如果弹出层有内容则一块销毁*/
                this.pop && this.pop.$el && this.pop.$el.length && this.pop.destroy();
                this.$el.find("*").unbind();
                this.$el.unbind().empty();
            }
        };

        var viewsConfig = $.extend(true,{
            "format":true, 
            "popConfig":{
                "autoClose":false,
                "ui":{
                    "width":510
                },
                "showMark":true,
                "once":true
            }
        },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }
    
    GetCode.prototype.constructor = GetCode;

    return function(config){
        return new GetCode(config);
    };

});