
define(function(require){
    /* preview manager */
    var PREVIEW_ELE_ID = 'clicki_widget_preview';
    var $ = require('jquery');

    function widgetManager(){
        this.previewEle = document.getElementById(PREVIEW_ELE_ID);
        this._tempApp = null;
        this.widgetId = '-1';
    };
    widgetManager.prototype = {
        ensurePreviewEle: function(){
            if(!this.previewEle){
                this.previewEle = document.getElementById(PREVIEW_ELE_ID);
            }
        },
        updateWidgetInfo: function(info, clearCache){
            if(this.previewEle && this.previewEle.WIDGET_ID){
                $(this.previewEle).remove();
                delete this.previewEle;
            }
            $("#style_" + PREVIEW_ELE_ID).remove();
            this.widgetId = info.widgetId;
            this.appId = info.appId;
            this.APP_PATH = info.APP_PATH || ("/widget/apps/app_" + this.appId);
            this.setting = info.setting;
            this.appName = info.appName;
            if(clearCache){
                this.previewEle && (this.previewEle.WIDGET_ID = '');
            }
        },
        preview: function(setting){
            this.ensurePreviewEle();
            var that = this,
                widget = {
                    widget_id: this.widgetId,
                    setting: setting
                };
            widget.APP_PATH = this.APP_PATH;
            widget.RES_PATH = this.APP_PATH + '/res';
            if(this.widgetId != this.previewEle.WIDGET_ID){
                this.previewEle.WIDGET_ID = this.widgetId;
                this.previewEle.innerHTML = '';
                this.previewEle.style.csstext="";
                this.previewEle.removeattribute && this.previewEle.removeattribute('style');
                Clicki.use = Clicki.use || seajs.use;
                Clicki.define = Clicki.define || window.define;
                Clicki.use(this.APP_PATH + '/main', 
                    (function(widget, position_id){
                        return function(app){
                            app && (that._tempApp = app.init(widget, position_id) );
                        }
                    })(widget, this.previewEle.id)
                );
            }else{
                this._tempApp.refresh(widget.setting);
            }

            Clicki.Balance && Clicki.Balance();
        },
        getWidgetSetting: function(){
            return this.setting;
        },
        saveWidgetSetting: function(setting, callback){
            var t = $.trim($("#theWidgetTitles").val());
            if(!t){ alert(LANG("请填写应用别名")); return; }
            var postData = {
                title: t,
                setting: setting
            };
            if(this.widgetId==='create'){
                postData.app_id = this.appId;
                postData.site_id = site_id;
            }
            var that = this;
            $.ajax({
                url: '/setting/widget/save?wid=' + this.widgetId,
                type: 'post',
                data: postData,
                dataType: 'json',
                success: function(r){
                    if(r.success){
                        if(that.widgetId==='create'){
                            if(r.wid > 0){
                                $("#copyCodeText").val('<div id="clicki_widget_' + r.wid + '" ></div>');
                                $.fancybox({
                                    href: '#theWidgetSettingGetCodeBox',
                                    scrolling:"no",
                                    onClosed: function(){
                                        Clicki.Router.navigate("#/setting/widget/detail/"+r.wid,true);
                                    }
                                });
                            }else{
                                alert(LANG('很抱歉，添加应用失败，请重试.'));
                                r.success = false;
                                callback && callback(r);
                            }
                        }else{
                            alert(LANG('保存成功'));
                            callback && callback(r);
                        }
                    }else{
                        alert(r.errormsg || LANG('很抱歉，服务器出错。'));
                        callback && callback(r);
                    }
                },
                error: function(){
                    alert(LANG('很抱歉，发生未知错误。'));
                    callback && callback({success:false, errorMsg:'UNKNOW ERROR'});
                }
            });
        }
    };


    window.Clicki = window.Clicki || {};
    Clicki.WidgetManager = new widgetManager();

    return Clicki.WidgetManager;
});

