define(function(){
    return {
        "se":{
            router: {
                model: "feed",
                defaultAction: "group",
                type: null
            },
            colModel:[
                {data:"se_name",render:function(key,i,row){
                    return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+LANG(key)+'</label>';
                }},
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id,
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html',
                            },
                            width:850,
                            height:460,
                            title:LANG("{se_name} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            target:"theList_digg_chart",
                            type:"poptip",
                            params:{
                                type: "se",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{se_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"},
                {data:"active_visitors"}
            ],
            filter:{
                type:"se_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            sub: {
                "def":{
                    xtype: "grid",
                    subTitle:LANG("关键词"),
                    params: {
                        site_id: site_id,
                        type: "keyword",
                        order: "pageviews|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"keyword_name",width:"25%",render:function(key,i,row){
                            var _se = {
                                "10000":"http://www.baidu.com/s?wd=",
                                "10002":"https://www.google.com/search?q=",
                                "10003":"http://www.sogou.com/web?query=",
                                "10004":"http://www.soso.com/q?w=",
                                "10001":"http://cn.bing.com/search?q=",
                                "10005":"http://www.youdao.com/search?q="
                            };
                            var seName = this._getCollection().getParams().condition.split("|")[1];
                            var _key = encodeURIComponent(key);
                            return '<a href="'+(_se[seName]+_key)+'" target="_blank">'+key+'</a>';
                        }},
                        {
                            data:null,
                            xModule:{
                                "visit":{
                                    type:"poptip",
                                    url: "/statistic/visitordetail",
                                    params: {
                                        "site_id":site_id
                                    },
                                    addParams: {
                                        condition : '{keys}',
                                        out: 'html'
                                    },
                                    height:460,
                                    title:LANG("{keyword_name} 的访客列表"),
                                    width:850,
                                    boxType:"center"
                                },
                                "linkage":{
                                    target:"theList_digg_chart",
                                    type:"poptip",
                                    params:{
                                        type: "keyword",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{keyword_name} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访问明细")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                        },
                        {data:"pageviews"},
                        {data:"sessions"},
                        {data:"visitors"},
                        {data:"new_visitors"},
                        {data:"bounce_rate"},
                        {data:"avg_staytime"},
                        {data:"avg_loadtime"}
                    ],
                    showPage: true,
                    alwaysRefresh: true,
                    ExportExcel: true
                },
                "geo":{
                    xtype:"tabpanel",
                    subTitle:LANG("访客地区"),
                    params:{},
                    addParams: {
                        condition : '{keys}'
                    },
                    items:[
                        {
                            text:LANG("省份"),
                            scope:true,
                            html:'<div class="theList_region"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_region"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "geo",
                                            order: "sessions|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"region_name",width:"150px",compare:false},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{region_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "geo",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{region_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true,
                                        icon: {
                                            col: 1,
                                            pos: 0,
                                            type:"geo",
                                            name:"country_icon",
                                            title:"country_name"
                                        }
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        },
                        {
                            text:LANG("城市"),
                            scope:true,
                            html:'<div class="theList_city"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_city"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "city",
                                            order: "sessions|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {
                                                data:"city_name",
                                                width:"150px",
                                                compare:false,
                                                render:function(key,i,row){
                                                    var client = this._getCollection().getModelDataAt(row).x_axis;
                                                    return client.region_name + " " + client.city_name ;
                                                }
                                            },
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{city_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "city",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{city_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        }
                    ]
                }
            },
            ExportExcel: true,
            title: LANG("搜索引擎数据表"),
            icon: {
                col: 1,
                pos: 0,
                type:"se",
                name:"se_icon"
            },
            showMark:false,
            showTotal: true
        },
        "keyword":{
            colModel:[
                {
                    compare:false,
                    data:"keyword_name",
                    width:"120px",
                    render:function(key,i,row){
                        return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                    }
                },
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            height:460,
                            title:LANG("{keyword_name} 的访客列表"),
                            width:850,
                            boxType:"center"
                        },
                        "linkage":{
                            target:"theList_digg_chart",
                            type:"poptip",
                            params:{
                                type: "keyword",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{keyword_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访问明细")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"},
                {data:"active_visitors"}
            ],
            sub:{
                "def":{
                    xtype:"grid",
                    subTitle:LANG("搜索引擎"),
                    params : {
                        site_id: site_id,
                        type: "se",
                        order: "pageviews|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition" : "{keys}",
                        "dims":"keyword_name"
                    },
                    /*表格列宽设置*/
                    colModel:[
                        {data:"se_name",width:"110px",render:function(key,i,row){
                            var _se = {
                                "baidu":"http://www.baidu.com/s?wd=",
                                "google":"https://www.google.com/search?q=",
                                "sogou":"http://www.sogou.com/web?query=",
                                "soso":"http://www.soso.com/q?w=",
                                "bing":"http://cn.bing.com/search?q=",
                                "youdao":"http://www.youdao.com/search?q="
                            };
                            var se = this._getCollection().getModelDataAt(row).x_axis;

                            return '<a href="'+(_se[se.se_name]+se.keyword_name)+'" target="_blank">'+key+'</a>';
                        }},
                        {
                            data:null,
                            xModule:{
                                "visit":{
                                    type:"poptip",
                                    url: "/statistic/visitordetail",
                                    params: {
                                        "site_id":site_id
                                    },
                                    addParams: {
                                        condition : '{keys}',
                                        out: 'html',
                                    },
                                    width:850,
                                    height:460,
                                    title:LANG("{se_name} 的访客列表"),
                                    boxType:"center"
                                },
                                "linkage":{
                                    target:"theList_digg_chart",
                                    type:"poptip",
                                    params:{
                                        type: "se",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{se_name} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                        },
                        {data:"pageviews"},
                        {data:"sessions"},
                        {data:"visitors"},
                        {data:"new_visitors"},
                        {data:"avg_staytime"},
                        {data:"avg_loadtime"},
                        {data:"avg_pagepixels"},
                        {data:"bounce_rate"}
                    ],
                    icon: {
                        col: 1,
                        pos: 0,
                        type:"se",
                        name:"se_icon"
                    },
                    showPage:true,
                    alwaysRefresh:true,
                    ExportExcel: true
                },
                "geo":{
                    xtype:"tabpanel",
                    subTitle:LANG("访客地区"),
                    params:{},
                    addParams: {
                        condition : '{keys}'
                    },
                    items:[
                        {
                            text:LANG("省份"),
                            scope:true,
                            html:'<div class="theList_region"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_region"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "geo",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"region_name",width:"150px",compare:false},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{region_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "geo",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{region_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true,
                                        icon: {
                                            col: 1,
                                            pos: 0,
                                            type:"geo",
                                            name:"country_icon",
                                            title:"country_name"
                                        }
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;                           
                            }
                        },
                        {
                            text:LANG("城市"),
                            scope:true,
                            html:'<div class="theList_city"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_city"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "city",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {
                                                data:"city_name",
                                                width:"150px",
                                                compare:false,
                                                render:function(key,i,row){
                                                    var client = this._getCollection().getModelDataAt(row).x_axis;
                                                    return client.region_name + " " + client.city_name ;
                                                }
                                            },
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{city_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "city",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{city_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        }
                    ]
                }
            },
            filter:{
                type:"keyword_list_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            ExportExcel: true,
            title: LANG("关键词数据表"),
            showTotal:true
        },
        "referer_domain":{
            colModel:[
                {data:"referer_domain_name",width:"200px",compare:false,render:function(_str,i,row,href){
                    return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" />'+"<a href='http://"+href+"' target='_blank' title='"+LANG("在新页面打开")+"'>"+_str+"</a>";
                    }
                },
                {
                    data: null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            title:LANG("{referer_domain_name} 的访客列表"),
                            height:460,
                            boxType:"center"
                        },
                        "linkage":{
                            target:"theList_digg_chart",
                            type:"poptip",
                            params:{
                                type: "referer_domain",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{referer_domain_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"},
                {data:"active_visitors"}
            ],
            filter:{
                type:"referer_domain_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            sub: {
                "def":{
                    xtype: "grid",
                    subTitle:LANG("来源页面"),
                    params: {
                        site_id: site_id,
                        type: "referer_url",
                        order: "pageviews|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"referer_url_name",compare:false,
                            render:function(_str,i,row,href){
                                this.nowTmp = this.nowTmp || (function(me){
                                    var collection = me._getCollection();
                                    var ms = collection.getAllModelData();
                                    var id = collection.params.condition.split("|");
                                    var tag = "http:\\/\\/";
                                    if(id[1]){
                                        id = id[1];
                                        for(var n = 0;n<ms.length;n++){
                                            if(ms[n].keys.referer_url_id == id){
                                                tag += ""+ms[n].x_axis.referer_url_name;
                                                break;
                                            }
                                        }
                                    }
                                    ms = id = null;
                                    return tag;
                                })(this);

                                var str = (""+href).replace(new RegExp(this.nowTmp,["g"]),"");
                                str = str.cutMixStr(0,this.ellipsis,"...");
                                return "<a href='"+href+"' target='_blank' title='"+LANG("在新页面打开")+"--"+href+"'>"+str+"</a>";
                            },
                            width:"290px"
                        },
                        {
                            data:null,
                            xModule:{
                                "visit":{
                                    type:"poptip",
                                    url: "/statistic/visitordetail",
                                    params: {
                                        "site_id":site_id
                                    },
                                    addParams: {
                                        condition : '{keys}',
                                        out: 'html'
                                    },
                                    width:850,
                                    height:460,
                                    title:LANG("{referer_url_name} 的访客列表"),
                                    boxType:"center"
                                },
                                "linkage":{
                                    target:"theList_digg_chart",
                                    type:"poptip",
                                    params:{
                                        type: "referer_url",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{referer_url_name} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            tpl:"<span class=\"theCtrlListR\"><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                        },
                        {data:"pageviews"},
                        {data:"sessions"},
                        {data:"visitors"},
                        {data:"new_visitors"},
                        {data:"bounce_rate"},
                        {data:"avg_staytime"},
                        {data:"avg_loadtime"}
                    ],
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "geo":{
                    xtype:"tabpanel",
                    subTitle:LANG("访客地区"),
                    params:{},
                    addParams: {
                        condition : '{keys}'
                    },
                    items:[
                        {
                            text:LANG("省份"),
                            scope:true,
                            html:'<div class="theList_region"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_region"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "geo",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"region_name",width:"150px",compare:false},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{region_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "geo",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{region_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true,
                                        icon: {
                                            col: 1,
                                            pos: 0,
                                            type:"geo",
                                            name:"country_icon",
                                            title:"country_name"
                                        }
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        },
                        {
                            text:LANG("城市"),
                            scope:true,
                            html:'<div class="theList_city"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_city"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "city",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {
                                                data:"city_name",
                                                width:"150px",
                                                compare:false,
                                                render:function(key,i,row){
                                                    var client = this._getCollection().getModelDataAt(row).x_axis;
                                                    return client.region_name + " " + client.city_name ;
                                                }
                                            },
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{city_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "city",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{city_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        }
                    ]
                }
            },
            ExportExcel: true,
            title: LANG("来源域名数据表"),
            minChart: {
                type: "horizontal",
                tpl: "<div class=\"minChartH\"><em><%= key %></em></div>",
                v: 1,
                key: "sessions",
                title: LANG("PV比例")
            },
            showTotal: true
        },
        "referer_url":{
            colModel:[
                {data:"referer_url_name",width:"220px",compare:false,
                    render:function(_str,i,row,href){
                        return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" />' + "<a href='"+href+"' target='_blank' title='"+LANG("在新页面打开")+"--"+href+"'>"+_str+"</a>";
                    },
                    width:"290px"
                },
                //tpl:"<a href='<%= key %>' target='_blank' title='在新页面打开<%= key %>'><%= key %></a>"},
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            height:460,
                            title:LANG("{referer_url_name} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            target:"theList_digg_chart",
                            type:"poptip",
                            params:{
                                type: "referer_url",
                                site_id: site_id
                            },
                            addParams: {
                                condition:"{keys}"
                            },
                            title:LANG("{referer_url_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews",sort:true},
                {data:"sessions",sort:true},
                {data:"visitors",sort:true},
                {data:"new_visitors",sort:true},
                {data:"avg_staytime",sort:true},
                {data:"avg_loadtime",sort:true},
                {data:"bounce_rate",sort:true},
                {data:"active_visitors"}
            ],
            sub:{
                "geo":{
                    xtype:"tabpanel",
                    subTitle:LANG("访客地区"),
                    params:{},
                    addParams: {
                        condition : '{keys}'
                    },
                    items:[
                        {
                            text:LANG("省份"),
                            scope:true,
                            html:'<div class="theList_region"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_region"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "geo",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"region_name",width:"150px",compare:false},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{region_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "geo",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{region_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true,
                                        icon: {
                                            col: 1,
                                            pos: 0,
                                            type:"geo",
                                            name:"country_icon",
                                            title:"country_name"
                                        }
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        },
                        {
                            text:LANG("城市"),
                            scope:true,
                            html:'<div class="theList_city"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_city"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "city",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {
                                                data:"city_name",
                                                width:"150px",
                                                compare:false,
                                                render:function(key,i,row){
                                                    var client = this._getCollection().getModelDataAt(row).x_axis;
                                                    return client.region_name + " " + client.city_name ;
                                                }
                                            },
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{city_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "city",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{city_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        }
                    ]
                }
            },
            filter:{
                type:"referer_url_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:LANG("新访客PV")},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            title: LANG("来源页面数据表"),
            ExportExcel: true,
            showTotal:true
        },
        "referer_type":{
            colModel:[
                {data:"source0_name",compare:false,width:"120px",render:function(key,i,row){
                    return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                }},
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            height:460,
                            title:LANG("{source0_name} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            target:"theList_digg_chart",
                            type:"poptip",
                            params:{
                                type: "referer_type",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{source0_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"},
                {data:"active_visitors"}
            ],
            sub:{
                /*来源域名，社会化媒体、外部链接、邮件*/
                "referer":{
                    xtype:"tabpanel",
                    subTitle:LANG("来源列表"),
                    params:{},
                    addParams: {
                        condition : '{keys}'
                    },
                    items:[
                        {
                            "text":LANG("来源域名"),
                            scope:true,
                            html:'<div class="theList_referer_domain"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                var _name = "theList_referer_domain"+this.parent.target;
                                set.groups[_name] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "referer_domain",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition:this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"referer_domain_name",width:"200px",compare:false,render:function(_str,i,row,href){
                                                return "<a href='http://"+href+"' target='_blank' title='"+LANG("在新页面打开")+"'>"+_str+"</a>";
                                                }
                                            },
                                            {
                                                data: null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        title:LANG("{referer_domain_name} 的访客列表"),
                                                        height:460,
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "referer_domain",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{referer_domain_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        sub: {
                                            "def":{
                                                xtype: "grid",
                                                subTitle:LANG("来源页面"),
                                                params: {
                                                    site_id: site_id,
                                                    type: "referer_url",
                                                    order: "pageviews|-1",
                                                    limit: 10
                                                },
                                                addParams: {
                                                    begindate: function(){return Clicki.manager.getDate().beginDate},
                                                    enddate: function(){return Clicki.manager.getDate().endDate},
                                                    "condition": "{keys}"
                                                },
                                                colModel:[
                                                    {data:"referer_url_name",compare:false,
                                                        render:function(_str,i,row,href){
                                                            this.nowTmp = this.nowTmp || (function(me){
                                                                var ms = Clicki.manager.getApp(_name).Collection.models;
                                                                var id = me._getCollection().params.condition.split("|");
                                                                var tag = "http:\\/\\/";
                                                                if(id[1]){
                                                                    id = id[1];
                                                                    for(var n = 0;n<ms.length;n++){
                                                                        if(ms[n].attributes.keys.referer_domain_id == id){
                                                                            tag += ""+ms[n].attributes.x_axis.referer_domain_name;
                                                                            break;
                                                                        }
                                                                    }
                                                                }
                                                                ms = id = null;
                                                                return tag;
                                                            })(this);

                                                            var str = (""+href).replace(new RegExp(this.nowTmp,["g"]),"");
                                                            str = str.cutMixStr(0,this.ellipsis,"...");
                                                            return "<a href='"+href+"' target='_blank' title='"+LANG("在新页面打开")+"--"+href+"'>"+str+"</a>";
                                                        },
                                                        width:"290px"
                                                    },
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{referer_url_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "referer_url",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{referer_url_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"bounce_rate"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"}
                                                ],
                                                showPage: true,
                                                ExportExcel: true,
                                                alwaysRefresh: true
                                            },
                                            "geo":{
                                                xtype:"tabpanel",
                                                subTitle:LANG("访客地区"),
                                                params:{},
                                                addParams: {
                                                    condition : '{keys}'
                                                },
                                                items:[
                                                    {
                                                        text:LANG("省份"),
                                                        scope:true,
                                                        html:'<div class="theList_region"></div>',
                                                        afterRender:function(mAttributes){
                                                            var set = {groups:{}};
                                                            set.groups["theList_region"+this.parent.target] = {
                                                                type:"grid",
                                                                setting:{
                                                                    router: {
                                                                        model: "feed",
                                                                        defaultAction: "group",
                                                                        type: null
                                                                    },
                                                                    params: {
                                                                        type: "geo",
                                                                        order: "pageviews|-1",
                                                                        site_id: site_id,
                                                                        begindate:Clicki.manager.getDate().beginDate,
                                                                        enddate:Clicki.manager.getDate().endDate,
                                                                        condition : this.parent.params.condition
                                                                    },
                                                                    colModel:[
                                                                        {data:"region_name",width:"150px",compare:false},
                                                                        {
                                                                            data:null,
                                                                            xModule:{
                                                                                "visit":{
                                                                                    type:"poptip",
                                                                                    url: "/statistic/visitordetail",
                                                                                    params: {
                                                                                        "site_id":site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : '{keys}',
                                                                                        out: 'html'
                                                                                    },
                                                                                    width:850,
                                                                                    height:460,
                                                                                    title:LANG("{region_name} 的访客列表"),
                                                                                    boxType:"center"
                                                                                },
                                                                                "linkage":{
                                                                                    target:"theList_digg_chart",
                                                                                    type:"poptip",
                                                                                    params:{
                                                                                        type: "geo",
                                                                                        site_id: site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : "{keys}"
                                                                                    },
                                                                                    title:LANG("{region_name} 趋势图"),
                                                                                    width:800,
                                                                                    boxType:"center",
                                                                                    height:300
                                                                                }
                                                                            },
                                                                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                                        },
                                                                        {data:"pageviews"},
                                                                        {data:"sessions"},
                                                                        {data:"visitors"},
                                                                        {data:"new_visitors"},
                                                                        {data:"avg_staytime"},
                                                                        {data:"avg_loadtime"},
                                                                        {data:"avg_pagepixels"},
                                                                        {data:"bounce_rate"},
                                                                        {data:"active_visitors"}
                                                                    ],
                                                                    target: mAttributes.dom.find("div:first"),
                                                                    ExportExcel: true,
                                                                    icon: {
                                                                        col: 1,
                                                                        pos: 0,
                                                                        type:"geo",
                                                                        name:"country_icon",
                                                                        title:"country_name"
                                                                    }
                                                                }
                                                            };
                                                            Clicki.manager.add(set);
                                                            set = null;
                                                        }
                                                    },
                                                    {
                                                        text:LANG("城市"),
                                                        scope:true,
                                                        html:'<div class="theList_city"></div>',
                                                        afterRender:function(mAttributes){
                                                            var set = {groups:{}};
                                                            set.groups["theList_city"+this.parent.target] = {
                                                                type:"grid",
                                                                setting:{
                                                                    router: {
                                                                        model: "feed",
                                                                        defaultAction: "group",
                                                                        type: null
                                                                    },
                                                                    params: {
                                                                        type: "city",
                                                                        order: "pageviews|-1",
                                                                        site_id: site_id,
                                                                        begindate:Clicki.manager.getDate().beginDate,
                                                                        enddate:Clicki.manager.getDate().endDate,
                                                                        condition : this.parent.params.condition
                                                                    },
                                                                    colModel:[
                                                                        {
                                                                            data:"city_name",
                                                                            width:"150px",
                                                                            compare:false,
                                                                            render:function(key,i,row){
                                                                                var client = this._getCollection().getModelDataAt(row).x_axis;
                                                                                return client.region_name + " " + client.city_name ;
                                                                            }
                                                                        },
                                                                        {
                                                                            data:null,
                                                                            xModule:{
                                                                                "visit":{
                                                                                    type:"poptip",
                                                                                    url: "/statistic/visitordetail",
                                                                                    params: {
                                                                                        "site_id":site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : '{keys}',
                                                                                        out: 'html'
                                                                                    },
                                                                                    width:850,
                                                                                    height:460,
                                                                                    title:LANG("{city_name} 的访客列表"),
                                                                                    boxType:"center"
                                                                                },
                                                                                "linkage":{
                                                                                    target:"theList_digg_chart",
                                                                                    type:"poptip",
                                                                                    params:{
                                                                                        type: "city",
                                                                                        site_id: site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : "{keys}"
                                                                                    },
                                                                                    title:LANG("{city_name} 趋势图"),
                                                                                    width:800,
                                                                                    boxType:"center",
                                                                                    height:300
                                                                                }
                                                                            },
                                                                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                                        },
                                                                        {data:"pageviews"},
                                                                        {data:"sessions"},
                                                                        {data:"visitors"},
                                                                        {data:"new_visitors"},
                                                                        {data:"avg_staytime"},
                                                                        {data:"avg_loadtime"},
                                                                        {data:"avg_pagepixels"},
                                                                        {data:"bounce_rate"},
                                                                        {data:"active_visitors"}
                                                                    ],
                                                                    target: mAttributes.dom.find("div:first"),
                                                                    ExportExcel: true
                                                                }
                                                            };
                                                            Clicki.manager.add(set);
                                                            set = null;
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        target:mAttributes.dom.find("div:first"),
                                        ExportExcel: true
                                    }
                                }
                                Clicki.manager.add(set);
                                set = null;
                            }
                        },
                        {
                            "text":LANG("来源页面"),
                            scope:true,
                            html:'<div class="theList_referer_url"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                var _name = "theList_referer_url"+this.parent.target;
                                set.groups[_name] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "referer_url",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition:this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"referer_url_name",width:"220px",compare:false,
                                                render:function(_str,i,row,href){
                                                    return "<a href='"+href+"' target='_blank' title='"+LANG("在新页面打开")+"--"+href+"'>"+_str+"</a>";
                                                },
                                                width:"290px"
                                            },
                                            //tpl:"<a href='<%= key %>' target='_blank' title='在新页面打开<%= key %>'><%= key %></a>"},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{referer_url_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_referer_url_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "referer_url",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition:"{keys}"
                                                        },
                                                        title:LANG("{referer_url_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews",sort:true},
                                            {data:"sessions",sort:true},
                                            {data:"visitors",sort:true},
                                            {data:"new_visitors",sort:true},
                                            {data:"avg_staytime",sort:true},
                                            {data:"avg_loadtime",sort:true},
                                            {data:"bounce_rate",sort:true},
                                            {data:"active_visitors"}
                                        ],
                                        sub:{
                                            "geo":{
                                                xtype:"tabpanel",
                                                subTitle:LANG("访客地区"),
                                                params:{},
                                                addParams: {
                                                    condition : '{keys}'
                                                },
                                                items:[
                                                    {
                                                        text:LANG("省份"),
                                                        scope:true,
                                                        html:'<div class="theList_region"></div>',
                                                        afterRender:function(mAttributes){
                                                            var set = {groups:{}};
                                                            set.groups["theList_region"+this.parent.target] = {
                                                                type:"grid",
                                                                setting:{
                                                                    router: {
                                                                        model: "feed",
                                                                        defaultAction: "group",
                                                                        type: null
                                                                    },
                                                                    params: {
                                                                        type: "geo",
                                                                        order: "pageviews|-1",
                                                                        site_id: site_id,
                                                                        begindate:Clicki.manager.getDate().beginDate,
                                                                        enddate:Clicki.manager.getDate().endDate,
                                                                        condition : this.parent.params.condition
                                                                    },
                                                                    colModel:[
                                                                        {data:"region_name",width:"150px",compare:false},
                                                                        {
                                                                            data:null,
                                                                            xModule:{
                                                                                "visit":{
                                                                                    type:"poptip",
                                                                                    url: "/statistic/visitordetail",
                                                                                    params: {
                                                                                        "site_id":site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : '{keys}',
                                                                                        out: 'html'
                                                                                    },
                                                                                    width:850,
                                                                                    height:460,
                                                                                    title:LANG("{region_name} 的访客列表"),
                                                                                    boxType:"center"
                                                                                },
                                                                                "linkage":{
                                                                                    target:"theList_referer_url_chart",
                                                                                    type:"poptip",
                                                                                    params:{
                                                                                        type: "geo",
                                                                                        site_id: site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : "{keys}"
                                                                                    },
                                                                                    title:LANG("{region_name} 趋势图"),
                                                                                    width:800,
                                                                                    boxType:"center",
                                                                                    height:300
                                                                                }
                                                                            },
                                                                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                                        },
                                                                        {data:"pageviews"},
                                                                        {data:"sessions"},
                                                                        {data:"visitors"},
                                                                        {data:"new_visitors"},
                                                                        {data:"avg_staytime"},
                                                                        {data:"avg_loadtime"},
                                                                        {data:"avg_pagepixels"},
                                                                        {data:"bounce_rate"},
                                                                        {data:"active_visitors"}
                                                                    ],
                                                                    target: mAttributes.dom.find("div:first"),
                                                                    ExportExcel: true,
                                                                    icon: {
                                                                        col: 1,
                                                                        pos: 0,
                                                                        type:"geo",
                                                                        name:"country_icon",
                                                                        title:"country_name"
                                                                    }
                                                                }
                                                            };
                                                            Clicki.manager.add(set);
                                                            set = null;
                                                        }
                                                    },
                                                    {
                                                        text:LANG("城市"),
                                                        scope:true,
                                                        html:'<div class="theList_city"></div>',
                                                        afterRender:function(mAttributes){
                                                            var set = {groups:{}};
                                                            set.groups["theList_city"+this.parent.target] = {
                                                                type:"grid",
                                                                setting:{
                                                                    router: {
                                                                        model: "feed",
                                                                        defaultAction: "group",
                                                                        type: null
                                                                    },
                                                                    params: {
                                                                        type: "city",
                                                                        order: "pageviews|-1",
                                                                        site_id: site_id,
                                                                        begindate:Clicki.manager.getDate().beginDate,
                                                                        enddate:Clicki.manager.getDate().endDate,
                                                                        condition : this.parent.params.condition
                                                                    },
                                                                    colModel:[
                                                                        {
                                                                            data:"city_name",
                                                                            width:"150px",
                                                                            compare:false,
                                                                            render:function(key,i,row){
                                                                                var client = this._getCollection().getModelDataAt(row).x_axis;
                                                                                return client.region_name + " " + client.city_name ;
                                                                            }
                                                                        },
                                                                        {
                                                                            data:null,
                                                                            xModule:{
                                                                                "visit":{
                                                                                    type:"poptip",
                                                                                    url: "/statistic/visitordetail",
                                                                                    params: {
                                                                                        "site_id":site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : '{keys}',
                                                                                        out: 'html'
                                                                                    },
                                                                                    width:850,
                                                                                    height:460,
                                                                                    title:LANG("{city_name} 的访客列表"),
                                                                                    boxType:"center"
                                                                                },
                                                                                "linkage":{
                                                                                    target:"theList_referer_url_chart",
                                                                                    type:"poptip",
                                                                                    params:{
                                                                                        type: "city",
                                                                                        site_id: site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : "{keys}"
                                                                                    },
                                                                                    title:LANG("{city_name} 趋势图"),
                                                                                    width:800,
                                                                                    boxType:"center",
                                                                                    height:300
                                                                                }
                                                                            },
                                                                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                                        },
                                                                        {data:"pageviews"},
                                                                        {data:"sessions"},
                                                                        {data:"visitors"},
                                                                        {data:"new_visitors"},
                                                                        {data:"avg_staytime"},
                                                                        {data:"avg_loadtime"},
                                                                        {data:"avg_pagepixels"},
                                                                        {data:"bounce_rate"},
                                                                        {data:"active_visitors"}
                                                                    ],
                                                                    target: mAttributes.dom.find("div:first"),
                                                                    ExportExcel: true
                                                                }
                                                            };
                                                            Clicki.manager.add(set);
                                                            set = null;
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        target:mAttributes.dom.find("div:first"),
                                        ExportExcel: true
                                    }
                                }
                                Clicki.manager.add(set);
                                set = null;
                            }
                        }
                    ]
                },
                /*搜索引擎*/
                "se":{
                    xtype:"tabpanel",
                    subTitle:LANG("搜索引擎与关键词"),
                    params:{},
                    addParams:{
                        condition:'{keys}'
                    },
                    items:[
                        {
                            "text":LANG("搜索引擎"),
                            scope:true,
                            html:'<div class="theList_se"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                var _name = "theList_se"+this.parent.target;
                                set.groups[_name] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "se",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition:this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"se_name"/*,width:"80px"*/},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id,
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html',
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{se_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "se",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{se_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        sub: {
                                            "def":{
                                                xtype: "grid",
                                                subTitle:LANG("关键词"),
                                                params: {
                                                    site_id: site_id,
                                                    type: "keyword",
                                                    order: "pageviews|-1",
                                                    limit: 10
                                                },
                                                addParams: {
                                                    begindate: function(){return Clicki.manager.getDate().beginDate},
                                                    enddate: function(){return Clicki.manager.getDate().endDate},
                                                    "condition": "{keys}"
                                                },
                                                colModel:[
                                                    {data:"keyword_name",width:"25%",render:function(key,i,row){
                                                        var _se = {
                                                            "10000":"http://www.baidu.com/s?wd=",
                                                            "10002":"https://www.google.com/search?q=",
                                                            "10003":"http://www.sogou.com/web?query=",
                                                            "10004":"http://www.soso.com/q?w=",
                                                            "10001":"http://cn.bing.com/search?q=",
                                                            "10005":"http://www.youdao.com/search?q="
                                                        };
                                                        var seName = this._getCollection().getParams().condition.split("|")[1];
                                                        var _key = encodeURIComponent(key);
                                                        return '<a href="'+(_se[seName]+_key)+'" target="_blank">'+key+'</a>';
                                                    }},
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                height:460,
                                                                title:LANG("{keyword_name} 的访客列表"),
                                                                width:850,
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "keyword",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{keyword_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访问明细")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"bounce_rate"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"}
                                                ],
                                                showPage: true,
                                                alwaysRefresh: true,
                                                ExportExcel: true
                                            },
                                            "geo":{
                                                xtype:"tabpanel",
                                                subTitle:LANG("访客地区"),
                                                params:{},
                                                addParams: {
                                                    condition : '{keys}'
                                                },
                                                items:[
                                                    {
                                                        text:LANG("省份"),
                                                        scope:true,
                                                        html:'<div class="theList_region"></div>',
                                                        afterRender:function(mAttributes){
                                                            var set = {groups:{}};
                                                            set.groups["theList_region"+this.parent.target] = {
                                                                type:"grid",
                                                                setting:{
                                                                    router: {
                                                                        model: "feed",
                                                                        defaultAction: "group",
                                                                        type: null
                                                                    },
                                                                    params: {
                                                                        type: "geo",
                                                                        order: "sessions|-1",
                                                                        site_id: site_id,
                                                                        begindate:Clicki.manager.getDate().beginDate,
                                                                        enddate:Clicki.manager.getDate().endDate,
                                                                        condition : this.parent.params.condition
                                                                    },
                                                                    colModel:[
                                                                        {data:"region_name",width:"150px",compare:false},
                                                                        {
                                                                            data:null,
                                                                            xModule:{
                                                                                "visit":{
                                                                                    type:"poptip",
                                                                                    url: "/statistic/visitordetail",
                                                                                    params: {
                                                                                        "site_id":site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : '{keys}',
                                                                                        out: 'html'
                                                                                    },
                                                                                    width:850,
                                                                                    height:460,
                                                                                    title:LANG("{region_name} 的访客列表"),
                                                                                    boxType:"center"
                                                                                },
                                                                                "linkage":{
                                                                                    target:"theList_digg_chart",
                                                                                    type:"poptip",
                                                                                    params:{
                                                                                        type: "geo",
                                                                                        site_id: site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : "{keys}"
                                                                                    },
                                                                                    title:LANG("{region_name} 趋势图"),
                                                                                    width:800,
                                                                                    boxType:"center",
                                                                                    height:300
                                                                                }
                                                                            },
                                                                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                                        },
                                                                        {data:"pageviews"},
                                                                        {data:"sessions"},
                                                                        {data:"visitors"},
                                                                        {data:"new_visitors"},
                                                                        {data:"avg_staytime"},
                                                                        {data:"avg_loadtime"},
                                                                        {data:"avg_pagepixels"},
                                                                        {data:"bounce_rate"},
                                                                        {data:"active_visitors"}
                                                                    ],
                                                                    target: mAttributes.dom.find("div:first"),
                                                                    ExportExcel: true,
                                                                    icon: {
                                                                        col: 1,
                                                                        pos: 0,
                                                                        type:"geo",
                                                                        name:"country_icon",
                                                                        title:"country_name"
                                                                    }
                                                                }
                                                            };
                                                            Clicki.manager.add(set);
                                                            set = null;
                                                        }
                                                    },
                                                    {
                                                        text:LANG("城市"),
                                                        scope:true,
                                                        html:'<div class="theList_city"></div>',
                                                        afterRender:function(mAttributes){
                                                            var set = {groups:{}};
                                                            set.groups["theList_city"+this.parent.target] = {
                                                                type:"grid",
                                                                setting:{
                                                                    router: {
                                                                        model: "feed",
                                                                        defaultAction: "group",
                                                                        type: null
                                                                    },
                                                                    params: {
                                                                        type: "city",
                                                                        order: "sessions|-1",
                                                                        site_id: site_id,
                                                                        begindate:Clicki.manager.getDate().beginDate,
                                                                        enddate:Clicki.manager.getDate().endDate,
                                                                        condition : this.parent.params.condition
                                                                    },
                                                                    colModel:[
                                                                        {
                                                                            data:"city_name",
                                                                            width:"150px",
                                                                            compare:false,
                                                                            render:function(key,i,row){
                                                                                var client = this._getCollection().getModelDataAt(row).x_axis;
                                                                                return client.region_name + " " + client.city_name ;
                                                                            }
                                                                        },
                                                                        {
                                                                            data:null,
                                                                            xModule:{
                                                                                "visit":{
                                                                                    type:"poptip",
                                                                                    url: "/statistic/visitordetail",
                                                                                    params: {
                                                                                        "site_id":site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : '{keys}',
                                                                                        out: 'html'
                                                                                    },
                                                                                    width:850,
                                                                                    height:460,
                                                                                    title:LANG("{city_name} 的访客列表"),
                                                                                    boxType:"center"
                                                                                },
                                                                                "linkage":{
                                                                                    target:"theList_digg_chart",
                                                                                    type:"poptip",
                                                                                    params:{
                                                                                        type: "city",
                                                                                        site_id: site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : "{keys}"
                                                                                    },
                                                                                    title:LANG("{city_name} 趋势图"),
                                                                                    width:800,
                                                                                    boxType:"center",
                                                                                    height:300
                                                                                }
                                                                            },
                                                                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                                        },
                                                                        {data:"pageviews"},
                                                                        {data:"sessions"},
                                                                        {data:"visitors"},
                                                                        {data:"new_visitors"},
                                                                        {data:"avg_staytime"},
                                                                        {data:"avg_loadtime"},
                                                                        {data:"avg_pagepixels"},
                                                                        {data:"bounce_rate"},
                                                                        {data:"active_visitors"}
                                                                    ],
                                                                    target: mAttributes.dom.find("div:first"),
                                                                    ExportExcel: true
                                                                }
                                                            };
                                                            Clicki.manager.add(set);
                                                            set = null;
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        ExportExcel: true,
                                        icon: {
                                            col: 1,
                                            pos: 0,
                                            type:"se",
                                            name:"se_icon"
                                        },
                                        target:mAttributes.dom.find("div:first")
                                    }
                                }
                                Clicki.manager.add(set);
                                set = null;
                            }
                        },
                        {
                            "text":LANG("关键词"),
                            scope:true,
                            html:'<div class="theList_keyword"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                var _name = "theList_keyword_list"+this.parent.target;
                                set.groups[_name] = {
                                    type:"grid",
                                    setting:{
                                        router: {model: "feed", defaultAction: "group", type: null},
                                        params : {
                                            type: "keyword",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate
                                        },
                                        colModel:[
                                            {
                                                compare:false,
                                                //tpl:"<%= key %>",
                                                data:"keyword_name",
                                                width:"120px"
                                            },
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        height:460,
                                                        title:LANG("{keyword_name} 的访客列表"),
                                                        width:850,
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_keyword_list_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "keyword",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{keyword_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访问明细")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        sub:{
                                            "def":{
                                                xtype:"grid",
                                                subTitle:LANG("搜索引擎"),
                                                params : {
                                                    site_id: site_id,
                                                    type: "se",
                                                    order: "pageviews|-1",
                                                    limit: 10
                                                },
                                                addParams: {
                                                    begindate: function(){return Clicki.manager.getDate().beginDate},
                                                    enddate: function(){return Clicki.manager.getDate().endDate},
                                                    "condition" : "{keys}",
                                                    "dims":"keyword_name"
                                                },
                                                /*表格列宽设置*/
                                                colModel:[
                                                    {data:"se_name",width:"110px",render:function(key,i,row){
                                                        var _se = {
                                                            "baidu":"http://www.baidu.com/s?wd=",
                                                            "google":"https://www.google.com/search?q=",
                                                            "sogou":"http://www.sogou.com/web?query=",
                                                            "soso":"http://www.soso.com/q?w=",
                                                            "bing":"http://cn.bing.com/search?q=",
                                                            "youdao":"http://www.youdao.com/search?q="
                                                        };
                                                        var se = this._getCollection().getModelDataAt(row).x_axis;

                                                        return '<a href="'+(_se[se.se_name]+se.keyword_name)+'" target="_blank">'+key+'</a>';
                                                    }},
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html',
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{se_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_keyword_list_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "se",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{se_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"}
                                                ],
                                                icon: {
                                                    col: 1,
                                                    pos: 0,
                                                    type:"se",
                                                    name:"se_icon"
                                                },
                                                showPage:true,
                                                alwaysRefresh:true,
                                                ExportExcel: true
                                            },
                                            "geo":{
                                                xtype:"tabpanel",
                                                subTitle:LANG("访客地区"),
                                                params:{},
                                                addParams: {
                                                    condition : '{keys}'
                                                },
                                                items:[
                                                    {
                                                        text:LANG("省份"),
                                                        scope:true,
                                                        html:'<div class="theList_region"></div>',
                                                        afterRender:function(mAttributes){
                                                            var set = {groups:{}};
                                                            set.groups["theList_region"+this.parent.target] = {
                                                                type:"grid",
                                                                setting:{
                                                                    router: {
                                                                        model: "feed",
                                                                        defaultAction: "group",
                                                                        type: null
                                                                    },
                                                                    params: {
                                                                        type: "geo",
                                                                        order: "pageviews|-1",
                                                                        site_id: site_id,
                                                                        begindate:Clicki.manager.getDate().beginDate,
                                                                        enddate:Clicki.manager.getDate().endDate,
                                                                        condition : this.parent.params.condition
                                                                    },
                                                                    colModel:[
                                                                        {data:"region_name",width:"150px",compare:false},
                                                                        {
                                                                            data:null,
                                                                            xModule:{
                                                                                "visit":{
                                                                                    type:"poptip",
                                                                                    url: "/statistic/visitordetail",
                                                                                    params: {
                                                                                        "site_id":site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : '{keys}',
                                                                                        out: 'html'
                                                                                    },
                                                                                    width:850,
                                                                                    height:460,
                                                                                    title:LANG("{region_name} 的访客列表"),
                                                                                    boxType:"center"
                                                                                },
                                                                                "linkage":{
                                                                                    target:"theList_keyword_list_chart",
                                                                                    type:"poptip",
                                                                                    params:{
                                                                                        type: "geo",
                                                                                        site_id: site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : "{keys}"
                                                                                    },
                                                                                    title:LANG("{region_name} 趋势图"),
                                                                                    width:800,
                                                                                    boxType:"center",
                                                                                    height:300
                                                                                }
                                                                            },
                                                                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                                        },
                                                                        {data:"pageviews"},
                                                                        {data:"sessions"},
                                                                        {data:"visitors"},
                                                                        {data:"new_visitors"},
                                                                        {data:"avg_staytime"},
                                                                        {data:"avg_loadtime"},
                                                                        {data:"avg_pagepixels"},
                                                                        {data:"bounce_rate"},
                                                                        {data:"active_visitors"}
                                                                    ],
                                                                    target: mAttributes.dom.find("div:first"),
                                                                    ExportExcel: true,
                                                                    icon: {
                                                                        col: 1,
                                                                        pos: 0,
                                                                        type:"geo",
                                                                        name:"country_icon",
                                                                        title:"country_name"
                                                                    }
                                                                }
                                                            };
                                                            Clicki.manager.add(set);
                                                            set = null;                           
                                                        }
                                                    },
                                                    {
                                                        text:LANG("城市"),
                                                        scope:true,
                                                        html:'<div class="theList_city"></div>',
                                                        afterRender:function(mAttributes){
                                                            var set = {groups:{}};
                                                            set.groups["theList_city"+this.parent.target] = {
                                                                type:"grid",
                                                                setting:{
                                                                    router: {
                                                                        model: "feed",
                                                                        defaultAction: "group",
                                                                        type: null
                                                                    },
                                                                    params: {
                                                                        type: "city",
                                                                        order: "pageviews|-1",
                                                                        site_id: site_id,
                                                                        begindate:Clicki.manager.getDate().beginDate,
                                                                        enddate:Clicki.manager.getDate().endDate,
                                                                        condition : this.parent.params.condition
                                                                    },
                                                                    colModel:[
                                                                        {
                                                                            data:"city_name",
                                                                            width:"150px",
                                                                            compare:false,
                                                                            render:function(key,i,row){
                                                                                var client = this._getCollection().getModelDataAt(row).x_axis;
                                                                                return client.region_name + " " + client.city_name ;
                                                                            }
                                                                        },
                                                                        {
                                                                            data:null,
                                                                            xModule:{
                                                                                "visit":{
                                                                                    type:"poptip",
                                                                                    url: "/statistic/visitordetail",
                                                                                    params: {
                                                                                        "site_id":site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : '{keys}',
                                                                                        out: 'html'
                                                                                    },
                                                                                    width:850,
                                                                                    height:460,
                                                                                    title:LANG("{city_name} 的访客列表"),
                                                                                    boxType:"center"
                                                                                },
                                                                                "linkage":{
                                                                                    target:"theList_keyword_list_chart",
                                                                                    type:"poptip",
                                                                                    params:{
                                                                                        type: "city",
                                                                                        site_id: site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : "{keys}"
                                                                                    },
                                                                                    title:LANG("{city_name} 趋势图"),
                                                                                    width:800,
                                                                                    boxType:"center",
                                                                                    height:300
                                                                                }
                                                                            },
                                                                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                                        },
                                                                        {data:"pageviews"},
                                                                        {data:"sessions"},
                                                                        {data:"visitors"},
                                                                        {data:"new_visitors"},
                                                                        {data:"avg_staytime"},
                                                                        {data:"avg_loadtime"},
                                                                        {data:"avg_pagepixels"},
                                                                        {data:"bounce_rate"},
                                                                        {data:"active_visitors"}
                                                                    ],
                                                                    target: mAttributes.dom.find("div:first"),
                                                                    ExportExcel: true
                                                                }
                                                            };
                                                            Clicki.manager.add(set);
                                                            set = null;
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        ExportExcel: true,
                                        target:mAttributes.dom.find("div:first"),
                                        showTotal:true
                                    }
                                }
                                Clicki.manager.add(set);
                                set = null;
                            }
                        }
                    ]
                },
                /*广告*/
                "spot":{
                    xtype:"tabpanel",
                    subTitle:LANG("广告"),
                    params:{},
                    addParams:{
                        condition:'{keys}'
                    },
                    items:[
                        {
                            "text":LANG("广告"),
                            scope:true,
                            html:'<div class="theList_utm_spot"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                var _name = "theList_utm_spot"+this.parent.target;
                                set.groups[_name] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type:"utm_spot",
                                            order:"pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition:this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"utm_spot_position"},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{utm_spot_position} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        type:"poptip",
                                                        target:"theList_digg_chart",
                                                        params:{
                                                            type: "utm_spot",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{utm_spot_position} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                compare:false,
                                                width:30,
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"utm_spot_channel"},
                                            {data:"utm_spot_website"},
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        sub: {
                                            "page":{
                                                xtype: "grid",
                                                subTitle:LANG("页面"),
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    site_id: site_id,
                                                    type: "page_url",
                                                    order: "pageviews|-1",
                                                    limit: 10
                                                },
                                                addParams: {
                                                    begindate: function(){return Clicki.manager.getDate().beginDate},
                                                    enddate: function(){return Clicki.manager.getDate().endDate},
                                                    "condition": "{keys}"
                                                },
                                                colModel:[
                                                    {data:"page_url_name",
                                                        render:function(key,i,row){
                                                            var page = this._getCollection().getModelDataAt(row).x_axis;
                                                            var title = page.page_url_title;
                                                            if(page.page_url_title){
                                                                title = (page.page_url_title.length > 30) && (page.page_url_title.substr(0,30)+"...") || page.page_url_title;
                                                            }
                                                            else{
                                                                title = key;
                                                            }
                                                            return '<span title="' + page.page_url_title + '">' + title + '</span><br /><a title="' + page.page_url_name + '" href="' + page.page_url_name + '" target="_blank">' + key + '</a>';
                                                        }
                                                    },
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "linkage":{
                                                                target:"theList_page_url_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "page_url",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{page_url_title} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        render:function(key,i,row){

                                                            var _collection = this._getCollection();

                                                            var url = _collection.getAllColDatas()[row][0];

                                                            url += "#/clicki/heatmap";

                                                            var _str = "<span class=\"theCtrlListR\">"+key+"<a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a><a href=\""+url+"\" title=\""+LANG("热图")+"\" target=\"_blank\" class=\"heatmapIcon\">"+LANG("热图")+"</a></span>";

                                                            return _str;
                                                        }
                                                    },
                                                    {data:"pageviews",sort:true},
                                                    {data:"entrances",sort:true},
                                                    {data:"exits",sort:true},
                                                    {data:"click",sort:true},
                                                    {data:"input",sort:true},
                                                    {data:"avg_staytime",sort:true},
                                                    {data:"avg_loadtime",sort:true}
                                                ],
                                                ellipsis:45,
                                                showPage: true,
                                                ExportExcel: true,
                                                alwaysRefresh: true
                                            },
                                            "keyword":{
                                                xtype: "grid",
                                                subTitle:LANG("关键词"),
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    site_id: site_id,
                                                    type: "utm_keyword",
                                                    order: "pageviews|-1",
                                                    limit: 10
                                                },
                                                addParams: {
                                                    begindate: function(){return Clicki.manager.getDate().beginDate},
                                                    enddate: function(){return Clicki.manager.getDate().endDate},
                                                    "condition": "{keys}"
                                                },
                                                colModel:[
                                                    {data:"utm_keyword_name"},
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id,
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html',
                                                                },
                                                                height:460,
                                                                width:850,
                                                                title:LANG("{utm_keyword_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                type:"poptip",
                                                                target:"theList_digg_chart",
                                                                params:{
                                                                    type: "utm_keyword",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{utm_keyword_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        compare:false,
                                                        tpl:"<span class=\"theCtrlListR\"><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"sessions",sort:true},
                                                    {data:"pageviews",sort:true},
                                                    {data:"visitors",sort:true},
                                                    {data:"bounce_rate",sort:true},
                                                    {data:"reserve0",sort:true},
                                                    {data:"reserve1",sort:true},
                                                    {data:"reserve2",sort:true},
                                                    {data:"reserve3",sort:true}
                                                ],
                                                showPage: true,
                                                ExportExcel: true,
                                                alwaysRefresh: true
                                            },
                                            "geo":{
                                                xtype:"tabpanel",
                                                subTitle:LANG("访客地区"),
                                                params:{},
                                                addParams: {
                                                    condition : '{keys}'
                                                },
                                                items:[
                                                    {
                                                        text:LANG("省份"),
                                                        scope:true,
                                                        html:'<div class="theList_region"></div>',
                                                        afterRender:function(mAttributes){
                                                            var set = {groups:{}};
                                                            set.groups["theList_region"+this.parent.target] = {
                                                                type:"grid",
                                                                setting:{
                                                                    router: {
                                                                        model: "feed",
                                                                        defaultAction: "group",
                                                                        type: null
                                                                    },
                                                                    params: {
                                                                        type: "geo",
                                                                        order: "pageviews|-1",
                                                                        site_id: site_id,
                                                                        begindate:Clicki.manager.getDate().beginDate,
                                                                        enddate:Clicki.manager.getDate().endDate,
                                                                        condition : this.parent.params.condition
                                                                    },
                                                                    colModel:[
                                                                        {data:"region_name",width:"150px",compare:false},
                                                                        {
                                                                            data:null,
                                                                            xModule:{
                                                                                "visit":{
                                                                                    type:"poptip",
                                                                                    url: "/statistic/visitordetail",
                                                                                    params: {
                                                                                        "site_id":site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : '{keys}',
                                                                                        out: 'html'
                                                                                    },
                                                                                    width:850,
                                                                                    height:460,
                                                                                    title:LANG("{region_name} 的访客列表"),
                                                                                    boxType:"center"
                                                                                },
                                                                                "linkage":{
                                                                                    target:"theList_digg_chart",
                                                                                    type:"poptip",
                                                                                    params:{
                                                                                        type: "geo",
                                                                                        site_id: site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : "{keys}"
                                                                                    },
                                                                                    title:LANG("{region_name} 趋势图"),
                                                                                    width:800,
                                                                                    boxType:"center",
                                                                                    height:300
                                                                                }
                                                                            },
                                                                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                                        },
                                                                        {data:"pageviews"},
                                                                        {data:"sessions"},
                                                                        {data:"visitors"},
                                                                        {data:"new_visitors"},
                                                                        {data:"avg_staytime"},
                                                                        {data:"avg_loadtime"},
                                                                        {data:"avg_pagepixels"},
                                                                        {data:"bounce_rate"},
                                                                        {data:"active_visitors"}
                                                                    ],
                                                                    target: mAttributes.dom.find("div:first"),
                                                                    ExportExcel: true,
                                                                    icon: {
                                                                        col: 1,
                                                                        pos: 0,
                                                                        type:"geo",
                                                                        name:"country_icon",
                                                                        title:"country_name"
                                                                    }
                                                                }
                                                            };
                                                            Clicki.manager.add(set);
                                                            set = null;
                                                        }
                                                    },
                                                    {
                                                        text:LANG("城市"),
                                                        scope:true,
                                                        html:'<div class="theList_city"></div>',
                                                        afterRender:function(mAttributes){
                                                            var set = {groups:{}};
                                                            set.groups["theList_city"+this.parent.target] = {
                                                                type:"grid",
                                                                setting:{
                                                                    router: {
                                                                        model: "feed",
                                                                        defaultAction: "group",
                                                                        type: null
                                                                    },
                                                                    params: {
                                                                        type: "city",
                                                                        order: "pageviews|-1",
                                                                        site_id: site_id,
                                                                        begindate:Clicki.manager.getDate().beginDate,
                                                                        enddate:Clicki.manager.getDate().endDate,
                                                                        condition : this.parent.params.condition
                                                                    },
                                                                    colModel:[
                                                                        {
                                                                            data:"city_name",
                                                                            width:"150px",
                                                                            compare:false,
                                                                            render:function(key,i,row){
                                                                                var client = this._getCollection().getModelDataAt(row).x_axis;
                                                                                return client.region_name + " " + client.city_name ;
                                                                            }
                                                                        },
                                                                        {
                                                                            data:null,
                                                                            xModule:{
                                                                                "visit":{
                                                                                    type:"poptip",
                                                                                    url: "/statistic/visitordetail",
                                                                                    params: {
                                                                                        "site_id":site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : '{keys}',
                                                                                        out: 'html'
                                                                                    },
                                                                                    width:850,
                                                                                    height:460,
                                                                                    title:LANG("{city_name} 的访客列表"),
                                                                                    boxType:"center"
                                                                                },
                                                                                "linkage":{
                                                                                    target:"theList_digg_chart",
                                                                                    type:"poptip",
                                                                                    params:{
                                                                                        type: "city",
                                                                                        site_id: site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : "{keys}"
                                                                                    },
                                                                                    title:LANG("{city_name} 趋势图"),
                                                                                    width:800,
                                                                                    boxType:"center",
                                                                                    height:300
                                                                                }
                                                                            },
                                                                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                                        },
                                                                        {data:"pageviews"},
                                                                        {data:"sessions"},
                                                                        {data:"visitors"},
                                                                        {data:"new_visitors"},
                                                                        {data:"avg_staytime"},
                                                                        {data:"avg_loadtime"},
                                                                        {data:"avg_pagepixels"},
                                                                        {data:"bounce_rate"},
                                                                        {data:"active_visitors"}
                                                                    ],
                                                                    target: mAttributes.dom.find("div:first"),
                                                                    ExportExcel: true
                                                                }
                                                            };
                                                            Clicki.manager.add(set);
                                                            set = null;
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        target:mAttributes.dom.find("div:first")
                                    }
                                }
                                Clicki.manager.add(set);
                                set = null;
                            }
                        },
                        {
                            "text":LANG("广告活动"),
                            scope:true,
                            html:'<div class="theList_utm_campaign"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                var _name = "theList_utm_campaign"+this.parent.target;
                                set.groups[_name] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "utm_campaign",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition:this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"utm_campaign_name",sort:true},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{utm_campaign_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        type:"poptip",
                                                        target:"theList_digg_chart",
                                                        params:{
                                                            type: "utm_spot",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{utm_campaign_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                compare:false,
                                                sort:false,
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        sub: {
                                            "spot":{
                                                xtype: "grid",
                                                subTitle:LANG("广告"),
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    site_id: site_id,
                                                    type: "utm_spot",
                                                    order: "pageviews|-1",
                                                    limit: 10
                                                },
                                                addParams: {
                                                    begindate: function(){return Clicki.manager.getDate().beginDate},
                                                    enddate: function(){return Clicki.manager.getDate().endDate},
                                                    "condition": "{keys}"
                                                },
                                                colModel:[
                                                    {data:"utm_spot_position",sort:true},
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{utm_spot_position} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                type:"poptip",
                                                                target:"theList_digg_chart",
                                                                params:{
                                                                    type: "utm_spot",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{utm_spot_position} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        compare:false,
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"utm_spot_channel", sort:true},
                                                    {data:"utm_spot_website", sort:true},
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"bounce_rate"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"}
                                                ],
                                                sub: {
                                                    "page":{
                                                        xtype: "grid",
                                                        subTitle:LANG("页面"),
                                                        router: {
                                                            model: "feed",
                                                            defaultAction: "group",
                                                            type: null
                                                        },
                                                        params: {
                                                            site_id: site_id,
                                                            type: "page_url",
                                                            order: "pageviews|-1",
                                                            limit: 10
                                                        },
                                                        addParams: {
                                                            begindate: function(){return Clicki.manager.getDate().beginDate},
                                                            enddate: function(){return Clicki.manager.getDate().endDate},
                                                            "condition": "{keys}"
                                                        },
                                                        colModel:[
                                                            {data:"page_url_name",
                                                                render:function(key,i,row){
                                                                    var page = this._getCollection().getModelDataAt(row).x_axis;
                                                                    var title = page.page_url_title;
                                                                    if(page.page_url_title){
                                                                        title = (page.page_url_title.length > 30) && (page.page_url_title.substr(0,30)+"...") || page.page_url_title;
                                                                    }
                                                                    else{
                                                                        title = key;
                                                                    }
                                                                    return '<span title="' + page.page_url_title + '">' + title + '</span><br /><a title="' + page.page_url_name + '" href="' + page.page_url_name + '" target="_blank">' + key + '</a>';
                                                                }
                                                            },
                                                            {
                                                                data:null,
                                                                xModule:{
                                                                    "linkage":{
                                                                        target:"theList_page_url_chart",
                                                                        type:"poptip",
                                                                        params:{
                                                                            type: "page_url",
                                                                            site_id: site_id
                                                                        },
                                                                        addParams: {
                                                                            condition : "{keys}"
                                                                        },
                                                                        title:LANG("{page_url_title} 趋势图"),
                                                                        width:800,
                                                                        boxType:"center",
                                                                        height:300
                                                                    }
                                                                },
                                                                render:function(key,i,row){

                                                                    var _collection = this._getCollection();

                                                                    var url = _collection.getAllColDatas()[row][0];

                                                                    url += "#/clicki/heatmap";

                                                                    var _str = "<span class=\"theCtrlListR\">"+key+"<a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a><a href=\""+url+"\" title=\""+LANG("热图")+"\" target=\"_blank\" class=\"heatmapIcon\">"+LANG("热图")+"</a></span>";

                                                                    return _str;
                                                                }
                                                            },
                                                            {data:"pageviews",sort:true},
                                                            {data:"click",sort:true},
                                                            {data:"input",sort:true},
                                                            {data:"avg_staytime",sort:true},
                                                            {data:"avg_loadtime",sort:true}
                                                        ],
                                                        ellipsis:45,
                                                        showPage: true,
                                                        ExportExcel: true,
                                                        alwaysRefresh: true
                                                    },
                                                    "keyword":{
                                                        xtype: "grid",
                                                        subTitle:LANG("关键词"),
                                                        router: {
                                                            model: "feed",
                                                            defaultAction: "group",
                                                            type: null
                                                        },
                                                        params: {
                                                            site_id: site_id,
                                                            type: "utm_keyword",
                                                            order: "pageviews|-1",
                                                            limit: 10
                                                        },
                                                        addParams: {
                                                            begindate: function(){return Clicki.manager.getDate().beginDate},
                                                            enddate: function(){return Clicki.manager.getDate().endDate},
                                                            "condition": "{keys}"
                                                        },
                                                        colModel:[
                                                            {data:"utm_keyword_name"},
                                                            {
                                                                data:null,
                                                                xModule:{
                                                                    "visit":{
                                                                        type:"poptip",
                                                                        url: "/statistic/visitordetail",
                                                                        params: {
                                                                            "site_id":site_id
                                                                        },
                                                                        addParams: {
                                                                            condition : '{keys}',
                                                                            out: 'html'
                                                                        },
                                                                        width:850,
                                                                        height:460,
                                                                        title:LANG("{utm_keyword_name} 的访客列表"),
                                                                        boxType:"center"
                                                                    },
                                                                    "linkage":{
                                                                        type:"poptip",
                                                                        target:"theList_digg_chart",
                                                                        params:{
                                                                            type: "utm_keyword",
                                                                            site_id: site_id
                                                                        },
                                                                        addParams: {
                                                                            condition : "{keys}"
                                                                        },
                                                                        title:LANG("{utm_keyword_name} 趋势图"),
                                                                        width:800,
                                                                        boxType:"center",
                                                                        height:300
                                                                    }
                                                                },
                                                                compare:false,
                                                                tpl:"<span class=\"theCtrlListR\"><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                            },
                                                            {data:"sessions",sort:true},
                                                            {data:"pageviews",sort:true},
                                                            {data:"visitors",sort:true},
                                                            {data:"reserve0",sort:true},
                                                            {data:"reserve1",sort:true},
                                                            {data:"reserve2",sort:true},
                                                            {data:"reserve3",sort:true}
                                                        ],
                                                        showPage: true,
                                                        ExportExcel: true,
                                                        alwaysRefresh: true
                                                    },
                                                    "geo":{
                                                        xtype:"tabpanel",
                                                        subTitle:LANG("访客地区"),
                                                        params:{},
                                                        addParams: {
                                                            condition : '{keys}'
                                                        },
                                                        items:[
                                                            {
                                                                text:LANG("省份"),
                                                                scope:true,
                                                                html:'<div class="theList_region"></div>',
                                                                afterRender:function(mAttributes){
                                                                    var set = {groups:{}};
                                                                    set.groups["theList_region"+this.parent.target] = {
                                                                        type:"grid",
                                                                        setting:{
                                                                            router: {
                                                                                model: "feed",
                                                                                defaultAction: "group",
                                                                                type: null
                                                                            },
                                                                            params: {
                                                                                type: "geo",
                                                                                order: "pageviews|-1",
                                                                                site_id: site_id,
                                                                                begindate:Clicki.manager.getDate().beginDate,
                                                                                enddate:Clicki.manager.getDate().endDate,
                                                                                condition : this.parent.params.condition
                                                                            },
                                                                            colModel:[
                                                                                {data:"region_name",width:"150px",compare:false},
                                                                                {
                                                                                    data:null,
                                                                                    xModule:{
                                                                                        "visit":{
                                                                                            type:"poptip",
                                                                                            url: "/statistic/visitordetail",
                                                                                            params: {
                                                                                                "site_id":site_id
                                                                                            },
                                                                                            addParams: {
                                                                                                condition : '{keys}',
                                                                                                out: 'html'
                                                                                            },
                                                                                            width:850,
                                                                                            height:460,
                                                                                            title:LANG("{region_name} 的访客列表"),
                                                                                            boxType:"center"
                                                                                        },
                                                                                        "linkage":{
                                                                                            target:"theList_digg_chart",
                                                                                            type:"poptip",
                                                                                            params:{
                                                                                                type: "geo",
                                                                                                site_id: site_id
                                                                                            },
                                                                                            addParams: {
                                                                                                condition : "{keys}"
                                                                                            },
                                                                                            title:LANG("{region_name} 趋势图"),
                                                                                            width:800,
                                                                                            boxType:"center",
                                                                                            height:300
                                                                                        }
                                                                                    },
                                                                                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                                                },
                                                                                {data:"pageviews"},
                                                                                {data:"sessions"},
                                                                                {data:"visitors"},
                                                                                {data:"new_visitors"},
                                                                                {data:"avg_staytime"},
                                                                                {data:"avg_loadtime"},
                                                                                {data:"avg_pagepixels"},
                                                                                {data:"bounce_rate"},
                                                                                {data:"active_visitors"}
                                                                            ],
                                                                            target: mAttributes.dom.find("div:first"),
                                                                            ExportExcel: true,
                                                                            icon: {
                                                                                col: 1,
                                                                                pos: 0,
                                                                                type:"geo",
                                                                                name:"country_icon",
                                                                                title:"country_name"
                                                                            }
                                                                        }
                                                                    };
                                                                    Clicki.manager.add(set);
                                                                    set = null;
                                                                }
                                                            },
                                                            {
                                                                text:LANG("城市"),
                                                                scope:true,
                                                                html:'<div class="theList_city"></div>',
                                                                afterRender:function(mAttributes){
                                                                    var set = {groups:{}};
                                                                    set.groups["theList_city"+this.parent.target] = {
                                                                        type:"grid",
                                                                        setting:{
                                                                            router: {
                                                                                model: "feed",
                                                                                defaultAction: "group",
                                                                                type: null
                                                                            },
                                                                            params: {
                                                                                type: "city",
                                                                                order: "pageviews|-1",
                                                                                site_id: site_id,
                                                                                begindate:Clicki.manager.getDate().beginDate,
                                                                                enddate:Clicki.manager.getDate().endDate,
                                                                                condition : this.parent.params.condition
                                                                            },
                                                                            colModel:[
                                                                                {
                                                                                    data:"city_name",
                                                                                    width:"150px",
                                                                                    compare:false,
                                                                                    render:function(key,i,row){
                                                                                        var client = this._getCollection().getModelDataAt(row).x_axis;
                                                                                        return client.region_name + " " + client.city_name ;
                                                                                    }
                                                                                },
                                                                                {
                                                                                    data:null,
                                                                                    xModule:{
                                                                                        "visit":{
                                                                                            type:"poptip",
                                                                                            url: "/statistic/visitordetail",
                                                                                            params: {
                                                                                                "site_id":site_id
                                                                                            },
                                                                                            addParams: {
                                                                                                condition : '{keys}',
                                                                                                out: 'html'
                                                                                            },
                                                                                            width:850,
                                                                                            height:460,
                                                                                            title:LANG("{city_name} 的访客列表"),
                                                                                            boxType:"center"
                                                                                        },
                                                                                        "linkage":{
                                                                                            target:"theList_digg_chart",
                                                                                            type:"poptip",
                                                                                            params:{
                                                                                                type: "city",
                                                                                                site_id: site_id
                                                                                            },
                                                                                            addParams: {
                                                                                                condition : "{keys}"
                                                                                            },
                                                                                            title:LANG("{city_name} 趋势图"),
                                                                                            width:800,
                                                                                            boxType:"center",
                                                                                            height:300
                                                                                        }
                                                                                    },
                                                                                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                                                },
                                                                                {data:"pageviews"},
                                                                                {data:"sessions"},
                                                                                {data:"visitors"},
                                                                                {data:"new_visitors"},
                                                                                {data:"avg_staytime"},
                                                                                {data:"avg_loadtime"},
                                                                                {data:"avg_pagepixels"},
                                                                                {data:"bounce_rate"},
                                                                                {data:"active_visitors"}
                                                                            ],
                                                                            target: mAttributes.dom.find("div:first"),
                                                                            ExportExcel: true
                                                                        }
                                                                    };
                                                                    Clicki.manager.add(set);
                                                                    set = null;
                                                                }
                                                            }
                                                        ]
                                                    }
                                                },
                                                showPage: true,
                                                ExportExcel: true,
                                                alwaysRefresh: true
                                            },
                                            "page":{
                                                xtype: "grid",
                                                subTitle:LANG("页面"),
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    site_id: site_id,
                                                    type: "page_url",
                                                    limit: 10
                                                },
                                                addParams: {
                                                    begindate: function(){return Clicki.manager.getDate().beginDate},
                                                    enddate: function(){return Clicki.manager.getDate().endDate},
                                                    "condition": "{keys}"
                                                },
                                                colModel:[
                                                    {data:"page_url_name",
                                                        render:function(key,i,row){
                                                            var page = this._getCollection().getModelDataAt(row).x_axis;
                                                            var title = page.page_url_title;
                                                            if(page.page_url_title){
                                                                title = (page.page_url_title.length > 30) && (page.page_url_title.substr(0,30)+"...") || page.page_url_title;
                                                            }
                                                            else{
                                                                title = key;
                                                            }
                                                            return '<span title="' + page.page_url_title + '">' + title + '</span><br /><a title="' + page.page_url_name + '" href="' + page.page_url_name + '" target="_blank">' + key + '</a>';
                                                        }
                                                    },
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "linkage":{
                                                                target:"theList_page_url_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "page_url",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{page_url_title} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        render:function(key,i,row){

                                                            var _collection = this._getCollection();

                                                            var url = _collection.getAllColDatas()[row][0];

                                                            url += "#/clicki/heatmap";

                                                            var _str = "<span class=\"theCtrlListR\">"+key+"<a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a><a href=\""+url+"\" title=\""+LANG("热图")+"\" target=\"_blank\" class=\"heatmapIcon\">"+LANG("热图")+"</a></span>";

                                                            return _str;
                                                        }
                                                    },
                                                    {data:"pageviews",sort:true},
                                                    {data:"entrances",sort:true},
                                                    {data:"exits",sort:true},
                                                    {data:"click",sort:true},
                                                    {data:"input",sort:true},
                                                    {data:"avg_staytime",sort:true},
                                                    {data:"avg_loadtime",sort:true}
                                                ],
                                                ellipsis:45,
                                                showPage: true,
                                                ExportExcel: true,
                                                alwaysRefresh: true
                                            },
                                            "geo":{
                                                xtype:"tabpanel",
                                                subTitle:LANG("访客地区"),
                                                params:{},
                                                addParams: {
                                                    condition : '{keys}'
                                                },
                                                items:[
                                                    {
                                                        text:LANG("省份"),
                                                        scope:true,
                                                        html:'<div class="theList_region"></div>',
                                                        afterRender:function(mAttributes){
                                                            var set = {groups:{}};
                                                            set.groups["theList_region"+this.parent.target] = {
                                                                type:"grid",
                                                                setting:{
                                                                    router: {
                                                                        model: "feed",
                                                                        defaultAction: "group",
                                                                        type: null
                                                                    },
                                                                    params: {
                                                                        type: "geo",
                                                                        order: "pageviews|-1",
                                                                        site_id: site_id,
                                                                        begindate:Clicki.manager.getDate().beginDate,
                                                                        enddate:Clicki.manager.getDate().endDate,
                                                                        condition : this.parent.params.condition
                                                                    },
                                                                    colModel:[
                                                                        {data:"region_name",width:"150px",compare:false},
                                                                        {
                                                                            data:null,
                                                                            xModule:{
                                                                                "visit":{
                                                                                    type:"poptip",
                                                                                    url: "/statistic/visitordetail",
                                                                                    params: {
                                                                                        "site_id":site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : '{keys}',
                                                                                        out: 'html'
                                                                                    },
                                                                                    width:850,
                                                                                    height:460,
                                                                                    title:LANG("{region_name} 的访客列表"),
                                                                                    boxType:"center"
                                                                                },
                                                                                "linkage":{
                                                                                    target:"theList_digg_chart",
                                                                                    type:"poptip",
                                                                                    params:{
                                                                                        type: "geo",
                                                                                        site_id: site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : "{keys}"
                                                                                    },
                                                                                    title:LANG("{region_name} 趋势图"),
                                                                                    width:800,
                                                                                    boxType:"center",
                                                                                    height:300
                                                                                }
                                                                            },
                                                                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                                        },
                                                                        {data:"pageviews"},
                                                                        {data:"sessions"},
                                                                        {data:"visitors"},
                                                                        {data:"new_visitors"},
                                                                        {data:"avg_staytime"},
                                                                        {data:"avg_loadtime"},
                                                                        {data:"avg_pagepixels"},
                                                                        {data:"bounce_rate"},
                                                                        {data:"active_visitors"}
                                                                    ],
                                                                    target: mAttributes.dom.find("div:first"),
                                                                    ExportExcel: true,
                                                                    icon: {
                                                                        col: 1,
                                                                        pos: 0,
                                                                        type:"geo",
                                                                        name:"country_icon",
                                                                        title:"country_name"
                                                                    }
                                                                }
                                                            };
                                                            Clicki.manager.add(set);
                                                            set = null;
                                                        }
                                                    },
                                                    {
                                                        text:LANG("城市"),
                                                        scope:true,
                                                        html:'<div class="theList_city"></div>',
                                                        afterRender:function(mAttributes){
                                                            var set = {groups:{}};
                                                            set.groups["theList_city"+this.parent.target] = {
                                                                type:"grid",
                                                                setting:{
                                                                    router: {
                                                                        model: "feed",
                                                                        defaultAction: "group",
                                                                        type: null
                                                                    },
                                                                    params: {
                                                                        type: "city",
                                                                        order: "pageviews|-1",
                                                                        site_id: site_id,
                                                                        begindate:Clicki.manager.getDate().beginDate,
                                                                        enddate:Clicki.manager.getDate().endDate,
                                                                        condition : this.parent.params.condition
                                                                    },
                                                                    colModel:[
                                                                        {
                                                                            data:"city_name",
                                                                            width:"150px",
                                                                            compare:false,
                                                                            render:function(key,i,row){
                                                                                var client = this._getCollection().getModelDataAt(row).x_axis;
                                                                                return client.region_name + " " + client.city_name ;
                                                                            }
                                                                        },
                                                                        {
                                                                            data:null,
                                                                            xModule:{
                                                                                "visit":{
                                                                                    type:"poptip",
                                                                                    url: "/statistic/visitordetail",
                                                                                    params: {
                                                                                        "site_id":site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : '{keys}',
                                                                                        out: 'html'
                                                                                    },
                                                                                    width:850,
                                                                                    height:460,
                                                                                    title:LANG("{city_name} 的访客列表"),
                                                                                    boxType:"center"
                                                                                },
                                                                                "linkage":{
                                                                                    target:"theList_digg_chart",
                                                                                    type:"poptip",
                                                                                    params:{
                                                                                        type: "city",
                                                                                        site_id: site_id
                                                                                    },
                                                                                    addParams: {
                                                                                        condition : "{keys}"
                                                                                    },
                                                                                    title:LANG("{city_name} 趋势图"),
                                                                                    width:800,
                                                                                    boxType:"center",
                                                                                    height:300
                                                                                }
                                                                            },
                                                                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                                        },
                                                                        {data:"pageviews"},
                                                                        {data:"sessions"},
                                                                        {data:"visitors"},
                                                                        {data:"new_visitors"},
                                                                        {data:"avg_staytime"},
                                                                        {data:"avg_loadtime"},
                                                                        {data:"avg_pagepixels"},
                                                                        {data:"bounce_rate"},
                                                                        {data:"active_visitors"}
                                                                    ],
                                                                    target: mAttributes.dom.find("div:first"),
                                                                    ExportExcel: true
                                                                }
                                                            };
                                                            Clicki.manager.add(set);
                                                            set = null;
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        target:mAttributes.dom.find("div:first")
                                    }
                                }
                                Clicki.manager.add(set);
                                set = null;
                            }
                        }
                    ]
                },
                /*入口页，直接访问*/
                "landing":{
                    xtype: "grid",
                    subTitle:LANG("入口页"),
                    url:"/feed/group",
                    params: {
                        type:"page_entrance",
                        order:"pageviews|-1",
                        site_id:site_id,
                        begindate:Clicki.manager.getDate().beginDate,
                        enddate:Clicki.manager.getDate().endDate,
                        page:1,
                        limit:10
                    },
                    addParams:{
                        "condition":"{keys}"
                    },
                    colModel:[
                        {data:"entrance_url_name",compare:false,
                            render:function(_str,i,row,href){
                                var collection = this._getCollection();
                                var ms = collection.getAllModelData();
                                return '<p>'+ms[i].x_axis.entrance_url_title+'</p><a href="'+ms[i].x_axis.entrance_url_name+'" target="_blank" title="'+LANG("在新页面打开")+'--'+ms[i].x_axis.entrance_url_name+'">'+ms[i].x_axis.entrance_url_name.cutMixStr(0,40,"...")+'</a>';
                            },
                            width:"290px"
                        },
                        {
                            data:null,
                            xModule:{
                                "visit":{
                                    type:"poptip",
                                    url: "/statistic/visitordetail",
                                    params: {
                                        "site_id":site_id
                                    },
                                    addParams: {
                                        condition :'{keys}',
                                        out: 'html'
                                    },
                                    width:850,
                                    height:460,
                                    title:LANG("{entrance_url_title} 的访客列表"),
                                    boxType:"center"
                                },
                                "linkage":{
                                    target:"theList_landing_chart",
                                    type:"poptip",
                                    params:{
                                        type:"page_entrance",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{entrance_url_title} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            tpl:"<span class=\"theCtrlListR\"><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                        },
                        {data:"pageviews"},
                        {data:"sessions"},
                        {data:"visitors"},
                        {data:"new_visitors"},
                        {data:"bounce_rate"},
                        {data:"avg_staytime"},
                        {data:"avg_loadtime"}
                    ],
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "geo":{
                    xtype:"tabpanel",
                    subTitle:LANG("访客地区"),
                    params:{},
                    addParams: {
                        condition : '{keys}'
                    },
                    items:[
                        {
                            text:LANG("省份"),
                            scope:true,
                            html:'<div class="theList_region"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_region"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "geo",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"region_name",width:"150px",compare:false},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{region_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "geo",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{region_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true,
                                        icon: {
                                            col: 1,
                                            pos: 0,
                                            type:"geo",
                                            name:"country_icon",
                                            title:"country_name"
                                        }
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        },
                        {
                            text:LANG("城市"),
                            scope:true,
                            html:'<div class="theList_city"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_city"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "city",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {
                                                data:"city_name",
                                                width:"150px",
                                                compare:false,
                                                render:function(key,i,row){
                                                    var client = this._getCollection().getModelDataAt(row).x_axis;
                                                    return client.region_name + " " + client.city_name ;
                                                }
                                            },
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{city_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "city",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{city_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        }
                    ]
                }
            },
            rowModel:[
                {
                    key:{
                        name:"source0_id",
                        value:0
                    },
                    cols:{
                        els:"img",
                        evn:function(i,n){
                            var type = $(n).attr("data-stype");
                            var tag = $(n);
                            if(!type.match(/geo|landing/g)){
                                tag.unbind().remove();
                            }
                        }
                    }
                },
                {
                    key:{
                        name:"source0_id",
                        value:1
                    },
                    cols:{
                        els:"img",
                        evn:function(i,n){
                            var type = $(n).attr("data-stype");
                            var tag = $(n);
                            if(!type.match(/geo|landing|referer/g)){
                                tag.unbind().remove();
                            }
                        }
                    }
                },
                {
                    key:{
                        name:"source0_id",
                        value:2
                    },
                    cols:{
                        els:"img",
                        evn:function(i,n){
                            var type = $(n).attr("data-stype");
                            var tag = $(n);
                            if(!type.match(/geo|landing|se/g)){
                                tag.unbind().remove();
                            }
                        }
                    }
                },{
                    key:{
                        name:"source0_id",
                        value:3
                    },
                    cols:{
                        els:"img",
                        evn:function(i,n){
                            var type = $(n).attr("data-stype");
                            var tag = $(n);
                            if(!type.match(/geo|landing|referer/g)){
                                tag.unbind().remove();
                            }
                        }
                    }
                },{
                    key:{
                        name:"source0_id",
                        value:4
                    },
                    cols:{
                        els:"img",
                        evn:function(i,n){
                            var type = $(n).attr("data-stype");
                            var tag = $(n);
                            if(!type.match(/geo|landing|referer/g)){
                                tag.unbind().remove();
                            }
                        }
                    }
                },{
                    key:{
                        name:"source0_id",
                        value:5
                    },
                    cols:{
                        els:"img",
                        evn:function(i,n){
                            var type = $(n).attr("data-stype");
                            var tag = $(n);
                            if(!type.match(/geo|landing|spot/g)){
                                tag.unbind().remove();
                            }
                        }
                    }
                }
            ],
            filter:{
                type:"referer_url_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            title: LANG("来源类型数据表"),
            ExportExcel: true,
            showTotal:true
        },
        "utm_campaign":{
            colModel:[
                {data:"utm_campaign_name",
                    render:function(key,i,row){
                        return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                    },
                    sort:true
                },
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            height:460,
                            title:LANG("{utm_campaign_name} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            type:"poptip",
                            target:"theList_digg_chart",
                            params:{
                                type: "utm_spot",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{utm_campaign_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    compare:false,
                    sort:false,
                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"},
                {data:"active_visitors"}
            ],
            sub: {
                "spot":{
                    xtype: "grid",
                    subTitle:LANG("广告"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "utm_spot",
                        order: "pageviews|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"utm_spot_position",sort:true},
                        {
                            data:null,
                            xModule:{
                                "visit":{
                                    type:"poptip",
                                    url: "/statistic/visitordetail",
                                    params: {
                                        "site_id":site_id
                                    },
                                    addParams: {
                                        condition : '{keys}',
                                        out: 'html'
                                    },
                                    width:850,
                                    height:460,
                                    title:LANG("{utm_spot_position} 的访客列表"),
                                    boxType:"center"
                                },
                                "linkage":{
                                    type:"poptip",
                                    target:"theList_digg_chart",
                                    params:{
                                        type: "utm_spot",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{utm_spot_position} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            compare:false,
                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                        },
                        {data:"utm_spot_channel", sort:true},
                        {data:"utm_spot_website", sort:true},
                        {data:"pageviews"},
                        {data:"sessions"},
                        {data:"visitors"},
                        {data:"new_visitors"},
                        {data:"bounce_rate"},
                        {data:"avg_staytime"},
                        {data:"avg_loadtime"}
                    ],
                    sub: {
                        "page":{
                            xtype: "grid",
                            subTitle:LANG("页面"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "page_url",
                                order: "pageviews|-1",
                                limit: 10
                            },
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            colModel:[
                                {data:"page_url_name",
                                    render:function(key,i,row){
                                        var page = this._getCollection().getModelDataAt(row).x_axis;
                                        var title = page.page_url_title;
                                        if(page.page_url_title){
                                            title = (page.page_url_title.length > 30) && (page.page_url_title.substr(0,30)+"...") || page.page_url_title;
                                        }
                                        else{
                                            title = key;
                                        }
                                        return '<span title="' + page.page_url_title + '">' + title + '</span><br /><a title="' + page.page_url_name + '" href="' + page.page_url_name + '" target="_blank">' + key + '</a>';
                                    }
                                },
                                {
                                    data:null,
                                    xModule:{
                                        "linkage":{
                                            target:"theList_page_url_chart",
                                            type:"poptip",
                                            params:{
                                                type: "page_url",
                                                site_id: site_id
                                            },
                                            addParams: {
                                                condition : "{keys}"
                                            },
                                            title:LANG("{page_url_title} 趋势图"),
                                            width:800,
                                            boxType:"center",
                                            height:300
                                        }
                                    },
                                    render:function(key,i,row){

                                        var _collection = this._getCollection();

                                        var url = _collection.getAllColDatas()[row][0];

                                        url += "#/clicki/heatmap";

                                        var _str = "<span class=\"theCtrlListR\">"+key+"<a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a><a href=\""+url+"\" title=\""+LANG("热图")+"\" target=\"_blank\" class=\"heatmapIcon\">"+LANG("热图")+"</a></span>";

                                        return _str;
                                    }
                                },
                                {data:"pageviews",sort:true},
                                {data:"click",sort:true},
                                {data:"input",sort:true},
                                {data:"avg_staytime",sort:true},
                                {data:"avg_loadtime",sort:true}
                            ],
                            ellipsis:45,
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        },
                        "keyword":{
                            xtype: "grid",
                            subTitle:LANG("关键词"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "utm_keyword",
                                order: "pageviews|-1",
                                limit: 10
                            },
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            colModel:[
                                {data:"utm_keyword_name"},
                                {
                                    data:null,
                                    xModule:{
                                        "visit":{
                                            type:"poptip",
                                            url: "/statistic/visitordetail",
                                            params: {
                                                "site_id":site_id
                                            },
                                            addParams: {
                                                condition : '{keys}',
                                                out: 'html'
                                            },
                                            width:850,
                                            height:460,
                                            title:LANG("{utm_keyword_name} 的访客列表"),
                                            boxType:"center"
                                        },
                                        "linkage":{
                                            type:"poptip",
                                            target:"theList_digg_chart",
                                            params:{
                                                type: "utm_keyword",
                                                site_id: site_id
                                            },
                                            addParams: {
                                                condition : "{keys}"
                                            },
                                            title:LANG("{utm_keyword_name} 趋势图"),
                                            width:800,
                                            boxType:"center",
                                            height:300
                                        }
                                    },
                                    compare:false,
                                    tpl:"<span class=\"theCtrlListR\"><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                },
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        },
                        "geo":{
                            xtype:"tabpanel",
                            subTitle:LANG("访客地区"),
                            params:{},
                            addParams: {
                                condition : '{keys}'
                            },
                            items:[
                                {
                                    text:LANG("省份"),
                                    scope:true,
                                    html:'<div class="theList_region"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_region"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "geo",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {data:"region_name",width:"150px",compare:false},
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{region_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "geo",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{region_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true,
                                                icon: {
                                                    col: 1,
                                                    pos: 0,
                                                    type:"geo",
                                                    name:"country_icon",
                                                    title:"country_name"
                                                }
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                },
                                {
                                    text:LANG("城市"),
                                    scope:true,
                                    html:'<div class="theList_city"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_city"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "city",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {
                                                        data:"city_name",
                                                        width:"150px",
                                                        compare:false,
                                                        render:function(key,i,row){
                                                            var client = this._getCollection().getModelDataAt(row).x_axis;
                                                            return client.region_name + " " + client.city_name ;
                                                        }
                                                    },
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{city_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "city",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{city_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                }
                            ]
                        }
                    },
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "page":{
                    xtype: "grid",
                    subTitle:LANG("页面"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "page_url",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"page_url_name",
                            render:function(key,i,row){
                                var page = this._getCollection().getModelDataAt(row).x_axis;
                                var title = page.page_url_title;
                                if(page.page_url_title){
                                    title = (page.page_url_title.length > 30) && (page.page_url_title.substr(0,30)+"...") || page.page_url_title;
                                }
                                else{
                                    title = key;
                                }
                                return '<span title="' + page.page_url_title + '">' + title + '</span><br /><a title="' + page.page_url_name + '" href="' + page.page_url_name + '" target="_blank">' + key + '</a>';
                            }
                        },
                        {
                            data:null,
                            xModule:{
                                "linkage":{
                                    target:"theList_page_url_chart",
                                    type:"poptip",
                                    params:{
                                        type: "page_url",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{page_url_title} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            render:function(key,i,row){

                                var _collection = this._getCollection();

                                var url = _collection.getAllColDatas()[row][0];

                                url += "#/clicki/heatmap";

                                var _str = "<span class=\"theCtrlListR\">"+key+"<a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a><a href=\""+url+"\" title=\""+LANG("热图")+"\" target=\"_blank\" class=\"heatmapIcon\">"+LANG("热图")+"</a></span>";

                                return _str;
                            }
                        },
                        {data:"pageviews",sort:true},
                        {data:"entrances",sort:true},
                        {data:"exits",sort:true},
                        {data:"click",sort:true},
                        {data:"input",sort:true},
                        {data:"avg_staytime",sort:true},
                        {data:"avg_loadtime",sort:true}
                    ],
                    ellipsis:45,
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "geo":{
                    xtype:"tabpanel",
                    subTitle:LANG("访客地区"),
                    params:{},
                    addParams: {
                        condition : '{keys}'
                    },
                    items:[
                        {
                            text:LANG("省份"),
                            scope:true,
                            html:'<div class="theList_region"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_region"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "geo",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"region_name",width:"150px",compare:false},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{region_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "geo",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{region_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true,
                                        icon: {
                                            col: 1,
                                            pos: 0,
                                            type:"geo",
                                            name:"country_icon",
                                            title:"country_name"
                                        }
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        },
                        {
                            text:LANG("城市"),
                            scope:true,
                            html:'<div class="theList_city"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_city"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "city",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {
                                                data:"city_name",
                                                width:"150px",
                                                compare:false,
                                                render:function(key,i,row){
                                                    var client = this._getCollection().getModelDataAt(row).x_axis;
                                                    return client.region_name + " " + client.city_name ;
                                                }
                                            },
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{city_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "city",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{city_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        }
                    ]
                }
            },
            filter:{
                type:"ad_utm_campaign_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            ExportExcel: true,
            showTotal: true
        },
        "utm_spot":{
            colModel:[
                {data:"utm_spot_position",
                    render:function(key,i,row){
                        return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                    }
                },
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            height:460,
                            title:LANG("{utm_spot_position} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            type:"poptip",
                            target:"theList_digg_chart",
                            params:{
                                type: "utm_spot",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{utm_spot_position} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    compare:false,
                    width:30,
                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"utm_spot_channel"},
                {data:"utm_spot_website"},
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"},
                {data:"active_visitors"}
            ],
            sub: {
                "page":{
                    xtype: "grid",
                    subTitle:LANG("页面"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "page_url",
                        order: "pageviews|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"page_url_name",
                            render:function(key,i,row){
                                var page = this._getCollection().getModelDataAt(row).x_axis;
                                var title = page.page_url_title;
                                if(page.page_url_title){
                                    title = (page.page_url_title.length > 30) && (page.page_url_title.substr(0,30)+"...") || page.page_url_title;
                                }
                                else{
                                    title = key;
                                }
                                return '<span title="' + page.page_url_title + '">' + title + '</span><br /><a title="' + page.page_url_name + '" href="' + page.page_url_name + '" target="_blank">' + key + '</a>';
                            }
                        },
                        {
                            data:null,
                            xModule:{
                                "linkage":{
                                    target:"theList_page_url_chart",
                                    type:"poptip",
                                    params:{
                                        type: "page_url",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{page_url_title} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            render:function(key,i,row){

                                var _collection = this._getCollection();

                                var url = _collection.getAllColDatas()[row][0];

                                url += "#/clicki/heatmap";

                                var _str = "<span class=\"theCtrlListR\">"+key+"<a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a><a href=\""+url+"\" title=\""+LANG("热图")+"\" target=\"_blank\" class=\"heatmapIcon\">"+LANG("热图")+"</a></span>";

                                return _str;
                            }
                        },
                        {data:"pageviews",sort:true},
                        {data:"entrances",sort:true},
                        {data:"exits",sort:true},
                        {data:"click",sort:true},
                        {data:"input",sort:true},
                        {data:"avg_staytime",sort:true},
                        {data:"avg_loadtime",sort:true}
                    ],
                    ellipsis:45,
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "keyword":{
                    xtype: "grid",
                    subTitle:LANG("关键词"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "utm_keyword",
                        order: "pageviews|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"utm_keyword_name"},
                        {
                            data:null,
                            xModule:{
                                "visit":{
                                    type:"poptip",
                                    url: "/statistic/visitordetail",
                                    params: {
                                        "site_id":site_id,
                                    },
                                    addParams: {
                                        condition : '{keys}',
                                        out: 'html',
                                    },
                                    height:460,
                                    width:850,
                                    title:LANG("{utm_keyword_name} 的访客列表"),
                                    boxType:"center"
                                },
                                "linkage":{
                                    type:"poptip",
                                    target:"theList_digg_chart",
                                    params:{
                                        type: "utm_keyword",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{utm_keyword_name} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            compare:false,
                            tpl:"<span class=\"theCtrlListR\"><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                        },
                        {data:"sessions",sort:true},
                        {data:"pageviews",sort:true},
                        {data:"visitors",sort:true},
                        {data:"bounce_rate",sort:true},
                        {data:"reserve0",sort:true},
                        {data:"reserve1",sort:true},
                        {data:"reserve2",sort:true},
                        {data:"reserve3",sort:true}
                    ],
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "geo":{
                    xtype:"tabpanel",
                    subTitle:LANG("访客地区"),
                    params:{},
                    addParams: {
                        condition : '{keys}'
                    },
                    items:[
                        {
                            text:LANG("省份"),
                            scope:true,
                            html:'<div class="theList_region"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_region"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "geo",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"region_name",width:"150px",compare:false},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{region_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "geo",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{region_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true,
                                        icon: {
                                            col: 1,
                                            pos: 0,
                                            type:"geo",
                                            name:"country_icon",
                                            title:"country_name"
                                        }
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        },
                        {
                            text:LANG("城市"),
                            scope:true,
                            html:'<div class="theList_city"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_city"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "city",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {
                                                data:"city_name",
                                                width:"150px",
                                                compare:false,
                                                render:function(key,i,row){
                                                    var client = this._getCollection().getModelDataAt(row).x_axis;
                                                    return client.region_name + " " + client.city_name ;
                                                }
                                            },
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{city_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "city",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{city_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        }
                    ]
                }
            },
            filter:{
                type:"ad_utm_spot_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["utm_spot_channel","utm_spot_website","pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "always":["utm_spot_channel","utm_spot_website"],
                "options":{
                    "utm_spot_channel":{text:LANG("频道")},
                    "utm_spot_website":{text:LANG("媒体")},
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            ExportExcel: true,
            showMark:false,
            showTotal: true
        },
        "utm_keyword":{
            colModel:[
                {data:"utm_keyword_name"},
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            height:460,
                            title:LANG("{utm_keyword_name} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            type:"poptip",
                            target:"theList_digg_chart",
                            params:{
                                type: "utm_keyword",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{utm_keyword_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    compare:false,
                    width:30,
                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"},
                {data:"active_visitors"}
            ],
            sub: {
                /*搜索引擎*/
                "se":{
                    xtype: "grid",
                    subTitle:LANG("搜索引擎"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        type: "se",
                        order: "pageviews|-1",
                        site_id: site_id,
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"se_name"/*,width:"80px"*/},
                        {
                            data:null,
                            xModule:{
                                "visit":{
                                    type:"poptip",
                                    url: "/statistic/visitordetail",
                                    params: {
                                        "site_id":site_id,
                                    },
                                    addParams: {
                                        condition : '{keys}',
                                        out: 'html',
                                    },
                                    width:850,
                                    height:460,
                                    title:LANG("{se_name} 的访客列表"),
                                    boxType:"center"
                                },
                                "linkage":{
                                    target:"theList_digg_chart",
                                    type:"poptip",
                                    params:{
                                        type: "se",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{se_name} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                        },
                        {data:"pageviews"},
                        {data:"sessions"},
                        {data:"visitors"},
                        {data:"new_visitors"},
                        {data:"avg_staytime"},
                        {data:"avg_loadtime"},
                        {data:"avg_pagepixels"},
                        {data:"bounce_rate"},
                        {data:"active_visitors"}
                    ],
                    sub: {
                        "def":{
                            xtype: "grid",
                            subTitle:LANG("关键词"),
                            params: {
                                site_id: site_id,
                                type: "keyword",
                                order: "pageviews|-1",
                                limit: 10
                            },
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            colModel:[
                                {data:"keyword_name",width:"25%",render:function(key,i,row){
                                    var _se = {
                                        "10000":"http://www.baidu.com/s?wd=",
                                        "10002":"https://www.google.com/search?q=",
                                        "10003":"http://www.sogou.com/web?query=",
                                        "10004":"http://www.soso.com/q?w=",
                                        "10001":"http://cn.bing.com/search?q=",
                                        "10005":"http://www.youdao.com/search?q="
                                    };
                                    var seName = this._getCollection().getParams().condition.split("|")[1];
                                    var _key = encodeURIComponent(key);
                                    return '<a href="'+(_se[seName]+_key)+'" target="_blank">'+key+'</a>';
                                }},
                                {
                                    data:null,
                                    xModule:{
                                        "visit":{
                                            type:"poptip",
                                            url: "/statistic/visitordetail",
                                            params: {
                                                "site_id":site_id
                                            },
                                            addParams: {
                                                condition : '{keys}',
                                                out: 'html'
                                            },
                                            height:460,
                                            title:LANG("{keyword_name} 的访客列表"),
                                            width:850,
                                            boxType:"center"
                                        },
                                        "linkage":{
                                            target:"theList_digg_chart",
                                            type:"poptip",
                                            params:{
                                                type: "keyword",
                                                site_id: site_id
                                            },
                                            addParams: {
                                                condition : "{keys}"
                                            },
                                            title:LANG("{keyword_name} 趋势图"),
                                            width:800,
                                            boxType:"center",
                                            height:300
                                        }
                                    },
                                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访问明细")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                },
                                {data:"pageviews"},
                                {data:"sessions"},
                                {data:"visitors"},
                                {data:"new_visitors"},
                                {data:"bounce_rate"},
                                {data:"avg_staytime"},
                                {data:"avg_loadtime"}
                            ],
                            showPage: true,
                            alwaysRefresh: true,
                            ExportExcel: true
                        },
                        "geo":{
                            xtype:"tabpanel",
                            subTitle:LANG("访客地区"),
                            params:{},
                            addParams: {
                                condition : '{keys}'
                            },
                            items:[
                                {
                                    text:LANG("省份"),
                                    scope:true,
                                    html:'<div class="theList_region"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_region"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "geo",
                                                    order: "sessions|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {data:"region_name",width:"150px",compare:false},
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{region_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "geo",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{region_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true,
                                                icon: {
                                                    col: 1,
                                                    pos: 0,
                                                    type:"geo",
                                                    name:"country_icon",
                                                    title:"country_name"
                                                }
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                },
                                {
                                    text:LANG("城市"),
                                    scope:true,
                                    html:'<div class="theList_city"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_city"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "city",
                                                    order: "sessions|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {
                                                        data:"city_name",
                                                        width:"150px",
                                                        compare:false,
                                                        render:function(key,i,row){
                                                            var client = this._getCollection().getModelDataAt(row).x_axis;
                                                            return client.region_name + " " + client.city_name ;
                                                        }
                                                    },
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{city_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "city",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{city_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                }
                            ]
                        }
                    },
                    ExportExcel: true,
                    icon: {
                        col: 1,
                        pos: 0,
                        type:"se",
                        name:"se_icon"
                    }
                },
                "page":{
                    xtype: "grid",
                    subTitle:LANG("受访页面"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "page_url",
                        order: "pageviews|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"page_url_name",
                            render:function(key,i,row){
                                var page = this._getCollection().getModelDataAt(row).x_axis;
                                var title = page.page_url_title;
                                if(page.page_url_title){
                                    title = (page.page_url_title.length > 30) && (page.page_url_title.substr(0,30)+"...") || page.page_url_title;
                                }
                                else{
                                    title = key;
                                }
                                return '<span title="' + page.page_url_title + '">' + title + '</span><br /><a title="' + page.page_url_name + '" href="' + page.page_url_name + '" target="_blank">' + key + '</a>';
                            }
                        },
                        {
                            data:null,
                            xModule:{
                                "linkage":{
                                    target:"theList_page_url_chart",
                                    type:"poptip",
                                    params:{
                                        type: "page_url",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{page_url_title} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            render:function(key,i,row){

                                var _collection = this._getCollection();

                                var url = _collection.getAllColDatas()[row][0];

                                url += "#/clicki/heatmap";

                                var _str = "<span class=\"theCtrlListR\">"+key+"<a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a><a href=\""+url+"\" title=\""+LANG("热图")+"\" target=\"_blank\" class=\"heatmapIcon\">"+LANG("热图")+"</a></span>";

                                return _str;
                            }
                        },
                        {data:"pageviews",sort:true},
                        {data:"entrances",sort:true},
                        {data:"exits",sort:true},
                        {data:"click",sort:true},
                        {data:"input",sort:true},
                        {data:"avg_staytime",sort:true},
                        {data:"avg_loadtime",sort:true}
                    ],
                    ellipsis:45,
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "geo":{
                    xtype:"tabpanel",
                    subTitle:LANG("访客地区"),
                    params:{},
                    addParams: {
                        condition : '{keys}'
                    },
                    items:[
                        {
                            text:LANG("省份"),
                            scope:true,
                            html:'<div class="theList_region"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_region"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "geo",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"region_name",width:"150px",compare:false},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{region_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "geo",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{region_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true,
                                        icon: {
                                            col: 1,
                                            pos: 0,
                                            type:"geo",
                                            name:"country_icon",
                                            title:"country_name"
                                        }
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        },
                        {
                            text:LANG("城市"),
                            scope:true,
                            html:'<div class="theList_city"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_city"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "city",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {
                                                data:"city_name",
                                                width:"150px",
                                                compare:false,
                                                render:function(key,i,row){
                                                    var client = this._getCollection().getModelDataAt(row).x_axis;
                                                    return client.region_name + " " + client.city_name ;
                                                }
                                            },
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{city_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "city",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{city_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        }
                    ]
                },
                "stayslot":{
                    xtype: "grid",
                    subTitle:LANG("停留时间"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "stayslot",
                        order: "stayslot|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"stayslot_name"},
                        {data:"sessions",sort:true},
                        {data:"pageviews",sort:true},
                        {data:"visitors",sort:true},
                        {data:"bounce_rate",sort:true},
                        {data:"reserve0",sort:true},
                        {data:"reserve1",sort:true},
                        {data:"reserve2",sort:true},
                        {data:"reserve3",sort:true}
                    ],
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "depath":{
                    xtype: "grid",
                    subTitle:LANG("访问深度"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "depth",
                        order: "depth|-1",
                        limit: 10
                    },
                    colModel:[
                        {data:"depth_name"},
                        {data:"sessions",sort:true},
                        {data:"pageviews",sort:true},
                        {data:"visitors",sort:true},
                        {data:"bounce_rate",sort:true},
                        {data:"reserve0",sort:true},
                        {data:"reserve1",sort:true},
                        {data:"reserve2",sort:true},
                        {data:"reserve3",sort:true}
                    ],
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                }
            },
            filter:{
                type:"ad_utm_keyword_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            ExportExcel: true,
            showMark:false,
            showTotal: true
        },
        "gutm_campaign":{
            colModel:[
                {data:"gutm_campaign_name",
                    render:function(key,i,row){
                        return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                    }
                },
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            height:460,
                            title:LANG("{gutm_campaign_name} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            type:"poptip",
                            target:"theList_digg_chart",
                            params:{
                                type: "gutm_campaign",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{gutm_campaign_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    compare:false,
                    width:30,
                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"},
                {data:"active_visitors"}
            ],
            sub: {
                "def":{
                    xtype: "grid",
                    subTitle:LANG("媒体"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "gutm_medium",
                        order: "pageviews|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"gutm_medium_name"},
                        {
                            data:null,
                            xModule:{
                                "visit":{
                                    type:"poptip",
                                    url: "/statistic/visitordetail",
                                    params: {
                                        "site_id":site_id
                                    },
                                    addParams: {
                                        condition : '{keys}',
                                        out: 'html'
                                    },
                                    width:850,
                                    height:460,
                                    title:LANG("{gutm_medium_name} 的访客列表"),
                                    boxType:"center"
                                },
                                "linkage":{
                                    type:"poptip",
                                    target:"theList_digg_chart",
                                    params:{
                                        type: "gutm_medium",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{gutm_medium_name} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            compare:false,
                            width:30,
                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                        },
                        {data:"pageviews"},
                        {data:"sessions"},
                        {data:"visitors"},
                        {data:"new_visitors"},
                        {data:"avg_staytime"},
                        {data:"avg_loadtime"},
                        {data:"avg_pagepixels"},
                        {data:"bounce_rate"},
                        {data:"active_visitors"}
                    ],
                    sub: {
                        "geo":{
                            xtype:"tabpanel",
                            subTitle:LANG("访客地区"),
                            params:{},
                            addParams: {
                                condition : '{keys}'
                            },
                            items:[
                                {
                                    text:LANG("省份"),
                                    scope:true,
                                    html:'<div class="theList_region"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_region"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "geo",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {data:"region_name",width:"150px",compare:false},
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{region_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "geo",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{region_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true,
                                                icon: {
                                                    col: 1,
                                                    pos: 0,
                                                    type:"geo",
                                                    name:"country_icon",
                                                    title:"country_name"
                                                }
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                },
                                {
                                    text:LANG("城市"),
                                    scope:true,
                                    html:'<div class="theList_city"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_city"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "city",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {
                                                        data:"city_name",
                                                        width:"150px",
                                                        compare:false,
                                                        render:function(key,i,row){
                                                            var client = this._getCollection().getModelDataAt(row).x_axis;
                                                            return client.region_name + " " + client.city_name ;
                                                        }
                                                    },
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{city_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "city",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{city_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                }
                            ]
                        },
                        "stayslot":{
                            xtype: "grid",
                            subTitle:LANG("停留时间"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "stayslot",
                                order: "stayslot|-1",
                                limit: 10
                            },
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            colModel:[
                                {data:"stayslot_name"},
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"bounce_rate",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        },
                        "depath":{
                            xtype: "grid",
                            subTitle:LANG("访问深度"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "depth",
                                order: "depth|-1",
                                limit: 10
                            },
                            colModel:[
                                {data:"depth_name"},
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"bounce_rate",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        }
                    },
                    ellipsis:45,
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "def":{
                    xtype: "grid",
                    subTitle:LANG("关键词"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "gutm_term",
                        order: "pageviews|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"gutm_term_name"},
                        {
                            data:null,
                            xModule:{
                                "visit":{
                                    type:"poptip",
                                    url: "/statistic/visitordetail",
                                    params: {
                                        "site_id":site_id
                                    },
                                    addParams: {
                                        condition : '{keys}',
                                        out: 'html'
                                    },
                                    width:850,
                                    height:460,
                                    title:LANG("{gutm_term_name} 的访客列表"),
                                    boxType:"center"
                                },
                                "linkage":{
                                    type:"poptip",
                                    target:"theList_digg_chart",
                                    params:{
                                        type: "gutm_term",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{gutm_term_name} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            compare:false,
                            width:30,
                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                        },
                        {data:"pageviews"},
                        {data:"sessions"},
                        {data:"visitors"},
                        {data:"new_visitors"},
                        {data:"avg_staytime"},
                        {data:"avg_loadtime"},
                        {data:"avg_pagepixels"},
                        {data:"bounce_rate"},
                        {data:"active_visitors"}
                    ],
                    sub: {
                        /*搜索引擎*/
                        "se":{
                            xtype: "grid",
                            subTitle:LANG("搜索引擎"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                type: "se",
                                order: "pageviews|-1",
                                site_id: site_id,
                            },
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            colModel:[
                                {data:"se_name"/*,width:"80px"*/},
                                {
                                    data:null,
                                    xModule:{
                                        "visit":{
                                            type:"poptip",
                                            url: "/statistic/visitordetail",
                                            params: {
                                                "site_id":site_id,
                                            },
                                            addParams: {
                                                condition : '{keys}',
                                                out: 'html',
                                            },
                                            width:850,
                                            height:460,
                                            title:LANG("{se_name} 的访客列表"),
                                            boxType:"center"
                                        },
                                        "linkage":{
                                            target:"theList_digg_chart",
                                            type:"poptip",
                                            params:{
                                                type: "se",
                                                site_id: site_id
                                            },
                                            addParams: {
                                                condition : "{keys}"
                                            },
                                            title:LANG("{se_name} 趋势图"),
                                            width:800,
                                            boxType:"center",
                                            height:300
                                        }
                                    },
                                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                },
                                {data:"pageviews"},
                                {data:"sessions"},
                                {data:"visitors"},
                                {data:"new_visitors"},
                                {data:"avg_staytime"},
                                {data:"avg_loadtime"},
                                {data:"avg_pagepixels"},
                                {data:"bounce_rate"},
                                {data:"active_visitors"}
                            ],
                            sub: {
                                "def":{
                                    xtype: "grid",
                                    subTitle:LANG("关键词"),
                                    params: {
                                        site_id: site_id,
                                        type: "keyword",
                                        order: "pageviews|-1",
                                        limit: 10
                                    },
                                    addParams: {
                                        begindate: function(){return Clicki.manager.getDate().beginDate},
                                        enddate: function(){return Clicki.manager.getDate().endDate},
                                        "condition": "{keys}"
                                    },
                                    colModel:[
                                        {data:"keyword_name",width:"25%",render:function(key,i,row){
                                            var _se = {
                                                "10000":"http://www.baidu.com/s?wd=",
                                                "10002":"https://www.google.com/search?q=",
                                                "10003":"http://www.sogou.com/web?query=",
                                                "10004":"http://www.soso.com/q?w=",
                                                "10001":"http://cn.bing.com/search?q=",
                                                "10005":"http://www.youdao.com/search?q="
                                            };
                                            var seName = this._getCollection().getParams().condition.split("|")[1];
                                            var _key = encodeURIComponent(key);
                                            return '<a href="'+(_se[seName]+_key)+'" target="_blank">'+key+'</a>';
                                        }},
                                        {
                                            data:null,
                                            xModule:{
                                                "visit":{
                                                    type:"poptip",
                                                    url: "/statistic/visitordetail",
                                                    params: {
                                                        "site_id":site_id
                                                    },
                                                    addParams: {
                                                        condition : '{keys}',
                                                        out: 'html'
                                                    },
                                                    height:460,
                                                    title:LANG("{keyword_name} 的访客列表"),
                                                    width:850,
                                                    boxType:"center"
                                                },
                                                "linkage":{
                                                    target:"theList_digg_chart",
                                                    type:"poptip",
                                                    params:{
                                                        type: "keyword",
                                                        site_id: site_id
                                                    },
                                                    addParams: {
                                                        condition : "{keys}"
                                                    },
                                                    title:LANG("{keyword_name} 趋势图"),
                                                    width:800,
                                                    boxType:"center",
                                                    height:300
                                                }
                                            },
                                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访问明细")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                        },
                                        {data:"pageviews"},
                                        {data:"sessions"},
                                        {data:"visitors"},
                                        {data:"new_visitors"},
                                        {data:"bounce_rate"},
                                        {data:"avg_staytime"},
                                        {data:"avg_loadtime"}
                                    ],
                                    showPage: true,
                                    alwaysRefresh: true,
                                    ExportExcel: true
                                },
                                "geo":{
                                    xtype:"tabpanel",
                                    subTitle:LANG("访客地区"),
                                    params:{},
                                    addParams: {
                                        condition : '{keys}'
                                    },
                                    items:[
                                        {
                                            text:LANG("省份"),
                                            scope:true,
                                            html:'<div class="theList_region"></div>',
                                            afterRender:function(mAttributes){
                                                var set = {groups:{}};
                                                set.groups["theList_region"+this.parent.target] = {
                                                    type:"grid",
                                                    setting:{
                                                        router: {
                                                            model: "feed",
                                                            defaultAction: "group",
                                                            type: null
                                                        },
                                                        params: {
                                                            type: "geo",
                                                            order: "sessions|-1",
                                                            site_id: site_id,
                                                            begindate:Clicki.manager.getDate().beginDate,
                                                            enddate:Clicki.manager.getDate().endDate,
                                                            condition : this.parent.params.condition
                                                        },
                                                        colModel:[
                                                            {data:"region_name",width:"150px",compare:false},
                                                            {
                                                                data:null,
                                                                xModule:{
                                                                    "visit":{
                                                                        type:"poptip",
                                                                        url: "/statistic/visitordetail",
                                                                        params: {
                                                                            "site_id":site_id
                                                                        },
                                                                        addParams: {
                                                                            condition : '{keys}',
                                                                            out: 'html'
                                                                        },
                                                                        width:850,
                                                                        height:460,
                                                                        title:LANG("{region_name} 的访客列表"),
                                                                        boxType:"center"
                                                                    },
                                                                    "linkage":{
                                                                        target:"theList_digg_chart",
                                                                        type:"poptip",
                                                                        params:{
                                                                            type: "geo",
                                                                            site_id: site_id
                                                                        },
                                                                        addParams: {
                                                                            condition : "{keys}"
                                                                        },
                                                                        title:LANG("{region_name} 趋势图"),
                                                                        width:800,
                                                                        boxType:"center",
                                                                        height:300
                                                                    }
                                                                },
                                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                            },
                                                            {data:"pageviews"},
                                                            {data:"sessions"},
                                                            {data:"visitors"},
                                                            {data:"new_visitors"},
                                                            {data:"avg_staytime"},
                                                            {data:"avg_loadtime"},
                                                            {data:"avg_pagepixels"},
                                                            {data:"bounce_rate"},
                                                            {data:"active_visitors"}
                                                        ],
                                                        target: mAttributes.dom.find("div:first"),
                                                        ExportExcel: true,
                                                        icon: {
                                                            col: 1,
                                                            pos: 0,
                                                            type:"geo",
                                                            name:"country_icon",
                                                            title:"country_name"
                                                        }
                                                    }
                                                };
                                                Clicki.manager.add(set);
                                                set = null;
                                            }
                                        },
                                        {
                                            text:LANG("城市"),
                                            scope:true,
                                            html:'<div class="theList_city"></div>',
                                            afterRender:function(mAttributes){
                                                var set = {groups:{}};
                                                set.groups["theList_city"+this.parent.target] = {
                                                    type:"grid",
                                                    setting:{
                                                        router: {
                                                            model: "feed",
                                                            defaultAction: "group",
                                                            type: null
                                                        },
                                                        params: {
                                                            type: "city",
                                                            order: "sessions|-1",
                                                            site_id: site_id,
                                                            begindate:Clicki.manager.getDate().beginDate,
                                                            enddate:Clicki.manager.getDate().endDate,
                                                            condition : this.parent.params.condition
                                                        },
                                                        colModel:[
                                                            {
                                                                data:"city_name",
                                                                width:"150px",
                                                                compare:false,
                                                                render:function(key,i,row){
                                                                    var client = this._getCollection().getModelDataAt(row).x_axis;
                                                                    return client.region_name + " " + client.city_name ;
                                                                }
                                                            },
                                                            {
                                                                data:null,
                                                                xModule:{
                                                                    "visit":{
                                                                        type:"poptip",
                                                                        url: "/statistic/visitordetail",
                                                                        params: {
                                                                            "site_id":site_id
                                                                        },
                                                                        addParams: {
                                                                            condition : '{keys}',
                                                                            out: 'html'
                                                                        },
                                                                        width:850,
                                                                        height:460,
                                                                        title:LANG("{city_name} 的访客列表"),
                                                                        boxType:"center"
                                                                    },
                                                                    "linkage":{
                                                                        target:"theList_digg_chart",
                                                                        type:"poptip",
                                                                        params:{
                                                                            type: "city",
                                                                            site_id: site_id
                                                                        },
                                                                        addParams: {
                                                                            condition : "{keys}"
                                                                        },
                                                                        title:LANG("{city_name} 趋势图"),
                                                                        width:800,
                                                                        boxType:"center",
                                                                        height:300
                                                                    }
                                                                },
                                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                            },
                                                            {data:"pageviews"},
                                                            {data:"sessions"},
                                                            {data:"visitors"},
                                                            {data:"new_visitors"},
                                                            {data:"avg_staytime"},
                                                            {data:"avg_loadtime"},
                                                            {data:"avg_pagepixels"},
                                                            {data:"bounce_rate"},
                                                            {data:"active_visitors"}
                                                        ],
                                                        target: mAttributes.dom.find("div:first"),
                                                        ExportExcel: true
                                                    }
                                                };
                                                Clicki.manager.add(set);
                                                set = null;
                                            }
                                        }
                                    ]
                                }
                            },
                            ExportExcel: true,
                            icon: {
                                col: 1,
                                pos: 0,
                                type:"se",
                                name:"se_icon"
                            }
                        },
                        "geo":{
                            xtype:"tabpanel",
                            subTitle:LANG("访客地区"),
                            params:{},
                            addParams: {
                                condition : '{keys}'
                            },
                            items:[
                                {
                                    text:LANG("省份"),
                                    scope:true,
                                    html:'<div class="theList_region"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_region"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "geo",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {data:"region_name",width:"150px",compare:false},
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{region_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "geo",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{region_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true,
                                                icon: {
                                                    col: 1,
                                                    pos: 0,
                                                    type:"geo",
                                                    name:"country_icon",
                                                    title:"country_name"
                                                }
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                },
                                {
                                    text:LANG("城市"),
                                    scope:true,
                                    html:'<div class="theList_city"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_city"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "city",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {
                                                        data:"city_name",
                                                        width:"150px",
                                                        compare:false,
                                                        render:function(key,i,row){
                                                            var client = this._getCollection().getModelDataAt(row).x_axis;
                                                            return client.region_name + " " + client.city_name ;
                                                        }
                                                    },
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{city_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "city",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{city_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                }
                            ]
                        },
                        "stayslot":{
                            xtype: "grid",
                            subTitle:LANG("停留时间"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "stayslot",
                                order: "stayslot|-1",
                                limit: 10
                            },
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            colModel:[
                                {data:"stayslot_name"},
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"bounce_rate",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        },
                        "depath":{
                            xtype: "grid",
                            subTitle:LANG("访问深度"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "depth",
                                order: "depth|-1",
                                limit: 10
                            },
                            colModel:[
                                {data:"depth_name"},
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"bounce_rate",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        }
                    },
                    ellipsis:45,
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "geo":{
                    xtype:"tabpanel",
                    subTitle:LANG("访客地区"),
                    params:{},
                    addParams: {
                        condition : '{keys}'
                    },
                    items:[
                        {
                            text:LANG("省份"),
                            scope:true,
                            html:'<div class="theList_region"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_region"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "geo",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"region_name",width:"150px",compare:false},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{region_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "geo",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{region_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true,
                                        icon: {
                                            col: 1,
                                            pos: 0,
                                            type:"geo",
                                            name:"country_icon",
                                            title:"country_name"
                                        }
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        },
                        {
                            text:LANG("城市"),
                            scope:true,
                            html:'<div class="theList_city"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_city"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "city",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {
                                                data:"city_name",
                                                width:"150px",
                                                compare:false,
                                                render:function(key,i,row){
                                                    var client = this._getCollection().getModelDataAt(row).x_axis;
                                                    return client.region_name + " " + client.city_name ;
                                                }
                                            },
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{city_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "city",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{city_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        }
                    ]
                },
                "stayslot":{
                    xtype: "grid",
                    subTitle:LANG("停留时间"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "stayslot",
                        order: "stayslot|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"stayslot_name"},
                        {data:"sessions",sort:true},
                        {data:"pageviews",sort:true},
                        {data:"visitors",sort:true},
                        {data:"bounce_rate",sort:true},
                        {data:"reserve0",sort:true},
                        {data:"reserve1",sort:true},
                        {data:"reserve2",sort:true},
                        {data:"reserve3",sort:true}
                    ],
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "depath":{
                    xtype: "grid",
                    subTitle:LANG("访问深度"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "depth",
                        order: "depth|-1",
                        limit: 10
                    },
                    colModel:[
                        {data:"depth_name"},
                        {data:"sessions",sort:true},
                        {data:"pageviews",sort:true},
                        {data:"visitors",sort:true},
                        {data:"bounce_rate",sort:true},
                        {data:"reserve0",sort:true},
                        {data:"reserve1",sort:true},
                        {data:"reserve2",sort:true},
                        {data:"reserve3",sort:true}
                    ],
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                }
            },
            filter:{
                type:"ad_gutm_campaign_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            ExportExcel: true,
            showMark:false,
            showTotal: true
        },
        "gutm_content":{
            colModel:[
                {data:"gutm_content_name",
                    render:function(key,i,row){
                        return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                    }
                },
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            height:460,
                            title:LANG("{gutm_content_name} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            type:"poptip",
                            target:"theList_digg_chart",
                            params:{
                                type: "gutm_content",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{gutm_content_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    compare:false,
                    width:30,
                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"},
                {data:"active_visitors"}
            ],
            sub: {
                "def":{
                    xtype: "grid",
                    subTitle:LANG("广告"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "gutm_campaign",
                        order: "pageviews|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"gutm_campaign_name"},
                        {
                            data:null,
                            xModule:{
                                "visit":{
                                    type:"poptip",
                                    url: "/statistic/visitordetail",
                                    params: {
                                        "site_id":site_id
                                    },
                                    addParams: {
                                        condition : '{keys}',
                                        out: 'html'
                                    },
                                    width:850,
                                    height:460,
                                    title:LANG("{gutm_campaign_name} 的访客列表"),
                                    boxType:"center"
                                },
                                "linkage":{
                                    type:"poptip",
                                    target:"theList_digg_chart",
                                    params:{
                                        type: "gutm_campaign",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{gutm_campaign_name} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            compare:false,
                            width:30,
                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                        },
                        {data:"pageviews"},
                        {data:"sessions"},
                        {data:"visitors"},
                        {data:"new_visitors"},
                        {data:"avg_staytime"},
                        {data:"avg_loadtime"},
                        {data:"avg_pagepixels"},
                        {data:"bounce_rate"},
                        {data:"active_visitors"}
                    ],
                    sub: {
                        "geo":{
                            xtype:"tabpanel",
                            subTitle:LANG("访客地区"),
                            params:{},
                            addParams: {
                                condition : '{keys}'
                            },
                            items:[
                                {
                                    text:LANG("省份"),
                                    scope:true,
                                    html:'<div class="theList_region"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_region"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "geo",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {data:"region_name",width:"150px",compare:false},
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{region_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "geo",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{region_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true,
                                                icon: {
                                                    col: 1,
                                                    pos: 0,
                                                    type:"geo",
                                                    name:"country_icon",
                                                    title:"country_name"
                                                }
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                },
                                {
                                    text:LANG("城市"),
                                    scope:true,
                                    html:'<div class="theList_city"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_city"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "city",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {
                                                        data:"city_name",
                                                        width:"150px",
                                                        compare:false,
                                                        render:function(key,i,row){
                                                            var client = this._getCollection().getModelDataAt(row).x_axis;
                                                            return client.region_name + " " + client.city_name ;
                                                        }
                                                    },
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{city_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "city",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{city_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                }
                            ]
                        },
                        "stayslot":{
                            xtype: "grid",
                            subTitle:LANG("停留时间"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "stayslot",
                                order: "stayslot|-1",
                                limit: 10
                            },
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            colModel:[
                                {data:"stayslot_name"},
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"bounce_rate",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        },
                        "depath":{
                            xtype: "grid",
                            subTitle:LANG("访问深度"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "depth",
                                order: "depth|-1",
                                limit: 10
                            },
                            colModel:[
                                {data:"depth_name"},
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"bounce_rate",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        }
                    },
                    ellipsis:45,
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "def":{
                    xtype: "grid",
                    subTitle:LANG("关键词"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "gutm_term",
                        order: "pageviews|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"gutm_term_name"},
                        {
                            data:null,
                            xModule:{
                                "visit":{
                                    type:"poptip",
                                    url: "/statistic/visitordetail",
                                    params: {
                                        "site_id":site_id
                                    },
                                    addParams: {
                                        condition : '{keys}',
                                        out: 'html'
                                    },
                                    width:850,
                                    height:460,
                                    title:LANG("{gutm_term_name} 的访客列表"),
                                    boxType:"center"
                                },
                                "linkage":{
                                    type:"poptip",
                                    target:"theList_digg_chart",
                                    params:{
                                        type: "gutm_term",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{gutm_term_name} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            compare:false,
                            width:30,
                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                        },
                        {data:"pageviews"},
                        {data:"sessions"},
                        {data:"visitors"},
                        {data:"new_visitors"},
                        {data:"avg_staytime"},
                        {data:"avg_loadtime"},
                        {data:"avg_pagepixels"},
                        {data:"bounce_rate"},
                        {data:"active_visitors"}
                    ],
                    sub: {
                        /*搜索引擎*/
                        "se":{
                            xtype: "grid",
                            subTitle:LANG("搜索引擎"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                type: "se",
                                order: "pageviews|-1",
                                site_id: site_id,
                            },
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            colModel:[
                                {data:"se_name"/*,width:"80px"*/},
                                {
                                    data:null,
                                    xModule:{
                                        "visit":{
                                            type:"poptip",
                                            url: "/statistic/visitordetail",
                                            params: {
                                                "site_id":site_id,
                                            },
                                            addParams: {
                                                condition : '{keys}',
                                                out: 'html',
                                            },
                                            width:850,
                                            height:460,
                                            title:LANG("{se_name} 的访客列表"),
                                            boxType:"center"
                                        },
                                        "linkage":{
                                            target:"theList_digg_chart",
                                            type:"poptip",
                                            params:{
                                                type: "se",
                                                site_id: site_id
                                            },
                                            addParams: {
                                                condition : "{keys}"
                                            },
                                            title:LANG("{se_name} 趋势图"),
                                            width:800,
                                            boxType:"center",
                                            height:300
                                        }
                                    },
                                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                },
                                {data:"pageviews"},
                                {data:"sessions"},
                                {data:"visitors"},
                                {data:"new_visitors"},
                                {data:"avg_staytime"},
                                {data:"avg_loadtime"},
                                {data:"avg_pagepixels"},
                                {data:"bounce_rate"},
                                {data:"active_visitors"}
                            ],
                            sub: {
                                "def":{
                                    xtype: "grid",
                                    subTitle:LANG("关键词"),
                                    params: {
                                        site_id: site_id,
                                        type: "keyword",
                                        order: "pageviews|-1",
                                        limit: 10
                                    },
                                    addParams: {
                                        begindate: function(){return Clicki.manager.getDate().beginDate},
                                        enddate: function(){return Clicki.manager.getDate().endDate},
                                        "condition": "{keys}"
                                    },
                                    colModel:[
                                        {data:"keyword_name",width:"25%",render:function(key,i,row){
                                            var _se = {
                                                "10000":"http://www.baidu.com/s?wd=",
                                                "10002":"https://www.google.com/search?q=",
                                                "10003":"http://www.sogou.com/web?query=",
                                                "10004":"http://www.soso.com/q?w=",
                                                "10001":"http://cn.bing.com/search?q=",
                                                "10005":"http://www.youdao.com/search?q="
                                            };
                                            var seName = this._getCollection().getParams().condition.split("|")[1];
                                            var _key = encodeURIComponent(key);
                                            return '<a href="'+(_se[seName]+_key)+'" target="_blank">'+key+'</a>';
                                        }},
                                        {
                                            data:null,
                                            xModule:{
                                                "visit":{
                                                    type:"poptip",
                                                    url: "/statistic/visitordetail",
                                                    params: {
                                                        "site_id":site_id
                                                    },
                                                    addParams: {
                                                        condition : '{keys}',
                                                        out: 'html'
                                                    },
                                                    height:460,
                                                    title:LANG("{keyword_name} 的访客列表"),
                                                    width:850,
                                                    boxType:"center"
                                                },
                                                "linkage":{
                                                    target:"theList_digg_chart",
                                                    type:"poptip",
                                                    params:{
                                                        type: "keyword",
                                                        site_id: site_id
                                                    },
                                                    addParams: {
                                                        condition : "{keys}"
                                                    },
                                                    title:LANG("{keyword_name} 趋势图"),
                                                    width:800,
                                                    boxType:"center",
                                                    height:300
                                                }
                                            },
                                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访问明细")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                        },
                                        {data:"pageviews"},
                                        {data:"sessions"},
                                        {data:"visitors"},
                                        {data:"new_visitors"},
                                        {data:"bounce_rate"},
                                        {data:"avg_staytime"},
                                        {data:"avg_loadtime"}
                                    ],
                                    showPage: true,
                                    alwaysRefresh: true,
                                    ExportExcel: true
                                },
                                "geo":{
                                    xtype:"tabpanel",
                                    subTitle:LANG("访客地区"),
                                    params:{},
                                    addParams: {
                                        condition : '{keys}'
                                    },
                                    items:[
                                        {
                                            text:LANG("省份"),
                                            scope:true,
                                            html:'<div class="theList_region"></div>',
                                            afterRender:function(mAttributes){
                                                var set = {groups:{}};
                                                set.groups["theList_region"+this.parent.target] = {
                                                    type:"grid",
                                                    setting:{
                                                        router: {
                                                            model: "feed",
                                                            defaultAction: "group",
                                                            type: null
                                                        },
                                                        params: {
                                                            type: "geo",
                                                            order: "sessions|-1",
                                                            site_id: site_id,
                                                            begindate:Clicki.manager.getDate().beginDate,
                                                            enddate:Clicki.manager.getDate().endDate,
                                                            condition : this.parent.params.condition
                                                        },
                                                        colModel:[
                                                            {data:"region_name",width:"150px",compare:false},
                                                            {
                                                                data:null,
                                                                xModule:{
                                                                    "visit":{
                                                                        type:"poptip",
                                                                        url: "/statistic/visitordetail",
                                                                        params: {
                                                                            "site_id":site_id
                                                                        },
                                                                        addParams: {
                                                                            condition : '{keys}',
                                                                            out: 'html'
                                                                        },
                                                                        width:850,
                                                                        height:460,
                                                                        title:LANG("{region_name} 的访客列表"),
                                                                        boxType:"center"
                                                                    },
                                                                    "linkage":{
                                                                        target:"theList_digg_chart",
                                                                        type:"poptip",
                                                                        params:{
                                                                            type: "geo",
                                                                            site_id: site_id
                                                                        },
                                                                        addParams: {
                                                                            condition : "{keys}"
                                                                        },
                                                                        title:LANG("{region_name} 趋势图"),
                                                                        width:800,
                                                                        boxType:"center",
                                                                        height:300
                                                                    }
                                                                },
                                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                            },
                                                            {data:"pageviews"},
                                                            {data:"sessions"},
                                                            {data:"visitors"},
                                                            {data:"new_visitors"},
                                                            {data:"avg_staytime"},
                                                            {data:"avg_loadtime"},
                                                            {data:"avg_pagepixels"},
                                                            {data:"bounce_rate"},
                                                            {data:"active_visitors"}
                                                        ],
                                                        target: mAttributes.dom.find("div:first"),
                                                        ExportExcel: true,
                                                        icon: {
                                                            col: 1,
                                                            pos: 0,
                                                            type:"geo",
                                                            name:"country_icon",
                                                            title:"country_name"
                                                        }
                                                    }
                                                };
                                                Clicki.manager.add(set);
                                                set = null;
                                            }
                                        },
                                        {
                                            text:LANG("城市"),
                                            scope:true,
                                            html:'<div class="theList_city"></div>',
                                            afterRender:function(mAttributes){
                                                var set = {groups:{}};
                                                set.groups["theList_city"+this.parent.target] = {
                                                    type:"grid",
                                                    setting:{
                                                        router: {
                                                            model: "feed",
                                                            defaultAction: "group",
                                                            type: null
                                                        },
                                                        params: {
                                                            type: "city",
                                                            order: "sessions|-1",
                                                            site_id: site_id,
                                                            begindate:Clicki.manager.getDate().beginDate,
                                                            enddate:Clicki.manager.getDate().endDate,
                                                            condition : this.parent.params.condition
                                                        },
                                                        colModel:[
                                                            {
                                                                data:"city_name",
                                                                width:"150px",
                                                                compare:false,
                                                                render:function(key,i,row){
                                                                    var client = this._getCollection().getModelDataAt(row).x_axis;
                                                                    return client.region_name + " " + client.city_name ;
                                                                }
                                                            },
                                                            {
                                                                data:null,
                                                                xModule:{
                                                                    "visit":{
                                                                        type:"poptip",
                                                                        url: "/statistic/visitordetail",
                                                                        params: {
                                                                            "site_id":site_id
                                                                        },
                                                                        addParams: {
                                                                            condition : '{keys}',
                                                                            out: 'html'
                                                                        },
                                                                        width:850,
                                                                        height:460,
                                                                        title:LANG("{city_name} 的访客列表"),
                                                                        boxType:"center"
                                                                    },
                                                                    "linkage":{
                                                                        target:"theList_digg_chart",
                                                                        type:"poptip",
                                                                        params:{
                                                                            type: "city",
                                                                            site_id: site_id
                                                                        },
                                                                        addParams: {
                                                                            condition : "{keys}"
                                                                        },
                                                                        title:LANG("{city_name} 趋势图"),
                                                                        width:800,
                                                                        boxType:"center",
                                                                        height:300
                                                                    }
                                                                },
                                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                            },
                                                            {data:"pageviews"},
                                                            {data:"sessions"},
                                                            {data:"visitors"},
                                                            {data:"new_visitors"},
                                                            {data:"avg_staytime"},
                                                            {data:"avg_loadtime"},
                                                            {data:"avg_pagepixels"},
                                                            {data:"bounce_rate"},
                                                            {data:"active_visitors"}
                                                        ],
                                                        target: mAttributes.dom.find("div:first"),
                                                        ExportExcel: true
                                                    }
                                                };
                                                Clicki.manager.add(set);
                                                set = null;
                                            }
                                        }
                                    ]
                                }
                            },
                            ExportExcel: true,
                            icon: {
                                col: 1,
                                pos: 0,
                                type:"se",
                                name:"se_icon"
                            }
                        },
                        "geo":{
                            xtype:"tabpanel",
                            subTitle:LANG("访客地区"),
                            params:{},
                            addParams: {
                                condition : '{keys}'
                            },
                            items:[
                                {
                                    text:LANG("省份"),
                                    scope:true,
                                    html:'<div class="theList_region"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_region"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "geo",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {data:"region_name",width:"150px",compare:false},
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{region_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "geo",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{region_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true,
                                                icon: {
                                                    col: 1,
                                                    pos: 0,
                                                    type:"geo",
                                                    name:"country_icon",
                                                    title:"country_name"
                                                }
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                },
                                {
                                    text:LANG("城市"),
                                    scope:true,
                                    html:'<div class="theList_city"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_city"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "city",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {
                                                        data:"city_name",
                                                        width:"150px",
                                                        compare:false,
                                                        render:function(key,i,row){
                                                            var client = this._getCollection().getModelDataAt(row).x_axis;
                                                            return client.region_name + " " + client.city_name ;
                                                        }
                                                    },
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{city_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "city",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{city_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                }
                            ]
                        },
                        "stayslot":{
                            xtype: "grid",
                            subTitle:LANG("停留时间"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "stayslot",
                                order: "stayslot|-1",
                                limit: 10
                            },
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            colModel:[
                                {data:"stayslot_name"},
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"bounce_rate",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        },
                        "depath":{
                            xtype: "grid",
                            subTitle:LANG("访问深度"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "depth",
                                order: "depth|-1",
                                limit: 10
                            },
                            colModel:[
                                {data:"depth_name"},
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"bounce_rate",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        }
                    },
                    ellipsis:45,
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "geo":{
                    xtype:"tabpanel",
                    subTitle:LANG("访客地区"),
                    params:{},
                    addParams: {
                        condition : '{keys}'
                    },
                    items:[
                        {
                            text:LANG("省份"),
                            scope:true,
                            html:'<div class="theList_region"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_region"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "geo",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"region_name",width:"150px",compare:false},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{region_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "geo",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{region_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true,
                                        icon: {
                                            col: 1,
                                            pos: 0,
                                            type:"geo",
                                            name:"country_icon",
                                            title:"country_name"
                                        }
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        },
                        {
                            text:LANG("城市"),
                            scope:true,
                            html:'<div class="theList_city"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_city"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "city",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {
                                                data:"city_name",
                                                width:"150px",
                                                compare:false,
                                                render:function(key,i,row){
                                                    var client = this._getCollection().getModelDataAt(row).x_axis;
                                                    return client.region_name + " " + client.city_name ;
                                                }
                                            },
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{city_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "city",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{city_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        }
                    ]
                },
                "stayslot":{
                    xtype: "grid",
                    subTitle:LANG("停留时间"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "stayslot",
                        order: "stayslot|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"stayslot_name"},
                        {data:"sessions",sort:true},
                        {data:"pageviews",sort:true},
                        {data:"visitors",sort:true},
                        {data:"bounce_rate",sort:true},
                        {data:"reserve0",sort:true},
                        {data:"reserve1",sort:true},
                        {data:"reserve2",sort:true},
                        {data:"reserve3",sort:true}
                    ],
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "depath":{
                    xtype: "grid",
                    subTitle:LANG("访问深度"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "depth",
                        order: "depth|-1",
                        limit: 10
                    },
                    colModel:[
                        {data:"depth_name"},
                        {data:"sessions",sort:true},
                        {data:"pageviews",sort:true},
                        {data:"visitors",sort:true},
                        {data:"bounce_rate",sort:true},
                        {data:"reserve0",sort:true},
                        {data:"reserve1",sort:true},
                        {data:"reserve2",sort:true},
                        {data:"reserve3",sort:true}
                    ],
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                }
            },
            filter:{
                type:"ad_gutm_content_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            ExportExcel: true,
            showMark:false,
            showTotal: true
        },
        "gutm_medium":{
            colModel:[
                {data:"gutm_medium_name",
                    render:function(key,i,row){
                        return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                    }
                },
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            height:460,
                            title:LANG("{gutm_medium_name} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            type:"poptip",
                            target:"theList_digg_chart",
                            params:{
                                type: "gutm_medium",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{gutm_medium_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    compare:false,
                    width:30,
                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"},
                {data:"active_visitors"}
            ],
            sub: {
                "def":{
                    xtype: "grid",
                    subTitle:LANG("广告"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "gutm_campaign",
                        order: "pageviews|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"gutm_campaign_name"},
                        {
                            data:null,
                            xModule:{
                                "visit":{
                                    type:"poptip",
                                    url: "/statistic/visitordetail",
                                    params: {
                                        "site_id":site_id
                                    },
                                    addParams: {
                                        condition : '{keys}',
                                        out: 'html'
                                    },
                                    width:850,
                                    height:460,
                                    title:LANG("{gutm_campaign_name} 的访客列表"),
                                    boxType:"center"
                                },
                                "linkage":{
                                    type:"poptip",
                                    target:"theList_digg_chart",
                                    params:{
                                        type: "gutm_campaign",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{gutm_campaign_name} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            compare:false,
                            width:30,
                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                        },
                        {data:"pageviews"},
                        {data:"sessions"},
                        {data:"visitors"},
                        {data:"new_visitors"},
                        {data:"avg_staytime"},
                        {data:"avg_loadtime"},
                        {data:"avg_pagepixels"},
                        {data:"bounce_rate"},
                        {data:"active_visitors"}
                    ],
                    sub: {
                        "geo":{
                            xtype:"tabpanel",
                            subTitle:LANG("访客地区"),
                            params:{},
                            addParams: {
                                condition : '{keys}'
                            },
                            items:[
                                {
                                    text:LANG("省份"),
                                    

                                    html:'<div class="theList_region"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_region"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "geo",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {data:"region_name",width:"150px",compare:false},
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{region_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "geo",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{region_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true,
                                                icon: {
                                                    col: 1,
                                                    pos: 0,
                                                    type:"geo",
                                                    name:"country_icon",
                                                    title:"country_name"
                                                }
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                },
                                {
                                    text:LANG("城市"),
                                    scope:true,
                                    html:'<div class="theList_city"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_city"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "city",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {
                                                        data:"city_name",
                                                        width:"150px",
                                                        compare:false,
                                                        render:function(key,i,row){
                                                            var client = this._getCollection().getModelDataAt(row).x_axis;
                                                            return client.region_name + " " + client.city_name ;
                                                        }
                                                    },
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{city_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "city",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{city_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                }
                            ]
                        },
                        "stayslot":{
                            xtype: "grid",
                            subTitle:LANG("停留时间"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "stayslot",
                                order: "stayslot|-1",
                                limit: 10
                            },
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            colModel:[
                                {data:"stayslot_name"},
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"bounce_rate",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        },
                        "depath":{
                            xtype: "grid",
                            subTitle:LANG("访问深度"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "depth",
                                order: "depth|-1",
                                limit: 10
                            },
                            colModel:[
                                {data:"depth_name"},
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"bounce_rate",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        }
                    },
                    ellipsis:45,
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "def":{
                    xtype: "grid",
                    subTitle:LANG("广告内容"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "gutm_content",
                        order: "pageviews|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"gutm_content_name"},
                        {
                            data:null,
                            xModule:{
                                "visit":{
                                    type:"poptip",
                                    url: "/statistic/visitordetail",
                                    params: {
                                        "site_id":site_id
                                    },
                                    addParams: {
                                        condition : '{keys}',
                                        out: 'html'
                                    },
                                    width:850,
                                    height:460,
                                    title:LANG("{gutm_content_name} 的访客列表"),
                                    boxType:"center"
                                },
                                "linkage":{
                                    type:"poptip",
                                    target:"theList_digg_chart",
                                    params:{
                                        type: "gutm_content",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{gutm_content_name} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            compare:false,
                            width:30,
                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                        },
                        {data:"pageviews"},
                        {data:"sessions"},
                        {data:"visitors"},
                        {data:"new_visitors"},
                        {data:"avg_staytime"},
                        {data:"avg_loadtime"},
                        {data:"avg_pagepixels"},
                        {data:"bounce_rate"},
                        {data:"active_visitors"}
                    ],
                    sub: {
                        "geo":{
                            xtype:"tabpanel",
                            subTitle:LANG("访客地区"),
                            params:{},
                            addParams: {
                                condition : '{keys}'
                            },
                            items:[
                                {
                                    text:LANG("省份"),
                                    scope:true,
                                    html:'<div class="theList_region"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_region"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "geo",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {data:"region_name",width:"150px",compare:false},
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{region_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "geo",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{region_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true,
                                                icon: {
                                                    col: 1,
                                                    pos: 0,
                                                    type:"geo",
                                                    name:"country_icon",
                                                    title:"country_name"
                                                }
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                },
                                {
                                    text:LANG("城市"),
                                    scope:true,
                                    html:'<div class="theList_city"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_city"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "city",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {
                                                        data:"city_name",
                                                        width:"150px",
                                                        compare:false,
                                                        render:function(key,i,row){
                                                            var client = this._getCollection().getModelDataAt(row).x_axis;
                                                            return client.region_name + " " + client.city_name ;
                                                        }
                                                    },
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{city_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "city",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{city_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                }
                            ]
                        },
                        "stayslot":{
                            xtype: "grid",
                            subTitle:LANG("停留时间"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "stayslot",
                                order: "stayslot|-1",
                                limit: 10
                            },
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            colModel:[
                                {data:"stayslot_name"},
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"bounce_rate",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        },
                        "depath":{
                            xtype: "grid",
                            subTitle:LANG("访问深度"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "depth",
                                order: "depth|-1",
                                limit: 10
                            },
                            colModel:[
                                {data:"depth_name"},
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"bounce_rate",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        }
                    },
                    ellipsis:45,
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "geo":{
                    xtype:"tabpanel",
                    subTitle:LANG("访客地区"),
                    params:{},
                    addParams: {
                        condition : '{keys}'
                    },
                    items:[
                        {
                            text:LANG("省份"),
                            scope:true,
                            html:'<div class="theList_region"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_region"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "geo",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"region_name",width:"150px",compare:false},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{region_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "geo",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{region_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true,
                                        icon: {
                                            col: 1,
                                            pos: 0,
                                            type:"geo",
                                            name:"country_icon",
                                            title:"country_name"
                                        }
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        },
                        {
                            text:LANG("城市"),
                            scope:true,
                            html:'<div class="theList_city"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_city"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "city",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {
                                                data:"city_name",
                                                width:"150px",
                                                compare:false,
                                                render:function(key,i,row){
                                                    var client = this._getCollection().getModelDataAt(row).x_axis;
                                                    return client.region_name + " " + client.city_name ;
                                                }
                                            },
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{city_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "city",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{city_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        }
                    ]
                },
                "stayslot":{
                    xtype: "grid",
                    subTitle:LANG("停留时间"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "stayslot",
                        order: "stayslot|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"stayslot_name"},
                        {data:"sessions",sort:true},
                        {data:"pageviews",sort:true},
                        {data:"visitors",sort:true},
                        {data:"bounce_rate",sort:true},
                        {data:"reserve0",sort:true},
                        {data:"reserve1",sort:true},
                        {data:"reserve2",sort:true},
                        {data:"reserve3",sort:true}
                    ],
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "depath":{
                    xtype: "grid",
                    subTitle:LANG("访问深度"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "depth",
                        order: "depth|-1",
                        limit: 10
                    },
                    colModel:[
                        {data:"depth_name"},
                        {data:"sessions",sort:true},
                        {data:"pageviews",sort:true},
                        {data:"visitors",sort:true},
                        {data:"bounce_rate",sort:true},
                        {data:"reserve0",sort:true},
                        {data:"reserve1",sort:true},
                        {data:"reserve2",sort:true},
                        {data:"reserve3",sort:true}
                    ],
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                }
            },
            filter:{
                type:"ad_gutm_medium_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            ExportExcel: true,
            showMark:false,
            showTotal: true
        },
        "gutm_source":{
            colModel:[
                {data:"gutm_source_name",
                    render:function(key,i,row){
                        return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                    }
                },
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            height:460,
                            title:LANG("{gutm_source_name} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            type:"poptip",
                            target:"theList_digg_chart",
                            params:{
                                type: "gutm_source",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{gutm_source_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    compare:false,
                    width:30,
                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"},
                {data:"active_visitors"}
            ],
            sub: {
                "def":{
                    xtype: "grid",
                    subTitle:LANG("广告"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "gutm_campaign",
                        order: "pageviews|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"gutm_campaign_name"},
                        {
                            data:null,
                            xModule:{
                                "visit":{
                                    type:"poptip",
                                    url: "/statistic/visitordetail",
                                    params: {
                                        "site_id":site_id
                                    },
                                    addParams: {
                                        condition : '{keys}',
                                        out: 'html'
                                    },
                                    width:850,
                                    height:460,
                                    title:LANG("{gutm_campaign_name} 的访客列表"),
                                    boxType:"center"
                                },
                                "linkage":{
                                    type:"poptip",
                                    target:"theList_digg_chart",
                                    params:{
                                        type: "gutm_campaign",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{gutm_campaign_name} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            compare:false,
                            width:30,
                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                        },
                        {data:"pageviews"},
                        {data:"sessions"},
                        {data:"visitors"},
                        {data:"new_visitors"},
                        {data:"avg_staytime"},
                        {data:"avg_loadtime"},
                        {data:"avg_pagepixels"},
                        {data:"bounce_rate"},
                        {data:"active_visitors"}
                    ],
                    sub: {
                        "geo":{
                            xtype:"tabpanel",
                            subTitle:LANG("访客地区"),
                            params:{},
                            addParams: {
                                condition : '{keys}'
                            },
                            items:[
                                {
                                    text:LANG("省份"),
                                    scope:true,
                                    html:'<div class="theList_region"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_region"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "geo",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {data:"region_name",width:"150px",compare:false},
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{region_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "geo",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{region_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true,
                                                icon: {
                                                    col: 1,
                                                    pos: 0,
                                                    type:"geo",
                                                    name:"country_icon",
                                                    title:"country_name"
                                                }
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                },
                                {
                                    text:LANG("城市"),
                                    scope:true,
                                    html:'<div class="theList_city"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_city"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "city",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {
                                                        data:"city_name",
                                                        width:"150px",
                                                        compare:false,
                                                        render:function(key,i,row){
                                                            var client = this._getCollection().getModelDataAt(row).x_axis;
                                                            return client.region_name + " " + client.city_name ;
                                                        }
                                                    },
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{city_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "city",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{city_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                }
                            ]
                        },
                        "stayslot":{
                            xtype: "grid",
                            subTitle:LANG("停留时间"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "stayslot",
                                order: "stayslot|-1",
                                limit: 10
                            },
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            colModel:[
                                {data:"stayslot_name"},
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"bounce_rate",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        },
                        "depath":{
                            xtype: "grid",
                            subTitle:LANG("访问深度"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "depth",
                                order: "depth|-1",
                                limit: 10
                            },
                            colModel:[
                                {data:"depth_name"},
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"bounce_rate",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        }
                    },
                    ellipsis:45,
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "def":{
                    xtype: "grid",
                    subTitle:LANG("广告内容"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "gutm_content",
                        order: "pageviews|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"gutm_content_name"},
                        {
                            data:null,
                            xModule:{
                                "visit":{
                                    type:"poptip",
                                    url: "/statistic/visitordetail",
                                    params: {
                                        "site_id":site_id
                                    },
                                    addParams: {
                                        condition : '{keys}',
                                        out: 'html'
                                    },
                                    width:850,
                                    height:460,
                                    title:LANG("{gutm_content_name} 的访客列表"),
                                    boxType:"center"
                                },
                                "linkage":{
                                    type:"poptip",
                                    target:"theList_digg_chart",
                                    params:{
                                        type: "gutm_content",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{gutm_content_name} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            compare:false,
                            width:30,
                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                        },
                        {data:"pageviews"},
                        {data:"sessions"},
                        {data:"visitors"},
                        {data:"new_visitors"},
                        {data:"avg_staytime"},
                        {data:"avg_loadtime"},
                        {data:"avg_pagepixels"},
                        {data:"bounce_rate"},
                        {data:"active_visitors"}
                    ],
                    sub: {
                        "geo":{
                            xtype:"tabpanel",
                            subTitle:LANG("访客地区"),
                            params:{},
                            addParams: {
                                condition : '{keys}'
                            },
                            items:[
                                {
                                    text:LANG("省份"),
                                    scope:true,
                                    html:'<div class="theList_region"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_region"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "geo",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {data:"region_name",width:"150px",compare:false},
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{region_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "geo",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{region_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true,
                                                icon: {
                                                    col: 1,
                                                    pos: 0,
                                                    type:"geo",
                                                    name:"country_icon",
                                                    title:"country_name"
                                                }
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                },
                                {
                                    text:LANG("城市"),
                                    scope:true,
                                    html:'<div class="theList_city"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_city"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "city",
                                                    order: "pageviews|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {
                                                        data:"city_name",
                                                        width:"150px",
                                                        compare:false,
                                                        render:function(key,i,row){
                                                            var client = this._getCollection().getModelDataAt(row).x_axis;
                                                            return client.region_name + " " + client.city_name ;
                                                        }
                                                    },
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{city_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "city",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{city_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                }
                            ]
                        },
                        "stayslot":{
                            xtype: "grid",
                            subTitle:LANG("停留时间"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "stayslot",
                                order: "stayslot|-1",
                                limit: 10
                            },
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            colModel:[
                                {data:"stayslot_name"},
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"bounce_rate",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        },
                        "depath":{
                            xtype: "grid",
                            subTitle:LANG("访问深度"),
                            router: {
                                model: "feed",
                                defaultAction: "group",
                                type: null
                            },
                            params: {
                                site_id: site_id,
                                type: "depth",
                                order: "depth|-1",
                                limit: 10
                            },
                            colModel:[
                                {data:"depth_name"},
                                {data:"sessions",sort:true},
                                {data:"pageviews",sort:true},
                                {data:"visitors",sort:true},
                                {data:"bounce_rate",sort:true},
                                {data:"reserve0",sort:true},
                                {data:"reserve1",sort:true},
                                {data:"reserve2",sort:true},
                                {data:"reserve3",sort:true}
                            ],
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            showPage: true,
                            ExportExcel: true,
                            alwaysRefresh: true
                        }
                    },
                    ellipsis:45,
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "geo":{
                    xtype:"tabpanel",
                    subTitle:LANG("访客地区"),
                    params:{},
                    addParams: {
                        condition : '{keys}'
                    },
                    items:[
                        {
                            text:LANG("省份"),
                            scope:true,
                            html:'<div class="theList_region"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_region"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "geo",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"region_name",width:"150px",compare:false},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{region_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "geo",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{region_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true,
                                        icon: {
                                            col: 1,
                                            pos: 0,
                                            type:"geo",
                                            name:"country_icon",
                                            title:"country_name"
                                        }
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        },
                        {
                            text:LANG("城市"),
                            scope:true,
                            html:'<div class="theList_city"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_city"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "city",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {
                                                data:"city_name",
                                                width:"150px",
                                                compare:false,
                                                render:function(key,i,row){
                                                    var client = this._getCollection().getModelDataAt(row).x_axis;
                                                    return client.region_name + " " + client.city_name ;
                                                }
                                            },
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{city_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "city",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{city_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        }
                    ]
                },
                "stayslot":{
                    xtype: "grid",
                    subTitle:LANG("停留时间"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "stayslot",
                        order: "stayslot|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"stayslot_name"},
                        {data:"sessions",sort:true},
                        {data:"pageviews",sort:true},
                        {data:"visitors",sort:true},
                        {data:"bounce_rate",sort:true},
                        {data:"reserve0",sort:true},
                        {data:"reserve1",sort:true},
                        {data:"reserve2",sort:true},
                        {data:"reserve3",sort:true}
                    ],
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "depath":{
                    xtype: "grid",
                    subTitle:LANG("访问深度"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "depth",
                        order: "depth|-1",
                        limit: 10
                    },
                    colModel:[
                        {data:"depth_name"},
                        {data:"sessions",sort:true},
                        {data:"pageviews",sort:true},
                        {data:"visitors",sort:true},
                        {data:"bounce_rate",sort:true},
                        {data:"reserve0",sort:true},
                        {data:"reserve1",sort:true},
                        {data:"reserve2",sort:true},
                        {data:"reserve3",sort:true}
                    ],
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                }

            },
            filter:{
                type:"ad_gutm_source_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            ExportExcel: true,
            showMark:false,
            showTotal: true
        },
        "gutm_term":{
            colModel:[
                {data:"gutm_term_name",
                    render:function(key,i,row){
                        return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                    }
                },
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            height:460,
                            title:LANG("{gutm_term_name} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            type:"poptip",
                            target:"theList_digg_chart",
                            params:{
                                type: "gutm_term",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{gutm_term_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    compare:false,
                    width:30,
                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"},
                {data:"active_visitors"}
            ],
            sub: {
                /*搜索引擎*/
                "se":{
                    xtype: "grid",
                    subTitle:LANG("搜索引擎"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        type: "se",
                        order: "pageviews|-1",
                        site_id: site_id,
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"se_name"/*,width:"80px"*/},
                        {
                            data:null,
                            xModule:{
                                "visit":{
                                    type:"poptip",
                                    url: "/statistic/visitordetail",
                                    params: {
                                        "site_id":site_id,
                                    },
                                    addParams: {
                                        condition : '{keys}',
                                        out: 'html',
                                    },
                                    width:850,
                                    height:460,
                                    title:LANG("{se_name} 的访客列表"),
                                    boxType:"center"
                                },
                                "linkage":{
                                    target:"theList_digg_chart",
                                    type:"poptip",
                                    params:{
                                        type: "se",
                                        site_id: site_id
                                    },
                                    addParams: {
                                        condition : "{keys}"
                                    },
                                    title:LANG("{se_name} 趋势图"),
                                    width:800,
                                    boxType:"center",
                                    height:300
                                }
                            },
                            tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                        },
                        {data:"pageviews"},
                        {data:"sessions"},
                        {data:"visitors"},
                        {data:"new_visitors"},
                        {data:"avg_staytime"},
                        {data:"avg_loadtime"},
                        {data:"avg_pagepixels"},
                        {data:"bounce_rate"},
                        {data:"active_visitors"}
                    ],
                    sub: {
                        "def":{
                            xtype: "grid",
                            subTitle:LANG("关键词"),
                            params: {
                                site_id: site_id,
                                type: "keyword",
                                order: "pageviews|-1",
                                limit: 10
                            },
                            addParams: {
                                begindate: function(){return Clicki.manager.getDate().beginDate},
                                enddate: function(){return Clicki.manager.getDate().endDate},
                                "condition": "{keys}"
                            },
                            colModel:[
                                {data:"keyword_name",width:"25%",render:function(key,i,row){
                                    var _se = {
                                        "10000":"http://www.baidu.com/s?wd=",
                                        "10002":"https://www.google.com/search?q=",
                                        "10003":"http://www.sogou.com/web?query=",
                                        "10004":"http://www.soso.com/q?w=",
                                        "10001":"http://cn.bing.com/search?q=",
                                        "10005":"http://www.youdao.com/search?q="
                                    };
                                    var seName = this._getCollection().getParams().condition.split("|")[1];
                                    var _key = encodeURIComponent(key);
                                    return '<a href="'+(_se[seName]+_key)+'" target="_blank">'+key+'</a>';
                                }},
                                {
                                    data:null,
                                    xModule:{
                                        "visit":{
                                            type:"poptip",
                                            url: "/statistic/visitordetail",
                                            params: {
                                                "site_id":site_id
                                            },
                                            addParams: {
                                                condition : '{keys}',
                                                out: 'html'
                                            },
                                            height:460,
                                            title:LANG("{keyword_name} 的访客列表"),
                                            width:850,
                                            boxType:"center"
                                        },
                                        "linkage":{
                                            target:"theList_digg_chart",
                                            type:"poptip",
                                            params:{
                                                type: "keyword",
                                                site_id: site_id
                                            },
                                            addParams: {
                                                condition : "{keys}"
                                            },
                                            title:LANG("{keyword_name} 趋势图"),
                                            width:800,
                                            boxType:"center",
                                            height:300
                                        }
                                    },
                                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访问明细")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                },
                                {data:"pageviews"},
                                {data:"sessions"},
                                {data:"visitors"},
                                {data:"new_visitors"},
                                {data:"bounce_rate"},
                                {data:"avg_staytime"},
                                {data:"avg_loadtime"}
                            ],
                            showPage: true,
                            alwaysRefresh: true,
                            ExportExcel: true
                        },
                        "geo":{
                            xtype:"tabpanel",
                            subTitle:LANG("访客地区"),
                            params:{},
                            addParams: {
                                condition : '{keys}'
                            },
                            items:[
                                {
                                    text:LANG("省份"),
                                    scope:true,
                                    html:'<div class="theList_region"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_region"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "geo",
                                                    order: "sessions|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {data:"region_name",width:"150px",compare:false},
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{region_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "geo",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{region_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true,
                                                icon: {
                                                    col: 1,
                                                    pos: 0,
                                                    type:"geo",
                                                    name:"country_icon",
                                                    title:"country_name"
                                                }
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                },
                                {
                                    text:LANG("城市"),
                                    scope:true,
                                    html:'<div class="theList_city"></div>',
                                    afterRender:function(mAttributes){
                                        var set = {groups:{}};
                                        set.groups["theList_city"+this.parent.target] = {
                                            type:"grid",
                                            setting:{
                                                router: {
                                                    model: "feed",
                                                    defaultAction: "group",
                                                    type: null
                                                },
                                                params: {
                                                    type: "city",
                                                    order: "sessions|-1",
                                                    site_id: site_id,
                                                    begindate:Clicki.manager.getDate().beginDate,
                                                    enddate:Clicki.manager.getDate().endDate,
                                                    condition : this.parent.params.condition
                                                },
                                                colModel:[
                                                    {
                                                        data:"city_name",
                                                        width:"150px",
                                                        compare:false,
                                                        render:function(key,i,row){
                                                            var client = this._getCollection().getModelDataAt(row).x_axis;
                                                            return client.region_name + " " + client.city_name ;
                                                        }
                                                    },
                                                    {
                                                        data:null,
                                                        xModule:{
                                                            "visit":{
                                                                type:"poptip",
                                                                url: "/statistic/visitordetail",
                                                                params: {
                                                                    "site_id":site_id
                                                                },
                                                                addParams: {
                                                                    condition : '{keys}',
                                                                    out: 'html'
                                                                },
                                                                width:850,
                                                                height:460,
                                                                title:LANG("{city_name} 的访客列表"),
                                                                boxType:"center"
                                                            },
                                                            "linkage":{
                                                                target:"theList_digg_chart",
                                                                type:"poptip",
                                                                params:{
                                                                    type: "city",
                                                                    site_id: site_id
                                                                },
                                                                addParams: {
                                                                    condition : "{keys}"
                                                                },
                                                                title:LANG("{city_name} 趋势图"),
                                                                width:800,
                                                                boxType:"center",
                                                                height:300
                                                            }
                                                        },
                                                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                                    },
                                                    {data:"pageviews"},
                                                    {data:"sessions"},
                                                    {data:"visitors"},
                                                    {data:"new_visitors"},
                                                    {data:"avg_staytime"},
                                                    {data:"avg_loadtime"},
                                                    {data:"avg_pagepixels"},
                                                    {data:"bounce_rate"},
                                                    {data:"active_visitors"}
                                                ],
                                                target: mAttributes.dom.find("div:first"),
                                                ExportExcel: true
                                            }
                                        };
                                        Clicki.manager.add(set);
                                        set = null;
                                    }
                                }
                            ]
                        }
                    },
                    ExportExcel: true,
                    icon: {
                        col: 1,
                        pos: 0,
                        type:"se",
                        name:"se_icon"
                    }
                },
                "geo":{
                    xtype:"tabpanel",
                    subTitle:LANG("访客地区"),
                    params:{},
                    addParams: {
                        condition : '{keys}'
                    },
                    items:[
                        {
                            text:LANG("省份"),
                            scope:true,
                            html:'<div class="theList_region"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_region"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "geo",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {data:"region_name",width:"150px",compare:false},
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{region_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "geo",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{region_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true,
                                        icon: {
                                            col: 1,
                                            pos: 0,
                                            type:"geo",
                                            name:"country_icon",
                                            title:"country_name"
                                        }
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        },
                        {
                            text:LANG("城市"),
                            scope:true,
                            html:'<div class="theList_city"></div>',
                            afterRender:function(mAttributes){
                                var set = {groups:{}};
                                set.groups["theList_city"+this.parent.target] = {
                                    type:"grid",
                                    setting:{
                                        router: {
                                            model: "feed",
                                            defaultAction: "group",
                                            type: null
                                        },
                                        params: {
                                            type: "city",
                                            order: "pageviews|-1",
                                            site_id: site_id,
                                            begindate:Clicki.manager.getDate().beginDate,
                                            enddate:Clicki.manager.getDate().endDate,
                                            condition : this.parent.params.condition
                                        },
                                        colModel:[
                                            {
                                                data:"city_name",
                                                width:"150px",
                                                compare:false,
                                                render:function(key,i,row){
                                                    var client = this._getCollection().getModelDataAt(row).x_axis;
                                                    return client.region_name + " " + client.city_name ;
                                                }
                                            },
                                            {
                                                data:null,
                                                xModule:{
                                                    "visit":{
                                                        type:"poptip",
                                                        url: "/statistic/visitordetail",
                                                        params: {
                                                            "site_id":site_id
                                                        },
                                                        addParams: {
                                                            condition : '{keys}',
                                                            out: 'html'
                                                        },
                                                        width:850,
                                                        height:460,
                                                        title:LANG("{city_name} 的访客列表"),
                                                        boxType:"center"
                                                    },
                                                    "linkage":{
                                                        target:"theList_digg_chart",
                                                        type:"poptip",
                                                        params:{
                                                            type: "city",
                                                            site_id: site_id
                                                        },
                                                        addParams: {
                                                            condition : "{keys}"
                                                        },
                                                        title:LANG("{city_name} 趋势图"),
                                                        width:800,
                                                        boxType:"center",
                                                        height:300
                                                    }
                                                },
                                                tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                                            },
                                            {data:"pageviews"},
                                            {data:"sessions"},
                                            {data:"visitors"},
                                            {data:"new_visitors"},
                                            {data:"avg_staytime"},
                                            {data:"avg_loadtime"},
                                            {data:"avg_pagepixels"},
                                            {data:"bounce_rate"},
                                            {data:"active_visitors"}
                                        ],
                                        target: mAttributes.dom.find("div:first"),
                                        ExportExcel: true
                                    }
                                };
                                Clicki.manager.add(set);
                                set = null;
                            }
                        }
                    ]
                },
                "stayslot":{
                    xtype: "grid",
                    subTitle:LANG("停留时间"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "stayslot",
                        order: "stayslot|-1",
                        limit: 10
                    },
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    colModel:[
                        {data:"stayslot_name"},
                        {data:"sessions",sort:true},
                        {data:"pageviews",sort:true},
                        {data:"visitors",sort:true},
                        {data:"bounce_rate",sort:true},
                        {data:"reserve0",sort:true},
                        {data:"reserve1",sort:true},
                        {data:"reserve2",sort:true},
                        {data:"reserve3",sort:true}
                    ],
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                },
                "depath":{
                    xtype: "grid",
                    subTitle:LANG("访问深度"),
                    router: {
                        model: "feed",
                        defaultAction: "group",
                        type: null
                    },
                    params: {
                        site_id: site_id,
                        type: "depth",
                        order: "depth|-1",
                        limit: 10
                    },
                    colModel:[
                        {data:"depth_name"},
                        {data:"sessions",sort:true},
                        {data:"pageviews",sort:true},
                        {data:"visitors",sort:true},
                        {data:"bounce_rate",sort:true},
                        {data:"reserve0",sort:true},
                        {data:"reserve1",sort:true},
                        {data:"reserve2",sort:true},
                        {data:"reserve3",sort:true}
                    ],
                    addParams: {
                        begindate: function(){return Clicki.manager.getDate().beginDate},
                        enddate: function(){return Clicki.manager.getDate().endDate},
                        "condition": "{keys}"
                    },
                    showPage: true,
                    ExportExcel: true,
                    alwaysRefresh: true
                }
            },
            filter:{
                type:"ad_gutm_term_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            ExportExcel: true,
            showMark:false,
            showTotal: true
        },
        "depth":{
            colModel:[
                {data:"depth_name",
                    width:"120px",
                    render:function(key,i,row){
                        return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                    }
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"}
            ],
            title: "访问深度数据表3",
            filter:{
                type:"depth_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")},
                    "avg_pagepixels":{text:LANG("面积像素")}
                }
            },
            ExportExcel: true,
            showMark:false,
            showTotal: true
        },
        "stayslot":{
            colModel:[
                {data:"stayslot_name",width:"120px",render:function(key,i,row){
                    return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                }},
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"}
            ],
            title: LANG("停留时间数据表"),
            filter:{
                type:"stayslot_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            ExportExcel: true,
            showMark:false,
            showTotal: true
        },
        "reviewslot":{
            colModel:[
                {data:"reviewslot_name",width:"120px",render:function(key,i,row){
                    return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                }},
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"}
            ],
            title: LANG("访问次数数据表"),
            filter:{
                type:"reviewslot_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            ExportExcel: true,
            showMark:false,
            showTotal: true
        },
        "geo":{
            title: LANG("访客省份数据表"),
            colModel:[
                {data:"region_name",width:"150px",render:function(key,i,row){
                    return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                },compare:false},
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            height:460,
                            title:LANG("{region_name} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            target:"theList_digg_chart",
                            type:"poptip",
                            params:{
                                type: "geo",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:"{region_name} 最近30天趋势",
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"},
                {data:"active_visitors"}
            ],
            sub:{
                xtype:"grid",
                params : {
                    site_id: site_id,
                    type: "city",
                    order: "pageviews|-1",
                },
                addParams: {
                    begindate: function(){return Clicki.manager.getDate().beginDate},
                    enddate: function(){return Clicki.manager.getDate().endDate},
                    "condition" : "{keys}"
                },
                colModel:[
                    {data:"city_name"},
                    {
                        data:null,
                        xModule:{
                            "visit":{
                                type:"poptip",
                                url: "/statistic/visitordetail",
                                params: {
                                    "site_id":site_id
                                },
                                addParams: {
                                    condition : '{keys}',
                                    out: 'html'
                                },
                                width:850,
                                height:460,
                                title:LANG("{city_name} 的访客列表"),
                                boxType:"center"
                            },
                            "linkage":{
                                target:"theList_digg_chart",
                                type:"poptip",
                                params:{
                                    type: "city",
                                    site_id: site_id
                                },
                                addParams: {
                                    condition : "{keys}"
                                },
                                title:LANG("{city_name} 趋势图"),
                                width:800,
                                boxType:"center",
                                height:300
                            }
                        },
                        tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                    },
                    {data:"pageviews"},
                    {data:"sessions"},
                    {data:"visitors"},
                    {data:"new_visitors"},
                    {data:"avg_staytime"},
                    {data:"avg_loadtime"},
                    {data:"avg_pagepixels"},
                    {data:"bounce_rate"},
                    {data:"active_visitors"}
                ],
                showPage:true,
                alwaysRefresh:true,
                ExportExcel: true
            },
            filter:{
                type:"region_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            showTotal: true,
            showMark:false,
            ExportExcel: true,
            icon: {
                col: 1,
                pos: 0,
                type:"geo",
                name:"country_icon",
                title:"country_name"
            }
        },
        "city":{
            title: LANG("访客城市数据表"),
            colModel:[
                {
                    data:"city_name",
                    width:"150px",
                    compare:false,
                    render:function(key,i,row){
                        var client = this._getCollection().getModelDataAt(row).x_axis;
                        return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" />'+client.region_name + " " + client.city_name ;
                    }
                },
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            height:460,
                            title:LANG("{city_name} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            target:"theList_digg_chart",
                            type:"poptip",
                            params:{
                                type: "city",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{city_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"},
                {data:"active_visitors"}
            ],
            filter:{
                type:"city_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate","active_visitors"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            showTotal: true,
            showMark:false,
            ExportExcel: true
        },
        "os_type":{
            colModel:[
                {data:"os_type_name",render:function(key,i,row){
                    return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                },width:"120px"},
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            height:460,
                            width:850,
                            title:LANG("{os_type_name} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            target:"theList_digg_chart",
                            type:"poptip",
                            params:{
                                type: "os_type",
                                site_id: site_id
                            },
                            addParams: {
                                condition:"{keys}"
                            },
                            title:LANG("{os_type_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    compare:false,
                    tpl:"<span class=\"theCtrlListR\"><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"}
            ],
            filter:{
                type:"client_os_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            ExportExcel: true,
            title: LANG("操作系统数据表"),
            icon: {
                col: 1,
                pos: 0,
                type:"os",
                name:"os_icon"
            },
            showMark:false,
            showTotal: true
        },
        "browser_type":{
            colModel:[
                {data:"browser_type_name",render:function(key,i,row){
                    return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                },width:"120px"},
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            height:460,
                            title:LANG("{browser_type_name} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            target:"theList_digg_chart",
                            type:"poptip",
                            params:{
                                type: "browser_type",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{browser_type_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    compare:false,
                    tpl:"<span class=\"theCtrlListR\"><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"}
            ],
            filter:{
                type:"client_browser_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            title: LANG("浏览器数据表"),
            icon: {
                col: 1,
                pos: 0,
                type:"browser",
                name:"browser_icon"
            },
            ExportExcel:true,
            showTotal: true
            //colWidth: ["auto", "12%", "12%", "12%", "12%", "12%"]
        },
        "resolution":{
            colModel:[
                {data:"resolution_name",render:function(key,i,row){
                    return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                },width:"120px"},
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            height:460,
                            title:LANG("{resolution_name} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            target:"theList_digg_chart",
                            type:"poptip",
                            params:{
                                type: "resolution",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{resolution_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    tpl:"<span class=\"theCtrlListR\"><%= key %><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"}
            ],
            filter:{
                type:"client_resolution_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            ExportExcel: true,
            title: LANG("分辨率数据表"),
            showMark:false,
            showTotal: true
        },
        "language":{
            colModel:[
                {data:"language_name",render:function(key,i,row){
                    return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                },width:"120px"},
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            title:LANG("{language_name} 的访客列表"),
                            height:460,
                            boxType:"center"
                        },
                        "linkage":{
                            target:"theList_digg_chart",
                            type:"poptip",
                            params:{
                                type: "language",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{language_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    compare:false,
                    tpl:"<span class=\"theCtrlListR\"><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"}
            ],
            filter:{
                type:"client_language_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            title: LANG("语言数据表"),
            ExportExcel: true,
            showMark:false,
            showTotal: true
        },
        "isp":{
            title: LANG("网络接入商数据表"),
            showTotal: true,
            showMark:false,
            ExportExcel: true,
            colModel:[
                {data:"isp_name",render:function(key,i,row){
                    return '<input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" /><label>'+key+'</label>';
                },width:"120px"},
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition : '{keys}',
                                out: 'html'
                            },
                            width:850,
                            height:460,
                            title:LANG("{isp_name} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            target:"theList_digg_chart",
                            type:"poptip",
                            params:{
                                type: "isp",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{isp_name} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    compare:false,
                    tpl:"<span class=\"theCtrlListR\"><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"},
                {data:"avg_pagepixels"},
                {data:"bounce_rate"}
            ],
            filter:{
                type:"isp_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            }
        },
        "page_entrance":{
            title:LANG("入口页数据表"),
            colModel:[
                {data:"entrance_url_name",compare:false,
                    render:function(_str,i,row,href){
                        var collection = this._getCollection();
                        var ms = collection.getAllModelData()[row];

                        return '<em title="'+ ms.x_axis.entrance_url_title + '"><input type="checkbox" name="lat" class="diggClassLat" value="'+row+'" />'+ms.x_axis.entrance_url_title.cutMixStr(0,30,"...")+'</em><br /><a href="'+ms.x_axis.entrance_url_name+'" target="_blank" title="'+LANG("在新页面打开")+'--'+ms.x_axis.entrance_url_name+'">'+ms.x_axis.entrance_url_name.cutMixStr(0,40,"...")+'</a>';
                    },
                    width:"290px"
                },
                {
                    data:null,
                    xModule:{
                        "visit":{
                            type:"poptip",
                            url: "/statistic/visitordetail",
                            params: {
                                "site_id":site_id
                            },
                            addParams: {
                                condition :'{keys}',
                                out: 'html'
                            },
                            width:850,
                            height:460,
                            title:LANG("{entrance_url_title} 的访客列表"),
                            boxType:"center"
                        },
                        "linkage":{
                            target:"theList_digg_chart",
                            type:"poptip",
                            params:{
                                type:"page_entrance",
                                site_id: site_id
                            },
                            addParams: {
                                condition : "{keys}"
                            },
                            title:LANG("{entrance_url_title} 趋势图"),
                            width:800,
                            boxType:"center",
                            height:300
                        }
                    },
                    tpl:"<span class=\"theCtrlListR\"><a href=\"#\" class=\"visitFlowIcon\" title=\""+LANG("访客列表")+"\" data-xtype=\"visit\"></a><a href=\"#\" class=\"linageChartIcon\" title=\""+LANG("图表")+"\" data-xtype=\"linkage\">"+LANG("图")+"</a></span>"
                },
                {data:"pageviews"},
                {data:"sessions"},
                {data:"visitors"},
                {data:"new_visitors"},
                {data:"bounce_rate"},
                {data:"avg_staytime"},
                {data:"avg_loadtime"}
            ],
            filter:{
                type:"landing_filter",
                "build":{
                    "def":{
                        text:LANG("默认"),
                        act:true,
                        build:["pageviews","sessions","visitors","new_visitors","avg_staytime","avg_loadtime","bounce_rate"]
                    },
                    "traffic":{text:LANG("流量指标"),build:["pageviews","sessions","visitors","new_visitors","old_visitors","new_pageviews","active_visitors"]},
                    "quality":{text:LANG("质量指标"),build:["avg_pagepixels","avg_staytime","avg_loadtime","avg_pageviews","bounces","bounce_rate"]},
                    
                    "custom":{text:LANG("自定义")}
                },
                "options":{
                    "pageviews":{text:"PV"},
                    "sessions":{text:LANG("访问次数")},
                    "visitors":{text:"UV"},
                    "new_visitors":{text:LANG("新访客数")},
                    "old_visitors":{text:LANG("回访数量")},
                    "avg_staytime":{text:LANG("平均停留时间")},
                    "avg_loadtime":{text:LANG("平均加载时间")},
                    "avg_pageviews":{text:LANG("平均访问深度")},
                    "avg_pagepixels":{text:LANG("平均页面像素")},
                    "bounces":{text:LANG("跳出次数")},
                    "bounce_rate":{text:LANG("跳出率")},
                    "reserve0":{text:LANG("注册")},
                    "reserve1":{text:LANG("邮件验证")},
                    "reserve2":{text:LANG("订单数")},
                    "reserve3":{text:LANG("订单金额")},
                    "reserve4":{text:LANG("订单确认")},
                    "new_pageviews":{text:"新访客PV"},
                    "active_visitors":{text:LANG("活跃用户")}
                }
            },
            showTotal: true,
            showMark:false,
            ExportExcel: true
        }
    }
});