define(function(require){
var $ = require('jquery');
var _ = require('underscore');
var pop = require('pop_up');

var simpleFormTest, initTabContent, jumpAddSite, nowActive;
var cache = {};
var css = '\
.siteSetupCon {padding:15px; position:relative;}\
.site-btn {width:auto; padding:0 10px;}\
.site-title-text { margin-left: 1.2em; color: #7E7E7E; font-size: 20px; text-shadow: rgba(255, 255, 255, 1) 1px 1px 0; line-height: 46px; height: 46px;}\
.site-tab-left {text-align:left !important;}\
.site-tab-center {text-align:center !important; margin:0px !important;}\
a.btnGreen {color:#45630C;}\
a.btnGray {color:#4A4A4A;}\
#siteCustomCodeSearch {height:50px;}\
';

var addCSS = Clicki.addCSS = function (id, css){
	id = 'site_style_'+id;
	if (document.getElementById(id)) return true;

	var style = document.createElement('style');
	style.type = 'text/css';
	style.media = 'screen';
	style.type = 'text/css';
	style.id = id;
	if (style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		style.innerHTML = css;
	}
	document.getElementsByTagName('head')[0].appendChild(style);
}

function setHtml(me, html, navid, name, title){
	addCSS('main', css);

	if(!$.isEmptyObject(Clicki.manager.appCache)){
		Clicki.manager.destroy();
		/*尝试清除当前正在跑的计时器*/
		clearTimeout(setTimeout(function(){})-1);
	}
	Clicki.NavView.contentBox.find("*").unbind();
	Clicki.NavView.contentBox.html('<div class="siteSetupCon">' + html + '</div>');

	if(me.beDo) me.beDo.run();

	$("#clickiNav").removeClass("main")
	$("#adminNav").addClass("main");
	$("#theNavMain,#theNavAdmin").hide();
	$("#theNavSetSite").show();


	if (title){
		var t = $('<div></div>').text(title).addClass('site-title-text');
		t.prepend('<a class="btnGray site-btn" href="JavaScript:history.go(-1);" style="float:left; width:30px; min-width:auto; margin:10px 20px 0 0;">'+LANG("返回")+'</a>');
		Clicki.NavView.contentBox.prepend(t);
	}

	// 设置路径
	me.testIfAfterF5(navid);
	me.crumbs(name);
	Clicki.Balance();
}


var alert_pop = null;
function private_confirm(msg, callback){
	private_alert(msg, callback, true);
}
var private_alert = Clicki.alert = function(msg, callback, confirm){
	if (!alert_pop){
		alert_pop = new pop({
			type: {'html': '<div></div>'},
			"ui":{
				"title":{
					"show":true,
					"text":LANG("系统消息")
				},
				"width": 300
			},
			"autoClose":false,
			"showMark":true,
			"showClose":false,
			"showCtrl":true,
			onDone:function(){
				if (this.msg_queue[0] && this.msg_queue[0][1]) this.msg_queue[0][1]();
				this.msg_queue.shift();
				if (this.msg_queue.length > 0){
					this.content.html(this.msg_queue[0][0]);
					this.doms.cancelBnt.toggle(this.msg_queue[0][2]);
					return;
				}
				this.hide();
				this.showed = false;
			},
			onCancel: function(){
				this.msg_queue.shift();
				this.showed = false;
				if (this.msg_queue.length > 0) this.show();
			},
			onRender: function(){
				this.content = this.doms.inner.find('div:first').css('padding', '10px 10px 20px');
				this.content.html(this.msg_queue[0][0]);
				this.doms.cancelBnt.toggle(this.msg_queue[0][2]);
			},
			beforeShow: function(){
				this.showed = true;
				if (this.content){
					this.content.html(this.msg_queue[0][0]);
					this.doms.cancelBnt.toggle(this.msg_queue[0][2]);
				}
			},
			"data":null,
			"ready":false
		});
		alert_pop.showed = false;
		alert_pop.msg_queue = [];
	}

	alert_pop.msg_queue.push([msg, callback, confirm || false]);
	if (!alert_pop.showed){
		alert_pop.show();
	}
}

function loadData(url, param, callback){
	if (_.isFunction(param)){
		callback = param;
		param = null;
	}
	$.getJSON(url, param, function(data){
		if (!data || !data.success){
			private_alert((data && data.message) || LANG('数据加载失败!'));
		}else {
			callback(data.result);
		}
	})
}

return {
	setEnv:function(f1, f2, f3, v1){
		simpleFormTest = f1;
		initTabContent = f2;
		jumpAddSite = f3;
		nowActive = v1;
	},
	/*添加网站*/
	addsite:function(){
		if(nowActive == "addsite" && Clicki.NavView.clickiHash == nowActive){
			return false;
		}
		if(Clicki.NavView.activeUrl == null){
			this.testIfAfterF5(-2);
		}
		this.getContentHtml(function(){
			simpleFormTest("#Sites_url","#Sites_sitename","#nextstep",false,function(name,url){
				$.ajax({
					url:"/site/ajaxeditsite",
					data: {url:url, sitename:name},
					dataType:"json",
					type:"GET",
					success:function(re){
						if(re["error"] == "+OK"){
							site_id = re.result.site_id;
							Clicki.manager.changeSiteId(site_id);
							Clicki.Balance();
							Clicki.layout.destroy("siteArea").add("siteArea",{
								type:"getCode",
								config:{
									type:"site",
									popConfig:{
										"once":false
									},
									model:{
										"datacontent":[
											{"site_id":site_id}
										]
									}
								}
							});
							$("#Sites_url").attr("disabled","disabled");
							$("#nextstep").unbind().removeClass("saveAndCode").addClass("editSite").attr("id","editSiteName");
							$("#getCode").show().bind("click", function(){
								Clicki.layout.get("siteArea").show();
							});
							simpleFormTest("#Sites_url","#Sites_sitename","#editSiteName",false,function(name,url){
								$.ajax({
									url:"/site/ajaxeditsite",
									data: {site_id:site_id, sitename:name},
									dataType:"json",
									type:"GET",
									success:function(data){
										if(data["error"] == "+OK"){
											require.async("pop_up",function(popup){
												new popup({
													"type":{
														"html":'<span>'+LANG("修改成功")+'!</span>'
													},
													"showClose":false,
													"animate":{
														"config":{
															"position":$("#editSiteName"),
															"fix":{top:0-40,left:0+161},
															"noSetSize":true
														},
														"delay":500
													},
													"tpl":{
														"box":'<div class="{innerCls}"></div><div class="Ex_popTipShadow"> </div>'
													},
													"ui":{
														"mainCls":"Ex_popTip",
														"innerCls":"Ex_popTipInner",
														"width":"auto"
													},
													"once":true
												}).show();
											});
										}else{
											window.console && console.log(data.error);
										}
									},
								   error:function(re){
									   var errorTxt = re.responseText;
									   errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
									   errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));
										errorTxt = errorTxt.replace("<p>","");
									   if (errorTxt){
											alert(LANG("服务器正忙，删除失败，请稍后再试"));
									   }else{
										   alert(LANG("当前是演示网站,不能进行编辑操作.请先登录!"));
									   }

								   }
								});
							});
							//Clicki.Router.navigate("#/site/getcode/"+re.result.site_id,true);
						}else{
							window.console && console.log(re.error);
							$("#Sites_url").next().text(re.error.substr(re.error.indexOf(":")+1));
						}
					},
					error:function(re){
					   var errorTxt = re.responseText;
					   errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
					   errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));
						errorTxt = errorTxt.replace("<p>","");
					   if (errorTxt) alert(LANG("服务器正忙，删除失败，请稍后再试"));
					   else alert(LANG("当前是演示网站,不能进行编辑操作.请先登录!"));
				   }
				});
			});
		});
		nowActive = "addsite";
		Clicki.NavView.clickiHash = "addsite";
		this.crumbs(LANG("添加站点"));
	},
	/*添加站点的下一步，获取代码*/
	getcode:function(id){
		Clicki.manager.destroy();
		this.testIfAfterF5(-2);
		Clicki.NavView.activeUrl = "/site/getcode?out=html";
		require.async(["swfobject"], function(swfobject) {
			this.getContentHtml(function(){
				Clicki.clipboardRender({targetEl:"clicki_js_clipboard", textEl:"copyCodeText"});
				Clicki.Balance();
			},{"site_id":id});
			this.crumbs(LANG("获取代码"));
		}.bind(this));
	},
	/*编辑站点*/
	editsite:function(){
		this.testIfAfterF5("editsite");
		Clicki.NavView.activeUrl = "/site/editsite?out=html";
		this.getContentHtml(function(){
			$("#nextstep").removeClass("saveAndCode").addClass("editSite");
			Clicki.Balance();
			simpleFormTest("#Sites_url","#Sites_sitename","#nextstep",false,function(name,url){
				$.ajax({
					url:"/site/ajaxeditsite",
					data: {site_id:site_id, sitename:name, url:url},
					dataType:"json",
					type:"GET",
					success:function(data){
						if(data["error"] == "+OK"){
							require.async("pop_up",function(popup){
								new popup({
									"type":{
										"html":'<span>'+LANG("修改成功")+'!</span>'
									},
									"showClose":false,
									"animate":{
										"config":{
											"position":$("#nextstep"),
											"fix":{top:0-40,left:0+80},
											"noSetSize":true
										},
										"delay":500
									},
									"tpl":{
										"box":'<div class="{innerCls}"></div><div class="Ex_popTipShadow"> </div>'
									},
									"ui":{
										"mainCls":"Ex_popTip",
										"innerCls":"Ex_popTipInner",
										"width":"auto"
									},
									"once":true
								}).show();
							});
						}else{							
							window.console && console.log(data.error);
							if(data.error) {
								alert(data.error);
							}
						}
					},
				   error:function(re){
					   var errorTxt = re.responseText;
					   errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
					   errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));
						errorTxt = errorTxt.replace("<p>","");
					   if (errorTxt){
						   alert(LANG("当前是演示网站,不能进行编辑操作.请先登录!"));
					   }else{
						   alert(LANG("服务器正忙，删除失败，请稍后再试"));
					   }

				   }
				});
			});
		},{"site_id":site_id});
		this.crumbs(LANG("编辑站点"));
	},

	// 自定义统计代码
	customCodeList: function(method){
		////////////////翻译----添加自定义代码//////////////////
		var tpl = '\
		<a class="btnGreen site-btn" href="#/site/customCodeEdit" style="float:right">'+LANG("添加自定义代码")+'</a>\
		<div id="siteCustomCodeSearch"></div>\
		<div class="G-tableSet"><div id="siteCustomCodeList" class="theTableBox grid"></div></div>';

		setHtml(this, tpl, 'customcode', LANG('自定义代码'));

		Clicki.layout.destroy().add({
			layout: {
				theCustomCodeList: {
					type: "grid",
					config: {
						target: 'siteCustomCodeList',
						url: '/custom/tabs',
						params: {
							"type":"jscript",
							"site_id":site_id
						},
						caption: {
							name:{
								desc: "",
								title: LANG("自定义代码名称")
							},
							last_time:{
								title: LANG('修改时间'),
								desc: ""
							},
							url:{
								title: LANG("代码页面地址"),
								desc: ''
							}
						},
						colModel:[
							{
								tdCls: 'theTextLeft',
								data: "name",
								width: '250px'
							},
							{
								data: 'url',
								cls: 'site-tab-left',
								render:function(key,i,row){
									var data = this._getCollection().getModelDataAt(row);
									if (!data.url) return '&nbsp;';
									return data.url.join('<br>');
								}
							},
							{
								tdCls: 'theTextCenter',
								cls: 'site-tab-center',
								data: "last_time",
								width: '140px'
							},
							{
								data: null,
								text: LANG("操作"),
								width:'80px',
								tdCls: 'theTextCenter',
								cls: 'site-tab-center',
								render:function(key,i,row){
									var data = this._getCollection().getModelDataAt(row);
									var id = data.id;
									var html = '<a href="#/site/customCodeEdit/'+id+'">修改</a> | ';
									html += '<a class="customCodeDelete" href="#" data-id="'+id+'">删除</a>';
									return html;
								}
							}
						],
						callback: function(){
							this.mainEl.find('.grid-page').remove();
							function customCodeDelete(){
								var a = $(this);
								var id = a.attr('data-id');

								private_confirm('确认删除选定点自定义代码记录吗?', function(){
									var param = {
										type: 18000,
										subtype: 0,
										site_id: site_id,
										data: '{"id":' + id + '}'
									}
									loadData('/custom/tab_delete', param, function(){
										a.parents('tr:first').remove();
									});
								});
								return false;
							}
							this.mainEl.find('a.customCodeDelete').click(customCodeDelete);
						}
					}
				}
			}
		});
	},
	customCodeEdit: function(id){
		var controll = this;
		var tpl = '\
		<a class="btnGray site-btn" href="#/site/customCodeList">'+LANG("返回")+'</a>\
		<div id="siteCustomCodeForm" style="padding:10px 30px;"></div>';

		loadData('/custom/tabs', {type:"jscript", site_id:site_id}, function(data){
			cache.customCodes = data;
			id = parseInt(id);
			if (isNaN(id)){
				// 新建记录
				var code = {id: 0};
			}else {
				// 编辑记录
				var code = _.find(data.items, function(item){return item.id == id;})
			}

			setHtml(controll, tpl, 'customcode', LANG('自定义代码'));

			// 显示编辑界面
			Clicki.layout.destroy().add(
				'theCustomCodeForm',
				{
					type: "views/customCodeForm",
					config: {
						target: '#siteCustomCodeForm',
						data: code,
						onSave: function(code){
							var param = {
								type: data.type,
								subtype: data.subtype,
								site_id: site_id,
								data: JSON.stringify(code)
							}
							loadData('/custom/tab_edit', param, function(){
								location.href = '#/site/customCodeList';
							});
						}
					}
				}
			);
		});
	}
}

});