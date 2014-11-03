define(function(require,exports,module){

    /*chart 核心模块*/
    var hChart = require("chart_core");
    /*chart 默认设置*/
    var defaultSetting = require("chart_default");
    /*各种格式化方法*/
    var _F = require("format");

    var _export = require("export");

    var setp = 3;
    
    /*四舍五入*/
    function n3n4(num,n) {

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
    }


    /*主函数*/
    function chart(config){
        this.config = _F.interfaceSettingFormat(config,config.model);
        var _tSet = {
            chart:{renderTo:this.config.target}
        }

        if(this.config.setting.height){
            _tSet.chart.height = this.config.setting.height;
        }

        if(this.config.setting.width){
            _tSet.chart.width = this.config.setting.width;
        }

        if(this.config.setting.options){
            _tSet = $.extend(true,_tSet,this.config.setting.options);
        }
        this.setting  =$.extend(true,{},defaultSetting[this.config.setting.type],{},_tSet);

        _tSet = null;

        this.config["export"] = config["export"] && {
                                "ready":false,
                                "subjet":null 
                            } || false;

        //this.setting.chart.renderTo = this.config.target;
        
        this.config.setp = this.config.setp?this.config.setp:setp;
        this.target = $("#"+this.config.target);
        this.rootDom = this.config.rootDom ? 
                        (this.config.rootDom.indexOf("#") === 0 && $(this.config.rootDom) || $("#"+this.config.rootDom)):
                        this.target.parent();
        this.chart = false;
        this.timePoint = null;
        this.callback = this.config.callback || false;
        this.afterRender = this.config.afterRender || false;

        this.fields = config.fields||false;

        this.init();

        (this.callback && typeof this.callback ==="function") && this.callback.call(this);
    }

    chart.prototype = {
        /*初始化*/
        init:function(){
            if(this.config.params && this.config.url){
                this.getData();
            }else if(this.config.data){
                var re = {
                    success:true,
                    result:this.config.data
                }
                this._doneFn(re);
            }
        },
        /*获取数据*/
        getData:function(redraw,title){
            this.redraw = redraw?true:false;
            this.target.addClass("chartsIsLoading");
            $.get(this.config.url,this.config.params,this._doneFn.bind(this),"json");
        },
        _doneFn:function(re){
            if(re.success !== true){
                //self.contentBox.addClass("failToLoadData").html("<div>Opsss~~服务器开小差了。请尝试刷新页面。</div>");
                window.console && console.error("Server Error~");
                setTimeout(function(){
                    if(window.Clicki !==undefined && Clicki.Balance){Clicki.Balance();}
                },500);
                return false;
            }
            if(re.result.items.length === 0){
                //self.contentBox.addClass("failToLoadData").html("<div>Opsss~~发生了一个未知错误。请尝试刷新页面。</div>");
                this.rootDom && this.rootDom.hide();
                setTimeout(function(){
                    if(window.Clicki !==undefined && Clicki.Balance){Clicki.Balance();}
                },500);
                return false;
            }
            
            this.data = re.result;

            $.each(re.result.caption, function(key, value){
                ////////////////////翻译-----制图底部横坐标文字的name/////////////////////////////
                this.data.caption[key] = LANG(value.title);
            }.bind(this));

            if(this.config.formatTo){
                this.setDataFormatTo(this.data,!re);
                return;
            }else{
                this.formatData();
            }
            if(this.modeSelector){

            }
            if(this.redraw){
                this.reDraw(false);
            }else{
                $(function(){
                    this.drawChart();
                    if(this.config["export"]){
                        this.showExport();
                    }
                }.bind(this));
            }
        },
        setFormatto:function(formatto,draw,title){
            if($.isPlainObject(formatto)){
                this.config.formatTo = formatto;
                this.setDataFormatTo(this.data,true);
                draw && this.reDraw(false,title);
            }
        },
        setDataFormatTo:function(data,draw){
            
            var _data = $.extend({},data||this.data),_newData=[];

            $.each(_data.items,function(i,n){
                
                var _d = {keys:n["keys"],x_axis:n["x_axis"],y_axis:{}};
                var _name = this.config.formatTo.metrics;

                $.each(this.config.formatTo.to,function(ii,nn){
                    /////////////////////翻译-----制图的横坐标的名字/////////////////////////////
                    _d.y_axis[nn] = LANG(n["y_axis"][ii][_name]);
                });

                _newData.push(_d);

            }.bind(this));

            if(draw || !this.chart){
                this.fields = ""+this.config.formatTo.to;
                this.formatData({items:_newData,caption:this.config.formatTo.caption},true);
                this.drawChart();
                this.addChartDataRemarks()
            }else{
                this.formatData({items:_newData,caption:this.config.formatTo.caption},true);
                this.reDraw(draw);
                this.addChartDataRemarks()
            }
        },
        showExport:function(){
            this.config["export"].dom = $('<div class="Ex_export"></div>');
            this.config["export"].dom.addClass("fixChartDownloader");
            this.config["export"].subjet = _export.init({
                "params":$.extend({
                        "url":this.config.url
                    },this.config.params),
                "el":this.config["export"].dom,
                "subjet":this
            });
            this.target.append(this.config["export"].dom);
        },
        /*原始数据格式*/
        formatData:function(data,draw){
            var isPie = this.config.setting.type === "pie"?true:false;
            var amount = this.data.amount?parseInt(this.data.amount.y_axis[ this.config.setting.yAxis || this.config.params.metrics]):false;
            var curTime = this.data.cur_time;
            var xAxisCategories = [],series = [];
            var xAxis = this.config.setting.xAxis || false;
            var items = data?data.items:this.data.items,_caption = data?data.caption:this.data.caption,tmpData = {};
            var special = this.config.special||false;
            var self = this;

            function change(str){
                var dd = new Date(str);
                var tmp = ""+str;
                if(($.browser.msie && tmp.split("-").length>2) || (!isNaN(dd.getFullYear()) && tmp.split("-").length>2)){
                    tmp = tmp.substr(tmp.indexOf("-")+1);
                }
                return tmp;
            }
            var _i = 0;
            function toGetXAxis(vv){
                var str;
                if(this.config.xfields){
                    
                }
                return change(vv);
            }
            
            $.each(items,function(n,v){

                /*如果指定了显示字段*/
                if(self.config.xfields){
                    var tmpStr = "";
                    for(var i = 0;i<self.config.xfields.key.length;i++){
                        tmpStr += v["x_axis"][self.config.xfields.key[i]];
                        self.config.xfields.symbol && (tmpStr+=self.config.xfields.symbol);
                    }
                    self.config.xfields.symbol && (tmpStr = tmpStr.substr(0,tmpStr.length-1));
                    //alert(self.config.xfields.symbol);
                    //alert(tmpStr);
                    xAxisCategories.push(tmpStr);
                    
                }else{
                	//console.dir(v["x_axis"])
                    $.each(v["x_axis"],function(nn,vv){
                        if(xAxis && nn === xAxis){
                            xAxisCategories.push(change(vv));
                        }else if(!xAxis){
                            xAxisCategories.push(change(vv));
                        }
                         
                    });
                }

                $.each(v["y_axis"],function(nn,vv){
                    if(self.fields && self.fields.indexOf(nn) !== -1){
                        tmpData[nn] = tmpData[nn] || {};
                        tmpData[nn].name = tmpData[nn].name || _caption[nn];
                        tmpData[nn].data = tmpData[nn].data||[];
                        if(special[nn] && !tmpData[nn].spAdd){
                            tmpData[nn].spAdd = true;
                            tmpData[nn] = $.extend(special[nn],tmpData[nn]);
                        }

                        var _v = parseFloat(vv);
                        if(isPie && amount){
                            _v = [];
                            _v.push(xAxisCategories[_i]);
                            _v.push(n3n4((parseFloat(vv)/amount)*100));
                        }
                        _i+=1;
                        tmpData[nn].data.push(_v);
                    }
                    
                });

            });
            $.each(tmpData,function(n,v){
                series.push(v);
            });

            if(data && !draw){
                return {
                    series:series,
                    xAxis:{
                        categories:xAxisCategories
                    }
                }
            }
            if(this.setting.xAxis){
                this.setting.xAxis.categories = xAxisCategories;
            }
            //console.log(this.setting.xAxis.categories)
            //console.log(this.setting.xAxis.categories.length)
            ////////////////////修改制图x轴的数据格式,数据[0]如果大于当前时间的话就赋值为null//////////////////////
            if(series.length == 2){
            	//alert(series[0].data.length)
            	var cur_time_arr = curTime.split(/[: -]/);
            	var cur_time = parseInt(cur_time_arr[3],10)*60 + parseInt(cur_time_arr[4],10)
            	for(var ii=series[0].data.length-1;ii>=0;ii--){
	            	///////////////////////////把x轴的点表示的时间字符拆分为两个时间段//////////////////////////////
	            	var tempArr = this.setting.xAxis.categories[ii].split(/[\s~:]/);
	            	var timeA = parseInt(tempArr[0],10)*60+parseInt(tempArr[1],10);
	            	var timeB = null;
	            	if($.browser.msie){
	            		timeB = parseInt(tempArr[2],10)*60+parseInt(tempArr[3],10);
	            	}else{
	            		timeB = parseInt(tempArr[4],10)*60+parseInt(tempArr[5],10);
	            	}
	            	///////判断当前时间点不在本区间并且小于本区间，将本区间的值设为null//////
	            	if(cur_time >= timeA && cur_time <= timeB){
	            		this.timePoint = ii;
	            		/*var the = {
		                    y:111,
		                    marker: {
		                        symbol: 'url(/resources/styles/images/upAndDow_up.gif)'
		                    }
						};
	            		series[0].data[ii] = the;*/
	            	}else if(cur_time < timeA){
	            		series[0].data[ii] = null;
	            	}
	            }
            }
            ///////////////////////////////////////////////////////////////////
            
            this.setting.series = series;
        },
        update:function(config,title){
            this.reDraw(config,(typeof title === "string"?title:(this.config.setting.options.title?this.config.setting.options.title.text:"")));
        },
        refresh:function(config){
            this.update(config.data);
        },
        reDraw:function(config,title){
            if(typeof title === "string"){
                /*有新title*/
                this.newTitle = title;
                this.config.setting.options.title = title;
            }
            if(config){
                this.config.params = $.extend(true,this.config.params,config);
                this.getData(true,title);
            }else{
                this.target.show();
                this.rootDom && this.rootDom.show();
                if(!this.chart){
                    this.drawChart();
                }else{
                   this.target.removeClass("chartsIsLoading");
                   ////////////////////////重制图的程序///////////////////////////////
                   $.each(this.chart.series,function(i,n){
                        n.setData(this.setting.series[i].data,false);
                    }.bind(this));
                    if(this.newTitle){
                        this.chart.setTitle({text:this.newTitle});
                        this.newTitle = null;
                    }
                    this.setting.xAxis && this.chart.xAxis[0].setCategories(this.setting.xAxis.categories,false);
                    this.chart.redraw(); 
                }
            }
        },
        /*绘制chart*/
        drawChart:function(){
            this.target.removeClass("chartsIsLoading");
            this.target.show();
            this.rootDom && this.rootDom.show();
            this.config.beforeDraw && $.each(this.config.beforeDraw,function(n,v){
                hChart[n] && hChart[n](v);
            }.bind(this));
            this.chart = new hChart.Chart(this.setting);
            if(window.Clicki !==undefined && Clicki.Balance){
                setTimeout(function(){
                    Clicki.Balance();
                },500);
            }
            (this.afterRender && typeof this.afterRender ==="function")&&this.afterRender();
            this.target.css("background","none");
            if(this.data.items.length === 0){
                this.target.hide();
                this.rootDom && this.rootDom.hide();
            }
        },
        /*/////////////////////制图---制作数据点附近添加备注信息/////////////////////////*/
		/*///////////////////////////////////////////////////////////////////////////////////////////////////////////*/
        addChartDataRemarks:function(){
			//获取第一条线上所有的数据点对象;[0]是今天的，[1]是昨天的
			var todayData = this.setting.series[0].data
	        var yesTodayData = this.setting.series[1].data
	        var seriesDataList = this.chart.series[0].data;
	        //console.log(seriesDataList);
	        /////////////////如果当前时间点部位null执行/////////////////////
	        if(this.timePoint != null){
	        	//////////////////////////如果今天的数值小于昨天的数值执行///////////////////////////
	        	if(todayData[this.timePoint] < yesTodayData[this.timePoint]){
					//////////////////////////////////////
					var point = seriesDataList[this.timePoint];   
				    var text = this.chart.renderer.text(
				            //point.category, //获取数据点在X轴对应的刻度值
				            '↑',
				            point.plotX + this.chart.plotLeft + 2, 
				            point.plotY + this.chart.plotTop
				            
				        ).attr({
				            fill:'#ff005f',
				            zIndex: 5
				        }).css({
				        	fontSize:'14px',
				        	fontFamily:'SimHei'
				        }).add();        
				    var box = text.getBBox();
				    this.chart.renderer.rect(
				    	box.x,
				    	box.y,
				    	box.width,
				    	box.height,
				    	5
					).attr({
						//fill: '#FFFFEF',
						//stroke: 'gray',
						//'stroke-width': 1,
						zIndex: 4
					}).add();
					/////////////////////////////////////
				}
	        }
            /*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
            /*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
        }
        
    }

    return {
        name:"Chart View",
        init:function(config){
            var _Chart = new chart(config);
            (config.debug && window.console) && console.log(_Chart);
            return _Chart;
        }
    }
})
