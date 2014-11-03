define(function(require){
    ////****导入包
    var $ = require('jquery');
    var _ = require('underscore');
    var pop = require('pop_up');
    var Hchart = require('hcharts');
    require('teaxareaMaxlengthForIE')($);
    
/*var css = '\
    .admin-tab-left {text-align: left !important;}\
    .admin-tab-center{text-align:center !important;}';

var addCSS = Clicki.addCSS = function (id, css){
    id = 'algorithm_style_'+id;
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
}*/
/////////////////////////////////////////////////////////////////////
    ////****系统缓存记录
    var cache = {
        /*roles: null,      // 系统角色列表
        authorize: null,    // 系统全局权限列表
        sites: null,        // 网站列表*/
        popup1: null,       // 弹出对话框1
        popup2: null,       // 弹出对话框2
        impfil_popup: null,     // 弹出修改过滤/植入对话框
        chart_popup: null,      // 弹出制图对话框
        alert_pop:null, // 弹出警告框
        other_pop:null, // 其他弹出警告框
        /*rights: [],           // 用户网站权限缓存
        temp: null,         // 临时编辑权限缓存
        current: null,      // 当前权限项目
        users: null,        // 当前网站可选择权限
        role_id: 0,     // 指定某个角色*/
        scene_all_data: null,// scene的全局data
        scene_curr_data: null,// scene的data的当前params或者filter
        scene_curr_sceneData: null,// scene的data的当前params或者filter
        scene_curr_filterData: null,// scene申请的filter和implant的数据
        managerfilter_curr_data: null,// resulthandle的data的当前值
        uids:null,//手动干预点击推荐细目后的userid
        optionItem:[],//手动干预初始化的历史类别
        chart:null,// 制图对象
        ICF_chartData:null,
        UCF_chartData:null,
        DWR_chartData:null,
        optionCity:[]
    };
    ////制图默认设置
    var _chartDefult = {
        chart: {
            type: 'spline',
            width:654
        },
        yAxis: {
            title: {
                text: ''
            },
            allowDecimals: false,
            labels: {
                formatter: function() {
                    return this.value +'%'
                }
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineWidth: 1
                }
            }
        },
        series: [{
            marker: {
                symbol: 'diamond'
            }
        }]
    }
    
    ////把含有html标签转成原始字符串
    function htmlencode(str) {
        str = str.replace(/\&/g,"&amp");
        str = str.replace(/\</g,"&lt");
        str = str.replace(/\>/g,"&gt");
        str = str.replace(/\"/g,"&quot");
        str = str.replace(/\'/g,"&#39");//ie不支持&apos的实体名，所以改成&#39十进制编码
        return str;
    }

    ////判断是否是时间格式
    function isdate(str){   
        var   strSeparator   =   "-";   //日期分隔符   
        var   strDateArray;   
        var   intYear;   
        var   intMonth;   
        var   intDay;   
        var   boolLeapYear;   
        var strDate=str   //表单中的日期值
        if(strDate == undefined){
            strDateArray = [];
        }else{
            strDateArray   =   strDate.split(strSeparator);   
        }
          
        if(strDateArray.length!=3)    {   return   false;   }
          
        intYear   =   parseInt(strDateArray[0],10);   
        intMonth   =   parseInt(strDateArray[1],10);   
        //intDay   =   parseInt(strDateArray[2],10);
        intDay   =   strDateArray[2];  
          
        if(isNaN(intYear)||isNaN(intMonth)||isNaN(intDay))   {   return   false;   }
          
        if(intMonth>12||intMonth<1)    {   return   false;   }  
          
        if((intMonth==1||intMonth==3||intMonth==5||intMonth==7||intMonth==8||intMonth==10||intMonth==12)&&(intDay>31||intDay<1))   {    return   false;   }  
              
            if((intMonth==4||intMonth==6||intMonth==9||intMonth==11)&&(intDay>30||intDay<1))   {   return   false;   } 
              
            if(intMonth==2){   
                  if(intDay<1)   {   return   false;   }
                    
                  boolLeapYear   =   false;   
                  if((intYear%100)==0){   
                        if((intYear%400)==0)   boolLeapYear   =   true;   
                  }   
                  else{   
                        if((intYear%4)==0)   boolLeapYear   =   true;   
                  }   
                    
                  if(boolLeapYear){   
                        if(intDay>29) {  return   false;   }
                  }   
                  else{   
                        if(intDay>28)  {   return   false;   }
                  }   
            }   
            return   true;   
    }
    
    
    function compareDate(a,b,setp){
        var arr=a.split("-");
        var starttime=new Date(arr[0],arr[1],arr[2]);
        var starttimes=starttime.getTime();
        var arrs=b.split("-");
        var lktime=new Date(arrs[0],arrs[1],arrs[2]);
        var lktimes=lktime.getTime();
        if(starttimes>lktimes){
            //alert('开始时间大于离开时间，请检查');
            return false;
        }else{
            if(setp){
                var s = Date.UTC(arr[0], arr[1] - 1, arr[2]);
                var l = Date.UTC(arrs[0], arrs[1] - 1, arrs[2]);
                var t = (setp-1)*86400*1000;
                if(Math.abs(s - l) > t){
                    return false;
                }else{
                    return true;
                }
            }else{
                return true;
            }
            
        } 
    }
    
    ////****页面中间部分页面的渲染函数
    function setHtml(me, html, navid, name, title){
        //addCSS('main',css);
        
        if(!$.isEmptyObject(Clicki.manager.appCache)){
            Clicki.manager.destroy();
            /*尝试清除当前正在跑的计时器*/
            clearTimeout(setTimeout(function(){})-1);
        }
        Clicki.NavView.contentBox.find("*").unbind();
        Clicki.NavView.contentBox.html(html);
    
        if(me.beDo) me.beDo.run();
    
        $("#clickiNav").removeClass("main")
        $("#adminNav").addClass("main");
        
        if (title){
            var t = $('<div></div>').text(title).addClass('site-title-text');
            t.prepend('<a class="btnGray site-btn" href="JavaScript:history.go(-1);" style="float:left; width:30px; min-width:auto; margin:10px 20px 0 0;">'+LANG("返回")+'</a>');
            Clicki.NavView.contentBox.prepend(t);
        }
    
        // 设置路径
        me.testIfAfterF5(navid);
        //me.crumbs(name);
        Clicki.Balance();
    }
    
    ////****对返回的数据做undefined转空字符串处理
    function emptyString(str) {
        if(str == undefined || str == null) {
            return "";
        } else {
            return str;
        }
    }
    
    ////****返回两个数字或者字符串中的最大长度
    function maxLength(str1,str2,str3){
        var s1 = str1.toString();
        var s2 = str2.toString();
        var s3 = str3.toString();
        var arr = [s1.length,s2.length,s3.length];
        var larr = arr.sort(function(a,b){return a-b;});
        return larr[2];
    }
    
    ///////////////////////////////////////////////////基本弹出窗口的点击事件的函数//////////////////////////////////////////////////////////
    ////****弹出窗口点击确认后ajax异步提交数据的函数
    function private_save(url, data, callback,index,fresh){
        $(".theGridMarkLayout").show()
        $.ajax(url, {
            data: data,
            type: 'GET',
            dataType: 'json',
            success: function(result){
                $(".theGridMarkLayout").hide();
                if (result.success){
                    private_alert_noCancelBtn(LANG('保存成功!'), function(){
                        if (_.isFunction(callback)){
                            callback(result);
                        }else {
                            if(fresh){
                                ////手动刷新一下页面
                                window.location.reload();
                            }
                            Clicki.NavView.setDefaultActive(index, callback);
                        }
                    });
                }else {
                    if(result.message){
                        private_alert(result.message);
                    }
                    if(result.error){
                        private_alert(result.error);
                    }
                    return;
                }
            },
            error: function(){
                $(".theGridMarkLayout").hide();
                // 服务器连接解析错误
                private_alert("服务器连接解析错误");
            }
        })
    }
    
    ////****弹出窗口点击确认后ajax异步提交数据的函数无刷新
    function private_save_noRefrash(url, data, callback){
        $(".theGridMarkLayout").show()
        $.ajax(url, {
            data: data,
            type: 'GET',
            dataType: 'json',
            success: function(result){
                $(".theGridMarkLayout").hide();
                if (result.success){
                    private_alert_noCancelBtn(LANG('保存成功!'), function(){
                        if (_.isFunction(callback)){
                            callback(result);
                        }
                    });
                }else {
                    if(result.message){
                        private_alert(result.message);
                    }
                    if(result.error){
                        private_alert(result.error);
                    }
                    return;
                }
            },
            error: function(){
                $(".theGridMarkLayout").hide();
                // 服务器连接解析错误
                private_alert("服务器连接解析错误");
            }
        })
    }
    
    ////****弹出窗口的确认按钮函数
    function private_confirm(msg, callback){
        private_alert(msg, callback, true);
    }
    
    ////****弹出窗口的弹出函数
    function private_alert(msg, callback, confirm){
        //if (!cache.alert_pop){
            cache.alert_pop = new pop({
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
                "showClose":true,
                "showCtrl":true,
                onDone:function(){
                    if (this.msg_queue[0] && this.msg_queue[0][1]) this.msg_queue[0][1]();
                    this.msg_queue.shift();
                    if (this.msg_queue.length > 0){
                        this.content.text(this.msg_queue[0][0]);
                        //this.doms.cancelBnt.toggle(this.msg_queue[0][2]);
                        return;
                    }
                    /*this.hide();
                    this.showed = false;*/
                    //this.hide();
                    this.destroy();
                    cache.alert_pop = null;
                },
                onCancel: function(){
                    /*this.msg_queue.shift();
                    this.showed = false;
                    if (this.msg_queue.length > 0) this.show();*/
                    //this.hide();
                    this.destroy();
                    cache.alert_pop = null;
                },
                onClose:function(){
                    //this.hide();
                    this.destroy();
                    cache.alert_pop = null;
                },
                onRender: function(){
                    this.content = this.doms.inner.find('div:first').css('padding', '10px 10px 20px');
                    this.content.text(this.msg_queue[0][0]);
                    //this.doms.cancelBnt.toggle(this.msg_queue[0][2]);
                },
                beforeShow: function(){
                    this.showed = true;
                    if (this.content){
                        this.content.text(this.msg_queue[0][0]);
                        this.doms.cancelBnt.toggle(this.msg_queue[0][2]);
                    }
                },
                "data":null,
                "ready":false
            });
            cache.alert_pop.showed = false;
            cache.alert_pop.msg_queue = [];
        //}

        cache.alert_pop.msg_queue.push([msg, callback, confirm || false]);
        if (!cache.alert_pop.showed){
            cache.alert_pop.show();
        }
    }
    
    ////****弹出窗口无取消按钮的弹出函数
    function private_alert_noCancelBtn(msg, callback, confirm){
        //if (!cache.alert_pop){
            cache.alert_pop = new pop({
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
                        this.content.text(this.msg_queue[0][0]);
                        //this.doms.cancelBnt.toggle(this.msg_queue[0][2]);
                        return;
                    }
                    /*this.hide();
                    this.showed = false;*/
                    //this.hide();
                    this.destroy();
                    cache.alert_pop = null;
                },
                onClose:function(){
                    //this.hide();
                    this.destroy();
                    cache.alert_pop = null;
                },
                onRender: function(){
                    this.content = this.doms.inner.find('div:first').css('padding', '10px 10px 20px');
                    this.content.text(this.msg_queue[0][0]);
                    //this.doms.cancelBnt.toggle(this.msg_queue[0][2]);
                },
                beforeShow: function(){
                    this.showed = true;
                    if (this.content){
                        this.content.text(this.msg_queue[0][0]);
                        this.doms.cancelBnt.toggle(this.msg_queue[0][2]);
                    }
                    $(".Ex_popGuy .Ex_popGuyCtrl .Ex_BntIsFail").remove();
                },
                "data":null,
                "ready":false
            });
            cache.alert_pop.showed = false;
            cache.alert_pop.msg_queue = [];
        //}

        cache.alert_pop.msg_queue.push([msg, callback, confirm || false]);
        if (!cache.alert_pop.showed){
            cache.alert_pop.show();
        }
    }
    
    ////****弹出窗口无确定和取消按钮的弹出函数
    function private_alert_noCtrlBtn(msg, callback, confirm){
        //if (!cache.alert_pop){
            cache.alert_pop = new pop({
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
                "showClose":true,
                "showCtrl":false,
                onDone:function(){
                    if (this.msg_queue[0] && this.msg_queue[0][1]) this.msg_queue[0][1]();
                    this.msg_queue.shift();
                    if (this.msg_queue.length > 0){
                        this.content.text(this.msg_queue[0][0]);
                        //this.doms.cancelBnt.toggle(this.msg_queue[0][2]);
                        return;
                    }
                    /*this.hide();
                    this.showed = false;*/
                    //this.hide();
                    this.destroy();
                    cache.alert_pop = null;
                },
                onClose:function(){
                    //this.hide();
                    this.destroy();
                    cache.alert_pop = null;
                },
                onRender: function(){
                    this.content = this.doms.inner.find('div:first').css('padding', '10px 10px 20px');
                    this.content.text(this.msg_queue[0][0]);
                    //this.doms.cancelBnt.toggle(this.msg_queue[0][2]);
                },
                beforeShow: function(){
                    this.showed = true;
                    if (this.content){
                        this.content.text(this.msg_queue[0][0]);
                        this.doms.cancelBnt.toggle(this.msg_queue[0][2]);
                    }
                },
                "data":null,
                "ready":false
            });
            cache.alert_pop.showed = false;
            cache.alert_pop.msg_queue = [];
        //}

        cache.alert_pop.msg_queue.push([msg, callback, confirm || false]);
        if (!cache.alert_pop.showed){
            cache.alert_pop.show();
        }
    }
    
    ////////////////////////////////////////创建DOM的所有函数//////////////////////////////////////////////////////////////////////////////
    ////****创建"algorithmlist查看参数设置"的内容table
    function private_buildAlgorithmlistCheckTable(dom){
        dom.append('<div class="error_message"></div>');
        var tab = $('<table class="CheckParamsTable"></table>');
        tab.append('<tr><th class="tr_title" style="width:90px;">参数名称</th><th class="tr_title">取值</th><th class="tr_title" style="width:170px;">取值范围</th><th class="tr_title">参数描述</th></tr>');
        _.each(cache.scene_curr_data.params, function(groupObj,index){
            var row = $('<tr><td class="align_center"></td><td class="align_center"></td><td class="align_center"></td><td class="align_left"></td></tr>').appendTo(tab);
            var td = row.find('td');
            td.eq(0).html(groupObj.name);
            var maxL = maxLength(groupObj.min,groupObj.max,groupObj.min_unit);//////////////groupObj.min.length;
            td.eq(1).html('<input class="algorithmlist_params" maxlength="'+maxL+'" data-id='+groupObj.param_id+' type="text" value='+(groupObj.value!==undefined?groupObj.value:groupObj.default_value)+' />');
            td.eq(2).html(groupObj.min+'~'+groupObj.max+ ',(默认'+groupObj.default_value+',最小单位'+groupObj.min_unit+')');
            td.eq(3).html(groupObj.remark);
            tab.append(row);
        });
        tab.appendTo(dom);
    }
    
    ////****创建"Manageprocess编辑"的内容table
    function private_buildManageprocessEditTable(dom){
        var html = '<div class="processEdit clearfix">\
                             <div class="error_message"></div>\
                             <div class="editContent">\
                                <p><span>作业名称：</span><span>'+cache.scene_curr_data.name+'</span></p>\
                                <p><label>计算频率：</label><input type="text" id="process_interval" maxlength="3" value='+cache.scene_curr_data.interval+' /><label>小时</label></p>\
                             </div>\
                          </div>';
        dom.append(html);
    }
    
    ////****创建"查看参数设置"的内容table
    function private_buildCheckParamsTable(dom){
        var tab = $('<table class="CheckParamsTable"></table>');
        tab.append('<tr><th class="tr_title">序号</th><th class="tr_title">算法名称</th><th class="tr_title">算法描述</th><th class="tr_title">选择</th></tr>');
        
        var count = 1;
        _.each(cache.scene_curr_sceneData, function(groupObj,index){
            var row = $('<tr><td class="align_center"></td><td class="align_center"></td><td></td><td class="align_center"></td></tr>').appendTo(tab);
            var td = row.find('td');
            td.eq(0).html(count++);
            td.eq(1).html(LANG(groupObj.name));
            td.eq(2).html(LANG(groupObj.desc));
            if(cache.scene_curr_data.algorithm_id == groupObj.algorithm_id){
                td.eq(3).html('<input class="" data-id='+groupObj.algorithm_id+' type="radio" name="alg_sel" value="" checked="checked" />');
            }else{
                td.eq(3).html('<input class="" data-id='+groupObj.algorithm_id+' type="radio" name="alg_sel" value="" />');
            }
            tab.append(row);
        });
        tab.appendTo(dom);
        //return tab;
    };
    
    ////****创建"查看过滤/植入"的内容table
    function private_buildCheckFliterTable(dom){
        ////制作过滤table
        var fDiv = $('<div class="fatherDiv"></div>');
        fDiv.append('<h3 class="d_title">过滤</h3>');
        var tab = $('<table class="CheckParamsTable"></table>');
        tab.append('<tr><th class="tr_title" style="width:115px;">序号</th><th class="tr_title" style="width:auto;">方案名称</th><th class="tr_title" style="width:170px;">选择过滤方案</th></tr>');
        var count = 1;
        _.each(cache.scene_curr_filterData.filter, function(groupObj,index){
            var row = $('<tr><td class="align_center"></td><td></td><td class="align_center"></td></tr>').appendTo(tab);
            var td = row.find('td');
            td.eq(0).html(count++);
            td.eq(1).html('<label class="filter_name">'+LANG(groupObj.name)+'</label>');
            //在cache.scene_curr_data.filter数组中是否能找到groupObj.id
            var rt = $.inArray(parseInt(groupObj.id),cache.scene_curr_data.filter);
            if(rt!==-1){
                td.eq(2).html('<input type="radio" name="RadioGroup1" checked="checked"  value="'+groupObj.id+'" />');
            }else{
                td.eq(2).html('<input type="radio" name="RadioGroup1"  value="'+groupObj.id+'" />');
            }
            tab.append(row);
        });
        fDiv.append(tab);
        ////制作植入table
        fDiv.append('<h3 class="d_title">植入</h3>');
        tab = $('<table class="CheckParamsTable"></table>');
        tab.append('<tr><th class="tr_title" style="width:115px;">序号</th><th class="tr_title" style="width:auto;">方案名称</th><th class="tr_title" style="width:170px;">选择植入方案</th></tr>');
        count = 1;
        _.each(cache.scene_curr_filterData.implant, function(groupObj,index){
            var row = $('<tr><td class="align_center"></td><td></td><td class="align_center"></td></tr>').appendTo(tab);
            var td = row.find('td');
            td.eq(0).html(count++);
            td.eq(1).html('<label class="filter_name">'+LANG(groupObj.name)+'</label>');
            //在cache.scene_curr_data.filter数组中是否能找到groupObj.id
            var rt = $.inArray(parseInt(groupObj.id),cache.scene_curr_data.filter);
            if(rt!==-1){
                td.eq(2).html('<input type="radio" name="RadioGroup2" checked="checked"  value="'+groupObj.id+'" />');
            }else{
                td.eq(2).html('<input type="radio" name="RadioGroup2"  value="'+groupObj.id+'" />');
            }
            tab.append(row);
        });
        fDiv.append(tab);
        fDiv.appendTo(dom);
        //return tab;
    };
    
    ////****创建"修改过滤/植入"的内容
    function private_buildModifyImpFilTable(dom){
        var id =cache.managerfilter_curr_data.id;
        var name =cache.managerfilter_curr_data.name;
        var type =cache.managerfilter_curr_data.type;
        var setting =cache.managerfilter_curr_data.setting;
        var content =cache.managerfilter_curr_data.content;
        var recomm_obj = cache.managerfilter_curr_data.recomm_obj;
        var desc = cache.managerfilter_curr_data.desc;
        var title ='';
        var tip = '';
        if(type == "1"){
            val = "过滤";
        }else{
            val = "植入";
        }
        if(recomm_obj == "视频推荐"){
            title = "视频"+val;
            tip = val+"视频ID(GUID)，并用英文逗号分隔";
        }
        if(recomm_obj == "微博内容推荐"){
            title = "微博内容"+val;
            tip = val+"微博ID，并用英文逗号分隔";
        }
        if(recomm_obj == "微博用户推荐"){
            title = "微博用户"+val;
            tip = val+"微博用户ID，并用英文逗号分隔";
        }
        
        var fDiv = $('<div class="addResultCtrl"></div>');
        var html = '<div class="error_message"></div>\
                            <h2 class="nameTitle">'+title+'</h2>\
                            <div class="toplan">\
                                <div class="zlan clearfix">\
                                    <div class="leftlan"><label>名称</label></div>\
                                    <div class="rightlan"><input class="typeText" id="inputNmae" type="text" value="'+name+'"/></div>\
                                </div>\
                                <div class="zlan clearfix">\
                                    <div class="leftlan"><label>推荐物品</label></div>\
                                    <div class="rightlan">\
                                        <input class="typeText" id="inputRecommObj" type="text" value="'+recomm_obj+'"/>\
                                    </div>\
                                </div>\
                                <div class="zlan clearfix">\
                                    <div class="leftlan"><label>类型</label></div>\
                                    <div class="rightlan">\
                                        <span><input id="rImplant" name="typeGroup" type="radio" value="2" checked="checked" /><label class="forImplant">植入</label></span>\
                                        <span><input id="rFilter" name="typeGroup" type="radio" value="1" /><label class="forFilter">过滤</label></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="contentlan_implant">\
                                <div class="zlan clearfix">\
                                    <div class="leftlan"><label>植入(视频、微博…)ID</label></div>\
                                    <div class="rightlan">\
                                        <textarea id="textarea_implant" class="result_textarea"></textarea>\
                                        <span class="tip1 hong">'+tip+'</span>\
                                    </div>\
                                </div>\
                                <div class="zlan clearfix">\
                                    <div class="leftlan"><label>植入个数</label></div>\
                                    <div class="rightlan">\
                                        <input id="inputNum" class="typeText" type="text" maxlength="3"/>\
                                        <span class="tip2 hong">不填写默认为全部</span>\
                                    </div>\
                                </div>\
                                <div class="zlan clearfix">\
                                    <div class="leftlan"><label>植入次序</label></div>\
                                    <div class="rightlan">\
                                        <span><input name="orderGroup" type="radio" value="1" checked="checked" /><label>随机</label></span>\
                                        <span><input name="orderGroup" type="radio" value="0" /><label>正序</label></span>\
                                    </div>\
                                </div>\
                                <div class="zlan clearfix">\
                                    <div class="leftlan"><label>与推荐结果混合方式</label></div>\
                                    <div class="rightlan">\
                                        <span><input name="mixGroup" type="radio" value="1" checked="checked" /><label>随机</label></span>\
                                        <span><input name="mixGroup" type="radio" value="0" /><label>置顶</label></span>\
                                    </div>\
                                </div>\
                                <div class="zlan clearfix">\
                                    <div class="leftlan"><label>描述</label></div>\
                                    <div class="rightlan">\
                                        <textarea id="textarea_implant_desc" class="result_textarea" maxlength="1000"></textarea>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="contentlan_filter" style="display:none;">\
                                <div class="zlan clearfix">\
                                    <div class="leftlan"><label>过滤(视频、微博…)ID</label></div>\
                                    <div class="rightlan">\
                                        <textarea id="textarea_filter" class="result_textarea"></textarea>\
                                        <span class="tip1 hong">'+tip+'</span>\
                                    </div>\
                                </div>\
                                <div class="zlan clearfix">\
                                    <div class="leftlan"><label>描述</label></div>\
                                    <div class="rightlan">\
                                        <textarea id="textarea_filter_desc" class="result_textarea" maxlength="1000"></textarea>\
                                    </div>\
                                </div>\
                            </div>';

        fDiv.append(html);
        fDiv.appendTo(dom);
        $("#inputNmae").prop({disabled:true, readonly:true});
        $("#inputRecommObj").prop({disabled:true, readonly:true});
        if(type ==="2"){
            $("#rImplant").prop("checked", true);
            //$("#rFilter").prop("checked", false);
            
            //填充
            $("#textarea_implant").val(content);
            $("#textarea_implant_desc").val(desc);
            $("#inputNum").val(setting.num);
            $('.addResultCtrl .zlan .rightlan input[name="orderGroup"][value="'+setting.random+'"]').prop("checked", true);
            $('.addResultCtrl .zlan .rightlan input[name="mixGroup"][value="'+setting.mix_random+'"]').prop("checked", true);

            $(".contentlan_implant").show();
            $("#rFilter").hide();
            $("label.forFilter").hide();
            $(".contentlan_filter").hide();
        }else{
            //$("#rImplant").prop("checked", false);
            $("#rFilter").prop("checked", true);
            //填充
            $("#textarea_filter").val(content);
            $("#textarea_filter_desc").val(desc);
            //$('#typeList_filter option:[value="'+setting.filter_obj+'"]').prop("selected", true);
            
            $(".contentlan_implant").hide();
            $("#rImplant").hide();
            $("label.forImplant").hide();
            $(".contentlan_filter").show();
        }
        
        ////"结果植入"点击事件
        /*$('#rImplant').click(function(){
            $(".contentlan_implant").show();
            $(".contentlan_filter").hide();
        });
        ////"结果过滤"点击事件
        $('#rFilter').click(function(){
            $(".contentlan_filter").show();
            $(".contentlan_implant").hide();
        });*/
    
    }
    
    ////****创建"手动干预推荐细目"tab的内容
    function private_buildManualrecommItemTable(dom){
        var html = '<div class="poperror_message"></div>\
                        <div class="recommItem_top clearfix">\
                            <fieldset>\
                                <legend>模糊查询</legend>\
                                <p><label>视频类型</label><select id="recommItem_vadioType"></select></p>\
                                <p><label>名称</label><input id="recommItem_name" type="text" value=""/></p>\
                                <p><label>创建时间</label><span id="recommItem_date"></span></p>\
                                <p class="last"><input type="button" id="recommItem_check_mohu" class="recommItem_check btn_lan02" value=" 查 询 "></p>\
                            </fieldset>\
                            <fieldset>\
                                <legend>精确查询</legend>\
                                <p><label>视频ID</label><input id="videoID" type="text" value=""/></p>\
                                <p class="last"><input type="button" id="recommItem_check_jingque" class="recommItem_check btn_lan02" value=" 查 询 "></p>\
                            </fieldset>\
                        </div>\
                        <div class="tabContent"><div class="G-tableSet"><div id="manualRecommItemArea" class="theTableBox"></div></div></div>\
                        <div id="tableCart">\
                            <h3>推荐视频备选</h3>\
                            <div class="tableCartContent">\
                                <table class="CheckParamsTable">\
                                    <tbody class="gridHeadContent">\
                                        <tr><th class="tr_title">视频ID</th><th class="tr_title" style="width:580px;">名称</th><th class="tr_title">视频类别</th><th class="tr_title">创建时间</th><th class="tr_title">操作</th></tr>\
                                    </tbody>\
                                    <tbody class="gridContentBody"></tbody>\
                                </table>\
                            </div>\
                        </div>';
        dom.append(html);
        //设置历史类别
        $("#recommItem_vadioType").append('<option value="">----</option>')
        $.each(cache.optionItem, function(i,n){
          $("#recommItem_vadioType").append('<option value="'+n.type+'">'+n.type+'</option>')
        });
        //日期选择器
        Clicki.layout.add({
            "layout":{
                "recommItemDatepicker":{
                    "type":"datepicker_fb2",
                    "config":{
                        "id":"recommItem_date"
                    }
                }
            }
        });
    }
    
    ////****创建推荐反馈的内容table
    function private_buildFeedbackTable(dom,params){
        dom.empty();
        var tab = $('<table class="CheckParamsTable"></table>');
        tab.append('<tr><th class="tr_title">序号</th><th class="tr_title">时间</th><th class="tr_title">推荐次数</th><th class="tr_title">召回次数</th><th class="tr_title">召回率</th></tr>');
        
        var count = 1;
        _.each(params, function(groupObj,index){
            var row = $('<tr><td class="align_center"></td><td class="align_center"></td><td class="align_center"></td><td class="align_center"></td><td class="align_center"></td></tr>').appendTo(tab);
            var td = row.find('td');
            td.eq(0).html(count++);
            td.eq(1).html(LANG(groupObj.date));
            td.eq(2).html(LANG(groupObj.recommend_count));
            td.eq(3).html(LANG(groupObj.feedback_count));
            td.eq(4).html(LANG(groupObj.feedback_percent)); 
            tab.append(row);
        });
        tab.appendTo(dom).hide().fadeIn(500);
    }
    
    ////****创建"制图"内容
    function private_buildChartHot(dom,config){
        //$(dom).empty();
        var categories = [];
        var data = [];
        var period = $('.selectCondition .topCon .img .active').attr("data-period");
        if(period == "24"){
            categories = [
                    '00:00~00:59','01:00~01:59','02:00~02:59','03:00~03:59','04:00~04:59','05:00~05:59','06:00~06:59','07:00~07:59',
                    '08:00~08:59','09:00~09:59','10:00~10:59','11:00~11:59','12:00~12:59','13:00~13:59','14:00~14:59','15:00~15:59',
                    '16:00~16:59','17:00~17:59','18:00~18:59','19:00~19:59','20:00~20:59','21:00~21:59','22:00~22:59','23:00~23:59',
                ];
            data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        }
        if(period == "48"){
            categories = [
                    '00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00',
                    '12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00',
                    '24:00','25:00','26:00','27:00','28:00','29:00','30:00','31:00','32:00','33:00','34:00','35:00',
                    '36:00','37:00','38:00','39:00','40:00','41:00','42:00','43:00','44:00','45:00','46:00','47:00'
                ];
            data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        }
        if(period == "week"){
            categories = [null,null,null,null,null,null,null];
            data = [0,0,0,0,0,0,0];
        }
        var theID = dom.attr("id");
        
        var defultCon = {
            chart: {
                renderTo: theID,
                type: 'areaspline',
                width:804,
                backgroundColor:'#FAFAFA'
            },
            title: {
                text:''
            },
            xAxis: {
                tickInterval:3,
                tickmarkPlacement:'on',
                gridLineWidth:1,
                gridLineDashStyle: 'longdash',
                gridLineColor: '#d7f3f9',
                categories:categories
            },
            yAxis: {
                gridLineWidth:1,
                gridLineColor:"#eeeeee",
                gridLineDashStyle: 'longdash',
                allowDecimals: false,
                title: {
                    text: ''
                },
                labels: {
                    formatter: function() {
                        return this.value +''
                    }
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            plotOptions: {
                areaspline: {
                    lineWidth: 1,
                    fillOpacity: 0.1,
                    shadow:false
                },
                series:{
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        symbol: "circle"
                    }
                }
            },
            series: [{
                name: '转发量',
                marker: {
                    symbol: 'square'
                },
                data:data
    
            }, {
                name: '评论量',
                marker: {
                    symbol: 'diamond'
                },
                data:data
            }]
            
        }
        /*var getCon = {
            series: [{
                name: '转发量',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 2.3, 25.2,5.8, 23.3, 18.3, 13.9, 9.6,13.5, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2,26.5, 23.3, 18.3, 13.9, 9.6]
    
            }, {
                name: '评论量',
                data: [3.9,4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 15.9,7.0, 23.7, 13.6, 3.9,4.2, 5.7, 8.5, 11.9, 15.2,3.9,4.2, 5.7]
            }]
        }*/
       //console.log(config.series.length)
       var empty = {};
       var settings = defultCon;
        if(config.series.length > 0){
            settings = $.extend(true,empty,defultCon,config);
        }
        cache.chart = new Hchart.Chart(settings);
    };
    ////****创建"推荐反馈制图"内容
    function private_buildChartFeedback(id,config){
        
        var defultCon = {
            chart: {
                renderTo: id,
                type: 'line',
                backgroundColor:'#FAFAFA'
            },
            colors:['#ff6600','#fcd202'],
            title: {
                text:''
            },
            xAxis: {
                tickInterval:3,
                tickmarkPlacement:'on',
                gridLineWidth:1,
                gridLineDashStyle: 'longdash',
                gridLineColor: '#d7f3f9',
                categories:[]
            },
            yAxis: {
                gridLineWidth:1,
                gridLineColor:"#eeeeee",
                gridLineDashStyle: 'longdash',
                title: {
                    text: '次数'
                },
                labels: {
                    formatter: function() {
                        return this.value +''
                    }
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            plotOptions: {
                areaspline: {
                    lineWidth: 1,
                    fillOpacity: 0.1,
                    shadow:false
                },
                series:{
                    lineWidth: 2,
                    marker: {
                        lineWidth: 1,
                        symbol: "circle"
                    },
                    shadow: false
                }
            }
        }
        
        /*var getCon = {
            xAxis: {
                categories:[
                    '00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00',
                    '12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00',
                ]
            },
            series: [{
                name: '推荐次数',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 2.3, 25.2,5.8, 23.3, 18.3, 13.9, 9.6,13.5, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2,26.5, 23.3, 18.3, 13.9, 9.6]
    
            }, {
                name: '召回次数',
                data: [3.9,4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 15.9,7.0, 23.7, 13.6, 3.9,4.2, 5.7, 8.5, 11.9, 15.2,3.9,4.2, 5.7]
            }]
        }*/
        
        $.extend(true,defultCon,config)
        //$.extend(true,defultCon,getCon)
        cache.chart = new Hchart.Chart(defultCon);
    };

/////////////////////////////////////////////////////////////////////////////////////按钮点击后弹出窗口的所有函数//////////////////////////////////////////////// 
    
    ////*****算法设置中点击“查看参数设置”之后弹出窗口函数
    function private_algorithmlist_check(curr_data){
        var title = LANG(cache.scene_curr_data.name);
        cache.popup1 = new pop({
            type: {'html': '<div class="customCheckParams"><div class="fatherDiv"></div></div>'},
            "ui":{
                "title":{
                    "show":true,
                    "text":title
                },
                "width": 700
            },
            "autoClose":false,
            "showMark":true,
            "showClose":true,
            "showCtrl":true,
            onDone:function(){
                var err = '';
                var error_box = $('.error_message');
                var submitData = {
                        algorithm_id:cache.scene_curr_data.algorithm_id,
                        params:{}
                    };
                var _params = {};
                var _input = $(".Ex_popGuy .Ex_popGuyInner .customCheckParams .CheckParamsTable tr td input");
                _.each(cache.scene_curr_data.params, function(groupObj,index){
                    var temp_str = _input.eq(index).val();
                    if(parseFloat(groupObj.min_unit)==1){
                        if(temp_str.match(/^[1-9]{1}[0-9]*$/g)){
                            if(!(parseFloat(temp_str)>=parseFloat(groupObj.min) && parseFloat(temp_str)<=parseFloat(groupObj.max))){
                                err += '<li>'+groupObj.name+LANG("参数值不在范围之内")+'</li>';
                            }
                        }else{
                            err += '<li>'+groupObj.name+LANG("的输入格式有误")+'</li>';
                        }
                    }
                    if(parseFloat(groupObj.min_unit)==0.1){
                        if(temp_str.match(/^([0-9]\.[1-9])$|^([1-9]{1}[0-9]*)$/g)){
                            if(!(parseFloat(temp_str)>=parseFloat(groupObj.min) && parseFloat(temp_str)<=parseFloat(groupObj.max))){
                                err += '<li>'+groupObj.name+LANG("参数值不在范围之内")+'</li>';
                            }
                        }else{
                            err += '<li>'+groupObj.name+LANG("的输入格式有误")+'</li>';
                        }
                    }
                    if(parseFloat(groupObj.min_unit)==0.01){
                        if(temp_str.match(/^([0-9]\.[0-9]?[1-9]?)$|^([1-9]{1}[0-9]*)$/g)){
                            if(!(parseFloat(temp_str)>=parseFloat(groupObj.min) && parseFloat(temp_str)<=parseFloat(groupObj.max))){
                                err += '<li>'+groupObj.name+LANG("参数值不在范围之内")+'</li>';
                            }
                        }else{
                            err += '<li>'+groupObj.name+LANG("的输入格式有误")+'</li>';
                        }
                    }
                    if(parseFloat(groupObj.min_unit)==0.0001){
                        if(temp_str.match(/^([0-9]\.[0-9]{0,3}[1-9]?)$|^([1-9]{1}[0-9]*)$/g)){
                            if(!(parseFloat(temp_str)>=parseFloat(groupObj.min) && parseFloat(temp_str)<=parseFloat(groupObj.max))){
                                err += '<li>'+groupObj.name+LANG("参数值不在范围之内")+'</li>';
                            }
                        }else{
                            err += '<li>'+groupObj.name+LANG("的输入格式有误")+'</li>';
                        }
                    }
                    
                    _params[groupObj.param_id] = parseFloat(temp_str);//parseInt(_input.eq(index).val()).toString();
                });

                submitData.params = _params;
                ////把josn对象转换成可传输的字符串
                submitData.params = JSON.stringify(submitData.params);
                if(err === ""){
                    error_box.slideUp();
                    //private_save('/algorithm/editalgorithm',submitData,"#/algorithm/algorithmlist",-1,true);
                    private_save_noRefrash('/algorithm/editalgorithm',submitData,function(){
                        Clicki.layout.get('theAlgorithm_algorithmlist').refresh({data:{}});
                    });
                    this.destroy();
                    cache.popup1 = null;
                }else{
                    error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                }
            },
            onCancel:function(){
                this.destroy();
                cache.popup1 = null;
            },
            onClose:function(){
                this.destroy();
                cache.popup1 = null;
            },
            onRender: function(){
                var dom = this.doms.inner.find('.customCheckParams .fatherDiv');
                private_buildAlgorithmlistCheckTable(dom);
            },
            beforeShow: function(){
            },
            "data":null,
            "ready":false
        });
        cache.popup1.show();
    }
    
    ////*****作业管理中点击“编辑”之后弹出窗口函数
    function private_manageprocess_edit(){
        var title = LANG("作业设置");
        cache.popup1 = new pop({
            type: {'html': '<div class="customCheckParams"></div>'},
            "ui":{
                "title":{
                    "show":true,
                    "text":title
                },
                "width": 700
            },
            "autoClose":false,
            "showMark":true,
            "showClose":true,
            "showCtrl":true,
            onDone:function(){
                var err = '';
                var error_box = $('.error_message');
                var _id = cache.scene_curr_data.num;
                var _interval = $("#process_interval").val();
                var submitData = {
                    id:_id,
                    interval:_interval
                };
                if(!_interval.match(/^[1-9]{1}[0-9]*$/g)){
                   err += '<li>'+LANG("请输入数值型字符!")+'</li>';
                }
                if(err === ""){
                    error_box.slideUp();
                    private_save('/admin/processedit',submitData,"#/algorithm/manageprocess",-1,true);
                    this.destroy();
                    cache.popup1 = null;
                }else{
                    error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                }
            },
            onCancel:function(){
                this.destroy();
                cache.popup1 = null;
            },
            onClose:function(){
                this.destroy();
                cache.popup1 = null;
            },
            onRender: function(){
                var dom = this.doms.inner.find('.customCheckParams');
                private_buildManageprocessEditTable(dom);
            },
            beforeShow: function(){
            },
            "data":null,
            "ready":false
        });
        cache.popup1.show();
    }
    
    ////*****场景设置中点击“设置算法”之后弹出窗口函数
    function private_scene_checkParams(curr_data,title){
        var title = "选择"+title+"算法";
        
        //if (!cache.popup1){
            cache.popup1 = new pop({
                type: {'html': '<div class="customCheckParams"><div class="fatherDiv"></div></div>'},
                "ui":{
                    "title":{
                        "show":true,
                        "text":title
                    },
                    "width": 700
                },
                "autoClose":false,
                "showMark":true,
                "showClose":true,
                "showCtrl":true,
                onDone:function(){
                    var submitData = {
                            scene_id:curr_data.scene_id,
                            algorithm_id:null
                        };
                    var _params = {};
                    var _input = $(".Ex_popGuy .Ex_popGuyInner .customCheckParams .CheckParamsTable tr td input:checked");
                    submitData.algorithm_id = _input.attr("data-id");
                    private_save('/algorithm/editscene',submitData,"#/algorithm/scene",-1,true);
                    this.destroy();
                    cache.popup1 = null;
                },
                onCancel:function(){
                    /*var _input = $(".Ex_popGuy .Ex_popGuyInner .customCheckParams .CheckParamsTable tr td input");
                    _.each(cache.scene_curr_data.params, function(groupObj,index){
                        _input.eq(index).val(groupObj.value);
                    });*/
                    this.destroy();
                    cache.popup1 = null;
                },
                onClose:function(){
                    /*var _input = $(".Ex_popGuy .Ex_popGuyInner .customCheckParams .CheckParamsTable tr td input");
                    _.each(cache.scene_curr_data.params, function(groupObj,index){
                        _input.eq(index).val(groupObj.value);
                    });*/
                    this.destroy();
                    cache.popup1 = null;
                },
                onRender: function(){
                    var dom = this.doms.inner.find('.customCheckParams .fatherDiv');
                    private_buildCheckParamsTable(dom);
                },
                beforeShow: function(){
                },
                "data":null,
                "ready":false
            });
        //}
        cache.popup1.show();
        /*// 设置标题角色名
        cache.popup.title.text(role.name);*/
    }
    
    ////*****场景设置中点击“设置过滤/植入”之后弹出窗口函数
    function private_scene_checkFliter(curr_data){
        var title = LANG("过滤/植入");
        //if (!cache.popup2){
            cache.popup2 = new pop({
                type: {'html': '<div class="customCheckParams"></div>'},
                "ui":{
                    "title":{
                        "show":true,
                        "text":title
                    },
                    "width": 700
                },
                "autoClose":false,
                "showMark":true,
                "showClose":true,
                "showCtrl":true,
                onDone:function(){
                    var submitData = {
                            scene_id:curr_data.scene_id,
                            filter:{}
                        };
                    var _params = [];
                    var _input = $(".Ex_popGuy .Ex_popGuyInner .customCheckParams .CheckParamsTable tr td input:checked");
                    _input.each(function(i){
                        _params.push(parseInt($(this).val()));
                    });
                    submitData.filter = _params;
                    ////把josn对象转换成可传输的字符串
                    submitData.filter = JSON.stringify(submitData.filter)
                    private_save('/algorithm/editscene',submitData,"#/algorithm/scene",-1,true);
                    this.destroy();
                    cache.popup2 = null;
                },
                onCancel:function(){
                    this.destroy();
                    cache.popup2 = null;
                },
                onClose:function(){
                    this.destroy();
                    cache.popup2 = null;
                },
                onRender: function(){
                    var dom = this.doms.inner.find('.customCheckParams');
                    private_buildCheckFliterTable(dom);
                },
                beforeShow: function(){
                },
                "data":null,
                "ready":false
            });
        //}
        cache.popup2.show();
        /*// 设置标题角色名
        cache.popup.title.text(role.name);*/
    }
    
    ////*****过滤/植入中点击"修改"之后弹出窗口函数
    function private_managerfilter_modify(curr_data){
        var title = LANG("修改过滤/植入");
        //if (!cache.popup2){
            cache.impfil_popup = new pop({
                type: {'html': '<div class="customCheckParams"></div>'},
                "ui":{
                    "title":{
                        "show":true,
                        "text":title
                    },
                    "width": 700
                },
                "autoClose":false,
                "showMark":true,
                "showClose":true,
                "showCtrl":true,
                onDone:function(){ 
                    var sendData = null;
                    var err = '';
                    var error_box = $('.addResultCtrl .error_message');
                    var _id =cache.managerfilter_curr_data.id;
                    //wj.clicki.server/algorithm/addhandle?name=&type=&content=&filter_obj=&random=&mix_random=&num=
                    var checkVal = $(".addResultCtrl .zlan .rightlan input[name='typeGroup']:checked").val();
                    if(checkVal === "2"){
                        var name = $("#inputNmae").val();
                        var type = checkVal;
                        var content = $("#textarea_implant").val();
                        if(!(content.match(/^([a-zA-Z0-9]*,)*[a-zA-Z0-9]+$/g))){
                            err += '<li>'+LANG('请输入非空英文、数字的植入ID库，每组字符之间请用英文逗号隔开')+'</li>';
                        }
                        var num = $("#inputNum").val();
                        if(!(num.match(/^[1-9]{1}[0-9]*$/g))){
                            if(num.match(/^\s*$/g)){
                                num = "";
                            }else{
                                err += '<li>'+LANG('请输入合法的植入个数，可以包括空字符、数字')+'</li>';
                            }
                        }
                        var random = $(".addResultCtrl .zlan .rightlan input[name='orderGroup']:checked").val();
                        var mix_random = $(".addResultCtrl .zlan .rightlan input[name='mixGroup']:checked").val();
                        var recomm_obj = $("#recommandObj option:selected").val();
                        var desc = $("#textarea_implant_desc").val();
                        if (err != ''){
                            error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                        }else{
                            error_box.hide();
                            sendData = {
                                id:_id,
                                name:name,
                                recomm_obj:recomm_obj,
                                type:type,
                                content:content,
                                random:random,
                                mix_random:mix_random,
                                num:num,
                                desc:desc
                            }
                            //sendData = JSON.stringify(sendData);
                            //console.log(sendData)
                            //private_save('/algorithm/edithandle',sendData,"#/algorithm/resulthandle",-1,true);
                            private_save_noRefrash('/algorithm/edithandle',sendData,function(){
                                Clicki.layout.get('theAlgorithm_managerfilter').refresh({data:{}},function(){
                                    $('.managerfilter_delete[data-use="true"]').parents("tr").addClass("inused");
                                });
                                //console.log($('.managerfilter_delete[data-use="true"]').parents("tr"))
                                
                            });
                            this.destroy();
                            cache.impfil_popup = null;
                        }
                    };
                    if(checkVal === "1"){
                        var name = $("#inputNmae").val();
                        var type = checkVal;
                        //var filter_obj = $("#typeList_filter option:checked").val();
                        var content = $("#textarea_filter").val();
                        if(!(content.match(/^([a-zA-Z0-9]*,)*[a-zA-Z0-9]+$/g))){
                            err += '<li>'+LANG('请输入非空英文、数字的过滤ID，每组字符之间请用英文逗号隔开')+'</li>';
                        };
                        var recomm_obj = $("#recommandObj option:selected").val();
                        var desc = $("#textarea_filter_desc").val();
                        if (err != ''){
                            error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                        }else{
                            error_box.hide();
                            sendData = {
                                id:_id,
                                name:name,
                                recomm_obj:recomm_obj,
                                type:type,
                                content:content,
                                desc:desc
                            };
                            //sendData = JSON.stringify(sendData);
                            //console.log(sendData)
                            //private_save('/algorithm/edithandle',sendData,"#/algorithm/resulthandle",-1,true);
                            private_save_noRefrash('/algorithm/edithandle',sendData,function(){
                                Clicki.layout.get('theAlgorithm_managerfilter').refresh({data:{}},function(){
                                    $('.managerfilter_delete[data-use="true"]').parents("tr").addClass("inused");
                                });
                            });
                            this.destroy();
                            cache.impfil_popup = null;
                        };
                    };
                },
                onCancel:function(){
                    this.destroy();
                    cache.impfil_popup = null;
                },
                onClose:function(){
                    this.destroy();
                    cache.impfil_popup = null;
                },
                onRender: function(){
                    var dom = this.doms.inner.find('.customCheckParams');
                    private_buildModifyImpFilTable(dom);
                    ////select变换事件
                    $(".addResultCtrl .zlan .rightlan select").change( function() {
                        if($(this).children("option:selected").val() == "视频推荐"){
                            $(".addResultCtrl h2.nameTitle").html("视频过滤植入");
                            $(".addResultCtrl .zlan .rightlan span.tip1").html("植入视频ID，并用英文逗号分隔");
                        }
                        if($(this).children("option:selected").val() == "微博内容推荐"){
                            $(".addResultCtrl h2.nameTitle").html("微博内容过滤植入");
                            $(".addResultCtrl .zlan .rightlan span.tip1").html("植入微博ID，并用英文逗号分隔");
                        }
                        if($(this).children("option:selected").val() == "微博用户推荐"){
                            $(".addResultCtrl h2.nameTitle").html("微博用户过滤植入");
                            $(".addResultCtrl .zlan .rightlan span.tip1").html("植入微博用户ID，并用英文逗号分隔");
                        }
                    });
                    ////限制ie下textarea的最大长度
                    $(".result_textarea").textarealimit(1000);
                },
                beforeShow: function(){
                },
                "data":null,
                "ready":false
            });
        //}
        cache.impfil_popup.show();  
    }
    
    ////*****手动干预中点击“推荐视频个数”之后弹出窗口函数
    function private_recomm_checkVideoNum(curr_data){
        var title = LANG("推荐视频一览");
        cache.popup1 = new pop({
            type: {'html': '<div class="customCheckParams"></div>'},
            "ui":{
                "title":{
                    "show":true,
                    "text":title
                },
                "width": 700
            },
            "autoClose":false,
            "showMark":true,
            "showClose":true,
            "showCtrl":false,
            onClose:function(){
                this.destroy();
                cache.popup1 = null;
            },
            onRender: function(){
                var dom = this.doms.inner.find('.customCheckParams');
                var tab = $('<table class="CheckParamsTable"></table>');
                tab.append('<tr><th class="tr_title">视频ID</th><th class="tr_title">视频名称</th></tr>');
                
                _.each(curr_data.result.items, function(groupObj,index){
                    var row = $('<tr><td class="align_center"></td><td class="align_center"></td></tr>').appendTo(tab);
                    var td = row.find('td');
                    td.eq(0).html(groupObj.vid);
                    td.eq(1).html(groupObj.title);
                    tab.append(row);
                });
                tab.appendTo(dom); 
            },
            beforeShow: function(){
            },
            "data":null,
            "ready":false
        });
        cache.popup1.show();
    }
    
    
    ////*****手动干预中点击“推荐细目”之后弹出窗口函数
    function private_manualrecomm_recommItem(curr_data){
        var title = LANG('视频干预 (手工干预只针对视频)');
        cache.popup1 = new pop({
            type: {'html': '<div class="customCheckParams"></div>'},
            "ui":{
                "title":{
                    "show":true,
                    "text":title
                },
                "width":950
            },
            "autoClose":false,
            "showMark":true,
            "showClose":true,
            "showCtrl":true,
            onDone:function(){
                var submitData={
                    uids:cache.uids,
                    video_ids:null
                }
                var vids = [];
                var chkbox = $('#tableCart tbody.gridContentBody tr td a.cart_del');
                //$(".Ex_popGuy .Ex_popGuyInner .customCheckParams .CheckParamsTable input.sel:checked");
                if(chkbox.length>0){
                    chkbox.each(function(i) { 
                        vids.push($(this).attr("data-id"));
                    });
                    submitData.video_ids = vids;
                    submitData.uids = JSON.stringify(submitData.uids);
                    submitData.video_ids = JSON.stringify(submitData.video_ids);
                    private_save_noRefrash('/algorithm/manualrecomm',submitData,function(){
                        /*$.each(cache.uids, function(i, n){
                            $('#algorithm_manualrecommArea table tbody.gridContentBody tr td div a.recomm_num[data-id="'+n+'"]').html(vids.length)
                        });*/
                        Clicki.layout.get('theAlgorithm_manualrecomm').refresh({data:{}});
                    });
                    this.destroy();
                    cache.popup1 = null;
                }else{
                    private_alert("请选择");
                }       
            },
            onCancel:function(){
                this.destroy();
                cache.popup1 = null;
            },
            onClose:function(){
                this.destroy();
                cache.popup1 = null;
            },
            onRender: function(){
                var dom = this.doms.inner.find('.customCheckParams');
                private_buildManualrecommItemTable(dom);
                //查询按钮点击
                $(".recommItem_check").die('click').live("click", function(event){
                    //$(".Ex_popGuy .Ex_popGuyInner .customCheckParams .tabContent").empty();
                    var err = '';
                    var error_box = $('.poperror_message');
                    var url = '/algorithm/videosource';
                    if($(this).attr("id") == "recommItem_check_mohu"){
                        var type = $("#recommItem_vadioType option:selected").val();
                        var title = $("#recommItem_name").val();
                        var date = $("#dateInput").val();
                        var _date = null;
                        var _start_date = null;
                        var _end_date = null;
                         
                        if(date.match(/^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}\-\-[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/g)){
                            _date = date.split("--");
                            _start_date = _date[0];
                            //_start_date = 0;
                            _end_date = _date[1];
                            if(isdate(_start_date) && isdate(_end_date)){
                                if(compareDate(_start_date,window.myToday) && compareDate(_end_date,window.myToday)){
                                    if(!compareDate(_start_date,_end_date)){
                                        err += '<li>'+LANG("请输入正确的时间范围")+'</li>';
                                    }
                                }else{
                                    err += '<li>'+LANG("请输入正确的时间范围")+'</li>';
                                }
                            }else{
                                err += '<li>'+LANG("请输入正确的时间范围")+'</li>';
                            }
                        }else{
                            if(date != ""){
                                err += '<li>'+LANG("请输入正确的时间范围")+'</li>';
                            }
                        }
                        url += '?title='+encodeURIComponent(title)+'&type='+encodeURIComponent(type)+'&begin_time='+_start_date+'&end_time='+_end_date;
                    }
                    if($(this).attr("id") == "recommItem_check_jingque"){
                        var vid = $("#videoID").val();
                        if(!vid.match(/^[a-zA-Z0-9]+$/g)){
                            err += '<li>'+LANG("请输入正确的视频ID")+'</li>';
                        }
                        url += '?vid='+vid;
                    }
                    
                    if (err != ''){
                        error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                    }else{
                        error_box.slideUp();
                        var z_in = $(".theMarker").css("z-index");
                        $(".theMarker").css("z-index","1000");
                        private_setManualRecommItemLayout(url);
                        $(".Ex_popGuy .Ex_popGuyCtrl").show();
                        $("#tableCart").show();
                        $(".theMarker").css("z-index",z_in);
                        /*
                        $.ajax({
                            url:url,
                            data: 'title='+encodeURIComponent(title)+'&type='+encodeURIComponent(type)+'&begin_time='+_start_date+'&end_time='+_end_date,
                            type: 'GET',
                            dataType: 'json',
                            success: function(rdata){
                                if (rdata.success){
                                    var tab = $('<table class="CheckParamsTable"></table>');
                                    tab.append('<tr><th class="tr_title">序号</th><th class="tr_title">视频ID</th><th class="tr_title">名称</th><th class="tr_title">视频类别</th><th class="tr_title">创建时间</th><th class="tr_title">选择</th></tr>');
                                    
                                    var count = 1;
                                    _.each(rdata.result.items, function(groupObj,index){
                                        var row = $('<tr><td class="align_center"></td><td class="align_center"></td><td class="align_center"></td><td class="align_center"></td><td class="align_center"></td><td class="align_center"></td></tr>').appendTo(tab);
                                        var td = row.find('td');
                                        td.eq(0).html(count++);
                                        td.eq(1).html(LANG(groupObj.id));
                                        td.eq(2).html(LANG(groupObj.title));
                                        td.eq(3).html(LANG(groupObj.type));
                                        td.eq(4).html(LANG(groupObj.create_time));
                                        td.eq(5).html('<input class="sel" data-id='+groupObj.id+' type="checkbox" value="" />');
                                        tab.append(row);
                                    });
                                    tab.appendTo(dom.find(".tabContent"));
                                    $(".Ex_popGuy .Ex_popGuyCtrl").show();
                                    $(".theMarker").css("z-index",z_in);
                                    return false;
                                }else{
                                    $(".theMarker").css("z-index",z_in);
                                    private_alert(LANG("服务器正忙，操作失败，请稍后再试"));
                                    return false;
                                }
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown){
                                $(".theMarker").css("z-index",z_in);
                                // 服务器连接解析错误
                                private_alert("服务器连接解析错误");
                            }
                        });*/
                        
                    }
                });
                
                //选择checkbox事件
                $(".recommCheckboxItem").die('click').live("click", function(event){
                    var data_id = $(this).attr("data-id");
                    var parentTRobj = $(this).parents("tr");
                    var row = '<tr><td class="align_center">'+parentTRobj.children().eq(1).children("div").html()+'</td><td class="align_center">'+parentTRobj.children().eq(2).children("div").html()+'</td><td class="align_center">'+parentTRobj.children().eq(3).children("div").html()+'</td><td class="align_center">'+parentTRobj.children().eq(4).children("div").html()+'</td><td class="align_center"><a class="cart_del" data-id="'+data_id+'" href="javascript:void(0);">删除</a></td></tr>';
                    var cartHasItem = $('#tableCart tbody.gridContentBody tr td a[data-id="'+data_id+'"]').parents("tr");
                    //console.log(cartHasItem);
                    if($(this).attr("checked")){
                        //$(this).prop("checked", true);
                        if(cartHasItem.length == 0){
                            $("#tableCart tbody.gridContentBody").append(row);
                        }
                    }else{
                        if(cartHasItem.length > 0){
                            cartHasItem.remove();
                        }
                    }
                });
                //cart删除事件
                $("#tableCart table tbody.gridContentBody tr td a.cart_del").die('click').live("click", function(event){
                    var data_id = $(this).attr("data-id");
                    $('#manualRecommItemArea table tbody.gridContentBody tr td input[data-id="'+data_id+'"]').prop("checked", false);
                    $(this).parents("tr").remove();
                });
                
                
                
            },
            beforeShow: function(){
                $(".Ex_popGuy .Ex_popGuyCtrl input.Ex_BntIsOk").val(" 推荐 ");
                $(".Ex_popGuy .Ex_popGuyCtrl").hide();
            },
            "data":null,
            "ready":false
        });
        cache.popup1.show();
    }
    
    ////****热点微博的查看按钮弹出窗口
    function private_hotweibo_checkShow(curr_data,tableData){
        var title = LANG("热门微博");
        //if(!cache.chart_popup){
        cache.chart_popup = new pop({
            type: {'html': '<div id="chartDiv" class="customCheckParams"></div>'},
            "ui":{
                "title":{
                    "show":true,
                    "text":title
                },
                "width": 850
            },
            "autoClose":false,
            "showMark":true,
            "showClose":true,
            "showCtrl":false,
            onDone:function(){
                this.destroy();
                cache.chart_popup = null;
            },
            onCancel:function(){
                this.destroy();
                cache.chart_popup = null;
            },
            onClose:function(){
                this.destroy();
                cache.chart_popup = null;
            },
            onRender: function(){
                var dom = this.doms.inner.find('.customCheckParams');
                private_buildChartHot(dom,curr_data);
                var row = null;
                var tab = $('<table class="CheckParamsTable"></table>');
                tab.append('<tr><th colspan="2" class="tr_title"></th></tr>');
                _.each(tableData, function(groupObj,index){
                    row = $('<tr><td class="align_center"></td><td  style="width:685px;" class="align_left"></td></tr>').appendTo(tab);
                    var td = row.find('td');
                    var furl = "";
                    if(groupObj.user_face != ""){
                        furl = groupObj.user_face;
                    }else{
                        furl = "/resources/styles/images/img_user.jpg";
                    }
                    var ht = '<div><img class="imguser" src='+furl+' /><p class="hotname">'+groupObj.user_name+'</p></div>';
                    td.eq(0).html(ht);
                    td.eq(1).html(groupObj.content);
                    tab.append(row);
                });
                tab.appendTo(dom);
            },
            beforeShow: function(){
            },
            "data":null,
            "ready":false
        });
        //}
        cache.chart_popup.show();
    };
    
    ////****热点微博的查看按钮弹出窗口
    function private_hotuser_checkShow(curr_data,tableData){
        var title = LANG("热门用户");
        //if(!cache.chart_popup){
        cache.chart_popup = new pop({
            type: {'html': '<div id="chartDiv" class="customCheckParams"></div>'},
            "ui":{
                "title":{
                    "show":true,
                    "text":title
                },
                "width": 850
            },
            "autoClose":false,
            "showMark":true,
            "showClose":true,
            "showCtrl":false,
            onDone:function(){
                this.destroy();
                cache.chart_popup = null;
            },
            onCancel:function(){
                this.destroy();
                cache.chart_popup = null;
            },
            onClose:function(){
                this.destroy();
                cache.chart_popup = null;
            },
            onRender: function(){
                var dom = this.doms.inner.find('.customCheckParams');
                private_buildChartHot(dom,curr_data);
                var furl = "";
                if(tableData.user_face != ""){
                    furl = tableData.user_face;
                }else{
                    furl = "/resources/styles/images/img_user.jpg";
                }
                var html = '<div id="alert_hotuser_lan" class="clearfix">\
                                        <div class="hotuser">\
                                            <img src="'+tableData.user_face+'" alt="" />\
                                            <p class="hotname">'+tableData.user_name+'</p>\
                                        </div>\
                                  </div>';
                
                
                dom.append(html);
            },
            beforeShow: function(){
            },
            "data":null,
            "ready":false
        });
        //}
        cache.chart_popup.show();
    };
    
    ////****热点微博的查看按钮弹出窗口
    function private_hottopic_checkShow(curr_data,tableData){
        var title = LANG("热门话题");
        //if(!cache.chart_popup){
        cache.chart_popup = new pop({
            type: {'html': '<div id="chartDiv" class="customCheckParams"></div>'},
            "ui":{
                "title":{
                    "show":true,
                    "text":title
                },
                "width": 850
            },
            "autoClose":false,
            "showMark":true,
            "showClose":true,
            "showCtrl":false,
            onDone:function(){
                this.destroy();
                cache.chart_popup = null;
            },
            onCancel:function(){
                this.destroy();
                cache.chart_popup = null;
            },
            onClose:function(){
                this.destroy();
                cache.chart_popup = null;
            },
            onRender: function(){
                var dom = this.doms.inner.find('.customCheckParams');
                $(".Ex_popGuy .Ex_tipTitle ").html(htmlencode(tableData.topic_name));
                private_buildChartHot(dom,curr_data);
            },
            beforeShow: function(){
            },
            "data":null,
            "ready":false
        });
        //}
        cache.chart_popup.show();
    };
    
    ////*****算法训练点击“问号”之后弹出窗口函数
    function private_training_checkDes(title,html){
        //if (!cache.popup1){
            cache.other_pop = new pop({
                type: {'html':html},
                "ui":{
                    "title":{
                        "show":true,
                        "text":title
                    },
                    "width": 350
                },
                "autoClose":false,
                "showMark":true,
                "showClose":true,
                "showCtrl":false,
                onDone:function(){
                    this.destroy();
                    cache.other_pop = null;
                },
                onCancel:function(){
                    this.destroy();
                    cache.other_pop = null;
                },
                onClose:function(){
                    this.destroy();
                    cache.other_pop = null;
                },
                onRender: function(){
                    
                },
                beforeShow: function(){
                },
                "data":null,
                "ready":false
            });
        //}
        cache.other_pop.show();
    }

///////////////////////////////////////////////////////////////////////////////点击按钮之后直接触发功能的所有函数////////////////////////////////////////////////
    ////****创建页面上"制图"的内容
    function private_buildChart(config){
        cache.chart = new Hchart.Chart(config);
    };
    ////****开启停止函数
    /*function private_startOrStop(evt,_url, _data, _callback){
        $.ajax({
            type:"POST",
            url:_url,
            dataType:"json",
            data:$.param({"process_id":_data[0],"cmd":_data[1]}),
            success:function(result){ 
                if(_data[1] === "启动"){
                    $(evt.target).text("停止");
                    $(evt.target).attr("title","停止");
                 }else{
                    $(evt.target).text("启动");
                    $(evt.target).attr("title","启动");
                 }
                 //private_alert(LANG(_data[1]+"操作成功"));
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                private_alert(LANG("服务器正忙，操作失败，请稍后再试"));
            }
         })
    }*/
    
    ////****制作热点微博的table页面
    function private_setHotweiboLayout(url){
        ////"制作表格"
        Clicki.layout.destroy().add({
            "layout":{
                "theAlgorithm_hotweibo":{
                    "type":"grid",
                    "config":{
                        "url":url,
                        "params":{
                            "page":1,
                            "limit":20
                        },
                        "caption":{
                            "weibouser":{
                                "desc":"",
                                "title":LANG("微博用户")
                            },
                            "content":{
                                "desc":"",
                                "title":LANG("微博内容")
                            }
                            ,
                            "publishtime":{
                                "desc":"",
                                "title":LANG("发布时间")
                            },
                            "forwarding":{
                                "desc":"",
                                "title":LANG("转发量")
                            },
                            "comment":{
                                "desc":"",
                                "title":LANG("评论量")
                            }
                        },
                        "colModel":[
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'weibouser'
                                ,width: '100px'
                                ,render: function(key, i, row){
                                    //console.log(this._getCollection());
                                    //var ht = '<div><img class="imguser" src='+this._getCollection().getModelDataAt(row).user_face+' /><p class="hotname">'+this._getCollection().getModelDataAt(row).user_name+'</p></div>';
                                    var ht = '<div><p class="hotname">'+this._getCollection().getModelDataAt(row).user_name+'</p></div>';
                                    return ht;//this._getCollection().getModelDataAt(row).name;
                                }
                            },
                            {
                                "tdCls":"theTextLeft"
                                ,"cls":"admin-tab-left"
                                ,data:'content'
                                ,width: '405px'
                                ,render: function(key, i, row){
                                    return htmlencode(this._getCollection().getModelDataAt(row).content);
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center clearfix"
                                ,data:'publishtime'
                                ,width:'130px'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).public_time;
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center clearfix"
                                ,data:'forwarding'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).forward_count;
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center clearfix"
                                ,data:'comment'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).comment_count;
                                }
                            },
                            {
                                text:LANG("操作"),
                                "tdCls":"theTextCenter",
                                "cls":"admin-tab-center",
                                data:null,
                                width: '140px',
                                render:function(key,i,row){
                                    var tagA_arr = ["查看趋势","查看原微博"];
                                    var data_id = this._getCollection().getModelDataAt(row).wb_id;
                                    var wb_url = this._getCollection().getModelDataAt(row).wb_url;
                                    return ['<p class="managOperating"><a href="javascript:void(0);" data-id="'+data_id+'" data-index="'+row+'" class="hotweibo_show frist" title="'+tagA_arr[0]+'">'+tagA_arr[0]+'</a>',
                                                '<a href="'+wb_url+'" target="_blank" title="'+tagA_arr[1]+'">'+tagA_arr[1]+'</a></p>'].join("");         
                                }
                            }
                        ]
                        ,"target":"algorithm_hotweiboArea"
                        //////////////////////////构建完成后的回调函数////////////////////////////////
                        ,callback:function(){           
                            var grid = this;
                            //"查看趋势"操作//
                            $(".hotweibo_show").die('click').live("click", function(event){
                                $(".theGridMarkLayout").show();
                                var _getData = grid.getAllModelData();
                                var num = $(this).attr("data-index");
                                var period = $(".selectCondition .topCon .img .active").attr("data-period");
                                var _id  = $(this).attr("data-id");
                                var url = '/algorithm/weibotrend?period='+period+'&id='+_id;
                                $.getJSON(url, function(rdata){
                                    if (rdata.success){
                                        $(".theGridMarkLayout").hide();
                                        private_hotweibo_checkShow(rdata.result,[_getData[num]]);
                                        return false;
                                    }else{
                                        $(".theGridMarkLayout").hide();
                                        private_alert(rdata.message);
                                        return false;
                                    }
                                })
                            });
                        }
                        /////////////////////////////////////////////////////////////   
                    }
                }
            }
        });
    }
    
    ////****制作热点用户的table页面
    function private_setHotuserLayout(url){
        ////"制作表格"
        Clicki.layout.destroy().add({
            "layout":{
                "theAlgorithm_hotuser":{
                    "type":"grid",
                    "config":{
                        "url":url,
                        "params":{
                            "page":1,
                            "limit":20
                        },
                        "caption":{
                            "weibouser":{
                                "desc":"",
                                "title":LANG("微博用户")
                            },
                            "usertype":{
                                "desc":"",
                                "title":LANG("用户类型")
                            }
                            ,
                            "fansForward":{
                                "desc":"",
                                "title":LANG("粉丝增长量")
                            },
                            "atForward":{
                                "desc":"",
                                "title":LANG("被@量")
                            }
                        },
                        "colModel":[
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'weibouser'
                                ,width: '200px'
                                ,render: function(key, i, row){
                                    var v = this._getCollection().getModelDataAt(row).usertype?"bluev":"";
                                    //var ht = '<div class="alignLeft"><img class="imguser" src='+this._getCollection().getModelDataAt(row).user_face+' /><span class="hoter">'+this._getCollection().getModelDataAt(row).user_name+'</span><span class='+v+'></span></div>';
                                    var ht = '<div class="alignLeft"><span class="hoter">'+this._getCollection().getModelDataAt(row).user_name+'</span><span class='+v+'></span></div>';
                                    return ht;
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'usertype'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).category;
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center clearfix"
                                ,data:'fansForward'
                                ,width:'130px'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).funs_count;
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center clearfix"
                                ,data:'atForward'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).at_count;
                                }
                            },
                            {
                                text:LANG("操作"),
                                "tdCls":"theTextCenter",
                                "cls":"admin-tab-center",
                                data:null,
                                width: '140px',
                                render:function(key,i,row){
                                    var tagA_arr = ["查看趋势","查看原用户"];
                                    var data_id = this._getCollection().getModelDataAt(row).user_id;
                                    var user_url = this._getCollection().getModelDataAt(row).user_url;
                                    return ['<p class="managOperating"><a href="javascript:void(0);" data-id="'+data_id+'" data-index="'+row+'" class="hotuser_show frist" title="'+tagA_arr[0]+'">'+tagA_arr[0]+'</a>',
                                                '<a href="'+user_url+'" target="_blank" title="'+tagA_arr[1]+'">'+tagA_arr[1]+'</a></p>'].join("");
                                }
                            }
                        ]
                        ,"target":"algorithm_hotuserArea"
                        //////////////////////////构建完成后的回调函数////////////////////////////////
                        ,callback:function(){
                            var grid = this;
                            //"查看趋势"操作//
                            $(".hotuser_show").die('click').live("click", function(event){
                                $(".theGridMarkLayout").show();
                                var _getData = grid.getAllModelData();
                                var num = $(this).attr("data-index");
                                var period = $(".selectCondition .topCon .img .active").attr("data-period");
                                var _id  = $(this).attr("data-id");
                                var url = '/algorithm/usertrend?period='+period+'&id='+_id;
                                $.getJSON(url, function(rdata){
                                    if (rdata.success){
                                        $(".theGridMarkLayout").hide();
                                        private_hotuser_checkShow(rdata.result,_getData[num]);
                                        return false;
                                    }else{
                                        $(".theGridMarkLayout").hide();
                                        private_alert(rdata.message);
                                        return false;
                                    }
                                })
                            });
                        }
                        /////////////////////////////////////////////////////////////
                        
                    }
                }
            }
        });
    }

    ////****制作热门话题的table页面
    function private_setHottopicLayout(url){
        ////"制作表格"
        Clicki.layout.destroy().add({
            "layout":{
                "theAlgorithm_hottopic":{
                    "type":"grid",
                    "config":{
                        "url":url,
                        "params":{
                            "page":1,
                            "limit":20
                        },
                        "caption":{
                            
                            "topic":{
                                "desc":"",
                                "title":LANG("微博话题")
                            },
                            "content":{
                                "desc":"",
                                "title":LANG("内容生成量")
                            },
                            "interact":{
                                "desc":"",
                                "title":LANG("话题互动量")
                            }
                        },
                        "colModel":[
                            {
                                "tdCls":"theTextLeft"
                                ,"cls":"admin-tab-left"
                                ,data:'topic'
                                ,width: '600px'
                                ,render: function(key, i, row){
                                    return htmlencode(this._getCollection().getModelDataAt(row).topic_name);
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'content'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).content_count;
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center clearfix"
                                ,data:'interact'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).interact_count;
                                }
                            },
                            {
                                text:LANG("操作"),
                                "tdCls":"theTextCenter",
                                "cls":"admin-tab-center",
                                data:null,
                                width: '140px',
                                render:function(key,i,row){
                                    //var tagA_arr = ["查看趋势","查看原用户"];
                                    //var data_topicname = this._getCollection().getModelDataAt(row).topic_name;
                                    //var user_url = this._getCollection().getModelDataAt(row).user_url;
                                    return '<a href="javascript:void(0);" data-index="'+row+'" class="hottopic_show" title="查看趋势">查看趋势</a>';
                                }
                            }
                        ]
                        ,"target":"algorithm_hottopicArea"
                        //////////////////////////构建完成后的回调函数////////////////////////////////
                        ,callback:function(){
                            var grid = this;                
                            //"查看趋势"操作//
                            $(".hottopic_show").die('click').live("click", function(event){
                                $(".theGridMarkLayout").show();
                                var _getData = grid.getAllModelData();
                                var num = $(this).attr("data-index");
                                var period = $(".selectCondition .topCon .img .active").attr("data-period");
                                var _topicname  = encodeURIComponent(_getData[num].topic_name);
                                var url = '/algorithm/topictrend?period='+period+'&topic='+_topicname;
                                $.getJSON(url, function(rdata){
                                    if (rdata.success){
                                        $(".theGridMarkLayout").hide();
                                        private_hottopic_checkShow(rdata.result,_getData[num]);
                                        return false;
                                    }else{
                                        $(".theGridMarkLayout").hide();
                                        private_alert(rdata.message);
                                        return false;
                                    }
                                })
                            });
                        }
                        /////////////////////////////////////////////////////////////
                        
                    }
                }
            }
        });
    }
    
    ////****制作手动干预的table页面
    function private_setManualrecommLayout(url){
        Clicki.layout.destroy().add({
            "layout":{
                "theAlgorithm_manualrecomm":{
                    "type":"grid",
                    "config":{
                        "url":url,
                        "params":{
                            "page":1,
                            "limit":20
                        },
                        "caption":{
                            "userID":{
                                "desc":"",
                                "title":LANG("用户ID")
                            },
                            "userNickname":{
                                "desc":"",
                                "title":LANG("用户昵称")
                            },
                            "gender":{
                                "desc":"",
                                "title":LANG("性别")
                            },
                            "age":{
                                "desc":"",
                                "title":LANG("年龄")
                            },
                            "register_region":{
                                "desc":"",
                                "title":LANG("区域")
                            },
                            "state":{
                                "desc":"",
                                "title":LANG("状态")
                            },
                            "expired":{
                                "desc":"",
                                "title":LANG("干预失效时间")
                            },
                            "recomm_num":{
                                "desc":"",
                                "title":LANG("推荐视频个数")
                            },
                            "recomm_clear":{
                                "desc":"",
                                "title":LANG("清空")
                            },
                            "selectAll":{
                                "desc":"",
                                "title":'<label class="titleLabel">全选</label><input class="titleInput" id="selAll" type="checkbox"/><a id="recomm_item" href="javascript:void(0);">干预选中用户</a>'
                            }
                        },
                        "colModel":[
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'userID'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).id;
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'userNickname'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).nickname;
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'gender'
                                ,render: function(key, i, row){
                                    var gen = this._getCollection().getModelDataAt(row).gender
                                    if(gen == 1){
                                        gen = "男";
                                    }else if(gen == 2){
                                        gen = "女";
                                    }else{
                                        gen = "";
                                    }
                                    return gen;
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'age'
                                ,render: function(key, i, row){
                                    var _age = this._getCollection().getModelDataAt(row).age;
                                    if(_age == null){
                                        _age = "";
                                    }
                                    return _age;
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'register_region'
                                ,render: function(key, i, row){
                                	var province = this._getCollection().getModelDataAt(row).province || "";
                                	var city = this._getCollection().getModelDataAt(row).city || "";
                                    var region = province + ',' + city;
                                    return region !== ',' ? region : "";
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'state'
                                ,render: function(key, i, row){
                                    var r = this._getCollection().getModelDataAt(row).recomm;
                                    return r>0?"已推荐":(r<0?"已失效":"未推荐");
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'expired'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).expired!=0?this._getCollection().getModelDataAt(row).expired:"";
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'recomm_num'
                                ,render: function(key, i, row){
                                    return '<a href="javascript:void(0);" data-id="'+this._getCollection().getModelDataAt(row).id+'" data-index='+row+' class="recomm_num">'+this._getCollection().getModelDataAt(row).video_count+'</a>';
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'recomm_clear'
                                ,render: function(key, i, row){
                                    return '<a href="javascript:void(0);" data-id="'+this._getCollection().getModelDataAt(row).id+'" data-index='+row+' class="recomm_clear" title="清空">清空</a>';
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'selectAll'
                                ,render: function(key, i, row){
                                    return '<input class="titleInput recommCheckbox" data-id='+this._getCollection().getModelDataAt(row).id+' type="checkbox"/>';
                                }
                            }
                        ]
                        ,"target":"algorithm_manualrecommArea"
                        //////////////////////////构建完成后的回调函数////////////////////////////////
                        ,callback:function(){
                            //推荐视频个数查看
                            $(".recomm_num").die('click').live("click", function(event){
                                if($(this).text() != "0"){
                                    var _url = "/algorithm/recommvideosource";
                                    var _id = $(this).attr("data-id");
                                    $.ajax({
                                        url:_url,
                                        data:'uid=' + _id,
                                        type: 'GET',
                                        dataType: 'json',
                                        success: function(rdata){
                                            $(".theGridMarkLayout").hide();
                                            if (rdata.success){
                                                private_recomm_checkVideoNum(rdata);
                                                return false;
                                            }else{
                                                private_alert(rdata.error);
                                                return false;
                                            }
                                        },
                                        error: function(XMLHttpRequest, textStatus, errorThrown){
                                            $(".theGridMarkLayout").hide();
                                            // 服务器连接解析错误
                                            private_alert("服务器连接解析错误");
                                            return false;
                                        }
                                    });
                                }else{
                                    private_alert_noCtrlBtn("无推荐视频");
                                }
                            });
                            
                            //"清空"操作
                            $(".recomm_clear").die('click').live("click", function(event){  
                                var recommNumobj = $(this).parents("tr").children().eq(8).find("div a");
                                //var num = $(".managerfilter_modify").index($(event.target));
                                //var _id = _getThisData.getModelDataAt(num).id;
                                var _id =  $(this).attr('data-id');
                                var _url = '/algorithm/clearrecomm';
                                if(recommNumobj.html() != "0"){
                                    private_confirm(LANG("是否清空用户推荐视频？"), function(){
                                        $.ajax({
                                            url:_url,
                                            data:'uid=' + _id,
                                            type: 'GET',
                                            dataType: 'json',
                                            success: function(rdata){
                                                $(".theGridMarkLayout").hide();
                                                if (rdata.success){
                                                    //recommNumobj.html("0");
                                                    Clicki.layout.get('theAlgorithm_manualrecomm').refresh({data:{}});
                                                    private_alert("已清空");
                                                    return false;
                                                }else{
                                                    private_alert(rdata.error);
                                                    return false;
                                                }
                                            },
                                            error: function(XMLHttpRequest, textStatus, errorThrown){
                                                $(".theGridMarkLayout").hide();
                                                // 服务器连接解析错误
                                                private_alert("服务器连接解析错误");
                                                return false;
                                            }
                                        });
                                    });
                                }
                            });
                            //var _getThisData = this;
                        }
                        /////////////////////////////////////////////////////////////
                    }
                }
            }
        });
    }
    
    ////****制作手动干预推荐细目查询的table页面
    function private_setManualRecommItemLayout(url){
        var obj = Clicki.layout.get('theAlgorithm_manualrecommitem');
        if(obj){
            obj.destroy();
        }
        Clicki.layout.add({
            "layout":{
                "theAlgorithm_manualrecommitem":{
                    "type":"grid",
                    "config":{
                        "url":url,
                        "params":{
                            "page":1,
                            "limit":10
                        },
                        "caption":{
                            "videoID":{
                                "desc":"",
                                "title":LANG("视频ID")
                            },
                            "title":{
                                "desc":"",
                                "title":LANG("名称")
                            },
                            "videoTpye":{
                                "desc":"",
                                "title":LANG("视频类别")
                            },
                            "createTime":{
                                "desc":"",
                                "title":LANG("创建时间")
                            },
                            "select":{
                                "desc":"",
                                "title":LANG("选择")
                            }
                        },
                        "colModel":[
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,width:"150px"
                                ,data:'videoID'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).vid;
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'title'
                                ,render: function(key, i, row){
                                    var _title = this._getCollection().getModelDataAt(row).title;
                                    var playurl = this._getCollection().getModelDataAt(row).play_url;
                                    var vid = this._getCollection().getModelDataAt(row).vid;
                                    if(playurl == ""){
                                        playurl = 'http://search.cctv.com/playVideo.php?detailsid='+vid;
                                    }
                                    return '<a class="underline" href="'+playurl+'" target="_blank">'+_title+'</a>';
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'videoTpye'
                                ,render: function(key, i, row){
                                    var type = this._getCollection().getModelDataAt(row).type
                                    return type?type:"";
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'createTime'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).create_time;
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'select'
                                ,render: function(key, i, row){
                                    var data_id = this._getCollection().getModelDataAt(row).id;
                                    var cartHasItem = $('#tableCart tbody.gridContentBody tr td a[data-id="'+data_id+'"]').parents("tr");
                                    if(cartHasItem.length > 0){
                                        return '<input class="recommCheckboxItem" checked="checked" data-id='+data_id+' type="checkbox"/>';
                                    }else{
                                        return '<input class="recommCheckboxItem" data-id='+data_id+' type="checkbox"/>';
                                    }
                                }
                            }
                        ]
                        ,"target":"manualRecommItemArea"
                        //////////////////////////构建完成后的回调函数////////////////////////////////
                        ,callback:function(){
                            return false;
                        }
                        /////////////////////////////////////////////////////////////
                        
                    }
                }
            }
        });
    }
    
    ////****制作过滤植入的table页面
    function private_setManagerfilterLayout(url){
        Clicki.layout.destroy().add({
            "layout":{
                "theAlgorithm_managerfilter":{
                    "type":"grid",
                    "config":{
                        "url":url,
                        "params":{
                            "page":1,
                            "limit":15
                        },
                        "caption":{
                            "name":{
                                "desc":"",
                                "title":LANG("名称")
                            },
                            "type":{
                                "desc":"",
                                "title":LANG("类型")
                            }
                            ,
                            "setting":{
                                "desc":"",
                                "title":LANG("设置")
                            }
                            ,
                            "description":{
                                "desc":"",
                                "title":LANG("描述")
                            }
                        },
                        "colModel":[
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,width:"100px"
                                ,data:'name'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).name;
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'type'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).type;
                                }
                            },
                            {
                                "tdCls":"theTextLeft"
                                ,"cls":"admin-tab-left clearfix"
                                ,data:'setting'
                                ,render: function(key, i, row){
                                    var arr = this._getCollection().getModelDataAt(row).setting;
                                    var html = '';
                                    for(var j =0;j<arr.length;j++ ){
                                        if(j==arr.length-1){
                                            html += '<p class="npadding npaddinglast">'+arr[j]+'</p>';
                                        }else{
                                            html += '<p class="npadding">'+arr[j]+'</p>';
                                        }
                                    }
                                    return html;
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'description'
                                ,width:'200px'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).desc;
                                }
                            },
                            {
                                text:LANG("操作"),
                                "cls":"admin-tab-center",
                                data:null,
                                tdCls:"siteCtrlTd",
                                width: '75px',
                                render:function(key,i,row){
                                    var tagA_arr = ["修改","删除"];
                                    var data_id = this._getCollection().getModelDataAt(row).id;
                                    var str = '';
                                    var _use =this._getCollection().getModelDataAt(row).use
                                    if(_use){
                                        str = '<a title="'+tagA_arr[1]+'" class="managerfilter_delete noExport" data-use="'+_use+'" data-id="'+data_id+'">'+tagA_arr[1]+'</a>';
                                    }else{
                                        str = '<a href="javascript:void(0);" data-id="'+data_id+'" data-use="'+_use+'" class="managerfilter_delete" title="'+tagA_arr[1]+'">'+tagA_arr[1]+'</a>';
                                    }
                                    return ['<p class="managOperating"><a href="javascript:void(0);" data-id="'+data_id+'" class="managerfilter_modify frist" title="'+LANG(tagA_arr[0])+'">'+LANG(tagA_arr[0])+'</a>',str+'</p>'].join("");
                                }
                            }
                        ]
                        ,"target":"algorithm_managerfilterArea"
                        //////////////////////////构建完成后的回调函数////////////////////////////////
                        ,callback:function(){
                            var _getThisData = this;
                            $('.managerfilter_delete[data-use="true"]').parents("tr").addClass("inused");
                            //"修改"操作//
                            $(".managerfilter_modify").die('click').live("click", function(event){  
                                /*var num = $(".managerfilter_modify").index($(event.target));
                                var _id = _getThisData.getModelDataAt(num).id;*/
                                var _id =  $(this).attr('data-id');
                                var url = '/algorithm/handledetail?id=' + _id;
                                $.getJSON(url, function(rdata){
                                    if (rdata.success){
                                        cache.managerfilter_curr_data = rdata.result;
                                        private_managerfilter_modify(cache.managerfilter_curr_data);
                                    }else{
                                        private_alert(rdata.message);
                                    }
                                    return false;
                                })
                            });
                            
                            //"删除"操作//
                            $(".managerfilter_delete").die('click').live("click", function(event){  
                                if($(this).attr("href")){
                                    var num = $(".managerfilter_delete").index($(event.target));
                                    /*var _id = _getThisData.getModelDataAt(num).id;*/
                                    var _id =  $(this).attr('data-id');
                                    var url = '/algorithm/delhandle?id=' + _id;
                                    //console.log(url);
                                    private_confirm(LANG("确认要删除么？(删除可能会影响到算法应用场景的推荐结果)"), function(){
                                        $.getJSON(url, function(rdata){
                                            if (rdata.success){
                                                //window.location.reload();
                                                Clicki.layout.get('theAlgorithm_managerfilter').refresh({data:{}});
                                                //$(".G-tableSet .theTableBox table .NoSubZebraLine tr").eq(num).remove();
                                                return false;
                                            }else{
                                                private_alert_noCancelBtn(rdata.error);
                                            }
                                            return false;
                                        });
                                    });
                                }
                            });
                        }
                        /////////////////////////////////////////////////////////////
                        
                    }
                }
            }
        });
    }
    
    ////////////////////////////////////////点击按钮事件的所有函数/////////////////////////////////////////////////////结束////////////////

    ////****模板对象
    var _tpls = {
            algorithm_algorithmlist:function(){
                return '<h2>'+LANG("算法设置")+'</h2><div id="showArea" class="theShowArea thelogArea">\
                            <div class="G-tableSet">\
                            <div id="algorithm_algorithmlistArea" class="theTableBox"></div>\
                            </div>\
                        </div>';
            },
            algorithm_manageprocess:function(){
                return '<h2>'+LANG("作业管理")+'</h2>\
                        <div id="showArea" class="theShowArea thelogArea">\
                            <div class="G-tableSet">\
                            <div id="algorithm_manageprocessArea" class="theTableBox"></div>\
                            </div>\
                        </div>';
            },
            algorithm_scene:function(){
                return '<h2>'+LANG("应用场景")+'</h2>\
                        <div id="showArea" class="theShowArea thelogArea">\
                            <div class="G-tableSet">\
                            <div id="algorithm_sceneArea" class="theTableBox"></div>\
                            </div>\
                        </div>';
            },
            algorithm_managerfilter:function(){
                return '<div class="clearfix"><div class="floatleft"><h2>'+LANG("过滤/植入")+'<span>(对全部用户生效)</span></h2></div><a style="float:right;" href="#/algorithm/addNewJGKZ" class="btnGreen">新增</a></div>\
                        <div id="showArea" class="theShowArea thelogArea">\
                            <div class="filterBtn clearfix">\
                                <h4 class="video_recomm active">视频推荐</h4>\
                                <h4 class="content_recomm">微博内容推荐</h4>\
                                <h4 class="content_recomm">微博用户推荐</h4>\
                            </div>\
                            <div class="G-tableSet">\
                            <div id="algorithm_managerfilterArea" class="theTableBox"></div>\
                            </div>\
                        </div>';
            },
            algorithm_manualrecomm:function(){
                /*<p>\
                        <label>历史类别</label>\
                        <select id="manual_historyType"></select>\
                    </p>\*/
                return '<div class="theGridMarkLayout" style="display:none;"><div></div></div>\
                        <h2>'+LANG("手动干预")+'<span>(只对于特别指定用户生效，目前只针对视频)</span></h2>\
                        <div class="error_message"></div>\
                        <div id="showArea" class="theShowArea thelogArea">\
                            <div class="manualContent">\
                                <div class="top clearfix">\
                                    <p><label>年龄</label><input id="ageLeft" class="ageLeft" type="text" maxlength="4" />~<input id="ageRight" class="ageRight" type="text" maxlength="4" /><label>岁</label></p>\
                                    <p class="padding"><label>性别:</label><label>男</label><input type="radio" class="gender" name="gender" value="1" /><label>女</label><input type="radio" class="gender" name="gender" value="2" /></p>\
                                    <p>\
                                        <label>地域</label>\
                                        <select id="manual_region"></select>\
                                        <label>市/省</label>\
                                    </p>\
                                    <p><label>用户ID</label><input id="uesrId" type="text" class="recommInput" value="" maxlength="20" /></p>\
                                    <p><label>用户昵称</label><input id="uesrNickname" type="text" class="recommInput" value="" maxlength="20" /></p>\
                                    <p class="last"><input id="manualrecomm_check" type="button" class="btn_lan02" value=" 查 询 " /></p>\
                                </div>\
                            </div>\
                            <div class="G-tableSet">\
                                <div id="algorithm_manualrecommArea" class="theTableBox"></div>\
                            </div>\
                        </div>';
            },
            algorithm_previewresult:function(){
                return '<div class="theGridMarkLayout" style="display:none;"><div></div></div>\
                        <h2>'+LANG("推荐结果预览")+'</h2>\
                        <div class="error_message"></div>\
                        <div id="showArea" class="theShowArea thelogArea">\
                            <div class="previewContent clearfix">\
                                <p>\
                                    <label>推荐场景</label>\
                                    <select id="preview_type">\
                                        <option value="视频">视频推荐</option>\
                                        <option value="微博用户">微博用户推荐</option>\
                                        <option value="微博内容">微博内容推荐</option>\
                                        <option value="用户中心好友推荐">用户中心好友推荐</option>\
                                    </select>\
                                </p>\
                                <p><label>用户ID</label><input id="userid" class="userid" type="text" maxlength="20"/></p>\
                                <p class="vids">\
                                    <label>视频ID</label>\
                                    <input id="uservid" class="userid" type="text" maxlength="60"/>\
                                    <img data-des="用户最近一次观看过的视频ID。" src="../resources/styles/images/icon/icon_dec.png">\
                                </p>\
                                <p class="last"><input id="preview_check" class="btn_lan02" type="button" value=" 查 询 "></p>\
                            </div>\
                            <div class="preview_result">\
                                <div class="preview_button clearfix">\
                                    <h4 class="result active">推荐结果</h4>\
                                    <h4 class="collection">推荐结果候选集</h4>\
                                </div>\
                                <div class="resultContent">\
                                    <div class="result_vedio clearfix"></div>\
                                    <div class="result_collection clearfix"></div>\
                                    <div class="result_user clearfix"></div>\
                                    <div class="result_friends clearfix"></div>\
                                    <div class="result_content"></div>\
                                </div>\
                            </div>\
                        </div>';
            },
            algorithm_feedback:function(){
                return '<div class="theGridMarkLayout" style="display:none;"><div></div></div>\
                        <h2>'+LANG("推荐反馈")+'</h2>\
                        <div class="error_message"></div>\
                        <div id="showArea" class="theShowArea thelogArea">\
                            <div class="feedbackContent clearfix">\
                                <p>\
                                    <label>应用场景</label>\
                                    <select id="feedback_secne">\
                                        <option value="web播放器视频推荐">视频推荐</option>\
                                    </select>\
                                </p>\
                                <p><label>时间</label><span id="feedback_date"></span></p>\
                                <p class="last"><input id="feedback_check" type="button" class="btn_lan02" value=" 查 询 " /></p>\
                            </div>\
                            <div id="feedback_chart"></div>\
                            <div id="algorithm_feedbackArea" class="theTableBox"></div>\
                        </div>';
            },
            algorithm_hotweibo:function(name){
                return '<h2>'+LANG(name)+'</h2>\
                                <div id="showArea" class="theShowArea thelogArea">\
                                    <div class="selectCondition">\
                                        <div class="topCon">\
                                            <div class="text clearfix">\
                                                <span>24小时</span>\
                                                <span class="active">48小时</span>\
                                                <span class="last">本周</span>\
                                            </div>\
                                            <div class="img clearfix">\
                                                <div class="icon active" data-period="24"></div>\
                                                <div class="icon" data-period="48"></div>\
                                                <div class="icon last" data-period="week"></div>\
                                            </div>\
                                        </div>\
                                        <div class="bottomCon">\
                                            <span>请选择认证类型</span>\
                                            <select id="hottype" class="clearfix"></select>\
                                        </div>\
                                    </div>\
                                    <div class="G-tableSet">\
                                    <div id="algorithm_hotweiboArea" class="theTableBox"></div>\
                                    </div>\
                                </div>';
            },
            algorithm_hotuser:function(name){
                return '<h2>'+LANG(name)+'</h2>\
                                <div id="showArea" class="theShowArea thelogArea">\
                                    <div class="selectCondition">\
                                        <div class="topCon">\
                                            <div class="text clearfix">\
                                                <span>24小时</span>\
                                                <span class="active">48小时</span>\
                                                <span class="last">本周</span>\
                                            </div>\
                                            <div class="img clearfix">\
                                                <div class="icon active" data-period="24"></div>\
                                                <div class="icon" data-period="48"></div>\
                                                <div class="icon last" data-period="week"></div>\
                                            </div>\
                                        </div>\
                                        <div class="bottomCon">\
                                            <span>请选择认证类型</span>\
                                            <select id="hottype" class="clearfix"></select>\
                                        </div>\
                                    </div>\
                                    <div class="G-tableSet">\
                                    <div id="algorithm_hotuserArea" class="theTableBox"></div>\
                                    </div>\
                                </div>';
            },
            algorithm_hottopic:function(name){
                return '<h2>'+LANG(name)+'</h2>\
                            <div id="showArea" class="theShowArea thelogArea">\
                                <div class="selectCondition">\
                                    <div class="topCon">\
                                        <div class="text clearfix">\
                                            <span>24小时</span>\
                                            <span class="active">48小时</span>\
                                            <span class="last">本周</span>\
                                        </div>\
                                        <div class="img clearfix">\
                                            <div class="icon active" data-period="24"></div>\
                                            <div class="icon" data-period="48"></div>\
                                            <div class="icon last" data-period="week"></div>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="G-tableSet">\
                                    <div id="algorithm_hottopicArea" class="theTableBox"></div>\
                                </div>\
                            </div>';
            },
            algorithm_potential:function(name){
                return '<h2>'+LANG(name)+'</h2>\
                        <div id="showArea" class="theShowArea thelogArea">\
                            <div class="G-tableSet">\
                            <div id="algorithm_potentialArea" class="theTableBox"></div>\
                            </div>\
                        </div>';
            },
            setResult_vedio:function(url,imgsrc,text){
                return '<div class="vedio_listnr">\
                                <div class="floatimg"><a target="_blank" href="'+url+'"></a></div>\
                                <p class="floatp"><span>'+text+'</span></p>\
                                <div class="v_img"><a target="_blank" href="'+url+'"><img alt="" src="'+imgsrc+'"></a></div>\
                            </div>';
            },
            setResult_user:function(url,imgsrc,name,v){
                return '<div class="user_listnr">\
                            <a href="'+url+'" target="_blank"><img src="'+imgsrc+'" alt=""/></a>\
                            <p><a class="sptext" href="'+url+'" target="_blank">'+name+'</a><span class="'+v+'"></span></p>\
                        </div>';
            },
            setResult_content:function(url,contentUrl,imgsrc,name,text,v,last){
                return '<div class="content_listnr '+last+' clearfix">\
                            <div class="listnr_left">\
                                <a href="'+url+'" target="_blank"><img src="'+imgsrc+'" alt=""/></a>\
                                <p><a class="sptext" href="'+url+'" target="_blank">'+name+'</a><span class="'+v+'"></span></p>\
                            </div>\
                            <div class="listnr_right">\
                                <p>'+text+'<a href="'+contentUrl+'" target="_blank" style="padding-left:5px;">查看内容</a></p>\
                            </div>\
                        </div>';
            },
            setResult_friends:function(url,imgsrc,name,v){
                return '<div class="friends_listnr">\
                            <img src="'+imgsrc+'" alt=""/>\
                            <p>'+name+'<span class="'+v+'"></span></p>\
                        </div>';
            },
            error:function(){
                return '<h2>您没有操作权限</h2>';
            }
        }

