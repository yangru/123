define(function(require){
    var $ = require('jquery');
    var _ = require('underscore');
    var pop = require('pop_up');

    function addCSS(id, css){
        id = 'admin_style_'+id;
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

    var css = '\
        .admin-tab-left {text-align:left !important;}\
        .admin-tab-center, .admin-tab-center div {text-align:center !important; margin:0px !important;}\
        .admin-title-text { margin-left: 1.2em; color: #7E7E7E; font-size: 20px; text-shadow: rgba(255, 255, 255, 1) 1px 1px 0; line-height: 46px; height: 46px;}\
        .admin_form {background:#F9F9F9; border:1px solid #E1E1E1; padding:20px; margin:20px auto 0 auto;}\
        .admin_form .error_message {display:none; margin-bottom: 20px; border: 1px solid #EE844E; background: #FFFFA3; padding: 10px 20px; font-size: 14px; color: #E98654;}\
        .admin_form h3 {padding:0 0 20px 0;}\
        .admin_form p {margin:0px; padding:0 0 20px 0;}\
        .admin_form label {font-size:14px;color:#666; margin-right:10px;}\
        .admin-right {float:right; margin:20px 20px 0 0;}\
        .admin_form .admin_error {border:1px solid #990000; border-radius:3px;}\
        a.btnGray {color: #4A4A4A;}\
        .admin_form input, .admin_form textarea {margin:0 10px;}\
        .admin_form .userRight {padding:0 0 20px 20px; position:relative;}\
        .admin_form .userRight strong {font-size:16px; display:block; margin-left:-20px; padding-bottom:10px;}\
        .admin_form .userRight label {font-size:14px; font-weight:700;}\
        .admin-del {padding:0px; width:30px; min-width:auto; position:absolute; left:710px;}\
        .admin-del i {float:left; width:30px; height:30px; background:url(/resources/styles/images/bullet_cross.png) 50% 50% no-repeat; cursor:pointer;}\
        .admin_form #grantSuperUser {margin: 0;}\
        .admin_form #SuperUserNote {margin: 5px 0 15px 30px; font-size:14px;}\
        .admin_form #userRightList {margin-bottom:10px;}\
        .admin_form #userRightList label {margin-left: 30px;}\
        .admin_form #userRightList .right-list-item {margin-top:10px; position:relative;}\
        .admin_form #adminNewRight {margin-left:30px;}\
        .admin_form #adminNewRight i {background:url(/resources/styles/images/more_18.gif) 50% 50% no-repeat;}\
        .admin_form #userRightListMask {background:#F9F9F9; opacity:0.5; position:absolute; width:100%; top:80px; display:none;}\
        .admin_form select {height:30px;}\
        .customRightWin {margin:-10px -10px 10px 0; height:400px; overflow:auto; position:relative; padding:10px 10px 10px 0;}\
            .customRightWin .custom-title {margin-bottom:10px; font-size:16px;}\
        .CustomRightForm {border:1px solid #C8CCCD}\
            .CustomRightForm .right-type-title {background:#f7f6f5; font-size:16px; font-weight:bolder; line-height:25px;}\
            .CustomRightForm td {border: 1px solid #DDD; border-size: 0 0 1px 1px;}\
                .CustomRightForm td.op {width:80px; text-align:center; padding:0 8px;}\
                .CustomRightForm .op * {display:none;}\
                    .CustomRightForm .op.role_has span {display:inline;}\
                    .CustomRightForm .op a {border:1px solid #ccc;color:#fff; height:20px; line-height:20px; width:50px; text-align:center; margin:0 auto; cursor:pointer;}\
                        .CustomRightForm .has_add .add {display:block; background:#8fc31f;}\
                        .CustomRightForm .has_remove .remove {display:block; background:#f39800;}\
        .admin_form #adminRoleRight {border:1px solid #ccc; border-style:solid none; float:left; width:700px; height:280px; margin-left:13px; background:#fff; overflow:auto; padding:0;}\
        .admin_form .adminRoleHeightCtrl {padding:0px; float:left; min-width:auto; margin-left:5px;}\
            .admin_form .adminRoleHeightCtrl i {float:left; padding:7px 0 0 32px; height:30px; background:url(/resources/styles/images/down.png) 13px 45% no-repeat;}\
            .admin_form .adminRoleHeightCtrl em {float:left; padding:7px 0 0 32px; height:30px; background:url(/resources/styles/images/up.png) 13px 45% no-repeat;}\
    ';
    function setHtml(me, html, navid, name, title){
        addCSS('main', css);
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
        $("#theNavMain,#theNavSetSite").hide();
        $("#theNavAdmin").show();
        if(title){
            $("#functionTitle").html(title);
        }
        /*
        $("#theCrumbs").html().empty().append(LANG("管理后台")+' / ' + LANG(name));

        if (title){
            var t = $('<div></div>').text(title).addClass('admin-title-text');
            t.prepend('<a class="btnGray admin-btn" href="JavaScript:history.go(-1);" style="float:left; width:30px; min-width:auto; margin:10px 20px 0 0;">'+LANG("返回")+'</a>');
            Clicki.NavView.contentBox.prepend(t);
        }*/
        // 设置路径
        me.testIfAfterF5(navid);
        //me.crumbs(name);
        Clicki.Balance();
    }

    // 挂载日期控件
    function initDatePicker(){

    }

    // 系统缓存记录
    var cache = {
        roles: null,        // 系统角色列表
        authorize: null,    // 系统全局权限列表
        sites: null,        // 网站列表
        popup: null,        // 弹出对话框
        rights: [],         // 用户网站权限缓存
        temp: null,         // 临时编辑权限缓存
        current: null,      // 当前权限项目
        users: null,        // 当前网站可选择权限
        role_id: 0,         // 指定某个角色
        userlistURL:null    //用户列表的url
    };

    //对返回的数据做undefined转空字符串处理
    function emptyString(str) {
        if(str == undefined || str == null) {
            return "";
        } else {
            return str;
        }
    }
    
    //对角色以及附加权限等数据的显示
    function private_authorize_show(_data){
        var _html = '',_data_authorize = '',_data_rolename = '';
        if(_data != null && _data.role != undefined) {
            _data_rolename = emptyString(_data.role.name);
            if (_data.role.id == 0) _data_rolename = '<b>' + _data_rolename + '</b>';
            _.each(_data.authorize,function(data){
                _data_authorize += emptyString(data.title) + ' ';
            }); 
        }               
        _html += '<p><b>'+LANG("角色")+'</b>：'+ _data_rolename +'</p>';
        if (_data_authorize != ''){
            _html += '<p title="' + _data_authorize + '"><b>'+LANG("附加")+'</b>：' + _data_authorize.cutMixStr(0,30,'..') + '</p>';
        } else {
            _html += '<p>&nbsp;</p>';
        }
        return _html;
    }
    

    // 内部公用函数
    function private_newSiteRightItem(evt, right){
        var tpl = '<div class="right-list-item">\
                <label>'+LANG("系统角色")+'</label>\
                <select class="roleList"></select>\
            </div>';
        
        /*var tpl = '<div class="right-list-item">\
                <label>'+LANG("网站角色")+'</label>\
                <select class="roleList"></select>\
                <input class="btn_hui03 admin-btn" type="button" value=" '+LANG("附加权限")+' " />\
            </div>';*/
            /*var tpl = '<div class="right-list-item">\
                <label>'+LANG("网站")+'</label>\
                <select class="adminSiteList"></select>\
                <label>'+LANG("网站角色")+'</label>\
                <select class="roleList"></select>\
                <input class="btnGray admin-btn" type="button" value=" '+LANG("附加权限")+' " />\
                <a class="admin-del"><i></i></a>\
            </div>';*/
            
        var list = $(tpl).appendTo('#userRightList');
        right = right || {site_id:0, role_id:0, custom:[]};
        //console.dir(right)
        list.attr('data-index', cache.rights.length);
        cache.rights.push(right);
        
        /*
        var assign = (evt && evt.data == 'assignSite');
        // 赋值列表
        var opt;
        var sel = list.find('.adminSiteList');
        opt = $('<option></option>');
        opt.attr('value', '0');
        opt.text(assign ? LANG('选择一个网站'):LANG('所有网站'));
        sel.append(opt);

        _.each(cache.sites, function(site){
            if (assign) site.key = site.id;
            opt = $('<option></option>');
            opt.attr('value', site.key);
            opt.text(site.url);
            if (site.key == right.site_id) {                
                opt.prop('selected', true);
            }
            sel.append(opt);
        });*/

        var sel = list.find('.roleList');
        //console.dir(cache.roles)
        _.each(cache.roles, function(role){
            opt = $('<option></option>');
            opt.attr('value', role.id);
            opt.text(role.name);
            if (role.id == right.role_id) opt.prop('selected', true);
            sel.append(opt);
        });

        // 绑定按钮事件
        list.find('input.btn_hui03').bind('click', right, private_customRightClick);
        list.find('a.admin-del').bind('click', private_customRightRemove);
        Clicki.Balance();
    }

    function private_newUserRightItem(evt, right){
        var tpl = '<div class="right-list-item">\
                <label>'+LANG("用户")+'</label>\
                <select class="adminUserList"></select>\
                <label>'+LANG("权限角色")+'</label>\
                <select class="roleList"></select>\
                <input class="btnGray admin-btn" type="button" value=" '+LANG("附加权限")+' " />\
            </div>';
            /*var tpl = '<div class="right-list-item">\
                <label>'+LANG("用户")+'</label>\
                <select class="adminUserList"></select>\
                <label>'+LANG("权限角色")+'</label>\
                <select class="roleList"></select>\
                <input class="btnGray admin-btn" type="button" value=" '+LANG("附加权限")+' " />\
                <a class="admin-del"><i></i></a>\
            </div>';*/
        var list = $(tpl).appendTo('#userRightList');
        right = right || {user_id:0, role_id:cache.role_id, custom:[]};
        list.attr('data-index', cache.rights.length);
        cache.rights.push(right);

        // 赋值列表
        var sel = list.find('.adminUserList');
        var opt = $('<option></option>');
        opt.attr('value', '0');
        opt.text(LANG('请选择用户'));
        sel.append(opt);

        _.each(cache.users, function(user){
            opt = $('<option></option>');
            opt.attr('value', user.id);
            opt.text(user.email);
            if (user.id == right.user_id) {
                opt.prop('selected', true);
            }
            sel.append(opt);
        });

        var sel = list.find('.roleList');
        _.each(cache.roles, function(role){
            opt = $('<option></option>');
            opt.attr('value', role.id);
            opt.text(role.name);
            if (role.id == right.role_id) opt.prop('selected', true);
            sel.append(opt);
        });

        // 绑定按钮事件
        list.find('input.btnGray').bind('click', right, private_customRightClick);
        list.find('a.admin-del').bind('click', private_customRightRemove);
        Clicki.Balance();
    }

    function private_customRightRemove(evt){
        private_confirm(LANG('确认删除授权?'), function(){
            var item = $(this).parent();
            var index = item.attr('data-index');
            cache.rights[index] = null;
            item.remove();
        });
    }

    function private_buildRightTable(dom){
        var row = null;
        var tab = $('<table class="CustomRightForm"></table>');
        var names = {user: LANG('用户/角色管理权限'), monitor: LANG('监控管理权限'), algorithm: LANG('算法应用管理权限'), weibo: LANG('微博监控权限')};

        _.each(cache.authorize, function(group, name){
            row = $('<tr><td colspan="4" class="right-type-title"></td></tr>').appendTo(tab);
            row.find('td').text(names[name]);

            var count = 1;
            _.each(group, function(right, rid){
                row = $('<tr><td></td><td></td><td></td><td class="op"></td></tr>').appendTo(tab);
                row = row.find('td');
                row.eq(0).text(count++);
                row.eq(1).text(LANG(right.title));
                row.eq(2).text(LANG(right.desc));
                row.eq(3).html('<span>'+LANG("角色已拥有")+'</span><a class="add">'+LANG("添加")+'</a><a class="remove">'+LANG("取消")+'</a>').attr('data-id', rid);
            });
        });
        tab.appendTo(dom);
        tab.click(private_customRightToggle);
        return tab;
    }
    // 权限table对象, 橘色权限列表字符串, 用户附加权限ID数组
    function private_updateRightTable(tab, role, custom){
        var ops = tab.find('td.op');

        ops.attr('class', 'op has_add');
        // 添加特殊权限
        _.each(custom, function(rid){
            ops.filter('[data-id="'+rid+'"]').attr('class', 'op has_remove');
        });
        // 角色拥有权限
        _.each(role.split(','), function(rid){
            ops.filter('[data-id="'+rid+'"]').attr('class', 'op role_has');
        });     
    }
    function private_toggleRightTable(evt){
        var con = $(this).prev();
        if (con.data('expend')){
            con.attr('style', '');
            con.data('expend', false);
            $(this).html('<i>'+LANG("展开")+'</i>');
        }else {
            con.css({height:'auto', overflow:'initial'});
            con.data('expend', true);
            $(this).html('<em>'+LANG("收起")+'</em>');
        }
        var tab = con.find('table:first');
        tab.css('width', '99%');
        setTimeout(function(){
            tab.css('width', '100%');
            Clicki.Balance();
        }, 0);
    }

    function private_customRightClick(evt){
        var role_id = $(this).prev().val();
        var role = _.find(cache.roles, function(role){ return role.id == role_id; });
        var right = evt.data;
        cache.temp = _.clone(right.custom);
        cache.current = right;

        //if (!cache.popup){
            cache.popup = new pop({
                type: {'html': '<div class="customRightWin"></div>'},
                "ui":{
                    "title":{
                        "show":true,
                        "text":LANG("附加权限")
                    },
                    "width": 700
                },
                "autoClose":false,
                "showMark":true,
                "showClose":true,
                "showCtrl":true,
                onDone:function(){
                    cache.current.custom = cache.temp;
                    this.destroy();
                    cache.popup = null;
                },
                onCancel:function(){
                    cache.current.custom = cache.temp;
                    this.destroy();
                    cache.popup = null;
                },
                onClose:function(){
                    cache.current.custom = cache.temp;
                    this.destroy();
                    cache.popup = null;
                },
                onRender: function(){
                    var dom = this.doms.inner.find('.customRightWin');
                    dom.append('<div class="custom-title">'+LANG("当前角色")+': <strong></strong></div>');
                    var tab = private_buildRightTable(dom);
                    this.tab = tab;
                    this.ops = tab.find('td.op');
                    this.title = dom.find('.custom-title strong');
                },
                beforeShow: function(){
                },
                "data":null,
                "ready":false
            });
        //}
        cache.popup.show();
        // 设置标题角色名
        cache.popup.title.text(role.name);
        // 设置权限状态
        private_updateRightTable(cache.popup.tab, role.authlist, right.custom);
    }

    function private_customRightToggle(evt){
        if (evt.target.tagName != 'A') return false;
        var td = $(evt.target).parent();
        if (td.hasClass('role_has')) return false;
        var rid = td.attr('data-id');

        if (_.contains(cache.temp, rid)){
            cache.temp = _.difference(cache.temp, [rid]);
            td.attr('class', 'op has_add');
        }else {
            cache.temp.push(rid);
            td.attr('class', 'op has_remove');
        }
        return false;
    }

    function private_roleRightToggle(evt){
        if (evt.target.tagName != 'A') return false;
        var td = $(evt.target).parent();
        td.toggleClass('has_add has_remove');
        return false;
    }

    function private_save(url, data, callback){
        $.ajax(url, {
            data: data,
            type: 'GET',
            dataType: 'json',
            success: function(result){
                if (result.success){
                    private_alert(LANG('保存成功!'), function(){
                        if (_.isFunction(callback)){
                            callback(result);
                        }else {
                            Clicki.NavView.setDefaultActive(-1, callback);
                        }
                    });
                }else {
                    private_alert(result.error);
                    return;
                }
            },
            error: function(XMLHttpRequest1, textStatus1, errorThrown1){
                /*alert(XMLHttpRequest1);
                alert(textStatus1);
                alert(errorThrown1);*/
                // 服务器连接解析错误
                private_alert("服务器连接解析错误");
            }
        })
    }
    ////服务日志layout
    function private_setMonitorprocessLayout(url){
        Clicki.layout.destroy().add({
            "layout":{
                "theMonitorProcess":{
                    "type":"grid",
                    "config":{
                        "url":url,
                        "params":{
                            "page":1,
                            "limit":20
                        },
                        "caption":{
                            "name":{
                                "desc":"",
                                "title":LANG("服务名称")
                            },
                            "log":{
                                "desc":"",
                                "title":LANG("运行日志大小")
                            }
                            ,
                            "errlog":{
                                "desc":"",
                                "title":LANG("异常日志大小")
                            }
                        },
                        "colModel":[
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'name'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).name;
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'log'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).log_size;
                                }
                            },
                            {
                                text:LANG("操作"),
                                data:null,
                                tdCls:"siteCtrlTd",
                                width: '80px',
                                render:function(key,i,row){
                                    var D = this._getCollection().getModelDataAt(row);
                                    var log_size = this._getCollection().getModelDataAt(row).log_size;
                                    //var expoUrl = '/admin/processlog?process_id='+D.num+'&log_type=1&download=1'
                                    var checkA = '<p class="managOperating"><a href="javascript:void(0);" data-id="' + D.num + '" type="1" class="node_list_showIt frist" title="'+LANG("查看日志记录")+'">'+LANG("查看")+'</a>';
                                    var exportA = '<a href="javascript:void(0);" data-id="'+D.num+'" type="1" class="node_list_downIt" title="'+LANG("导出日志记录")+'">'+LANG("导出")+'</a></p>'
                                    if(log_size=="0K"){
                                        checkA = '<p class="managOperating"><a data-id="' + D.num + '" type="1" class="noExport frist" title="'+LANG("查看日志记录")+'">'+LANG("查看")+'</a>';
                                        exportA = '<a data-id="' + D.num + '" type="1" class="node_list_downIt noExport" title="'+LANG("导出日志记录")+'">'+LANG("导出")+'</a></p>';
                                    }
                                    return [checkA,exportA].join("");
                                }
                            },
                            {
                                "tdCls":"theTextCenter"
                                ,"cls":"admin-tab-center"
                                ,data:'errlog'
                                ,render: function(key, i, row){
                                    return this._getCollection().getModelDataAt(row).err_log_size;
                                }
                            },
                            {
                                text:LANG("操作"),
                                data:null,
                                tdCls:"siteCtrlTd",
                                width: '80px',
                                render:function(key,i,row){
                                    var D = this._getCollection().getModelDataAt(row);
                                    var err_log_size = this._getCollection().getModelDataAt(row).err_log_size;
                                    //var expoUrl = '/admin/processlog?process_id='+D.num+'&log_type=2&download=2'
                                    var checkA = '<p class="managOperating"><a href="javascript:void(0);" data-id="' + D.num + '" type="2" class="node_list_showIt frist" title="'+LANG("查看日志记录")+'">'+LANG("查看")+'</a>';
                                    var exportA = '<a href="javascript:void(0);" data-id="' + D.num + '" type="2" class="node_list_downIt" title="'+LANG("导出日志记录")+'">'+LANG("导出")+'</a></p>'
                                    if(err_log_size=="0K"){
                                        checkA = '<p class="managOperating"><a data-id="' + D.num + '" type="2" class="noExport frist" title="'+LANG("查看日志记录")+'">'+LANG("查看")+'</a>';
                                        exportA = '<a data-id="' + D.num + '" type="2" class="node_list_downIt noExport" title="'+LANG("导出日志记录")+'">'+LANG("导出")+'</a></p>';
                                    }
                                    return [checkA,exportA].join("");
                                }
                            }
                        ]
                        ,"target":"monitorProcessArea",
                        callback:function(){
                            $("#dataText").val(this.getJsonData().result.date);
                            ////查看按钮
                            $(".node_list_showIt").die('click').live("click", function(e){
                                $(".theGridMarkLayout").show();
                                var type = $(e.target).attr('type');
                                var _id = $(e.target).attr('data-id');
                                var _date = $("#dataText").val();
                                var url = '/admin/processlog?date='+_date+'&process_id='+_id+'&log_type='+type;
                                
                                $.getJSON(url, function(rdata){
                                    if (rdata.success){
                                        $(".theGridMarkLayout").hide();
                                        private_monitorprocess_check(rdata.msg);
                                        return false;
                                    }else{
                                        $(".theGridMarkLayout").hide();
                                        private_alert(LANG("服务器正忙，操作失败，请稍后再试"));
                                    }
                                    return false;
                                })
                            });
                            ////导出按钮
                            $(".node_list_downIt").die('click').live("click", function(e){
                                var type = $(e.target).attr('type');
                                var _id = $(e.target).attr('data-id');
                                var _date = $("#dataText").val();
                                var url = '/admin/processlog?date='+_date+'&process_id='+_id+'&log_type='+type+'&download=1';
                                //this.href = url;
                                //this.target = "_blank";
                                if($(this).attr("href")){
                                    window.open(url,"_blank");
                                } 
                                return false;
                            }); 
                        }
                    }
                }
            }
        });
    }
    ////服务日志查看按钮
    function private_monitorprocess_check(data){
        cache.popup = new pop({
            type: {'html': '<div class="customCheckParams"></div>'},
            "ui":{
                "title":{
                    "show":true,
                    "text":LANG("查看日志")
                },
                "width": 700
            },
            "autoClose":false,
            "showMark":true,
            "showClose":true,
            "showCtrl":true,
            onDone:function(){
                this.destroy();
                cache.popup = null;
            },
            onCancel:function(){
                this.destroy();
                cache.popup = null;
            },
            onClose:function(){
                this.destroy();
                cache.popup = null;
            },
            onRender: function(){
                var dom = this.doms.inner.find('.customCheckParams');
                dom.append('<div class="moniproc_check"></div>');
                
                var tab = $('<table class="CheckParamsTable"></table>');
                tab.append('<tr><th class="tr_title">日志</th></tr>');
                 
                var tagP = '';
                $.each(data,function(i,element){
                    var row = $('<tr><td class="align_left"></td></tr>').appendTo(tab);
                    var td = row.find('td');
                    td.eq(0).html(element);
                });
                dom.find(".moniproc_check").append(tab);
            },
            beforeShow: function(){
            },
            "data":null,
            "ready":false
        });
        cache.popup.show();
    }
