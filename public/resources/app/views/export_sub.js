define(function(require,exports,module){

	var $ = require("jquery");
	var Backbone = require("backbone");
	var uuid = 1;
	var tpl_string = '\
/** MODULE_TEMPLATE **\\\
\
<!--[[ STYLE_CSS ]]-->\
.gridExportSubBtn {\
	background: #848484;\
	height:30px;\
	color: #fff;\
	padding: 0 10px 0 15px;\
	margin-right: 10px;\
	line-height: 30px;\
	cursor: default;\
}\
.gridExportSubBtn span {\
	float:left;\
	cursor: pointer;\
}\
.gridExportSubBtn .customSetIcon {\
	cursor: pointer;\
	float:left;\
	height: 12px;\
	width: 12px;\
	margin: 6px 0 0 8px;\
	background: url(/resources/styles/images/indicatorArr.png) no-repeat center 6px transparent;\
}\
.gridExportSubWin {\
	position: absolute;\
	top: 32px;\
	right: 10px;\
	left: auto;\
	border: 1px solid #A7A7A7;\
	background: white;\
	display: none;\
	z-index: 14;\
	padding: 10px 16px 15px;\
	width: 280px;\
}\
.gridExportSubWin strong {\
	font-weight: 400;\
	color: #0E0E0E;\
	display: block;\
	margin: 0 0 8px;\
}\
.gridExportSubType span {\
	display:block;\
	float:left;\
	width:140px;\
	padding-bottom: 4px;\
	cursor: pointer;\
}\
<!--[[ /STYLE_CSS ]]-->\
\
<!--[[ button ]]-->\
<div class="gridExportSubBtn"><span>下载Excel表格</span><div class="customSetIcon"></div></div>\
<!--[[ /button ]]-->\
\
<!--[[ subWin ]]-->\
<div class="gridExportSubWin">\
	<strong>请选择要下载的关联维度:</strong>\
	<div class="gridExportSubType"></div>\
</div>\
<!--[[ /subWin ]]-->\
\
<!--[[ subTypeItem ]]-->\
<span><a data-type="{1}">{2}</label></span>\
<!--[[ /subTypeItem ]]-->\
\
\\** MODULE_TEMPLATE **/';

	var tpls = Clicki.getTemplate('export_sub', tpl_string);
	var uuid = 1;
	var types = [
		[0, 'spot', '广告'],
		[0, 'page_url', '访问地址'],
		[0, 'referer_domain', '来源域名'],
		[0, 'referer_url', '来源列表'],
		[0, 'region', '访客省份'],
		[0, 'city', '访客城市'],
		[0, 'os', '操作系统'],
		[0, 'browser', '浏览器'],
		[0, 'language', '语言'],
		[0, 'resolution', '分辨率'],
		[0, 'stayslot', '停留时间'],
		[0, 'depth', '访问深度'],
		[0, 'reviewslot', '访问次数']
	];

	function build(){
		var me = this;
		me.$el.addClass('gridExportSub');
		me.$el.append(me.btnTpl);
		me.$el.append(me.subTpl);

		var con = me.$el.find('.gridExportSubType:first');
		for (var i=0; i<types.length; i++){
			types[i][0] = uuid;
			var html = Clicki.formatStr(tpls.subTypeItem, types[i]);
			con.append(html);
		}
		me.$el.find('.gridExportSubBtn span').click(me, setExport);
		me.$el.find('.customSetIcon').click(toggleWin);
		me.$el.find('.gridExportSubType a').click(me, setExportSub);
		var win = me.$el.find('.gridExportSubWin').click(function(){return false});
		$(document).click(function(){win.hide();});

		// 删除原有的export
		$('#' + me.grid.gridId + '_export').hide();
		uuid++;
	}
	function setExport(evt){
		var me = evt.data;
		var params = me.params
			,_date = Clicki.layout.manager.getDate();
		var obj = $.extend({},params,{
			"tmpl":"export"
			,"limit":9999
			,"begindate":_date.begindate
			,"enddate":_date.enddate
		});
		delete obj.url;
		delete obj.page;
		window.location.href = me.href = params["url"]+"?"+$.param(obj);
		obj = null;
	}
	function setExportSub(evt){
		var me = evt.data;
		var params = me.params
			,_date = Clicki.layout.manager.getDate();
		var obj = $.extend({},params,{
			"tmpl":"export"
			,"limit":9999
			,"begindate":_date.begindate
			,"enddate":_date.enddate
		});
		delete obj.url;
		delete obj.page;
		// delete obj.condition;
		obj.type += '_' + $(this).attr('data-type');
		window.location.href = me.href = params["url"]+"?"+$.param(obj);
		obj = null;
	}
	function toggleWin(evt){
		$(this).parent().next('.gridExportSubWin:first').toggle();
		return false;
	}
	function closeWin(evt){
		$(this).parent().parent().hide();
	}


	function Export(config){
		/*私有设置，这里应该是关键的属性，方法的配置*/
		var privateConfig = {
			btnTpl: tpls.button,
			subTpl: tpls.subWin,

			href:null,
			ready:false,
			refresh:function(config){
				!this.model && config.model && (this.model = config.model);
				this[config.event] && this[config.event](config.data);
			},
			/*初始化处理函数*/
			initialize:function(){
				// 只运行第一层Grid可以导出
				if (this.params.condition != '') return;
				var id = this.id || null;
				id = typeof(id) === "string" && $("#"+id) || id && (id.nodeType || id.selector) && id;
				delete(this.id);
				if (id){
					this.$el = $(id);
					this.el = this.$el[0];
					build.call(this);
				}
				this.ready = true;
			},
			update:function(data){
				seajs.log("export change params");
				$.extend(true,this.params, data.params);
			},
			destroy:function(){
				this.$el.find("*").unbind();
				this.$el.unbind().empty();
			}
		};

		var viewsConfig = $.extend(true,{},config||{},privateConfig);

		var maiView = Backbone.View.extend(viewsConfig);

		return new maiView;
	}

	Export.prototype.constructor = Export;

	return {
		init:function(config){
			return new Export(config);
		}
	};

});