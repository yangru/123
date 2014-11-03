(function(factory){
	if(typeof(define) === "function"){
		define(factory);
	}else{
		factory();
	}
})(function(require,exports,module){

	var Backbone = require("backbone");
	var $ = require("jquery");
	var cookie = require("cookie");

	var guid = 0;
	var viewConfig = {
		// Backbone View 固定配置信息
		initialize: function(){
			var me = this;
			var dom = me.$el;
			var str = me.string;
			var tpl = me.template;
			var data = me.data;
			if (me.target){
				var $target = $(me.target);
				if ($target.length > 0) $target.append(dom);
			}
			Clicki.addCSS('customCode', tpl.css);


			// 名字输入框
			dom.append(tpl.name_input({id:++guid, field:'code_name', name:str.labelName, common:str.commonName}));
			// 匹配地址
			dom.append(tpl.input_con({field:'code_match', id:++guid, name:str.labelMatch}));
			me.doms.match = dom.find('.code_match .fieldInput:first');
			if (data.url && _.isArray(data.url) && data.url.length > 0){
				for (var i=0; i<data.url.length; i++){
					if ($.trim(data.url[i]) == '') continue;
					me.doms.match.append(tpl.input_item({id:guid++, common:str.commonMatch}));
					me.doms.match.find('input:last').val(data.url[i]);
				}
			}else {
				me.doms.match.append(tpl.input_item({id:guid, common:str.commonMatch}));
			}

			// 过滤地址
			dom.append(tpl.input_con({field:'code_exclude', id:++guid, name:str.labelExclude}));
			me.doms.exclude = dom.find('.code_exclude .fieldInput:first');
			if (data.exclude && _.isArray(data.exclude) && data.exclude.length > 0){
				for (var i=0; i<data.exclude.length; i++){
					if ($.trim(data.exclude[i]) == '') continue;
					me.doms.exclude.append(tpl.input_item({id:guid++, common:str.commonExclude}));
					me.doms.exclude.find('input:last').val(data.exclude[i]);
				}
			}else {
				me.doms.exclude.append(tpl.input_item({id:guid, common:str.commonExclude}));
			}

			// 格式说明
			dom.append(tpl.note());

			// 自定义代码输入框和操作按钮
			dom.append(tpl.code_text({field:'code_script', id:++guid, name:str.labelCode}));
			dom.append(tpl.buttons);

			// 判断值和初始化界面
			dom.find('.code_name input:first').val(data.name || '');
			dom.find('.code_script textarea:first').val(data.code || '');
		},
		events: {
			"click .statsAdd":		"newInputBox",
			"click .statsDel":		"delInputBox",
			"click .customSave":	"doSave",
			"click .customCancel":	"doCancle",
		},
		// 下面三个配置是没有指定el配置信息时, 自动生成对象的信息.
		tagName: 'div',
		className: 'customCodeForm',
		// attributes: {},
		// Backbone View 固定配置信息 - 结束 //

		// 模板变量
		template: {
			css: '.customCodeForm .field {padding-top:10px; clear:both;}\
					.customCodeForm label {font-size:14px; float:left; width:120px; line-height:30px; color:#555;}\
					.customCodeForm .fieldInput {float:left; width:640px; position:relative;}\
					.customCodeForm .fieldInput .statsAdd {position:absolute; bottom:12px; right:0px;}\
					.customCodeForm .fieldInput div {position:relative; width:610px;}\
					.customCodeForm .fieldInput i {top:12px; right:0px;}\
					.customCodeForm .fieldInput input {width:600px; margin-bottom: 5px;}\
					.customCodeForm .fieldInput textarea {width:600px; height:150px;}\
					.customCodeForm .note {float:left; margin-left:120px; width:590px; clear:both; border: 1px dotted #aaa; padding: 10px; border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px; background-color: #FBF6DB; color: #5F5F5F;}',
			note: _.template('<div class="note">'+LANG("可以直接输入URL，也可以通过使用 * 符号来设置。* 即通配符，可以放在URL中的任何位置，代替任何字符。")+'<br>'
					+LANG("url.com/a.html，即表示单独插入代码到单个页面中；")+'<br>'
					+LANG("url.com/*.html ，即表示插入代码到所有以.html结尾的网页中；")+'<br>'
					+LANG("url.com/*，即表示插入代码到所有页面中；")+'<br>'
					+LANG("url.com/a/* ，即表示插入代码到子目录a下的全部页面中。")+'<br>'
					+LANG("<b>如果输入中带有 ? 则匹配所有参数, 否则只匹配文件地址<b>")+'</div>'),
			list: _.template('<div>'),
			name_input: _.template('<div class="field <%=field%>"><label for="customCode_<%=id%>"><%=name%></label><div class="fieldInput"><input id="customCode_<%=id%>" placeholder="<%=common%>"></div></div>'),
			code_text: _.template('<div class="field <%=field%>"><label for="customCode_<%=id%>"><%=name%></label><div class="fieldInput"><textarea id="customCode_<%=id%>"></textarea></div></div>'),
			input_con: _.template('<div class="field <%=field%>"><label for="customCode_<%=id%>"><%=name%></label><div class="fieldInput" data-field="<%=field%>"><em class="statsAdd"></em></div></div>'),
			input_item: _.template('<div><i class="statsDel"></i><input id="customCode_<%=id%>" placeholder="<%=common%>"></div>'),
			buttons: '<div class="field"><label>&nbsp;</label><div class="fieldInput"><a class="btnGreen customSave">'+LANG(" 保 存 ")+'</a> <a class="btnGray customCancel">'+LANG(" 取 消 ")+'</a></div></div>'
		},
		// 语言文字信息
		string: {
			labelName: LANG('自定义代码名称'),
			labelMatch: LANG('脚本页面/目录'),
			labelExclude: LANG('过滤页面/目录'),
			labelCode: LANG('自定义代码'),
			commonName: LANG('请输入自定义代码名称'),
			commonMatch: LANG('请输入要插入当前脚本的网站地址'),
			commonExclude: LANG('请输入要排除的网站地址'),
			errorEmptyName: LANG('自定义代码名称不能为空'),
			errorEmptyCode: LANG('自定义代码内容不能为空'),
			errorEmptyUrl: LANG('必须指定一个脚本页面/目录'),
			errorTitle: LANG('表单内容不完整, 请先输入完整的信息')
		},
		// dom对象缓存
		doms: {},

		// 处理事件
		newInputBox: function(evt){
			var p = $(evt.target).parent();
			var common = '';
			switch (p.attr('data-field')){
				case 'code_match': common = this.string.commonMatch; break;
				case 'code_exclude': common = this.string.commonExclude; break;
			}
			p.append(this.template.input_item({id:++guid, common:common}));
			p.find('input:last').focus();
		},

		delInputBox: function(evt){
			var con = $(evt.target).parent();
			if (con.parent().find('.statsDel').length <= 1){
				con.find('input').val('');
			}else {
				con.remove();
			}
		},

		doSave: function(evt){
			var dom = this.$el;
			// 读取数据
			var data = {
				name: $.trim(dom.find('.code_name input:first').val()),
				url: [],
				exclude: [],
				code: $.trim(dom.find('.code_script textarea:first').val())
			};
			if (this.data.id > 0) data.id = this.data.id;
			this.doms.match.find('input').each(function(index, input){
				var val = $.trim($(input).val());
				if (val != '') data.url.push(val);
			});
			this.doms.exclude.find('input').each(function(index, input){
				var val = $.trim($(input).val());
				if (val != '') data.exclude.push(val);
			});

			var error = [];
			if (data.name == '') error.push(this.string.errorEmptyName);
			if (data.url.length == 0) error.push(this.string.errorEmptyUrl);
			if (data.code == '') error.push(this.string.errorEmptyCode);
			if (error.length){
				Clicki.alert('<b style="font-size:14px;">' + this.string.errorTitle + '</b>:<br><br><ul><li>' + error.join('</li><li>') + '</li></ul>');
				return;
			}
			// 提交保存数据
			if (this.onSave && _.isFunction(this.onSave)) this.onSave(data);
		},

		doCancle: function(evt){
			history.go(-1);
		}
	};

	return {
		init: function(config){
			var extendConfig = $.extend(true, {}, viewConfig, config);
			var extendView = Backbone.View.extend(extendConfig);
			return new extendView();
		}
	};

});