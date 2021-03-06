(function(){

/* SeaJS v1.0.1 | seajs.com | MIT Licensed */
this.seajs={_seajs:this.seajs};seajs.version="1.0.1";seajs._data={config:{debug:"",preload:[]},memoizedMods:{},pendingMods:[]};seajs._util={};seajs._fn={};
(function(a){var e=Object.prototype.toString,g=Array.prototype;a.isString=function(a){return e.call(a)==="[object String]"};a.isFunction=function(a){return e.call(a)==="[object Function]"};a.isArray=Array.isArray||function(a){return e.call(a)==="[object Array]"};a.indexOf=g.indexOf?function(a,c){return a.indexOf(c)}:function(a,c){for(var b=0,i=a.length;b<i;b++)if(a[b]===c)return b;return-1};var f=a.forEach=g.forEach?function(a,c){a.forEach(c)}:function(a,c){for(var b=0,i=a.length;b<i;b++)c(a[b],b,
a)};a.map=g.map?function(a,c){return a.map(c)}:function(a,c){var b=[];f(a,function(a,e,h){b.push(c(a,e,h))});return b};a.filter=g.filter?function(a,c){return a.filter(c)}:function(a,c){var b=[];f(a,function(a,e,h){c(a,e,h)&&b.push(a)});return b};a.now=Date.now||function(){return(new Date).getTime()}})(seajs._util);
(function(a,e){function g(a){var c=["{"],b;for(b in a)if(typeof a[b]==="number"||typeof a[b]==="string")c.push(b+": "+a[b]),c.push(", ");c.pop();c.push("}");return c.join("")}var f=e.config;a.error=function(a){if(a.type==="error")throw"Error occurs! "+g(a);else if(f.debug&&typeof console!=="undefined")console[a.type](g(a))}})(seajs._util,seajs._data);
(function(a,e,g){function f(a){a=a.match(/.*(?=\/.*$)/);return(a?a[0]:".")+"/"}function j(m){m=m.replace(/([^:\/])\/+/g,"$1/");if(m.indexOf(".")===-1)return m;for(var d=m.split("/"),c=[],b,h=0,e=d.length;h<e;h++)b=d[h],b===".."?(c.length===0&&a.error({message:"invalid path: "+m,type:"error"}),c.pop()):b!=="."&&c.push(b);return c.join("/")}function c(a){a=j(a);/#$/.test(a)?a=a.slice(0,-1):a.indexOf("?")===-1&&!/\.(?:css|js)$/.test(a)&&(a+=".js");return a}function b(a){function d(a,b){var m=a[b];c&&
c.hasOwnProperty(m)&&(a[b]=c[m])}var c=n.alias,a=a.split("/"),b=a.length-1;d(a,0);b&&d(a,b);return a.join("/")}function i(d){a.forEach(n.map,function(a){a&&a.length===2&&(d=d.replace(a[0],a[1]))});return d}function k(a){return a.replace(/^(\w+:\/\/[^/]*)\/?.*$/,"$1")}function h(d,h,e){if(p[d])return d;!e&&n.alias&&(d=b(d));h=h||l;q(d)&&(d="."+d.substring(1));d.indexOf("://")===-1&&(d.indexOf("./")===0||d.indexOf("../")===0?(d=d.replace(/^\.\//,""),d=f(h)+d):d.indexOf("/")===0?d=k(h)+d:(n.base||a.error({message:"the config.base is empty",
from:"id2Uri",type:"error"}),d=n.base+"/"+d));d=c(d);n.map&&(d=i(d));p[d]=!0;return d}function d(d,b){return a.map(d,function(a){return h(a,b)})}function r(d,b){if(!d||d.ready)return!1;var c=d.dependencies||[];if(c.length)if(a.indexOf(c,b)!==-1)return!0;else for(var h=0;h<c.length;h++)if(r(o[c[h]],b))return!0;return!1}function s(d,b){a.forEach(b,function(b){a.indexOf(d,b)===-1&&d.push(b)})}function q(a){return a.charAt(0)==="~"}var n=e.config,g=g.location,l=g.protocol+"//"+g.host+g.pathname;l.indexOf("\\")!==
-1&&(l=l.replace(/\\/g,"/"));var p={},o=e.memoizedMods;a.dirname=f;a.id2Uri=h;a.ids2Uris=d;a.memoize=function(a,b,c){var e;e=a?h(a,b,!0):b;c.dependencies=d(c.dependencies,e);o[e]=c;a&&b!==e&&(a=o[b])&&s(a.dependencies,c.dependencies)};a.setReadyState=function(d){a.forEach(d,function(a){if(o[a])o[a].ready=!0})};a.getUnReadyUris=function(d){return a.filter(d,function(a){a=o[a];return!a||!a.ready})};a.removeCyclicWaitingUris=function(d,b){return a.filter(b,function(a){return!r(o[a],d)})};a.isInlineMod=
q;a.pageUrl=l;if(n.debug)a.realpath=j,a.normalize=c,a.parseAlias=b,a.getHost=k})(seajs._util,seajs._data,this);
(function(a,e){function g(d,b){function c(){c.isCalled=!0;b();clearTimeout(h)}d.nodeName==="SCRIPT"?f(d,c):j(d,c);var h=setTimeout(function(){c();a.error({message:"time is out",from:"getAsset",type:"warn"})},e.config.timeout)}function f(a,b){a.addEventListener?(a.addEventListener("load",b,!1),a.addEventListener("error",b,!1)):a.attachEvent("onreadystatechange",function(){var c=a.readyState;(c==="loaded"||c==="complete")&&b()})}function j(a,b){a.attachEvent?a.attachEvent("onload",b):setTimeout(function(){c(a,
b)},0)}function c(a,b){if(!b.isCalled){var h=!1;if(i)a.sheet&&(h=!0);else if(a.sheet)try{a.sheet.cssRules&&(h=!0)}catch(e){e.code===1E3&&(h=!0)}h?setTimeout(function(){b()},1):setTimeout(function(){c(a,b)},1)}}var b=document.getElementsByTagName("head")[0],i=navigator.userAgent.indexOf("AppleWebKit")!==-1;a.getAsset=function(a,c,h){var i=/\.css(?:\?|$)/i.test(a),f=document.createElement(i?"link":"script");h&&f.setAttribute("charset",h);g(f,function(){c&&c.call(f);if(!i&&!e.config.debug){try{if(f.clearAttributes)f.clearAttributes();
else for(var a in f)delete f[a]}catch(d){}b.removeChild(f)}});i?(f.rel="stylesheet",f.href=a,b.appendChild(f)):(f.async=!0,f.src=a,b.insertBefore(f,b.firstChild));return f};a.assetOnload=g;var k=null;a.getInteractiveScript=function(){if(k&&k.readyState==="interactive")return k;for(var a=b.getElementsByTagName("script"),c=0;c<a.length;c++){var h=a[c];if(h.readyState==="interactive")return k=h}return null};a.getScriptAbsoluteSrc=function(a){return a.hasAttribute?a.src:a.getAttribute("src",4)};var h=
"seajs-ts="+a.now();a.addNoCacheTimeStamp=function(a){return a+(a.indexOf("?")===-1?"?":"&")+h};a.removeNoCacheTimeStamp=function(a){var b=a;a.indexOf(h)!==-1&&(b=a.replace(h,"").slice(0,-1));return b}})(seajs._util,seajs._data);
(function(a,e,g,f){function j(b,d){function e(){a.setReadyState(f);d()}var f=a.getUnReadyUris(b);if(f.length===0)return e();for(var i=0,g=f.length,l=g;i<g;i++)(function(b){function d(){var c=(k[b]||0).dependencies||[],h=c.length;if(h)c=a.removeCyclicWaitingUris(b,c),h=c.length;h&&(l+=h,j(c,function(){l-=h;l===0&&e()}));--l===0&&e()}k[b]?d():c(b,d)})(f[i])}function c(c,d){function f(){if(e.pendingMods)a.forEach(e.pendingMods,function(b){a.memoize(b.id,c,b)}),e.pendingMods=[];i[c]&&delete i[c];k[c]||
a.error({message:"can not memoized",from:"load",uri:c,type:"warn"});d&&d()}i[c]?a.assetOnload(i[c],f):(e.pendingModIE=c,i[c]=a.getAsset(b(c),f,e.config.charset),e.pendingModIE=null)}function b(b){e.config.debug==2&&(b=a.addNoCacheTimeStamp(b));return b}var i={},k=e.memoizedMods;g.load=function(b,c,e){a.isString(b)&&(b=[b]);var i=a.ids2Uris(b,e);j(i,function(){var b=g.createRequire({uri:e}),h=a.map(i,function(a){return b(a)});c&&c.apply(f,h)})}})(seajs._util,seajs._data,seajs._fn,this);
(function(a){a.Module=function(a,g,f){this.id=a;this.dependencies=g||[];this.factory=f}})(seajs._fn);
(function(a,e,g){g.define=function(f,j,c){arguments.length===1?(c=f,f=""):a.isArray(f)&&(c=j,j=f,f="");if(!a.isArray(j)&&a.isFunction(c)){for(var b=c.toString(),i=/[^.]\brequire\s*\(\s*['"]?([^'")]*)/g,k=[],h,b=b.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g,"\n").replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g,"\n");h=i.exec(b);)h[1]&&k.push(h[1]);j=k}var b=new g.Module(f,j,c),d;if(a.isInlineMod(f))d=a.pageUrl;else if(document.attachEvent&&!window.opera)(d=a.getInteractiveScript())?(d=a.getScriptAbsoluteSrc(d),
e.config.debug==2&&(d=a.removeNoCacheTimeStamp(d))):d=e.pendingModIE;d?a.memoize(f,d,b):e.pendingMods.push(b)}})(seajs._util,seajs._data,seajs._fn);
(function(a,e,g){function f(c){function b(b){var g=a.id2Uri(b,c.uri),b=e.memoizedMods[g];if(!b)return null;if(j(c,g))return a.error({message:"found cyclic dependencies",from:"require",uri:g,type:"warn"}),b.exports;if(!b.exports){var g={uri:g,deps:b.dependencies,parent:c},h=b.factory;b.id=g.uri;b.exports={};delete b.factory;delete b.ready;if(a.isFunction(h)){var d=b.uri;h.toString().search(/\sexports\s*=\s*[^=]/)!==-1&&a.error({message:"found invalid setter: exports = {...}",from:"require",uri:d,type:"error"});
g=h(f(g),b.exports,b);if(g!==void 0)b.exports=g}else if(h!==void 0)b.exports=h}return b.exports}b.async=function(a,b){g.load(a,b,c.uri)};return b}function j(a,b){return a.uri===b?!0:a.parent?j(a.parent,b):!1}g.createRequire=f})(seajs._util,seajs._data,seajs._fn);
(function(a,e,g,f){function j(b,c){b!==void 0&&b!==c&&a.error({message:"config is conflicted",previous:b,current:c,from:"config",type:"error"})}var c=e.config,e=document.getElementById("seajsnode");e||(e=document.getElementsByTagName("script"),e=e[e.length-1]);var b=a.getScriptAbsoluteSrc(e),i;if(b){var b=i=a.dirname(b),k=b.match(/^(.+\/)seajs\/[\d\.]+\/$/);k&&(b=k[1]);c.base=b}c.main=e.getAttribute("data-main")||"";c.timeout=2E4;if(i&&(f.location.search.indexOf("seajs-debug")!==-1||document.cookie.indexOf("seajs=1")!==
-1))c.debug=!0,c.preload.push(i+"plugin-map");g.config=function(b){for(var d in b){var e=c[d],f=b[d];if(e&&d==="alias")for(var g in f)f.hasOwnProperty(g)&&(j(e[g],f[g]),e[g]=f[g]);else e&&(d==="map"||d==="preload")?(a.isArray(f)||(f=[f]),a.forEach(f,function(a){a&&e.push(a)})):c[d]=f}b=c.base;if(b.indexOf("://")===-1)c.base=a.id2Uri(b+"#");return this}})(seajs._util,seajs._data,seajs._fn,this);
(function(a,e,g){var f=e.config;g.use=function(a,c){var b=f.preload,e=b.length;e?g.load(b,function(){f.preload=b.slice(e);g.use(a,c)}):g.load(a,c)};(e=f.main)&&g.use([e]);(function(e){if(e){for(var c={0:"config",1:"use",2:"define"},b=0;b<e.length;b+=2)g[c[e[b]]].apply(a,e[b+1]);delete a._seajs}})((a._seajs||0).args)})(seajs,seajs._data,seajs._fn);
(function(a,e,g,f){if(a._seajs)f.seajs=a._seajs;else{a.config=g.config;a.use=g.use;var j=f.define;f.define=g.define;a.noConflict=function(c){f.seajs=a._seajs;if(c)f.define=j,a.define=g.define;return a};e.config.debug||(delete a._util,delete a._data,delete a._fn,delete a._seajs)}})(seajs,seajs._data,seajs._fn,this);


seajs.config({
	base:"/",
    alias:{
        "backbone":"/resources/libs/backbone/0.5.3/backbone",
        "jquery":"/resources/libs/jquery/1.6.2/jquery",
        "jquery1.5":"/resources/libs/jquery/1.5.1/jquery",
        "underscore":"/resources/libs/underscore/1.1.7/underscore",
        "easing":"/resources/app/modules/jquery.easing/jquery.easing-1.3.pack",
        "fancybox":"/resources/app/modules/jquery.fancybox/fancybox",
        "mousewheel":"/resources/app/modules/jquery.mousewheel/jquery.mousewheel_3.0.4",
        "swfobject":"/resources/app/modules/open_modules/swfobject",
        "jqueryui":"/resources/app/modules/jquery.ui/jquery-ui-1.8.14.custom.min",

        //"charts":"/resources/scripts/clicki.charts",
        "charts":"/resources/app/modules/charts/charts",
        "chart_core":"/resources/app/modules/charts/core/core",
        "chart_default":"/resources/app/modules/charts/modules/default",
        "common":"/resources/scripts/clicki.common",
        "setsite":"/resources/scripts/clicki.setSite",
        "datepicker":"/resources/scripts/clicki.datepicker",
        "grid":"/resources/app/modules/gridview/gridview",
        "format":"/resources/app/modules/format/format",
        "poptip":"/resources/app/modules/poptip/poptip",
        "tabpanel":"/resources/app/modules/tabpanel/tabpanel",
        "widgetManage":"/resources/scripts/clicki.widget_manage",
        "widgetManageList":"/resources/scripts/clicki.widget_manage_list",
        "staticBoot":"/resources/scripts/clicki.boot"
    },
    preload:[
        this.JSON ? "" :"/resources/app/modules/open_modules/json",
        Function.prototype.bind?"":"/resources/app/modules/open_modules/es5-safe"
    ]
});


function clicki(){
	var userAgent = navigator.userAgent;
	this.browser = {
		version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
		safari: /webkit/.test(userAgent),
		opera: /opera/.test(userAgent),
		msie: (/msie/.test(userAgent)) && (!/opera/.test(userAgent)),
		mozilla: (/mozilla/.test(userAgent)) && (!/(compatible|webkit)/.test(userAgent))
	};
	this.WIDGET_ID = window.location.search.match(/[^\w]wid=(\d+)/i);
	this.WIDGET_ID = this.WIDGET_ID ? this.WIDGET_ID[1] : '-1';
};
clicki.prototype = {
    /*初始化操作*/
    init:function(){
    },
	/* 事件绑定 */
	bindEvent:function(o, e, fn){
		o.attachEvent ? o.attachEvent('on'+e, fn) : o.addEventListener(e, fn, false);
		return o;
	},
	/* extend object
    * 	target (Object) : 待修改对象。 
	*	object1 (Object) : 待合并到第一个对象的对象。 
	*	objectN (Object) : (可选) 待合并到第一个对象的对象。 
    */
    extend: function() {
    	if(arguments.length < 2){
    		return arguments[0];
    	}
    	var target = arguments[0], source;
    	for(var i=1, l=arguments.length; i < l; i++){
    		source = arguments[i];
		    for(var k in source){
		    	target[k] = source[k];
		    }
		}
	    return target;
	},
	/**
	 * 格式化字符串 from tbra
	 * eg:
	 * 	formatText('{{0}}天有{{1}}个小时', [1, 24]) 
	 *  or
	 *  formatText('{{day}}天有{{hour}}个小时', {day:1, hour:24}}
	 * @param {Object} msg
	 * @param {Object} values
	 */
	tpFormat: function(msg, values, filter) {
	    var pattern = /\{\{([\w\s\.\(\)"',-\[\]]+)?\}\}/g;
	    return msg.replace(pattern, function(match, key) {
	    	var value = values[key] || eval('(values.' +key+')');
	        return Object.prototype.toString.call(filter) === "[object Function]" ? filter(value, key) : value;
	    });	
	},

	preview: function(setting){
		window.parent.Clicki.WidgetManager.preview(setting);
	},

	getWidgetSetting: function(){
		return window.parent.Clicki.WidgetManager.getWidgetSetting();
	},

	saveWidgetSetting: function(setting, fn){
		window.parent.Clicki.WidgetManager.saveWidgetSetting(setting, fn);
	}
};


/*直接使用seajs的发放释放命名空间与define*/
var Clicki = seajs.noConflict(true);
window.define = Clicki.define;

var _Clicki = new clicki();
for(var n in _Clicki){
    Clicki[n] = _Clicki[n];
}
delete _Clicki;

window.Clicki = Clicki;

/* preview manager */
/*
var PREVIEW_ELE_ID = 'clicki_widget_preview';
function previewManager(){
	this._win = window.parent || window;
	this._dom = this._win.document;
	this.previewEle = this._dom.getElementById('PREVIEW_ELE_ID');
	this._use = this._win.Clicki.use;
	// eg. "/widget/app/app_1"
	this.widgetPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
};
previewManager.prototype = {
	getWrapEle: function(){
		if(!this.previewEle){
			this.previewEle = document.createElement('div');
			this.previewEle.id = PREVIEW_ELE_ID;
			var body = this._dom.getElementsByTagName('body')[0];
			body.appendChild(this.previewEle);
		}
		return this.previewEle;
	},
	preview: function(setting){
		this.getWrapEle();
		if(this.WIDGET_ID != this.previewEle.WIDGET_ID){
			this.previewEle.innerHTML = '';
		}
		this.previewEle.WIDGET_ID = this.WIDGET_ID;
		var widget = {
			widget_id: Clicki.WIDGET_ID,
			setting: setting
		};
		widget.RES_PATH = this.widgetPath + '/res';
		this._use(this.widgetPath + '/main', 
			(function(widget, position_id){
				return function(app){
					app && app.init(widget, position_id);
				}
			})(widget, this.previewEle.id)
		);
	}
};
Clicki.previewManager = new previewManager();


Clicki.use("jquery", function($){
	$(function(){
		window.widgetSettingInit && widgetSettingInit(window.WIDGET_SETTING);
	});

	function widgetSettingSave(setting, callback){
		$.ajax({
			url: '?wid=' + Clicki.WIDGET_ID,
			type: 'post',
			data: setting,
			dataType: 'json',
			success: function(r){
				callback && callback(r);
			},
			error: function(){
				callback && callback({success:false, errorMsg:'UNKNOW ERROR'});
			}
		});
	};
	Clicki.saveWidgetSetting = widgetSettingSave;
});
*/

})();