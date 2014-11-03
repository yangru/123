/*
使用带true参数的noConflict方法来重定义命名空间并释放define方法
var Clicki = seajs.noConflict(true);
*/

// add version to the url
/*function _addVerToUrl(path,extName){
    if(extName == undefined){
    	return window.VERSION ? (path + '.js?v=' + VERSION) : path;
    }else{
    	return window.VERSION ? (path + '.' + extName + '?v=' + VERSION) : path;
    }
};*/

function _addVerToUrl(path,extName){
	//path = 'http://wangjun.clicki.cn' + path;
    if(extName == undefined){
    	return window.VERSION ? (path + '.js?v=' + VERSION) : path;
    }else{
    	return window.VERSION ? (path  + '.' + extName +'?v=' + VERSION) : path;
    }
    //return window.VERSION ? (path + '.js?v=' + VERSION) : path;
};


seajs.config({
    base:"/",
    alias:{
        "views": "/resources/app/views",
        "backbone":"/resources/libs/backbone/0.9.2/backbone",
        "jquery":"/resources/libs/jquery/1.6.2/jquery",
        "jquery1.5":"/resources/libs/jquery/1.5.1/jquery",
        "underscore":"/resources/libs/underscore/1.3.3/underscore",
        "easing":"/resources/app/modules/jquery.easing/jquery.easing.1.3",
        "fancybox":"/resources/app/modules/jquery.fancybox/fancybox",
        "mousewheel":"/resources/app/modules/jquery.mousewheel/jquery.mousewheel_3.0.4",
        "swfobject":"/resources/app/modules/open_modules/swfobject",
        "cookie":"/resources/app/modules/open_modules/cookie",
        "jqueryui":"/resources/app/modules/jquery.ui/jquery-ui-1.8.14.custom.min",
        //"open_modules":"/resources/open_modules/",
        "animate":_addVerToUrl("/resources/app/modules/animate/animate"),
        "dropdownlist":_addVerToUrl("/resources/app/modules/dropdownlist/dropdownlist"),
        "viewpath":_addVerToUrl("/resources/app/modules/viewpath/viewpath"),
        "viewtree":_addVerToUrl("/resources/app/modules/viewtree/viewtree"),
        "router":_addVerToUrl("/resources/app/router/router"),
        "base":_addVerToUrl("/resources/app/modules/base/base"),
        "poplist":_addVerToUrl("/resources/app/modules/poplist/poplist"),
        "event":"/resources/app/modules/event/event",
        "lang":"/resources/app/modules/event/lang",
        "manager":_addVerToUrl("/resources/app/modules/app_management/app_management"),
        "new_manager":_addVerToUrl("/resources/app/modules/manager/manager"),
        "layout":_addVerToUrl("/resources/app/modules/layout/layout"),
        "filterbox":_addVerToUrl("/resources/app/modules/filterbox/filterbox"),
        "charts":"/resources/app/modules/charts/charts",
        "chart_core":"/resources/app/modules/charts/core/core",
        "hcharts":"/resources/app/modules/charts/core/highcharts",
        "chart_default":"/resources/app/modules/charts/modules/default",
        "common":_addVerToUrl("/resources/scripts/clicki.common"),
        "setsite":_addVerToUrl("/resources/scripts/clicki.setSite"),
        "datepicker":"/resources/scripts/clicki.datepicker",
        "m_datepicker":_addVerToUrl("/resources/app/modules/datepicker/datepicker"),
        "live":"/resources/app/modules/live/live",
        "liveblock":_addVerToUrl("/resources/app/modules/liveblock/liveblock"),
        "grid":_addVerToUrl("/resources/app/modules/gridview/gridview"),
        "linkage":_addVerToUrl("/resources/app/modules/gridview/linkage"),
        "format":_addVerToUrl("/resources/app/modules/format/format"),
        "poptip":_addVerToUrl("/resources/app/modules/poptip/poptip"),
        "pop_up":_addVerToUrl("/resources/app/modules/pop_up/pop_up"),
        "tabpanel":_addVerToUrl("/resources/app/modules/tabpanel/tabpanel"),
        "widgetManage":_addVerToUrl("/resources/scripts/clicki.widget.manage"),
        "widgetManageList":_addVerToUrl("/resources/scripts/clicki.widget_manage_list"),
        "staticBoot":_addVerToUrl("/resources/scripts/clicki.boot"),
        "headmap":_addVerToUrl("/resources/app/modules/heatmap/heatmap"),
        'usertoolbar':_addVerToUrl('/resources/scripts/clicki.usertoolbar'),
        "indicator":_addVerToUrl("/resources/app/views/indicator"),
        "latset":_addVerToUrl("/resources/app/views/latset"),
        "date_controller":_addVerToUrl("/resources/app/modules/date_controller/date_controller"),
        "tableList":_addVerToUrl("/resources/app/views/tableList"),
        "channelSet":_addVerToUrl("/resources/app/views/channelSet"),
        "amount":_addVerToUrl("/resources/app/views/amount"),
        "export":_addVerToUrl("/resources/app/views/export"),
        "digg":_addVerToUrl("/resources/app/modules/digg/digg"),
        "diggGridSet":_addVerToUrl("/resources/app/modules/digg/diggGridSet"),
        "search":_addVerToUrl("/resources/app/views/search"),
        "diggGrid":_addVerToUrl("/resources/app/views/diggGrid"),
        "scroller":_addVerToUrl("/resources/app/modules/scroller/scroller"),
        "getCode":_addVerToUrl("/resources/app/views/getCode"),
        "filter":_addVerToUrl("/resources/app/views/filter"),
        "pager":_addVerToUrl("/resources/app/views/pager"),
        "tableBtn":_addVerToUrl("/resources/app/views/tableBtn"),
        "commonGrid":_addVerToUrl("/resources/app/views/commonGrid"),
        "table":_addVerToUrl("/resources/app/views/table"),
        "tableTop":_addVerToUrl("/resources/app/views/tableTop"),
        "tableRows":_addVerToUrl("/resources/app/views/tableRows"),
        "tableRow":_addVerToUrl("/resources/app/views/tableRow"),
        "regionGrid":_addVerToUrl("/resources/app/modules/regionGrid/regionGrid"),
        "cityGrid":_addVerToUrl("/resources/app/modules/cityGrid/cityGrid"),
        "browserGrid":_addVerToUrl("/resources/app/modules/browserGrid/browserGrid"),
        "osGrid":_addVerToUrl("/resources/app/modules/osGrid/osGrid"),
        "languageGrid":_addVerToUrl("/resources/app/modules/languageGrid/languageGrid"),
        "resolutionGrid":_addVerToUrl("/resources/app/modules/resolutionGrid/resolutionGrid"),
        "pixelsGrid":_addVerToUrl("/resources/app/modules/pixelsGrid/pixelsGrid"),
        "ispGrid":_addVerToUrl("/resources/app/modules/ispGrid/ispGrid"),
        "stayslotGrid":_addVerToUrl("/resources/app/modules/stayslotGrid/stayslotGrid"),
        "depthGrid":_addVerToUrl("/resources/app/modules/depthGrid/depthGrid"),
        "reviewslotGrid":_addVerToUrl("/resources/app/modules/reviewslotGrid/reviewslotGrid"),
        "referer_domainGrid":_addVerToUrl("/resources/app/modules/referer_domainGrid/referer_domainGrid"),
        "referer_urlGrid":_addVerToUrl("/resources/app/modules/referer_urlGrid/referer_urlGrid"),
        "referer_typeGrid":_addVerToUrl("/resources/app/modules/referer_typeGrid/referer_typeGrid"),
        "seGrid":_addVerToUrl("/resources/app/modules/seGrid/seGrid"),
        "keywordGrid":_addVerToUrl("/resources/app/modules/keywordGrid/keywordGrid"),
        "gutmCampaignGrid":_addVerToUrl("/resources/app/modules/gutmCampaignGrid/gutmCampaignGrid"),
        "gutmContentGrid":_addVerToUrl("/resources/app/modules/gutmContentGrid/gutmContentGrid"),
        "gutmTermGrid":_addVerToUrl("/resources/app/modules/gutmTermGrid/gutmTermGrid"),
        "gutmMediumGrid":_addVerToUrl("/resources/app/modules/gutmMediumGrid/gutmMediumGrid"),
        "gutmSourceGrid":_addVerToUrl("/resources/app/modules/gutmSourceGrid/gutmSourceGrid"),
        "utmSpotGrid":_addVerToUrl("/resources/app/modules/utmSpotGrid/utmSpotGrid"),
        "utmCampaignGrid":_addVerToUrl("/resources/app/modules/utmCampaignGrid/utmCampaignGrid"),
        "utmKeywordGrid":_addVerToUrl("/resources/app/modules/utmKeywordGrid/utmKeywordGrid"),
        "utmMediumGrid":_addVerToUrl("/resources/app/modules/utmMediumGrid/utmMediumGrid"),
        "pageUrlGrid":_addVerToUrl("/resources/app/modules/pageUrlGrid/pageUrlGrid"),
        "pageDomainGrid":_addVerToUrl("/resources/app/modules/pageDomainGrid/pageDomainGrid"),
        "pageChannelGrid":_addVerToUrl("/resources/app/modules/pageChannelGrid/pageChannelGrid"),
        "landingGrid":_addVerToUrl("/resources/app/modules/landingGrid/landingGrid"),
        "viewpathGrid":_addVerToUrl("/resources/app/modules/viewpathGrid/viewpathGrid"),
        "newDatepicker":_addVerToUrl("/resources/app/views/datepicker"),
        "datepicker_fb1":_addVerToUrl("/resources/app/views/datepicker_fb1"),
        "datepicker_fb2":_addVerToUrl("/resources/app/views/datepicker_fb2"),
        "datepicker_fb3":_addVerToUrl("/resources/app/views/datepicker_fb3"),
        "calendar":_addVerToUrl("/resources/app/views/calendar"),
        "commonChart":_addVerToUrl("/resources/app/views/commonChart"),
        "chartsControl":_addVerToUrl("/resources/app/views/chartsControl"),
        "chartsPaint":_addVerToUrl("/resources/app/views/chartsPaint"),
        "chartsRange":_addVerToUrl("/resources/app/views/chartsRange"),
        "chartsDefault":_addVerToUrl("/resources/app/views/chartsDefault"),
        "wind-core":_addVerToUrl("/resources/libs/wind/0.7.0/wind-core"),
        "wind-builderbase":_addVerToUrl("/resources/libs/wind/0.7.0/wind-builderbase"),
        "wind-compiler":_addVerToUrl("/resources/libs/wind/0.7.0/wind-compiler"),
        "wind-async":_addVerToUrl("/resources/libs/wind/0.7.0/wind-async"),
        "momentjs":_addVerToUrl("/resources/libs/momentjs/moment.min"),
        "teaxareaMaxlengthForIE":_addVerToUrl("/resources/app/modules/textareaMaxlengthForIE/textareaMaxlengthForIE"),
        /**
         * 2012.10.15,重新封装一个列表模块
         */
        "list":_addVerToUrl("/resources/app/modules/list/list")
    },
    preload:[
        this.JSON ? "" :"/resources/app/modules/open_modules/json",
        Function.prototype.bind?"":"/resources/app/modules/open_modules/es5-safe",
        (this.Clicki && this.Clicki.author) ? "":_addVerToUrl("/resources/libs/clicki/clicki")
    ]
});

seajs.use(_addVerToUrl("/resources/app/init"));

function breakpoint(){
    console.log("I've got you!");
}