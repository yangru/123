define(function(require,exports,module){

    var $ = window.$ || window.jQuery || require("jquery");
    var Backbone = require("backbone");
    var dropdownlist = require("dropdownlist");

    function diggGrid(config){
        /*私有设置，这里应该是关键的属性，方法的配置*/
        var privateConfig = {
            ready:false,
            tpl:{
                "diggCtrlTpl":'<div class="diggCtrl btnGreen">'+LANG("开启钻取")+'</div>',
                "diggStartTpl":'<div class="diggStart btnGreen">'+LANG("钻取")+'</div>',
                "diggListTpl":'<div class="diggList"></div>',
                "diggGridTpl":'<div class="diggNextGrid"></div>',
                "diggInfoTpl":'<div class="diggInfo">'+LANG("已选维度：")+'</div>'
            },
            diggGrid:null,
            type:null,
            condition:null,
            tableRows:null,
            doms:{

            },
            refresh:function(config){
                !this.model && config.model && (this.model = config.model);
                this[config.event] && this[config.event](config.data);
            },
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
                this.$el.append(this.tpl.diggCtrlTpl);
                //使表格增加多选框
                this.fn._buildCheckBox.call(this);
                this.ready = true;
            },
            "fn":{
                //改造表格，增加checkbox
                _buildCheckBox:function(){
                    var me = this;
                    this.$el.find(".diggCtrl").bind("click", function(){
                        if($(this).hasClass("act")){
                            me.grid && me.grid.gridLayout.manager.run("diggGrid",{
                                "event":"doCheckBox",
                                "data":{
                                    "area":"td1",
                                    "dataType":"digg",
                                    "build":false
                                }
                            });
                            $(this).removeClass("act").html(LANG("开启钻取"));
                            me.fn._hideDigg.call(me);
                        }else{
                            me.grid && me.grid.gridLayout.manager.run("diggGrid",{
                                "event":"doCheckBox",
                                "data":{
                                    "area":"td1",
                                    "dataType":"digg",
                                    "build":true
                                }
                            });
                            $(this).addClass("act").html(LANG("关闭钻取"));
                            me.fn._showDigg.call(me);
                        }
                    });
                },
                //显示下拉列表和钻取按钮
                _showDigg:function(){
                    $.get("/custom/tabs?type=digg&&site_id="+site_id,function(re){
                        if(re.success){
                            this.$el.append(this.tpl.diggListTpl);
                            var data = {};
                            data.items = $.parseJSON(JSON.stringify(re.custom_model));
                            data.items.push({
                                "name":LANG("请选择"),
                                "hide":true,
                                "def":true
                            });
                            this.dropdownlist = new dropdownlist({
                                "view":{
                                    "tpl":{
                                        "item":'<li class="{hasSub} {desc}" data-i={i} data-id="{value}">{name}</li>'
                                    },
                                    "ui":{
                                        "selected":""
                                    }
                                },
                                "model":{
                                    "datacontent":data
                                },
                                "id":this.$el.find(".diggList"),
                                onSelect:function(beenSelect,dpl){
                                    this.type = beenSelect;
                                }.bind(this),
                                callback:function(me){
                                    this.$el.append(this.tpl.diggStartTpl);
                                    this.fn._bindEvent.call(this);
                                }.bind(this)
                            });
                            ///////alert(this.dropdownlist.view.tpl.name)
                            if(Clicki.Balance){
                                Clicki.Balance(null, 350);
                            }
                        }
                    }.bind(this),"json");
                },
                //去除下拉列表和钻取按钮，同时销毁各个模块
                _hideDigg:function(){
                    this.type = null;
                    this.condition = null;
                    this.dropdownlist && this.dropdownlist.destroy();
                    this.dropdownlist = null;
                    this.$el.find(".diggList,.diggStart,.diggInfo").unbind().remove();
                    this.diggGrid && this.diggGrid.destroy();
                    this.diggGrid = null;
                    this.doms.grid && this.doms.grid.remove();
                    if(Clicki.Balance){
                        Clicki.Balance();
                    }
                },
                //给钻取按钮绑定事件
                _bindEvent:function(){
                    var me = this;
                    this.$el.find(".diggStart").bind("click", function(){
                        //获取之前的条件
                        var prevCondition = me.params.condition;
                        var currentCondition = "";
                        var currentInfo = "";
                        me.tableRows = me.grid.gridLayout.get("table").tableLayout.get("tableRows");
                        var tableRowsData = me.tableRows.collection.toJSON();
                        var checkBoxs = me.tableRows.$el.find(":checked[data-dtype='digg']");
                        //根据勾选的checkbox获取当前表格的已选条件和名字
                        for(var i=0,len=checkBoxs.length;i<len;i++){
                            currentInfo += tableRowsData[(+checkBoxs[i].value)-1].x_axis[$(checkBoxs[i]).data("name")] + " —— ";
                            $.each(tableRowsData[(+checkBoxs[i].value)-1].keys, function(key, value){
                                currentCondition += key + "|" + value + ",";
                            });
                        }
                        if(prevCondition){
                            me.condition = currentCondition + prevCondition;
                        }else{
                            me.condition = currentCondition.substr(0,currentCondition.length-1);
                        }
                        //组合条件后渲染下一层表格
                        //没有选择框，没有选择下拉，没有该类型表格的错误处理
                        if(me.fn._checkError.call(me)){
                            require.async([me.type.grid],function(module){
                                me.doms.grid = $(me.tpl.diggGridTpl).attr("id","the"+me.type.grid+"List"+me.cid);
                                me.grid.$el.parent().append(me.doms.grid);
                                var config ={
                                    "id":me.doms.grid,
                                    "currentCondition":me.condition
                                };
                                me.diggGrid = module.init && module.init(config) || new module(config);
                                $(this).unbind().remove();
                                me.doms.info = $(me.tpl.diggInfoTpl).append(currentInfo);
                                me.$el.append(me.doms.info);
                            }.bind(this));
                        }
                        tableRowsData = null;
                        checkBoxs = null;
                    });
                },
                //异常检测
                _checkError:function(){
                    var status = true;
                    if(!this.type){
                        this.dropdownlist.selectedShower.addClass("notDigg");
                        setTimeout(function(){
                            this.dropdownlist.selectedShower.removeClass("notDigg");
                        }.bind(this),300);
                        status = false;
                    }else if(!this.type.grid){
                        this.dropdownlist.selectedShower.find("span:first").html(LANG("暂不支持该类型"));
                        status = false;
                    }else if(!this.tableRows.$el.find(":checked[data-dtype='digg']").length){
                        this.tableRows.$el.find("input[data-dtype='digg']").attr("checked","checked");
                        setTimeout(function(){
                            this.tableRows.$el.find("input[data-dtype='digg']").attr("checked",false);
                        }.bind(this),100);
                        status = false;
                    }
                    return status;
                }
            },
            syncParams:function(data){
                $.extend(true,this.params, data.params);
            },
            changeDate:function(data){
                this.diggGrid && this.diggGrid.changeDate(data);
            },
            update:function(data){
                $.extend(true,this.params, data.params);
            },
            //当前表格重新填充数据时，根据状态增删多选框
            doFillData:function(data){
                if(!this.buildReady){
                    this.$el.find(".diggCtrl").addClass("act").html(LANG("关闭钻取"));
                    this.fn._showDigg.call(this);
                    this.buildReady = true;
                    setTimeout(function(){
                        if(Clicki.Balance){
                            Clicki.Balance(null, 350);
                        }
                    }.bind(this),300);
                }
                if(!this.$el.find(".diggCtrl").hasClass("act")){
                    this.grid && this.grid.gridLayout.manager.run("diggGrid",{
                        "event":"doCheckBox",
                        "data":{
                            "area":"td1",
                            "dataType":"digg",
                            "build":false
                        }
                    });
                }else{
                    this.grid && this.grid.gridLayout.manager.run("diggGrid",{
                        "event":"doCheckBox",
                        "data":{
                            "area":"td1",
                            "dataType":"digg",
                            "build":true
                        }
                    });
                }
            },
            destroy:function(){
                this.diggGrid && this.diggGrid.destroy();
                this.$el.find("*").unbind();
                this.$el.unbind().empty();
            }
        }

        var viewsConfig = $.extend(true,{

        },config||{},privateConfig);

        var maiView = Backbone.View.extend(viewsConfig);

        return new maiView;
    }

    diggGrid.prototype.constructor = diggGrid;

    return {
        init:function(config){
            return new diggGrid(config);
        }
    };
});