///////////////////////////////////////////////////////

    var alert_pop = null;
    function private_confirm(msg, callback){
        private_alert(msg, callback, true);
    }
    function private_alert(msg, callback, confirm){
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
                        this.content.text(this.msg_queue[0][0]);
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
                    this.content.text(this.msg_queue[0][0]);
                    this.doms.cancelBnt.toggle(this.msg_queue[0][2]);
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
            alert_pop.showed = false;
            alert_pop.msg_queue = [];
        }

        alert_pop.msg_queue.push([msg, callback, confirm || false]);
        if (!alert_pop.showed){
            alert_pop.show();
        }
    }

    // 模板对象
    var _tpls = {
            pageList:function(config){
                config = config || {};
                return '<h2 id="functionTitle">'+(config.title&&config.title||'')+'</h2>\
                        <div id="showArea" class="theShowArea siteMane '+(config.cls && config.cls || '')+'">\
                            <div class="keyWordSearcher" id="'+(config.sid && config.sid || 'theAdminSiteListSearcher')+'"></div>\
                            <div class="G-outterBox G-tableSet processTable">\
                                <div id="'+(config.id && config.id || 'theTableAdminSite')+'" class="theTableBox"></div>\
                            </div>\
                        </div>';
            }
            ,loger:function(){
                return '<h2>'+LANG("业务日志")+'</h2><div id="showArea" class="theShowArea thelogArea">\
                            <div id="datepicker"></div>\
                            <div class="G-tableSet">\
                            <div id="operationLogArea" class="theTableBox"></div>\
                            </div>\
                        </div>';
            },
            processManage:function(){
                return '<h2>'+LANG("模块管理")+'</h2><div id="showArea" class="theShowArea thelogArea">\
                            <div class="G-tableSet">\
                            <div id="manageProcessArea" class="theTableBox"></div>\
                            </div>\
                        </div>';
            },
            monitorProcess:function(){
                return '<h2>'+LANG("服务日志")+'</h2><div id="showArea" class="theShowArea thelogArea">\
                            <div class="error_message"></div>\
                            <div id="datepicker">\
                                <input type="text" id="dataText" maxlength="10"><label>(格式:YYYY-MM-DD)</label>\
                                <input type="button" value="查询" class="primary" id="gotoQuery">\
                            </div>\
                            <div class="G-tableSet">\
                            <div id="monitorProcessArea" class="theTableBox"></div>\
                            </div>\
                            <iframe id="downFrame" style="display: none;"></iframe>\
                        </div>';
            },
            error:function(){
                return '<h2>您没有操作权限</h2>';
            }
        }
        ,_today = Clicki.getDateStr()
        ,_yestoday = Clicki.getDateStr({day:-1});
        
        
    return {
        MODULE_NAME: 'admin',
        /**
         * 管理站点列表
         * @param  {String} routerParams 原始参数字符串
         * @return {Undefined}           无返回
         */
        siteList: function(R,param){
            var params = param.split('/');          
            var is_super = params[0];
            var title = LANG('网站列表');
            var setTitle = LANG('网站列表');
            var setLi = 'siteList';
            var usites = [];
            var ajax_usite_end = 0;
            if(is_super) {
                var email = params[2];
                var _uid = params[1];
                title = LANG('用户%1关联网站',email);
                setLi = 'userListSuper';
                // 拉取用户的所有站点
                $.getJSON('/admin/site?page=1&limit=100&uid=' + _uid, function(rdata){
                    if (!rdata.success) return false;                                               
                    if (rdata.result.items) {
                        usites= rdata.result.items;                                                             
                        ajax_usite_end = 1;
                    }
                });
            }
            setHtml(
                R
                ,_tpls.pageList({"title":setTitle})
                , setLi
                , setTitle
                , title
            );

            $("#theAdminSiteListSearcher").append('<a class="btnGreen admin-btn admin-new" href="#/admin/addsite" style="float:right;">'+LANG("添加网站")+'</a>');

            Clicki.layout.destroy().add({
                "layout":{
                    "theTableAdminSite":{
                        "type":"grid",
                        "config":{
                            "url":"/admin/site"
                            ,"params":{
                                "page":1
                                ,"limit":10
                            }
                            ,"caption":{
                                "sitename":{
                                    "desc":""
                                    ,"title":LANG("网站")
                                }
                                ,"last_time":{
                                    "desc":""
                                    ,"title":LANG("操作记录")
                                }
                            }
                            ,"colModel":[
                                {
                                    "compare":false
                                    ,"tdCls":"theTextLeft"
                                    ,"data":"sitename"
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        return '<div class="theSiteName">'+_data.sitename+'</div><div class="theSiteUrl"><a href="'+_data.url+'" target="_blank" title="'+_data.url+'">'+_data.url.replace(/(http:\/\/)||(https:\/\/)/g,"")+'</a></div>'
                                    }
                                }
                                ,{
                                    "data":"last_time"
                                    ,"tdCls":"theTextLeft"
                                    ,"cls":'admin-tab-left'
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        return '<p><strong>'+LANG("添加时间")+':</strong>'+_data.create_time+'</p><p><strong>'+LANG("最近一次修改时间")+':</strong>'+_data.last_time+'</p>';
                                    }
                                }
                                ,{
                                    text:LANG("操作"),
                                    data:null,
                                    tdCls:"siteCtrlTd",
                                    width: '140px',
                                    render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row); 
                                        var _sid = _data.id;
                                        var _html = '<p class="managOperating" key="'+_sid+'"><a href="#/admin/siteUserList/'+_sid+'/'+escape(_data.sitename)+'" title="'+LANG("用户列表")+'">'+LANG("用户列表")+'</a><a href="#/admin/editsite/'+_sid+'" class="node_list_updateIt" title="'+LANG("修改")+'">'+LANG("修改")+'</a><a href="javascript:void(0);" class="node_list_delIt">'+LANG("删除")+'</a>';
                                        if(is_super == 'super') {                                                                       
                                            var _uid = params[1];
                                            var _has_join = 0;
                                            if(ajax_usite_end) {
                                                _has_join = 1;      //没有关联用户
                                                _.each(usites,function(usite){
                                                    if(usite.id == _sid) {
                                                        _has_join = 2;
                                                    }
                                                });
                                            }
                                            
                                            if(_has_join == 1) {
                                                _html += '<a href=javascript:void(0); class="node_list_join" key="' + _uid + '">'+LANG("关联用户")+'</a>';
                                            } else if(_has_join == 2) {                                             
                                                _html += '<a href=javascript:void(0); class="node_list_unjoin" key="' + _uid + '">'+LANG("取消关联用户")+'</a>';
                                            } else {
                                                _html += '<a href=javascript:void(0); class="node_list_join" key="' + _uid + '">'+LANG("关联用户")+'</a>';                                              
                                                _html += '<a href=javascript:void(0); class="node_list_unjoin" key="' + _uid + '">'+LANG("取消关联用户")+'</a>';
                                            }
                                        }                    
                                        _html += '</p>';
                                        return _html;                                                                       
                                    }
                                }
                            ]
                            ,"target":"theTableAdminSite"
                            /*,afterRender:function(mvc){
                                var gridtable = this.table;
                                function editSite(evt){
                                    location.href = '#/admin/operationlog/' + evt.data;
                                }
                                $.each(gridtable.find(".gridContentBody:first tr"),function(i,n){
                                    var _tr = $(this);
                                    var data = mvc.Collection.getModelDataAt(i);
                                    if (!data || !data.id) return;
                                    var _id = data.id;
                                    _tr.children("td[nocompare='0']").css("cursor","pointer").click(_id, editSite);
                                });
                            }*/
                            ,callback:function(){
                                /*删除网站*/
                                $(".node_list_delIt").die('click').live("click", function(e){
                                    private_confirm(LANG("确认要删除么？"), function(){
                                        var $p = $(e.target).parents(":first");
                                        var siteid =  $p.attr("key");                                                                               
                                        $.ajax({
                                            type:"GET",
                                            url:"/site/ajaxdelsite?site_id="+ siteid,
                                            dataType:"json",
                                            data:this.parm,
                                            success:function(data){
                                                if(data.error == "+OK"){
                                                    /*如果异步删除很麻烦了，有要更新grid ，又要更新左上角的弹出层，所以干脆直接刷页面算了*/
                                                    var $tbody = $p.parents("tbody");
                                                    var dt = $(e.target).parent().parent().parent().parent().find('td:first').find('div').html();
                                                    var d_url = dt.split('<br>')[1];
                                                    $p.parents("tr:first").remove();
                                                    $('#theClickPopListOutterBox > ol > li').each(function(i, value){
                                                        var poptext = value.innerHTML.split('</strong>')[1];
                                                        if (poptext == d_url) {
                                                            $(this).remove();
                                                        }
                                                    });
                                                    if ($('div#siteList').attr("key") == siteid){
                                                        //window.location.reload();
                                                        Clicki.layout.get('theTableAdminSite').refresh({data:{}});
                                                    }
                                                    if($tbody.find("tr").length == 0){
                                                        //window.location.reload();
                                                        Clicki.layout.get('theTableAdminSite').refresh({data:{}});
                                                        //window.location.replace(location.href);
                                                    }
                                                    grid.refresh({"data":{}})
                                                }else{
                                                    private_alert(data.error);
                                                }
                                            },
                                           error:function(re){
                                              private_alert(LANG("服务器正忙，删除失败，请稍后再试"));
                                           }
                                        });
                                    });
                                    return false;
                                });
                                /*关联网站与用户*/
                                $(".node_list_join").die('click').live("click", function(e){
                                    private_confirm(LANG("确认要关联么？"), function(){
                                        var $p = $(e.target).parents(":first");
                                        var siteid =  $p.attr("key");       
                                        var uid = $(e.target).attr("key");                              
                                        $.ajax({
                                            type:"GET",
                                            url:"/admin/usersitejoin?site_id="+ siteid+"&user_id="+uid,
                                            dataType:"json",
                                            data:this.parm,
                                            success:function(data){
                                                if(data.success){                                                   
                                                    $p.find('a.node_list_join').remove();
                                                    $p.append('<a href=javascript:void(0); class="node_list_unjoin" key="' + uid + '">'+LANG("取消关联用户")+'</a>');
                                                    private_alert(LANG("关联成功"));
                                                }else{
                                                    private_alert(data.error);
                                                }
                                            },
                                           error:function(re){
                                              private_alert(LANG("服务器正忙，删除失败，请稍后再试"));
                                           }
                                        });
                                    });
                                    return false;
                                });
                                /*取消网站与用户的关联*/
                                $(".node_list_unjoin").die('click').live("click", function(e){
                                    private_confirm(LANG("确认要取消关联么？"), function(){
                                        var $p = $(e.target).parents(":first");
                                        var siteid =  $p.attr("key");       
                                        var uid = $(e.target).attr("key");                              
                                        $.ajax({
                                            type:"GET",
                                            url:"/admin/usersitejoin?unjoin=1&site_id="+ siteid+"&user_id="+uid,
                                            dataType:"json",
                                            data:this.parm,
                                            success:function(data){
                                                if(data.success){               
                                                    $p.find('a.node_list_unjoin').remove();                                 
                                                    $p.append('<a href=javascript:void(0); class="node_list_join" key="' + uid + '">'+LANG("关联用户")+'</a>');
                                                    private_alert(LANG("取消关联成功"));
                                                }else{
                                                    private_alert(data.error);
                                                }
                                            },
                                           error:function(re){
                                              private_alert(LANG("服务器正忙，删除失败，请稍后再试"));
                                           }
                                        });
                                    });
                                    return false;
                                });
                            }
                        }
                    }
                    ,"theAdminSiteListSearcher":{
                        "type":"search",
                        "config":{
                            "id":$("#theAdminSiteListSearcher"),
                            "slave":["theTableAdminSite"]
                        }
                    }
                }
            });
        },
        /**
         * 管理员添加站点
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
        */
        addSite: function(R,param){
            //添加站点
            /////////////////////翻译----网站名称////////////////////////
            var tpl = '<h2 id="functionTitle">'+LANG("添加网站")+'</h2>\
                <div id="showArea" class="theShowArea siteMane">\
                    <div class="node_form">\
                        <div class="node_add_stepone" style="top:60px;">\
                        <p><label for="Sites_sitename">'+LANG("网站名称")+'</label><input class="xlarge" placeholder="'+LANG("请输入网站名称")+'" id="Sites_sitename" type="text" maxlength="32" /><span class="error_message"></span></p>\
                        <p><label for="Sites_url">'+LANG("网站地址")+'</label><input class="xlarge" placeholder="'+LANG("请输入要添加的网站")+'" id="Sites_url" type="text" maxlength="256" /><span class="error_message"></span></p>\
                        <input class="btnGreen admin-btn" id="nextstep" type="button" value="'+LANG("保存")+'" style="margin-left:10px;" disabled />\
                        <input class="btnGray admin-btn" id="cancelStep" type="button" value="'+LANG("取消")+'" style="margin-left:10px;" />\
                    </div>\
                    <span class="error_message"></span>\
                </div>';            
            
            var params = param.split('/');          
            var sid = params[0];
            if(sid > 0) {
                $.getJSON('/admin/site?site_id=' + sid, function(data){
                    setHtml(R, tpl, "siteList", LANG("修改站点"), LANG('修改站点'));    
                    if (!data.success) return false;
                    var _site = data.result.items[0];
                    $('#Sites_sitename').val(_site.sitename);
                    $('#Sites_url').val(_site.url); 
//                  $('#Sites_url').attr("disabled", true);
                    init();
                });
            } else {
                setHtml(R, tpl, "addSite", LANG("添加站点"), LANG("添加站点"));
                init();             
            }
            

            function init() {
                $('#cancelStep').click(function(){
                    history.go(-1);
                });
                var urlInput = $('#Sites_url'),
                    urlTip = urlInput.next(),
                    nameInput = $('#Sites_sitename'),
                    nameTip = nameInput.next(),
                    go2Next = $('#nextstep'),
                    url = sid > 0 ? urlInput.val() : false,
                    name = sid > 0 ? nameInput.val() : false;

                // 网址检查
                urlInput.blur(function(){
                    var val = $.trim(this.value);
                    if(val === ""){
                        urlTip.text(LANG("网站地址不可为空白。"));
                        go2Next.attr("disabled", true);
                        url = false;
                        return;
                    }
                    if(val.indexOf(".") === -1){
                        urlTip.text(LANG("网站地址格式有误"));
                        go2Next.attr("disabled", true);
                        url = false;
                        return;
                    }
                    url = val;
                    urlTip.text("");
                    if(url && name){
                        go2Next.attr("disabled",false);
                    }
                }).keyup(function(){
                    if($.trim(this.value).indexOf(".")!==-1){
                        url = $.trim(this.value);
                        if(url && name){
                            go2Next.attr("disabled",false);
                        }
                    }
                    urlTip.text("");
                });
    
                // 网站名称检查
                nameInput.bind("blur",function(){
                    var val = $.trim(this.value);
                    if(val === ""){
                        nameTip.text(LANG("网站名称不可为空白。"));
                        go2Next.attr("disabled", true);
                        name = false;
                        return;
                    }
                    name = val;
                    nameTip.text("");
                    if(url && name){
                        go2Next.attr("disabled",false);
                    }
                }).bind("keyup",function(){
                    if($.trim(this.value) !== ""){
                        name = $.trim(this.value);
                        if(url && name){
                            go2Next.attr("disabled",false);
                        }
                    }
                    urlTip.text("");
                });
    
                go2Next.bind("click", function(){
                    var send = {sitename: name, url: url};
                    if(sid > 0) {
                        send = {site_id: sid, sitename: name, url: url};
                    }
                    $.getJSON('/site/ajaxeditsite', send).done(function(data){
                        if (data.error == '+OK'){
                            function cb(){
                                // 跳转到站点列表
                                Clicki.NavView.setDefaultActive(-1, "#/admin/siteList");
                            }
                            if(sid > 0) {
                                private_alert(LANG('修改成功'), cb);
                            } else {
                                private_alert(LANG('添加成功'), cb);
                            }
                        }else {
                            window.console && console.log(data.error);
                            $("#Sites_url").next().text(data.error.substr(data.error.indexOf(":")+1));
                        }
                    }).fail(function(){
                        private_alert(LANG("服务器正忙，请稍后再试"));
                    })
                });
            }
        },
        /**
         * 站点管理员列表
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
        */
        siteUserList: function(R,param){
            var params = param.split('/');
            var sid = params[0];
            var sitename = unescape(params[1]);
            var title = sitename + ' - '+LANG("网站管理员列表");
            var setTitle = LANG('网站的管理员列表');
            setHtml(
                R
                ,_tpls.pageList({"title":setTitle})
                , "siteList"
                , setTitle
                , title
            );

            $("#functionTitle").before('<a class="btnGreen admin-btn admin-new admin-right" href="#/admin/assignUser/'+sid+'/'+escape(sitename)+'">'+LANG("授权用户")+'</a>');

            Clicki.layout.destroy().add({
                "layout":{
                    "theTableAdminSite":{
                        "type":"grid",
                        "config":{
                            "url":"/admin/user"
                            ,"params":{
                                "page":1
                                ,"limit":10
                                ,"sid":sid
                            }
                            ,"caption":{
                                "email":{
                                    "desc":""
                                    ,"title":LANG("用户")
                                }
                                ,"last_time":{
                                    "desc":""
                                    ,"title":LANG("登陆信息")
                                }
                                ,"role":{
                                    "desc":""
                                    ,"title":LANG("权限")
                                }
                            }
                            ,"colModel":[
                                {                                   
                                    "tdCls":"theTextLeft"
                                    ,"data":"email"
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        return '<div class="theSiteName">'+_data.email+'</div>'
                                    }
                                }
                                ,{
                                    "data":"last_time"
                                    ,"tdCls":"theTextLeft"
                                    ,"cls":'admin-tab-left'
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        return '<p>'+LANG("计数：")+_data.count+'</p><p><strong>'+LANG("最近一次修改时间")+':</strong>'+_data.last_time+'</p>';
                                    }
                                }
                                ,{
                                    "data":"role"
                                    ,"tdCls":"theTextLeft"
                                    ,"cls":'admin-tab-left'
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        if(_data.level == 1) {
                                            return '<p><b style="color:#000; font-size:14px;">'+LANG("管理员")+'</b></p>';
                                        }
                                        if(_data.level == 2) {
                                            return '<p><b style="color:#000; font-size:14px;">'+LANG("超级")+'</b></p>';
                                        }
                                        var _site = null;
                                        if(_data.sites[0] != undefined) _site = _data.sites[0];
                                        var _data_authorize = '';
                                        return private_authorize_show(_site);                                       
                                    }
                                }
                                ,{
                                    text:LANG("操作"),
                                    data:null,
                                    tdCls:"siteCtrlTd",
                                    width: '120px',
                                    render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        if (_data.level == 1) return '<div style="text-align:center;color:#ccc;">'+LANG("修改权限")+' | '+LANG("取消授权")+'</div>';
                                        var param = [sid, _data.id, escape(sitename), escape(_data.email)].join('/');

                                        return '<p class="managOperating" key="'+_data.id+'"><a href="#/admin/userRoleEdit/' + param + '" title="'+LANG("修改权限")+'">'+LANG("修改权限")+'</a><a href="#" class="node_list_delIt">'+LANG("取消授权")+'</a></p>';
                                    }
                                }
                            ]
                            ,"target":"theTableAdminSite"
                            ,afterRender:function(mvc){
                                var gridtable = this.table;

                                $.each(gridtable.find(".gridContentBody:first tr"),function(i,n){
                                    var _tr = $(this);
                                    var data = mvc.Collection.getModelDataAt(i);
                                    if (!data || !data.keys || !data.keys.id) return;
                                    var _id = data.keys.id;
                                    _tr.children("td[nocompare!='1']").css("cursor","pointer").attr("data-key",_id);
                                });
                            }
                            ,callback:function(){                               

                                /*删除网站*/
                                $(".node_list_delIt").die('click').live("click", function(e){
                                    private_confirm(LANG("确认要删除么？"), function(){
                                        var $p = $(e.target).parents(":first");
                                        var _uid =  $p.attr("key");
                                        $.ajax({
                                            type:"GET",
                                            url:"/admin/usersitedelete?site_id="+ sid + '&user_id=' + _uid,
                                            dataType:"json",
                                            data:this.parm,
                                            success:function(data){
                                                if(data.success){
                                                    /*如果异步删除很麻烦了，有要更新grid ，又要更新左上角的弹出层，所以干脆直接刷页面算了*/
                                                    var $tbody = $p.parents("tbody");
                                                    var dt = $(e.target).parent().parent().parent().parent().find('td:first').find('div').html();
                                                    var d_url = dt.split('<br>')[1];
                                                    $p.parents("tr:first").remove();
                                                    $('#theClickPopListOutterBox > ol > li').each(function(i, value){
                                                        var poptext = value.innerHTML.split('</strong>')[1];
                                                        if (poptext == d_url) {
                                                            $(this).remove();
                                                        }
                                                    });
                                                    if ($('div#siteList').attr("key") == _uid){
                                                        //window.location.reload();
                                                        Clicki.layout.get('theTableAdminSite').refresh({data:{}});
                                                        //window.location.replace(location.href);
                                                    }
                                                    if($tbody.find("tr").length == 0){
                                                        //window.location.reload();
                                                        Clicki.layout.get('theTableAdminSite').refresh({data:{}});
                                                        //window.location.replace(location.href);
                                                    }
                                                    grid.refresh({"data":{}})
                                                }else{
                                                    private_alert(data.error);
                                                }
                                            },
                                           error:function(re){
                                               var errorTxt = re.responseText;
                                               errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
                                               errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));
                                                errorTxt = errorTxt.replace("<p>","");
                                               if (errorTxt) private_alert(errorTxt);
                                               else private_alert(LANG("服务器正忙，删除失败，请稍后再试"));
                                           }
                                        });
                                    });
                                    return false;
                                });
                            }
                        }
                    }
                    ,"theAdminSiteListSearcher":{
                        "type":"search",
                        "config":{
                            "id":$("#theAdminSiteListSearcher"),
                            "slave":["theTableAdminSite"]
                        }
                    }
                }
            });
        },
        /**
         * 管理员用户管理
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
         */
        userList:function(R,param){
            if(!cache.userlistURL){
                cache.userlistURL = "/admin/user";
            }
            var params = param.split('/');
            var admin_id = 0;
            var title = LANG("用户列表");
            var menu_li = "userList";
            if(params[0] == 'super') {
               admin_id = params[1];    
               title = LANG("管理员") + params[2] +    LANG("下级用户管理"); 
               menu_li = "userListSuper";
            }
            setHtml(
                R
                ,_tpls.pageList({"title":title,"sid":"theAdminUserListSearcher","id":"theTableAdminUser"})
                , menu_li
                , title
            );
            $("#theAdminUserListSearcher").append('<a class="btnGreen admin-btn admin-new" href="#/admin/addUser" style="float:right;">'+LANG("添加用户")+'</a>');
            var hasRoleId = cache.userlistURL.split('/')[2].search(/role_id=/);
            if(hasRoleId != -1){
                $("#theAdminUserListSearcher").append('<input id="returnUserList" class="btn_hui03 admin-btn" type="button" value="全部列表" style="margin-right:5px;float:right;">');
            }
            Clicki.layout.destroy().add({
                "layout":{
                    "theTableAdminUser":{
                        "type":"grid",
                        "config":{
                            "url":cache.userlistURL
                            ,"params":{
                                "page":1
                                ,"limit":10
                                ,"admin_id":admin_id
                            }
                            ,"caption":{
                                "user_name":{
                                    "desc":""
                                    ,"title":LANG("用户名")
                                }
                                ,"last_time":{
                                    "desc":""
                                    ,"title":LANG("登录信息")
                                }
                                ,"role":{
                                    "desc":""
                                    ,"title":LANG("用户角色")
                                }
                            }
                            ,"colModel":[
                                {
                                    "compare":false
                                    ,"tdCls":"theTextLeft"
                                    ,"cls":'admin-tab-left'
                                    ,"data":"user_name"
                                }
                                ,{
                                    "data":"last_time"
                                    ,"tdCls":"theTextLeft"
                                    ,"cls":'admin-tab-left'
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        return '<p><strong>'+LANG("添加时间")+':</strong>'+_data.create_time+'</p><p><strong>'+LANG("最近一次修改时间")+':</strong>'+_data.last_time+'</p>';
                                    }
                                }
                                ,{
                                    "data":"role"
                                    ,"tdCls":"theTextCenter"
                                    ,"cls":'admin-tab-center'
                                    /*,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row)
                                            ,htm = [];
                                        if(_data.restrict == 1) {
                                            htm.push('<b style="color:#F00;">'+LANG("[受限]")+'</b>');
                                        }                                       
                                        if(_data.level == 1) {                                      
                                            htm.push('<p><b style="color:#000; font-size:14px;">'+LANG("管理员")+'</b></p>');
                                        } else if(_data.level == 2) {
                                            htm.push('<p><b style="color:#000; font-size:14px;">'+LANG("超级")+'</b></p>');
                                        } else if(_data.level == 3) {
                                            htm.push('<p><b style="color:#000; font-size:14px;">'+LANG("系统管理")+'</b></p>');
                                        } else {
                                            _data = _data && _data.sites || [];
                                            for(var i = 0;i<_data.length;i++){
                                                htm.push(_data[i].url.replace(/^(http|https):\/\//g, '').replace(/\/$/g, ''));
                                            }
                                        }                                       
                                        return htm.join('<br />');
                                    }*/
                                }
                                ,{
                                    text:LANG("操作"),
                                    data:null,
                                    tdCls:"siteCtrlTd theTextCenter",
                                    "cls":'admin-tab-center',
                                    width:"140px",
                                    render:function(key,i,row){
                                        var data = this._getCollection().getModelDataAt(row);
                                        var html = '<p class="managOperating" key="'+data.id+'">';
                                        /*if (data.level != 1){
                                            html += '<a href="#/admin/userSiteList/'+ data.id + '/' + escape(data.email) +'" title="'+LANG("网站列表")+'">'+LANG("网站列表")+'</a>';
                                        }else {
                                            html += '<a style="color:#ccc;">'+LANG("网站列表")+'</a>';
                                        }*/
                                        html += '<a href="#/admin/editUser/'+data.id+'" class="node_list_updateIt theFirst" title="'+LANG("修改")+'">'+LANG("修改")+'</a>';
                                        html += '<a href="javascript:void(0);" class="node_list_delIt">'+LANG("删除")+'</a></p>';
                                        return html;
                                    }
                                }
                            ]
                            ,"target":"theTableAdminUser"
                            ,callback:function(){
                                $(".node_list_getCodeIt").die('click').live("click", function(e){
                                    var $p = $(e.target).parents(":first");
                                    var site_id =  $p.attr("key");
                                    Clicki.layout.destroy("siteArea").add("siteArea",{
                                        type:"getCode",
                                        config:{
                                            type:"site",
                                            model:{
                                                "datacontent":[
                                                    {"site_id":site_id}
                                                ]
                                            }
                                        }
                                    });
                                    return false;
                                });

                                /*删除网站*/
                                $(".node_list_delIt").die('click').live("click", function(e){
                                    private_confirm(LANG("确认要删除么？"), function(){
                                        var $p = $(e.target).parents(":first");
                                        var rid =  $p.attr("key");
                                        $.ajax({
                                            type:"GET",
                                            url:"/admin/userdelete?uid="+ rid,
                                            dataType:"json",
                                            data:this.parm,
                                            success:function(data){
                                                if(data.success){
                                                    /*如果异步删除很麻烦了，有要更新grid ，又要更新左上角的弹出层，所以干脆直接刷页面算了*/
                                                    /*var $tbody = $p.parents("tbody");
                                                    var dt = $(e.target).parent().parent().parent().parent().find('td:first').find('div').html();
                                                    var d_url = dt.split('<br>')[1];
                                                    $p.parents("tr:first").remove();
                                                    $('#theClickPopListOutterBox > ol > li').each(function(i, value){
                                                        var poptext = value.innerHTML.split('</strong>')[1];
                                                        if (poptext == d_url) {
                                                            $(this).remove();
                                                        }
                                                    });*/
                                                    //window.location.reload();
                                                    Clicki.layout.get('theTableAdminUser').refresh({data:{}});
                                                    //grid.refresh({"data":{}})
                                                }else{
                                                    private_alert(data.message);
                                                }
                                            },
                                           error:function(re){
                                               /*var errorTxt = re.responseText;
                                               errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
                                               errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));
                                                errorTxt = errorTxt.replace("<p>","");
                                               if (errorTxt) private_alert(errorTxt);
                                               else */
                                               private_alert(LANG("服务器正忙，删除失败，请稍后再试"));
                                           }
                                        });
                                    });
                                    return false;
                                });
                            }
                        }
                    }
                    ,"theAdminUserListSearcher":{
                        "type":"search",
                        "config":{
                            "id":$("#theAdminUserListSearcher"),
                            "slave":["theTableAdminUser"]
                        }
                    }
                }
            });
            cache.userlistURL = null;
            $('#returnUserList').die('click').live('click', function(event) {
                window.location.reload();
            });
        },  
        /**
         * 管理员客户列表管理
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
         */
        userListSuper:function(R,param){
            var params = param.split('/');          
            var is_super = params[0];           
            setHtml(
                R
                ,_tpls.pageList({"title":LANG("客户列表"),"sid":"theAdminUserListSearcher","id":"theTableAdminUser"})
                , "userListSuper"
                , LANG("客户列表")
            );
            $("#theAdminUserListSearcher").append('<a class="btnGreen admin-btn admin-new" href="#/admin/addUserSuper" style="float:right;">'+LANG("添加客户")+'</a>');
            Clicki.layout.destroy().add({
                "layout":{
                    "theTableAdminUser":{
                        "type":"grid",
                        "config":{
                            "url":"/admin/user"
                            ,"params":{
                                "page":1
                                ,"limit":10
                                ,"is_super":1
                            }
                            ,"caption":{
                                "email":{
                                    "desc":""
                                    ,"title":LANG("邮箱")
                                }
                                ,"last_time":{
                                    "desc":""
                                    ,"title":LANG("登录信息")
                                }
                                ,"sites":{
                                    "desc":""
                                    ,"title":LANG("授权网站")
                                }
                            }
                            ,"colModel":[
                                {
                                    "compare":false
                                    ,"tdCls":"theTextLeft"
                                    ,"data":"email"
                                }
                                ,{
                                    "data":"last_time"
                                    ,"tdCls":"theTextLeft"
                                    ,"cls":'admin-tab-left'
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        return '<p><strong>'+LANG("添加时间")+':</strong>'+_data.create_time+'</p><p><strong>'+LANG("最近一次修改时间")+':</strong>'+_data.last_time+'</p>';
                                    }
                                }
                                ,{
                                    "data":"sites"
                                    ,"tdCls":"theTextLeft"
                                    ,"cls":'admin-tab-left'
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row)
                                            ,htm = [];
                                        if(_data.level == 1) return '<p><b style="color:#000; font-size:14px;">'+LANG("管理员")+'</b></p>';
                                        if(_data.level == 2) return '<p><b style="color:#000; font-size:14px;">'+LANG("超级")+'</b></p>'
                                        _data = _data && _data.sites || [];
                                        for(var i = 0;i<_data.length;i++){
                                            htm.push(_data[i].url.replace(/^(http|https):\/\//g, '').replace(/\/$/g, ''));
                                        }
                                        return htm.join('<br />');
                                    }
                                }
                                ,{
                                    text:LANG("操作"),
                                    data:null,
                                    tdCls:"siteCtrlTd",
                                    width:"140px",
                                    render:function(key,i,row){
                                        var data = this._getCollection().getModelDataAt(row);
                                        var html = '<p class="managOperating" key="'+data.id+'">';
                                        html += '<a href="#/admin/userSiteList/'+ data.id + '/' + escape(data.email) +'" title="'+LANG("网站列表")+'">'+LANG("网站列表")+'</a>';
                                        if( data.level == 1 && data.id == data.top_uid ) {
                                            html += '<a href="#/admin/site/super/'+ data.id +'/'+ data.email +'">'+LANG("关联网站")+'</a>';
                                            html += '<a href="#/admin/user/super/'+ data.id +'/'+ data.email +'">'+LANG("查看用户")+'</a>';
                                            if(data.restrict == 1) {
                                                html += '<a href="javascript:void(0);" class="node_list_unrestrict">'+LANG("取消限制")+'</a>';
                                            } else {
                                                html += '<a href="javascript:void(0);" class="node_list_restrict">'+LANG("限制客户")+'</a>';
                                            }
                                        }                                                                       
                                        
                                        return html;
                                    }
                                }
                            ]
                            ,"target":"theTableAdminUser"
                            ,callback:function(){
                                $(".node_list_getCodeIt").die('click').live("click", function(e){
                                    var $p = $(e.target).parents(":first");
                                    var site_id =  $p.attr("key");
                                    Clicki.layout.destroy("siteArea").add("siteArea",{
                                        type:"getCode",
                                        config:{
                                            type:"site",
                                            model:{
                                                "datacontent":[
                                                    {"site_id":site_id}
                                                ]
                                            }
                                        }
                                    });
                                    return false;
                                });
                                /*限制客户用户*/
                                $(".node_list_restrict").die('click').live("click", function(e){
                                    private_confirm(LANG("限制客户后，客户以及客户的下属将只能查看网站，不能再管理网站，确认限制吗？"), function(){
                                        var $p = $(e.target).parents(":first");
                                        var uid =  $p.attr("key");                                                                      
                                        $.ajax({
                                            type:"GET",
                                            url:"/admin/userrestrictedit?grant=1&uid="+uid,
                                            dataType:"json",
                                            data:this.parm,
                                            success:function(data){
                                                if(data.success){                                                   
                                                    $p.find('a.node_list_restrict').remove();
                                                    $p.append('<a href="javascript:void(0);" class="node_list_unrestrict">'+LANG("取消限制")+'</a>');                                                       
                                                    private_alert(LANG("限制成功"));
                                                }else{
                                                    private_alert(data.error);
                                                }
                                            },
                                           error:function(re){
                                              private_alert(LANG("服务器正忙，删除失败，请稍后再试"));
                                           }
                                        });
                                    });
                                    return false;
                                });
                                /*取消限制客户用户*/
                                $(".node_list_unrestrict").die('click').live("click", function(e){
                                    private_confirm(LANG("取消限制后，客户以及客户的下属都将恢复原来权限，确认取消吗？"), function(){
                                        var $p = $(e.target).parents(":first");
                                        var uid =  $p.attr("key");                                                                      
                                        $.ajax({
                                            type:"GET",
                                            url:"/admin/userrestrictedit?grant=0&uid="+uid,
                                            dataType:"json",
                                            data:this.parm,
                                            success:function(data){
                                                if(data.success){                                                   
                                                    $p.find('a.node_list_unrestrict').remove();
                                                    $p.append('<a href="javascript:void(0);" class="node_list_restrict">'+LANG("限制客户")+'</a>');                                                 
                                                    private_alert(LANG("取消限制成功"));
                                                }else{
                                                    private_alert(data.error);
                                                }
                                            },
                                           error:function(re){
                                              private_alert(LANG("服务器正忙，删除失败，请稍后再试"));
                                           }
                                        });
                                    });
                                    return false;
                                });
                            }
                        }
                    }
                    ,"theAdminUserListSearcher":{
                        "type":"search",
                        "config":{
                            "id":$("#theAdminUserListSearcher"),
                            "slave":["theTableAdminUser"]
                        }
                    }
                }
            });
        },
        /**
         * 管理员用户管理
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
         */
        userListSubordinate:function(R,param){
            var params = param.split('/');          
            var is_super = params[0];           
            setHtml(
                R
                ,_tpls.pageList({"title":LANG("系统管理列表"),"sid":"theAdminUserListSearcher","id":"theTableAdminUser"})
                , "userListSubordinate"
                , LANG("系统管理列表")
            );
            $("#theAdminUserListSearcher").append('<a class="btnGreen admin-btn admin-new" href="#/admin/addUserSuper/subordinate" style="float:right;">'+LANG("添加系统管理")+'</a>');
            Clicki.layout.destroy().add({
                "layout":{
                    "theTableAdminUser":{
                        "type":"grid",
                        "config":{
                            "url":"/admin/user"
                            ,"params":{
                                "page":1
                                ,"limit":10
                                ,"subordinate":1
                            }
                            ,"caption":{
                                "email":{
                                    "desc":""
                                    ,"title":LANG("邮箱")
                                }
                                ,"last_time":{
                                    "desc":""
                                    ,"title":LANG("登录信息")
                                }
                                ,"sites":{
                                    "desc":""
                                    ,"title":LANG("是否授权")
                                }
                            }
                            ,"colModel":[
                                {
                                    "compare":false
                                    ,"tdCls":"theTextLeft"
                                    ,"data":"email"
                                }
                                ,{
                                    "data":"last_time"
                                    ,"tdCls":"theTextLeft"
                                    ,"cls":'admin-tab-left'
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        return '<p><strong>'+LANG("添加时间")+':</strong>'+_data.create_time+'</p><p><strong>'+LANG("最近一次修改时间")+':</strong>'+_data.last_time+'</p>';
                                    }
                                }
                                ,{
                                    "data":"sites"
                                    ,"tdCls":"theTextLeft"
                                    ,"cls":'admin-tab-left'
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        if(_data.level != 3 && _data.level != 2) return '<p><b>'+LANG("未授权")+'</b></p>';
                                        if(_data.level == 2) return '<p>'+LANG("超级管理员")+'</p>'
                                        return '<p>'+LANG("所有网站：系统默认角色")+'</p>';
                                        
                                    }
                                }
                                ,{
                                    text:LANG("操作"),
                                    data:null,
                                    tdCls:"siteCtrlTd",
                                    width:"140px",
                                    render:function(key,i,row){
                                        var data = this._getCollection().getModelDataAt(row);
                                        var html = '<p class="managOperating" key="'+data.id+'">';                                      
                                        if( data.level != 3 && data.level != 2) {
                                            html += '<a href="javascript:void(0);" class="node_list_sub">'+LANG("授权系统管理")+'</a>';                                           
                                        } else {
                                            if(data.level == 2) {
                                                html += '<span style="color:#ccc;">'+LANG("取消授权系统管理")+'</span>';                                            
                                            } else {
                                                html += '<a href="javascript:void(0);" class="node_list_cancelsub">'+LANG("取消授权系统管理")+'</a>';
                                            }
                                            
                                        }
                                        html += '</p>';
                                        return html;
                                    }
                                }
                            ]
                            ,"target":"theTableAdminUser"
                            ,callback:function(){
                                
                                /*授权subordinate用户*/
                                $(".node_list_sub").die('click').live("click", function(e){
                                    private_confirm(LANG("确认要授权系统管理么？"), function(){
                                        var $p = $(e.target).parents(":first");
                                        var uid =  $p.attr("key");                                                                      
                                        $.ajax({
                                            type:"GET",
                                            url:"/admin/usersubordinateedit?grant=1&uid="+uid,
                                            dataType:"json",
                                            data:this.parm,
                                            success:function(data){
                                                if(data.success){                                                   
                                                    $p.find('a.node_list_sub').remove();
                                                    $p.append('<a href=javascript:void(0); class="node_list_cancelsub" key="' + uid + '">'+LANG("取消授权系统管理")+'</a>');
                                                    $p.parent().parent().prev().children(0).html('<p>'+LANG("所有网站：系统默认角色")+'</p>');
                                                    private_alert(LANG("授权成功"));
                                                }else{
                                                    private_alert(data.error);
                                                }
                                            },
                                           error:function(re){
                                              private_alert(LANG("服务器正忙，删除失败，请稍后再试"));
                                           }
                                        });
                                    });
                                    return false;
                                });
                                /*取消授权subordinate用户*/
                                $(".node_list_cancelsub").die('click').live("click", function(e){
                                    private_confirm(LANG("确认要取消授权系统管理么？"), function(){
                                        var $p = $(e.target).parents(":first");                                     
                                        var uid = $p.attr("key");
                                        $.ajax({
                                            type:"GET",
                                            url:"/admin/usersubordinateedit?grant=0&uid="+uid,
                                            dataType:"json",
                                            data:this.parm,
                                            success:function(data){
                                                if(data.success){                                                   
                                                    $p.find('a.node_list_cancelsub').remove();
                                                    $p.append('<a href=javascript:void(0); class="node_list_sub" key="' + uid + '">'+LANG("授权系统管理")+'</a>');                                                    
                                                    $p.parent().parent().prev().children(0).html('<p><b>'+LANG("未授权")+'</b></p>');                      
                                                    private_alert(LANG("取消授权成功"));
                                                }else{
                                                    private_alert(data.error);
                                                }
                                            },
                                           error:function(re){
                                              private_alert(LANG("服务器正忙，删除失败，请稍后再试"));
                                           }
                                        });
                                    });
                                    return false;
                                });
                            }
                        }
                    }
                    ,"theAdminUserListSearcher":{
                        "type":"search",
                        "config":{
                            "id":$("#theAdminUserListSearcher"),
                            "slave":["theTableAdminUser"]
                        }
                    }
                }
            });
        },      
        /**
         * 管理员的站点列表
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
        */
        userSiteList: function(R,param){
            var params = param.split('/');
            var uid = params[0];
            var email = unescape(params[1]);
            var title = '"' + email + '"'+LANG("用户的网站列表");
            setHtml(
                R
                ,_tpls.pageList({"title":title})
                , "userList"
                , LANG('用户网站列表')
                , title
            );
            var p = [uid, escape(email)].join('/');
            $("#theAdminSiteListSearcher").append('<a class="btnGreen admin-btn admin-new" href="#/admin/assignSite/' + p + '" style="float:right;">'+LANG("授权网站")+'</a>');
            Clicki.layout.destroy().add({
                "layout":{
                    "theTableAdminSite":{
                        "type":"grid",
                        "config":{
                            "url":"/admin/site"
                            ,"params":{
                                "page":1
                                ,"limit":10
                                ,"uid":uid
                            }
                            ,"caption":{
                                "sitename":{
                                    "desc":""
                                    ,"title":LANG("网站")
                                }
                                ,"role_id":{
                                    "desc":""
                                    ,"title":LANG("权限")
                                }
                            }
                            ,"colModel":[
                                {                                   
                                    "tdCls":"theTextLeft"
                                    ,"data":"sitename"
                                    ,width: '300px'
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        return '<div class="theSiteName">'+_data.sitename+'</div><div class="theSiteUrl"><a href="'+_data.url+'" target="_blank" title="'+_data.url+'">'+_data.url.replace(/(http:\/\/)||(https:\/\/)/g,"")+'</a></div>'
                                    }
                                }
                                ,{
                                    "data":"role_id"
                                    ,"tdCls":"theTextLeft"
                                    ,"cls":'admin-tab-left'
                                    ,render:function(key,i,row){
                                        var _site = this._getCollection().getModelDataAt(row);
                                        if(_site.level == 1) {
                                            return '<p><b style="color:#000; font-size:14px;">'+LANG("管理员")+'</b></p>';
                                        }
                                        return private_authorize_show(_site);
                                    }
                                }
                                ,{
                                    text:LANG("操作"),
                                    data:null,
                                    tdCls:"siteCtrlTd",
                                    width:'120px',
                                    render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row)
                                        var _sid = _data.id;
                                        var _sitename = _data.sitename;
                                        return '<p class="managOperating" key="'+_sid+'"><a href="#/admin/userRoleEdit/' + _sid + '/'+ uid + '/' + escape(_sitename) + '/' + escape(email) +'" title="'+LANG("修改权限")+'">'+LANG("修改权限")+'</a><a href="#" class="node_list_delIt">'+LANG("取消授权")+'</a></p>';
                                    }
                                }
                            ]
                            ,"target":"theTableAdminSite"
                            ,afterRender:function(mvc){
                                var gridtable = this.table;

                                $.each(gridtable.find(".gridContentBody:first tr"),function(i,n){
                                    var _tr = $(this);
                                    var data = mvc.Collection.getModelDataAt(i);
                                    if (!data || !data.keys || !data.keys.id) return;
                                    var _id = data.keys.id;
                                    _tr.children("td[nocompare!='1']").css("cursor","pointer").attr("data-key",_id);
                                });                             
                            }
                            ,callback:function(){                               

                                /*删除网站*/
                                $(".node_list_delIt").die('click').live("click", function(e){
                                    private_confirm(LANG("确认要删除么？"), function(){
                                        var $p = $(e.target).parents(":first");
                                        var sid =  $p.attr("key");
                                        $.ajax({
                                            type:"GET",
                                            url:"/admin/usersitedelete?site_id="+ sid + '&user_id=' + uid,
                                            dataType:"json",
                                            data:this.parm,
                                            success:function(data){
                                                if(data.success){
                                                    /*如果异步删除很麻烦了，有要更新grid ，又要更新左上角的弹出层，所以干脆直接刷页面算了*/
                                                    var $tbody = $p.parents("tbody");
                                                    var dt = $(e.target).parent().parent().parent().parent().find('td:first').find('div').html();
                                                    var d_url = dt.split('<br>')[1];
                                                    $p.parents("tr:first").remove();
                                                    $('#theClickPopListOutterBox > ol > li').each(function(i, value){
                                                        var poptext = value.innerHTML.split('</strong>')[1];
                                                        if (poptext == d_url) {
                                                            $(this).remove();
                                                        }
                                                    });
                                                    grid.refresh({"data":{}})
                                                }else{
                                                    private_alert(data.error);
                                                }
                                            },
                                           error:function(re){
                                               var errorTxt = re.responseText;
                                               errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
                                               errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));
                                                errorTxt = errorTxt.replace("<p>","");
                                               if (errorTxt) private_alert(errorTxt);
                                               else private_alert(LANG("服务器正忙，删除失败，请稍后再试"));
                                           }
                                        });
                                    });
                                    return false;
                                });                             
                            }
                        }
                    }
                    ,"theAdminSiteListSearcher":{
                        "type":"search",
                        "config":{
                            "id":$("#theAdminSiteListSearcher"),
                            "slave":["theTableAdminSite"]
                        }
                    }
                }
            });
        },
        /**
         * 授权网站管理员
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
         */
        assignSite:function(R, param){
            var tpl = '<h2 id="functionTitle">'+LANG("授权网站")+'</h2>\
                <div class="admin_form">\
                    <div class="error_message"></div>\
                    <div class="userRight" style="padding-left:0px; margin-left:-20px;">\
                        <div id="userRightList"></div>\
                        <a class="btnGray admin-btn admin-new" id="adminNewRight"><i></i>'+LANG("添加网站")+'</a>\
                        <div id="userRightListMask"></div>\
                    </div>\
                    <input class="btnGreen admin-btn" id="adminAddSite" type="button" value="'+LANG(" 确 定 ")+'" />\
                    <input class="btnGray admin-btn" id="adminCancel" type="button" value="'+LANG(" 取 消 ")+'" />\
                </div>';

            param = param.split('/');
            var user_id = param[0];
            var user_name = unescape(param[1]);
            var list_uri = "#/admin/userSiteList/"+user_id+"/"+param[1];

            if (param.length == 4){
                cache.role_id = param[2];
            }else {
                cache.role_id = 0;
            }

            setHtml(
                R
                , tpl
                , "siteList"
                , LANG("授权网站")
                , LANG("给用户 ") + user_name + " - "+LANG("授权网站权限")
            );


            cache.rights = []; // 临时站点权限
            var wait = 2;
            
            // 获取可选的网站列表
            $.getJSON('/admin/site', {no_uid: user_id}, function(rdata){
                if (!rdata.success) return false; // 拉取数据失败
                wait--;
                cache.sites = rdata.result.items;
                if (wait == 0) private_newSiteRightItem({data:'assignSite'});
            });

            // 拉取角色列表与整站权限列表
            $.getJSON('/admin/role', {authorize: cache.authorize ? 0 : 1}, function(rdata){
                if (!rdata.success) return false;
                wait--;
                if (rdata.result.authorize) cache.authorize = rdata.result.authorize;
                cache.roles = rdata.result.items;
                if (wait == 0) private_newSiteRightItem({data:'assignSite'});
            });

            var error_box = $('.admin_form>.error_message');

            $('#adminNewRight').click('assignSite', private_newSiteRightItem);
            $('#adminCancel').click(function(){
                Clicki.NavView.setDefaultActive(-1, list_uri);
            })
            $('#adminAddSite').click(function(){
                var rights = cache.rights;
                var err = '';
                var ids = [];
                var data = [];

                // 更新网站权限
                $('#userRightList > .right-list-item').each(function(index, item){
                    item = $(item);
                    var index = item.attr('data-index');
                    var id = item.find('.adminSiteList').val();

                    if (id > 0){
                        if (_.contains(ids, id)){
                            err = '<li>'+LANG("网站重复分配! 每一个网站只能分配一个角色和权限.")+'</li>';
                            item.find('.adminSiteList').addClass('admin_error');
                        }
                        ids.push(id);
                        data.push({
                            uid: user_id,
                            site_id: id,
                            role_id: item.find('.roleList').val(),
                            custom: rights[index].custom
                        });
                    }
                });
                if (data.length == 0){
                    err += '<li>'+LANG("请先选择一个网站并指定其角色")+'</li>';
                }

                if (err != ''){
                    error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                    error_box.delay(10000).slideUp(function(){
                        $('#userRightList .admin_error').removeClass('admin_error');
                    });
                }else {
                    error_box.hide();
                    // 提交数据
                    private_save('/admin/usersiteedit', {rights: JSON.stringify(data)}, list_uri);
                }
            });
        },
        /**
         * 用户权限管理
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
         */
        userRoleEdit:function(R,param) {
            var params = param.split('/');          
            var sid = parseInt(params[0]);
            var uid = parseInt(params[1]);  
            var sitename = unescape(params[2]);
            var email = unescape(params[3]);
            
            var title = LANG("修改用户")+'"' + email + '"'+LANG("在网站")+'"' + sitename + '"'+LANG("拥有的权限");
            var tpl = '<h2 id="functionTitle">'+LANG("修改权限")+'</h2>\
                <div class="admin_form" id="adminRoleForm">\
                    <div class="error_message"></div>\
                    <p>\
                    <label style="float:left;">'+LANG("角色")+'</label>\
                    <select id="adminRoleList" style="margin-left:15px;"></select>\
                    </p>\
                    <div>\
                        <label style="float:left;">'+LANG("权限")+'</label>\
                        <div id="adminRoleRight"></div>\
                        <a class="btnGray admin-btn adminRoleHeightCtrl"><i>'+LANG("展开")+'</i></a>\
                    </div>\
                    <div style="clear:both; padding-top:10px;">\
                    <input class="btnGreen admin-btn" id="adminUserRoleEdit" type="button" value="'+LANG(" 确 定 ")+'" />\
                    <input class="btnGray admin-btn" id="adminCancelUserRoleEdit" type="button" value="'+LANG(" 取 消 ")+'" />\
                    </div>\
                </div>';

            setHtml(R, tpl, "siteList", LANG('修改用户网站权限'), title);

            var tab = null;
            var wait = 2;
            var user = {
                user_id: uid,
                site_id: sid,
                role_id: 0,
                authorize: []
            }

            function init(){
                if (!tab){
                    tab = private_buildRightTable($('#adminRoleRight'));
                    var sel = $('#adminRoleList');
                    _.each(cache.roles, function(role, name){
                        var opt = $('<option></option>');
                        opt.attr('value', role.id);
                        opt.text(role.name);
                        if (role.id == user.role_id) opt.prop('selected', true);
                        sel.append(opt);
                    });
                    $('.adminRoleHeightCtrl').click(private_toggleRightTable);
                }
                var role_right = '';
                _.find(cache.roles, function(r){
                    if (r.id == user.role_id){
                        role_right = r.authlist;
                        return true;
                    }
                    return false;
                });

                cache.temp = user.authorize;
                private_updateRightTable(tab, role_right, user.authorize);
            }

            // 拉取角色列表与整站权限列表
            $.getJSON('/admin/role?authorize=' + (cache.authorize ? 0 : 1) , function(data){
                if (!data.success) return false;
                wait--;
                if (data.result.authorize) cache.authorize = data.result.authorize;
                cache.roles = data.result.items;                
                if(wait == 0) init();
            });
            
            // 拉取用户角色
            $.getJSON('/admin/usersite?site_id=' + sid + '&user_id=' + uid , function(data){
                if (!data.success) return false;                    
                wait--;
                if(data.result.items && data.result.items.length > 0) {
                    var u = data.result.items[0];
                    user.authorize = u.authorize.split(',');
                    user.role_id = u.role_id;
                }
                if(wait == 0) init();
            });
    

            // 绑定操作事件
            var error_box = $('.admin_form .error_message:first');
            $('#adminRoleList').change(function(){
                user.role_id = $(this).val();
                init();
            });
            $('#adminUserRoleEdit').click(function(){
                user.authorize = [];
                $('#adminRoleRight td.has_remove').each(function(index, td){
                    user.authorize.push($(td).attr('data-id'));
                })
                user.authorize = user.authorize.toString();
                // 提交数据
                private_save('/admin/roleuseredit', user, function(){
                    // 清除缓存
                    cache.roles = null;
                    history.go(-1);
                });
            })
            $('#adminCancelUserRoleEdit').click(function(){
                history.go(-1);
            })
        },
        
        /**
         * 管理员添加用户
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
         */
        addUser:function(R, param){

            /*var tpl = '<h2 id="functionTitle">'+LANG("添加用户")+'</h2>\
                <div class="admin_form">\
                    <div class="error_message"></div>\
                    <p>\
                        <label for="adminUserEmail">'+LANG("邮箱")+'</label>\
                        <input placeholder="'+LANG("请输入一个邮箱地址作为用户名")+'" id="adminUserEmail" type="text" maxlength="32" />\
                    </p>\
                    <p>\
                        <label for="adminUserPass">'+LANG("密码")+'</label>\
                        <input placeholder="'+LANG("输入用户的登录密码")+'" id="adminUserPass" type="password" maxlength="256" />\
                        <span class="info_message">'+LANG("密码长度不小于8位，且同时包含大写字母、小写字母、数字和特殊字符四类要素中的任意三种")+'</span>\
                    </p>\
                    <div class="userRight">\
                        <strong>'+LANG("用户权限")+'</strong>\
                        <label for="grantSuperUser">'+LANG("授予管理员权限")+'</label>\
                        <input type="checkbox" id="grantSuperUser">\
                        <div id="SuperUserNote">'+LANG("顶端导航将增加“管理后台”通道，进入后可以管理角色，并拥有所有网站的数据管理权限查询、业务管理权限和系统管理权限。")+'</div>\
                        <label>'+LANG("用户网站权限")+'</label>\
                        <div id="userRightList"></div>\
                        <a class="btnGray admin-btn admin-new" id="adminNewRight"><i></i>'+LANG("增加网站权限")+'</a>\
                        <div id="userRightListMask"></div>\
                    </div>\
                    <input class="btnGreen admin-btn" id="adminAddUser" type="button" value="'+LANG(" 确 定 ")+'" />\
                    <input class="btnGray admin-btn" id="adminCancelUser" type="button" value="'+LANG(" 取 消 ")+'" />\
                </div>';*/
                
                var tpl = '<h2 id="functionTitle"></h2>\
                <div class="admin_form">\
                    <div class="error_message"></div>\
                    <p>\
                        <label for="adminUserName">'+LANG("用户名")+'</label>\
                        <input placeholder="'+LANG("请输入用户名")+'" id="adminUserName" type="text"  maxlength="20" />\
                    </p>\
                    <p>\
                        <label for="adminUserEmail">'+LANG("邮&nbsp;&nbsp;&nbsp;箱")+'</label>\
                        <input placeholder="'+LANG("请输入邮箱")+'" id="adminUserEmail" type="text" maxlength="32" />\
                    </p>\
                    <p>\
                        <label for="adminUserPass">'+LANG("密&nbsp;&nbsp;&nbsp;码")+'</label>\
                        <input placeholder="'+LANG("输入用户的登录密码")+'" id="adminUserPass" type="password" maxlength="256" />\
                        <span class="info_message">'+LANG("密码长度不小于8位，且同时包含大写字母、小写字母、数字和特殊字符四类要素中的任意三种")+'</span>\
                    </p>\
                    <div class="userRight">\
                        <strong>'+LANG("用户权限")+'</strong>\
                        <div id="userRightList"></div>\
                        <div id="userRightListMask"></div>\
                    </div>\
                    <input class="btn_lan02 admin-btn" id="adminAddUser" type="button" value="'+LANG(" 确 定 ")+'" />\
                    <input class="btn_hui02 admin-btn" id="adminCancelUser" type="button" value="'+LANG(" 取 消 ")+'" />\
                </div>';
                
                

            var data = {
                uid:param,
                name:"",
                email: '',
                pass: '',
                admin: 0,
                rights: [] // 网站权限列表
            }
            cache.rights = []; // 临时站点权限
            
            var title = LANG("添加用户");
            var menu_li = "addUser";
            if(data.uid > 0) {
                title = LANG("编辑用户");   
                menu_li = "userList";
            }
            
            setHtml(R, tpl, menu_li, title, title);
            $(".G-showArea h2").text(title);
            if($('#adminNav').text() == '超级管理后台') {                 
                $('div.userRight').hide();
            }
            
            function renderPage(){
                if (data.uid){
                    // 设置原用户资料                      
                    _.each(data.rights, function(right){
                        //console.dir(data.rights)
                        private_newSiteRightItem(null, right);
                    });
                    //$('#adminUserEmail').val(data.email).prop({disabled:false, readonly:true});
                    $('#adminUserName').val(data.name).prop({disabled:true, readonly:true});
                    $('#adminUserEmail').val(data.email).prop({disabled:false, readonly:false});
                    //$('.info_message').after('<div style="position:absolute; left:330px; top:160px;">'+LANG("密码不修改可留空")+'</div>');
                    if (data.admin){
                        $('#grantSuperUser').prop("checked", true);
                        $('#userRightListMask').height($('.userRight:first').height() - 80).show();
                    }
                }else {
                    private_newSiteRightItem();
                }
            }
            
            var wait = 2;
            
            // 编辑用户
            if (param != 0){
                wait++;
                $.getJSON('/admin/user?condition=id|' + param, function(rdata){
                    if (!rdata.success) return false;
                    wait--;
                    rdata = rdata.result.items[0];              
                    if(rdata != undefined) {
                        data.email = rdata.email;
                        data.name = rdata.user_name;
                        //cache.roles = rdata.sites;
                        _.each(rdata.sites, function(site,name){
                            var right = {site_id:0,role_id:0,custom:[]};
                            right.site_id = site.id;
                            right.role_id = site.role.id || 0;
                            right.custom = _.map(site.authorize || [], function(auth) { return auth.id; });
                            data.rights.push(right);
                        });
                        data.admin = rdata.level == 1 ? 1 : 0;
                    }
                    //data = data.user;
                    if (wait == 0) renderPage();
                })
            }
            
            // 拉取站点列表           
            $.getJSON('/site/ajaxgetsites', function(rdata){
                //alert(JSON.stringify(rdata))//json转换成字符串
                if (!rdata.success) return false; // 拉取数据失败
                wait--;
                cache.sites = rdata.result.items;
                if (wait == 0) renderPage();
            });
            // 拉取角色列表与整站权限列表
            $.getJSON('/admin/role?authorize=' + (cache.authorize ? 0 : 1), function(rdata){
                if (!rdata.success) return false;
                wait--;
                if (rdata.result.authorize) cache.authorize = rdata.result.authorize;
                cache.roles = rdata.result.items;
                if (wait == 0) renderPage();
            });
            var error_box = $('.admin_form>.error_message');

            $('#grantSuperUser').click(function(){
                if ($(this).prop('checked')){
                    $('#userRightListMask').height($('.userRight:first').height() - 80).show();
                    data.admin = 1;
                }else {
                    $('#userRightListMask').hide();
                    data.admin = 0;
                }
            })
            $('#adminNewRight').click(private_newSiteRightItem);
            $('#adminCancelUser').click(function(){
                Clicki.NavView.setDefaultActive(-1, "#/admin/userList");
            });
            $('#adminAddUser').click(function(){
                //console.dir(data)
                data.name = $('#adminUserName').val();
                data.email = $('#adminUserEmail').val();
                data.pass = $('#adminUserPass').val();

                //var rights = cache.rights;
                var err = '';
                
                var type = 0;
                if (data.name.length<4 || data.name.length>20) type++;
                if(data.name.match(/[^a-zA-Z0-9\_\.\-]/)) type++;
                if (type>0){
                    err += '<li>'+LANG("请输入4-20位字符的用户名，可以包括下划线、数字、大小写字母")+'</li>';
                };
                
                
                if (!/^[a-zA-Z0-9][a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9]{2,4})+$/.test(data.email)){
                    err += '<li>'+LANG("请输入一个有效的Email。")+'</li>';
                }

                if (data.uid == 0 || data.pass.length){
                    // 新建用户或者输入了密码时检查密码
                    if (data.pass.length < 8){
                        err += '<li>'+LANG("密码长度不能小于8位。")+'</li>';
                    }
                    if (data.pass != '' && data.pass == data.email){
                        err += '<li>'+LANG("密码不能与用户账号相同。")+'</li>'; 
                    }
                    
                    type = 0;
                    if (/[a-z]/.test(data.pass)) type++;
                    if (/[A-Z]/.test(data.pass)) type++;
                    if (/[0-9]/.test(data.pass)) type++;
                    if (/[^a-zA-Z0-9]/.test(data.pass)) type++;
                    if (type < 3){
                        err += '<li>'+LANG("密码必须同时包含大写字母、小写字母、数字和特殊字符四类要素中的任意三种。")+'</li>';
                    }
                }

                // 更新网站权限
                /*if (!data.admin){
                    var ids = [];
                    var list_error = false;
                    var all_sites_set = false;              
                    var all_sites_info = {role_id:0,custom:[]};

                    $('#userRightList .right-list-item').each(function(index, item){
                        item = $(item);
                        var index = item.attr('data-index');
                        var id = item.find('.adminSiteList').val();
                        
                        if (_.contains(ids, id)){
                            if (!list_error) err += '<li>'+LANG("网站重复分配! 每一个用户只能分配一个网站角色权限.")+'</li>';
                            item.find('.adminUserList').addClass('admin_error');
                            list_error = true;
                        }else {
                            ids.push(id);
                            //rights[index].site_id = id;
                            rights[index].role_id = item.find('.roleList').val();

                            if(id == 0) {
                                all_sites_set = true;
                                all_sites_info.role_id = rights[index].role_id;
                                all_sites_info.custom = rights[index].custom;
                            }
                        }
                    });
                    //当用户选择了所有网站时
                    //if(!list_error && all_sites_set) {
                        rights = [];            
                        _.each(cache.sites,function(site,name){                         
                            var right = {site_id:0,role_id:0,custom:[]};
                            right.site_id = site.key;
                            right.role_id = all_sites_info.role_id;
                            right.custom = all_sites_info.custom;                           
                            rights.push(right);
                        });
                    //}
                }*/
                var rights = [];
                var right = {site_id:cache.sites[0].key,role_id:0,custom:[]};
                right.role_id = $('#userRightList .right-list-item .roleList option:selected').val();
                rights.push(right);
                
                if (err != ''){
                    error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                    //error_box.delay(10000).slideUp();
                }else {
                    error_box.hide();
                    data['super'] = 0;
                    data.rights = JSON.stringify(rights);
                    // 提交数据
                    private_save('/admin/useredit',data, "#/admin/user");
                }
            });
        },
        /**
         * 超级管理员添加客户
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
         */
        addUserSuper:function(R, param){
            var params = param.split('/');                      
            var title = LANG("添加客户");
            var menu_li = "addUserSuper";
            var is_subordinate = 0;
            
            if(params[0] == 'subordinate') {
                title = "添加系统管理";
                menu_li = "addUserSubordinate";
                is_subordinate = 1;
            }
            
            var tpl = '<h2 id="functionTitle">'+LANG("添加用户")+'</h2>\
                <div class="admin_form">\
                    <div class="error_message"></div>\
                    <p>\
                        <label for="adminUserName">'+LANG("用户名")+'</label>\
                        <input placeholder="'+LANG("请输入一个用户名")+'" id="adminUserName" type="text" minlength="4" maxlength="20" />\
                    </p>\
                    <p>\
                        <label for="adminUserEmail">'+LANG("邮nbsp;&nbsp;&nbsp;箱")+'</label>\
                        <input placeholder="'+LANG("请输入邮箱")+'" id="adminUserEmail" type="text" maxlength="32" />\
                    </p>\
                    <p>\
                        <label for="adminUserPass">'+LANG("密nbsp;&nbsp;&nbsp;码")+'</label>\
                        <input placeholder="'+LANG("输入用户的登录密码")+'" id="adminUserPass" type="password" maxlength="256" />\
                        <span class="info_message">'+LANG("密码长度不小于8位，且同时包含大写字母、小写字母、数字和特殊字符四类要素中的任意三种")+'</span>\
                    </p>\
                    <input class="btnGreen admin-btn" id="adminAddUser" type="button" value="'+LANG(" 确 定 ")+'" />\
                    <input class="btnGray admin-btn" id="adminCancelUser" type="button" value="'+LANG(" 取 消 ")+'" />\
                </div>';
            

            var data = {
                uid: 0,
                email: '',
                pass: '',
                admin: 0,
                rights: [] // 网站权限列表
            }
            cache.rights = []; // 临时站点权限            
            setHtml(R, tpl, menu_li, title, title);
            
            var error_box = $('.admin_form>.error_message');
            
            $('#adminCancelUser').click(function(){
                Clicki.NavView.setDefaultActive(-1, "#/admin/userListSuper");
            });
            $('#adminAddUser').click(function(){
                data.name = $('#adminUserName').val();
                data.email = $('#adminUserEmail').val();
                data.pass = $('#adminUserPass').val();
                var rights = cache.rights;

                var err = '';
                if (!/^[a-zA-Z0-9][a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9]{2,4})+$/.test(data.email)){
                    err += '<li>'+LANG("请输入一个有效的Email地址作为帐号。")+'</li>';
                }

                if (data.uid == 0 || data.pass.length){
                    // 新建用户或者输入了密码时检查密码
                    if (data.pass.length < 8){
                        err += '<li>'+LANG("密码长度不能小于8位。")+'</li>';
                    }
                    if (data.pass != '' && data.pass == data.email){
                        err += '<li>'+LANG("密码不能与用户账号相同。")+'</li>'; 
                    }
                    var type = 0;
                    if (/[a-z]/.test(data.pass)) type++;
                    if (/[A-Z]/.test(data.pass)) type++;
                    if (/[0-9]/.test(data.pass)) type++;
                    if (/[^a-zA-Z0-9]/.test(data.pass)) type++;
                    if (type < 3){
                        err += '<li>'+LANG("密码必须同时包含大写字母、小写字母、数字和特殊字符四类要素中的任意三种。")+'</li>';
                    }
                }               

                if (err != ''){
                    error_box.html('<ul>' + err + '<ul>').stop(true).slideDown()
                    error_box.delay(10000).slideUp();
                }else {
                    error_box.hide();
                    if(is_subordinate != 1) {
                        //data.super = 1;
                    }                   
                    // 提交数据
                    private_save('/admin/useredit', data, "#/admin/userListSuper");
                }
            });

        },
        /**
         * 管理员列表
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
        */
        adminUsers: function(R,param){
            var params = param.split('/');
            var title = LANG('管理员列表');
            var setTitle = LANG('管理员列表');
            setHtml(
                R
                ,_tpls.pageList({"title":setTitle})
                , "adminUsers"
                , setTitle
                , title
            );          

            Clicki.layout.destroy().add({
                "layout":{
                    "theTableAdminSite":{
                        "type":"grid",
                        "config":{
                            "url":"/admin/userlist"
                            ,"params":{
                                "page":1
                                ,"limit":10
                                ,"is_super":1
                            }
                            ,"caption":{
                                "email":{
                                    "desc":""
                                    ,"title":LANG("用户")
                                }
                                ,"last_time":{
                                    "desc":""
                                    ,"title":LANG("登录信息")
                                }                               
                            }
                            ,"colModel":[
                                {                                   
                                    "tdCls":"theTextLeft"
                                    ,"data":"email"
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        return '<div class="theSiteName">'+_data.email+'</div>'
                                    }
                                }
                                ,{
                                    "data":"last_time"
                                    ,"tdCls":"theTextLeft"
                                    ,"cls":'admin-tab-left'
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        return '<p>'+LANG("计数：")+''+_data.count+'</p><p><strong>'+LANG("最近一次登录")+':</strong>'+_data.last_time+'</p>';
                                    }
                                }                               
                                ,{
                                    text:LANG("操作"),
                                    data:null,
                                    cls:"admin-tab-center",
                                    width: '120px',
                                    render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);                                      
                                        var uid = _data.id;                                     
                                        if(_data.level == 1 && _data.top_uid == uid) {
                                            return '<span style="color:#ccc;">'+LANG("取消管理员身份")+'</span>';
                                        } else {
                                            return '<p class="admin-tab-center" key="'+uid+'"><a href="javascript:void(0);" class="node_list_doIt">'+LANG("取消管理员身份")+'</a></p>';
                                        }                                       
                                    }
                                }
                            ]
                            ,"target":"theTableAdminSite"
                            ,afterRender:function(mvc){
                                var gridtable = this.table;

                                $.each(gridtable.find(".gridContentBody:first tr"),function(i,n){
                                    var _tr = $(this);
                                    var data = mvc.Collection.getModelDataAt(i);
                                    if (!data || !data.keys || !data.keys.id) return;
                                    var _id = data.keys.id;
                                    _tr.children("td[nocompare!='1']").css("cursor","pointer").attr("data-key",_id);
                                });
                            }
                            ,callback:function(){                               

                                /*删除网站*/
                                $(".node_list_doIt").die('click').live("click", function(e){
                                    private_confirm(LANG("确认要取消管理员身份？"), function(){
                                        var $p = $(e.target).parents(":first");
                                        var _uid =  $p.attr("key");
                                        $.ajax({
                                            type:"GET",
                                            url:"/admin/useredit?super=0&uid=" + _uid,
                                            dataType:"json",
                                            data:this.parm,
                                            success:function(data){
                                                if(data.success){
                                                    /*如果异步删除很麻烦了，有要更新grid ，又要更新左上角的弹出层，所以干脆直接刷页面算了*/
                                                    var $tbody = $p.parents("tbody");
                                                    var dt = $(e.target).parent().parent().parent().parent().find('td:first').find('div').html();
                                                    var d_url = dt.split('<br>')[1];
                                                    $p.parents("tr:first").remove();
                                                    $('#theClickPopListOutterBox > ol > li').each(function(i, value){
                                                        var poptext = value.innerHTML.split('</strong>')[1];
                                                        if (poptext == d_url) {
                                                            $(this).remove();
                                                        }
                                                    });
                                                    grid.refresh({"data":{}})
                                                }else{
                                                    private_alert(data.error);
                                                }
                                            },
                                           error:function(re){
                                               var errorTxt = re.responseText;
                                               errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
                                               errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));
                                                errorTxt = errorTxt.replace("<p>","");
                                               if (errorTxt) private_alert(errorTxt);
                                               else private_alert(LANG("服务器正忙，删除失败，请稍后再试"));
                                           }
                                        });
                                    });
                                    return false;
                                });
                            }
                        }
                    }
                    ,"theAdminSiteListSearcher":{
                        "type":"search",
                        "config":{
                            "id":$("#theAdminSiteListSearcher"),
                            "slave":["theTableAdminSite"]
                        }
                    }
                }
            });
        },
        /**
         * 添加管理员
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
        */
        addAdminUser: function(R,param){
            var params = param.split('/');
            var title = LANG('添加管理员');
            var setTitle = LANG('添加管理员');
            setHtml(
                R
                ,_tpls.pageList({"title":setTitle})
                , "addAdminUser"
                , setTitle
                , title
            );          

            Clicki.layout.destroy().add({
                "layout":{
                    "theTableAdminSite":{
                        "type":"grid",
                        "config":{
                            "url":"/admin/userlist"
                            ,"params":{
                                "page":1
                                ,"limit":10
                                ,"no_super":1
                            }
                            ,"caption":{
                                "email":{
                                    "desc":""
                                    ,"title":LANG("用户")
                                }
                                ,"last_time":{
                                    "desc":""
                                    ,"title":LANG("登录信息")
                                }                               
                            }
                            ,"colModel":[
                                {                                   
                                    "tdCls":"theTextLeft"
                                    ,"data":"email"
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        return '<div class="theSiteName">'+_data.email+'</div>'
                                    }
                                }
                                ,{
                                    "data":"last_time"
                                    ,"tdCls":"theTextLeft"
                                    ,"cls":'admin-tab-left'
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        return '<p>'+LANG("计数：")+''+_data.count+'</p><p><strong>'+LANG("最近一次登录")+':</strong>'+_data.last_time+'</p>';
                                    }
                                }                               
                                ,{
                                    text:LANG("操作"),
                                    data:null,
                                    cls:"admin-tab-center",
                                    width: '120px',
                                    render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);                                      
                                        var uid = _data.id;
                                        return '<p class="admin-tab-center" key="'+uid+'"><a href="javascript:void(0);" class="node_list_doIt">'+LANG("设为管理员")+'</a></p>';
                                    }
                                }
                            ]
                            ,"target":"theTableAdminSite"
                            ,afterRender:function(mvc){
                                var gridtable = this.table;

                                $.each(gridtable.find(".gridContentBody:first tr"),function(i,n){
                                    var _tr = $(this);
                                    var data = mvc.Collection.getModelDataAt(i);
                                    if (!data || !data.keys || !data.keys.id) return;
                                    var _id = data.keys.id;
                                    _tr.children("td[nocompare!='1']").css("cursor","pointer").attr("data-key",_id);
                                });
                            }
                            ,callback:function(){                               

                                /*删除网站*/
                                $(".node_list_doIt").die('click').live("click", function(e){
                                    private_confirm(LANG("确认要添加管理员身份？"), function(){
                                        var $p = $(e.target).parents(":first");
                                        var _uid =  $p.attr("key");
                                        $.ajax({
                                            type:"GET",
                                            url:"/admin/useredit?super=1&uid=" + _uid,
                                            dataType:"json",
                                            data:this.parm,
                                            success:function(data){
                                                if(data.success){
                                                    /*如果异步删除很麻烦了，有要更新grid ，又要更新左上角的弹出层，所以干脆直接刷页面算了*/
                                                    var $tbody = $p.parents("tbody");
                                                    var dt = $(e.target).parent().parent().parent().parent().find('td:first').find('div').html();
                                                    var d_url = dt.split('<br>')[1];
                                                    $p.parents("tr:first").remove();
                                                    $('#theClickPopListOutterBox > ol > li').each(function(i, value){
                                                        var poptext = value.innerHTML.split('</strong>')[1];
                                                        if (poptext == d_url) {
                                                            $(this).remove();
                                                        }
                                                    });
                                                    grid.refresh({"data":{}})
                                                }else{
                                                    private_alert(data.error);
                                                }
                                            },
                                           error:function(re){
                                               var errorTxt = re.responseText;
                                               errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
                                               errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));
                                                errorTxt = errorTxt.replace("<p>","");
                                               if (errorTxt) private_alert(errorTxt);
                                               else private_alert(LANG("服务器正忙，删除失败，请稍后再试"));
                                           }
                                        });
                                    });
                                    return false;
                                });
                            }
                        }
                    }
                    ,"theAdminSiteListSearcher":{
                        "type":"search",
                        "config":{
                            "id":$("#theAdminSiteListSearcher"),
                            "slave":["theTableAdminSite"]
                        }
                    }
                }
            });
        },
        /**
         * 用户回收站
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
        */
        userRecycle: function(R,param){
            var params = param.split('/');
            var title = LANG('回收站');
            var setTitle = LANG('回收站');
            setHtml(
                R
                ,_tpls.pageList({"title":setTitle})
                , "userRecycle"
                , setTitle
                , title
            );          

            Clicki.layout.destroy().add({
                "layout":{
                    "theTableAdminSite":{
                        "type":"grid",
                        "config":{
                            "url":"/admin/userlist"
                            ,"params":{
                                "page":1
                                ,"limit":10
                                ,"deleted":1
                            }
                            ,"caption":{
                                "user_name":{
                                    "desc":""
                                    ,"title":LANG("用户")
                                }
                                ,"last_time":{
                                    "desc":""
                                    ,"title":LANG("删除时间")
                                }                               
                            }
                            ,"colModel":[
                                {                                   
                                    "tdCls":"theTextCenter"
                                    ,"cls":'admin-tab-center'
                                    ,"data":"user_name"
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        return '<div class="theSiteName">'+_data.user_name+'</div>'
                                    }
                                }
                                ,{
                                    "data":"last_time"
                                    ,"tdCls":"theTextCenter"
                                    ,"cls":'admin-tab-center'
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        return '<p>'+_data.last_time+'</p>';
                                    }
                                }                               
                                ,{
                                    text:LANG("操作"),
                                    data:null,
                                    "cls":'admin-tab-center',
                                    width: '80px',
                                    render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);                                      
                                        var uid = _data.id;
                                        return '<p class="admin-tab-center" key="'+uid+'"><a href="javascript:void(0);" class="node_list_doIt">'+LANG("还原")+'</a></p>';
                                    }
                                }
                            ]
                            ,"target":"theTableAdminSite"
                            ,afterRender:function(mvc){
                                var gridtable = this.table;

                                $.each(gridtable.find(".gridContentBody:first tr"),function(i,n){
                                    var _tr = $(this);
                                    var data = mvc.Collection.getModelDataAt(i);
                                    if (!data || !data.keys || !data.keys.id) return;
                                    var _id = data.keys.id;
                                    _tr.children("td[nocompare!='1']").css("cursor","pointer").attr("data-key",_id);
                                });
                            }
                            ,callback:function(){                               

                                /*删除网站*/
                                $(".node_list_doIt").die('click').live("click", function(e){
                                    private_confirm(LANG("确认要还原么？"), function(){
                                        var $p = $(e.target).parents(":first");
                                        var _uid =  $p.attr("key");
                                        $.ajax({
                                            type:"GET",
                                            url:"/admin/userrecycle?user_id=" + _uid,
                                            dataType:"json",
                                            data:this.parm,
                                            success:function(data){
                                                if(data.success){
                                                    /*如果异步删除很麻烦了，有要更新grid ，又要更新左上角的弹出层，所以干脆直接刷页面算了*/
                                                    //window.location.reload();
                                                    Clicki.layout.get('theTableAdminSite').refresh({data:{}});
                                                    /*var $tbody = $p.parents("tbody");
                                                    var dt = $(e.target).parent().parent().parent().parent().find('td:first').find('div').html();
                                                    var d_url = dt.split('<br>')[1];
                                                    $p.parents("tr:first").remove();
                                                    $('#theClickPopListOutterBox > ol > li').each(function(i, value){
                                                        var poptext = value.innerHTML.split('</strong>')[1];
                                                        if (poptext == d_url) {
                                                            $(this).remove();
                                                        }
                                                    });*/
                                                    //grid.refresh({"data":{}});
                                                }else{
                                                    private_alert(data.error);
                                                }
                                            },
                                           error:function(re){
                                               //var errorTxt = re.responseText;
                                               //errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
                                               //errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));
                                                //errorTxt = errorTxt.replace("<p>","");
                                               //if (errorTxt) private_alert(errorTxt);
                                               //else 
                                               private_alert(LANG("服务器正忙，删除失败，请稍后再试"));
                                           }
                                        });
                                    });
                                    return false;
                                });
                            }
                        }
                    }
                    ,"theAdminSiteListSearcher":{
                        "type":"search",
                        "config":{
                            "id":$("#theAdminSiteListSearcher"),
                            "slave":["theTableAdminSite"]
                        }
                    }
                }
            });
        },
        /**
         * 授权网站管理员
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
         */
        assignUser:function(R, param){
            var tpl = '<h2 id="functionTitle">'+LANG("授权用户")+'</h2>\
                <div class="admin_form">\
                    <div class="error_message"></div>\
                    <div class="userRight" style="padding-left:0px; margin-left:-20px;">\
                        <div id="userRightList"></div>\
                        <a class="btnGray admin-btn admin-new" id="adminNewRight"><i></i>'+LANG("添加用户")+'</a>\
                        <div id="userRightListMask"></div>\
                    </div>\
                    <input class="btnGreen admin-btn" id="adminAddUser" type="button" value="'+LANG(" 确 定 ")+'" />\
                    <input class="btnGray admin-btn" id="adminCancelUser" type="button" value="'+LANG(" 取 消 ")+'" />\
                </div>';

            param = param.split('/');
            var site_id = param[0];
            var site_name = unescape(param[1]);
            var list_uri = "#/admin/siteUserList/"+site_id+"/"+param[1];

            if (param.length == 4){
                cache.role_id = param[2];
            }else {
                cache.role_id = 0;
            }

            setHtml(
                R
                , tpl
                , "siteList"
                , LANG("授权用户")
                , site_name + " - "+LANG("授权用户")
            );


            cache.rights = []; // 临时站点权限
            var wait = 2;
            
            // 获取可选的用户列表
            $.getJSON('/admin/user', {no_sid: site_id}, function(rdata){
                if (!rdata.success) return false; // 拉取数据失败
                wait--;
                cache.users = rdata.result.items;
                if (wait == 0) private_newUserRightItem();
            });

            // 拉取角色列表与整站权限列表
            $.getJSON('/admin/role', {authorize: cache.authorize ? 0 : 1}, function(rdata){
                if (!rdata.success) return false;
                wait--;
                if (rdata.result.authorize) cache.authorize = rdata.result.authorize;
                cache.roles = rdata.result.items;
                if (wait == 0) private_newUserRightItem();
            });

            var error_box = $('.admin_form>.error_message');

            $('#adminNewRight').click(private_newUserRightItem);
            $('#adminCancelUser').click(function(){
                Clicki.NavView.setDefaultActive(-1, list_uri);
            })
            $('#adminAddUser').click(function(){
                var rights = cache.rights;
                var err = '';
                var ids = [];
                var data = [];

                // 更新网站权限
                $('#userRightList > .right-list-item').each(function(index, item){
                    item = $(item);
                    var index = item.attr('data-index');
                    var id = item.find('.adminUserList').val();

                    if (id > 0){
                        if (_.contains(ids, id)){
                            err = '<li>'+LANG("用户重复分配! 每一个用户只能分配一个角色和权限.")+'</li>';
                            item.find('.adminUserList').addClass('admin_error');
                        }
                        ids.push(id);
                        data.push({

                            uid: id,
                            site_id: site_id,
                            role_id: item.find('.roleList').val(),
                            custom: rights[index].custom
                        });
                    }
                });
                if (data.length == 0){
                    err += '<li>'+LANG("请先选择一个用户并指定其角色")+'</li>';
                }

                if (err != ''){
                    error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                    error_box.delay(10000).slideUp(function(){
                        $('#userRightList .admin_error').removeClass('admin_error');
                    });
                }else {
                    error_box.hide();
                    // 提交数据
                    private_save('/admin/usersiteedit', {rights: JSON.stringify(data)}, list_uri);
                }
            });
        },
        /**
         * 管理员角色列表
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
         */
        roleList:function(R){
            setHtml(
                R
                ,_tpls.pageList({"title":LANG("角色列表"),"sid":"theTableAdminRoleListSearcher","id":"theTableAdminRoleList"})
                , "roleList"
                , LANG("角色列表")
            );          
            $("#theTableAdminRoleListSearcher").append('<a class="btnGreen admin-btn admin-new" href="#/admin/addrole" style="float:right;">'+LANG("添加角色")+'</a>');
            Clicki.layout.destroy().add({
                "layout":{
                    "theTableAdminRoleList":{
                        "type":"grid",
                        "config":{
                            "url":"/admin/role"
                            ,"params":{
                                "page":1
                                ,"limit":10
                            }
                            ,"caption":{
                                "name":{
                                    "desc":""
                                    ,"title":LANG("角色名称")
                                }
                                ,"desc":{
                                    "desc":""
                                    ,"title":LANG("描述")
                                }
                                ,"userlist":{
                                    "desc":""
                                    ,"title":LANG("用户列表")
                                }
                            }
                            ,"colModel":[
                                {
                                    "compare":false
                                    ,"tdCls":"theTextLeft"
                                    ,"cls":'needTrans'
                                    ,"data":"name"
                                    ,"width":"250px"
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        ///////////////翻译-----角色名称////////////////////
                                        return LANG(_data.name);
                                    }
                                }
                                ,{
                                    "data":"desc"
                                    ,"tdCls":"theTextLeft"
                                    ,"cls":'admin-tab-left'
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        ///////////////翻译-----角色描述////////////////////
                                        return LANG(_data.desc);
                                    }
                                }
                                ,{
                                    "data":"userlist"
                                    ,"tdCls":"theTextCenter"
                                    ,"cls":'admin-tab-center'
                                    ,"width":"50px"
                                    ,render:function(key,i,row){
                                        var num = this._getCollection().getModelDataAt(row).role_num;
                                        var data_id = this._getCollection().getModelDataAt(row).id;
                                        var html = '<a href="javascript:void(0);" data-num='+num+' data-id='+data_id+' class="roleL">'+num+'</a>';
                                        ///////////////翻译-----角色列表///////////////////
                                        return html;
                                    }
                                }
                                ,{
                                    text:LANG("操作"),
                                    width: "140px",
                                    data:null,
                                    tdCls:"siteCtrlTd",
                                    render:function(key,i,row){
                                        //TODO 管理员界面修改界面传参方式
                                        //TODO 修改角色界面
                                        var obj = this._getCollection().getModelDataAt(row);
                                        /*if(obj.id == 0) {
                                            return '<p class="managOperating" key="'+obj.id+'">\
                                                    <a href="#/admin/roleSiteList/'+obj.id+'/'+escape(obj.name)+'" title="'+LANG("网站列表")+'" data-i="'+row+'">'+LANG("网站列表")+'</a>\
                                                    </p>';
                                        
                                        }*/
                                        var num = this._getCollection().getModelDataAt(row).role_num;
                                        return '<p class="managOperating" key="'+obj.id+'">\
                                                    <a href="#/admin/addrole/'+obj.id+'" class="node_list_updateIt theFirst" title="'+LANG("修改")+'">'+LANG("修改")+'</a>\
                                                    <a href="javascript:void(0);" class="node_list_delIt" data-num='+num+'>'+LANG("删除")+'</a>\
                                                </p>';
                                                /*'<p class="managOperating" key="'+obj.id+'">\
                                                    <a href="#/admin/roleSiteList/'+obj.id+'/'+escape(obj.name)+'" title="'+LANG("网站列表")+'" data-i="'+row+'">'+LANG("网站列表")+'</a>\
                                                    <a href="#/admin/addrole/'+obj.id+'" class="node_list_updateIt" title="'+LANG("修改")+'">'+LANG("修改")+'</a>\
                                                    <a href="javascript:void(0);" class="node_list_delIt">'+LANG("删除")+'</a>\
                                                </p>';*/
                                    }
                                }
                            ]
                            ,"target":"theTableAdminRoleList"
                            ,afterRender:function(mvc){
                                var gridtable = this.table;

                                $.each(gridtable.find(".gridContentBody:first tr"),function(i,n){
                                    var _tr = $(this);
                                    var data = mvc.Collection.getModelDataAt(i);
                                    if (!data || !data.keys || !data.keys.id) return;
                                    var _id = data.keys.id;
                                    _tr.children("td[nocompare!='1']").css("cursor","pointer").attr("data-key",_id);
                                });
                                
                            }
                            ,callback:function(){
                                /*删除角色*/
                                $(".node_list_delIt").die('click').live("click", function(e){
                                    var _n = parseInt($(this).attr("data-num"));
                                    if(_n>0){
                                        private_alert(LANG("此角色已存在用户，无法删除！"));
                                    }else{
                                        private_confirm(LANG("确认要删除么？"), function(){
                                            var $p = $(e.target).parents(":first");
                                            var rid =  $p.attr("key");
                                            $.ajax({
                                                type:"GET",
                                                url:"/admin/roledelete?role_id="+ rid,
                                                dataType:"json",
                                                data:this.parm,
                                                success:function(data){
                                                    if(data.success){
                                                        /*如果异步删除很麻烦了，有要更新grid ，又要更新左上角的弹出层，所以干脆直接刷页面算了*/
                                                        /*var $tbody = $p.parents("tbody");
                                                        var dt = $(e.target).parent().parent().parent().parent().find('td:first').find('div').html();
                                                        var d_url = dt.split('<br>')[1];
                                                        $p.parents("tr:first").remove();
                                                        $('#theClickPopListOutterBox > ol > li').each(function(i, value){
                                                            var poptext = value.innerHTML.split('</strong>')[1];
                                                            if (poptext == d_url) {
                                                                $(this).remove();
                                                            }
                                                        });*/
                                                        //window.location.reload();
                                                        Clicki.layout.get('theTableAdminRoleList').refresh({data:{}});
                                                        //grid.refresh({"data":{}})
                                                    }else{
                                                        private_alert(data.error);
                                                    }
                                                },
                                               error:function(re){
                                                   var errorTxt = re.responseText;
                                                   errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
                                                   errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));
                                                    errorTxt = errorTxt.replace("<p>","");
                                                   if (errorTxt) private_alert(errorTxt);
                                                   else private_alert(LANG("服务器正忙，删除失败，请稍后再试"));
                                               }
                                            });
                                        });
                                    }
                                    return false;
                                });
                                ////查看用户列表
                                $(".roleL").die('click').live("click", function(e){
                                    cache.userlistURL = "/admin/user?role_id="+$(this).attr("data-id");
                                    Clicki.NavView.setDefaultActive(-1, "#/admin/user");
                                })
                            }
                        }
                    }
                    ,"theTableAdminRoleListSearcher":{
                        "type":"search",
                        "config":{
                            "id":$("#theTableAdminRoleListSearcher"),
                            "slave":["theTableAdminRoleList"]
                        }
                    }
                }
            });         
        },
        /**
         * 角色的网站列表
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
         */
        roleSiteList: function(R,param){
            var params = param.split('/');
            var role_id = params[0];                        
            var role_name = unescape(params[1]);
            var title = '"' + role_name + '"'+LANG("角色的网站列表")+'';           
            setHtml(
                R
                ,_tpls.pageList({"title":title})
                , "roleList"
                , LANG('角色网站列表')
                , title
            );
            Clicki.layout.destroy().add({
                "layout":{
                    "theTableAdminSite":{
                        "type":"grid",
                        "config":{
                            "url":"/admin/site"
                            ,"params":{
                                "page":1
                                ,"limit":10
                                ,"role_id":role_id
                            }
                            ,"caption":{
                                "sitename":{
                                    "desc":""
                                    ,"title":LANG("网站")
                                },
                                "members":{
                                    "desc":""
                                    ,"title":LANG("成员数目")
                                }
                            }
                            ,"colModel":[
                                {
                                    "compare":false
                                    ,"tdCls":"theTextLeft"
                                    ,"data":"sitename"
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);                                                                              
                                        return '<div class="theSiteName">'+_data.sitename+'</div><div class="theSiteUrl"><a href="'+_data.url+'" target="_blank" title="'+_data.url+'">'+_data.url.replace(/(http:\/\/)||(https:\/\/)/g,"")+'</a></div>'
                                    }
                                }
                                ,{
                                    data:'members',
                                    width:'80px',
                                    tdCls:"theTextLeft",
                                    cls:'admin-tab-left'
                                }
                                ,{
                                    text:LANG("成员列表"),
                                    data:null,
                                    tdCls:"siteCtrlTd",
                                    width:'80px',
                                    render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        var _sid = _data.id;
                                        var _sitname = _data.sitename;
                                        return '<p class="managOperating" key="'+_sid+'"><a href="#/admin/roleUserList/'+role_id+'/'+_sid+'/'+escape(role_name)+'/'+escape(_sitname)+'" title="'+LANG("成员列表")+'">'+LANG("成员列表")+'</a></p>';
                                    }
                                }
                            ]
                            ,"target":"theTableAdminSite"
                            ,afterRender:function(mvc){
                                var gridtable = this.table;

                                $.each(gridtable.find(".gridContentBody:first tr"),function(i,n){
                                    var _tr = $(this);
                                    var data = mvc.Collection.getModelDataAt(i);
                                    if (!data || !data.keys || !data.keys.id) return;
                                    var _id = data.keys.id;
                                    _tr.children("td[nocompare!='1']").css("cursor","pointer").attr("data-key",_id);
                                });
                            }
                            ,callback:function(){
                                /*删除网站*/
                                $(".node_list_delIt").die('click').live("click", function(e){
                                    private_confirm(LANG("确认要删除么？"), function(){
                                        var $p = $(e.target).parents(":first");
                                        var siteid =  $p.attr("key");
                                        $.ajax({
                                            type:"GET",
                                            url:"/site/sitedelete?site_id=" + siteid + "&role_id=" + role_id,
                                            dataType:"json",
                                            data:this.parm,
                                            success:function(data){
                                                if(data.error == "+OK"){
                                                    /*如果异步删除很麻烦了，有要更新grid ，又要更新左上角的弹出层，所以干脆直接刷页面算了*/
                                                    var $tbody = $p.parents("tbody");
                                                    var dt = $(e.target).parent().parent().parent().parent().find('td:first').find('div').html();
                                                    var d_url = dt.split('<br>')[1];
                                                    $p.parents("tr:first").remove();
                                                    $('#theClickPopListOutterBox > ol > li').each(function(i, value){
                                                        var poptext = value.innerHTML.split('</strong>')[1];
                                                        if (poptext == d_url) {
                                                            $(this).remove();
                                                        }
                                                    });
                                                    if ($('div#siteList').attr("key") == siteid){
                                                        //window.location.reload();
                                                        Clicki.layout.get('theTableAdminSite').refresh({data:{}});
                                                        //window.location.replace(location.href);
                                                    }
                                                    if($tbody.find("tr").length == 0){
                                                        //window.location.reload();
                                                        Clicki.layout.get('theTableAdminSite').refresh({data:{}});
                                                        //window.location.replace(location.href);
                                                    }
                                                    grid.refresh({"data":{}})
                                                }else{
                                                    private_alert(data.error);
                                                }
                                            },
                                           error:function(re){
                                               var errorTxt = re.responseText;
                                               errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
                                               errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));
                                                errorTxt = errorTxt.replace("<p>","");
                                               if (errorTxt) private_alert(errorTxt);
                                               else private_alert(LANG("服务器正忙，删除失败，请稍后再试"));
                                           }
                                        });
                                    });
                                    return false;
                                });
                            }
                        }
                    }
                    ,"theAdminSiteListSearcher":{
                        "type":"search",
                        "config":{
                            "id":$("#theAdminSiteListSearcher"),
                            "slave":["theTableAdminSite"]
                        }
                    }
                }
            });         
        },
        /**
         * 站点管理员列表
         * @param  {String} routerParams 路由参数原始值
         * @return {Undefined}           无返回值
        */
        roleUserList: function(R,param){

            var params = param.split('/');          
            var rid = params[0];
            var sid = params[1];
            var rolename = unescape(params[2]);
            var sitename = unescape(params[3]);
            var title = ''+LANG("角色")+'"' + rolename + '"'+LANG("在网站")+'"' + sitename + '"'+LANG("所有的用户列表")+'';
            
            setHtml(
                R
                ,_tpls.pageList({"title":title})
                , "roleList"
                , LANG("角色网站用户列表")
                , title
            );

            var param = [sid, params[3], rid, params[2]].join('/');
            $("#functionTitle").before('<a class="btnGreen admin-btn admin-new admin-right" href="#/admin/assignUser/'+param+'">'+LANG("授权用户")+'</a>');
            
            Clicki.layout.destroy().add({
                "layout":{
                    "theTableAdminSite":{
                        "type":"grid",
                        "config":{
                            "url":"/admin/user"
                            ,"params":{
                                "page":1
                                ,"limit":10
                                ,"sid":sid
                                ,"role_id":rid
                            }
                            ,"caption":{
                                "email":{
                                    "desc":""
                                    ,"title":LANG("用户")
                                }
                                ,"last_time":{
                                    "desc":""
                                    ,"title":LANG("登陆信息")
                                }
                                ,"role":{
                                    "desc":""
                                    ,"title":LANG("权限")
                                }
                            }
                            ,"colModel":[
                                {                                   
                                    "tdCls":"theTextLeft"
                                    ,"data":"email"
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        return '<div class="theSiteName">'+_data.email+'</div>'
                                    }
                                }
                                ,{
                                    "data":"last_time"
                                    ,"tdCls":"theTextLeft"
                                    ,"cls":"admin-tab-left"
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        return '<p>'+LANG("计数：")+''+_data.count+'</p><p><strong>'+LANG("最近一次修改时间")+':</strong>'+_data.last_time+'</p>';
                                    }
                                }
                                ,{
                                    "data":"role"
                                    ,"tdCls":"theTextLeft"
                                    ,"cls":"admin-tab-left"
                                    ,render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        if(_data.level == 1) {
                                            return '<p><b style="color:#000; font-size:14px;">'+LANG("管理员")+'</b></p>';
                                        }
                                        var _site = null;
                                        if(_data.sites[0] != undefined) _site = _data.sites[0];
                                        return private_authorize_show(_site);
                                    }
                                }
                                ,{
                                    text:LANG("操作"),
                                    data:null,
                                    tdCls:"siteCtrlTd",
                                    width: '100px',
                                    render:function(key,i,row){
                                        var _data = this._getCollection().getModelDataAt(row);
                                        if (_data.level == 1) return '<div style="text-align:center;color:#ccc;">'+LANG("修改权限")+' | '+LANG("删除")+'</div>';
                                        var _uid = _data.id;
                                        var _email = _data.email;
                                        return '<p class="managOperating" key="'+_uid+'"><a href="#/admin/userRoleEdit/' + sid + '/'+ _uid + '/' + escape(sitename) + '/' + escape(_email) +'" title="'+LANG("修改权限")+'">'+LANG("修改权限")+'</a><a href="javascript:void(0);" class="node_list_delIt">'+LANG("删除")+'</a></p>';
                                    }
                                }
                            ]
                            ,"target":"theTableAdminSite"
                            ,afterRender:function(mvc){
                                var gridtable = this.table;

                                $.each(gridtable.find(".gridContentBody:first tr"),function(i,n){
                                    var _tr = $(this);
                                    var data = mvc.Collection.getModelDataAt(i);
                                    if (!data || !data.keys || !data.keys.id) return;
                                    var _id = data.keys.id;
                                    _tr.children("td[nocompare!='1']").css("cursor","pointer").attr("data-key",_id);
                                });
                            }
                            ,callback:function(){                               

                                /*删除网站*/
                                $(".node_list_delIt").die('click').live("click", function(e){
                                    private_confirm(LANG("确认要删除么？"), function(){
                                        var $p = $(e.target).parents(":first");
                                        var siteid =  $p.attr("key");
                                        $.ajax({
                                            type:"GET",
                                            url:"/admin/usersitedelete?site_id="+ sid + '&user_id=' + _uid,
                                            dataType:"json",
                                            data:this.parm,
                                            success:function(data){                                             
                                                if(data.success){
                                                    /*如果异步删除很麻烦了，有要更新grid ，又要更新左上角的弹出层，所以干脆直接刷页面算了*/
                                                    var $tbody = $p.parents("tbody");
                                                    var dt = $(e.target).parent().parent().parent().parent().find('td:first').find('div').html();
                                                    var d_url = dt.split('<br>')[1];
                                                    $p.parents("tr:first").remove();
                                                    $('#theClickPopListOutterBox > ol > li').each(function(i, value){
                                                        var poptext = value.innerHTML.split('</strong>')[1];
                                                        if (poptext == d_url) {
                                                            $(this).remove();
                                                        }
                                                    });
                                                    if ($('div#siteList').attr("key") == siteid){
                                                        //window.location.reload();
                                                        Clicki.layout.get('theTableAdminSite').refresh({data:{}});
                                                        //window.location.replace(location.href);
                                                    }
                                                    if($tbody.find("tr").length == 0){
                                                        //window.location.reload();
                                                        Clicki.layout.get('theTableAdminSite').refresh({data:{}});
                                                        //window.location.replace(location.href);
                                                    }
                                                    grid.refresh({"data":{}})
                                                }else{
                                                    private_alert(data.error);
                                                }
                                            },
                                           error:function(re){
                                               var errorTxt = re.responseText;
                                               errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
                                               errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));
                                                errorTxt = errorTxt.replace("<p>","");
                                               if (errorTxt) private_alert(errorTxt);
                                               else private_alert(LANG("服务器正忙，删除失败，请稍后再试"));
                                           }
                                        });
                                    });
                                    return false;
                                });
                            }
                        }
                    }
                    ,"theAdminSiteListSearcher":{
                        "type":"search",
                        "config":{
                            "id":$("#theAdminSiteListSearcher"),
                            "slave":["theTableAdminSite"]
                        }
                    }
                }
            });
        },
        /**
         * 管理员添加角色
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        addRole:function(R, param){
            var tpl = '<h2 id="functionTitle">'+LANG("添加角色")+'</h2>\
                <div class="admin_form">\
                    <div class="error_message"></div>\
                    <p>\
                        <label for="adminRoleName">'+LANG("名称")+'</label>\
                        <input placeholder="'+LANG("请输入一个唯一的角色名称")+'" id="adminRoleName" type="text" maxlength="32" />\
                    </p>\
                    <p>\
                        <label for="adminUserPass">'+LANG("描述")+'</label>\
                        <textarea id="adminRoleDesc" style="width:500px; height:70px;"></textarea>\
                    </p>\
                    <div>\
                        <label style="float:left;">'+LANG("权限")+'</label>\
                        <div id="adminRoleRight"></div>\
                        <a class="btnGray admin-btn adminRoleHeightCtrl"><i>'+LANG("展开")+'</i></a>\
                    </div>\
                    <div style="clear:both; padding-top:20px;">\
                    <input class="btn_lan02 admin-btn" id="adminAddRole" type="button" value="'+LANG(" 确 定 ")+'" />\
                    <input class="btn_hui02 admin-btn" id="adminCancelRole" type="button" value="'+LANG(" 取 消 ")+'" />\
                    </div>\
                </div>';
                
            var params = param.split('/');
            var role_id = params[0];
            //if(role_id > 0) title = LANG("修改角色");
            var title = "添加角色";
            if(param!=""){
                 title = "修改角色";
             }
            setHtml(R,tpl,"addRole",title,title);


            function buildTable(){
                if (role_id == 0){
                    var role = {authlist: ''};
                }else {
                    var role = _.find(cache.roles, function(r){ return r.id == role_id; });
                    if (role){
                        $('#adminRoleName').val(role.name);
                        $('#adminRoleDesc').val(role.desc);
                        R.testIfAfterF5('roleEdit');
                    }else {
                        private_alert(LANG('要编辑的角色记录不存在!'), function(){
                            history.go(-1);
                        });
                        return;
                    }
                }

                cache.temp = role.authlist.split(',');
                var tab = private_buildRightTable($('#adminRoleRight'));
                private_updateRightTable(tab, '', cache.temp);
                $('.adminRoleHeightCtrl').click(private_toggleRightTable);
            }
            // 拉取角色列表与整站权限列表
            $.getJSON('/admin/role?authorize=' + (cache.authorize ? 0 : 1), function(data){
                if (!data.success) return false;
                if (data.result.authorize) cache.authorize = data.result.authorize;
                cache.roles = data.result.items;
                buildTable();
            });

            // 绑定操作事件
            var error_box = $('.admin_form .error_message:first');
            $('#adminAddRole').click(function(){
                var role = {
                    name: $('#adminRoleName').val(),
                    desc: $('#adminRoleDesc').val(),
                    authlist: []
                }
                $('#adminRoleRight td.has_remove').each(function(index, td){
                    role.authlist.push($(td).attr('data-id'));
                })
                var err = '';
                if (role.name == ''){
                    err += '<li>'+LANG("必须输入一个角色名称")+'</li>';
                }
                if (role.authlist.length == 0){
                    err += '<li>'+LANG("请分配至少一个权限给该角色")+'</li>';
                }

                if (err != ''){
                    error_box.html('<ul>' + err + '<ul>').stop(true).slideDown(function(){
                        error_box.delay(10000).slideUp();
                    });
                }else {
                    error_box.hide();
                    role.authlist = role.authlist.toString();
                    // 提交数据
                    if (param){
                        role.role_id = param;
                        private_save('/admin/roleedit', role, "#/admin/roleList");
                    }else {
                        private_save('/admin/roleadd', role, "#/admin/roleList");
                    }
                    // 清除缓存
                    cache.roles = null;
                }
            })
            $('#adminCancelRole').click(function(){
                Clicki.NavView.setDefaultActive(-1, "#/admin/roleList");
            })
        },
        /**
         * 业务日志
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        operationLog:function(R, param){
            setHtml(
                R
                ,_tpls.loger()
                , "operationLog"
                , LANG("业务日志")
            );

            Clicki.layout.destroy().add({
                "layout":{
                    "theDatepicker":{
                        "type":"datepicker_fb3",
                        "config":{
                            "id":"datepicker"
                        }
                    },
                    "theOperationLog":{
                        "type":"grid",
                        "config":{
                            "url":"/admin/operationlog"
                            ,"params":{
                                //"condition": param ? 'site_id|' + param : undefined,
                                "page":1,
                                "limit":20
                            }
                            ,"caption":{
                                "time":{
                                    "desc":""
                                    ,"title":LANG("时间")
                                },
                                "log":{
                                    "desc":""
                                    ,"title":LANG("日志内容")
                                }
                            }
                            ,"colModel":[
                                {
                                    "compare":false
                                    ,"tdCls":"theTextLeft"
                                    ,"width":"130px"
                                    ,"data":"time"
                                },
                                {
                                    "tdCls":"theTextLeft"
                                    ,"cls":"admin-tab-left"
                                    ,data:'log'
                                    ,render: function(key, i, row){
                                        var D = this._getCollection().getModelDataAt(row);
                                        ///////////////////////////////翻译表格内容////////////////////////////////
                                        return ['<b>', D.user_name, '</b> ', LANG(D.operate), LANG(D.object_type), ' <b>', D.object+"", '</b>'].join('');
                                    }
                                }
                                ,{
                                    text:LANG("操作"),
                                    data:null,
                                    tdCls:"siteCtrlTd",
                                    width: '50px',
                                    render:function(key,i,row){
                                        var D = this._getCollection().getModelDataAt(row);
                                        return '<p class="managOperating"><a href="#" data-id="' + D.id + '" class="node_list_delIt frist" title="'+LANG("删除日志记录")+'">'+LANG("删除")+'</a></p>';
                                    }
                                }
                            ]
                            ,"target":"operationLogArea"
                            ,callback:function(){
                                $('.node_list_delIt').die('click').live('click', function(evt){
                                    var log_id =  $(this).attr('data-id');
                                    private_confirm(LANG("确认要删除么？"), function(){ 
                                        $.getJSON('/admin/operationlog', {condition:"id|"+log_id, type:"delete"}, function(data){
                                            if(data.success) {
                                                //window.location.reload();
                                                Clicki.layout.get('theOperationLog').refresh({data:{}});
                                            } else {
                                                if(data.error) {
                                                    private_alert(data.error);
                                                }
                                            }                                       
                                        })
                                        //evt.preventDefault();
                                        //return false;
                                    });
                                    return false;   
                                });
                            }
                        }
                    }
                },
                "relation":{
                    "theDatepicker":["theOperationLog"]
                }
            });
        },
        
        /**
         * 服务日志
         * @param  {String}     R   路由参数原始值
         * @return {Undefined}      无返回值
         */
        monitorprocess:function(R){
            setHtml(
                R
                ,_tpls.monitorProcess()
                , "monitorprocess"
                , LANG("服务日志")
            );
            var _url = "/admin/processmonitor";
            private_setMonitorprocessLayout(_url);
            
            $("#gotoQuery").die('click').live("click", function(event){
                var _date = $("#dataText").val();
                var err = '';
                var error_box = $('.error_message');
                
                if(isdate(_date)){
                    error_box.slideUp();
                    _url = "/admin/processmonitor?date="+_date;
                    private_setMonitorprocessLayout(_url);
                }else{
                    err += '<li>'+LANG("输入日期格式不正确")+'</li>';
                    error_box.html('<ul>' + err + '<ul>').stop(true).slideDown();
                }
            });
            
            
            /*Clicki.layout.destroy().add({
                "layout":{
                    "theDatepicker":{
                        "type":"newDatepicker",
                        "config":{
                            "id":"datepickerBtn"
                        }
                    },
                    "theMonitorProcess":{
                        "type":"grid",
                        "config":{
                            "url":"/admin/processmonitor",
                            "params":{
                                "page":1,
                                "limit":20
                            },
                            "caption":{
                                "name":{
                                    "desc":"",
                                    "title":LANG("模块名称")
                                },
                                "log":{
                                    "desc":"",
                                    "title":LANG("运行日志大小")
                                }
                                ,
                                "errlog":{
                                    "desc":"",
                                    "title":LANG("异常日志大小")
                                }
                            },
                            "colModel":[
                                {
                                    "tdCls":"theTextCenter"
                                    ,"cls":"admin-tab-left"
                                    ,data:'name'
                                    ,render: function(key, i, row){
                                        return this._getCollection().getModelDataAt(row).name;
                                    }
                                },
                                {
                                    "tdCls":"theTextRight"
                                    ,"cls":"admin-tab-left"
                                    ,data:'log'
                                    ,render: function(key, i, row){
                                        return this._getCollection().getModelDataAt(row).log_size;
                                    }
                                },
                                {
                                    text:LANG("操作"),
                                    data:null,
                                    tdCls:"siteCtrlTd",
                                    width: '80px',
                                    render:function(key,i,row){
                                        var D = this._getCollection().getModelDataAt(row);
                                        var log_size = this._getCollection().getModelDataAt(row).log_size;
                                        var expoUrl = '/admin/processlog?process_id='+D.num+'&log_type=1&download=1'
                                        var checkA = '<p class="managOperating"><a href="javascript:void(0);" data-id="' + D.num + '" type="1" class="node_list_showIt" title="'+LANG("查看日志记录")+'">'+LANG("查看")+'</a>';
                                        var exportA = '<a href="'+expoUrl+'" data-id="'+D.num+'" type="1" class="node_list_downIt" target="_blank" title="'+LANG("导出日志记录")+'">'+LANG("导出")+'</a></p>'
                                        if(log_size=="0K"){
                                            checkA = '<p class="managOperating"><a data-id="' + D.num + '" type="1" class="noExport" title="'+LANG("查看日志记录")+'">'+LANG("查看")+'</a>';
                                            exportA = '<a data-id="' + D.num + '" type="1" class="noExport" title="'+LANG("导出日志记录")+'">'+LANG("导出")+'</a></p>';
                                        }
                                        return [checkA,exportA].join("");
                                    }
                                },
                                {
                                    "tdCls":"theTextRight"
                                    ,"cls":"admin-tab-left"
                                    ,data:'errlog'
                                    ,render: function(key, i, row){
                                        return this._getCollection().getModelDataAt(row).err_log_size;
                                    }
                                },
                                {
                                    text:LANG("操作"),
                                    data:null,
                                    tdCls:"siteCtrlTd",
                                    width: '80px',
                                    render:function(key,i,row){
                                        var D = this._getCollection().getModelDataAt(row);
                                        var err_log_size = this._getCollection().getModelDataAt(row).err_log_size;
                                        var expoUrl = '/admin/processlog?process_id='+D.num+'&log_type=2&download=2'
                                        var checkA = '<p class="managOperating"><a href="javascript:void(0);" data-id="' + D.num + '" type="2" class="node_list_showIt" title="'+LANG("查看日志记录")+'">'+LANG("查看")+'</a>';
                                        var exportA = '<a href="'+expoUrl+'" data-id="' + D.num + '" type="2" class="node_list_downIt" target="_blank" title="'+LANG("导出日志记录")+'">'+LANG("导出")+'</a></p>'
                                        if(err_log_size=="0K"){
                                            checkA = '<p class="managOperating"><a data-id="' + D.num + '" type="2" class="noExport" title="'+LANG("查看日志记录")+'">'+LANG("查看")+'</a>';
                                            exportA = '<a data-id="' + D.num + '" type="2" class="noExport" title="'+LANG("导出日志记录")+'">'+LANG("导出")+'</a></p>';
                                        }
                                        return [checkA,exportA].join("");
                                    }
                                }
                            ]
                            ,"target":"monitorProcessArea",
                            callback:function(){
                                $(".node_list_showIt").die('click').live("click", function(e){
                                    var type = $(e.target).attr('type');
                                    var _id = $(e.target).attr('data-id');
                                    var url = '/admin/processlog?process_id='+_id+'&log_type='+type;
                                    
                                    $.getJSON(url, function(rdata){
                                        if (rdata.success){
                                            private_monitorprocess_check(rdata.msg);
                                            return false;
                                        }else{
                                            private_alert(LANG("服务器正忙，操作失败，请稍后再试"));
                                        }
                                        return false;
                                    })
                                }); 
                            }
                        }
                    }
                },
                "relation":{
                    "theDatepicker":["theOperationLog"]
                }
            });*/
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
