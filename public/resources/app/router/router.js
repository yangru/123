define(function(require){
    var pop = require('pop_up');
    var cache = {
        alert_pop:null // 弹出警告框
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
    
    //有提示框的页面跳转函数
    function jumpTo(text,url){
        private_alert_noCancelBtn(text, function(){
            window.location.href = url;
        });
    }
    
    function makeObject(){
        var o = {};
        for (i=1; i<arguments.length; i+=2){
            o[arguments[i-1]] = arguments[i];
        }
        return o;
    }
    // 异步初始化表格控件
    function initTabContent(item){
        var grid = item.set[0],
            type = item.set[1],
            name = item.set[2],
            chart = item.set[3],
            grid_id = 'theList_' + grid,
            chart_id = 'theList_' + grid + 'overview_chart';

        var layout = makeObject(
            grid_id, {
                "type": grid + 'Grid',
                "config": {id: grid_id}
            },
            chart_id, {
                "type":"commonChart",
                "config":{
                    id: chart_id,
                    chartsControl: {
                        "compare": false,
                        "category":{
                            "items":[{"name":"", "type":type}]
                        },
                        "dimension": makeObject(type, name),
                        "indicator":{"default":["sessions"]},
                        "model":{
                            "group":{
                                "url":"/feed/group",
                                "params":{
                                    "begindate":Clicki.manager.getDate().beginDate,
                                    "enddate":Clicki.manager.getDate().endDate,
                                    "site_id":site_id,
                                    "order":"sessions|-1"
                                }
                            }
                        }
                    },
                    "chartsPaint":{
                        "model":{
                            "config":{
                                "type":chart,
                                "chartDimension": makeObject(name, {}),
                                "setting":{}
                            }
                        }
                    },
                    "plugin":[]
                }
            }
        );

        item.dom.append('<div id="'+chart_id+'"></div><div id="'+grid_id+'"></div>');
        Clicki.layout.add({
            "layout": layout,
            "relation": {"theDatepicker":[grid_id, chart_id]}
        });
    }

    var base = require("base");
    /*简单的表单验证*/
    function simpleFormTest(s,n,n2,dis,fn){
        var urlInput = $(s);
        var nameInput = $(n);
        var urlTip = urlInput.next();
        var nameTip = nameInput.next();
        var go2Next = $(n2);
        var url = urlInput.val() || false;
        var name = nameInput.val() || false;
        go2Next.attr("disabled",dis);
        /*url 文本框*/
        urlInput.bind("blur",function(){
            var val = $.trim(this.value);
            if(val === ""){
                urlTip.text(LANG("网站地址不可为空白。"));
                go2Next.attr("disabled",dis);
                url = false;
                return;
            }
            if(val.indexOf(".") === -1){
                urlTip.text(LANG("网站地址格式有误"));
                go2Next.attr("disabled",dis);
                url = false;
                return;
            }
            url = val;
            urlTip.text("");
            if(url && name){
                go2Next.attr("disabled",false);
            }
        }).bind("keyup",function(){
            if($.trim(this.value).indexOf(".")!==-1){
                url = $.trim(this.value);
                if(url && name){
                    go2Next.attr("disabled",false);
                }
            }
            urlTip.text("");
        });

        /*网站名称文本框*/
        nameInput.bind("blur",function(){
            var val = $.trim(this.value);
            if(val === ""){
                nameTip.text(LANG("网站名称不可为空白。"));
                go2Next.attr("disabled",dis);
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
        /*下一步按钮*/
        go2Next.bind("click",function(){
            fn(name,url);
        });
    }
    var nowActive = "";
    var defCrumbs = '<span class="needTrans">'+LANG("统计后台")+'</span>';

    function BeDo(actions){
        /*缓存合集*/
        this.cache = null;
        /*要执行的事件队列*/
        this.toDoAction = [];
        /*超时次数*/
        this.deadCount = 10;
        /*计时器*/
        this.timer = null;
        /*执行队列数*/
        this.length = 0;
        /*延时执行对象*/
        this.deferred = null;
        /*是否立刻执行*/
        actions && this.run();
    }
    /*执行队列*/
    BeDo.prototype.run = function(){
        if(this.length){
            var me = this;
            $.when((function(){
                if(!me.cache){
                    /*加载存在延时的情况*/
                    var dtd = $.Deferred();
                    var tagNames = {};
                    for(var i = 0;i<me.length;i++){
                        tagNames[me.toDoAction[i][0]] = 0;
                    }
                    function counter(){
                        me.cache = $.extend(Clicki.manager.appCache,Clicki.layout.cache||{});
                        if(!me.deadCount || !$.isEmptyObject(tagNames)){
                            for(var n in tagNames){
                                if(n in me.cache){
                                    delete(tagNames[n]);
                                }
                            }
                            --me.deadCount;
                            me.timer = setTimeout(counter,100);
                        }else{
                            dtd.resolve();
                        }
                    }
                    me.timer = setTimeout(counter,100);
                    me.deferred = dtd;
                    return dtd;
                }
            })())
            .done(function(){
                me.fn._run.call(me);
            })
        }
    }
    /*停止当前计时*/
    //TODO 切换页面，应该清除toDoAction的缓存
    BeDo.prototype.stop = function(){
        if(this.timer !== null){
            clearTimeout(this.timer);
            this.timer = null;
            /*取消延时操作*/
            this.deferred.reject();
        }
        this.cache = null;
        this.deadCount = 10;
    }
    /*添加路由事件*/
    BeDo.prototype.push = function(actions){
        /*site/10004/#/do:*/
        if(actions){
            /*切割事件*/
            actions = actions.split(",");
            for(var i=0;i<actions.length;i++){
                /*
                生成具体的操作参数。
                只支持3个参数，按顺序分别为：要操作的模块类型或实例名，要执行的事件，要传递的参数
                */
                actions[i] = actions[i].split("|");
                /*转化参数类型*/
                actions[i][2] = eval('('+(
                    isNaN(+actions[i][2]) && actions[i][2].match(/^\w+$/) && "\""+actions[i][2]+"\""
                    || actions[i][2]
                )+')');
                this.toDoAction.push(actions[i]);
            }
        }
        this.length = this.toDoAction.length;

        return this.toDoAction;
    }
    BeDo.prototype.fn = {
        _run:function(){
            
            for(var i=0;i<this.length;i++){
                var _act = this.toDoAction[i];
                if(_act[0] in this.cache){
                    /*优先查找实例名*/
                    typeof(this.cache[_act[0]][_act[1]]) === "function" && this.cache[_act[0]][_act[1]](_act[2]);
                    console.log(_act[0]+" "+_act[1]+" "+_act[2]);
                }else{
                    /*未找到则尝试匹配模块类型（appType）*/
                    for(var n in this.cache){
                        if(this.cache[n].appType && this.cache[n].appType === _act[0]){
                            typeof(this.cache[n][_act[1]]) === "function" && this.cache[n][_act[1]](_act[2]);
                            console.log(_act[0]+" "+_act[1]+" "+_act[2]);
                        }
                    }
                }
            }
        }
    }

    function jumpAddSite(){
        if (location.pathname != '/manage/'){
            alert(LANG('尚没有任何站点, 请先添加一个站点.'));
            location.href = "/manage/#/admin/addSite";
            return true;
        }
        return false;
    }

    return {
        routes:{
            "setting/widget/list":"settingWidgetlist",
            "setting/widget/detail":"settingWidgetdetail",
            "setting/token/detail":"settingWidgettoken",
            "setting/*path":"settingWidgetcreate",
            "setwidget":"setwidget",

			"invite":"invite",
			"invite/exchinvite":"exchinvite",
            "invite/pointrules":"pointrules",

            "user/setpassword":"setpassword",
            "user/setpassword":"setpassword"/*,
            "algorithm/scene":"algorithmAction"*/
        },
        "initialize":function(options){
            ///\/?(\d+)\/?/ig.exec(window.location.hash)

            /**/
            var sid = /\/([\-0-9]+)\/?/.exec(window.location.pathname);
            // 只要有，就换
            if(sid && sid.length > 1 && (sid = sid.slice(1))){
                sid = +sid[0];
                if(sid){
                    window.site_id = sid;
                }else{
                    window.site_id == -1;
                }
            }

            /*栏目地址后的参数全数传入到对应的函数中*/
            for(var n in this.routes){
                this.route(
                    new RegExp("^"+n+"\\/?(.*)+"),
                    this.routes[n]
                );
            }
            this.route('admin/:action', 'adminAction');
            this.route('admin/:action/*param', 'adminAction');
            this.route('algorithm/:action', 'algorithmAction');
            this.route('algorithm/:action/*param', 'algorithmAction');
            this.route('site/:action', 'siteAction');
            this.route('site/:action/*param', 'siteAction');
        },
        "beDo":null,
        crumbs:function(name){
            var crumbs = Clicki.App.crumbs;
            var nowActive = Clicki.NavView.activeUrl.split("?")[0];
            if(window.location.hash === "#/site"){
                crumbs.html(defCrumbs);
                return;
            }
            if($.isPlainObject(name)){
                nowActive = defCrumbs
                var _root = name.parent;
                while(_root){
                    nowActive+="<i>/</i><span title=\""+_root.text+"\"><a title=\""+_root.text+"\" href=\""+_root.url+"\">"+_root.text+"</a></span>";
                    _root = _root.parent;
                }
                nowActive+="<i>/</i><span title=\""+name.text+"\">"+name.text+"</span>";
            }else{
                if(typeof(name) === "string"){
                    nowActive = defCrumbs+"<i>/</i><span title=\""+name+"\">"+name+"</span>";
                }
            }

            crumbs.html(nowActive);
        },
        /*是否已经添加站点*/
        isNoSite:function(fn){
            if(site_id === -1){
                jumpAddSite();
                //location.href = "/manage/#/admin/addSite";
                return false;
            }else{
                fn();
            }
        },
        /*页面统一处理函数*/
        initiator:function(routerParams, navId, name, dp, fn, params, def, getContentCb){
            def = def === undefined?true:def;

            this.beDo && this.beDo.stop()
                || (this.beDo = new BeDo());

            if(site_id === -1){
                /*如果没站点*/
                jumpAddSite();
                // location.href = "/manage/#/admin/addSite";
                return false;
            }else{
                if(routerParams){
                    routerParams = routerParams.split("/");
                    for(var i = 0;i<routerParams.length;i++){
                        routerParams[i] = decodeURI(routerParams[i]);
                        /*do:格式开头的为路由事件*/
                        if(routerParams[i].match(/^do:/)){
                            this.beDo.push(routerParams[i].split("do:").slice(1)[0]);
                            break;
                        }
                    }
                }
                this.testIfAfterF5(navId);
                if(dp){
                    require.async(["m_datepicker"], function(datepicker){
                        this.getContentHtml(_.isFunction(getContentCb) && getContentCb || function(){
                            Clicki.manager.addToCache("theDatepicker",datepicker.init({
                                "depend":".datepicker",
                                "options":{
                                    maxDate:0,
                                    minDate:"-24M"
                                }
                            }));
                            typeof(fn) === "function" && fn();
                            if(def){
                                Clicki.App.bindChoseDate( typeof(def) === "object" && def.cdFn || false);
                                Clicki.Balance();
                            }
                            
                        },params);
                        this.crumbs(name);
                    }.bind(this));
                }else{
                    this.getContentHtml(function(){
                        typeof(fn) === "function" && fn();
                        if(def){
                            Clicki.Balance();
                        }
                    },params);
                    this.crumbs(name);
                }
            }
        },

        /*网站列表*/
        site:function(){
            this.isNoSite(function(){

                require.async(["grid","swfobject"], function(grid,swfobject) {
                    this.testIfAfterF5();
                    this.getContentHtml(function(){
                        $("#addnode").bind("click",function(){
                            Clicki.NavView.setDefaultActive(-1,"#/site/addsite");
                            return false;
                        });
                    });
                    
                }.bind(this));
            }.bind(this));

        },

		/*邀请*/
		invite:function(id){
              if(id){
                window["site_id"] = id;
                Clicki.manager.changeSiteId(id);
                Clicki.manager.getApp("poplist",false) && Clicki.manager.getApp("poplist").showMatch();
            }
            this.testIfAfterF5(-4);
            Clicki.NavView.activeUrl = "/invite?out=html";
            this.getContentHtml(function(){
                $(".sendto").click(function(){
                    Clicki.popLayout({id:"#send_panel", title:LANG("发送邀请码"), width:"200px", height: "100px"});
                });
                Clicki.Balance();
            });
            this.crumbs(LANG("邀请"));
		},
		/*兑换邀请码*/
		exchinvite:function(id){
          if(id){
                window["site_id"] = id;
                Clicki.manager.changeSiteId(id);
                Clicki.manager.getApp("poplist",false) && Clicki.manager.getApp("poplist").showMatch();
            }
            this.testIfAfterF5(-4);
            Clicki.NavView.activeUrl = "/invite/exchinvite?out=html";
            this.getContentHtml(function(){
                $('#exch_code').click(function(){
                    var exch_count = $('#code_count').val();
                    var mapping = $('#func_mapping').val();
                    var func_point = $('#func_mapping option:selected').attr('point');
                    var func_title = $('#func_mapping option:selected').text();
                    var use_point = exch_count * func_point;
                    if (exch_count > 0 && confirm(LANG('兑换%1个[%2]邀请码需要消耗%3积分,确定兑换吗?', exch_count, func_title, use_point))) {
                        var total_point = $('#total_point').html();
                        if (total_point >= use_point) {
                            $.ajax({
                                url:"/invite/exchinvite",
                                data:{exch_count:exch_count, mapping:mapping},
                                dataType:"json",
                                type:"GET",
                                success:function(data){
                                    if (data.error == "+OK") {
                                        Clicki.Router.navigate("#/invite",true);
                                    }
                                },
                                error:function(er){
                                    alert(LANG("服务器正忙,请稍后再试!"));
                                }
                            });
                        } else {
                            alert(LANG("你的积分不够,还差%1积分.", Math.abs(total_point - use_point)));
                        }
                    }
                });
                Clicki.Balance();
            });
            this.crumbs(LANG("兑换邀请码"));
		},
		/*积分对照表*/
		pointrules:function(id){
          if(id){
                window["site_id"] = id;
                Clicki.manager.changeSiteId(id);
                Clicki.manager.getApp("poplist",false) && Clicki.manager.getApp("poplist").showMatch();
            }
            this.testIfAfterF5();
            Clicki.NavView.activeUrl = "/invite/pointrules?out=html";
            this.getContentHtml(function(){
                Clicki.Balance();
            });
            this.crumbs(LANG("积分对照表"));
		},

        /*修改密码*/
        setpassword:function(){
            this.testIfAfterF5("setpassword");
            Clicki.NavView.activeUrl = "/user/setpassword?out=html";
            this.getContentHtml(function(){
                var setpasswordTest = function(checksum,pwd,repwd,put,dis,fn){
                    var checksumValue = $("#checksum").val();
                    var pwdInput = $(pwd);
                    var repwdInput = $(repwd);
                    var pwdTip = pwdInput.next();
                    var repwdTip = repwdInput.next();
                    var putPwd = $(put);
                    var pwd = false,repwd=false;
                    putPwd.attr("disabled",dis);
                    pwdTip.parent().css({height:'auto', 'padding-bottom':20}).parent().css('height', 'auto');

                    /*密码框*/
                    pwdInput.bind("blur",function(){
                        var val = $.trim(this.value);
                        pwd = val;
                        if(pwd&&repwd){
                            pwdTip.hide();
                            putPwd.attr("disabled",false);
                        }
                    }).bind("keyup",function(){
                        if($.trim(this.value) !== ""){
                            pwd = $.trim(this.value);
                            if(pwd && repwd){
                                putPwd.attr("disabled",false);
                            }
                        }
                        pwdTip.hide();
                    });

                    /*重复密码框*/
                    repwdInput.bind("blur",function(){
                        var val = $.trim(this.value);
                        if(val === ""){
                            repwdTip.css({"display":"block"});
                            repwdTip.html("请再次输入密码");
                            putPwd.attr("disabled",dis);
                            repwd = false;
                            return;
                        }
                        repwd = val;
                        repwdTip.hide();
                        if(pwd && repwd){
                            putPwd.attr("disabled",false);
                        }
                    }).bind("keyup",function(){
                        if($.trim(this.value) !== ""){
                            repwd = $.trim(this.value);
                            if(pwd && repwd){
                                putPwd.attr("disabled",false);
                            }
                        }
                        repwdTip.hide();
                    });
                    /*下一步按钮*/
                    putPwd.bind("click",function(){
                        pwdInput.trigger("blur");
                        repwdInput.trigger("blur");

                        var err = '';
                        // 新建用户或者输入了密码时检查密码
                        if (pwd.length < 8){
                            err += LANG("密码长度不能小于8位。")+'<br>';
                        }
                        if (pwd != '' && pwd == $('#Users_email').val()){
                            err += LANG("密码不能与用户账号相同。")+'<br>'; 
                        }
                        var type = 0;
                        if (/[a-z]/.test(pwd)) type++;
                        if (/[A-Z]/.test(pwd)) type++;
                        if (/[0-9]/.test(pwd)) type++;
                        if (/[^a-zA-Z0-9]/.test(pwd)) type++;
                        if (type < 3){
                            err += LANG('密码必须同时包含大写字母、小写字母、数字和特殊字符四类要素中的任意三种。');
                        }
                        if (err != ''){
                            pwdTip.html(err).css('display', 'block');
                            return;
                        }
                        if(pwd === repwd){
                            fn(checksumValue,pwd)
                        }else{
                            repwdTip.css('display', 'block');
                            repwdTip.html("请再次输入新的密码");
                        }
                    });
                };
                setpasswordTest("#checksum","#LoginForm_password","#LoginForm_repassword","#LoginForm_submit",false,function(checksum,pwd){
                    $.ajax({
                        url:"/user/setpassword",
                        data: {checksum:checksum, passwd:pwd},
                        dataType:"json",
                        type:"GET",
                        success:function(re){
                            //$(".no_allow").html(re.message);
                            jumpTo("保存成功，请您重新登录","/login.html");
                        },
                       error:function(re){
                            var errorTxt = re.responseText;
                            errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
                            errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));
                            errorTxt = errorTxt.replace("<p>","");
                            if(errorTxt){
                               alert(LANG("当前是演示网站,不能进行编辑操作.请先登录!"));
                            }else{
                               alert(LANG("服务器正忙，删除失败，请稍后再试"));
                            }

                       }
                    });
                });
                Clicki.Balance();
            });
            this.crumbs(LANG("修改密码"));
        },

        adminAction:function(action, param){
            var url = Clicki.NavView.adminSetEls.find('a:first').attr('href');
            if (url && action == 'site' && url != '#/admin/site'){
                Clicki.Router.navigate(url,true);
                return;
            }

            var router = this;
            require.async(['../modules/admin'], function(admin){
                switch (action){
                    case 'site': action = 'siteList'; break;
                    case 'addsite': action = 'addSite'; break;
                    case 'editsite': action = 'addSite'; break;
                    case 'user': action = 'userList'; break;
                    case 'editUser': action = 'addUser'; break;
                    case 'role': action = 'roleList'; break;
                    case 'addrole': action = 'addRole'; break;
                    case 'operationlog': action = 'operationLog'; break;
                    case 'manageprocess': action = 'manageProcess'; break;
                    //出错页面
                    case 'error': action = 'error'; break;
                }

                if (admin && admin[action]){
                    admin[action](router, param || '');
                }else {
                    alert(LANG('无效的操作'));
                }
            });
        },
        /////////////////////////算法平台///////////////////////////
        algorithmAction:function(action, param){
            var url = Clicki.NavView.algorithmSetEls.find('a:first').attr('href');
            if (url && action == 'scene' && url != '#/algorithm/scene'){
                Clicki.Router.navigate(url,true);
                return;
            }
            
            var router = this;
            require.async(['../modules/algorithm'], function(algorithm){
                switch (action){
                    //算法设置
                    case 'algorithmlist': action = 'algorithmlist'; break;
                    //算法训练
                    case 'training': action = 'training'; break;
                    //作业管理
                    case 'manageprocess': action = 'manageprocess'; break;
                    //应用场景
                    case 'scene': action = 'scene'; break;
                    //过滤植入
                    case 'resulthandle': action = 'managerfilter'; break;
                    //新添过滤植入
                    case 'addNewJGKZ': action = 'addNewJGKZf'; break;
                    //手动干预
                    case 'manualrecomm': action = 'manualrecomm'; break;
                    //推荐结果预览
                    case 'previewresult': action = 'previewresult'; break;
                    //推荐反馈
                    case 'feedback': action = 'feedback'; break;
                    //热门微博
                    case 'hotweibo': action = 'hotweibo'; break;
                    //热门用户
                    case 'hotuser': action = 'hotuser'; break;
                    //热门话题
                    case 'hottopic': action = 'hottopic'; break;
                    //潜力微博
                    case 'potential': action = 'potential'; break;
                    //出错页面
                    case 'error': action = 'error'; break;
                }
                if (algorithm && algorithm[action]){
                    algorithm[action](router, param || '');
                }else {
                    alert(LANG('无效的操作'));
                }
            });
        },
        /////////////////////////////////////////////////////
        siteAction:function(action, param){
            var url = Clicki.NavView.setSiteEls.find('a:first').attr('href');
            if (url && action == 'editsite' && url != '#/site/editsite'){
                Clicki.Router.navigate(url,true);
                return;
            }

            var router = this;
            require.async(['../modules/site'], function(mod){
                if (mod && mod[action]){
                    mod.setEnv(simpleFormTest, initTabContent, jumpAddSite, nowActive);
                    mod[action].call(router, param || '');
                }else {
                    alert(LANG('无效的操作'));
                }
            });
        },
        

        /*获取右侧内容*/
        getContentHtml:function(fn,parm){
            //Clicki.NavView.contentBox.html("<div id=\"appMarker\" class=\"theMarker\" style=\"height:100%;\"></div>");
            var me = this;
            $.ajax({
               url:Clicki.NavView.activeUrl,
               data:parm?parm:{},
                dataType:"html",
                success:function(re){
                    // 权限过滤, 不回调后续操作
                    if (re === false) return;
                    if(!$.isEmptyObject(Clicki.manager.appCache)){
                        Clicki.manager.destroy();
                        /*尝试清除当前正在跑的计时器*/
                        clearTimeout(setTimeout(function(){})-1);
                    }
                    Clicki.NavView.contentBox.find("*").unbind();
                    Clicki.NavView.contentBox.html(re);
                    if(typeof fn ==="function"){
                        fn();
                    }
                    if(me.beDo){
                        me.beDo.run();
                    }
                },
               error:function(re){
                   /*var errorTxt = re.responseText;
                   errorTxt = errorTxt.substr(errorTxt.indexOf("<p>"));
                   errorTxt = errorTxt.substring(0,errorTxt.indexOf("("));*/
                    Clicki.NavView.contentBox.find("*").unbind();
                    Clicki.NavView.contentBox.find("#functionTitle").html(LANG("出错了"));
                    //Clicki.NavView.contentBox.find("#showArea").html(LANG(errorTxt));
               }
            });
        },
        /*刷新页面自动设置获取页面所需的参数，左侧导航的相关设定*/
        testIfAfterF5:function(id){
            if(window.location.hash !== ""){
                var href = '';
                if(site_id === -1){
                    if (jumpAddSite()) return;
                    // href = "#/admin/addSite";
                }else{
                    href = window.location.hash;
                }
                if(id){
                    Clicki.NavView.setActBtn(id);
                }else{
                    if(Clicki.NavView && Clicki.NavView.els){
                        Clicki.NavView.els.removeClass("act");
                    }
                }
                href = href.replace(/^(\/)?#/g,"");
                href = href.indexOf("#")!==-1 && href.substr(0,href.indexOf("/#")) || href;
                href = href.charAt(0) !== "/" && "/"+href || href;
                href.match(/\/do:/) && (href = href.split("/do:")[0]);
                Clicki.NavView.activeUrl = href+"?out=html";
            }
        }
    }
});