define(function(require,exports,module){

    var Backbone = require("backbone");
    var $ = window.$ || require("jquery");
    var model = require("/resources/app/models/tableList");
    /*
    当前collection的默认设定
    包含当前collection的属性，事件等
    */
    var collectionConfig = {
        initialize:function(){
            this.datasources.context = this;
        },
        /*原始数据扁平化处理*/
        setColData:function(){

            var tmp,tObjArr=[],valueArr=[],colNum = [],_i,_minChart = this.minChart;

            tmp = [];

            function _setTmpArr(n,v){
                var obj = {};
                obj[n] = v;
                valueArr.push(v);
                tmp.push(obj);
            }

            function __(data,nn,i,re){
                if(data[nn.data] !== undefined){
                    if(re){return data[nn.data]}
                    _data = data[nn.data]
                }else if( data["x_axis"][nn.data] !== undefined){
                    if(re){return data["x_axis"][nn.data]}
                    _data = data["x_axis"][nn.data];
                }else if( data["y_axis"][nn.data] !== undefined){
                    if(re){return data["y_axis"][nn.data]}
                    _data = data["y_axis"][nn.data]
                }else if (this.hasSub && (nn.tpl || nn.render) || nn.data ===null){
                    if(this.hasSub && (nn.tpl || nn.render) && (nn.data === null || !_minChart)){
                        if(this.hasSub.xtype){
                            _data = "<img src=\"/resources/images/blank.gif\" data-stype=\""+this.hasSub.xtype+"\" class=\"subCtrlIcon close\" data-sub=\"close\" />";
                        }else{
                            _data = "";
                            /*如果有一个以上的子层按钮，需要自定义按钮样式*/
                            for(var n in this.hasSub){
                                var title = this.hasSub[n].title?this.hasSub[n].title:"";
                                _data += "<img src=\"/resources/images/blank.gif\" data-stype=\""+n+"\" class=\"sub" +n+ "IconClose close\" data-sub=\"close\" alt=\"" + title + "\" title=\"" + title + "\"/>";
                            }
                        }
                    }else if(_minChart){
                        //_data = "";
                        _data = _.template(_minChart.tpl, {"key":__(data,{data:_minChart["key"]},i,true)});
                    }else{
                        _data = "";
                    }
                    
                }else if(nn.combination){
                    if(data[nn.combination.field]){
                        var _d = data[nn.combination.field];
                        _data =_data || "";
                        for(var n in _d){
                            _data += _d[n];
                            nn.combination.symbol && (_data+=nn.combination.symbol);
                        }
                        nn.combination.symbol && (_data = _data.substr(0,_data.length-1));
                        _d = null;
                    }
                }
            }

            var _data;
            this.colsNames = [];
            $.each(this.models,function(i,n){
                tmp = [];
                valueArr = [];
                
                $.each(this.colModel,function(ii,nn){
                    
                    __.apply(this,[this.models[i].attributes,nn,i]);
                    

                    (nn.data || (this.hasSub || nn.data ===null && (nn.tpl || nn.render))) && valueArr.push(
                        _data
                    );

                    tmp.push(({}[nn.data] = _data));



                }.bind(this));

                n.attributes.colData = tmp;
                colNum.push(tmp.length);
                tObjArr.push(valueArr);
                tmp = null;
                
            }.bind(this));

            for(var i = 0,len = this.colModel.length;i<len;i++){
                this.colsNames.push(this.colModel[i].data);
            }

            this.colDatas = tObjArr;

            this.colNum  = this.colModel.length+1;

            tObjArr= colNum = null;
        },
        /*根据colModel生成标题*/
        getGridTitle:function(){
            var gT = {};
            for(var n in this.colModel){
                gT[n] = this.colModel[n].title || "";
            }
            return gT;
        },
        /*设定参数*/
        setParams:function(params){
            if(params && $.isPlainObject(params)){
                this.params = $.extend(this.params,params);
                return this.params;
            }
            return false;
        },
        getParams:function(){
            return this.params;
        },
        /*获取指定索引的数据*/
        getModelDataAt:function(i){
            if(this.models[i] && this.models[i].attributes){
                return this.models[i].attributes;
            }
            return false;
        },
        /*获取所有的数据*/
        getAllModelData:function(){
            var data = [];
            for(var i = 0,len = this.length;i<len;i++){
                data.push(this.getModelDataAt(i));
            }
            return data;
        },
        /*获取实际列数*/
        getColNum:function(){
            return this.colNum;
        },
        /*获取处理后的数据*/
        getAllColDatas:function(){
            return this.colDatas;
        },
        /*获取结构字段名*/
        getColName:function(i){
            return i !==undefined?this.colsNames[i]:this.colsNames;
        },
        /*获取指定字段合计*/
        getValueTotal:function(name){
            var name = this.minChart.key || name || "pageviews";
            return parseFloat(this.amount["y_axis"][name]);
        },
        /*获取合计*/
        getAmount:function(){
            return this.amount && this.amount["y_axis"] || 0;
        },
        ui:null
    }
    
    return function(config){
        return Backbone.Collection.extend($.extend(true,{},collectionConfig,config));
    }

    

});