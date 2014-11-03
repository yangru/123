(function(factory){
    if(typeof(define) === "function"){
        define(factory);
    }else{
        factory();
    }
})(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    var tableBtn = require("tableBtn");
    var _ = require('underscore');
    var privateConfig = {
        "tpl":{
            //////////////////////翻译------表格内容//////////////////////////////
            "tdTpl":'<td class="<% if(isSort){ %>isSort<% } %>" data-type="<%= type %>" nocompare="<%= nocompare %>" style="<% if(hidden){ %>display:none;<% } %>"><div style="<% if(colNum === 1){ %>text-align:left;padding-right:20px;<% } %>"><span></span><span style="<% if(colNum === 1){ %>text-align:left;<% } %>" class="<%= cls %>" title="<%= LANG(title) %>"><%= LANG(value) %></span><span></span></div></td>',
            "ctrlTpl":'<a href="<%= href %>" data-action="<%= type %>" class="<%= className %>"><%= text %></a>'
        },
        "doms":{},
        "tds":[],
        "colNum":1,
        "tagName":"tr",
        "dimArray":[],
        /*初始化处理函数*/
        initialize:function(){
            this.tdTemplate = _.template(this.tpl.tdTpl);
        },
        render:function(){
            this.fn.buildRow.call(this);
            this.tableBtn && this.fn.setTableBtn.call(this);
            this.tableCtrl && this.fn.setTableCtrl.call(this);
            return this;
        },
        fn:{
            buildRow:function(){
                this.defSort = this.params.order.substring(0,this.params.order.indexOf("|"));
                this.dimArray = _.keys(this.dim);
                var tdsData = this.model.toJSON();
                var data;
                this.doms.tds={};
                this.$el.append("<td><div style=\"text-align:center\"><span>"+this.rowNum+"</span></div></td>");
                var i = 0;
                $.each(_.uniq(this.dimArray.concat(this.indicator.all)), function(key, value){
                    var td = {};
                    td.type = value;
                    $.each(tdsData, function(n, nn){
                        if (nn.hasOwnProperty(value)){
                        //if(nn[value] || nn[value] == 0){
                            td.value = (nn[value] == null || nn[value] == undefined) ? '&nbsp;' : nn[value];
                            var includeDim = this.selected || this.indicator["default"];
                            if(!_.include(this.dimArray.concat(includeDim), value)){
                                td.hidden = true;
                            }
                            this.fn.getCellHtml.call(this, this.rowNum, td, this.colNum);
                            this.colNum++;
                            this.tds.push(td);
                        }else{
                        }
                    }.bind(this));
                }.bind(this));
            },

            getCellHtml:function(rowNum, td, colNum){
                var me = this;
                var val = td.value;
                var type = td.type;
                var hidden = td.hidden;
                /*格式化*/
                val = (val === null?0:val);
                val = (type === "bounce_rate"?Math.round(parseFloat(val)*10000)/100 +"%":val);
                val = (type === "avg_loadtime"?(val/1000)+LANG("秒"):val);
                val = (type === "avg_staytime"?(new Date(val*1000).timemark([":",":",""],true)):val);
                val = (typeof val === "number"?val.separated():val)
                /*链接地址*/
                var isSort = (this.defSort === type?true:false);
                var titleStr = /<(.*) [^>]*>/.test(val)?"":val;
                var href = /[http]||[www.]||[:?(.)]/.test(val)?val:false;
                if(val && val.length > this.ellipsis){
                    val = val.substr(0,this.ellipsis)+"...";
                }
                /*是否自定义render*/
                this.dim[type] && this.dim[type].render && (val = this.dim[type].render(me, val, href, colNum));
                /*渲染*/
                this.doms.tds["td"+colNum] = $(this.tdTemplate({
                    "nocompare":td.compare || 0,
                    "cls":td.cls || "",
                    "hidden":hidden,
                    "title":titleStr,
                    "value":val,
                    "colNum":this.colNum,
                    "type":type,
                    "isSort":isSort
                }));
                this.$el.append(this.doms.tds["td"+colNum]);
            },

            setTableBtn:function(){
                this.tableBtns = new tableBtn({
                    "el":this.$el,
                    "tableBtn":this.tableBtn,
                    "rowData":this.model.toJSON(),
                    "table":this.table,
                    "tableRow":this
                });
            },

            setTableCtrl:function(){
                /*独立操作列只能放在最后*/
                this.$el.append("<td><div style=\"text-align:center\"><span class=\"tableCtrl\"></span></div></td>");
                $.each(this.tableCtrl, function(key, value){
                    this.doms["ctrl"+key] = $(_.template(this.tpl.ctrlTpl)({
                        "href":value.href||"javascript:void(0)",
                        "type":key,
                        "className":value.className,
                        "text":LANG(value.text)                    
                    }));
                    this.$el.find("span:last").append(this.doms["ctrl"+key]);
                    if(value.fun){
                        this.doms["ctrl"+key].bind("click",function(){
                            value.fun(this.model.toJSON(), this.rowNum);
                        }.bind(this));
                    }
                }.bind(this));
                this.colNum++;
            }
        },
        doIndicator:function(data){
            if(data.hasBeenSelected){
                var selected = this.dimArray.concat(data.hasBeenSelected)

                $.each(this.tds,function(i,n){
                    if($.inArray(n.type, selected) === -1){
                        n.hidden = true;
                    }else{
                        n.hidden = false;
                    }
                });

                for(var i=0,len=_.size(this.doms.tds);i<len;i++){
                    this.doms.tds["td"+(i+1)].css("display",this.tds[i].hidden?"none":"table-cell");
                }
            }
        },
        doCheckBox:function(data){
            //TODO 设置状态，刷新也会出现checkbox
            if(data.build){
                data.area && this.doms.tds[data.area].find("span:first").append('<input class="checkbox_'+data.dataType+'" type="checkbox" data-name="'+this.dimArray[0]+'" data-dtype="'+data.dataType+'" value="'+this.rowNum+'"/> ');
            }else{
                this.doms.tds[data.area].find("span:first").empty();
            }
        }
    };

    return function(config){
        var rowViewConfig = $.extend(true,{
            "ellipsis":30
        },privateConfig,(config||{}));
        return new (Backbone.View.extend(rowViewConfig));
    }

});