return {
    MODULE_NAME: 'algorithm',
    /**
         * 算法设置
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        algorithmlist:function(R, param){
            setHtml(
                R
                ,_tpls.algorithm_algorithmlist()
                , "algorithmlist"
                , LANG("算法设置")
            );
            Clicki.layout.destroy().add({
                "layout":{
                    "theAlgorithm_algorithmlist":{
                        "type":"grid",
                        "config":{
                            "url":"/algorithm/algorithmlist",
                            "params":{
                                "page":1,
                                "limit":20
                            },
                            "caption":{
                                "name":{
                                    "desc":"",
                                    "title":LANG("算法名称")
                                },
                                "description":{
                                    "desc":"",
                                    "title":LANG("算法描述")
                                }
                                ,
                                "type":{
                                    "desc":"",
                                    "title":LANG("所属类别")
                                }
                            },
                            "colModel":[
                                {
                                    "tdCls":"theTextCenter"
                                    ,"cls":"admin-tab-center"
                                    ,data:'name'
                                    ,render: function(key, i, row){
                                        //console.dir(this)
                                        return this._getCollection().getModelDataAt(row).name;
                                    }
                                },
                                {
                                    "tdCls":"theTextLeft"
                                    ,"cls":"admin-tab-left"
                                    ,data:'description'
                                    ,render: function(key, i, row){
                                        return this._getCollection().getModelDataAt(row).desc;
                                    }
                                },
                                {
                                    "tdCls":"theTextCenter"
                                    ,"cls":"admin-tab-center"
                                    ,data:'type'
                                    ,render: function(key, i, row){
                                        return this._getCollection().getModelDataAt(row).type;
                                    }
                                },
                                {
                                    text:LANG("操作"),
                                    "cls":"admin-tab-center",
                                    data:null,
                                    "tdCls":"theTextCenter",
                                    width: '173px',
                                    render:function(key,i,row){
                                        var len = this._getCollection().getModelDataAt(row).params.length;
                                        if(len == 0){
                                            return '<a data-id='+this._getCollection().getModelDataAt(row).algorithm_id+' class="algorithmlist_check noExport" title="'+LANG("修改参数")+'">'+LANG("修改参数")+'</a>'
                                        }else{
                                            return '<a href="javascript:void(0);" data-id='+this._getCollection().getModelDataAt(row).algorithm_id+' class="algorithmlist_check" title="'+LANG("修改参数")+'">'+LANG("修改参数")+'</a>'
                                        }   
                                    }
                                }
                            ]
                            ,"target":"algorithm_algorithmlistArea"
                            //////////////////////////构建完成后的回调函数////////////////////////////////
                            ,callback:function(){
                                var grid = this;
                                //"查看参数设置"操作//
                                $(".algorithmlist_check").die('click').live("click", function(event){
                                    if($(this).attr("href")){
                                        var _getData = grid.getAllModelData();
                                        var num = $(".algorithmlist_check").index($(event.target));
                                        cache.scene_curr_data = _getData[num];
                                        private_algorithmlist_check(cache.scene_curr_data);
                                    }
                                    return false;
                                });
                            }
                            /////////////////////////////////////////////////////////////
                            
                        }
                    }
                }
            });
        },
        
        /**
         * 应用场景列表
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        scene:function(R, param){
            setHtml(
                R
                ,_tpls.algorithm_scene()
                , "scene"
                , LANG("应用场景")
            );
            Clicki.layout.destroy().add({
                "layout":{
                    "theAlgorithm_scene":{
                        "type":"grid",
                        "config":{
                            "url":"/algorithm/scene",
                            "params":{
                                "page":1,
                                "limit":20
                            },
                            "caption":{
                                "name":{
                                    "desc":"",
                                    "title":LANG("场景名称")
                                },
                                "description":{
                                    "desc":"",
                                    "title":LANG("场景描述")
                                }
                                ,
                                "object":{
                                    "desc":"",
                                    "title":LANG("推荐对象")
                                }
                                ,
                                "algorithm":{
                                    "desc":"",
                                    "title":LANG("使用算法")
                                }
                            },
                            "colModel":[
                                {
                                    "tdCls":"theTextCenter"
                                    ,"cls":"admin-tab-center"
                                    ,data:'name'
                                    ,render: function(key, i, row){
                                        //console.dir(this)
                                        return this._getCollection().getModelDataAt(row).name;
                                    }
                                },
                                {
                                    "tdCls":"theTextLeft"
                                    ,"cls":"admin-tab-left"
                                    ,data:'description'
                                    ,render: function(key, i, row){
                                        return this._getCollection().getModelDataAt(row).desc;
                                    }
                                },
                                {
                                    "tdCls":"theTextCenter"
                                    ,"cls":"admin-tab-center"
                                    ,width: '100px'
                                    ,data:'object'
                                    ,render: function(key, i, row){
                                        return this._getCollection().getModelDataAt(row).object_type;
                                    }
                                },
                                {
                                    "tdCls":"theTextCenter"
                                    ,"cls":"admin-tab-center"
                                    ,data:'algorithm'
                                    ,render: function(key, i, row){
                                        return this._getCollection().getModelDataAt(row).algorithm;
                                    }
                                },
                                {
                                    text:LANG("操作"),
                                    "cls":"admin-tab-center",
                                    data:null,
                                    tdCls:"siteCtrlTd",
                                    width: '173px',
                                    render:function(key,i,row){
                                        var tagA_arr = ["选择推荐算法","设置过滤/植入"];
                                        var str = '';
                                        if(this._getCollection().getModelDataAt(row).disabled_handle){
                                            str = '<a title="'+tagA_arr[1]+'" class="scene_checkFliter noExport" data-name="'+this._getCollection().getModelDataAt(row).name+'">'+tagA_arr[1]+'</a>';
                                        }else{
                                            str = '<a href="javascript:void(0);" class="scene_checkFliter" data-name="'+this._getCollection().getModelDataAt(row).name+'" title="'+tagA_arr[1]+'">'+tagA_arr[1]+'</a>';
                                        }
                                        return ['<p class="managOperating"><a href="javascript:void(0);" class="scene_checkParams frist" data-name="'+this._getCollection().getModelDataAt(row).name+'"   title="'+tagA_arr[0]+'">'+tagA_arr[0]+'</a>',str+'</p>'].join("");
                                        
                                    }
                                }
                            ]
                            ,"target":"algorithm_sceneArea"
                            //////////////////////////构建完成后的回调函数////////////////////////////////
                            ,callback:function(){
                                var grid = this;
                                //"查看参数设置"操作//
                                $(".scene_checkParams").die('click').live("click", function(event){
                                    var _getData = grid.getAllModelData();
                                    var num = $(".scene_checkParams").index($(event.target));
                                    var dataname = $(this).attr("data-name").substring(0,6);
                                    $.getJSON('/algorithm/algorithmlist?type='+encodeURIComponent(_getData[num].object_type), function(rdata){
                                        if (rdata.success){
                                            cache.scene_curr_data = _getData[num];
                                            cache.scene_curr_sceneData = rdata.result.items;
                                            private_scene_checkParams(cache.scene_curr_data,dataname);
                                            return false;
                                        }else{
                                            private_alert(rdata.message);
                                        }
                                        return false;
                                    })
                                });
                                
                                //"查看过滤/植入"操作//
                                $(".scene_checkFliter").die('click').live("click", function(event){
                                    if($(this).attr("href")){
                                        var _getData = grid.getAllModelData();
                                        var _name = $(this).attr("data-name");
                                        $.getJSON('/algorithm/resulthandle?recomm_obj='+encodeURIComponent(_name), function(rdata){
                                            if (rdata.success){
                                                var num = $(".scene_checkFliter").index($(event.target));
                                                cache.scene_curr_filterData = rdata.result.items;
                                                cache.scene_curr_data = _getData[num];
                                                private_scene_checkFliter(cache.scene_curr_data);
                                                return false;
                                            }else{
                                                private_alert(rdata.message);
                                            }
                                            return false;
                                        });
                                    }
                                })

                            }
                            /////////////////////////////////////////////////////////////
                            
                        }
                    }
                }
            });
        },
        /**
         * 过滤/植入列表
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        managerfilter:function(R, param){
            setHtml(
                R
                ,_tpls.algorithm_managerfilter()
                , "resulthandle"
                , LANG("过滤/植入(对全部用户生效)")
            );
            private_setManagerfilterLayout("/algorithm/resulthandle?all=1&recomm_obj="+encodeURIComponent("视频推荐"));
            
            //切换视频和内容的点击事件
            $(".filterBtn h4").click(function(){
                if(!$(this).hasClass("active")){
                    var _url = '/algorithm/resulthandle?all=1&recomm_obj=';
                    _url += encodeURIComponent($(this).text());
                    $('.filterBtn h4').removeClass("active");
                    $(this).addClass("active");
                    private_setManagerfilterLayout(_url);
                }
            });
        },
        
        /**
         * 手动干预
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        manualrecomm:function(R, param){
            $.ajax({
                url:'/algorithm/videotype',
                type: 'GET',
                dataType: 'json',
                success: function(rdata){
                    if (rdata.success){
                        cache.optionItem = rdata.result.items;
                    }
                    return false;
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    // 服务器连接解析错误
                    //private_alert("服务器连接解析错误");
                    return false;
                }
            });
            $.ajax({
                url:'/algorithm/city',
                type: 'GET',
                dataType: 'json',
                success: function(rdata){
                    if (rdata.success){
                        cache.optionCity = rdata.result.items;
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    // 服务器连接解析错误
                    //private_alert("服务器连接解析错误");
                },
                complete:function (XMLHttpRequest, textStatus) {
                    //this;//调用本次AJAX请求时传递的options参数
                   $.each(cache.optionCity,function(i,n){
                       var _option = '<option value="'+n+'">'+n+'</option>';
                       $("#manual_region").append(_option);
                   });
                    return false;
                }
            });
            setHtml(
                R
                ,_tpls.algorithm_manualrecomm()
                , "manualrecomm"
                , LANG("手动干预(只对于特别指定用户生效，目前只针对视频)")
            );
            
            $(".theGridMarkLayout").show().delay(400).hide(0);
            //设置历史类别
            /*$("#manual_historyType").append('<option value="">----</option>')
            $.each(rdata.result, function(i,n){
              $("#manual_historyType").append('<option value='+n+'>'+n+'</option>')
            });*/
           
            //查询按钮
            $("#manualrecomm_check").click(function(){
                var error_box = $('.error_message');
                var err = '';
                var al = $("#ageLeft").val().match(/^[0-9]*$/g);
                var ar = $("#ageRight").val().match(/^[0-9]*$/g);
                var uesrId = $("#uesrId").val();
                var uesrNickname = $("#uesrNickname").val();
                if(!uesrId.match(/^[a-zA-Z0-9]*$/g)){
                    err += '<li>'+LANG('请输入字母、英文类型的用户ID')+'</li>';
                }
                if(!al || !ar){
                    err += '<li>'+LANG('请输入数字类型的年龄')+'</li>';
                }
                if(al!="" && ar==""){
                    err += '<li>'+LANG('输入完整的年龄范围')+'</li>';
                }
                if(al=="" && ar!=""){
                    err += '<li>'+LANG('输入完整的年龄范围')+'</li>';
                }
                if(al!="" && ar!=""){
                    if(parseInt(al)>parseInt(ar)){
                        err += '<li>'+LANG('输入年龄不合法')+'</li>';
                    }
                }
                if (err != ''){
                    error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                }else{
                    error_box.slideUp();
                    var tt = $(".manualContent .top p input.gender:checked").val();
                    var gender = (tt==undefined?"":tt);
                    //var history = $("#manual_historyType option:selected").val();
                    var region = $("#manual_region option:selected").val();
                    var url = '/algorithm/passportuser?gender='+gender+'&begin_age='+al+'&end_age='+ar+'&region='+encodeURIComponent(region)+'&uesrId='+uesrId+'&uesrNickname='+encodeURIComponent(uesrNickname);
                    private_setManualrecommLayout(url);
                    $("#recomm_item").hide().fadeIn(1000);
                }
            });
            
            //全选按钮
            $("#selAll").die('click').live("click", function(event){
                if($(this).attr("checked")){
                    $(".recommCheckbox").prop("checked", true);
                }else{
                    $(".recommCheckbox").prop("checked", false);
                }
            });
            //复选框
            $(".recommCheckbox").die('click').live("click", function(event){
                if($(this).length != $(".recommCheckbox:checked").length){
                    $("#selAll").prop("checked", false);
                }   
            });
            //干预选中用户按钮
            $("#recomm_item").die('click').live("click", function(event){
                var senddata = {};
                //uids=&vedio_ids=
                cache.uids = [];
                var checkbox = $("input.recommCheckbox:checked");
                if(checkbox.length<=0){
                    private_alert(LANG("请选择干预的用户"));
                }else{
                    checkbox.each(function(i) { 
                        cache.uids.push($(this).attr("data-id"));
                    });
                    private_manualrecomm_recommItem();
                }
            });  
        },
        
        /**
         * 推荐结果预览
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        previewresult:function(R, param){
            setHtml(
                R
                ,_tpls.algorithm_previewresult()
                , "previewresult"
                , LANG("推荐结果预览")
            );
            $(".theGridMarkLayout").show().delay(400).hide(0);
            
            var r_vedio =  $(".preview_result .resultContent .result_vedio");
            var r_collection = $(".preview_result .resultContent .result_collection");   
            var r_user =  $(".preview_result .resultContent .result_user");
            var r_content =  $(".preview_result .resultContent .result_content");
            var r_friend = $(".preview_result .resultContent .result_friends");
            
            //推荐场景 下拉框改变的时候触发事件
            $("#preview_type").change( function() {
              r_vedio.hide().empty();
              r_collection.hide().empty();
              r_user.hide().empty();
              r_content.hide().empty();
              r_friend.hide().empty();
              $(".preview_result .result").hide();
              $(".preview_result .collection").hide();
                            
              $('.previewContent p input[type="text"]').val("");
              if($(this).children("option:selected").val() == "视频"){
                    $(".previewContent p.vids").show();
              }else{
                  $(".previewContent p.vids").hide();
              }
            });
            
            //点击问号事件
            $('.previewContent p img').click(function(){
                var _dec = $(this).attr("data-des");
                var html = '<div class="checkDes"><p class="des">'+_dec+'</p></div>';
                var title = "视频ID";
                private_training_checkDes(title,html)
            });
            
            //查询按钮点击事件
            $("#preview_check").click(function(){
                var error_box = $('.error_message');
                var err = '';
                var selobj = $("#preview_type option:selected");
                var userid = $("#userid").val();
                var vid = $("#uservid").val();
                
                if(!userid.match(/^[0-9]+$/g)){
                    err += '<li>'+LANG('请输入数值型的用户ID')+'</li>';   
                }
                
                if(selobj.val() == "视频"){
                    if(!vid.match(/^[a-zA-Z0-9]+$/g)){
                        err += '<li>'+LANG('请输入字母、数值型的视频ID')+'</li>';   
                    }
                    
                    if(err != ""){
                        error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                    }else{
                        error_box.slideUp();
                        $(".theGridMarkLayout").show();
                        $(".preview_result .collection").hide();
                        $(".preview_result .resultContent .result_collection").hide();
                        $(".preview_result .result").hide();
                        $(".preview_result .result").addClass("active");
                        $(".preview_result .collection").removeClass("active");
                        //重新调整高度
                        $("#imOutterArea").css("height","100%");
                        //隐藏
                        r_user.hide();
                        r_content.hide();
                        r_friend.hide();
                        //清空
                        r_vedio.empty();
                        r_collection.empty();
                        r_user.empty();
                        r_content.empty();
                        r_friend.empty();
                        var type = 1;   
                        var url = '/algorithm/recommpreview';
                        
                        $.ajax({
                            url:url,
                            data: 'type='+type+'&id='+userid+'&vids='+vid,
                            type: 'GET',
                            dataType: 'json',
                            success: function(rdata){
                                $(".theGridMarkLayout").hide();
                                $(".preview_result .result").show();
                                $(".preview_result .collection").show();
                                if (rdata.success){
                                    var len = rdata.result.finalresult.items.length;
                                    var can_len = rdata.result.candidates.items.length;
                                    if(rdata.result.finalresult.items && rdata.result.finalresult.items.length){
                                        $.each(rdata.result.finalresult.items, function(i, n){
                                            var linkurl = "";
                                            if(n.play_url){
                                                if(n.play_url.match(/^\S*index.shtml$/g)){
                                                    linkurl = 'http://search.cctv.com/playVideo.php?detailsid='+ n.vid;
                                                }else{
                                                    linkurl = n.play_url;
                                                }
                                            }else{
                                                linkurl = 'http://search.cctv.com/playVideo.php?detailsid='+ n.vid;
                                            }
                                            var imgsrc = n.preview_image_url;
                                            var text = n.title;
                                            r_vedio.append(_tpls.setResult_vedio(linkurl,imgsrc,text));
                                        });
                                    }else{
                                        r_vedio.html('<p class="noData">没有数据......</p>');
                                    }
                                    
                                    if(rdata.result.candidates.items && rdata.result.candidates.items.length){
                                        $.each(rdata.result.candidates.items, function(i, n){
                                            var linkurl = n.play_url;
                                            var imgsrc = n.preview_image_url;
                                            var text = n.title;
                                            r_collection.append(_tpls.setResult_vedio(linkurl,imgsrc,text));
                                        });
                                    }else{
                                        r_collection.html('<p class="noData">没有数据......</p>');
                                    }
                                    
                                    //显示隐藏
                                    r_vedio.hide().fadeIn(500);
                                    //return false;
                                }else{
                                    $(".preview_result .preview_button h4").hide();
                                    r_vedio.hide();
                                    private_alert(rdata.error);
                                    //return false;
                                };
                                $(".preview_result .preview_button h4").click(function(){
                                    if(!$(this).hasClass("active")){
                                        if($(this).hasClass("result")){
                                            r_vedio.fadeIn(500);
                                            r_collection.hide();
                                        }
                                        if($(this).hasClass("collection")){
                                            r_vedio.hide();
                                            r_collection.fadeIn(500);
                                        }
                                        $('.preview_result .preview_button h4').removeClass("active");
                                        $(this).addClass("active");
                                    }
                                });
                                return false;
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown){
                                $(".theGridMarkLayout").hide();
                                r_vedio.hide();
                                $(".preview_result .preview_button h4").hide();
                                // 服务器连接解析错误
                                private_alert("服务器连接解析错误");
                                return false;
                            }
                        });   
                    }
                }
                
                if(selobj.val() == "微博用户"){
                    if(err != ""){
                        error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                    }else{
                        error_box.slideUp();
                        $(".theGridMarkLayout").show();
                        $(".preview_result .collection").hide();
                        $(".preview_result .resultContent .result_collection").hide();
                        $(".preview_result .result").hide();
                        $(".preview_result .result").addClass("active");
                        $(".preview_result .collection").removeClass("active");
                        //重新调整高度
                        $("#imOutterArea").css("height","100%");
                        
                        //隐藏
                        r_vedio.hide();
                        r_collection.hide();
                        r_content.hide();
                        r_friend.hide();
                        //清空
                        r_vedio.empty();
                        r_collection.empty();
                        r_user.empty();
                        r_content.empty();
                        r_friend.empty();
                        
                        var type = 2;   
                        var url = '/algorithm/recommpreview';
                        
                        $.ajax({
                            url:url,
                            data: 'type='+type+'&id='+userid,
                            type: 'GET',
                            dataType: 'json',
                            success: function(rdata){
                                $(".preview_result .result").show();
                                $(".theGridMarkLayout").hide();
                                if (rdata.success){
                                    if(rdata.result.items && rdata.result.items.length){
                                        $.each(rdata.result.items, function(i, n){
                                            var linkurl = n.user_url;
                                            //var linkurl = n.play_url;
                                            var imgsrc = n.face;
                                            //var imgsrc = n.preview_image_url;
                                            var name = n.nickname;
                                            if(i%8 == 0){
                                               if(n.usertype){
                                                    r_user.append('<div class="lan clearfix">'+_tpls.setResult_user(linkurl,imgsrc,name,"spv")+'</div>');
                                                }else{
                                                    r_user.append('<div class="lan clearfix">'+_tpls.setResult_user(linkurl,imgsrc,name,"")+'</div>');
                                                }
                                            }else{
                                                if(n.usertype){
                                                    r_user.find("div.lan").eq(Math.floor(i/8)).append(_tpls.setResult_user(linkurl,imgsrc,name,"spv"));
                                                }else{
                                                    r_user.find("div.lan").eq(Math.floor(i/8)).append(_tpls.setResult_user(linkurl,imgsrc,name,""));
                                                }
                                            }
                                        });
                                    }else{
                                        r_user.html('<p class="noData">没有数据......</p>');
                                    }
                                    //显示
                                    r_user.hide().fadeIn(500);
                                    return false;
                                }else{
                                    $(".preview_result .preview_button h4").hide();
                                    r_user.hide();
                                    private_alert(rdata.error);
                                    return false;
                                }
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown){
                                $(".theGridMarkLayout").hide();
                                r_user.hide();
                                $(".preview_result .preview_button h4").hide();
                                // 服务器连接解析错误
                                private_alert("服务器连接解析错误");
                                return false;
                            }
                        });
                    }
                }
                                    
                if(selobj.val() == "微博内容"){
                    if(err != ""){
                        error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                    }else{
                        error_box.slideUp();
                        $(".theGridMarkLayout").show();
                        $(".preview_result .collection").hide();
                        $(".preview_result .resultContent .result_collection").hide();
                        $(".preview_result .result").hide();
                        $(".preview_result .result").addClass("active");
                        $(".preview_result .collection").removeClass("active");
                        //重新调整高度
                        $("#imOutterArea").css("height","100%");
                        
                        //隐藏
                        r_vedio.hide();
                        r_collection.hide();
                        r_user.hide();
                        r_friend.hide();
                        //清空
                        r_vedio.empty();
                        r_collection.empty();
                        r_user.empty();
                        r_content.empty();
                        r_friend.empty();
                        
                        var type = 3;   
                        var url = '/algorithm/recommpreview';
                        
                        $.ajax({
                            url:url,
                            data: 'type='+type+'&id='+userid,
                            type: 'GET',
                            dataType: 'json',
                            success: function(rdata){
                                $(".preview_result .result").show();
                                $(".theGridMarkLayout").hide();
                                if (rdata.success){
                                    if(rdata.result.items && rdata.result.items.length){
                                        $.each(rdata.result.items, function(i, n){
                                            var linkurl = n.user_url;
                                            //var linkurl = n.play_url;
                                            var conUrl = "http://t.cntv.cn/show/"+n.wb_id;
                                            var imgsrc = n.face;
                                            //var imgsrc = n.preview_image_url;
                                            var name = n.user_nick;
                                            var text = n.content;
                                            var last = '';
                                            if(i==rdata.result.items.length-1){
                                                last = 'last';
                                            }
                                            if(n.category){
                                                r_content.append(_tpls.setResult_content(linkurl,conUrl,imgsrc,name,text,"spv",last));
                                            }else{
                                                r_content.append(_tpls.setResult_content(linkurl,conUrl,imgsrc,name,text,"",last));
                                            }
                                        });
                                    }else{
                                        r_content.html('<p class="noData">没有数据......</p>');
                                    }
                                    //显示
                                    r_content.hide().fadeIn(500);
                                    return false;
                                }else{
                                    $(".preview_result .preview_button h4").hide();
                                    r_content.hide();
                                    private_alert(rdata.error);
                                    return false;
                                }
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown){
                                $(".theGridMarkLayout").hide();
                                r_content.hide();
                                $(".preview_result .preview_button h4").hide();
                                // 服务器连接解析错误
                                private_alert("服务器连接解析错误");
                                return false;
                            }
                        });
                    }
                }
                
                if(selobj.val() == "用户中心好友推荐"){
                    if(err != ""){
                        error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                    }else{
                        error_box.slideUp();
                        $(".theGridMarkLayout").show();
                        $(".preview_result .collection").hide();
                        $(".preview_result .resultContent .result_collection").hide();
                        $(".preview_result .result").hide();
                        $(".preview_result .result").addClass("active");
                        $(".preview_result .collection").removeClass("active");
                        //重新调整高度
                        $("#imOutterArea").css("height","100%");
                        
                        //隐藏
                        r_vedio.hide();
                        r_collection.hide();
                        r_user.hide();
                        r_content.hide();
                        //清空
                        r_vedio.empty();
                        r_collection.empty();
                        r_user.empty();
                        r_content.empty();
                        r_friend.empty();
                        
                        var type = 4;   
                        var url = '/algorithm/recommpreview';
                        
                        $.ajax({
                            url:url,
                            data: 'type='+type+'&id='+userid,
                            type: 'GET',
                            dataType: 'json',
                            success: function(rdata){
                                $(".preview_result .result").show();
                                $(".theGridMarkLayout").hide();
                                if (rdata.success){
                                    if(rdata.result.items && rdata.result.items.length){
                                        $.each(rdata.result.items, function(i, n){
                                            var linkurl = "#";//n.user_url;
                                            //var linkurl = n.play_url;
                                            var imgsrc = "/resources/styles/images/img_user.jpg";//n.face;
                                            //var imgsrc = n.preview_image_url;
                                            var name = n.nickname;
                                            
                                            if(i%8 == 0){
                                               if(n.usertype){
                                                    r_friend.append('<div class="lan clearfix">'+_tpls.setResult_friends(linkurl,imgsrc,name,"spv")+'</div>');
                                                }else{
                                                    r_friend.append('<div class="lan clearfix">'+_tpls.setResult_friends(linkurl,imgsrc,name,"")+'</div>');
                                                }
                                            }else{
                                                if(n.usertype){
                                                    r_friend.find("div.lan").eq(Math.floor(i/8)).append(_tpls.setResult_friends(linkurl,imgsrc,name,"spv"));
                                                }else{
                                                    r_friend.find("div.lan").eq(Math.floor(i/8)).append(_tpls.setResult_friends(linkurl,imgsrc,name,""));
                                                }
                                            }
                                        });
                                    }else{
                                        r_friend.html('<p class="noData">没有数据......</p>');
                                    }
                                    //显示
                                    r_friend.hide().fadeIn(500);
                                    return false;
                                }else{
                                    $(".preview_result .preview_button h4").hide();
                                    r_friend.hide();
                                    private_alert(rdata.error);
                                    return false;
                                }
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown){
                                $(".theGridMarkLayout").hide();
                                r_friend.hide();
                                $(".preview_result .preview_button h4").hide();
                                // 服务器连接解析错误
                                private_alert("服务器连接解析错误");
                                return false;
                            }
                        });
                    }
                }
            });
            /*$(".preview_result .preview_button h4").click(function(){
                if(!$(this).hasClass("active")){
                    $('.preview_result .preview_button h4').removeClass("active");
                    $(this).addClass("active");
                }
            });*/
        },
        
        /**
         * 推荐反馈
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        feedback:function(R, param){
            setHtml(
                R
                ,_tpls.algorithm_feedback()
                , "feedback"
                , LANG("推荐反馈")
            );
            
            //日期选择器
            Clicki.layout.add({
                "layout":{
                    "feedbackDatepicker":{
                        "type":"datepicker_fb1",
                        "config":{
                            "id":"feedback_date",
                            callback:function(){
                                $(".theGridMarkLayout").show();
                                $("#imOutterArea").css("height","100%");
                                //初始申请
                                var secne = $("#feedback_secne option:selected").val();
                                var time = $("#dateInput").val().split("--");
                                var begin_time = time[0];
                                var end_time = time[1];
                                var url = '/algorithm/feedback';
                                
                                $.ajax({
                                    url:url,
                                    data: 'begin_date='+begin_time+'&end_date='+end_time,
                                    type: 'GET',
                                    dataType: 'json',
                                    success: function(rdata){
                                        if (rdata.success){
                                            $(".theGridMarkLayout").hide();
                                            private_buildChartFeedback("feedback_chart",{xAxis:rdata.result.xAxis,series:rdata.result.series});
                                            private_buildFeedbackTable($("#algorithm_feedbackArea"),rdata.result.items)
                                            return false;
                                        }else{
                                            $(".theGridMarkLayout").hide();
                                            private_alert(LANG("服务器正忙，操作失败，请稍后再试"));
                                            return false;
                                        }
                                    },
                                    error: function(XMLHttpRequest, textStatus, errorThrown){
                                        $(".theGridMarkLayout").hide();
                                        // 服务器连接解析错误
                                        private_alert("服务器连接解析错误");
                                        return false;
                                    }
                                });
                            }
                        }
                    }
                }
            });
            
            //点击申请
            $('#feedback_check').click(function(){
                $(".Ex_popCal").hide();
                $("#imOutterArea").css("height","100%");
                var err = '';
                var error_box = $('.error_message');
                var secne = $("#feedback_secne option:selected").val();
                var date = $("#dateInput").val();
                var _date = null;
                var _start_date = null;
                var _end_date = null;
                
                
                if(!date.match(/^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}\-\-[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/g)){
                    err += '<li>'+LANG("请输入正确的时间范围")+'</li>';
                }else{
                    _date = date.split("--");
                    _start_date = _date[0];
                    //_start_date = 0;
                    _end_date = _date[1];
                    if(isdate(_start_date) && isdate(_end_date)){
                        if(compareDate(_start_date,window.myToday) && compareDate(_end_date,window.myToday)){
                            if(!compareDate(_start_date,_end_date,180)){
                                err += '<li>'+LANG("请输入180天内正确的时间范围")+'</li>';
                            }
                        }else{
                            err += '<li>'+LANG("请输入正确的时间范围")+'</li>';
                        }
                    }else{
                        err += '<li>'+LANG("请输入正确的时间范围")+'</li>';
                    }
                }
                
                if (err != ''){
                    error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                }else{
                    error_box.slideUp();
                    $(".theGridMarkLayout").show();
                    //var url = '/algorithm/feedback?secne='+encodeURIComponent(secne)+'&begin_date='+begin_time+'&end_date='+end_time;
                    var url = '/algorithm/feedback';
                    
                    $.ajax({
                        url:url,
                        data: 'begin_date='+_start_date+'&end_date='+_end_date,
                        type: 'GET',
                        dataType: 'json',
                        success: function(rdata){
                            if (rdata.success){
                                $(".theGridMarkLayout").hide();
                                private_buildChartFeedback("feedback_chart",{xAxis:rdata.result.xAxis,series:rdata.result.series});
                                private_buildFeedbackTable($("#algorithm_feedbackArea"),rdata.result.items)
                                return false;
                            }else{
                                $(".theGridMarkLayout").hide();
                                private_alert(LANG("服务器正忙，操作失败，请稍后再试"));
                                return false;
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown){
                            $(".theGridMarkLayout").hide();
                            // 服务器连接解析错误
                            private_alert("服务器连接解析错误");
                            return false;
                        }
                    });
                }    
            })
        },

        /**
         * 新增过滤/植入
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        addNewJGKZf:function(R, param){
            var html = '<div class="theGridMarkLayout" style="display:none;"><div></div></div>\
                                <h2>新增过滤/植入</h2>\
                                <div class="addResultCtrl">\
                                    <div class="error_message"></div>\
                                    <h2 class="nameTitle">视频植入</h2>\
                                    <div class="toplan">\
                                        <div class="zlan clearfix">\
                                            <div class="leftlan"><label>名称</label></div>\
                                            <div class="rightlan"><input class="typeText" id="inputNmae" type="text" maxlength="100"/></div>\
                                        </div>\
                                        <div class="zlan clearfix">\
                                            <div class="leftlan"><label>推荐物品</label></div>\
                                            <div class="rightlan">\
                                                <select>\
                                                    <option value="视频推荐">视频推荐</option>\
                                                    <option value="微博内容推荐">微博内容推荐</option>\
                                                    <option value="微博用户推荐">微博用户推荐</option>\
                                                </select>\
                                            </div>\
                                        </div>\
                                        <div class="zlan clearfix">\
                                            <div class="leftlan"><label>类型</label></div>\
                                            <div class="rightlan">\
                                                <span><input id="rImplant" name="typeGroup" type="radio" value="2" checked="checked" /><label>植入</label></span>\
                                                <span><input id="rFilter" name="typeGroup" type="radio" value="1" /><label>过滤</label></span>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="contentlan_implant">\
                                        <div class="zlan clearfix">\
                                            <div class="leftlan"><label>植入(视频、微博…)ID</label></div>\
                                            <div class="rightlan clearfix">\
                                                <textarea id="textarea_implant" class="result_textarea"></textarea>\
                                                <span class="tip1 hong">植入视频ID(GUID)，并用英文逗号分隔</span>\
                                            </div>\
                                        </div>\
                                        <div class="zlan clearfix">\
                                            <div class="leftlan"><label>植入个数</label></div>\
                                            <div class="rightlan clearfix">\
                                                <input id="inputNum" class="typeText" type="text" maxlength="3"/>\
                                                <span class="tip2 hong">不填写默认为全部</span>\
                                            </div>\
                                        </div>\
                                        <div class="zlan clearfix">\
                                            <div class="leftlan"><label>植入次序</label></div>\
                                            <div class="rightlan">\
                                                <span><input name="orderGroup" type="radio" value="1" checked="checked" /><label>随机</label></span>\
                                                <span><input name="orderGroup" type="radio" value="0" /><label>正序</label></span>\
                                            </div>\
                                        </div>\
                                        <div class="zlan clearfix">\
                                            <div class="leftlan"><label>与推荐结果混合方式</label></div>\
                                            <div class="rightlan">\
                                                <span><input name="mixGroup" type="radio" value="1" checked="checked" /><label>随机</label></span>\
                                                <span><input name="mixGroup" type="radio" value="0" /><label>置顶</label></span>\
                                            </div>\
                                        </div>\
                                        <div class="zlan clearfix">\
                                            <div class="leftlan"><label>描述</label></div>\
                                            <div class="rightlan">\
                                                <textarea id="textarea_implant_desc" class="result_textarea" maxlength="1000"></textarea>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="contentlan_filter" style="display:none;">\
                                        <div class="zlan clearfix">\
                                            <div class="leftlan"><label>过滤(视频、微博…)ID</label></div>\
                                            <div class="rightlan">\
                                                <textarea id="textarea_filter" class="result_textarea"></textarea>\
                                                <span class="tip1 hong">过滤视频ID(GUID)，并用英文逗号分隔</span>\
                                            </div>\
                                        </div>\
                                        <div class="zlan clearfix">\
                                            <div class="leftlan"><label>描述</label></div>\
                                            <div class="rightlan">\
                                                <textarea id="textarea_filter_desc" class="result_textarea" maxlength="1000"></textarea>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="buttonlan">\
                                        <input id="resultConfirm" class="btn_lan02 admin-btn" type="button" value=" 确 定 ">\
                                        <input id="resultCancel" class="btn_hui02 admin-btn" type="button" value=" 取 消 ">\
                                    </div>\
                                </div>';
            
            setHtml(
                R
                ,html
                , "resulthandle"
                , LANG("新增过滤/植入")
            );
            $(".theGridMarkLayout").show().delay(400).hide(0);
            ////select变换事件
            $(".addResultCtrl .zlan .rightlan select").change( function() {
                var type = $(".addResultCtrl .zlan .rightlan input[name='typeGroup']:checked").val();
                var val = "";
                if(type == "1"){
                    val = "过滤";
                }else{
                    val = "植入";
                }
                if($(this).children("option:selected").val() == "视频推荐"){
                    $(".addResultCtrl h2.nameTitle").html("视频"+val);
                    $(".addResultCtrl .zlan .rightlan span.tip1").html(val+"视频ID(GUID)，并用英文逗号分隔");
                }
                if($(this).children("option:selected").val() == "微博内容推荐"){
                    $(".addResultCtrl h2.nameTitle").html("微博内容"+val);
                    $(".addResultCtrl .zlan .rightlan span.tip1").html(val+"微博ID，并用英文逗号分隔");
                }
                if($(this).children("option:selected").val() == "微博用户推荐"){
                    $(".addResultCtrl h2.nameTitle").html("微博用户"+val);
                    $(".addResultCtrl .zlan .rightlan span.tip1").html(val+"微博用户ID，并用英文逗号分隔");
                }
            });
            ////"结果植入"点击事件
            $('#rImplant').click(function(){
                var type = $(".addResultCtrl .zlan .rightlan input[name='typeGroup']:checked").val();
                var val = "";
                if(type == "1"){
                    val = "过滤";
                }else{
                    val = "植入";
                }
                var reitem = $(".addResultCtrl .zlan .rightlan select option:selected").val();
                if(reitem == "视频推荐"){
                    $(".addResultCtrl h2.nameTitle").html("视频"+val);
                    $(".addResultCtrl .zlan .rightlan span.tip1").html(val+"视频ID(GUID)，并用英文逗号分隔");
                }
                if(reitem == "微博内容推荐"){
                    $(".addResultCtrl h2.nameTitle").html("微博内容"+val);
                    $(".addResultCtrl .zlan .rightlan span.tip1").html(val+"微博ID，并用英文逗号分隔");
                }
                if(reitem == "微博用户推荐"){
                    $(".addResultCtrl h2.nameTitle").html("微博用户"+val);
                    $(".addResultCtrl .zlan .rightlan span.tip1").html(val+"微博用户ID，并用英文逗号分隔");
                }
                $(".contentlan_implant").show();
                $(".contentlan_filter").hide();
                $('.addResultCtrl .error_message').stop(true).slideUp();
            });
            ////"结果过滤"点击事件
            $('#rFilter').click(function(){
                var type = $(".addResultCtrl .zlan .rightlan input[name='typeGroup']:checked").val();
                var val = "";
                if(type == "1"){
                    val = "过滤";
                }else{
                    val = "植入";
                }
                
                var reitem = $(".addResultCtrl .zlan .rightlan select option:selected").val();
                if(reitem == "视频推荐"){
                    $(".addResultCtrl h2.nameTitle").html("视频"+val);
                    $(".addResultCtrl .zlan .rightlan span.tip1").html(val+"视频ID(GUID)，并用英文逗号分隔");
                }
                if(reitem == "微博内容推荐"){
                    $(".addResultCtrl h2.nameTitle").html("微博内容"+val);
                    $(".addResultCtrl .zlan .rightlan span.tip1").html(val+"微博ID，并用英文逗号分隔");
                }
                if(reitem == "微博用户推荐"){
                    $(".addResultCtrl h2.nameTitle").html("微博用户"+val);
                    $(".addResultCtrl .zlan .rightlan span.tip1").html(val+"微博用户ID，并用英文逗号分隔");
                }
                $(".contentlan_filter").show();
                $(".contentlan_implant").hide();
                $('.addResultCtrl .error_message').stop(true).slideUp();
            });
            ////"确定"点击事件
            $('#resultConfirm').click(function(){
                var sendData = null;
                var err = '';
                var error_box = $('.addResultCtrl .error_message');
                //wj.clicki.server/algorithm/addhandle?name=&type=&content=&filter_obj=&random=&mix_random=&num=
                var checkVal = $(".addResultCtrl .zlan .rightlan input[name='typeGroup']:checked").val();
                var recomm_obj = $(".addResultCtrl .zlan .rightlan select option:selected").val();
                if(checkVal === "2"){
                    var name = $("#inputNmae").val();
                    // [\u4E00-\uFA29]|[\uE7C7-\uE7F3]汉字编码范围 
                    if(!name.match(/[\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9\_]/g)){
                        err += '<li>'+LANG("请输入合法的名称，可以包括汉字、字母、数字和下划线")+'</li>';
                    }
                    var type = checkVal;
                    var content = $("#textarea_implant").val();
                    if(!(content.match(/^([a-zA-Z0-9]*,)*[a-zA-Z0-9]+$/g))){
                        err += '<li>'+LANG('请输入非空英文、数字的植入ID库，每组字符之间请用英文逗号隔开')+'</li>';
                    }
                    var num = $("#inputNum").val();
                    if(!(num.match(/^[1-9]{1}[0-9]*$/g))){
                        if(num.match(/^\s*$/g)){
                            num = "";
                        }else{
                            err += '<li>'+LANG('请输入合法的植入个数，可以包括空字符、数字')+'</li>';
                        }
                    }
                    var random = $(".addResultCtrl .zlan .rightlan input[name='orderGroup']:checked").val();
                    var mix_random = $(".addResultCtrl .zlan .rightlan input[name='mixGroup']:checked").val();
                    var desc = $("#textarea_implant_desc").val();
                    if (err != ''){
                        error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                        /*if(!error_box.is(":animated") ){ //判断元素是否处于动画状态
                         //如果当前没有进行动画，则添加
                         console.log("没有动画")
                        }else{
                            console.log("动画")
                        }*/
                        /*error_box.stop(true);
                        function _slideFun() {
                              error_box.html('<ul>' + err + '<ul>').slideDown();
                              error_box.delay(10000).slideUp(function(){
                               canDo = true;
                             });      
                        }
                        error_box.queue('slideList',_slideFun);
                        _slideFun();*/
                    }else {
                        error_box.slideUp();
                        sendData = {
                            name:name,
                            recomm_obj:recomm_obj,
                            type:type,
                            content:content,
                            random:random,
                            mix_random:mix_random,
                            num:num,
                            desc:desc
                        }
                        //sendData = JSON.stringify(sendData);
                        //console.log(sendData)
                        private_save('/algorithm/addhandle',sendData,"#/algorithm/resulthandle",-1);
                    }
                }
                if(checkVal === "1"){
                    var name = $("#inputNmae").val();
                    // [\u4E00-\uFA29]|[\uE7C7-\uE7F3]汉字编码范围 
                    if(!name.match(/[\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9\_]/g)){
                        err += '<li>'+LANG("请输入合法的名称，可以包括汉字、字母、数字和下划线")+'</li>';
                    }
                    var type = checkVal;
                    var content = $("#textarea_filter").val();
                    var desc = $("#textarea_filter_desc").val();
                    if(!(content.match(/^([a-zA-Z0-9]*,)*[a-zA-Z0-9]+$/g))){
                        err += '<li>'+LANG('请输入非空英文、数字的过滤ID，每组字符之间请用英文逗号隔开')+'</li>';
                    }
                    if (err != ''){
                        error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                    }else{
                        error_box.slideUp();
                        sendData = {
                            name:name,
                            recomm_obj:recomm_obj,
                            type:type,
                            content:content,
                            desc:desc
                        }
                        //sendData = JSON.stringify(sendData);
                        //console.log(sendData)
                        private_save('/algorithm/addhandle',sendData,"#/algorithm/resulthandle",-1);
                    }
                }
            });
            ////"取消"点击事件
            $('#resultCancel').click(function(){
                Clicki.NavView.setDefaultActive(-1, "#/algorithm/resulthandle");
            });
            
            ////限制ie下textarea的最大长度
            $(".result_textarea").textarealimit(1000);
        },
        
        /**
         * 算法训练
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        training:function(R, param){    
            
            var html = '<div class="theGridMarkLayout" style="display:none;"><div></div></div>\
                                <h2>算法训练</h2>\
                                <div class="trainContent">\
                                    <div class="error_message"></div>\
                                    <div class="selectCard clearfix">\
                                        <div class="ICF active">ICF(视频算法)</div>\
                                        <div class="UCF">UCF(视频算法)</div>\
                                        <div class="DWR">DWR(微博算法)</div>\
                                    </div>\
                                    <div class="condition">\
                                        <div class="input_condition">\
                                            <div class="ICF_input">\
                                                <h4>训练数据量控制：</h4>\
                                                <div class="inputGroup">\
                                                    <ul class="clearfix">\
                                                        <li><label>视频数量</label><input id="ICF_inputG_userN" class="input_text" type="text" value="" maxlength="4" /><label>（100~5000）</label></li>\
                                                        <li><label>时间范围</label><div id="ICF_datepicker"></div></li>\
                                                        <li class="last"><label>最小单位用户行为数据长度</label><input id="ICF_inputG_dataLen" class="input_text" type="text" value="" maxlength="2" /><label>（1~20）</label></li>\
                                                    </ul>\
                                                </div>\
                                            </div>\
                                            <div class="UCF_input">\
                                                <h4>训练数据量控制：</h4>\
                                                <div class="inputGroup">\
                                                    <ul class="clearfix">\
                                                        <li><label>用户数量</label><input id="UCF_inputG_userN" class="input_text" type="text" value="" maxlength="4" /><label>（100~5000）</label></li>\
                                                        <li><label>时间范围</label><div id="UCF_datepicker"></div></li>\
                                                        <li class="last"><label>最小单位用户行为数据长度</label><input id="UCF_inputG_dataLen" class="input_text" type="text" value="" maxlength="2" /><label>（1~20）</label></li>\
                                                    </ul>\
                                                </div>\
                                            </div>\
                                            <div class="DWR_input">\
                                                <h4>训练数据量控制：</h4>\
                                                <div class="inputGroup">\
                                                    <ul class="clearfix">\
                                                        <li class="last"><label>时间范围</label><div id="DWR_datepicker"></div></li>\
                                                    </ul>\
                                                </div>\
                                            </div>\
                                        </div>\
                                        <div class="radio_condition">\
                                            <div class="ICF_radio">\
                                                <div class="lan">\
                                                    <h4>算法参数：</h4>\
                                                    <ul class="param clearfix">\
                                                        <li class="clearfix"><input id="ICF_k" class="input_radio" type="radio" name="ICF_para" value="K" /><label><h4>K</h4><span>(K邻居范围)</span></label><img src="../resources/styles/images/icon/icon_dec.png" data-des="K邻居范围：表示算法搜寻相似用户或物品的范围，K值越大算法搜寻范围越广，推荐结果精度越高，计算花费时间越长。" /></li>\
                                                        <li class="clearfix"><input id="ICF_hot" class="input_radio" type="radio" name="ICF_para" value="Hot" /><label><h4>Hot</h4><span>(热门惩罚权重)</span></label><img src="../resources/styles/images/icon/icon_dec.png" data-des="热门惩罚权重：表示针对热门物品或活跃用户对推荐结果影响的惩罚权重，权重越大，热门物品/活跃用户对推荐结果的影响越小，即算法会更加倾向于推荐冷门物品。" /></li>\
                                                        <li class="clearfix"><input id="ICF_time" class="input_radio" type="radio" name="ICF_para" value="Time" /><label><h4>Time</h4><span>(时间影响权重)</span></label><img src="../resources/styles/images/icon/icon_dec.png" data-des="时间影响权重：表示时间对推荐结果的影响，权重越大，系统中老物品对推荐结果的影响越小，即算法会更加倾向于推荐更新的物品。" /></li>\
                                                        <li class="clearfix"><input id="ICF_like" class="input_radio" type="radio" name="ICF_para" value="Like" /><label><h4>Like</h4><span>(显性反馈权重)</span></label><img src="../resources/styles/images/icon/icon_dec.png" data-des="显性反馈权重：表示用户对物品的显性反馈行为所产生的对推荐结果的影响权重。" /></li>\
                                                    </ul>\
                                                </div>\
                                                <div class="chek"><input type="button" value=" 查 看 " class="btn_lan02 admin-btn" data-str="ICF" id="ICF_check"></div>\
                                            </div>\
                                            <div class="UCF_radio">\
                                                <div class="lan">\
                                                    <h4>算法参数：</h4>\
                                                    <ul class="param clearfix">\
                                                        <li class="clearfix"><input id="UCF_k" class="input_radio" type="radio" name="UCF_para" value="K" /><label><h4>K</h4><span>(K邻居范围)</span></label><img src="../resources/styles/images/icon/icon_dec.png" data-des="K邻居范围：表示算法搜寻相似用户或物品的范围，K值越大算法搜寻范围越广，推荐结果精度越高，计算花费时间越长。" /></li>\
                                                        <li class="clearfix"><input id="UCF_hot" class="input_radio" type="radio" name="UCF_para" value="Hot" /><label><h4>Hot</h4><span>(热门惩罚权重)</span></label><img src="../resources/styles/images/icon/icon_dec.png" data-des="热门惩罚权重：表示针对热门物品或活跃用户对推荐结果影响的惩罚权重，权重越大，热门物品/活跃用户对推荐结果的影响越小，即算法会更加倾向于推荐冷门物品。" /></li>\
                                                        <li class="clearfix"><input id="UCF_time" class="input_radio" type="radio" name="UCF_para" value="Time" /><label><h4>Time</h4><span>(时间影响权重)</span></label><img src="../resources/styles/images/icon/icon_dec.png" data-des="时间影响权重：表示时间对推荐结果的影响，权重越大，系统中老物品对推荐结果的影响越小，即算法会更加倾向于推荐更新的物品。" /></li>\
                                                        <li class="clearfix"><input id="UCF_like" class="input_radio" type="radio" name="UCF_para" value="Like" /><label><h4>Like</h4><span>(显性反馈权重)</span></label><img src="../resources/styles/images/icon/icon_dec.png" data-des="显性反馈权重：表示用户对物品的显性反馈行为所产生的对推荐结果的影响权重。" /></li>\
                                                    </ul>\
                                                </div>\
                                                <div class="chek"><input type="button" value=" 查 看 " class="btn_lan02 admin-btn" data-str="UCF" id="UCF_check"></div>\
                                            </div>\
                                            <div class="DWR_radio">\
                                                <div class="lan">\
                                                    <h4>算法参数：</h4>\
                                                    <ul class="param clearfix">\
                                                        <li class="clearfix"><input id="DWR_time" class="input_radio" type="radio" name="DWR_para" value="Time" /><label><h4>Time</h4><span>(时间影响权重)</span></label><img src="../resources/styles/images/icon/icon_dec.png" data-des="时间影响权重：表示时间对推荐结果的影响，权重越大，系统中老物品对推荐结果的影响越小，即算法会更加倾向于推荐更新的物品。" /></li>\
                                                        <li class="clearfix"><input id="DWR_Forward" class="input_radio" type="radio" name="DWR_para" value="Forward" /><label><h4>Forward</h4><span>(转发权重)</span></label><img src="../resources/styles/images/icon/icon_dec.png" data-des="转发权重：表示每次被转发对微博热度的影响， 在转发量一定的情况下，转发权重越大，该微博被推荐的可能性越大。" /></li>\
                                                        <li class="clearfix"><input id="DWR_Comment" class="input_radio" type="radio" name="DWR_para" value="Comment" /><label><h4>Comment</h4><span>(评论权重)</span></label><img src="../resources/styles/images/icon/icon_dec.png" data-des="评论权重：表示每次被评论对微博热度的影响，在评论量一定的情况下，评论权重越大，该微博被推荐的可能性越大。" /></li>\
                                                    </ul>\
                                                </div>\
                                                <div class="chek"><input type="button" value=" 查 看 " class="btn_lan02 admin-btn" data-str="DWR" id="DWR_check"></div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div id="ICF_trainIndicator" class="trainIndicator">\
                                        <div class="indiContent">\
                                            <div class="lan clearfix">\
                                                <ul class="param clearfix">\
                                                    <li class="trainName clearfix"><h4>实际训练视频数量:</h4><span class="userNum"></span></li>\
                                                    <li class="clearfix"><h4>实际训练行为数据量:</h4><span class="dataNum"></span></li>\
                                                </ul>\
                                            </div>\
                                            <div class="lan">\
                                                <ul class="param clearfix">\
                                                    <li class="clearfix"><input id="ICF_all" class="input_radio" type="radio" checked="checked" name="ICF_indi" value="训练效果总览" /><label><h4>训练效果总览</h4></label></li>\
                                                    <li class="clearfix"><input id="ICF_acc" class="input_radio" type="radio" name="ICF_indi" value="准确率" /><label><h4>准确率</h4></label><img src="../resources/styles/images/icon/icon_dec.png" data-gs="准确率,推荐正确的视频数,推荐的视频数" data-des="准确率是推荐正确的视频数量和推荐所有视频数量的比值。准确率越高，说明算法推荐的准确度越高。" /></li>\
                                                    <li class="clearfix"><input id="ICF_recal" class="input_radio" type="radio" name="ICF_indi" value="召回率" /><label><h4>召回率</h4></label><img src="../resources/styles/images/icon/icon_dec.png" data-gs="召回率,推荐正确的视频数,用户点击过的视频数" data-des="召回率是推荐正确的视频数量和用户点击过的视频数量的比值，即是从推荐结果中，召回目标类别的比例。召回率越高，说明推荐算法的命中率越高。" /></li>\
                                                    <li class="clearfix"><input id="ICF_cover" class="input_radio" type="radio" name="ICF_indi" value="覆盖率" /><label><h4>覆盖率</h4></label><img src="../resources/styles/images/icon/icon_dec.png" data-gs="覆盖率,推荐的视频数,系统中所有的视频数" data-des="覆盖率是算法推荐出来的总视频数量与系统中的总视频数量的比值，衡量的是一个推荐算法对物品长尾的发掘能力。覆盖率越高，算法推荐结果的范围越广。" /></li>\
                                                </ul>\
                                            </div>\
                                            <div class="train_chart">\
                                                <div class="ICF_chart clearfix">\
                                                    <div id="ICF_chartPic"></div>\
                                                    <div class="x-axis"><p></p></div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div id="UCF_trainIndicator" class="trainIndicator">\
                                        <div class="indiContent">\
                                            <div class="lan clearfix">\
                                                <ul class="param clearfix">\
                                                    <li class="trainName clearfix"><h4>实际训练用户数量:</h4><span class="userNum"></span></li>\
                                                    <li class="clearfix"><h4>实际训练行为数据量:</h4><span class="dataNum"></span></li>\
                                                </ul>\
                                            </div>\
                                            <div class="lan">\
                                                <ul class="param clearfix">\
                                                    <li class="clearfix"><input id="UCF_all" class="input_radio" type="radio" checked="checked" name="UCF_indi" value="训练效果总览" /><label><h4>训练效果总览</h4></label></li>\
                                                    <li class="clearfix"><input id="UCF_acc" class="input_radio" type="radio" name="UCF_indi" value="准确率" /><label><h4>准确率</h4></label><img src="../resources/styles/images/icon/icon_dec.png" data-gs="准确率,推荐正确的视频数,推荐的视频数" data-des="准确率是推荐正确的视频数量和推荐所有视频数量的比值。准确率越高，说明算法推荐的准确度越高。" /></li>\
                                                    <li class="clearfix"><input id="UCF_recal" class="input_radio" type="radio" name="UCF_indi" value="召回率" /><label><h4>召回率</h4></label><img src="../resources/styles/images/icon/icon_dec.png" data-gs="召回率,推荐正确的视频数,用户点击过的视频数" data-des="召回率是推荐正确的视频数量和用户点击过的视频数量的比值，即是从推荐结果中，召回目标类别的比例。召回率越高，说明推荐算法的命中率越高。" /></li>\
                                                    <li class="clearfix"><input id="UCF_cover" class="input_radio" type="radio" name="UCF_indi" value="覆盖率" /><label><h4>覆盖率</h4></label><img src="../resources/styles/images/icon/icon_dec.png" data-gs="覆盖率,推荐的视频数,系统中所有的视频数" data-des="覆盖率是算法推荐出来的总视频数量与系统中的总视频数量的比值，衡量的是一个推荐算法对物品长尾的发掘能力。覆盖率越高，算法推荐结果的范围越广。" /></li>\
                                                </ul>\
                                            </div>\
                                            <div class="train_chart">\
                                                <div class="UCF_chart clearfix">\
                                                    <div id="UCF_chartPic"></div>\
                                                    <div class="x-axis"><p></p></div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div id="DWR_trainIndicator" class="trainIndicator">\
                                        <div class="indiContent">\
                                            <div class="lan">\
                                                <ul class="param clearfix">\
                                                    <li class="clearfix"><input id="DWR_all" class="input_radio" type="radio" checked="checked" name="DWR_indi" value="训练效果总览" /><label><h4>训练效果总览</h4></label></li>\
                                                    <li class="clearfix"><input id="DWR_acc" class="input_radio" type="radio" name="DWR_indi" value="准确率" /><label><h4>准确率</h4></label><img src="../resources/styles/images/icon/icon_dec.png" data-gs="准确率,推荐正确的微博数量,推荐的微博数量" data-des="准确率是推荐正确的微博数量和推荐所有微博数量的比值。准确率越高，说明算法推荐的准确度越高。" /></li>\
                                                    <li class="clearfix"><input id="DWR_recal" class="input_radio" type="radio" name="DWR_indi" value="召回率" /><label><h4>召回率</h4></label><img src="../resources/styles/images/icon/icon_dec.png" data-gs="召回率,推荐正确推荐的微博数量,用户点击过的微博数量" data-des="召回率是推荐正确的微博数量和用户点击过的微博数量的比值，即是从推荐结果中，召回目标类别的比例。召回率越高，说明推荐算法的命中率越高。" /></li>\
                                                </ul>\
                                            </div>\
                                            <div class="train_chart">\
                                                <div class="DWR_chart clearfix">\
                                                    <div id="DWR_chartPic"></div>\
                                                    <div class="x-axis"><p></p></div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>';
                                
            setHtml(
                R
                ,html
                , "training"
                , LANG("算法训练")
            );
            $(".theGridMarkLayout").show().delay(400).hide(0);
            //日期选择器
            Clicki.layout.destroy().add({
                "layout":{
                    "theDatepicker1":{
                        "type":"datepicker_fb1",
                        "config":{
                            "id":"ICF_datepicker"
                        }
                    },
                    "theDatepicker2":{
                        "type":"datepicker_fb1",
                        "config":{
                            "id":"UCF_datepicker"
                        }
                    },
                    "theDatepicker3":{
                        "type":"datepicker_fb1",
                        "config":{
                            "id":"DWR_datepicker"
                        }
                    }
                }
            });
            var clickengin = 'ICF';
            var trainName = '视频数量';
            ////"ICF UCF"点击事件
            $('.trainContent .selectCard div').click(function(){
                if($(this).hasClass("ICF")){
                    if(!$(this).hasClass("active")){
                        //$(".trainContent .trainIndicator").hide();
                        $(".trainContent .condition .input_condition .UCF_input").hide();
                        $(".trainContent .condition .input_condition .DWR_input").hide();
                        $("#UCF_trainIndicator").hide();
                        $("#DWR_trainIndicator").hide();
                        $("#ICF_trainIndicator").fadeIn();
                        $(".trainContent .condition .input_condition .ICF_input").fadeIn();
                        $(".trainContent .condition .radio_condition .UCF_radio").hide();
                        $(".trainContent .condition .radio_condition .DWR_radio").hide();
                        $(".trainContent .condition .radio_condition .ICF_radio").fadeIn();
                        $(".trainContent .train_chart .UCF_chart").hide();
                        $(".trainContent .train_chart .DWR_chart").hide();
                        $(".trainContent .train_chart .ICF_chart").fadeIn();
                        //$("#cover").parent().show();
                        $('.error_message').stop(true).slideUp();
                    }
                    clickengin = 'ICF';
                    trainName = '视频数量';
                    //$(".trainContent .trainIndicator .lan ul li.trainName h4").html("实际训练"+trainName);
                }
                if($(this).hasClass("UCF")){
                    if(!$(this).hasClass("active")){
                        //$(".trainContent .trainIndicator").hide();
                        $(".trainContent .condition .input_condition .ICF_input").hide();
                        $(".trainContent .condition .input_condition .DWR_input").hide();
                        $("#ICF_trainIndicator").hide();
                        $("#DWR_trainIndicator").hide();
                        $("#UCF_trainIndicator").fadeIn();
                        $(".trainContent .condition .input_condition .UCF_input").fadeIn();
                        $(".trainContent .condition .radio_condition .ICF_radio").hide();
                        $(".trainContent .condition .radio_condition .DWR_radio").hide();
                        $(".trainContent .condition .radio_condition .UCF_radio").fadeIn();
                        $(".trainContent .train_chart .ICF_chart").hide();
                        $(".trainContent .train_chart .DWR_chart").hide();
                        $(".trainContent .train_chart .UCF_chart").fadeIn();
                        //$("#cover").parent().show();
                        $('.error_message').stop(true).slideUp();
                    }
                    clickengin = 'UCF';
                    trainName = '用户数量';
                    //$(".trainContent .trainIndicator .lan ul li.trainName h4").html("实际训练"+trainName);
                }
                if($(this).hasClass("DWR")){
                    if(!$(this).hasClass("active")){
                        //$(".trainContent .trainIndicator").hide();
                        $(".trainContent .condition .input_condition .ICF_input").hide();
                        $(".trainContent .condition .input_condition .UCF_input").hide();
                        $("#ICF_trainIndicator").hide();
                        $("#UCF_trainIndicator").hide();
                        $("#DWR_trainIndicator").fadeIn();
                        $(".trainContent .condition .input_condition .DWR_input").fadeIn();
                        $(".trainContent .condition .radio_condition .ICF_radio").hide();
                        $(".trainContent .condition .radio_condition .UCF_radio").hide();
                        $(".trainContent .condition .radio_condition .DWR_radio").fadeIn();
                        $(".trainContent .train_chart .ICF_chart").hide();
                        $(".trainContent .train_chart .UCF_chart").hide();
                        $(".trainContent .train_chart .DWR_chart").fadeIn();
                        //$("#cover").parent().hide();
                        $('.error_message').stop(true).slideUp();
                    }
                    clickengin = 'DWR';
                    trainName = '微博数量';
                    //$(".trainContent .trainIndicator .lan ul li.trainName h4").html("实际训练"+trainName);
                }
                $('.trainContent .selectCard div').removeClass("active");
                $(this).addClass("active");
            });
            
            ////"描述问号"点击事件
            $('.trainContent ul.param li img').click(function(){
                var gs = $(this).attr("data-gs");
                var _dec = $(this).attr("data-des");
                var html = '';
                var title = $(this).parent().find("label h4").html();
                if(gs!= undefined){
                    var gs_arr = gs.split(",");
                    html += '<div class="checkDes"><div class="gs clearfix"><span>'+gs_arr[0]+'</span><span>=</span><div class="gs_r"><p class="t">'+gs_arr[1]+'</p><p>'+gs_arr[2]+'</p></div></div><p class="des">'+_dec+'</p></div>';
                }else{
                    html += '<div class="checkDes"><p class="des">'+_dec+'</p></div>';
                }
                private_training_checkDes(title,html)
            });
            //查看按钮函数
            function checkBtnDown(str){
                var err = '';
                var error_box = $('.error_message');
                var para = $('.trainContent .condition .radio_condition ul li input[name="'+str+'_para"]:checked');
                var indi = $('#'+str+'_trainIndicator .lan ul li input[name="'+str+'_indi"]:checked');
                var date = $("#"+str+"_datepicker .dateBtns .dateInput").val();
                var userN = $("#"+str+"_inputG_userN");
                var dataLen = $("#"+str+"_inputG_dataLen");
                var _date = null;
                var _start_date = null;
                var _end_date = null;
                //验证
                if(userN.length){
                    if(!userN.val().match(/^[1-9]{1}[0-9]{0,5}$/g)){
                        err += '<li>'+LANG("请输入非空字符100~5000以内的整数")+trainName+'</li>';
                    }else{
                        if(parseInt(userN.val()) < 100 || parseInt(userN.val()) > 5000){
                            err += '<li>'+LANG("请输入非空字符100~5000以内的整数")+trainName+'</li>';
                        }
                    }
                }
                if(dataLen.length){
                    if(!dataLen.val().match(/^[1-9]{1}[0-9]*$/g)){
                        err += '<li>'+LANG("请输入非空字符20以内的整数单位用户行为数据长度")+'</li>';
                    }else{
                        if(parseInt(dataLen.val()) > 20){
                            err += '<li>'+LANG("请输入非空字符20以内的整数单位用户行为数据长度")+'</li>';
                        }
                    }
                }
                if(para.length<=0){
                    err += '<li>'+LANG("请选择算法参数")+'</li>';
                }
                if(!date.match(/^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}\-\-[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/g)){
                    err += '<li>'+LANG("请输入正确的时间范围")+'</li>';
                }else{
                    _date = date.split("--");
                    _start_date = _date[0];
                    //_start_date = 0;
                    _end_date = _date[1];
                    if(isdate(_start_date) && isdate(_end_date)){
                        if(compareDate(_start_date,window.myToday) && compareDate(_end_date,window.myToday)){
                            if(!compareDate(_start_date,_end_date)){
                                err += '<li>'+LANG("请输入正确的时间范围")+'</li>';
                            }
                        }else{
                            err += '<li>'+LANG("请输入正确的时间范围")+'</li>';
                        }
                    }else{
                        err += '<li>'+LANG("请输入正确的时间范围")+'</li>';
                    }
                }
                /*if(indi.length<=0){
                    err += '<li>'+LANG("请选择算法性能指标")+'</li>';
                }*/
                
                if (err != ''){
                    error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                }else{
                    error_box.slideUp();
                    $(".theGridMarkLayout").show();
                    var _engin = clickengin.toLowerCase();
                    var _param = para.val().toLowerCase();
                    var _user_num = userN.val();
                    var _min_unit_num = dataLen.val();
                    
                    //var url = '/algorithm/training?
                    var _url = '/algorithm/training';
                    
                    $.ajax({
                        url:_url,
                        data: 'engine='+_engin+'&param='+_param+'&user_num='+_user_num+'&start_date='+_start_date+'&end_date='+_end_date+'&min_unit_num='+_min_unit_num,
                        type: 'GET',
                        dataType: 'json',
                        success: function(rdata){
                            $(".theGridMarkLayout").hide();
                            if (rdata.success){
                                if(clickengin == "ICF"){
                                    cache.ICF_chartData = rdata;
                                    $("#ICF_trainIndicator .lan ul li span.userNum").html(rdata.result.userNum);
                                    $("#ICF_trainIndicator .lan ul li span.dataNum").html(rdata.result.dataNum);
                                    $("#ICF_trainIndicator").show();
                                    $("#ICF_trainIndicator .indiContent").show();
                                }
                                if(clickengin == "UCF"){
                                    cache.UCF_chartData = rdata;
                                    $("#UCF_trainIndicator .lan ul li span.userNum").html(rdata.result.userNum);
                                    $("#UCF_trainIndicator .lan ul li span.dataNum").html(rdata.result.dataNum);
                                    $("#UCF_trainIndicator").show();
                                    $("#UCF_trainIndicator .indiContent").show();
                                }
                                if(clickengin == "DWR"){
                                    cache.DWR_chartData = rdata;
                                    $("#DWR_trainIndicator .lan ul li span.userNum").html(rdata.result.userNum);
                                    $("#DWR_trainIndicator .lan ul li span.dataNum").html(rdata.result.dataNum);
                                    $("#DWR_trainIndicator").show();
                                    $("#DWR_trainIndicator .indiContent").show();
                                }
                                var tit_text = indi.val();
                                var x_axis = para.val();
                                        
                                var chartCon = {
                                    chart: {
                                        renderTo:str+"_chartPic"
                                    },
                                    colors: ['#920783','#e4007f','#eb6100'],
                                    title: {
                                        text:tit_text
                                    }
                                }
                                
                                var defData = {};
                                if(clickengin == "DWR"){
                                    defData = {
                                        xAxis:{"categories":[null,null,null,null,null]},
                                        series:[{"name":"准确率","data":[0,0,0,0,0]},{"name":"召回率","data":[0,0,0,0,0]}]
                                    }
                                }else{
                                    defData = {
                                        xAxis:{"categories":[null,null,null,null,null]},
                                        series:[{"name":"准确率","data":[0,0,0,0,0]},{"name":"召回率","data":[0,0,0,0,0]},{"name":"覆盖率","data":[0,0,0,0,0]}]
                                    }
                                }
                                
                                
                                var chartConGet = {
                                    xAxis:rdata.result.xAxis,
                                    series:rdata.result.all_series
                                }
                                //alert(rdata.result.dataNum)
                                if(rdata.result.dataNum > 0 && rdata.result.userNum > 0){
                                    $.extend(true,defData,chartConGet);
                                }
                                
                                $.extend(true,chartCon,defData,_chartDefult);
                                //console.log(chartCon)
                                private_buildChart(chartCon);
                                $(".trainContent .train_chart ."+str+"_chart .x-axis p").html(x_axis);
                                return false;
                            }else{
                                private_alert(rdata.error);
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown){
                            $(".theGridMarkLayout").hide();
                            // 服务器连接解析错误
                            private_alert("服务器连接解析错误");
                        }
                    });
                    /*$.getJSON(url, function(rdata,status,xhr){
                        if(xhr.status == 200){
                            
                        }else{
                            $(".theGridMarkLayout").hide();
                            console.log(xhr.status);
                            console.log(xhr.response);
                            console.log(xhr.responseText);
                            console.log(xhr.statusText);
                        }
                        return false;
                    });*/
                }
            }
            
            function radio_chart(enginname,str){
                //console.log(cache.ICF_chartData)
                //console.log(cache.UCF_chartData)
                //console.log(cache.DWR_chartData)
                var para = $('.trainContent .condition .radio_condition ul li input[name="'+enginname+'_para"]:checked');
                var indi = $('#'+enginname+'_trainIndicator .lan ul li input[name="'+enginname+'_indi"]:checked');
                //var indi = $('.trainContent .trainIndicator .lan ul li input[name="indi"]:checked');
                var tit_text = indi.val();
                var x_axis = para.val();
                var color = '';
                var colors = ['#920783','#e4007f','#eb6100'];
                var _series = null;
                var chartCon = null;
                var allData = null;
                if(enginname == "ICF"){
                    allData = cache.ICF_chartData;
                }
                if(enginname == "UCF"){
                    allData = cache.UCF_chartData;
                }
                if(enginname == "DWR"){
                    allData = cache.DWR_chartData;
                }
                
                switch (tit_text) {
                    case "训练效果总览":
                        if(enginname == "DWR"){
                            chartCon = {
                                chart: {
                                    renderTo:enginname+"_chartPic"
                                },
                                colors: ['#920783','#e4007f','#eb6100'],
                                title: {
                                    text:tit_text
                                },
                                series: [
                                    {
                                        "name":"准确率",
                                        "data":[0,0,0,0,0],
                                        marker: {
                                            symbol: 'diamond'
                                        }
                                    },
                                    {
                                        "name":"召回率",
                                        "data":[0,0,0,0,0],
                                        marker: {
                                            symbol: 'diamond'
                                        }
                                    }
                                ]
                            }
                        }else{
                            chartCon = {
                                chart: {
                                    renderTo:enginname+"_chartPic"
                                },
                                colors: ['#920783','#e4007f','#eb6100'],
                                title: {
                                    text:tit_text
                                },
                                series: [
                                    {
                                        "name":"准确率",
                                        "data":[0,0,0,0,0],
                                        marker: {
                                            symbol: 'diamond'
                                        }
                                    },
                                    {
                                        "name":"召回率",
                                        "data":[0,0,0,0,0],
                                        marker: {
                                            symbol: 'diamond'
                                        }
                                    },
                                    {
                                        "name":"覆盖率",
                                        "data":[0,0,0,0,0],
                                        marker: {
                                            symbol: 'diamond'
                                        }
                                    }
                                ]
                            }
                        };
                        _series = allData.result.all_series;
                        break;
                    case "准确率":
                        color = '#920783';
                        _series = allData.result.precision_series;
                        chartCon = {
                            chart: {
                                renderTo:enginname+"_chartPic"
                            },
                            title: {
                                text:tit_text
                            },
                            plotOptions: {
                                spline: {
                                    marker: {
                                        lineColor:color
                                    }
                                }
                            },
                            series: [{
                                name: str,
                                color:color,
                                "data":[0,0,0,0,0]
                            }]
                        }
                        break;
                    case "召回率":
                        color = '#e4007f';
                        _series = allData.result.recall_series;
                        chartCon = {
                            chart: {
                                renderTo:enginname+"_chartPic"
                            },
                            title: {
                                text:tit_text
                            },
                            plotOptions: {
                                spline: {
                                    marker: {
                                        lineColor:color
                                    }
                                }
                            },
                            series: [{
                                name: str,
                                color:color,
                                "data":[0,0,0,0,0]
                            }]
                        }
                        break;
                    case "覆盖率":
                        color = '#eb6100';
                        _series = allData.result.coverage_series;
                        chartCon = {
                            chart: {
                                renderTo:enginname+"_chartPic"
                            },
                            title: {
                                text:tit_text
                            },
                            plotOptions: {
                                spline: {
                                    marker: {
                                        lineColor:color
                                    }
                                }
                            },
                            series: [{
                                name: str,
                                color:color,
                                "data":[0,0,0,0,0]
                            }]
                        }
                        break;
                };
                
                var chartConGet = {
                    xAxis:allData.result.xAxis,
                    series:_series
                }
                
                if(allData.result.dataNum == 0){
                    $.extend(true,chartCon,_chartDefult);
                }else{
                    $.extend(true,chartCon,chartConGet,_chartDefult);
                }
                private_buildChart(chartCon);
                return false;
            }
            
            var icf_index = 0;
            var ucf_index = 0;
            var dwr_index = 0;
            
            ////"ICF查看"点击事件
            $('#ICF_check').click(function(){
                $("#ICF_trainIndicator .indiContent").hide();
                $('#ICF_all').prop("checked", true);
                checkBtnDown($(this).attr("data-str"));
                icf_index = 0;
            });
            
            ////"UCF查看"点击事件
            $('#UCF_check').click(function(){
                $("#UCF_trainIndicator .indiContent").hide();
                $('#UCF_all').prop("checked", true);
                checkBtnDown($(this).attr("data-str"));
                ucf_index = 0;
            });
            ////"DWR查看"点击事件
            $('#DWR_check').click(function(){
                $("#DWR_trainIndicator .indiContent").hide();
                $('#DWR_all').prop("checked", true);
                checkBtnDown($(this).attr("data-str"));
                dwr_index = 0;
            });
            
            
            ////训练结果ICF input点击事件
            $('#ICF_trainIndicator .lan ul li input[name="ICF_indi"]').click(function(){
                if($(this).parent().index() != icf_index){
                    radio_chart(clickengin,$(this).val());
                }
                icf_index = $(this).parent().index();
            });
            
            ////训练结果UCF input点击事件
            $('#UCF_trainIndicator .lan ul li input[name="UCF_indi"]').click(function(){
                if($(this).parent().index() != ucf_index){
                    radio_chart(clickengin,$(this).val());
                }
                ucf_index = $(this).parent().index();
            });
            
            ////训练结果DWR input点击事件
            $('#DWR_trainIndicator .lan ul li input[name="DWR_indi"]').click(function(){
                if($(this).parent().index() != dwr_index){
                    radio_chart(clickengin,$(this).val());
                }
                dwr_index = $(this).parent().index();
            });
            /*
            ////ICF算法input点击事件
            $('.trainContent .condition .radio_condition ul li input[name="ICF_para"]').click(function(){
                if(!$(this).hasClass("active")){
                    $("#ICF_trainIndicator .indiContent").hide();
                }
                $('.trainContent .condition .radio_condition ul li input[name="ICF_para"]').removeClass("active");
                $(this).addClass("active");
            });
            
            ////UCF算法input点击事件
            $('.trainContent .condition .radio_condition ul li input[name="UCF_para"]').click(function(){
                if(!$(this).hasClass("active")){
                    $("#UCF_trainIndicator .indiContent").hide();
                }
                $('.trainContent .condition .radio_condition ul li input[name="UCF_para"]').removeClass("active");
                $(this).addClass("active");
            });
            
            ////DWR算法input点击事件
            $('.trainContent .condition .radio_condition ul li input[name="DWR_para"]').click(function(){
                if(!$(this).hasClass("active")){
                    $("#DWR_trainIndicator .indiContent").hide();
                }
                $('.trainContent .condition .radio_condition ul li input[name="DWR_para"]').removeClass("active");
                $(this).addClass("active");
            });*/
        },
        

        /**
         * 热门微博
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        hotweibo:function(R, param){    
            setHtml(
                R
                ,_tpls.algorithm_hotweibo("热门微博")
                , "hotweibo"
                , LANG("热门微博")
            );
            
            $("#hottype").append('<option value="-1">全部</option>');
            ////制作表格
            private_setHotweiboLayout('/algorithm/weiborank?period=24&type=-1');
            
            $.getJSON('/algorithm/weibotypelist', function(rdata){
                if (rdata.success){
                    $.each(rdata.result, function(i,n){  
                        $("#hottype").append('<option value="'+n.id+'">'+n.name+'</option>');
                    });
                    return false;
                }else{
                    private_alert(rdata.message);
                    return false;
                }
            });
            
            ////"日期选择"点击事件
            $('.selectCondition .topCon .img .icon').die('click').live('click', function(event) {
              if(!$(this).hasClass("active")){
                    $('.selectCondition .topCon .img .icon').removeClass("active");
                    $('.selectCondition .topCon .text span').removeClass("active");
                    $(this).addClass("active");
                    $('.selectCondition .topCon .text span').eq($(this).index()).addClass("active");
                    
                    var type = $("#hottype").children("option:selected").val();
                    var period = $(this).attr("data-period");
                    private_setHotweiboLayout('/algorithm/weiborank?period='+period+'&type='+type);
                }   
            });
            
            ////"条件选择"点击事件
            $("#hottype").change( function() {
                var type = $(this).children("option:selected").val();
                var period = $(".selectCondition .topCon .img .active").attr("data-period");
                private_setHotweiboLayout('/algorithm/weiborank?period='+period+'&type='+type);
            });
        },
        
        /**
         * 热门用户
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        hotuser:function(R, param){ 
            setHtml(
                R
                ,_tpls.algorithm_hotuser("热门用户")
                , "hotuser"
                , LANG("热门用户")
            );
            $("#hottype").append('<option value="-1">全部</option>');
             ////制作表格
            private_setHotuserLayout('/algorithm/userrank?period=24&type=-1');
            
            $.getJSON('/algorithm/weibotypelist', function(rdata){
                if (rdata.success){
                    $.each(rdata.result, function(i,n){  
                      $("#hottype").append('<option value="'+n.id+'">'+n.name+'</option>');
                    });
                    return false;
                }else{
                    private_alert(rdata.message);
                    return false;
                }
            });
            
            ////"日期选择"点击事件
            $('.selectCondition .topCon .img .icon').die('click').live('click', function(event) {
              if(!$(this).hasClass("active")){
                    $('.selectCondition .topCon .img .icon').removeClass("active");
                    $('.selectCondition .topCon .text span').removeClass("active");
                    $(this).addClass("active");
                    $('.selectCondition .topCon .text span').eq($(this).index()).addClass("active");
                    
                    var type = $("#hottype").children("option:selected").val();
                    var period = $(this).attr("data-period");
                    private_setHotuserLayout('/algorithm/userrank?period='+period+'&type='+type);
                }
            });
            
            ////"条件选择"点击事件
            $("#hottype").change( function() {
                var type = $(this).children("option:selected").val();
                var period = $(".selectCondition .topCon .img .active").attr("data-period");
                private_setHotuserLayout('/algorithm/userrank?period='+period+'&type='+type);
            });
        },
        /**
         * 热门话题
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        hottopic:function(R, param){    
            setHtml(
                R
                ,_tpls.algorithm_hottopic("热门话题")
                , "hottopic"
                , LANG("热门话题")
            );
            ////制作表格
            private_setHottopicLayout('/algorithm/topicrank?period=24');
            
            ////"日期选择"点击事件
            $('.selectCondition .topCon .img .icon').each(function(i){
                $(this).click(function(){
                    if(!$(this).hasClass("active")){
                        $('.selectCondition .topCon .img .icon').removeClass("active");
                        $('.selectCondition .topCon .text span').removeClass("active");
                        $(this).addClass("active");
                        $('.selectCondition .topCon .text span').eq(i).addClass("active");
                        
                        var period = $(this).attr("data-period");
                        private_setHottopicLayout('/algorithm/topicrank?period='+period);
                    }
                });
            });
        },
        
        /**
         * 潜力微博
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        potential:function(R, param){   
            setHtml(
                R
                ,_tpls.algorithm_potential("潜力微博")
                , "potential"
                , LANG("潜力微博")
            );
            Clicki.layout.destroy().add({
                "layout":{
                    "thePotential":{
                        "type":"grid",
                        "config":{
                            "url":"/algorithm/potentialrank",
                            "params":{
                                "page":1,
                                "limit":20
                            },
                            "caption":{
                                "content":{
                                    "desc":"",
                                    "title":LANG("微博内容")
                                },
                                "from":{
                                    "desc":"",
                                    "title":LANG("来自用户")
                                }
                                ,
                                "publish":{
                                    "desc":"",
                                    "title":LANG("发布时间")
                                }
                                ,
                                "1hour":{
                                    "desc":"",
                                    "title":LANG("1小时内传播量")
                                }
                                ,
                                "petantial":{
                                    "desc":"",
                                    "title":LANG("潜力值")
                                }
                            },
                            "colModel":[
                                {
                                    "tdCls":"theTextLeft"
                                    ,"cls":"admin-tab-left"
                                    ,data:'content'
                                    ,render: function(key, i, row){
                                        return htmlencode(this._getCollection().getModelDataAt(row).content);
                                    }
                                },
                                {
                                    "tdCls":"theTextCenter"
                                    ,"cls":"admin-tab-center"
                                    ,width: '120px'
                                    ,data:'from'
                                    ,render: function(key, i, row){
                                        var name = this._getCollection().getModelDataAt(row).username;
                                        var v = this._getCollection().getModelDataAt(row).usertype?"bluev":"";
                                        var fans = this._getCollection().getModelDataAt(row).fans?this._getCollection().getModelDataAt(row).fans:0;
                                        var html = '<p><span class="fromuser">'+name+'</span><span class='+v+'></span></p>\
                                                          <p class="hotname">粉丝量:'+fans+'</p>';
                                        return html;
                                    }
                                },
                                {
                                    "tdCls":"theTextCenter"
                                    ,"cls":"admin-tab-center"
                                    ,data:'publish'
                                    ,render: function(key, i, row){
                                        return this._getCollection().getModelDataAt(row).public_date;
                                    }
                                },
                                {
                                    "tdCls":"theTextCenter"
                                    ,"cls":"admin-tab-center"
                                    ,data:'1hour'
                                    ,render: function(key, i, row){
                                        return this._getCollection().getModelDataAt(row).forward_count;
                                    }
                                },
                                {
                                    "tdCls":"theTextCenter"
                                    ,"cls":"admin-tab-center"
                                    ,data:'petantial'
                                    ,render: function(key, i, row){
                                        return this._getCollection().getModelDataAt(row).potential;
                                    }
                                },
                                {
                                    text:LANG("操作"),
                                    "tdCls":"theTextCenter",
                                    "cls":"admin-tab-center",
                                    data:null,
                                    width: '80px',
                                    render:function(key,i,row){
                                        var linkurl = this._getCollection().getModelDataAt(row).wb_url;
                                        return '<a href="'+linkurl+'" class="weibo_show" target="_blank" title="查看原微博">查看原微博</a>';
                                    }
                                }
                            ]
                            ,"target":"algorithm_potentialArea"
                            //////////////////////////构建完成后的回调函数////////////////////////////////
                            ,callback:function(){
                                
                            }
                            /////////////////////////////////////////////////////////////
                        }
                    }
                }
            });
        },
        
        
        /**
         * 作业管理
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        manageprocess:function(R, param){
            setHtml(
                R
                ,_tpls.algorithm_manageprocess()
                , "manageprocess"
                , LANG("作业管理")
            );
            Clicki.layout.destroy().add({
                "layout":{
                    "theManageprocess":{
                        "type":"grid",
                        "config":{
                            "url":"/admin/processmanage",
                            "params":{
                                "page":1,
                                "limit":20
                            },
                            "caption":{
                                "name":{
                                    "desc":"",
                                    "title":LANG("作业名称")
                                },
                                "dirction":{
                                    "desc":"",
                                    "title":LANG("作业说明")
                                }
                                ,
                                "file":{
                                    "desc":"",
                                    "title":LANG("程序文件")
                                }
                                ,
                                "last_time":{
                                    "desc":"",
                                    "title":LANG("上次执行时间")
                                }
                                ,
                                "next_time":{
                                    "desc":"",
                                    "title":LANG("下次执行时间")
                                }
                                ,
                                "state":{
                                    "desc":"",
                                    "title":LANG("当前状态")
                                }
                            },
                            "colModel":[
                                {
                                    "tdCls":"theTextLeft"
                                    ,"cls":"admin-tab-left"
                                    ,width:'80px'
                                    ,data:'name'
                                    ,render: function(key, i, row){
                                        return this._getCollection().getModelDataAt(row).name;
                                    }
                                },
                                {
                                    "tdCls":"theTextLeft"
                                    ,"cls":"admin-tab-left"
                                    ,data:'dirction'
                                    ,width:'120px'
                                    ,render: function(key, i, row){
                                        return this._getCollection().getModelDataAt(row).desc;
                                    }
                                },
                                {
                                    "tdCls":"theTextLeft"
                                    ,"cls":"admin-tab-left"
                                    ,data:'file'
                                    ,width:'100px'
                                    ,render: function(key, i, row){
                                        return this._getCollection().getModelDataAt(row).file_path;
                                    }
                                },
                                {
                                    "tdCls":"theTextLeft"
                                    ,"cls":"admin-tab-left"
                                    ,data:'last_time'
                                    ,width:'50px'
                                    ,render: function(key, i, row){
                                        return this._getCollection().getModelDataAt(row).last_time;
                                    }
                                },
                                {
                                    "tdCls":"theTextLeft"
                                    ,"cls":"admin-tab-left"
                                    ,data:'next_time'
                                    ,width:'50px'
                                    ,render: function(key, i, row){
                                        return this._getCollection().getModelDataAt(row).next_time;
                                    }
                                },
                                {
                                    "tdCls":"theTextCenter"
                                    ,"cls":"admin-tab-center"
                                    ,width:'50px'
                                    ,data:'state'
                                    ,render: function(key, i, row){
                                        var sta = this._getCollection().getModelDataAt(row).status;
                                        if(sta == 1){
                                            return "已启动";
                                        }else{
                                            return "已停止";
                                        }
                                    }
                                },
                                {
                                    "tdCls":"theTextCenter",
                                    "cls":"admin-tab-center",
                                    text:LANG("操作"),
                                    data:null,
                                    width:'100px',
                                    render:function(key,i,row){
                                        var stas = this._getCollection().getModelDataAt(row).status;
                                        if(stas == 1){
                                            stas = "停止";
                                        }else{
                                            stas = "启动";
                                        }   
                                        var tagA_arr = [stas,"编辑"];
                                        var data_state = this._getCollection().getModelDataAt(row).status;
                                        var data_id = this._getCollection().getModelDataAt(row).num;
                                        return ['<p class="managOperating"><a href="javascript:void(0);" data-id="'+data_id+'" data_state="'+data_state+'" data-index='+row+' class="node_list_startOrStop frist" title="'+tagA_arr[0]+'">'+tagA_arr[0]+'</a>',
                                                    '<a href="javascript:void(0);" data-id="'+data_id+'" data_state="'+data_state+'" data-index='+row+' class="node_list_editIt" title="'+tagA_arr[1]+'">'+tagA_arr[1]+'</a></p>'].join("");
                                    }
                                }
                            ]
                            ,"target":"algorithm_manageprocessArea"
                            //////////////////////////构建完成后的回调函数////////////////////////////////
                            ,callback:function(){
                                var grid = this;
                                //启动停止操作//
                                $(".node_list_startOrStop").die('click').live("click", function(event){
                                    var _getData = grid.getAllModelData();
                                    var num = $(this).attr("data-index");
                                    var _id = $(this).attr("data-id");
                                    var _cmd = ($(this).attr("data_state")=="0"?"1":"2");
                                    //var url = '/admin/processctrl?process_id='+_id+'&cmd='+_cmd;
                                    var submitData ={
                                        process_id:_id,
                                        cmd:_cmd
                                    }
                                    if(_cmd==2){
                                        private_alert(LANG('停止作业可能会影响到算法离线数据的更新，确定要停止？'), function(){
                                            private_alert(LANG('请再次确认是否要停止作业？'), function(){
                                                private_save('/admin/processctrl',submitData,"#/algorithm/manageprocess",-1,true);
                                            });
                                        }); 
                                    }else{
                                        private_save('/admin/processctrl',submitData,"#/algorithm/manageprocess",-1,true);
                                    }
                                    
                                });
                                
                                //编辑操作//
                                $(".node_list_editIt").die('click').live("click", function(event){
                                    //var _this = $(event.target);
                                    var _getData = grid.getAllModelData();
                                    var num = $(this).attr("data-index");
                                    var _id = $(this).attr("data-id");
                                    cache.scene_curr_data = _getData[num];
                                    private_manageprocess_edit();
                                    return false;
                                });
                            }
                            /////////////////////////////////////////////////////////////
                        }
                    }
                }
            });
        },
        
        /**
         * 出错页面
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        error:function(R, param){
            setHtml(
                R
                ,_tpls.error()
                , "error"
                , "您没有操作权限"
            );
        }
}
});