define(function(require,exports,module){

    var $ = window.$ || window.jQuery || require("jquery");
    var Backbone = require("backbone");
    var collection = require("/resources/app/collections/tableList");
    var model = require("/resources/app/models/tableList");
    var base = require("base");
    var pop_up = require("pop_up");

    function TableList(config){


        /*私有设置，这里应该是关键的属性，方法的配置*/
        var privateConfig = {
            noDataTip:$.noop,
            tagName:"div",
            refresh:function(config){
                !this.model && config.model && (this.model = config.model);
                this[config.event] && this[config.event](config.data);
            },
            /*初始化处理函数*/
            initialize:function(){
                /*初始化状态*/
                this.mark = false;
                if(this.showMark){
                    this.mark = $("<div class=\"theGridMarkLayout\"><div></div></div>");
                    this.$el.css({
                        "z-index":0
                    }).append(this.mark);
                }
                if(this.mark){
                    this.mark.fadeIn(200);
                    this.$el.height()||this.$el.css({
                        "height":"30px",
                        "overflow":"initial"
                    });
                }
                this.rendered = false;
                this.collection.bind('reset', this.render, this);
                this.collection.fetch(this.collection.datasources);
            },
            /*更新模块*/
            update:function(data){
                this.collection.datasources.data = $.extend(this.collection.datasources.data,data);
                this.collection.reset(undefined,{silent: true});
                this.collection.fetch(this.collection.datasources);
            },
            render:function(){
                if(!this.rendered){
                    this.collection.setColData();
                    this.fn._buildGrid.call(this);
                    this.fn.gridSetting.call(this);
                    this.rendered = true;
                    this.table = this.$el.find("table:first");
                }else{
                    this.collection.setColData();
                    this.fn._updata.call(this);
                    this.fn.gridSetting.call(this);
                }
                this.done.call(this);
                /*遮罩层操作与其他*/
                setTimeout(function(){
                    this.mark.hide();
                    $(this.el).css({height:"100%"});
                    this.ready = true;
                    if(Clicki.Balance){
                        Clicki.Balance();
                    }
                }.bind(this),200);
            },
            "fn":{
                /*构造*/
                _buildGrid:function(){
                    /*表格结构数组*/
                    var _table = ["<div class=\"theGridTableBox\"><table class=\"gridViewTableContent\">"],
                        /*数据缓存变量*/ 
                        data,                       
                        self = this,
                        /*头部结构数组*/
                        headArea = [],
                        girdText = this.collection.gridTxtData,
                        minChart = this.collection.minChart;

                    if(this.colNum !== this.collection.getColNum()){
                        this.colNum = this.collection.getColNum();
                    }
                    /*有标题时*/
                    if(this.title){
                        headArea.push("<div class=\"theGridTitleBox\">"+this.title+"</div>");
                    }

                    /*表头*/
                    if(this.showCaption){
                        data = this.collection.gridTxtData;
                        var _i = 0,head= [],headY = [];
                        if(!data){
                            return false;
                        }
                        _table.push("<tbody class=\"gridHeadContent\">");
                        var les = 100,aNum = 0;
                        $.each(this.collection.colModel,function(i,n){
                            (n.data === true || n.data !==null) && head.push(
                                 n.data === true && n.text || (data[n.data] || data["x_axis"][n.data] || data["y_axis"][n.data])
                            ) ||(n.data ===null && (n.tpl || n.render)) & head.push(
                                n.text||""
                            )

                        }.bind(this));

                        data = head;
                        head = null;

                        if(minChart){
                            data.push(minChart.title?minChart.title:"");
                        }

                        /*加入序号th*/
                        _table.push('<th class="serial" ><div><div>'+LANG("序号")+'</div></div></th>');

                        $.each(this.collection.colModel,function(i,n){
                            var colWidthArr = self.colWidth;
                            var cW = (n.hidden && n.width &&"style=\"width:"+(n.width||"auto")+";display:none\"")
                                    || (n.hidden && "style=\"width:auto;display:none;\"" )
                                    || (n.width && "style=\"width:"+(n.width || "auto")+"\"")
                                    || "style=\"width:"+self.defCellWidth+"\"";

                            _table.push("<th "+cW+" "+(i === 0 && "class=\"theTextLeft\"" || n.data === null && "class=\"theTextCenter\"" || n.cls && "class=\""+n.cls+"\"" )+"><div><div>"+data[i]+"</div></div></th>");
                        });

                        _table.push("</tbody>");
                    }

                    /*表身*/
                    _table.push("<tbody class=\"gridContentBody\">");
                    data = this.collection.getAllModelData();
                    var colDatas = this.collection.getAllColDatas(),minChartStr;
                    var iconUrl = self.icon && self.icon.url || "/resources/images/icons/";
                    if(data.length === 0){
                        _table.push("<tr ><td class=\"theGridNoData\" colspan=\""+self.colNum+"\"><div>"+LANG("没有数据...")+"</div></td></tr>");
                        this.noDataTip && this.noDataTip();
                    }else{
                        $.each(data,function(i){
                            _table.push("<tr "+(self.cellCompare ? "row="+i:"")+">");
                            var IC = false,pos = false,cols = colDatas[i] ,str,imgSrc;
                            minChartStr = "";
                            if(self.icon){
                                pos= self.icon.col -1;
                                imgSrc = iconUrl+self.icon.type+"/"+(data[i]["x_axis"][self.icon.name]?data[i]["x_axis"][self.icon.name]:"unknown")+".png";
                                IC = "<img src=\""+imgSrc+"\" alt=\"\" align=\"absmiddle\" title=\""+(data[i]["x_axis"][self.icon.title]?data[i]["x_axis"][self.icon.title]:"")+"\" class=\""+(self.icon.pos?"icon_behind":"icon_front")+"\" />";
                            }
                            /*加入每行的序号*/
                            _table.push("<td  class=\"theTextCenter\"><div style=\"text-align: center;\">" + (i+1) + "</div></td>");
                            $.each(colDatas[i],function(ix,iv){
                                _table.push(
                                    self.fn._getCellHtml.call(self,ix,iv,IC,pos,i)
                                );
                                if(minChart && ix === minChart.v){
                                    minChartStr = colDatas[i][ix];
                                }
                            });

                            if(self.hasSub){this.table
                                if(self.hasSub.xtype){
                                    _table.push("<tr style=\"display:none;\"><td colspan=\""+self.colNum+"\"><div id=\""+self.cid+"_"+i+"\"></div></td></tr>");
                                    inner= null;
                                }else{
                                    var inner = "<tr style=\"display:none;\"><td colspan=\""+self.colNum+"\">";
                                    for(var nn in self.hasSub){
                                        inner+="<div id=\""+self.cid+"_"+i+"_"+nn+"\"></div>";
                                    }
                                    inner +="</td></tr>";
                                    _table.push(inner);
                                    inner= null;
                                }
                                
                            }

                        });
                    }

                    _table.push("</tbody></table></div>");

                    _table = headArea.concat(_table);
                    _table = _table.join("");
                    this.$el.append('<div class="theGridMainContentBox">'+_table+'</div>');
                    _table = null;
                    headArea = null;
                },
                _updata:function(re,resetPage){
                    var tbody  =this.table.find("tbody.gridContentBody:first");
                    var totalBox = $(this.el).find(".theGridTotalBox:first");
                    var totalArr = [];
                    var chipBox = document.createDocumentFragment();
                    var data = this.collection.getAllModelData();
                    var colDatas = this.collection.getAllColDatas();
                    var hasSub = this.hasSub,colNum = this.colNum,cid = this.cid;
                    var num = 0,IC = false,pos = this.icon?this.icon.col -1:false;
                    var self = this,minChart = this.collection.minChart;
                    var headBox,headChipBox;

                    if(re){
                        this._getTotalHtml(totalArr,this.collection.gridTxtData);
                        totalBox.replaceWith(totalArr.join(""));
                        totalArr = null; 
                    }

                    /*生成函数*/
                    function inRow(data,i){
                        //var row = document.createElement("tr");
                        var tds = "",hasIcon = data.icon?true:false,minChartStr = "";
                        /*根据页码更新序号*/
                        tds +=("<td class=\"theTextCenter\"><div style=\"text-align: center;\">"+(i+1)+"<div></td>");
                        $.each(colDatas[i],function(ix,iv){

                            tds+= self.fn._getCellHtml.apply(self,[ix,iv,IC,pos,i]);

                            if(minChart && ix === minChart.v){
                                minChartStr = colDatas[i][ix];
                            }

                            num++;
                        });
                        var row = $("<tr "+(self.cellCompare ? "row="+i:"")+">"+tds+"</tr>");
                        chipBox.appendChild(row[0]);
                        /*有sub grid的时候*/
                        if(hasSub){
                            if(hasSub.xtype){
                                var inner = "<tr style=\"display:none;\"><td colspan=\""+colNum+"\"><div id=\""+self.hasSub.cid+"_"+i+"\"></div></td></tr>";
                            }else{
                                var inner = "<tr style=\"display:none;\"><td colspan=\""+colNum+"\">";
                                for(var nn in self.hasSub){
                                    inner+="<div id=\""+self.cid+"_"+i+"_"+nn+"\"></div>";
                                }
                                inner +="</td></tr>";
                            }
                            row = $(inner);
                            chipBox.appendChild(row[0]);
                            inner= null;
                        }
                        num = 0;
                    }

                    /*跳板......*/
                    function jump(ret){
                        if(typeof ret == "function"){
                            return ret();
                        }
                        return false;
                    }

                    if(data.length === 0){
                        var _row = document.createElement("tr");
                        _row.innerHTML = "<td class=\"theGridNoData\" colspan=\""+colNum+"\"><div>"+LANG("没有数据...")+"</div></td>";
                        chipBox.appendChild(_row);
                    }else{
                        $.each(data,function(i){
                            var that =this;
                            if(self.icon){
                                var iconUrl = self.icon.url || "/resources/images/icons/";
                                pos= self.icon.col -1;
                                imgSrc = iconUrl+self.icon.type+"/"+(data[i]["x_axis"][self.icon.name]?data[i]["x_axis"][self.icon.name]:"unknown")+".png";
                                IC = "<img src=\""+imgSrc+"\" alt=\"\" align=\"absmiddle\" title=\""+(data[i]["x_axis"][self.icon.title]?data[i]["x_axis"][self.icon.title]:"")+"\" class=\""+(self.icon.pos?"icon_behind":"icon_front")+"\" />";

                            }
                            
                            jump(function(){
                                return inRow(that,i);
                            });
                        });
                    }

                    tbody.find("*").unbind();
                    tbody.find("tr").remove();
                    tbody[0].appendChild(chipBox);
                },
                /*相关附加设置*/
                gridSetting:function(reset){
                    /*xModel*/
                    this.fn._setColModel.call(this);

                    /*文字溢出设定*/
                    this.fn._setEllipsis.call(this);
                },
                /*事件绑定*/
                _setColModel:function(){
                    var bds = this.$el.find("tbody.gridContentBody:first"),
                        self = this,
                        allTd = bds.find("td"),
                        allCtrlBox = bds.find("td span[class]"),
                        xModuleDiv = allCtrlBox.parent(),
                        trs = bds.find("tr").filter(function(i){
                            return $("td",this).length > 1;
                        }),
                        tds;

                    $.each(trs,function(i,n){
                        var _tr = $(n);
                        tds = _tr.find("td:gt(0)");
                        var me = this;
                        $.each(tds,function(j,k){
                            if(self.collection.colModel[j].xModule){
                                var fnType = self.collection.colModel[j].xModule.fnType || "click",
                                    _xModule = self.collection.colModel[j].xModule,
                                    ctrlBox = $(k).find("span[class]"),
                                    theTd = $(k),
                                    fn = self.collection.colModel[j].xModule.fn && self.collection.colModel[j].xModule.fn.bind(self) 
                                            || function(event){
                                            var xtype = $(event.target).attr("data-xtype"),realType;

                                            if(_.isFunction(_xModule[xtype])){
                                                var mAttributes = {};
                                                mAttributes.data = this.collection.getModelDataAt(i);
                                                mAttributes.event = event;
                                                _xModule[xtype].call(me, mAttributes, i);
                                            }else{
                                                _xModule[xtype].event = event;
                                                _xModule[xtype].data = this.collection.getModelDataAt(i);
                                                realType = _xModule[xtype].type || xtype;
                                                if(!this.xModule[realType]||!this.readyModule[xtype]){
                                                    require.async([realType],function(xModule){
                                                        this.xModule[realType] = xModule;
                                                        this.readyModule[xtype] = xModule.init(_xModule[xtype]);
                                                    }.bind(this));
                                                }else{
                                                    if(this.readyModule[xtype] && this.readyModule[xtype].update){
                                                        this.readyModule[xtype].update(_xModule[xtype]);
                                                    }else{
                                                        this.xModule[realType].init(_xModule[xtype]);
                                                    }
                                                }
                                            }
                                            event.stopPropagation();
                                            return false;
                                        }.bind(self);
                                theTd.find("*[data-xtype]").unbind().bind(fnType,fn);
                            }
                            
                        });
                        
                    });
                },
                _setEllipsis:function(re){

                    if(re || !this.realColWidth){
                        /*首次生成后即不再获取单元格宽度。如果需要做自适应则每次在window.resize后都要重新去获取宽度并重新赋值。*/
                        var _thDivs = this.$el.find("tbody.gridHeadContent:first div:gt(0)").filter(function(){return $("div", this).length == 1;});
                        this.colLen = this.collection.colModel.length;
                        this.colLen = this.colLen;
                        /*单元格实际宽度*/
                        this.realColWidth = {};
                        /*获取单元格实际宽度*/

                        $.each(this.collection.colModel,function(i,n){
                            if(n.width){
                                this.realColWidth[i] = n.width; //_thDivs.eq(i).outerWidth();
                            }else{
                                
                            }
                        }.bind(this));

                        $.each(_thDivs,function(i,n){
                            $(n).css("position","relative");
                        }.bind(this));
                    }
                    
                    var _tdDivs = this.fn._getTheDivs.call(this);

                    this.tdDivs = _tdDivs;
                    this.thDivs = this.thDivs || _thDivs;
                    
                    return;
                    /*赋值*/
                    $.each(_tdDivs,function(i,n){
                        var _i = i % this.colLen;
                        $(n).width(this.realColWidth[_i] || this.defCellWidth);
                    }.bind(this));
                },
                _getTheDivs:function(){
                    var _tdDivs;
                    if(this.hasSub){
                        _tdDivs = this.$el.find("tbody.gridContentBody:first > tr td:not(:first-child)>div:not(:empty)");
                    }else{
                        _tdDivs = this.$el.find("tbody.gridContentBody:first tr").find("div:not(:first,:empty)");
                    }

                    return _tdDivs;
                },
                _getCellHtml:function(i,val,ico,pos,row){
                    /*列，值，图标，图标位置，行*/
                    /*当前列model*/
                    var nowColModel = this.collection.colModel[i];
                    val = (val === null?0:val);
                    //val = ""+val;
                    if(nowColModel.data === "bounce_rate"){
                        val = Math.round(parseFloat(val)*10000)/100 +"%";
                    }

                    if(nowColModel.data === "avg_loadtime"){
                        (typeof val === "number") && (val = val.formatDuring());
                    }

                    if(nowColModel.data === "avg_staytime"){
                        (typeof val === "number") && (val = new Date(parseInt(val)*1000).timemark());
                    }

                    /*千分位截断*/
                    (typeof val === "number") && (val = val.separated());

                    /*if(!isNaN(parseFloat(val)) && val.indexOf(".") !== -1 && val.split(".")[1].length >2){
                        val = Math.round(parseFloat(val)*100) +"%";
                    }*/
                    /*链接地址*/
                    var href = false;
                    /*val带链接标签则title为空*/
                    var titleStr = /<(.*) [^>]*>/.test(val)?"":val;
                    
                    //var html = "<td nocompare=\""+(nowColModel.compare === false?1:0)+"\" "+(nowColModel.hidden?"style=\"display:none\"":"")+"><div title=\""+titleStr+"\">"+(this.hasSub && i===0?"<img src=\"/resources/images/blank.gif\" class=\"subCtrlIcon close\" data-sub=\"close\" />":"");
                    var html = "<td "+(nowColModel.data === null?"data-ctype = \"ctrl\"":"")+ "nocompare=\""+(nowColModel.compare === false?1:0)+"\" "+(nowColModel.hidden?"style=\"display:none\"":"")+">";
                    
                    if(/[http]||[www.]||[:?(.)]/.test(val)){
                        href = val;
                    }
                    /*字符串截取*/
                    if(val.length > this.ellipsis && nowColModel.data !== null){
                        
                        val = val.substr(0,this.ellipsis)+"...";
                    }
                    /*是否带图标*/
                    var _str = (ico && i === pos && (pos?val+ico:ico+val)) || val;

                    /*内容生成 render > tpl > _str */
                    /*TODO MinChart生成时会带多一个div，进而影响到溢出处理*/
                    if(nowColModel.data === null){
                        html += (nowColModel.render && "<div class=\""+(nowColModel.cls?nowColModel.cls:"")+"\">"+nowColModel.render.apply(this,[_str,i,row,href])+"</div>")
                                ||"<div class=\""+(nowColModel.cls?nowColModel.cls:"")+"\" title=\""+titleStr+"\">"+_.template(nowColModel.tpl, {"key":_str})+"</div>";
                    }else{
                        html += (nowColModel.render && "<div style=\""+((i === 0)&&"text-align:left;")+"\" class=\""+(nowColModel.cls?nowColModel.cls:"")+"\">"+nowColModel.render.apply(this,[_str,i,row,href])+"</div>")
                                || (nowColModel.tpl && "<div style=\""+((i === 0)&&"text-align:left;")+"\" class=\""+(nowColModel.cls?nowColModel.cls:"")+"\" title=\""+titleStr+"\">"+_.template(nowColModel.tpl, {"key":_str})+"</div>")
                                || "<div style=\""+((i === 0)&&"text-align:left;")+"\" class=\""+(nowColModel.cls?nowColModel.cls:"")+"\" title=\""+titleStr+"\"  data-row=\""+ row +"\">"+_str+"</div>";
                    }
                    html += "</td>";

                    return html;
                },
            },
            "methods":{
            },
            changeStatus:function(enabled){
            },
            destroy:function(){
                this.$el.find("*").unbind();
                this.$el.empty();
                this.mark.remove();
            }
        }

        var viewConfig = $.extend(true,{
            done:$.noop,
            colModel:null,
            ellipsis:30,
            showMark:true,
            ExportExcel:true,
            cellCompare:false,
            cellSort:true,
            title:false,
            target:null,
            callback:false,
            xModule:{},
            colNum:false,
            showCaption:true

        },config||{},privateConfig);

        this.config = config;
        this.tableListModelConstructor =  model();
        this.tableListCollectionConstructor =  collection();
        this.tableListViewConstructor = Backbone.View.extend(viewConfig);

        this.tableListmodel = new (this.tableListModelConstructor.extend(this.config.model));
        this.config.collection.model = this.tableListModelConstructor;

        this.tableListcollection = new (this.tableListCollectionConstructor.extend(this.config.collection));
        this.config.view.collection = this.tableListcollection;

        return new (this.tableListViewConstructor.extend($.extend(true, this.config.view, privateConfig ||{})));
    }

    TableList.prototype.constructor = TableList;

    return function(config){
        return new TableList(config);
    }

});