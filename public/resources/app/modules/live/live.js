define(function(require,exports,module){

	var $ = require("jquery");
	var Backbone = require("backbone");
	

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

	/*缓存*/
	var _Live = {
		container:{
			liveChart:{
				second:{
					el:null
				},
				minute:{
					el:null
				}
			},
			map:{
				el:null,
				map:null,
				list:null
			},
			sources:{
				el:null,
				chart:null,
				list:null
			},
			content:{
				el:null,
				list:null
			},
			visiter:{
				el:null,
				list:null
			},
			today:{
				el:null,
				pv:null,
				uv:null,
				input:null,
				click:null
			},
			online:{
				el:null,
				now:null,
				re:null
			}
		},
		queue:{
			liveChart:{
				second:[],
				minute:[]
			},
			map:[],
			sources:[],
			content:[],
			visiter:[]
		}
	}

	/*返回格式化后的数据*/
	function _getReturnData(data,type,limt){
		var arr = [],items = data[type].items || false;
		if(("length" in items && items.length === 0)){return arr}
		for(var n in items){
			var newD = items[n];
			newD.key = n;
			arr.push(newD);
		}
		return !isNaN(limt) && arr.slice(0,limt) || arr;
	}
	
	/*清除http与https前缀*/
	function _cutHttpStr(str){
		return str.replace(/(http:\/\/|https:\/\/)/g,"");
	}

	/*默认设置*/
	var _def = {
		/*默认数据接口*/
		url:"/feed/realtime",
		/*各模块默认设置*/
		set:{
			online:{
				el:"liveOnlineBox",
				now:"liveOnline",
				re:"liveReview",
				format:function(){}
			},
			today:{
				el:"liveToday",
				pv:"liveTodayPv",
				uv:"liveTodayUv",
				input:"liveTodayInput",
				click:"liveTodayClick",
				format:function(data){
					_Live.container.today.el && this.setModelDataById("today",{"data":data["today"]});
				}
			},
			liveChart:{
				el:"theLiveChart",
				second:{
					el:"theSecond",
					delay:1000
				},
				minute:{
					el:"theMinute",
					delay:60000
				},
				format:function(data){
					_Live.container.liveChart.second && this.setModelDataById("second",{"data":data["online"]});
					_Live.container.liveChart.minute && this.setModelDataById("minute",{"data":data["online"]});
				}
			},
			map:{
				el:"theMapContent",
				map:"theMap",
				list:"theMapList",
				format:function(data){
					this.setModelDataById("map",{"data":(function(){
						var arr = [];
						var items = data.geo.items;
						for(var n in items){
							var newD = items[n];
							if(newD.location[0] === 0 && newD.location[1] === 0){
								continue;
							}
							newD.key = n;
							arr.push(
								newD
							);
						}
						return arr;
					})()});
				},
				/*等级颜色*/
				lv:[["#2cc0e9","#1f9bbf"],["#6f56ba","#5a479a"],["#dc357c","#bd2162"],["#f3862e","#d1752c"],["#e9d22c","#c8b424"]],
				/*等级对应关系*/
				lvMaping:{
					"10":0,
					"40":1,
					"70":2,
					"100":3,
					"130":4
				},
				/*圆的默认设置*/
				defCircle:{
	            	fillOpacity:0.4,
	            	/*圆的半径*/
	            	radius:200000,
	            	strokeOpacity:0.5,
	            	strokeWeight:1
				}
			},
			sources:{
				el:"theSources",
				chart:"theSourcesChart",
				list:"theSourcesList",
				format:function(data){
					this.setModelDataById("sourceslist",{"data":_getReturnData(data,"referer",4)});
				}
			},
			content:{
				el:"theContent",
				list:"theContentList",
				format:function(data){
					this.setModelDataById("content",{"data":_getReturnData(data,"page",6)});
				}
			},
			visiter:{
				el:"theVisiter",
				list:"theVisiterList",
				format:function(data){
					this.setModelDataById("visiter",{"data":_getReturnData(data,"visitor")});
				}
			}
		},
		/*数据获取时间间隔*/
		timedely:5000
	}

	/*访客详细信息模板,_visiterLi[0]主列表模板，_visiterLi[1]展开列表模板*/
	var _visiterLi = ['<li id="{key}"><div class="theVisiterLiTop"><div class="face"><img src="/resources/images/blank.gif" class="online" alt="" /></div><div class="flag"><img src="/resources/images/icons/os/{os_icon}.png" alt="" /><img src="/resources/images/icons/browser/{browser_icon}.png" alt="" /><img src="/resources/images/icons/geo/{geo_icon}.png" alt="" /></div><div class="location">{geo_name}</div><div class="ip">{ip}</div><div class="visit"><span>'+LANG("访问")+'<em>{reviews}</em></span><span>PV<em>{pageviews}</em></span></div><div class="time"><span>'+LANG("最后响应")+'<em>{endtime}</em></span><span>'+LANG("停留")+'<em>{staytime}</em></span></div></div><div class="theVisiterLiBottom"><div class="logTime online">{begintime}</div><div class="origin">{se_name}</div><div class="last">'+LANG("正在访问：")+'{exit_title}</div></div><div class="flowsCtrl hide" show="0"></div><div class="flows"><b class="flowsArrow"></b><div class="flowsInner">{flows}</div></div></li>','<li><div class="logTime leftTime {over}">{begintime}</div><div class="flowsInfo"><p>{page_title}</p><em><a href="{page_url}" target="_blank" title="{page_title}">{page_url}</a></em></div></li>'];

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

	/*构造函数*/
	function Live(config){

		config = config || {};
		/*config*/
		this.config = $.extend(_def,config);
		/*
		collection
		获取model用collection.get(model.id)
		*/
		this.collection = (function(){

			var c_c = Backbone.Collection.extend();

			/*生成model*/
			function _buildModel(config){
				config = config || {};
				var m_m = Backbone.Model.extend(config);
				return new m_m();
			}

			var c = new c_c([
				_buildModel({id:"today"}),
				_buildModel({id:"second"}),
				_buildModel({id:"minute"}),
				_buildModel({id:"map"}),
				_buildModel({id:"sourceschart"}),
				_buildModel({id:"sourceslist"}),
				_buildModel({id:"content"}),
				_buildModel({id:"visiter"})
			]);

			try{
				return c;
			}finally{
				c_c = c = null;
			}

		})();

		/*是否初始化完成*/
		this.ready = false;

		/*当前页面存在的模块*/
		this.actives = [];

		/*定时数据获取数据对象*/
		this.transporter = null;

		/*当前timeout*/
		this.timer = null;

		/*是否终止定时数据获取*/
		this.stop = false;

		/*回调函数*/
		this.callback = config.callback && Clicki.isFn(config.callback) && config.callback || false;

		/*缓存*/
		this.cache = {};

		this.init();
	}

	Live.prototype = {
		/*初始化*/
		init:function(){
			
			var me = this;
			this._getData(function(re){
				if(re.success){
					
					for(n in me.config.set){

						if(_Live.container[n] && !me.config.set[n].disable){
							for(var name in _Live.container[n]){
								var _en = "#"+(typeof(me.config.set[n][name]) === "string"?me.config.set[n][name]:me.config.set[n][name].el);
								_Live.container[n][name] = $(_en);
							}
							me.actives.push(n);
						}
					}
					delete re.success;
					me._setDatas(re);
					me.ready = true;
					me.callback && me.callback(_Live);
					me.timer = me._dataTransporter();
				}else{
					me._error(re);
				}
			});
			
		},
		/*返回数据处理*/
		_setDatas:function(data){
			
			for(var i=0,len = this.actives.length;i<len;i++){
				this.config.set[this.actives[i]].format.call(this,data);
				!this.ready && this[this.actives[i]] && this[this.actives[i]]();
			}

		},
		/*定时获取最新数据*/
		_dataTransporter:function(){
			var me = this;
			return setTimeout(function(){
				!me.transporter && (me.transporter = arguments.callee);
				if(me.stop){
					return;
				}
				me._getData();
			},this.config.timedely);
		},
		/*获取数据*/
		_getData:function(fn){
			fn = fn || function(re){
				if(re.success){
					delete re.success;
					this._setDatas(re);
				}else{
					this._error(re);
				}
				this.timer = setTimeout(this.transporter,this.config.timedely);
			}.bind(this);
			$.get(this.config.url,{site_id:site_id},fn,"json");
		},
		/*出错时*/
		_error:function(re,fn){
			window.console && console.log(re);
			typeof(fn) === "function" && fn();
		},
		_doMove:function(list,tag){
			
			function dM(list,tag){
				this.list = list;
				this.tag = tag;
				this.beforeEl = list.children("li").eq((parseInt(tag.attr("index"))+1));
			}
			dM.prototype.init = function(){
				var tag = this.tag;
				var list = this.list;

				if(this.beforeEl.length > 0){
					/*要移动到的位置*/
					var _top = beforeEl.offset().top + tag.outerHeight(true)+"px";
					/*在当前的位置浮动*/
					tag.css("top",tag.offset().top+"px").addClass("isMoving");
					/*添加到目标之前*/
					tag.insertBefore(beforeEl);
					/*动画*/
					tag.animate({
						top:_top
					},300,function(){
						tag.removeClass("isMoving");
					});
				}
			}
			return (function(list,tag){
				var _DM = new dM(list,tag);
				return function(){
					_DM.init.call(_DM);
				};
			})(list,tag)
		},
		/*今日*/
		today:function(){

			var doms = {
					"pageviews":_Live.container.today.pv,
					"visitors":_Live.container.today.uv,
					"input":_Live.container.today.input,
					"click":_Live.container.today.click
				},
				me = this;

			function setTodayInfo(){
				var data = me.getModelDataById("today");
				for(var n in data){
					doms[n].text(data[n]);
				}
				setTimeout(setTodayInfo,me.config.timedely);
			}

			setTodayInfo();
		},
		/*实时图表*/
		liveChart:function(){
			var mDlay = this.config.set.liveChart.minute.delay;
			var sDlay = this.config.set.liveChart.second.delay;
			var mDom = _Live.container.liveChart.minute;
			var sDom = _Live.container.liveChart.second;
			var mDivs,sDivs,me = this;

			var tmp = "";

			var beignLeft = sDom.parent().position().left+sDom.parent().width();
			sDom.css("left",beignLeft);

			/*分钟*/
			if(mDom.length === 1){

				$.each(tData,function(i,n){
					tmp+='<div data-dat="'+n+'" style="left:'+(25*i)+'px"><b></b><em>'+n+'</em></div>';
				});

				mDivs = mDom.append(tmp).find("div");

				$.each(mDivs,function(i,n){
					var _n = $(n),_i = i;
					setTimeout(function(){
						_n.animate({
							height:n3n4((parseInt(_n.attr("data-dat"))/150)*100)+"%"
						});
						_n = _i = null;
					},1000);
				});
			}

			/*秒*/
			if(sDom.length === 1){
				
				var _q = this.getModelById("second"),
					_nHeight = 3,
					_max = 28,
					limt = 901,
					set = 28,
					mVal = 50,
					uv = _Live.container.online.now,
					rv = _Live.container.online.re,
					now = 0;

				function _upNowInfo(){
					var _data= _q.get("data");
					uv.text(_data.sessions);
					rv.text(_data.reviews);
					setTimeout(_upNowInfo,me.config.timedely);
				}

				/*添加*/
				function _addRow(){

					if(now+1 == limt){
						window.location.reload();
						return;
					}
					var _dat = _q.get("data").sessions;
					if(_dat > mVal){
						mVal = _dat+20;
						sDom.children("div").each(function(i,n){
							var el =$(n);
							el.stop().find("div:first").animate({
								height:n3n4((parseInt(el.find("div:first").attr("data-dat"))/mVal)*100)
							});
							el = null;
						});
					}

					_nHeight = n3n4((_dat/mVal)*100);
					_nHeight = _nHeight && _nHeight+"%" || 3+"px";
					sDom.append('<div><div data-dat="'+_dat+'"><b></b><em>'+_dat+'</em></div></div>');
					now += 1;

					setTimeout(_doRoll,0);

					if(now >limt){
						window.CollectGarbage && CollectGarbage();
						window.location.reload();
					}
					setTimeout(_addRow,sDlay);
				}

				/*滚*/
				function _doRoll(){
					sDom.children("div").last().find("div:first")[(_nHeight==="3px" && "css"||"animate")]({
						height:_nHeight
					});
					sDom.stop().animate({
						left:parseInt(sDom.css("left"))-set+"px"
					},300,function(){
						if(now > _max){
							sDom.children("div").first().stop().unbind().remove();
							sDom.css("left","-10px");
							window.CollectGarbage && CollectGarbage();
						}
					});
				}

				_upNowInfo();
				setTimeout(_addRow,sDlay);
				
			}
		},
		/*地图*/
		map:function(){

			var me = this,
				mapBox = _Live.container.map.map,
				list = _Live.container.map.list,
				_ul;
			
			var data = this.getModelDataById("map");
			var noDataHtm = '<li id="mapNoData"><p>'+LANG("暂无地区数据。")+'</p></li>';

			var _defCircle = this.config.set.map.defCircle;
			var LV = this.config.set.map.lv;
			var mapping = this.config.set.map.lvMaping;
			var nowOpenInfowindow = null;

			//TODO 动态数据起来后这个步骤需删除
			data = data.length > 0 && _.sortBy(data, function(item){
				return item.visits;
			}) || [];

			/*往地图添加标记*/
			function _buildMarker(n){
	            var nLv = _getLv(n.sessions);
	            _defCircle.center = new google.maps.LatLng(n.location[1],n.location[0]);
	            _defCircle.fillColor = nLv[0];
	            _defCircle.strokeColor = nLv[1];

	            var Circle = new google.maps.Circle(_defCircle);

	            Circle.infowindow = new google.maps.InfoWindow({
		            content:'<div class="infowindowBox"><div class="iwTitle">'+n.name+'</div><table class="iwContent"><tr><td><strong>'+n.sessions+'</strong>'+LANG("访客")+'</td><td><strong>'+n.pageviews+'</strong>PV</td></tr><tr><td><strong>'+(n.sessions - n.reviews)+'</strong>'+LANG("新访客")+'</td><td><strong>'+n.reviews+'</strong>'+LANG("老访客")+'</td></tr></table></div>',
		            position:_defCircle.center
		        });

		        Circle.infowindow.key = n.key;

	            google.maps.event.addListener(Circle,"click",function(){
	            	nowOpenInfowindow && nowOpenInfowindow.close();
	            	nowOpenInfowindow = this.infowindow;
		            nowOpenInfowindow.open(this.map);
				});

	            this.cache.map.markers[n.key] = Circle;
			}

			/*获取对应等级的颜色设定*/
			function _getLv(s){
				var lv = 0;
				for(n in mapping){
					if(s<parseInt(n)){
						lv = mapping[n];
						break;
					}
				}
				lv = LV[lv];
				return lv;
			}

			/*地图初始化函数*/
			function _initMapArea(){

				/*地图实例化对象*/
				this.cache.map = new google.maps.Map(mapBox[0],{
					center:new google.maps.LatLng(23.125444,113.365201),
					zoom:4,
					backgroundColor:"#FFFFFF",
					disableDefaultUI:true,
					scrollwheel:false,
					disableDoubleClickZoom:true,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				});

				_defCircle.map = this.cache.map;
				/*地图标记*/
				this.cache.map.markers = {};

				/*加点*/
				$.each(data,function(i,n){
		            _buildMarker.call(this,n);
				}.bind(this));

				nowOpenInfowindow = this.cache.map.markers[data[0].key].infowindow;
				nowOpenInfowindow.open(this.cache.map);

				setTimeout(function(){
					_doAddData.call(me);
					setTimeout(arguments.callee,me.config.timedely);
				},this.config.timedely);
			}

			/*列表添加与事件绑定*/
			list.append((function(){
				var tmp = '<div>'+LANG("地区")+'</div><ul>';
				if(data.length >0){
					$.each(data,function(i,n){
						tmp += '<li id="'+n.key+'" index="'+i+'"><p><em>'+n.sessions+'</em>'+n.name+'</p></li>';
					});
				}else{
					tmp += noDataHtm;
				}
				tmp += '</ul>';
				return tmp;
			})())
			.find("li").live("click",function(ev){
				var tag = $(ev.target).closest("li");
				var key = tag.attr("id");
				if(key !== "mapNoData"){
					var i = parseInt(tag.attr("index"));
					me.cache.map && me.cache.map.panTo(new google.maps.LatLng(data[i].location[1],data[i].location[0]))
					|| (me._error(LANG("未找到地图娘")));
					
					nowOpenInfowindow && nowOpenInfowindow.close();
					nowOpenInfowindow = me.cache.map.markers[key].infowindow;
					nowOpenInfowindow.open(me.cache.map);
				}
			})
			.hover(
				function(){
					$(this).addClass("beSelected");
				},
				function(){
					$(this).removeClass("beSelected");
				}
			);

			_ul = list.find("ul");

			function _doAddData(){
				var oldData = data;
				data = [].concat(this.getModelDataById("map"));
				var _lis = $.makeArray(_ul.find("li"));
				//var fKey = $(_lis[0]).attr("id");
				this._chkNewDataBy(oldData,data,"key",{
					/*未找到时*/
					"fail":function(i){
						me.cache.map.markers[$(_lis[i]).attr("id")].setMap(null);
						$(_lis[i]).unbind().remove();
					},
					/*找到时*/
					"success":function(i,j){
						$(_lis[i]).attr("index",j).find("em:first").text(data[j].sessions);
					},
					/*结束时*/
					"done":function(keys){
						var _strKeys = ""+keys;
						var noData = $("#mapNoData");
						var listBack = null;
						var nowLis = $.makeArray(_ul.find("li"));
						if(data.length > 0){
							(noData.length > 0) && noData.remove();
							$.each(data,function(i,n){
								var reg = new RegExp(n.key);
								if(!reg.test(_strKeys)){
									/*如果不在已有中的则追加到容器中*/
									var newLi = $('<li id="'+n.key+'" index="'+i+'"><p><em>'+n.sessions+'</em>'+n.name+'</p></li>');
									_ul.append(newLi);
									nowLis.push(newLi);
						            _buildMarker.call(me,n);
								}
								var tEl = _ul.find("#"+n.key);
								tEl.attr("index",i);
								/*调整位置*/
								if(n.key !== $(nowLis[i]).attr("id") && !listBack){
									tEl.addClass("listIsChanged");
								}
								_ul.append(tEl);
								
							});
							
							(function(ul){
								var _ul = ul;
								setTimeout(function(){
									_ul.children("li").removeClass("listIsChanged");
								},1000);
							})(_ul)
						}else{
							if(noData.length === 0){
								_ul.empty().append(noDataHtm);
							}
						}
						data = _lis = _strKeys = noData = listBack = nowLis = null;
					}
				});
			}

			/*直到有google.maps.Map*/
			var _mapChker = setInterval(function(){
				if(window.google && google.maps.Map){
					clearInterval(_mapChker);
					_initMapArea.call(me);
				}
			},500);

		},
		/*来源*/
		sources:function(){
			var chartdata = this.getModelDataById("sourceschart");
			var listdata = this.getModelDataById("sourceslist");
			var me = this;
			var noDataHtm = '<li id="sourcesNoData"><p>'+LANG("暂无访问来源。")+'</p></li>';

			var _lisHtm  = "",
				_ul = _Live.container.sources.list,
				chartBox = _Live.container.sources.chart;
			if(listdata.length > 0){
				$.each(listdata,function(i,n){
					_lisHtm += '<li id="'+n.key+'" index="'+i+'"><p><em>'+n.sessions+'</em><a href="'+n.domain+'" title="'+n.domain+'" target="_blank">'+n.domain.cutMixStr(0,50,"...",false)+'</a></p></li>';
				});
			}else{
				_lisHtm = noDataHtm;
			}
			
			_ul.append(_lisHtm).find("li").hover(
				function(){
					$(this).addClass("beSelected");
				},
				function(){
					$(this).removeClass("beSelected");
				}
			);

			if(chartdata){
				Clicki.manager.add({
					groups:{
						"sourcesChart":{
							type:"charts",
							target:chartBox.attr("id"),
							data:chartdata,
							setting:{
								fields:"pageviews",
								setting:{
			                        "type":"pie",
			                        "options":{
			                            legend:{
			                                enabled:false
			                            },
			                            title:{
			                                text:LANG("操作系统图表"),
			                                style:{
			                                    display:"block"
			                                }
			                            }
			                        },
			                        xAxis:"os_type_name",
			                        yAxis:"pageviews",
			                        height:300
			                    }
							}
						}
					}
				});
			}

			function _doAddData(){
				var oldData = listdata;
				data = [].concat(this.getModelDataById("sourceslist"));
				var _lis = $.makeArray(_ul.find("li"));

				this._chkNewDataBy(oldData,data,"key",{
					/*未找到时*/
					"fail":function(i){
						$(_lis[i]).unbind().remove();
					},
					/*找到时*/
					"success":function(i,j){
						$(_lis[i]).attr("index",j).find("em:first").text(data[j].pageviews);
					},
					/*结束时*/
					"done":function(keys){
						var _strKeys = ""+keys;
						var noData = $("#sourcesNoData");
						var nowLis = $.makeArray(_ul.find("li"));
						if(data.length > 0){
							(noData.length > 0) && noData.remove();
							$.each(data,function(i,n){
								var reg = new RegExp(n.key);
								if(!reg.test(_strKeys)){
									_ul.append('<li id="'+n.key+'" index="'+i+'"><p><em>'+n.sessions+'</em><a href="'+n.domain+'" title="'+n.domain+'" target="_blank">'+n.domain.cutMixStr(0,50,"...",false)+'</a></p></li>');
								}
								var tEl = _ul.find("#"+n.key);
								tEl.attr("index",i);
								/*调整位置*/
								if(n.key !== $(nowLis[i]).attr("id") && !listBack){
									tEl.addClass("listIsChanged");
								}
								_ul.append(tEl);
								
							});
							
							(function(ul){
								var _ul = ul;
								setTimeout(function(){
									_ul.children("li").removeClass("listIsChanged");
								},1000);
							})(_ul)
						}else{
							if(noData.length === 0){
								_ul.empty().append(noDataHtm);
							}
						}
						data = _lis = _strKeys = noData = listBack = nowLis = null;
					}
				});
			}

			setTimeout(function(){
				_doAddData.call(me);
				setTimeout(arguments.callee,me.config.timedely);
			},this.config.timedely);

		},
		content:function(){
			var data = this.getModelDataById("content");
			var me = this;
			var _lisHtm  = "",_ul = _Live.container.content.list;
			var noDataHtm = '<li id="contentNoData"><p>'+LANG("暂无访问内容。")+'</p></li>';
			if(data.length > 0){
				$.each(data,function(i,n){
					_lisHtm += '<li id="'+n.key+'" index="'+i+'"><p><em>'+n.pageviews+'</em><a href="'+n.url+'" title="'+n.title+'" target="_blank">'+n.title.cutMixStr(0,30,"...")+'</a><span><a href="http://'+n.url+'" target="_blank" title="'+n.url+'">'+n.url.cutMixStr(0,55,"...",false)+'</a></span></p></li>';
				});
			}else{
				_lisHtm = noDataHtm;
			}
			
			_ul.append(_lisHtm).find("li").hover(
				function(){
					$(this).addClass("beSelected");
				},
				function(){
					$(this).removeClass("beSelected");
				}
			);

			function _doAddData(){
				var oldData = data;
				data = [].concat(this.getModelDataById("content"));
				var _lis = $.makeArray(_ul.find("li"));
				this._chkNewDataBy(oldData,data,"key",{
					/*未找到时*/
					"fail":function(i){
						$(_lis[i]).unbind().find("*").unbind().remove();
					},
					/*找到时*/
					"success":function(i,j){
						$(_lis[i]).attr("index",j).find("em:first").text(data[j].pageviews);
					},
					/*结束时*/
					"done":function(keys){
						var _strKeys = ""+keys;
						var noData = $("#contentNoData");
						var nowLis = $.makeArray(_ul.find("li"));
						var listBack = null;
						if(data.length > 0){
							(noData.length > 0) && noData.remove();
							$.each(data,function(i,n){
								var reg = new RegExp(n.key);
								if(!reg.test(_strKeys)){
									_ul.append('<li id="'+n.key+'" index="'+i+'"><p><em>'+n.pageviews+'</em><a href="'+n.url+'" title="'+n.title+'" target="_blank">'+n.title.cutMixStr(0,30,"...")+'</a><span><a href="'+n.url+'" target="_blank" title="'+n.url+'">'+n.url.cutMixStr(0,55,"...",false)+'</a></span></p></li>');
								}
								var tEl = _ul.find("#"+n.key);
								tEl.attr("index",i);
								/*调整位置*/
								if(n.key !== $(nowLis[i]).attr("id") && !listBack){
									tEl.addClass("listIsChanged");
								}
								_ul.append(tEl);
								
							});
							
							(function(ul){
								var _ul = ul;
								setTimeout(function(){
									_ul.children("li").removeClass("listIsChanged");
									_ul = null;
								},1000);
							})(_ul)
						}else{
							if(noData.length === 0){
								_ul.empty().append(noDataHtm);
							}
						}
						data = _lis = _strKeys = noData = listBack = nowLis = null;
					}
				});
			}

			setTimeout(function(){
				_doAddData.call(me);
				setTimeout(arguments.callee,me.config.timedely);
			},this.config.timedely);

		},
		/*访客列表*/
		visiter:function(){

			var data = this.getModelDataById("visiter");
			var me = this;
			var _ul;
			var noDataHtm =  '<li id="visiterNoData"><p>'+LANG("暂无访客。")+'</p></li>';

			/*特定字段处理函数*/
			var spSet = {
				"se_name":function(data,dat){
					var tmp,_fix,_fix2;
					data["referer_url"] = data["referer_url"] || "";
					if(data["referer_type"] == 2){
						_fix = data["keyword"].cutMixStr(0,6,"...");
						_fix2 = data["referer_url"].cutMixStr(0,20,"...",false);
						tmp = ''+LANG("从")+'<a href="http://www.baidu.com/" title="" target="_blank"><img src="/resources/images/icons/se/'+dat+'.png" alt="'+dat+'" />'+dat+'</a>'+LANG("搜索")+'<a href="" titile="'+data["keyword"]+'" target="_blank">'+_fix+'</a>'+LANG("进入")+'<span><a href="'+data["referer_url"]+'" tile="'+ _cutHttpStr(data["referer_url"]).cutMixStr(0,10,"...",false)+'" target="_blank">'+_fix2+'</a></span>';
					}else if(data["referer_type"] == 0){
						tmp = LANG('直接输入网址或书签');
					}else{
						tmp = ''+LANG("从")+'<span><a href="'+data["referer_url"]+'" title="" target="_blank">'+_cutHttpStr(data["referer_url"]).cutMixStr(0,30,"...",false)+'</a></span>'+LANG("进入")+'';
					}
					return tmp;
				},
				"online":function(data,dat){
					return dat && "online" || "";
				},
				"flows":function(data,dat){
					var tmp = "<ul>";
					$.each(dat,function(i,n){
						tmp += (""+_visiterLi[1]);
						for(var name in n){
							var dat = name === "over"?(
									n[name] == 1 && "offline" || ""
								):n[name];
							tmp = tmp.replace(new RegExp("{"+name+"}",["g"]),dat);
						}
					});
					tmp += "</ul>";
					return tmp;
				},
				"exit_title":function(data,dat){
					return '<a href="'+data["exit"]+'" title="'+dat+'" target="_blank">'+_cutHttpStr(dat).cutMixStr(0,28,"...")+'</a>';
				}
			}

			/*单条数据htm生成函数*/
			function _buildLi(data){
				var _li = ""+_visiterLi[0];
				for(var n in data){
					var _dat = spSet[n]?spSet[n](data,data[n]):data[n];
					_li = _li.replace(new RegExp("{"+n+"}",["g"]),_dat);
				}
				return _li;
			}

			/*html字符串*/
			var _visiterHtm = '<div class="theVisiterTitle">'+LANG("在线访客")+'top30</div><ul>';

			$.each(data,function(i,n){
				_visiterHtm += _buildLi(n);
			});
			/*添加到文档与事件绑定*/
			_Live.container.visiter.list.append(_visiterHtm+"</ul>").find("li>div.flowsCtrl").live("click",function(ev){
				var tag = $(this);
				var _s = (tag.attr("show") == 1);
				if(_s){
					tag.next().hide();
					tag.attr("show",0).removeClass("show").addClass("hide");
				}else{
					tag.next().show();
					tag.attr("show",1).removeClass("hide").addClass("show");;
				}
				Clicki.Balance();
			});

			/*添加索引*/
			_Live.container.visiter.list.find("ul:first>li").each(function(i,n){
				$(n).attr("index",i);
			});
			
			_ul = _Live.container.visiter.list.find("ul:first");

			/*数据比较与处理函数*/
			function _doAddData(){
				var oldData = data;
				data = [].concat(this.getModelDataById("visiter"));
				var _lis = $.makeArray(_Live.container.visiter.list.find("ul:first>li"));
				this._chkNewDataBy(oldData,data,"key",{
					/*未找到时*/
					"fail":function(i){
						$(_lis[i]).unbind().find("*").unbind().remove();
					},
					/*找到时*/
					"success":function(i,j){
						$(_lis[i]).attr("index",j).find("em:first").text(data[j].sessions);
					},
					/*结束时*/
					"done":function(keys){
						var _strKeys = ""+keys;
						var noData = $("#visiterNoData");
						var listBack = null;
						var nowLis = $.makeArray(_ul.children("li"));
						if(data.length > 0){
							(noData.length > 0) && noData.remove();
							$.each(data,function(i,n){
								var reg = new RegExp(n.key);
								if(!reg.test(_strKeys)){
									/*如果不在已有中的则追加到容器中*/
									_ul.append(_buildLi(n));
								}
								var tEl = _ul.find("#"+n.key);
								tEl.attr("index",i);
								/*调整位置*/
								if(n.key !== $(nowLis[i]).attr("id") && !listBack){
									tEl.addClass("listIsChanged");
								}
								_ul.append(tEl);
							});

							(function(ul){
								var _ul = ul;
								setTimeout(function(){
									_ul.children("li").removeClass("listIsChanged");
								},1000);
							})(_ul)
							
						}else{
							if(noData.length === 0){
								_ul.find("*").unbind("*").empty().append(noDataHtm);
							}
						}
						data = _lis = _strKeys = noData = listBack = nowLis = null;
					}
				});
			}

			setTimeout(function(){
				_doAddData.call(me);
				setTimeout(arguments.callee,me.config.timedely);
			},this.config.timedely);
			_visiterHtm = null;
		},
		/*不同数据(数组)对比与查询*/
		_chkNewDataBy:function(dat,datNew,key,fnObj){
			var keyArr = [];
			for(var i = 0,len = dat.length,len2 = datNew.length;i<len;i++){

				var val = dat[i][key];
				var _get = false;

				if(!val){
					break;
				}

				for(var j = 0;j<len2;j++){
					if(datNew[j][key] === val){
						/*找到时*/
						fnObj && typeof(fnObj.success) === "function" && fnObj.success(i,j);
						keyArr.push(datNew[j][key]);
						_get = true;
						break;
					}
				}

				/*未找到时*/
				!_get && fnObj && typeof(fnObj.fail) === "function" && fnObj.fail(i);

			}
			/*结束时*/
			fnObj && typeof(fnObj.done) === "function" && fnObj.done(keyArr);
		},
		/*获取某id对应的model*/
		getModelById:function(id){
			return this.collection.get(id) || false;
		},
		/*获取某id的data字段数据*/
		getModelDataById:function(id){
			return id && this.collection.get(id).get("data");
		},
		/*设定某id的data字段数据*/
		setModelDataById:function(id,data){
			return id && $.isPlainObject(data) && this.collection.get(id).set(data) || false;
		},
		destroy:function(){
            this.timer && clearTimeout(this.timer);
            this.timer = null;
        }
	}
    
    return {
    	name:"Live",
    	init:function(config){
    		return new Live(config);
    	}
    }

});
